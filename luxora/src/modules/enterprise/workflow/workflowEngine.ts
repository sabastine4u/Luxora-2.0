// src/modules/enterprise/workflow/workflowEngine.ts
import type { EnterpriseEvent } from '../events/types';
import { ENTERPRISE_EVENTS } from '../events/registry';
import { publishEvent } from '../events/publishEvent';
import { getWorkflowHandler } from './workflowRegistry';
import type { WorkflowResult } from './workflowTypes';

/**
 * Validates, resolves, and executes the workflow for an incoming enterprise event.
 */
export async function executeWorkflow(event: EnterpriseEvent<unknown>): Promise<void> {
  if (!event || !event.type) {
    console.error('[WorkflowEngine] Invalid event received', event);
    return;
  }

  const handler = getWorkflowHandler(event.type);
  if (!handler) {
    // Not all events have workflows; safely ignore unmapped events.
    return;
  }

  // Publish workflow.started event
  publishEvent(ENTERPRISE_EVENTS.WORKFLOW_STARTED, {
    eventId: event.id,
    workflowName: handler.name,
    timestamp: new Date().toISOString()
  });

  try {
    // Execute handler logic
    const result: WorkflowResult = await handler.handle(event);

    // Map the returned handler status to a system workflow event
    if (result.status === 'completed') {
      publishEvent(ENTERPRISE_EVENTS.WORKFLOW_COMPLETED, {
        eventId: event.id,
        workflowName: handler.name,
        message: result.message,
        metadata: result.metadata
      });
    } else if (result.status === 'pending') {
      publishEvent(ENTERPRISE_EVENTS.WORKFLOW_PENDING, {
        eventId: event.id,
        workflowName: handler.name,
        message: result.message,
        metadata: result.metadata
      });
    } else if (result.status === 'approved') {
      publishEvent(ENTERPRISE_EVENTS.WORKFLOW_APPROVAL_GRANTED, {
        eventId: event.id,
        workflowName: handler.name,
        message: result.message,
        metadata: result.metadata
      });
    } else if (result.status === 'rejected') {
      publishEvent(ENTERPRISE_EVENTS.WORKFLOW_APPROVAL_REJECTED, {
        eventId: event.id,
        workflowName: handler.name,
        message: result.message,
        metadata: result.metadata
      });
    } else if (result.status === 'failed') {
      publishEvent(ENTERPRISE_EVENTS.WORKFLOW_FAILED, {
        eventId: event.id,
        workflowName: handler.name,
        message: result.message,
        metadata: result.metadata
      });
    }

  } catch (error) {
    console.error(`[WorkflowEngine] Workflow execution failed for ${handler.name}`, error);
    publishEvent(ENTERPRISE_EVENTS.WORKFLOW_FAILED, {
      eventId: event.id,
      workflowName: handler.name,
      message: error instanceof Error ? error.message : 'Unknown execution error',
    });
  }
}

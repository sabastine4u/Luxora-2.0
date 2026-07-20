// src/modules/enterprise/workflow/WorkflowCenter.ts
import { enterpriseEventBus } from '../events/eventBus';
import { executeWorkflow } from './workflowEngine';
import { ENTERPRISE_EVENTS } from '../events/registry';

class WorkflowCenterController {
  private isInitialized = false;

  public initialize() {
    if (this.isInitialized) return;

    // Listen to all events that might trigger a workflow
    // In a real backend, we'd listen to the entire bus or use wildcards.
    // For this frontend implementation, we will subscribe to the specific incoming events.

    const mappedEvents = [
      ENTERPRISE_EVENTS.PROCUREMENT_PURCHASE_REQUEST_CREATED,
      ENTERPRISE_EVENTS.FINANCE_REFUND_REQUESTED,
      ENTERPRISE_EVENTS.PROPERTY_MAINTENANCE_CREATED,
      ENTERPRISE_EVENTS.MANAGEMENT_PROPERTY_VERIFIED,
      ENTERPRISE_EVENTS.SERVICES_JOB_COMPLETED,
      ENTERPRISE_EVENTS.INTELLIGENCE_RISK_DETECTED,
    ];

    mappedEvents.forEach(eventType => {
      enterpriseEventBus.subscribe(eventType, (event) => {
        executeWorkflow(event);
      });
    });

    console.log('[WorkflowCenter] Orchestration layer initialized.');
    this.isInitialized = true;
  }
}

export const workflowCenter = new WorkflowCenterController();

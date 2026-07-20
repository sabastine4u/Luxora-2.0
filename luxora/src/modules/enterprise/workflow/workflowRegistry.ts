// src/modules/enterprise/workflow/workflowRegistry.ts
import { ENTERPRISE_EVENTS } from '../events/registry';
import type { WorkflowHandler } from './workflowTypes';

import { purchaseApprovalHandler } from './handlers/purchaseApproval';
import { refundApprovalHandler } from './handlers/refundApproval';
import { propertyApprovalHandler } from './handlers/propertyApproval';
import { maintenanceApprovalHandler } from './handlers/maintenanceApproval';
import { riskReviewHandler } from './handlers/riskReview';
import { jobCompletionHandler } from './handlers/jobCompletion';

export const WORKFLOW_REGISTRY: Record<string, WorkflowHandler> = {
  [ENTERPRISE_EVENTS.PROCUREMENT_PURCHASE_REQUEST_CREATED]: purchaseApprovalHandler,
  [ENTERPRISE_EVENTS.FINANCE_REFUND_REQUESTED]: refundApprovalHandler,
  [ENTERPRISE_EVENTS.PROPERTY_MAINTENANCE_CREATED]: maintenanceApprovalHandler,
  [ENTERPRISE_EVENTS.MANAGEMENT_PROPERTY_VERIFIED]: propertyApprovalHandler,
  [ENTERPRISE_EVENTS.SERVICES_JOB_COMPLETED]: jobCompletionHandler,
  [ENTERPRISE_EVENTS.INTELLIGENCE_RISK_DETECTED]: riskReviewHandler,
};

/**
 * Resolves the appropriate workflow handler for a given event type.
 */
export function getWorkflowHandler(eventType: string): WorkflowHandler | undefined {
  return WORKFLOW_REGISTRY[eventType];
}

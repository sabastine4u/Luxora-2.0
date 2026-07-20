// src/modules/enterprise/reporting/reportingRegistry.ts
import { ENTERPRISE_EVENTS } from '../events/registry';
import type { ReportingHandler } from './reportingTypes';

import { propertyReportingHandler } from './handlers/propertyReporting';
import { procurementReportingHandler } from './handlers/procurementReporting';
import { financeReportingHandler } from './handlers/financeReporting';
import { workflowReportingHandler } from './handlers/workflowReporting';
import { servicesReportingHandler } from './handlers/servicesReporting';
import { managementReportingHandler } from './handlers/managementReporting';

export const REPORTING_REGISTRY: Record<string, ReportingHandler> = {
  // Property Lifecycle Events
  [ENTERPRISE_EVENTS.PROPERTY_SUBMITTED]: propertyReportingHandler,
  [ENTERPRISE_EVENTS.PROPERTY_LISTING_PUBLISHED]: propertyReportingHandler,
  [ENTERPRISE_EVENTS.AGENCY_AGENT_ASSIGNED]: propertyReportingHandler,

  // Domain Events
  [ENTERPRISE_EVENTS.PROCUREMENT_PURCHASE_REQUEST_CREATED]: procurementReportingHandler,
  [ENTERPRISE_EVENTS.FINANCE_REFUND_REQUESTED]: financeReportingHandler,
  [ENTERPRISE_EVENTS.SERVICES_JOB_COMPLETED]: servicesReportingHandler,
  [ENTERPRISE_EVENTS.MANAGEMENT_PROPERTY_VERIFIED]: managementReportingHandler,

  // Workflow Events
  [ENTERPRISE_EVENTS.WORKFLOW_STARTED]: workflowReportingHandler,
  [ENTERPRISE_EVENTS.WORKFLOW_COMPLETED]: workflowReportingHandler,
  [ENTERPRISE_EVENTS.WORKFLOW_FAILED]: workflowReportingHandler,
};

/**
 * Resolves the appropriate reporting handler for a given event type.
 */
export function getReportingHandler(eventType: string): ReportingHandler | undefined {
  return REPORTING_REGISTRY[eventType];
}

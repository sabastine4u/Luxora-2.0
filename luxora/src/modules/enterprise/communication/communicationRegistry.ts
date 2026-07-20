// src/modules/enterprise/communication/communicationRegistry.ts
import { ENTERPRISE_EVENTS } from '../events/registry';
import type { CommunicationHandler } from './communicationTypes';

import { propertyCommunicationHandler } from './handlers/propertyCommunication';
import { procurementCommunicationHandler } from './handlers/procurementCommunication';
import { financeCommunicationHandler } from './handlers/financeCommunication';
import { workflowCommunicationHandler } from './handlers/workflowCommunication';
import { servicesCommunicationHandler } from './handlers/servicesCommunication';
import { managementCommunicationHandler } from './handlers/managementCommunication';

export const COMMUNICATION_REGISTRY: Record<string, CommunicationHandler> = {
  // Property Lifecycle Events
  [ENTERPRISE_EVENTS.PROPERTY_SUBMITTED]: propertyCommunicationHandler,
  [ENTERPRISE_EVENTS.AGENCY_PROPERTY_RECEIVED]: propertyCommunicationHandler,
  [ENTERPRISE_EVENTS.AGENCY_AGENT_ASSIGNED]: propertyCommunicationHandler,
  [ENTERPRISE_EVENTS.PROPERTY_REVIEW_STARTED]: propertyCommunicationHandler,
  [ENTERPRISE_EVENTS.PROPERTY_REVIEW_COMPLETED]: propertyCommunicationHandler,
  [ENTERPRISE_EVENTS.PROPERTY_LISTING_REJECTED]: propertyCommunicationHandler,
  [ENTERPRISE_EVENTS.PROPERTY_LISTING_PUBLISHED]: propertyCommunicationHandler,

  // Domain Events
  [ENTERPRISE_EVENTS.PROCUREMENT_PURCHASE_REQUEST_CREATED]: procurementCommunicationHandler,
  [ENTERPRISE_EVENTS.FINANCE_REFUND_REQUESTED]: financeCommunicationHandler,
  [ENTERPRISE_EVENTS.SERVICES_JOB_CREATED]: servicesCommunicationHandler,
  [ENTERPRISE_EVENTS.SERVICES_JOB_COMPLETED]: servicesCommunicationHandler,
  [ENTERPRISE_EVENTS.MANAGEMENT_PROPERTY_VERIFIED]: managementCommunicationHandler,

  // Workflow Events
  [ENTERPRISE_EVENTS.WORKFLOW_STARTED]: workflowCommunicationHandler,
  [ENTERPRISE_EVENTS.WORKFLOW_PENDING]: workflowCommunicationHandler,
  [ENTERPRISE_EVENTS.WORKFLOW_COMPLETED]: workflowCommunicationHandler,
};

/**
 * Resolves the appropriate communication handler for a given event type.
 */
export function getCommunicationHandler(eventType: string): CommunicationHandler | undefined {
  return COMMUNICATION_REGISTRY[eventType];
}

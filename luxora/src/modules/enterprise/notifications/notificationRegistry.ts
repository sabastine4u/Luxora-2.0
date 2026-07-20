// src/modules/enterprise/notifications/notificationRegistry.ts
import { ENTERPRISE_EVENTS } from '../events/registry';
import type { NotificationHandler } from './notificationTypes';

import { propertyNotificationsHandler } from './handlers/propertyNotifications';
import { procurementNotificationsHandler } from './handlers/procurementNotifications';
import { financeNotificationsHandler } from './handlers/financeNotifications';
import { workflowNotificationsHandler } from './handlers/workflowNotifications';
import { servicesNotificationsHandler } from './handlers/servicesNotifications';
import { managementNotificationsHandler } from './handlers/managementNotifications';

export const NOTIFICATION_REGISTRY: Record<string, NotificationHandler> = {
  // Property Lifecycle Events
  [ENTERPRISE_EVENTS.PROPERTY_SUBMITTED]: propertyNotificationsHandler,
  [ENTERPRISE_EVENTS.AGENCY_PROPERTY_RECEIVED]: propertyNotificationsHandler,
  [ENTERPRISE_EVENTS.AGENCY_AGENT_ASSIGNED]: propertyNotificationsHandler,
  [ENTERPRISE_EVENTS.PROPERTY_REVIEW_STARTED]: propertyNotificationsHandler,
  [ENTERPRISE_EVENTS.PROPERTY_REVIEW_COMPLETED]: propertyNotificationsHandler,
  [ENTERPRISE_EVENTS.PROPERTY_READY_FOR_LISTING]: propertyNotificationsHandler,
  [ENTERPRISE_EVENTS.PROPERTY_LISTING_PUBLISHED]: propertyNotificationsHandler,
  [ENTERPRISE_EVENTS.PROPERTY_LISTING_REJECTED]: propertyNotificationsHandler,

  // Domain Events
  [ENTERPRISE_EVENTS.PROCUREMENT_PURCHASE_REQUEST_CREATED]: procurementNotificationsHandler,
  [ENTERPRISE_EVENTS.FINANCE_REFUND_REQUESTED]: financeNotificationsHandler,
  [ENTERPRISE_EVENTS.SERVICES_JOB_COMPLETED]: servicesNotificationsHandler,
  [ENTERPRISE_EVENTS.MANAGEMENT_PROPERTY_VERIFIED]: managementNotificationsHandler,

  // Workflow Events
  [ENTERPRISE_EVENTS.WORKFLOW_STARTED]: workflowNotificationsHandler,
  [ENTERPRISE_EVENTS.WORKFLOW_PENDING]: workflowNotificationsHandler,
  [ENTERPRISE_EVENTS.WORKFLOW_COMPLETED]: workflowNotificationsHandler,
  [ENTERPRISE_EVENTS.WORKFLOW_APPROVAL_GRANTED]: workflowNotificationsHandler,
  [ENTERPRISE_EVENTS.WORKFLOW_APPROVAL_REJECTED]: workflowNotificationsHandler,
  [ENTERPRISE_EVENTS.WORKFLOW_FAILED]: workflowNotificationsHandler,
};

/**
 * Resolves the appropriate notification handler for a given event type.
 */
export function getNotificationHandler(eventType: string): NotificationHandler | undefined {
  return NOTIFICATION_REGISTRY[eventType];
}

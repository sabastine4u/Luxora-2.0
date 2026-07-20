// src/modules/enterprise/notifications/NotificationCenter.ts
import { enterpriseEventBus } from '../events/eventBus';
import { processNotification } from './notificationEngine';
import { ENTERPRISE_EVENTS } from '../events/registry';

class NotificationCenterController {
  private isInitialized = false;

  public initialize() {
    if (this.isInitialized) return;

    // Subscribing explicitly to known notification-triggering events for this phase.
    // In a fully dynamic backend this might wildcard match `*` or use a message queue.

    const mappedEvents = [
      ENTERPRISE_EVENTS.PROPERTY_SUBMITTED,
      ENTERPRISE_EVENTS.AGENCY_PROPERTY_RECEIVED,
      ENTERPRISE_EVENTS.AGENCY_AGENT_ASSIGNED,
      ENTERPRISE_EVENTS.PROPERTY_REVIEW_STARTED,
      ENTERPRISE_EVENTS.PROPERTY_REVIEW_COMPLETED,
      ENTERPRISE_EVENTS.PROPERTY_READY_FOR_LISTING,
      ENTERPRISE_EVENTS.PROPERTY_LISTING_PUBLISHED,
      ENTERPRISE_EVENTS.PROPERTY_LISTING_REJECTED,

      ENTERPRISE_EVENTS.PROCUREMENT_PURCHASE_REQUEST_CREATED,
      ENTERPRISE_EVENTS.FINANCE_REFUND_REQUESTED,
      ENTERPRISE_EVENTS.SERVICES_JOB_COMPLETED,
      ENTERPRISE_EVENTS.MANAGEMENT_PROPERTY_VERIFIED,

      ENTERPRISE_EVENTS.WORKFLOW_STARTED,
      ENTERPRISE_EVENTS.WORKFLOW_PENDING,
      ENTERPRISE_EVENTS.WORKFLOW_COMPLETED,
      ENTERPRISE_EVENTS.WORKFLOW_APPROVAL_GRANTED,
      ENTERPRISE_EVENTS.WORKFLOW_APPROVAL_REJECTED,
      ENTERPRISE_EVENTS.WORKFLOW_FAILED,
    ];

    mappedEvents.forEach(eventType => {
      enterpriseEventBus.subscribe(eventType, (event) => {
        processNotification(event);
      });
    });

    console.log('[NotificationCenter] Orchestration layer initialized.');
    this.isInitialized = true;
  }
}

export const notificationCenter = new NotificationCenterController();

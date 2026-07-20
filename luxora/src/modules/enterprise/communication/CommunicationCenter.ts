// src/modules/enterprise/communication/CommunicationCenter.ts
import { enterpriseEventBus } from '../events/eventBus';
import { processCommunication } from './communicationEngine';
import { ENTERPRISE_EVENTS } from '../events/registry';

class CommunicationCenterController {
  private isInitialized = false;

  public initialize() {
    if (this.isInitialized) return;

    // Subscribing explicitly to known communication-triggering events for this phase.
    const mappedEvents = [
      ENTERPRISE_EVENTS.PROPERTY_SUBMITTED,
      ENTERPRISE_EVENTS.AGENCY_PROPERTY_RECEIVED,
      ENTERPRISE_EVENTS.AGENCY_AGENT_ASSIGNED,
      ENTERPRISE_EVENTS.PROPERTY_REVIEW_STARTED,
      ENTERPRISE_EVENTS.PROPERTY_REVIEW_COMPLETED,
      ENTERPRISE_EVENTS.PROPERTY_LISTING_REJECTED,
      ENTERPRISE_EVENTS.PROPERTY_LISTING_PUBLISHED,

      ENTERPRISE_EVENTS.PROCUREMENT_PURCHASE_REQUEST_CREATED,
      ENTERPRISE_EVENTS.FINANCE_REFUND_REQUESTED,
      ENTERPRISE_EVENTS.SERVICES_JOB_CREATED,
      ENTERPRISE_EVENTS.SERVICES_JOB_COMPLETED,
      ENTERPRISE_EVENTS.MANAGEMENT_PROPERTY_VERIFIED,

      ENTERPRISE_EVENTS.WORKFLOW_STARTED,
      ENTERPRISE_EVENTS.WORKFLOW_PENDING,
      ENTERPRISE_EVENTS.WORKFLOW_COMPLETED,
    ];

    mappedEvents.forEach(eventType => {
      enterpriseEventBus.subscribe(eventType, (event) => {
        processCommunication(event);
      });
    });

    console.log('[CommunicationCenter] Collaboration engine initialized.');
    this.isInitialized = true;
  }
}

export const communicationCenter = new CommunicationCenterController();

// src/modules/enterprise/reporting/ReportingCenter.ts
import { enterpriseEventBus } from '../events/eventBus';
import { processReportingEvent } from './reportingEngine';
import { ENTERPRISE_EVENTS } from '../events/registry';

class ReportingCenterController {
  private isInitialized = false;

  public initialize() {
    if (this.isInitialized) return;

    // Subscribing explicitly to known reporting-triggering events for this phase.
    const mappedEvents = [
      ENTERPRISE_EVENTS.PROPERTY_SUBMITTED,
      ENTERPRISE_EVENTS.PROPERTY_LISTING_PUBLISHED,
      ENTERPRISE_EVENTS.AGENCY_AGENT_ASSIGNED,

      ENTERPRISE_EVENTS.PROCUREMENT_PURCHASE_REQUEST_CREATED,
      ENTERPRISE_EVENTS.FINANCE_REFUND_REQUESTED,
      ENTERPRISE_EVENTS.SERVICES_JOB_COMPLETED,
      ENTERPRISE_EVENTS.MANAGEMENT_PROPERTY_VERIFIED,

      ENTERPRISE_EVENTS.WORKFLOW_STARTED,
      ENTERPRISE_EVENTS.WORKFLOW_COMPLETED,
      ENTERPRISE_EVENTS.WORKFLOW_FAILED,
    ];

    mappedEvents.forEach(eventType => {
      enterpriseEventBus.subscribe(eventType, (event) => {
        processReportingEvent(event);
      });
    });

    console.log('[ReportingCenter] Reporting and analytics engine initialized.');
    this.isInitialized = true;
  }
}

export const reportingCenter = new ReportingCenterController();

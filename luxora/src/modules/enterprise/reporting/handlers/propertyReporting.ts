// src/modules/enterprise/reporting/handlers/propertyReporting.ts
import type { ReportingHandler, MetricUpdate } from '../reportingTypes';
import { ENTERPRISE_EVENTS } from '../../events/registry';

export const propertyReportingHandler: ReportingHandler = {
  name: 'Property Reporting',
  handle: (event): MetricUpdate[] | null => {
    const timestamp = new Date();
    
    switch (event.type) {
      case ENTERPRISE_EVENTS.PROPERTY_SUBMITTED:
        return [
          {
            category: 'property',
            metricName: 'Total Properties',
            value: 1,
            operation: 'increment',
            timestamp
          },
          {
            category: 'property',
            metricName: 'Submitted',
            value: 1,
            operation: 'increment',
            timestamp
          }
        ];
      case ENTERPRISE_EVENTS.PROPERTY_LISTING_PUBLISHED:
        return [
          {
            category: 'property',
            metricName: 'Published',
            value: 1,
            operation: 'increment',
            timestamp
          }
        ];
      case ENTERPRISE_EVENTS.AGENCY_AGENT_ASSIGNED:
        return [
          {
            category: 'agency',
            metricName: 'Assignment Rate',
            value: 1,
            operation: 'increment', // In reality, this would be a calculated ratio
            timestamp
          }
        ];
      default:
        return null;
    }
  }
};

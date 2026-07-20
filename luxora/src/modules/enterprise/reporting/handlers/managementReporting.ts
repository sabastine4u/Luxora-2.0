// src/modules/enterprise/reporting/handlers/managementReporting.ts
import type { ReportingHandler, MetricUpdate } from '../reportingTypes';
import { ENTERPRISE_EVENTS } from '../../events/registry';

export const managementReportingHandler: ReportingHandler = {
  name: 'Management Reporting',
  handle: (event): MetricUpdate[] | null => {
    if (event.type === ENTERPRISE_EVENTS.MANAGEMENT_PROPERTY_VERIFIED) {
      return [
        {
          category: 'property',
          metricName: 'Approved',
          value: 1,
          operation: 'increment',
          timestamp: new Date()
        }
      ];
    }
    return null;
  }
};

// src/modules/enterprise/reporting/handlers/servicesReporting.ts
import type { ReportingHandler, MetricUpdate } from '../reportingTypes';
import { ENTERPRISE_EVENTS } from '../../events/registry';

export const servicesReportingHandler: ReportingHandler = {
  name: 'Services Reporting',
  handle: (event): MetricUpdate[] | null => {
    if (event.type === ENTERPRISE_EVENTS.SERVICES_JOB_COMPLETED) {
      return [
        {
          category: 'services',
          metricName: 'Jobs Completed',
          value: 1,
          operation: 'increment',
          timestamp: new Date()
        }
      ];
    }
    return null;
  }
};

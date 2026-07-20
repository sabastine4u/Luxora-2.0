// src/modules/enterprise/reporting/handlers/procurementReporting.ts
import type { ReportingHandler, MetricUpdate } from '../reportingTypes';
import { ENTERPRISE_EVENTS } from '../../events/registry';

export const procurementReportingHandler: ReportingHandler = {
  name: 'Procurement Reporting',
  handle: (event): MetricUpdate[] | null => {
    if (event.type === ENTERPRISE_EVENTS.PROCUREMENT_PURCHASE_REQUEST_CREATED) {
      return [
        {
          category: 'procurement',
          metricName: 'Purchase Requests',
          value: 1,
          operation: 'increment',
          timestamp: new Date()
        }
      ];
    }
    return null;
  }
};

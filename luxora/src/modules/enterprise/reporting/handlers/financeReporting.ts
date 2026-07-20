// src/modules/enterprise/reporting/handlers/financeReporting.ts
import type { ReportingHandler, MetricUpdate } from '../reportingTypes';
import { ENTERPRISE_EVENTS } from '../../events/registry';

export const financeReportingHandler: ReportingHandler = {
  name: 'Finance Reporting',
  handle: (event): MetricUpdate[] | null => {
    if (event.type === ENTERPRISE_EVENTS.FINANCE_REFUND_REQUESTED) {
      return [
        {
          category: 'finance',
          metricName: 'Refunds',
          value: 1,
          operation: 'increment',
          timestamp: new Date()
        }
      ];
    }
    return null;
  }
};

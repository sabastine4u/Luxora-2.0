// src/modules/enterprise/reporting/handlers/workflowReporting.ts
import type { ReportingHandler, MetricUpdate } from '../reportingTypes';
import { ENTERPRISE_EVENTS } from '../../events/registry';

export const workflowReportingHandler: ReportingHandler = {
  name: 'Workflow Reporting',
  handle: (event): MetricUpdate[] | null => {
    const timestamp = new Date();

    switch (event.type) {
      case ENTERPRISE_EVENTS.WORKFLOW_STARTED:
        return [
          {
            category: 'workflow',
            metricName: 'Active Workflows',
            value: 1,
            operation: 'increment',
            timestamp
          }
        ];
      case ENTERPRISE_EVENTS.WORKFLOW_COMPLETED:
        return [
          {
            category: 'workflow',
            metricName: 'Completed Workflows',
            value: 1,
            operation: 'increment',
            timestamp
          },
          {
            category: 'workflow',
            metricName: 'Active Workflows',
            value: 1,
            operation: 'decrement',
            timestamp
          }
        ];
      case ENTERPRISE_EVENTS.WORKFLOW_FAILED:
        return [
          {
            category: 'workflow',
            metricName: 'Failed Workflows',
            value: 1,
            operation: 'increment',
            timestamp
          },
          {
            category: 'workflow',
            metricName: 'Active Workflows',
            value: 1,
            operation: 'decrement',
            timestamp
          }
        ];
      default:
        return null;
    }
  }
};

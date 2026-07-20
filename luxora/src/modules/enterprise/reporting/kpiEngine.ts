// src/modules/enterprise/reporting/kpiEngine.ts
import { metricsStore } from './metricsStore';
import type { MetricUpdate } from './reportingTypes';

/**
 * Responsible for computing and storing KPI updates.
 */
export function processKPIUpdate(update: MetricUpdate): void {
  const currentKPI = metricsStore.getKPI(update.metricName);
  let newValue = currentKPI ? currentKPI.value : 0;

  switch (update.operation) {
    case 'increment':
      newValue += update.value;
      break;
    case 'decrement':
      newValue -= update.value;
      break;
    case 'set':
      newValue = update.value;
      break;
  }

  metricsStore.updateKPI(update.metricName, update.category, newValue);
}

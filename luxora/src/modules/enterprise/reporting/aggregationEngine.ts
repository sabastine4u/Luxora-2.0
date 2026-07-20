// src/modules/enterprise/reporting/aggregationEngine.ts
import type { MetricUpdate } from './reportingTypes';
import { processKPIUpdate } from './kpiEngine';
import { processTrendUpdate } from './trendEngine';

/**
 * Aggregates updates and dispatches them to specific analytic engines.
 */
export function aggregateMetrics(updates: MetricUpdate | MetricUpdate[]): void {
  const updateArray = Array.isArray(updates) ? updates : [updates];

  updateArray.forEach(update => {
    // 1. Update the static KPI snapshot
    processKPIUpdate(update);
    
    // 2. Append to the time-series trend history
    processTrendUpdate(update);
  });
}

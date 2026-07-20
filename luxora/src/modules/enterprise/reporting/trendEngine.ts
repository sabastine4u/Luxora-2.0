// src/modules/enterprise/reporting/trendEngine.ts
import { metricsStore } from './metricsStore';
import type { MetricUpdate, TrendData, TimePeriod } from './reportingTypes';

/**
 * Responsible for recording and extracting time-series trend data.
 */
export function processTrendUpdate(update: MetricUpdate): void {
  const currentKPI = metricsStore.getKPI(update.metricName);
  const value = currentKPI ? currentKPI.value : update.value;

  metricsStore.recordTimeSeriesData(update.metricName, value);
}

export function getTrendAnalysis(metricName: string, period: TimePeriod): TrendData {
  const dataPoints = metricsStore.getTimeSeriesData(metricName);
  
  // In a real implementation, data points would be aggregated by the requested period (daily, weekly, etc.)
  // We return raw data points for the frontend to render currently.
  return {
    metricName,
    period,
    dataPoints
  };
}

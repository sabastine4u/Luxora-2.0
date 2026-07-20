// src/modules/enterprise/reporting/reportingTypes.ts
import type { EnterpriseEvent } from '../events/types';

export type MetricCategory = 'property' | 'agency' | 'workflow' | 'finance' | 'procurement' | 'services' | 'system';
export type TimePeriod = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export interface MetricUpdate {
  category: MetricCategory;
  metricName: string;
  value: number;
  operation: 'increment' | 'decrement' | 'set';
  timestamp: Date;
}

export interface KPI {
  id: string;
  name: string;
  category: MetricCategory;
  value: number;
  previousValue?: number;
  changePercentage?: number;
  lastUpdated: Date;
}

export interface TimeSeriesDataPoint {
  timestamp: Date;
  value: number;
}

export interface TrendData {
  metricName: string;
  period: TimePeriod;
  dataPoints: TimeSeriesDataPoint[];
}

export interface ReportingHandler {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handle: (event: EnterpriseEvent<any>) => MetricUpdate | MetricUpdate[] | null;
}

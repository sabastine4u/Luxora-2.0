// src/modules/enterprise/reporting/metricsStore.ts
import type { KPI, TimeSeriesDataPoint, MetricCategory } from './reportingTypes';

/**
 * Centralized, in-memory store for KPIs and Metrics.
 * In production, this interfaces with a data warehouse or time-series database.
 */
class MetricsStore {
  private static instance: MetricsStore;
  private kpis: Map<string, KPI>;
  private timeSeriesData: Map<string, TimeSeriesDataPoint[]>;

  private constructor() {
    this.kpis = new Map();
    this.timeSeriesData = new Map();
  }

  public static getInstance(): MetricsStore {
    if (!MetricsStore.instance) {
      MetricsStore.instance = new MetricsStore();
    }
    return MetricsStore.instance;
  }

  public updateKPI(metricName: string, category: MetricCategory, value: number): void {
    const existing = this.kpis.get(metricName);
    const previousValue = existing ? existing.value : 0;
    
    // Calculate simple percentage change
    let changePercentage = 0;
    if (previousValue !== 0) {
      changePercentage = ((value - previousValue) / previousValue) * 100;
    }

    this.kpis.set(metricName, {
      id: crypto.randomUUID(),
      name: metricName,
      category,
      value,
      previousValue,
      changePercentage,
      lastUpdated: new Date()
    });
  }

  public getKPI(metricName: string): KPI | undefined {
    return this.kpis.get(metricName);
  }

  public getKPIsByCategory(category: MetricCategory): KPI[] {
    return Array.from(this.kpis.values()).filter(kpi => kpi.category === category);
  }

  public getAllKPIs(): KPI[] {
    return Array.from(this.kpis.values());
  }

  public recordTimeSeriesData(metricName: string, value: number): void {
    const series = this.timeSeriesData.get(metricName) || [];
    series.push({
      timestamp: new Date(),
      value
    });
    this.timeSeriesData.set(metricName, series);
  }

  public getTimeSeriesData(metricName: string): TimeSeriesDataPoint[] {
    return this.timeSeriesData.get(metricName) || [];
  }
}

export const metricsStore = MetricsStore.getInstance();

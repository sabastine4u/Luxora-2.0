// src/modules/enterprise/reporting/reportingEngine.ts
import type { EnterpriseEvent } from '../events/types';
import { publishEvent } from '../events/publishEvent';
import { ENTERPRISE_EVENTS } from '../events/registry';
import { getReportingHandler } from './reportingRegistry';
import { aggregateMetrics } from './aggregationEngine';

/**
 * Consumes an event, extracts metric updates via handlers, and funnels them through the aggregation engine.
 */
export async function processReportingEvent(event: EnterpriseEvent<unknown>): Promise<void> {
  if (!event || !event.type) return;

  const handler = getReportingHandler(event.type);
  if (!handler) {
    // If no handler is mapped, we safely ignore the event
    return;
  }

  try {
    const updates = handler.handle(event);
    
    if (updates) {
      // Send updates to the Aggregation Engine to distribute to KPI/Trend Engines
      aggregateMetrics(updates);

      // Publish a standard reporting update event that dashboards or external BI tools could listen to
      publishEvent(ENTERPRISE_EVENTS.REPORT_GENERATED, {
        sourceEventId: event.id,
        sourceEventType: event.type,
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error(`[ReportingEngine] Failed to process reporting for ${event.type}`, error);
  }
}

// src/modules/enterprise/communication/communicationEngine.ts
import type { EnterpriseEvent } from '../events/types';
import { publishEvent } from '../events/publishEvent';
import { ENTERPRISE_EVENTS } from '../events/registry';
import { getCommunicationHandler } from './communicationRegistry';

/**
 * Consumes an event, builds/updates conversations via handlers, and publishes communication.thread.created
 */
export async function processCommunication(event: EnterpriseEvent<unknown>): Promise<void> {
  if (!event || !event.type) return;

  const handler = getCommunicationHandler(event.type);
  if (!handler) {
    // If no handler is mapped, we safely ignore the event
    return;
  }

  try {
    await handler.handle(event);

    // After successfully processing, we could optionally publish that a communication thread was updated.
    // For this demonstration, we'll assume the handler's successful completion implies a thread update.
    publishEvent(ENTERPRISE_EVENTS.COMMUNICATION_THREAD_CREATED, {
      sourceEventId: event.id,
      sourceEventType: event.type,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`[CommunicationEngine] Failed to process communication for ${event.type}`, error);
  }
}

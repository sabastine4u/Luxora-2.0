// src/modules/enterprise/notifications/notificationEngine.ts
import type { EnterpriseEvent } from '../events/types';
import { publishEvent } from '../events/publishEvent';
import { ENTERPRISE_EVENTS } from '../events/registry';
import { getNotificationHandler } from './notificationRegistry';
import { notificationStore } from './notificationStore';

/**
 * Consumes an event, builds notifications via handlers, stores them, and publishes notification.sent
 */
export async function processNotification(event: EnterpriseEvent<unknown>): Promise<void> {
  if (!event || !event.type) return;

  const handler = getNotificationHandler(event.type);
  if (!handler) {
    // If no handler is mapped, we safely ignore the event
    return;
  }

  try {
    const result = await handler.handle(event);
    
    if (!result) return;

    const notifications = Array.isArray(result) ? result : [result];

    // Store notifications globally
    notificationStore.addMultiple(notifications);

    // Publish notification.sent for other channels to consume (Email, Push, Webhooks)
    notifications.forEach(notification => {
      publishEvent(ENTERPRISE_EVENTS.NOTIFICATION_SENT, {
        notificationId: notification.id,
        recipientRole: notification.recipientRole,
        recipientId: notification.recipientId,
        type: notification.type,
      });
    });

  } catch (error) {
    console.error(`[NotificationEngine] Failed to process notification for ${event.type}`, error);
  }
}

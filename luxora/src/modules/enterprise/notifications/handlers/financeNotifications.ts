// src/modules/enterprise/notifications/handlers/financeNotifications.ts
import type { NotificationHandler, NotificationPayload } from '../notificationTypes';
import { ENTERPRISE_EVENTS } from '../../events/registry';

export const financeNotificationsHandler: NotificationHandler = {
  name: 'Finance Notifications',
  handle: (event): NotificationPayload | null => {
    if (event.type === ENTERPRISE_EVENTS.FINANCE_REFUND_REQUESTED) {
      return {
        id: crypto.randomUUID(),
        sourceEvent: event.type,
        type: 'warning',
        title: 'Refund Requested',
        message: 'A new refund request has been initiated and requires review.',
        recipientRole: 'Finance',
        priority: 'high',
        status: 'unread',
        read: false,
        createdAt: new Date(),
      };
    }
    return null;
  }
};

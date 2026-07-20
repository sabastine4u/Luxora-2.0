// src/modules/enterprise/notifications/handlers/procurementNotifications.ts
import type { NotificationHandler, NotificationPayload } from '../notificationTypes';
import { ENTERPRISE_EVENTS } from '../../events/registry';

export const procurementNotificationsHandler: NotificationHandler = {
  name: 'Procurement Notifications',
  handle: (event): NotificationPayload | null => {
    if (event.type === ENTERPRISE_EVENTS.PROCUREMENT_PURCHASE_REQUEST_CREATED) {
      return {
        id: crypto.randomUUID(),
        sourceEvent: event.type,
        type: 'info',
        title: 'Purchase Request Created',
        message: 'A new purchase request has been submitted for approval.',
        recipientRole: 'Procurement',
        priority: 'normal',
        status: 'unread',
        read: false,
        createdAt: new Date(),
      };
    }
    return null;
  }
};

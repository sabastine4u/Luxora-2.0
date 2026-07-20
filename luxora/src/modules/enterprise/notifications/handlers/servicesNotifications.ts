// src/modules/enterprise/notifications/handlers/servicesNotifications.ts
import type { NotificationHandler, NotificationPayload } from '../notificationTypes';
import { ENTERPRISE_EVENTS } from '../../events/registry';

export const servicesNotificationsHandler: NotificationHandler = {
  name: 'Services Notifications',
  handle: (event): NotificationPayload | null => {
    if (event.type === ENTERPRISE_EVENTS.SERVICES_JOB_COMPLETED) {
      return {
        id: crypto.randomUUID(),
        sourceEvent: event.type,
        type: 'success',
        title: 'Service Successfully Completed',
        message: 'Your requested home service has been completed.',
        recipientRole: 'Customer',
        priority: 'normal',
        status: 'unread',
        read: false,
        createdAt: new Date(),
      };
    }
    return null;
  }
};

// src/modules/enterprise/notifications/handlers/managementNotifications.ts
import type { NotificationHandler, NotificationPayload } from '../notificationTypes';
import { ENTERPRISE_EVENTS } from '../../events/registry';

export const managementNotificationsHandler: NotificationHandler = {
  name: 'Management Notifications',
  handle: (event): NotificationPayload[] | null => {
    if (event.type === ENTERPRISE_EVENTS.MANAGEMENT_PROPERTY_VERIFIED) {
      return [
        {
          id: crypto.randomUUID(),
          sourceEvent: event.type,
          type: 'success',
          title: 'Property Verified',
          message: 'Your property has been verified by Luxora management.',
          recipientRole: 'Owner',
          priority: 'normal',
          status: 'unread',
          read: false,
          createdAt: new Date(),
        },
        {
          id: crypto.randomUUID(),
          sourceEvent: event.type,
          type: 'info',
          title: 'Property Verified',
          message: 'A property assigned to your agency has been verified.',
          recipientRole: 'Agency',
          priority: 'normal',
          status: 'unread',
          read: false,
          createdAt: new Date(),
        }
      ];
    }
    return null;
  }
};

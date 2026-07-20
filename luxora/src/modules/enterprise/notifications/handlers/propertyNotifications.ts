// src/modules/enterprise/notifications/handlers/propertyNotifications.ts
import type { NotificationHandler, NotificationPayload } from '../notificationTypes';
import { ENTERPRISE_EVENTS } from '../../events/registry';

export const propertyNotificationsHandler: NotificationHandler = {
  name: 'Property Notifications',
  handle: (event): NotificationPayload[] | null => {
    const basePayload = {
      id: crypto.randomUUID(),
      sourceEvent: event.type,
      priority: 'normal' as const,
      status: 'unread' as const,
      read: false,
      createdAt: new Date(),
    };

    switch (event.type) {
      case ENTERPRISE_EVENTS.PROPERTY_SUBMITTED:
        return [{
          ...basePayload,
          type: 'info',
          title: 'New Property Submitted',
          message: 'A new property has been submitted for review.',
          recipientRole: 'Agency',
        }];
      case ENTERPRISE_EVENTS.AGENCY_PROPERTY_RECEIVED:
        return [{
          ...basePayload,
          type: 'info',
          title: 'Property Awaiting Assignment',
          message: 'A property requires agent assignment.',
          recipientRole: 'Agency Dashboard',
        }];
      case ENTERPRISE_EVENTS.AGENCY_AGENT_ASSIGNED:
        return [
          {
            ...basePayload,
            type: 'success',
            title: 'New Property Assignment',
            message: 'You have been assigned a new property.',
            recipientRole: 'Agent',
          },
          {
            ...basePayload,
            id: crypto.randomUUID(), // New ID for second notification
            type: 'success',
            title: 'Property Assigned to Agent',
            message: 'Your property has been assigned to an agent.',
            recipientRole: 'Owner',
          }
        ];
      case ENTERPRISE_EVENTS.PROPERTY_REVIEW_STARTED:
        return [{
          ...basePayload,
          type: 'info',
          title: 'Property Review Started',
          message: 'Your property is currently under review.',
          recipientRole: 'Owner',
        }];
      case ENTERPRISE_EVENTS.PROPERTY_REVIEW_COMPLETED:
        return [{
          ...basePayload,
          type: 'success',
          title: 'Property Review Completed',
          message: 'Your property review has been completed.',
          recipientRole: 'Owner',
        }];
      case ENTERPRISE_EVENTS.PROPERTY_READY_FOR_LISTING:
        return [
          {
            ...basePayload,
            type: 'success',
            title: 'Property Ready for Listing',
            message: 'Your property is ready to be listed.',
            recipientRole: 'Owner',
          },
          {
            ...basePayload,
            id: crypto.randomUUID(),
            type: 'info',
            title: 'Property Ready for Listing',
            message: 'A property is ready for final listing.',
            recipientRole: 'Agency',
          }
        ];
      case ENTERPRISE_EVENTS.PROPERTY_LISTING_PUBLISHED:
        return [{
          ...basePayload,
          type: 'success',
          title: 'Property Successfully Published',
          message: 'Your property listing is now live!',
          recipientRole: 'Owner',
        }];
      case ENTERPRISE_EVENTS.PROPERTY_LISTING_REJECTED:
        return [
          {
            ...basePayload,
            type: 'warning',
            title: 'Listing Requires Attention',
            message: 'Your listing was rejected and requires changes.',
            recipientRole: 'Owner',
            priority: 'high',
          },
          {
            ...basePayload,
            id: crypto.randomUUID(),
            type: 'warning',
            title: 'Listing Requires Attention',
            message: 'A property listing was rejected and requires changes.',
            recipientRole: 'Agency',
            priority: 'high',
          }
        ];
      default:
        return null;
    }
  }
};

// src/modules/enterprise/notifications/handlers/workflowNotifications.ts
import type { NotificationHandler, NotificationPayload } from '../notificationTypes';
import { ENTERPRISE_EVENTS } from '../../events/registry';

export const workflowNotificationsHandler: NotificationHandler = {
  name: 'Workflow Notifications',
  handle: (event): NotificationPayload | NotificationPayload[] | null => {
    const basePayload = {
      id: crypto.randomUUID(),
      sourceEvent: event.type,
      priority: 'normal' as const,
      status: 'unread' as const,
      read: false,
      createdAt: new Date(),
    };

    switch (event.type) {
      case ENTERPRISE_EVENTS.WORKFLOW_STARTED:
        return {
          ...basePayload,
          type: 'info',
          title: 'Workflow Started',
          message: 'A new workflow process has been initiated.',
          recipientRole: 'Assigned Users',
        };
      case ENTERPRISE_EVENTS.WORKFLOW_PENDING:
        return {
          ...basePayload,
          type: 'warning',
          title: 'Approval Required',
          message: 'A workflow is pending your approval.',
          recipientRole: 'Approver',
          priority: 'high',
        };
      case ENTERPRISE_EVENTS.WORKFLOW_COMPLETED:
        return {
          ...basePayload,
          type: 'success',
          title: 'Workflow Completed',
          message: 'A workflow has been successfully completed.',
          recipientRole: 'Related Users',
        };
      case ENTERPRISE_EVENTS.WORKFLOW_APPROVAL_GRANTED:
        return {
          ...basePayload,
          type: 'success',
          title: 'Approval Granted',
          message: 'Your request has been approved.',
          recipientRole: 'Related Users',
        };
      case ENTERPRISE_EVENTS.WORKFLOW_APPROVAL_REJECTED:
        return {
          ...basePayload,
          type: 'error',
          title: 'Approval Rejected',
          message: 'Your request has been rejected.',
          recipientRole: 'Related Users',
          priority: 'high',
        };
      case ENTERPRISE_EVENTS.WORKFLOW_FAILED:
        return {
          ...basePayload,
          type: 'error',
          title: 'Workflow Failed',
          message: 'An automated workflow has encountered a failure.',
          recipientRole: 'Administrators',
          priority: 'critical',
        };
      default:
        return null;
    }
  }
};

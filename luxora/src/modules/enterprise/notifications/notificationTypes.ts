// src/modules/enterprise/notifications/notificationTypes.ts
import type { EnterpriseEvent } from '../events/types';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';
export type NotificationPriority = 'low' | 'normal' | 'high' | 'critical';
export type NotificationStatus = 'unread' | 'read' | 'archived';

export interface NotificationPayload {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  recipientRole?: string;
  recipientId?: string;
  relatedEntity?: string;
  relatedEntityId?: string;
  sourceEvent: string;
  workflowId?: string;
  priority: NotificationPriority;
  status: NotificationStatus;
  read: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

export interface NotificationHandler {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handle: (event: EnterpriseEvent<any>) => NotificationPayload | NotificationPayload[] | null | Promise<NotificationPayload | NotificationPayload[] | null>;
}

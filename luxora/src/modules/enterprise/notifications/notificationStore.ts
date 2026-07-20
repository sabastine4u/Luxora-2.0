// src/modules/enterprise/notifications/notificationStore.ts
import type { NotificationPayload, NotificationPriority } from './notificationTypes';

/**
 * A centralized, in-memory store for notifications.
 * In a real application, this would interface with a database or a state management library like Redux/Zustand.
 */
class NotificationStore {
  private static instance: NotificationStore;
  private notifications: Map<string, NotificationPayload>;

  private constructor() {
    this.notifications = new Map();
  }

  public static getInstance(): NotificationStore {
    if (!NotificationStore.instance) {
      NotificationStore.instance = new NotificationStore();
    }
    return NotificationStore.instance;
  }

  public add(notification: NotificationPayload): void {
    this.notifications.set(notification.id, notification);
  }

  public addMultiple(notifications: NotificationPayload[]): void {
    notifications.forEach(n => this.add(n));
  }

  public get(id: string): NotificationPayload | undefined {
    return this.notifications.get(id);
  }

  public getAll(): NotificationPayload[] {
    return Array.from(this.notifications.values());
  }

  public getByRole(role: string): NotificationPayload[] {
    return this.getAll().filter(n => n.recipientRole === role);
  }

  public getByUser(userId: string): NotificationPayload[] {
    return this.getAll().filter(n => n.recipientId === userId);
  }

  public getUnread(): NotificationPayload[] {
    return this.getAll().filter(n => !n.read && n.status !== 'archived');
  }

  public getByPriority(priority: NotificationPriority): NotificationPayload[] {
    return this.getAll().filter(n => n.priority === priority);
  }

  public markAsRead(id: string): void {
    const notification = this.notifications.get(id);
    if (notification) {
      notification.read = true;
      notification.status = 'read';
    }
  }

  public markAllAsRead(userId?: string): void {
    this.getAll().forEach(n => {
      if (!userId || n.recipientId === userId) {
        n.read = true;
        n.status = 'read';
      }
    });
  }

  public archive(id: string): void {
    const notification = this.notifications.get(id);
    if (notification) {
      notification.status = 'archived';
    }
  }

  public getUnreadCount(userId?: string): number {
    return this.getAll().filter(n => !n.read && n.status !== 'archived' && (!userId || n.recipientId === userId)).length;
  }
}

export const notificationStore = NotificationStore.getInstance();

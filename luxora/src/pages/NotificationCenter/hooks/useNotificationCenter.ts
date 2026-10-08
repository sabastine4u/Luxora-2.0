import { useMemo, useState } from 'react';
import { useSession } from '../../../contexts/SessionContext';
import { MOCK_ACTIVITIES, MOCK_APPROVALS, MOCK_REMINDERS } from '../data/mockData';
import type { Notification as CoreNotification } from '../../../types/notification';
import type {
  Notification as CenterNotification,
  NotificationSource,
  NotificationCategory,
  Priority,
} from '../types/notificationTypes';

const NOTIFICATION_SOURCES: NotificationSource[] = [
  'Communication',
  'Properties',
  'Listings',
  'Leads',
  'Clients',
  'Deals',
  'Appointments',
  'Agencies',
  'Finance',
  'Procurement',
  'Compliance',
  'Super Admin',
  'Management',
  'System',
];

const NOTIFICATION_CATEGORIES: NotificationCategory[] = [
  'Information',
  'Success',
  'Warning',
  'Error',
  'Reminder',
  'Approval',
  'Assignment',
  'Announcement',
  'Security',
];

const NOTIFICATION_PRIORITIES: Priority[] = [
  'low',
  'medium',
  'high',
  'critical',
];

const mapSource = (
  notification: CoreNotification,
): NotificationSource => {
  const resourceType = String(notification.resourceType ?? '').toLowerCase();

  if (NOTIFICATION_SOURCES.includes(notification.resourceType as NotificationSource)) {
    return notification.resourceType as NotificationSource;
  }

  const sourceMap: Record<string, NotificationSource> = {
    communication: 'Communication',
    message: 'Communication',
    conversation: 'Communication',
    property: 'Properties',
    properties: 'Properties',
    listing: 'Listings',
    listings: 'Listings',
    lead: 'Leads',
    leads: 'Leads',
    client: 'Clients',
    clients: 'Clients',
    deal: 'Deals',
    deals: 'Deals',
    appointment: 'Appointments',
    appointments: 'Appointments',
    agency: 'Agencies',
    agencies: 'Agencies',
    finance: 'Finance',
    procurement: 'Procurement',
    compliance: 'Compliance',
    'super admin': 'Super Admin',
    management: 'Management',
    system: 'System',
  };

  return sourceMap[resourceType] ?? 'System';
};

const mapCategory = (
  category: string,
): NotificationCategory => {
  return NOTIFICATION_CATEGORIES.includes(
    category as NotificationCategory,
  )
    ? (category as NotificationCategory)
    : 'Information';
};

const mapPriority = (
  priority: string,
): Priority => {
  const normalized = priority.toLowerCase();

  if (NOTIFICATION_PRIORITIES.includes(normalized as Priority)) {
    return normalized as Priority;
  }

  if (normalized === 'normal') {
    return 'medium';
  }

  return 'medium';
};

const mapNotification = (
  notification: CoreNotification,
): CenterNotification => ({
  id: notification.id,
  title: notification.title,
  description: notification.body,
  timestamp: notification.createdAt,
  source: mapSource(notification),
  category: mapCategory(notification.category),
  priority: mapPriority(notification.priority),
  isRead: notification.readAt !== null,
  isArchived: notification.archivedAt !== null,
  relatedUserId: notification.actor ?? undefined,
  relatedModuleId: notification.resourceId ?? undefined,
});

export function useNotificationCenter() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const {
    notifications: allNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    archiveNotification,
  } = useSession();

  const notifications = useMemo(() => {
    const mappedNotifications = allNotifications.map(mapNotification);

    let filtered = mappedNotifications;

    if (activeCategory === 'unread') {
      filtered = filtered.filter(
        (notification) =>
          !notification.isRead && !notification.isArchived,
      );
    } else if (activeCategory === 'archived') {
      filtered = filtered.filter(
        (notification) => notification.isArchived,
      );
    } else if (activeCategory === 'all') {
      filtered = filtered.filter(
        (notification) => !notification.isArchived,
      );
    } else {
      filtered = [];
    }

    const query = searchQuery.trim().toLowerCase();

    return query
      ? filtered.filter(
          (notification) =>
            notification.title.toLowerCase().includes(query) ||
            notification.description.toLowerCase().includes(query),
        )
      : filtered;
  }, [activeCategory, allNotifications, searchQuery]);

  const mappedAllNotifications = useMemo(
    () => allNotifications.map(mapNotification),
    [allNotifications],
  );

  return {
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    notifications,
    allNotifications: mappedAllNotifications,
    activities: MOCK_ACTIVITIES,
    reminders: MOCK_REMINDERS,
    approvals: MOCK_APPROVALS,
    markAsRead: markNotificationRead,
    markAllAsRead: markAllNotificationsRead,
    archiveNotification,
  };
}
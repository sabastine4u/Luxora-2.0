import { useMemo, useState } from 'react';
import { useSession } from '../../../contexts/SessionContext';
import { MOCK_ACTIVITIES, MOCK_APPROVALS, MOCK_REMINDERS } from '../data/mockData';

export function useNotificationCenter() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { notifications: allNotifications, markNotificationRead, markAllNotificationsRead, archiveNotification } = useSession();

  const notifications = useMemo(() => {
    let filtered = allNotifications;
    if (activeCategory === 'unread') filtered = filtered.filter((notification) => notification.readAt === null && notification.archivedAt === null);
    else if (activeCategory === 'archived') filtered = filtered.filter((notification) => notification.archivedAt !== null);
    else if (activeCategory === 'all') filtered = filtered.filter((notification) => notification.archivedAt === null);
    else filtered = [];

    const query = searchQuery.trim().toLowerCase();
    return query ? filtered.filter((notification) => notification.title.toLowerCase().includes(query) || notification.body.toLowerCase().includes(query)) : filtered;
  }, [activeCategory, allNotifications, searchQuery]);

  return {
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    notifications,
    allNotifications,
    activities: MOCK_ACTIVITIES,
    reminders: MOCK_REMINDERS,
    approvals: MOCK_APPROVALS,
    markAsRead: markNotificationRead,
    markAllAsRead: markAllNotificationsRead,
    archiveNotification,
  };
}

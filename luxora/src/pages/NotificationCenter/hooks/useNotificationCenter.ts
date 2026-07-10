import { useState, useMemo } from 'react';
import { MOCK_NOTIFICATIONS, MOCK_ACTIVITIES, MOCK_REMINDERS, MOCK_APPROVALS } from '../data/mockData';
import type { Notification, Activity, Reminder, Approval } from '../types/notificationTypes';

export function useNotificationCenter() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [activities] = useState<Activity[]>(MOCK_ACTIVITIES);
  const [reminders] = useState<Reminder[]>(MOCK_REMINDERS);
  const [approvals] = useState<Approval[]>(MOCK_APPROVALS);

  const filteredNotifications = useMemo(() => {
    let filtered = notifications;

    // Category filtering
    switch (activeCategory) {
      case 'unread':
        filtered = filtered.filter(n => !n.isRead);
        break;
      case 'mentions':
        filtered = filtered.filter(n => n.category === 'Assignment');
        break;
      case 'archived':
        filtered = filtered.filter(n => n.isArchived);
        break;
      default:
        // 'all' shouldn't show archived by default in some views, but we'll show them for now or rely on specific views
        if (activeCategory !== 'all') {
          // If a specific department/source was clicked, we could filter by it here
          const normalizedFilter = activeCategory.toLowerCase();
          filtered = filtered.filter(n => n.source.toLowerCase() === normalizedFilter || n.category.toLowerCase() === normalizedFilter);
        }
    }

    // Hide archived from 'all' view
    if (activeCategory === 'all') {
      filtered = filtered.filter(n => !n.isArchived);
    }

    // Search filtering
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(q) || 
        n.description.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [notifications, activeCategory, searchQuery]);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const archiveNotification = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isArchived: true } : n));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return {
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    notifications: filteredNotifications,
    allNotifications: notifications,
    activities,
    reminders,
    approvals,
    markAsRead,
    markAllAsRead,
    archiveNotification,
    deleteNotification
  };
}

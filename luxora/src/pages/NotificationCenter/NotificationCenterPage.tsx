import { useState } from 'react';
import { DashboardHeader } from '../../components/dashboard/shared/headers/DashboardHeader';
import { LeftNavigation } from './components/LeftNavigation';
import { NotificationList } from './components/NotificationList';
import { ActivityFeed } from './components/ActivityFeed';
import { ReminderCenter } from './components/ReminderCenter';
import { ApprovalCenter } from './components/ApprovalCenter';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { WorkflowTimeline } from './components/WorkflowTimeline';
import { DepartmentDashboard } from './components/DepartmentDashboard';
import { NotificationPreferences } from './components/NotificationPreferences';
import { NotificationDetailModal } from './components/NotificationDetailModal';
import { useNotificationCenter } from './hooks/useNotificationCenter';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Search } from 'lucide-react';
import type { Notification } from './types/notificationTypes';

export const NotificationCenterPage = () => {
  const {
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    notifications,
    allNotifications,
    activities,
    reminders,
    approvals,
    markAsRead,
    markAllAsRead,
    archiveNotification
  } = useNotificationCenter();

  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  // Derive unread counts for navigation
  const unreadCounts = {
    all: allNotifications.filter(n => !n.isRead && !n.isArchived).length,
    unread: allNotifications.filter(n => !n.isRead && !n.isArchived).length,
    mentions: allNotifications.filter(n => !n.isRead && !n.isArchived && n.category === 'Assignment').length,
    approvals: approvals.filter(a => a.status === 'Pending').length,
    reminders: reminders.filter(r => r.dueDate < new Date().toISOString() && !r.isCompleted).length, // Overdue
  };

  const renderActiveWorkspace = () => {
    switch (activeCategory) {
      case 'activities':
        return <ActivityFeed activities={activities} />;
      case 'reminders':
        return <ReminderCenter reminders={reminders} />;
      case 'approvals':
        return <ApprovalCenter approvals={approvals} />;
      case 'executive':
        return <ExecutiveDashboard />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'workflow':
        return <WorkflowTimeline />;
      case 'finance':
      case 'compliance':
      case 'properties':
      case 'deals':
        // Reuse department dashboard conceptually, or a filtered list
        return <DepartmentDashboard />;
      case 'preferences':
        return <NotificationPreferences />;
      default:
        // 'all', 'unread', 'mentions', 'archived' fall here
        return (
          <NotificationList 
            notifications={notifications} 
            onMarkRead={markAsRead}
            onMarkAllRead={markAllAsRead}
            onArchive={archiveNotification}
          />
        );
    }
  };

  return (
    <DashboardLayout activeTab="Notification Center">
      <div className="min-h-[calc(100vh-8rem)] flex flex-col bg-gray-50 dark:bg-ink-dark overflow-hidden rounded-2xl border border-gray-100 dark:border-ink-light">
        <div className="p-6 pb-2 shrink-0">
        <DashboardHeader 
          name="Notification & Activity Center" 
          subtitle="Enterprise notifications, approvals, and workflows." 
        />
      </div>
      
      {/* Global Toolbar */}
      <div className="h-14 bg-white dark:bg-ink border-b border-gray-200 dark:border-ink-light flex items-center px-6 shrink-0 justify-between">
        <div className="flex items-center w-full max-w-md bg-gray-100 dark:bg-ink-light/50 rounded-xl px-3 py-2 border border-transparent focus-within:border-gold-500 focus-within:bg-white dark:focus-within:bg-ink transition-colors">
          <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
          <input 
            type="text" 
            placeholder="Search across all notifications and activities..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white w-full placeholder-gray-400"
          />
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Navigation Workspace */}
        <LeftNavigation 
          activeCategory={activeCategory} 
          onCategorySelect={setActiveCategory} 
          unreadCounts={unreadCounts}
        />

        {/* Dynamic Center Workspace */}
        <main className="flex-1 relative overflow-hidden flex">
          {renderActiveWorkspace()}
        </main>
        
      </div>

      <NotificationDetailModal 
        notification={selectedNotification} 
        isOpen={!!selectedNotification} 
        onClose={() => setSelectedNotification(null)} 
      />
      </div>
    </DashboardLayout>
  );
};

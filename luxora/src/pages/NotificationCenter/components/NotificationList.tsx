import { Check, CheckCheck, Archive, Clock, Filter, AlertCircle, Info, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';
import { formatMessageTime } from '../../CommunicationCenter/utils/formatter';
import { clsx } from 'clsx';
import type { Notification } from '../types/notificationTypes';
import { MOCK_USERS } from '../data/mockData';

interface NotificationListProps {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onArchive: (id: string) => void;
}

export const NotificationList = ({ notifications, onMarkRead, onMarkAllRead, onArchive }: NotificationListProps) => {
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-500 bg-red-50 dark:bg-red-900/20';
      case 'high': return 'text-orange-500 bg-orange-50 dark:bg-orange-900/20';
      case 'medium': return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'low': return 'text-gray-500 bg-gray-50 dark:bg-ink-light';
      default: return 'text-gray-500 bg-gray-50 dark:bg-ink-light';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Success': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'Warning': return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'Error':
      case 'Security': return <ShieldAlert className="w-5 h-5 text-red-500" />;
      case 'Information': return <Info className="w-5 h-5 text-blue-500" />;
      default: return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-ink">
      {/* Header */}
      <div className="h-16 border-b border-gray-100 dark:border-ink-light flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center space-x-2">
          <h2 className="text-[15px] font-semibold text-gray-900 dark:text-white">Inbox</h2>
          <span className="bg-gray-100 dark:bg-ink-light text-gray-600 dark:text-gray-400 text-xs py-0.5 px-2 rounded-full font-medium">
            {notifications.length}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <GhostButton size="sm" onClick={onMarkAllRead} className="text-gray-500 hover:text-gold-600">
            <CheckCheck className="w-4 h-4 mr-2" />
            Mark all read
          </GhostButton>
          <div className="w-px h-4 bg-gray-200 dark:bg-ink-light mx-2" />
          <GhostButton size="sm" className="text-gray-500">
            <Filter className="w-4 h-4" />
          </GhostButton>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <CheckCircle2 className="w-12 h-12 mb-4 text-gray-300 dark:text-ink-light" />
            <p className="text-sm">You're all caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-ink-light/50">
            {notifications.map(notification => {
              const relatedUser = notification.relatedUserId ? Object.values(MOCK_USERS).find(u => u.id === notification.relatedUserId) : null;
              
              return (
                <div 
                  key={notification.id} 
                  className={clsx(
                    "p-4 hover:bg-gray-50/50 dark:hover:bg-ink-light/20 transition-colors group relative",
                    !notification.isRead ? "bg-gold-50/30 dark:bg-gold-900/10" : ""
                  )}
                >
                  {!notification.isRead && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gold-500 rounded-r" />
                  )}
                  
                  <div className="flex items-start pl-2">
                    <div className="shrink-0 mr-4 mt-1">
                      {relatedUser?.avatar ? (
                        <img src={relatedUser.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-ink-light flex items-center justify-center">
                          {getCategoryIcon(notification.category)}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <h3 className={clsx("text-sm truncate", !notification.isRead ? "font-bold text-gray-900 dark:text-white" : "font-medium text-gray-700 dark:text-gray-300")}>
                            {notification.title}
                          </h3>
                          <span className={clsx("text-[10px] uppercase font-bold px-1.5 py-0.5 rounded", getPriorityColor(notification.priority))}>
                            {notification.priority}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400 shrink-0 ml-4">
                          {formatMessageTime(notification.timestamp)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
                        {notification.description}
                      </p>
                      
                      <div className="flex items-center text-[11px] font-medium text-gray-400 uppercase tracking-wider space-x-3">
                        <span>Source: {notification.source}</span>
                        {relatedUser && <span>User: {relatedUser.name}</span>}
                      </div>
                    </div>
                    
                    {/* Hover Actions */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-ink shadow-sm border border-gray-200 dark:border-ink-light rounded-lg flex items-center p-1 space-x-1">
                      {!notification.isRead && (
                        <div title="Mark Read">
                          <GhostButton size="sm" onClick={() => onMarkRead(notification.id)} className="w-8 h-8 p-0 text-gray-400 hover:text-emerald-500">
                            <Check className="w-4 h-4" />
                          </GhostButton>
                        </div>
                      )}
                      <div title="Snooze">
                        <GhostButton size="sm" className="w-8 h-8 p-0 text-gray-400 hover:text-blue-500">
                          <Clock className="w-4 h-4" />
                        </GhostButton>
                      </div>
                      <div title="Archive">
                        <GhostButton size="sm" onClick={() => onArchive(notification.id)} className="w-8 h-8 p-0 text-gray-400 hover:text-orange-500">
                          <Archive className="w-4 h-4" />
                        </GhostButton>
                      </div>
                    </div>
                    
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

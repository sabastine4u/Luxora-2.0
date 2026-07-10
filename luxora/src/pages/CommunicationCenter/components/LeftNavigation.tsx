import { 
  MessageSquare, Users, Building2, Briefcase, 
  UserSquare, Calendar, Megaphone, Bell, 
  Star, Archive, Hash, ShieldAlert, FileText, 
  CheckCircle2, BarChart3 
} from 'lucide-react';
import { clsx } from 'clsx';
import { CONVERSATION_CATEGORIES } from '../constants/communicationConstants';

interface LeftNavigationProps {
  activeCategory: string;
  onCategorySelect: (category: string) => void;
  unreadCounts?: Record<string, number>;
}

export const LeftNavigation = ({ activeCategory, onCategorySelect, unreadCounts = {} }: LeftNavigationProps) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'all': return <MessageSquare className="w-5 h-5" />;
      case 'unread': return <MessageSquare className="w-5 h-5 relative before:content-[''] before:w-2 before:h-2 before:bg-gold-500 before:absolute before:-top-0.5 before:-right-0.5 before:rounded-full" />;
      case 'direct': return <UserSquare className="w-5 h-5" />;
      case 'teams': return <Users className="w-5 h-5" />;
      case 'properties': return <Building2 className="w-5 h-5" />;
      case 'deals': return <Briefcase className="w-5 h-5" />;
      case 'clients': return <Users className="w-5 h-5" />;
      case 'appointments': return <Calendar className="w-5 h-5" />;
      case 'announcements': return <Megaphone className="w-5 h-5" />;
      case 'system': return <Bell className="w-5 h-5" />;
      case 'favorites': return <Star className="w-5 h-5" />;
      case 'archived': return <Archive className="w-5 h-5" />;
      default: return <MessageSquare className="w-5 h-5" />;
    }
  };

  return (
    <div className="w-64 flex flex-col h-full bg-white dark:bg-ink border-r border-gray-100 dark:border-ink-light">
      <div className="p-4 border-b border-gray-100 dark:border-ink-light">
        <h2 className="text-lg font-bold text-navy-900 dark:text-white">Messages</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        {/* Priority Inbox */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">Priority Inbox</h3>
          <div className="space-y-1 px-3">
            <button 
              onClick={() => onCategorySelect('mentions')}
              className={clsx("w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors", activeCategory === 'mentions' ? "bg-gold-50 dark:bg-gold-900/20 text-gold-700 dark:text-gold-400 font-medium" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-ink-light")}
            >
              <div className="flex items-center"><Hash className="w-4 h-4 mr-3 text-purple-500" /> @Mentions</div>
              <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 py-0.5 px-2 rounded-full text-xs">2</span>
            </button>
            <button 
              onClick={() => onCategorySelect('priority')}
              className={clsx("w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors", activeCategory === 'priority' ? "bg-gold-50 dark:bg-gold-900/20 text-gold-700 dark:text-gold-400 font-medium" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-ink-light")}
            >
              <div className="flex items-center"><ShieldAlert className="w-4 h-4 mr-3 text-red-500" /> High Priority</div>
            </button>
          </div>
        </div>

        {/* Workspaces */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">Workspaces</h3>
          <div className="space-y-1 px-3">
            <button onClick={() => onCategorySelect('files')} className={clsx("w-full flex items-center px-3 py-2 rounded-xl text-sm transition-colors", activeCategory === 'files' ? "bg-gold-50 dark:bg-gold-900/20 text-gold-700 dark:text-gold-400 font-medium" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-ink-light")}>
              <FileText className="w-4 h-4 mr-3 text-blue-500" /> Shared Files
            </button>
            <button onClick={() => onCategorySelect('calendar')} className={clsx("w-full flex items-center px-3 py-2 rounded-xl text-sm transition-colors", activeCategory === 'calendar' ? "bg-gold-50 dark:bg-gold-900/20 text-gold-700 dark:text-gold-400 font-medium" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-ink-light")}>
              <Calendar className="w-4 h-4 mr-3 text-emerald-500" /> Calendar
            </button>
            <button onClick={() => onCategorySelect('tasks')} className={clsx("w-full flex items-center px-3 py-2 rounded-xl text-sm transition-colors", activeCategory === 'tasks' ? "bg-gold-50 dark:bg-gold-900/20 text-gold-700 dark:text-gold-400 font-medium" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-ink-light")}>
              <CheckCircle2 className="w-4 h-4 mr-3 text-orange-500" /> Follow-ups
            </button>
            <button onClick={() => onCategorySelect('analytics')} className={clsx("w-full flex items-center px-3 py-2 rounded-xl text-sm transition-colors", activeCategory === 'analytics' ? "bg-gold-50 dark:bg-gold-900/20 text-gold-700 dark:text-gold-400 font-medium" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-ink-light")}>
              <BarChart3 className="w-4 h-4 mr-3 text-indigo-500" /> Analytics
            </button>
            <button onClick={() => onCategorySelect('presence')} className={clsx("w-full flex items-center px-3 py-2 rounded-xl text-sm transition-colors", activeCategory === 'presence' ? "bg-gold-50 dark:bg-gold-900/20 text-gold-700 dark:text-gold-400 font-medium" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-ink-light")}>
              <Users className="w-4 h-4 mr-3 text-teal-500" /> Team Presence
            </button>
            <button onClick={() => onCategorySelect('announcements')} className={clsx("w-full flex items-center px-3 py-2 rounded-xl text-sm transition-colors", activeCategory === 'announcements' ? "bg-gold-50 dark:bg-gold-900/20 text-gold-700 dark:text-gold-400 font-medium" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-ink-light")}>
              <Megaphone className="w-4 h-4 mr-3 text-gold-500" /> Announcements
            </button>
          </div>
        </div>

        {/* Channels */}
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">Messages</h3>
        <ul className="space-y-1 px-3">
          {CONVERSATION_CATEGORIES.map(category => (
            <li key={category.id}>
              <button
                onClick={() => onCategorySelect(category.id)}
                className={clsx(
                  'w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors',
                  activeCategory === category.id 
                    ? 'bg-navy-50 dark:bg-ink-light text-navy-700 dark:text-white font-medium' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-ink-light/50 hover:text-gray-900 dark:hover:text-white'
                )}
              >
                <div className="flex items-center space-x-3">
                  <div className={clsx(
                    activeCategory === category.id ? 'text-gold-500' : ''
                  )}>
                    {getIcon(category.id)}
                  </div>
                  <span className="text-sm">{category.label}</span>
                </div>
                {unreadCounts[category.id] > 0 && (
                  <span className="bg-gold-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {unreadCounts[category.id]}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

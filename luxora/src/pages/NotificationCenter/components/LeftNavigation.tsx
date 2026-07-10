import { NAVIGATION_CATEGORIES } from '../constants/notificationConstants';
import { Inbox, BellDot, AtSign, CheckSquare, Clock, Activity, Briefcase, DollarSign, Building2, FileText, ShieldAlert, Archive } from 'lucide-react';
import { clsx } from 'clsx';

interface LeftNavigationProps {
  activeCategory: string;
  onCategorySelect: (category: string) => void;
  unreadCounts: Record<string, number>;
}

export const LeftNavigation = ({ activeCategory, onCategorySelect, unreadCounts }: LeftNavigationProps) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Inbox': return Inbox;
      case 'BellDot': return BellDot;
      case 'AtSign': return AtSign;
      case 'CheckSquare': return CheckSquare;
      case 'Clock': return Clock;
      case 'Activity': return Activity;
      case 'Briefcase': return Briefcase;
      case 'DollarSign': return DollarSign;
      case 'Building2': return Building2;
      case 'FileText': return FileText;
      case 'ShieldAlert': return ShieldAlert;
      case 'Archive': return Archive;
      default: return Inbox;
    }
  };

  return (
    <div className="w-64 border-r border-gray-100 dark:border-ink-light bg-gray-50/50 dark:bg-ink-dark/20 flex flex-col h-full shrink-0">
      <div className="p-4 border-b border-gray-100 dark:border-ink-light">
        <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Workspace</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        
        {/* Inbox Views */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">Priority Inbox</h3>
          <ul className="space-y-1 px-3">
            {NAVIGATION_CATEGORIES.slice(0, 3).map(cat => {
              const Icon = getIcon(cat.icon);
              return (
                <li key={cat.id}>
                  <button
                    onClick={() => onCategorySelect(cat.id)}
                    className={clsx(
                      "w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors",
                      activeCategory === cat.id 
                        ? "bg-gold-50 dark:bg-gold-900/20 text-gold-700 dark:text-gold-400 font-medium" 
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-ink-light"
                    )}
                  >
                    <div className="flex items-center">
                      <Icon className={clsx("w-4 h-4 mr-3", activeCategory === cat.id ? "text-gold-500" : "text-gray-400")} />
                      {cat.label}
                    </div>
                    {unreadCounts[cat.id] > 0 && (
                      <span className={clsx(
                        "py-0.5 px-2 rounded-full text-xs font-semibold",
                        activeCategory === cat.id
                          ? "bg-gold-100 dark:bg-gold-900/40 text-gold-700 dark:text-gold-400"
                          : "bg-gray-200 dark:bg-ink-light text-gray-600 dark:text-gray-400"
                      )}>
                        {unreadCounts[cat.id]}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Enterprise Dashboards */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">Enterprise Dashboards</h3>
          <ul className="space-y-1 px-3">
            {NAVIGATION_CATEGORIES.slice(3, 7).map(cat => {
              const Icon = getIcon(cat.icon);
              return (
                <li key={cat.id}>
                  <button
                    onClick={() => onCategorySelect(cat.id)}
                    className={clsx(
                      "w-full flex items-center px-3 py-2 rounded-xl text-sm transition-colors",
                      activeCategory === cat.id 
                        ? "bg-gold-50 dark:bg-gold-900/20 text-gold-700 dark:text-gold-400 font-medium" 
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-ink-light"
                    )}
                  >
                    <Icon className={clsx("w-4 h-4 mr-3", activeCategory === cat.id ? "text-gold-500" : "text-gray-400")} />
                    {cat.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Module Filters */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">Module Filters</h3>
          <ul className="space-y-1 px-3">
            {NAVIGATION_CATEGORIES.slice(7).map(cat => {
              const Icon = getIcon(cat.icon);
              return (
                <li key={cat.id}>
                  <button
                    onClick={() => onCategorySelect(cat.id)}
                    className={clsx(
                      "w-full flex items-center px-3 py-2 rounded-xl text-sm transition-colors",
                      activeCategory === cat.id 
                        ? "bg-gold-50 dark:bg-gold-900/20 text-gold-700 dark:text-gold-400 font-medium" 
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-ink-light"
                    )}
                  >
                    <Icon className={clsx("w-4 h-4 mr-3", activeCategory === cat.id ? "text-gold-500" : "text-gray-400")} />
                    {cat.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

      </div>
    </div>
  );
};

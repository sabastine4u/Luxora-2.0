import { useCRMCenter } from '../hooks/useCRMCenter';
import { NAVIGATION_CATEGORIES, type CRMWorkspace } from '../constants/crmConstants';
import { clsx } from 'clsx';
import { LayoutDashboard, Users, Building2, Kanban, Activity, CalendarClock, Focus, BarChart3, Sparkles } from 'lucide-react';

export const LeftNavigation = () => {
  const { activeWorkspace, setActiveWorkspace } = useCRMCenter();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'LayoutDashboard': return <LayoutDashboard className="w-4 h-4" />;
      case 'Users': return <Users className="w-4 h-4" />;
      case 'Building2': return <Building2 className="w-4 h-4" />;
      case 'Kanban': return <Kanban className="w-4 h-4" />;
      case 'Activity': return <Activity className="w-4 h-4" />;
      case 'CalendarClock': return <CalendarClock className="w-4 h-4" />;
      case 'Focus': return <Focus className="w-4 h-4" />;
      case 'BarChart3': return <BarChart3 className="w-4 h-4" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-64 bg-white dark:bg-ink border-r border-gray-200 dark:border-ink-light flex flex-col h-full shrink-0 overflow-y-auto">
      <div className="p-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">CRM Workspaces</h3>
        <div className="space-y-1">
          {NAVIGATION_CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveWorkspace(category.id as CRMWorkspace)}
              className={clsx(
                "w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors",
                activeWorkspace === category.id
                  ? "bg-gold-50 dark:bg-gold-900/20 text-gold-600 dark:text-gold-400 font-semibold"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-ink-light hover:text-gray-900 dark:hover:text-white"
              )}
            >
              <div className="mr-3">{getIcon(category.icon)}</div>
              {category.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

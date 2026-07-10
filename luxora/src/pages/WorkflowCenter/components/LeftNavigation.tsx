import { LayoutDashboard, CheckCircle, ClipboardList, GitMerge, Copy, AlertTriangle, History, Clock, BarChart3, Building2, LineChart } from 'lucide-react';
import { WORKFLOW_NAV_ITEMS } from '../constants/workflowConstants';
import type { WorkflowWorkspace } from '../constants/workflowConstants';
import { clsx } from 'clsx';

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, CheckCircle, ClipboardList, GitMerge, Copy, AlertTriangle, History, Clock, BarChart3, Building2, LineChart
};

interface LeftNavigationProps {
  activeWorkspace: WorkflowWorkspace;
  onSelect: (workspace: WorkflowWorkspace) => void;
}

export const LeftNavigation = ({ activeWorkspace, onSelect }: LeftNavigationProps) => {
  return (
    <div className="w-64 bg-white dark:bg-ink border-r border-gray-200 dark:border-ink-light flex flex-col h-full shrink-0">
      <div className="p-4 border-b border-gray-100 dark:border-ink-light bg-gray-50/50 dark:bg-ink-light/10">
        <h3 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wider flex items-center">
          <GitMerge className="w-4 h-4 mr-2 text-gold-500" />
          Workflow Engine
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {WORKFLOW_NAV_ITEMS.map(item => {
            const Icon = iconMap[item.icon];
            const isActive = activeWorkspace === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onSelect(item.id)}
                className={clsx(
                  "w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors group",
                  isActive 
                    ? "bg-gold-50 text-gold-700 dark:bg-gold-900/20 dark:text-gold-400" 
                    : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-ink-light/50"
                )}
              >
                <Icon className={clsx(
                  "w-4 h-4 mr-3 transition-colors",
                  isActive ? "text-gold-600 dark:text-gold-400" : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                )} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

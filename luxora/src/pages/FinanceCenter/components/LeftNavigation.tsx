import { useFinanceCenter } from '../hooks/useFinanceCenter';
import { NAVIGATION_CATEGORIES, type FinanceWorkspace } from '../constants/financeConstants';
import { clsx } from 'clsx';
import { LayoutDashboard, ListOrdered, TrendingUp, TrendingDown, FileText, CreditCard, Award, PieChart, Activity, BarChart3, FileBarChart, Landmark, Sparkles } from 'lucide-react';

export const LeftNavigation = () => {
  const { activeWorkspace, setActiveWorkspace } = useFinanceCenter();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'LayoutDashboard': return <LayoutDashboard className="w-4 h-4" />;
      case 'ListOrdered': return <ListOrdered className="w-4 h-4" />;
      case 'TrendingUp': return <TrendingUp className="w-4 h-4" />;
      case 'TrendingDown': return <TrendingDown className="w-4 h-4" />;
      case 'FileText': return <FileText className="w-4 h-4" />;
      case 'CreditCard': return <CreditCard className="w-4 h-4" />;
      case 'Award': return <Award className="w-4 h-4" />;
      case 'PieChart': return <PieChart className="w-4 h-4" />;
      case 'Activity': return <Activity className="w-4 h-4" />;
      case 'BarChart3': return <BarChart3 className="w-4 h-4" />;
      case 'FileBarChart': return <FileBarChart className="w-4 h-4" />;
      case 'Landmark': return <Landmark className="w-4 h-4" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4" />;
      default: return <LayoutDashboard className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-64 bg-white dark:bg-ink border-r border-gray-200 dark:border-ink-light flex flex-col h-full shrink-0 overflow-y-auto custom-scrollbar">
      <div className="p-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">Finance Workspaces</h3>
        <div className="space-y-1">
          {NAVIGATION_CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveWorkspace(category.id as FinanceWorkspace)}
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

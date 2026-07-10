import { LayoutDashboard, ClipboardCheck, AlertTriangle, FileSearch, CheckSquare, Award, UserCheck, Scale, PieChart, Sparkles } from 'lucide-react';
import { useComplianceCenter } from '../hooks/useComplianceCenter';
import { NAVIGATION_CATEGORIES, type ComplianceWorkspace } from '../constants/complianceConstants';

const iconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  LayoutDashboard,
  ClipboardCheck,
  AlertTriangle,
  FileSearch,
  CheckSquare,
  Award,
  UserCheck,
  Scale,
  PieChart,
  Sparkles
};

export const LeftNavigation = () => {
  const { activeWorkspace, setActiveWorkspace } = useComplianceCenter();

  return (
    <div className="w-64 bg-white dark:bg-ink border-r border-gray-200 dark:border-ink-light flex flex-col h-full overflow-y-auto custom-scrollbar shrink-0">
      <div className="p-4 space-y-1">
        {NAVIGATION_CATEGORIES.map((nav) => {
          const Icon = iconMap[nav.icon];
          const isActive = activeWorkspace === nav.id;
          
          return (
            <button
              key={nav.id}
              onClick={() => setActiveWorkspace(nav.id as ComplianceWorkspace)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-gold-50 dark:bg-gold-900/20 text-gold-600 dark:text-gold-400 font-medium' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-ink-light'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-gold-500' : 'text-gray-400'}`} />
              <span>{nav.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

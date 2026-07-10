import { MOCK_DEPARTMENTS } from '../data/mockData';
import { Building2, CheckCircle2 } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';

export const DepartmentOverview = () => {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-ink">
      <div className="p-6 border-b border-gray-100 dark:border-ink-light shrink-0">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Department Overview</h1>
        <p className="text-gray-500">Cross-departmental workflow metrics and task distribution.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_DEPARTMENTS.map(dept => {
            // Generate deterministic stats for UI based on string length to avoid Math.random impurity
            const active = (dept.name.length * 7) % 20 + 5;
            const completed = (dept.name.length * 13) % 100 + 50;
            const sla = (dept.name.length * 3) % 10 + 90;
            
            return (
              <div key={dept.id} className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6 shadow-sm hover:border-gold-500/50 transition-colors">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-ink-light flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">{dept.name}</h3>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 dark:bg-ink-light/20 p-3 rounded-lg border border-gray-100 dark:border-ink-light text-center">
                    <div className="text-xs text-gray-500 font-medium mb-1">Active Tasks</div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">{active}</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-ink-light/20 p-3 rounded-lg border border-gray-100 dark:border-ink-light text-center">
                    <div className="text-xs text-gray-500 font-medium mb-1">Completed (30d)</div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">{completed}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm mb-6">
                  <span className="font-medium text-gray-500">SLA Compliance</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-500 flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    {sla}%
                  </span>
                </div>

                <GhostButton className="w-full justify-center">View Department Dash</GhostButton>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

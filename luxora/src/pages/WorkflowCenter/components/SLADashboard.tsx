import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { Clock, ShieldAlert, TimerReset, CheckCircle2 } from 'lucide-react';
import { MOCK_DEPARTMENTS } from '../data/mockData';
import { GhostButton } from '../../../components/ui/ui';

export const SLADashboard = () => {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-ink">
      <div className="p-6 border-b border-gray-100 dark:border-ink-light shrink-0">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">SLA Dashboard</h1>
        <p className="text-gray-500">Service Level Agreement compliance and bottleneck tracking.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard title="SLA Compliance" value="94.2%" icon={CheckCircle2} trend="+1.5%" trendColor="text-emerald-500" />
          <KPICard title="Avg Approval Time" value="4.2 hrs" icon={Clock} trend="-12%" trendColor="text-emerald-500" />
          <KPICard title="Overdue Items" value="3" icon={TimerReset} trend="+2" trendColor="text-red-500" />
          <KPICard title="Escalation Rate" value="1.8%" icon={ShieldAlert} trend="-0.5%" trendColor="text-emerald-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Department Performance */}
          <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6 shadow-sm">
            <h2 className="font-bold text-gray-900 dark:text-white mb-6">Department SLA Performance</h2>
            <div className="space-y-6">
              {MOCK_DEPARTMENTS.slice(0, 5).map((dept, idx) => {
                const compliance = 100 - (idx * 4.5);
                return (
                  <div key={dept.id}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">{dept.name}</span>
                      <span className="font-bold text-gray-900 dark:text-white">{compliance}%</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-ink-light rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${compliance}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <GhostButton className="w-full mt-6 justify-center">View All Departments</GhostButton>
          </div>

          {/* Active Bottlenecks */}
          <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6 shadow-sm">
            <h2 className="font-bold text-gray-900 dark:text-white mb-6">Active Bottlenecks</h2>
            <div className="space-y-4">
              <div className="p-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-orange-900 dark:text-orange-400 mb-1">Compliance Document Review</h4>
                    <p className="text-sm text-orange-700 dark:text-orange-300">Average completion time has increased by 45% in the last 48 hours.</p>
                  </div>
                  <span className="bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300 text-xs px-2 py-1 rounded font-bold">HIGH RISK</span>
                </div>
              </div>
              
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-yellow-900 dark:text-yellow-400 mb-1">Finance Final Sign-off</h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">3 approvals are currently approaching their SLA deadline.</p>
                  </div>
                  <span className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300 text-xs px-2 py-1 rounded font-bold">WARNING</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

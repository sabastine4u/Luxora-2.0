import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { Activity, BarChart3, CheckCircle, XCircle } from 'lucide-react';

export const WorkflowAnalytics = () => {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-ink">
      <div className="p-6 border-b border-gray-100 dark:border-ink-light shrink-0">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Workflow Analytics</h1>
        <p className="text-gray-500">Comprehensive reporting on workflow efficiency and volume.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard title="Total Volume (30d)" value="1,248" icon={BarChart3} trend="+14.2%" trendColor="text-emerald-500" />
          <KPICard title="Approval Rate" value="94.5%" icon={CheckCircle} trend="+2.1%" trendColor="text-emerald-500" />
          <KPICard title="Rejection Rate" value="5.5%" icon={XCircle} trend="-0.8%" trendColor="text-red-500" />
          <KPICard title="Avg Throughput" value="42 / day" icon={Activity} trend="+5.4%" trendColor="text-emerald-500" />
        </div>

        <div className="bg-white dark:bg-ink border border-gray-200 dark:border-ink-light rounded-xl p-6 shadow-sm min-h-[400px] flex flex-col items-center justify-center">
          <BarChart3 className="w-16 h-16 text-gray-200 dark:text-ink-light mb-4" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Volume Trend Chart</h3>
          <p className="text-gray-500 text-center max-w-sm">Detailed visualization of workflow volume across all categories. (Chart placeholder - requires charting library like Recharts in future phase).</p>
        </div>
      </div>
    </div>
  );
};

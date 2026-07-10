import { useDocumentCenter } from '../hooks/useDocumentCenter';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { FileText, HardDrive, CheckCircle, Clock } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';

export const AssetAnalytics = () => {
  const { metrics } = useDocumentCenter();

  return (
    <div className="p-8 max-w-6xl mx-auto h-full flex flex-col overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Asset Analytics</h2>
          <p className="text-gray-500">Enterprise storage and usage insights.</p>
        </div>
        <GhostButton>Export Report</GhostButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <KPICard title="Total Documents" value={metrics.totalDocuments} icon={FileText} trend="+12" trendColor="text-emerald-500" />
        <KPICard title="Storage Used" value={`${(metrics.storageUsedBytes / 1024 / 1024).toFixed(1)} MB`} icon={HardDrive} trend="+2.4 MB" trendColor="text-emerald-500" />
        <KPICard title="Approval Rate" value="94%" icon={CheckCircle} trend="+1.2%" trendColor="text-emerald-500" />
        <KPICard title="Avg Version Count" value="2.4" icon={Clock} trend="-0.2" trendColor="text-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6 h-80 flex flex-col items-center justify-center">
          <p className="text-gray-400">Department Usage Chart (Placeholder)</p>
        </div>
        <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6 h-80 flex flex-col items-center justify-center">
          <p className="text-gray-400">Storage Distribution Chart (Placeholder)</p>
        </div>
      </div>
    </div>
  );
};

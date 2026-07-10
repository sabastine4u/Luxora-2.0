import { PieChart, TrendingUp, ShieldCheck, CheckCircle } from 'lucide-react';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { GhostButton } from '../../../components/ui/ui';

export const ComplianceAnalytics = () => {
  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-gray-50 dark:bg-ink-dark">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <PieChart className="w-6 h-6 mr-3 text-gold-500" />
            Compliance Analytics
          </h2>
          <p className="text-gray-500 mt-1">Enterprise-wide compliance, risk, and audit performance metrics.</p>
        </div>
        <GhostButton>Export Report</GhostButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <KPICard title="Overall Compliance Rate" value="88%" icon={ShieldCheck} trend="+2.4%" trendColor="text-emerald-500" />
        <KPICard title="Audit Completion Rate" value="94%" icon={CheckCircle} trend="On Track" trendColor="text-emerald-500" />
        <KPICard title="Risk Escalation Rate" value="4.2%" icon={TrendingUp} trend="-1.1%" trendColor="text-emerald-500" />
        <KPICard title="Avg Resolution Time" value="14 Days" icon={PieChart} trend="+2 Days" trendColor="text-orange-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6 h-80 flex flex-col items-center justify-center">
          <p className="text-gray-400">Departmental Compliance Matrix (Placeholder)</p>
        </div>
        <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6 h-80 flex flex-col items-center justify-center">
          <p className="text-gray-400">Risk Trend Analysis (Placeholder)</p>
        </div>
      </div>
    </div>
  );
};

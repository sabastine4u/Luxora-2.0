import { BarChart3, TrendingUp, Percent, CheckCircle } from 'lucide-react';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { GhostButton } from '../../../components/ui/ui';

export const FinancialAnalytics = () => {
  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-gray-50 dark:bg-ink-dark">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <BarChart3 className="w-6 h-6 mr-3 text-gold-500" />
            Financial Analytics
          </h2>
          <p className="text-gray-500 mt-1">Deep-dive financial performance KPIs and predictive analysis.</p>
        </div>
        <GhostButton>Export Data</GhostButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <KPICard title="Profit Margin (Gross)" value="42.8%" icon={Percent} trend="+2.1%" trendColor="text-emerald-500" />
        <KPICard title="Revenue Growth YoY" value="18.5%" icon={TrendingUp} trend="Accelerating" trendColor="text-emerald-500" />
        <KPICard title="Collection Rate" value="96.2%" icon={CheckCircle} trend="-0.5%" trendColor="text-yellow-500" />
        <KPICard title="Forecast Accuracy" value="94%" icon={BarChart3} trend="Highly Accurate" trendColor="text-emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6 h-80 flex flex-col items-center justify-center">
          <p className="text-gray-400">Profit Margin Trend Chart (Placeholder)</p>
        </div>
        <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6 h-80 flex flex-col items-center justify-center">
          <p className="text-gray-400">Revenue by Region Analysis (Placeholder)</p>
        </div>
      </div>
    </div>
  );
};

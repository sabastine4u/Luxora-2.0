import { Wallet, TrendingUp, AlertCircle, CheckCircle, BarChart2 } from 'lucide-react';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { useCRMCenter } from '../hooks/useCRMCenter';

export const OpportunityForecast = () => {
  const { metrics } = useCRMCenter();
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NG', { notation: 'compact', compactDisplay: 'short', style: 'currency', currency: 'NGN' }).format(value);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto h-full overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
          <BarChart2 className="w-6 h-6 mr-3 text-gold-500" />
          Opportunity Forecast
        </h2>
        <p className="text-gray-500">Pipeline forecasting, revenue projections, and risk assessment.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <KPICard title="Total Pipeline Value" value={formatCurrency(metrics.pipelineValue)} icon={Wallet} trend="+12%" trendColor="text-emerald-500" />
        <KPICard title="Weighted Forecast" value={formatCurrency(metrics.pipelineValue * 0.65)} icon={TrendingUp} trend="+8%" trendColor="text-emerald-500" />
        <KPICard title="Expected Closes (30d)" value="4" icon={CheckCircle} trend="2 Highly Likely" trendColor="text-emerald-500" />
        <KPICard title="At Risk Deals" value="1" icon={AlertCircle} trend="Requires Action" trendColor="text-red-500" />
      </div>

      <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6 h-96 flex flex-col items-center justify-center">
        <p className="text-gray-400">Revenue Forecast Trajectory Chart (Placeholder)</p>
      </div>
    </div>
  );
};

import { Activity, ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';
import { useFinanceCenter } from '../hooks/useFinanceCenter';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { GhostButton } from '../../../components/ui/ui';

export const CashFlowDashboard = () => {
  const { cashFlowData } = useFinanceCenter();
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NG', { notation: 'compact', compactDisplay: 'short', style: 'currency', currency: 'NGN' }).format(value);
  };

  const currentMonth = cashFlowData[cashFlowData.length - 1];

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-gray-50 dark:bg-ink-dark">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Activity className="w-6 h-6 mr-3 text-gold-500" />
            Cash Flow Dashboard
          </h2>
          <p className="text-gray-500 mt-1">Real-time liquidity, trends, and financial health forecasting.</p>
        </div>
        <div className="flex space-x-3">
          <GhostButton>Download Statement</GhostButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <KPICard title="Net Cash Flow (Current)" value={formatCurrency(currentMonth.net)} icon={TrendingUp} trend="Healthy" trendColor="text-emerald-500" />
        <KPICard title="Operating Inflow" value={formatCurrency(currentMonth.inflow)} icon={ArrowUpRight} trend="+12.5%" trendColor="text-emerald-500" />
        <KPICard title="Operating Outflow" value={formatCurrency(currentMonth.outflow)} icon={ArrowDownRight} trend="+4.2%" trendColor="text-red-500" />
        <KPICard title="Burn Rate" value="₦2.5M / day" icon={Activity} trend="Stable" trendColor="text-gray-500" />
      </div>

      <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6 h-96 flex flex-col items-center justify-center">
        <p className="text-gray-400">Monthly Cash Flow Waterfall Chart (Placeholder)</p>
      </div>
    </div>
  );
};

import { TrendingUp, BarChart, ArrowUpRight } from 'lucide-react';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { useFinanceCenter } from '../hooks/useFinanceCenter';

export const RevenueCenter = () => {
  const { metrics } = useFinanceCenter();
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(value);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-gray-50 dark:bg-ink-dark">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <TrendingUp className="w-6 h-6 mr-3 text-gold-500" />
          Revenue Center
        </h2>
        <p className="text-gray-500 mt-1">Tracking inflows, sales revenue, rentals, and service commissions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <KPICard title="Total Revenue (YTD)" value={formatCurrency(metrics.totalRevenue)} icon={TrendingUp} trend="+18.5%" trendColor="text-emerald-500" />
        <KPICard title="Monthly MRR" value={formatCurrency(45000000)} icon={BarChart} trend="+5.2%" trendColor="text-emerald-500" />
        <KPICard title="Projected Revenue (Q3)" value={formatCurrency(metrics.totalRevenue * 1.3)} icon={ArrowUpRight} trend="On Target" trendColor="text-emerald-500" />
      </div>

      <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6 h-96 flex flex-col items-center justify-center">
        <p className="text-gray-400">Revenue Breakdown by Source (Sales vs Rent vs Commissions) Placeholder</p>
      </div>
    </div>
  );
};

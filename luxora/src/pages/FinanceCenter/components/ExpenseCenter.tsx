import { TrendingDown, PieChart, AlertTriangle } from 'lucide-react';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { useFinanceCenter } from '../hooks/useFinanceCenter';

export const ExpenseCenter = () => {
  const { metrics } = useFinanceCenter();
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(value);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-gray-50 dark:bg-ink-dark">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <TrendingDown className="w-6 h-6 mr-3 text-gold-500" />
          Expense Center
        </h2>
        <p className="text-gray-500 mt-1">Tracking operational outflows, procurement, payroll, and maintenance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <KPICard title="Total Expenses (YTD)" value={formatCurrency(metrics.totalExpenses)} icon={TrendingDown} trend="-2.4%" trendColor="text-emerald-500" />
        <KPICard title="Largest Category" value="Marketing" icon={PieChart} trend="42% of total" trendColor="text-gray-500" />
        <KPICard title="Unplanned Expenses" value={formatCurrency(1200000)} icon={AlertTriangle} trend="Requires Review" trendColor="text-red-500" />
      </div>

      <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6 h-96 flex flex-col items-center justify-center">
        <p className="text-gray-400">Expense Allocation Chart Placeholder</p>
      </div>
    </div>
  );
};

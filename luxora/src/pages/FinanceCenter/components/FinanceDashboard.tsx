import { useFinanceCenter } from '../hooks/useFinanceCenter';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { Wallet, TrendingUp, TrendingDown, FileText, CreditCard, Activity, Landmark, FileBarChart } from 'lucide-react';
import { GhostButton, GoldButton } from '../../../components/ui/ui';

export const FinanceDashboard = () => {
  const { metrics, cashFlowData } = useFinanceCenter();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(value);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Enterprise Finance Dashboard</h2>
          <p className="text-gray-500">Real-time overview of revenue, expenses, and cash flow.</p>
        </div>
        <div className="flex space-x-3">
          <GhostButton>Export Report</GhostButton>
          <GoldButton>New Transaction</GoldButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard title="Total Revenue (YTD)" value={formatCurrency(metrics.totalRevenue)} icon={TrendingUp} trend="+18.5%" trendColor="text-emerald-500" />
        <KPICard title="Total Expenses (YTD)" value={formatCurrency(metrics.totalExpenses)} icon={TrendingDown} trend="-2.4%" trendColor="text-emerald-500" />
        <KPICard title="Net Profit" value={formatCurrency(metrics.netProfit)} icon={Wallet} trend="+24.2%" trendColor="text-emerald-500" />
        <KPICard title="Current Cash Flow" value={formatCurrency(cashFlowData[cashFlowData.length - 1].net)} icon={Activity} trend="Healthy" trendColor="text-emerald-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard title="Outstanding Invoices" value={metrics.outstandingInvoicesCount} icon={FileText} trend={formatCurrency(metrics.outstandingInvoicesValue)} trendColor="text-yellow-600" />
        <KPICard title="Payments Received (30d)" value="42" icon={CreditCard} trend="+12%" trendColor="text-emerald-500" />
        <KPICard title="Budget Usage" value="78%" icon={FileBarChart} trend="On Track" trendColor="text-emerald-500" />
        <KPICard title="Active Mortgages" value="14" icon={Landmark} trend="2 Pending" trendColor="text-blue-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white">Cash Flow Trend (H1 2026)</h3>
            <GhostButton size="sm">Detailed View</GhostButton>
          </div>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-100 dark:border-ink-light rounded-lg">
            <span className="text-gray-400 text-sm">Line Chart Placeholder: Inflows vs Outflows</span>
          </div>
        </div>

        <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white">Recent Transactions</h3>
            <GhostButton size="sm">View All</GhostButton>
          </div>
          <div className="space-y-4">
            {/* Mock recent transactions list */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-ink-light last:border-0">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${i % 2 === 0 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {i % 2 === 0 ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{i % 2 === 0 ? 'Marketing Exp' : 'Property Sale'}</div>
                    <div className="text-xs text-gray-500">Today, 10:30 AM</div>
                  </div>
                </div>
                <div className={`text-sm font-bold ${i % 2 === 0 ? 'text-gray-900 dark:text-white' : 'text-emerald-600 dark:text-emerald-400'}`}>
                  {i % 2 === 0 ? '-' : '+'}{formatCurrency(1500000 * i)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

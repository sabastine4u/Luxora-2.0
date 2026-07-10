import { Sparkles, AlertTriangle, TrendingUp, Wallet } from 'lucide-react';
import { GoldButton, GhostButton } from '../../../components/ui/ui';

export const ExecutiveInsights = () => {
  return (
    <div className="p-8 max-w-5xl mx-auto h-full overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
          <Sparkles className="w-6 h-6 mr-3 text-gold-500" /> Executive Financial Insights
        </h2>
        <p className="text-gray-500">AI-inspired financial intelligence, anomaly detection, and risk recommendations.</p>
      </div>

      <div className="space-y-6">
        {/* Insight 1 */}
        <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6 flex flex-col sm:flex-row items-start gap-6">
          <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">Marketing Budget Limit Approaching</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The Marketing department has utilized 84% of its Q3 2026 budget allocation with 6 weeks remaining. At the current burn rate, they will exceed the budget by ₦4,500,000.
            </p>
            <div className="flex space-x-3">
              <GoldButton size="sm">Review Budget</GoldButton>
              <GhostButton size="sm">Message Department Head</GhostButton>
            </div>
          </div>
        </div>

        {/* Insight 2 */}
        <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6 flex flex-col sm:flex-row items-start gap-6">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">Revenue Growth Opportunity Detected</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Short-term lease revenues have increased by 22% MoM in the Victoria Island district. Reallocating properties from annual to short-let could yield an estimated ₦15M additional monthly revenue.
            </p>
            <div className="flex space-x-3">
              <GoldButton size="sm">Generate Projection Model</GoldButton>
            </div>
          </div>
        </div>

        {/* Insight 3 */}
        <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6 flex flex-col sm:flex-row items-start gap-6">
          <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center shrink-0">
            <Wallet className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">Rising Overdue Receivables</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Accounts receivable over 30 days overdue have grown by 15% this quarter, primarily driven by unpaid property valuation service invoices.
            </p>
            <div className="flex space-x-3">
              <GoldButton size="sm">View Aging Report</GoldButton>
              <GhostButton size="sm">Trigger Automated Follow-ups</GhostButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

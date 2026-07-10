import { Sparkles, AlertTriangle, Briefcase, UserCheck } from 'lucide-react';
import { GoldButton, GhostButton } from '../../../components/ui/ui';

export const ExecutiveInsights = () => {
  return (
    <div className="p-8 max-w-5xl mx-auto h-full overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
          <Sparkles className="w-6 h-6 mr-3 text-gold-500" /> CRM Executive Insights
        </h2>
        <p className="text-gray-500">AI-inspired relationship intelligence and risk recommendations based on activity metrics.</p>
      </div>

      <div className="space-y-6">
        {/* Insight 1 */}
        <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6 flex flex-col sm:flex-row items-start gap-6">
          <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">Dormant High-Value Accounts</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              3 VIP Investors have not been contacted in over 45 days. Historical data suggests a 60% higher churn rate after 60 days of inactivity.
            </p>
            <div className="flex space-x-3">
              <GoldButton size="sm">Schedule Check-ins</GoldButton>
              <GhostButton size="sm">View Accounts</GhostButton>
            </div>
          </div>
        </div>

        {/* Insight 2 */}
        <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6 flex flex-col sm:flex-row items-start gap-6">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center shrink-0">
            <Briefcase className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">Upsell Opportunity Detected</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Alexander Okafor recently viewed 4 commercial property listings in Eko Atlantic. He currently holds a strong 'Negotiating' deal for residential.
            </p>
            <div className="flex space-x-3">
              <GoldButton size="sm">Create Opportunity</GoldButton>
            </div>
          </div>
        </div>

        {/* Insight 3 */}
        <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6 flex flex-col sm:flex-row items-start gap-6">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
            <UserCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">Lead Conversion Optimization</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Leads originating from 'Website Referral' are converting 18% faster this month. Consider reallocating marketing budget to capitalize on this trend.
            </p>
            <div className="flex space-x-3">
              <GoldButton size="sm">View Conversion Report</GoldButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

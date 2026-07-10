import { Sparkles, AlertTriangle, Scale, UserCheck } from 'lucide-react';
import { GoldButton, GhostButton } from '../../../components/ui/ui';

export const ExecutiveInsights = () => {
  return (
    <div className="p-8 max-w-5xl mx-auto h-full overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
          <Sparkles className="w-6 h-6 mr-3 text-gold-500" /> Executive Compliance Insights
        </h2>
        <p className="text-gray-500">AI-driven governance intelligence, risk predictions, and compliance recommendations.</p>
      </div>

      <div className="space-y-6">
        {/* Insight 1 */}
        <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6 flex flex-col sm:flex-row items-start gap-6">
          <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">Property Inspection Overdue</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Structural safety inspection for the Banana Island Villa project is currently 14 days overdue. Immediate action is required to avoid regulatory fines from the Lagos State Building Control Agency.
            </p>
            <div className="flex space-x-3">
              <GoldButton size="sm">Schedule Inspection Immediately</GoldButton>
              <GhostButton size="sm">Escalate to Facilities Head</GhostButton>
            </div>
          </div>
        </div>

        {/* Insight 2 */}
        <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6 flex flex-col sm:flex-row items-start gap-6">
          <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center shrink-0">
            <UserCheck className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">High-Risk Transaction Detected</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              An inbound payment of ₦450M from "Global Construction Ltd" has triggered an AML flag due to inconsistent source of funds documentation.
            </p>
            <div className="flex space-x-3">
              <GoldButton size="sm">Review KYC Profile</GoldButton>
              <GhostButton size="sm">Freeze Transaction</GhostButton>
            </div>
          </div>
        </div>

        {/* Insight 3 */}
        <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6 flex flex-col sm:flex-row items-start gap-6">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
            <Scale className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">Multiple Audit Findings Unresolved</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The recent ISO 27001 External Audit identified 4 open findings in the IT department. Corrective Action Plans (CAPs) are required within 7 days.
            </p>
            <div className="flex space-x-3">
              <GoldButton size="sm">View Audit Findings</GoldButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

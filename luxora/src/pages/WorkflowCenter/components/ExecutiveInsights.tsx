import { Sparkles, AlertTriangle, TrendingUp, Users, CheckCircle2 } from 'lucide-react';
import { GhostButton, GoldButton } from '../../../components/ui/ui';

export const ExecutiveInsights = () => {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-ink">
      <div className="p-6 border-b border-gray-100 dark:border-ink-light shrink-0">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
          <Sparkles className="w-6 h-6 mr-3 text-gold-500" />
          Executive Insights
        </h1>
        <p className="text-gray-500">AI-driven recommendations and predictive analytics for workflow optimization.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Recommended Actions */}
        <h2 className="font-bold text-gray-900 dark:text-white mb-4">Recommended Next Actions</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-gold-50 to-white dark:from-gold-900/20 dark:to-ink rounded-xl border border-gold-200 dark:border-gold-900/50 p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles className="w-24 h-24 text-gold-500" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center space-x-2 text-gold-600 dark:text-gold-400 font-bold uppercase tracking-wider text-xs mb-2">
                <AlertTriangle className="w-4 h-4" /> Bottleneck Detected
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Reassign Compliance Reviews</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
                Elena Rodriguez has 14 pending compliance checks approaching SLA limits. Reassigning 5 low-priority reviews to alternate compliance officers will prevent breaches.
              </p>
              <div className="flex space-x-3">
                <GoldButton>Auto-Reassign</GoldButton>
                <GhostButton>Review Workload</GhostButton>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-ink rounded-xl border border-blue-200 dark:border-blue-900/50 p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <TrendingUp className="w-24 h-24 text-blue-500" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider text-xs mb-2">
                <TrendingUp className="w-4 h-4" /> Workflow Optimization
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Automate Finance Approvals <br/>&lt; ₦1,000,000</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
                98% of finance requests under ₦1M are approved without changes. Enabling auto-approval will reduce average workflow completion time by 1.2 days.
              </p>
              <div className="flex space-x-3">
                <GoldButton>Update Template</GoldButton>
                <GhostButton>View Analytics</GhostButton>
              </div>
            </div>
          </div>
        </div>

        {/* Global Health */}
        <h2 className="font-bold text-gray-900 dark:text-white mb-4">Enterprise Workflow Health</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-ink p-6 rounded-xl border border-gray-200 dark:border-ink-light shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
              <span className="text-emerald-500 font-bold text-sm">+2.4%</span>
            </div>
            <h4 className="text-gray-500 font-medium mb-1">Health Score</h4>
            <div className="text-3xl font-heading font-bold text-gray-900 dark:text-white">92/100</div>
          </div>

          <div className="bg-white dark:bg-ink p-6 rounded-xl border border-gray-200 dark:border-ink-light shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <span className="text-emerald-500 font-bold text-sm">Optimal</span>
            </div>
            <h4 className="text-gray-500 font-medium mb-1">Resource Utilization</h4>
            <div className="text-3xl font-heading font-bold text-gray-900 dark:text-white">78%</div>
          </div>

          <div className="bg-white dark:bg-ink p-6 rounded-xl border border-gray-200 dark:border-ink-light shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
              </div>
              <span className="text-orange-500 font-bold text-sm">Elevated</span>
            </div>
            <h4 className="text-gray-500 font-medium mb-1">SLA Risk Forecast</h4>
            <div className="text-3xl font-heading font-bold text-gray-900 dark:text-white">Medium</div>
          </div>
        </div>
      </div>
    </div>
  );
};

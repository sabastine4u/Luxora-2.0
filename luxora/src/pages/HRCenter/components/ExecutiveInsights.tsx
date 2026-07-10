import { Sparkles, Users, HeartPulse, GraduationCap } from 'lucide-react';
import { GoldButton, GhostButton } from '../../../components/ui/ui';

export const ExecutiveInsights = () => {
  return (
    <div className="p-8 max-w-5xl mx-auto h-full overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
          <Sparkles className="w-6 h-6 mr-3 text-gold-500" /> AI Workforce Insights
        </h2>
        <p className="text-gray-500">Predictive intelligence on retention risks, hiring needs, and workforce planning.</p>
      </div>

      <div className="space-y-6">
        {/* Insight 1 */}
        <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6 flex flex-col sm:flex-row items-start gap-6">
          <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center shrink-0">
            <HeartPulse className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">Burnout Risk Detected: Engineering Team</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Over the last 60 days, the Engineering team has logged an average of 55 hours per week, with a 30% drop in untaken leave balances. This indicates a high risk of burnout and subsequent attrition.
            </p>
            <div className="flex space-x-3">
              <GoldButton size="sm">Review Team Workload</GoldButton>
              <GhostButton size="sm">Mandate Leave</GhostButton>
            </div>
          </div>
        </div>

        {/* Insight 2 */}
        <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6 flex flex-col sm:flex-row items-start gap-6">
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">Hiring Gap: Compliance Department</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              With the recent acquisition of 3 commercial properties and 1 resignation in Compliance, workflow volume per officer has exceeded optimal levels by 40%. Recommend immediate opening of 2 Compliance Officer reqs.
            </p>
            <div className="flex space-x-3">
              <GoldButton size="sm">Open Job Requisitions</GoldButton>
            </div>
          </div>
        </div>

        {/* Insight 3 */}
        <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6 flex flex-col sm:flex-row items-start gap-6">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center shrink-0">
            <GraduationCap className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">Promotion Candidate Identification</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Based on consistent "Exceeds Expectations" ratings for 4 consecutive quarters and successful completion of the Leadership training module, John Doe (Sales) is strongly recommended for promotion to Sales Director.
            </p>
            <div className="flex space-x-3">
              <GoldButton size="sm">Review Performance Profile</GoldButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

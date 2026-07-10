import { Sparkles, AlertTriangle, FileWarning, SearchX } from 'lucide-react';
import { GoldButton, GhostButton } from '../../../components/ui/ui';

export const ExecutiveInsights = () => {
  return (
    <div className="p-8 max-w-5xl mx-auto h-full overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
          <Sparkles className="w-6 h-6 mr-3 text-gold-500" /> Executive Document Insights
        </h2>
        <p className="text-gray-500">AI-inspired compliance and usage recommendations based on document metadata and audit logs.</p>
      </div>

      <div className="space-y-6">
        {/* Insight 1 */}
        <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6 flex flex-col sm:flex-row items-start gap-6">
          <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">Expiring Contracts Detected</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              3 standard lease agreements and 1 agency contract are set to expire within the next 30 days based on their metadata retention labels.
            </p>
            <div className="flex space-x-3">
              <GoldButton size="sm">Review Contracts</GoldButton>
              <GhostButton size="sm">Dismiss</GhostButton>
            </div>
          </div>
        </div>

        {/* Insight 2 */}
        <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6 flex flex-col sm:flex-row items-start gap-6">
          <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center shrink-0">
            <SearchX className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">Missing Compliance Documents</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The property 'The Azure Tower' is missing the Q3 Fire Safety Inspection report required by the 'Property Management' workflow.
            </p>
            <div className="flex space-x-3">
              <GoldButton size="sm">Request Upload</GoldButton>
            </div>
          </div>
        </div>

        {/* Insight 3 */}
        <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6 flex flex-col sm:flex-row items-start gap-6">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
            <FileWarning className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">Duplicate File Signatures Detected</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Found 14 instances of the exact same 'Brand_Logo_V2.png' file across different property folders. Consolidating these could save 125 MB of storage.
            </p>
            <div className="flex space-x-3">
              <GoldButton size="sm">View Duplicates</GoldButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

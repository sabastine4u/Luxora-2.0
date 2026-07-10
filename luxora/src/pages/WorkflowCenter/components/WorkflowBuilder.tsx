import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { GripVertical, Settings, ShieldCheck, CheckCircle } from 'lucide-react';

export const WorkflowBuilder = () => {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-ink">
      <div className="p-6 border-b border-gray-100 dark:border-ink-light shrink-0 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Workflow Builder</h1>
          <p className="text-gray-500">Design and configure automated enterprise workflows.</p>
        </div>
        <div className="flex space-x-3">
          <GhostButton>Save Draft</GhostButton>
          <GoldButton>Publish Workflow</GoldButton>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Toolbar */}
        <div className="w-64 border-r border-gray-100 dark:border-ink-light bg-gray-50/50 dark:bg-ink-light/5 p-4 flex flex-col space-y-4">
          <h3 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wider mb-2">Nodes</h3>
          
          <div className="bg-white dark:bg-ink p-3 rounded-lg border border-gray-200 dark:border-ink-light shadow-sm cursor-grab flex items-center">
            <GripVertical className="w-4 h-4 text-gray-400 mr-2" />
            <span className="text-sm font-medium">Review Step</span>
          </div>
          <div className="bg-white dark:bg-ink p-3 rounded-lg border border-gray-200 dark:border-ink-light shadow-sm cursor-grab flex items-center">
            <GripVertical className="w-4 h-4 text-gray-400 mr-2" />
            <span className="text-sm font-medium">Approval</span>
          </div>
          <div className="bg-white dark:bg-ink p-3 rounded-lg border border-gray-200 dark:border-ink-light shadow-sm cursor-grab flex items-center">
            <GripVertical className="w-4 h-4 text-gray-400 mr-2" />
            <span className="text-sm font-medium text-blue-600">Compliance Check</span>
          </div>
          <div className="bg-white dark:bg-ink p-3 rounded-lg border border-gray-200 dark:border-ink-light shadow-sm cursor-grab flex items-center">
            <GripVertical className="w-4 h-4 text-gray-400 mr-2" />
            <span className="text-sm font-medium text-emerald-600">Finance Release</span>
          </div>
        </div>

        {/* Canvas (Visual Placeholder) */}
        <div className="flex-1 bg-gray-50 dark:bg-ink-light/10 p-12 relative overflow-auto flex justify-center">
          
          <div className="flex flex-col items-center space-y-6">
            <div className="bg-white dark:bg-ink px-6 py-3 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 font-semibold flex items-center">
              Start
            </div>
            
            <div className="w-0.5 h-8 bg-gray-300 dark:bg-gray-600" />
            
            <div className="bg-white dark:bg-ink p-4 rounded-xl border border-gray-200 dark:border-ink-light shadow-sm w-72 relative group cursor-pointer hover:border-gold-500 transition-colors">
              <div className="absolute top-3 right-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <Settings className="w-4 h-4" />
              </div>
              <div className="font-semibold text-gray-900 dark:text-white mb-1">Agent Submission</div>
              <div className="text-xs text-gray-500">Department: Sales</div>
            </div>

            <div className="w-0.5 h-8 bg-gray-300 dark:bg-gray-600" />

            <div className="bg-white dark:bg-ink p-4 rounded-xl border border-blue-200 dark:border-blue-900/50 shadow-sm w-72 relative group cursor-pointer hover:border-blue-500 transition-colors">
              <div className="absolute top-3 right-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <Settings className="w-4 h-4" />
              </div>
              <div className="font-semibold text-blue-900 dark:text-blue-400 mb-1 flex items-center">
                <ShieldCheck className="w-4 h-4 mr-1.5" />
                Compliance Review
              </div>
              <div className="text-xs text-gray-500 mb-2">Department: Compliance</div>
              <div className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded inline-block">SLA: 24 Hours</div>
            </div>

            <div className="w-0.5 h-8 bg-gray-300 dark:bg-gray-600" />
            
            <div className="bg-white dark:bg-ink p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/50 shadow-sm w-72 relative group cursor-pointer hover:border-emerald-500 transition-colors">
              <div className="font-semibold text-emerald-700 dark:text-emerald-400 mb-1 flex items-center">
                <CheckCircle className="w-4 h-4 mr-1.5" />
                Final Approval
              </div>
              <div className="text-xs text-gray-500">Department: Executive</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

import { useWorkflowCenter } from '../hooks/useWorkflowCenter';
import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { Copy, Plus, Users, Clock, Workflow as WorkflowIcon } from 'lucide-react';

export const WorkflowTemplates = () => {
  const { templates } = useWorkflowCenter();

  return (
    <div className="flex flex-col h-full bg-white dark:bg-ink">
      <div className="p-6 border-b border-gray-100 dark:border-ink-light shrink-0 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Workflow Templates</h1>
          <p className="text-gray-500">Reusable enterprise workflow definitions.</p>
        </div>
        <GoldButton>
          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </GoldButton>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map(template => (
            <div key={template.id} className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-gold-50 dark:bg-gold-900/20 flex items-center justify-center">
                  <WorkflowIcon className="w-6 h-6 text-gold-600 dark:text-gold-400" />
                </div>
                <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 dark:bg-ink-light/50 dark:text-gray-400">
                  {template.category}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{template.title}</h3>
              <p className="text-sm text-gray-500 mb-6 min-h-[40px]">{template.description}</p>
              
              <div className="flex items-center space-x-4 text-xs font-medium text-gray-500 mb-6">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1.5" />
                  {template.defaultSteps.length} Steps
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1.5" />
                  Est. {template.estimatedDurationDays} Days
                </div>
              </div>

              <div className="flex space-x-3 border-t border-gray-100 dark:border-ink-light pt-4">
                <GhostButton className="flex-1 justify-center py-2">Edit</GhostButton>
                <GhostButton className="flex-1 justify-center py-2">
                  <Copy className="w-4 h-4 mr-2" /> Clone
                </GhostButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

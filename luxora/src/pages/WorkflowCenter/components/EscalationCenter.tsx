import { useWorkflowCenter } from '../hooks/useWorkflowCenter';
import { ShieldAlert, ArrowRight } from 'lucide-react';
import { formatMessageTime } from '../../CommunicationCenter/utils/formatter';
import { GhostButton } from '../../../components/ui/ui';
import { clsx } from 'clsx';
import { MOCK_WORKFLOWS, MOCK_TASKS, MOCK_APPROVALS } from '../data/mockData';

export const EscalationCenter = () => {
  const { escalations } = useWorkflowCenter();
  
  return (
    <div className="flex flex-col h-full bg-white dark:bg-ink">
      <div className="p-6 border-b border-gray-100 dark:border-ink-light shrink-0">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Escalation Center</h1>
        <p className="text-gray-500">Track and manage SLA breaches, high-risk approvals, and overdue tasks.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          {escalations.map(escalation => {
            const workflow = MOCK_WORKFLOWS.find(w => w.id === escalation.workflowId);
            const task = escalation.taskId ? MOCK_TASKS.find(t => t.id === escalation.taskId) : null;
            const approval = escalation.approvalId ? MOCK_APPROVALS.find(a => a.id === escalation.approvalId) : null;

            return (
              <div key={escalation.id} className="bg-white dark:bg-ink border border-red-200 dark:border-red-900/30 rounded-xl p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center shrink-0">
                      <ShieldAlert className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <span className={clsx("text-[10px] font-bold uppercase px-2 py-0.5 rounded border", 
                          escalation.level === 'Executive' ? "bg-red-50 text-red-700 border-red-200" :
                          escalation.level === 'Level 2' ? "bg-orange-50 text-orange-700 border-orange-200" :
                          "bg-yellow-50 text-yellow-700 border-yellow-200"
                        )}>
                          {escalation.level} Escalation
                        </span>
                        <span className="text-xs text-gray-500">{formatMessageTime(escalation.timestamp)}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{escalation.reason}</h3>
                      
                      <div className="mt-3 bg-gray-50 dark:bg-ink-light/20 rounded-lg p-3 text-sm">
                        <div className="text-gray-500 mb-1">
                          <span className="font-medium">Workflow:</span> {workflow?.title}
                        </div>
                        {(task || approval) && (
                          <div className="text-gray-500">
                            <span className="font-medium">{task ? 'Task:' : 'Approval:'}</span> {task?.title || approval?.title}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <GhostButton className="text-blue-600 hover:bg-blue-50">
                      View Details <ArrowRight className="w-4 h-4 ml-2" />
                    </GhostButton>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

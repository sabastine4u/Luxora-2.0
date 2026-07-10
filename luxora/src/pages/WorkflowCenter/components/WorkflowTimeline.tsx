import { useWorkflowCenter } from '../hooks/useWorkflowCenter';
import { MOCK_WORKFLOWS, MOCK_DEPARTMENTS, MOCK_USERS } from '../data/mockData';
import { WorkflowSearch } from './WorkflowSearch';
import { CheckCircle2, Clock, GitMerge } from 'lucide-react';
import { clsx } from 'clsx';
import { formatMessageTime } from '../../CommunicationCenter/utils/formatter';

export const WorkflowTimeline = () => {
  const { searchQuery, setSearchQuery } = useWorkflowCenter();
  const activeWorkflows = MOCK_WORKFLOWS.filter(w => w.status !== 'Completed' && w.status !== 'Archived');

  return (
    <div className="flex flex-col h-full bg-white dark:bg-ink">
      <div className="p-6 border-b border-gray-100 dark:border-ink-light shrink-0">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Workflow Timeline</h1>
        <WorkflowSearch query={searchQuery} onChange={setSearchQuery} placeholder="Search workflows..." />
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-12 max-w-4xl">
          {activeWorkflows.map(workflow => (
            <div key={workflow.id} className="relative">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">{workflow.title}</h3>
                  <span className="text-sm text-gray-500">ID: {workflow.id} • {workflow.category}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gold-600 dark:text-gold-400">{workflow.progress}% Complete</div>
                </div>
              </div>

              {/* Connected Nodes */}
              <div className="relative flex items-center justify-between pt-4">
                <div className="absolute top-8 left-0 right-0 h-1 bg-gray-100 dark:bg-ink-light -z-10 rounded-full" />
                <div 
                  className="absolute top-8 left-0 h-1 bg-gold-400 dark:bg-gold-500 -z-10 rounded-full transition-all duration-1000"
                  style={{ width: `${workflow.progress}%` }} 
                />

                {workflow.steps.map((step) => {
                  const isCompleted = step.status === 'Completed';
                  const isCurrent = step.isCurrent;
                  const department = MOCK_DEPARTMENTS.find(d => d.id === step.departmentId);
                  const assignee = step.assigneeId ? MOCK_USERS[step.assigneeId as keyof typeof MOCK_USERS] : null;
                  
                  return (
                    <div key={step.id} className="flex flex-col items-center group w-48">
                      <div className={clsx(
                        "w-10 h-10 rounded-full flex items-center justify-center border-4 mb-3 transition-colors bg-white dark:bg-ink",
                        isCompleted ? "border-emerald-500 text-emerald-500" :
                        isCurrent ? "border-gold-500 text-gold-500 shadow-[0_0_15px_rgba(212,175,55,0.4)]" :
                        "border-gray-200 dark:border-ink-light text-gray-300"
                      )}>
                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : 
                         isCurrent ? <Clock className="w-5 h-5" /> : 
                         <GitMerge className="w-4 h-4" />}
                      </div>
                      
                      <div className="text-center">
                        <div className={clsx("font-semibold text-sm mb-1 line-clamp-2", isCurrent ? "text-gray-900 dark:text-white" : "text-gray-500")}>
                          {step.title}
                        </div>
                        <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-1">
                          {department?.name}
                        </div>
                        {assignee && (
                          <div className="text-xs text-gray-500">
                            {assignee.name}
                          </div>
                        )}
                        {step.completedAt && (
                          <div className="text-[10px] text-gray-400 mt-1">
                            {formatMessageTime(step.completedAt)}
                          </div>
                        )}
                        {step.dueDate && isCurrent && (
                          <div className={clsx("text-[10px] mt-1 font-semibold", step.dueDate < new Date().toISOString() ? "text-red-500" : "text-blue-500")}>
                            Due: {formatMessageTime(step.dueDate)}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

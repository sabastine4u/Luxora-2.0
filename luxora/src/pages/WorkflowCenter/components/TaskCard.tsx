import { UserCircle2, Calendar, PlayCircle } from 'lucide-react';
import type { Task } from '../types/workflowTypes';
import { formatMessageTime } from '../../CommunicationCenter/utils/formatter';
import { MOCK_USERS, MOCK_WORKFLOWS } from '../data/mockData';

import { WorkflowStatusBadge } from './WorkflowStatusBadge';
import { clsx } from 'clsx';

interface TaskCardProps {
  task: Task;
  onClick?: (task: Task) => void;
}

export const TaskCard = ({ task, onClick }: TaskCardProps) => {
  const assignee = MOCK_USERS[task.assigneeId as keyof typeof MOCK_USERS];
  const workflow = MOCK_WORKFLOWS.find(w => w.id === task.workflowId);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'text-red-600 bg-red-50 border-red-100 dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400';
      case 'High': return 'text-orange-600 bg-orange-50 border-orange-100 dark:bg-orange-900/20 dark:border-orange-900/50 dark:text-orange-400';
      case 'Medium': return 'text-blue-600 bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-900/50 dark:text-blue-400';
      default: return 'text-gray-600 bg-gray-50 border-gray-100 dark:bg-ink-light/20 dark:border-ink-light dark:text-gray-400';
    }
  };

  return (
    <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-5 hover:border-blue-500/50 transition-colors shadow-sm cursor-pointer" onClick={() => onClick && onClick(task)}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className={clsx("px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border mb-2 inline-block", getPriorityColor(task.priority))}>
            {task.priority}
          </span>
          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">{task.title}</h3>
        </div>
        <WorkflowStatusBadge status={task.status} />
      </div>

      <p className="text-sm text-gray-500 mb-4 line-clamp-2 min-h-[40px]">
        {task.description}
      </p>

      {workflow && (
        <div className="mb-4 flex items-center p-2 bg-gray-50 dark:bg-ink-light/20 rounded-lg border border-gray-100 dark:border-ink-light text-xs">
          <PlayCircle className="w-3.5 h-3.5 text-blue-500 mr-2 shrink-0" />
          <span className="font-medium text-gray-700 dark:text-gray-300 truncate w-full pr-2">
            Workflow: {workflow.title}
          </span>
        </div>
      )}

      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center">
          {assignee?.avatar ? (
            <img src={assignee.avatar} alt="" className="w-6 h-6 rounded-full border border-gray-200 dark:border-ink-light" title={assignee.name} />
          ) : (
            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center" title={assignee?.name}>
              <UserCircle2 className="w-4 h-4 text-gray-400" />
            </div>
          )}
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400 ml-2">{assignee?.name || 'Unassigned'}</span>
        </div>
        
        <div className={clsx("flex items-center text-xs font-semibold", task.dueDate < new Date().toISOString() && task.status !== 'Completed' ? "text-red-500" : "text-gray-500")}>
          <Calendar className="w-3.5 h-3.5 mr-1.5" />
          {formatMessageTime(task.dueDate)}
        </div>
      </div>
    </div>
  );
};

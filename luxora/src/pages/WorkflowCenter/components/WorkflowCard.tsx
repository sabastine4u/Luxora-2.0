import { WorkflowStatusBadge } from './WorkflowStatusBadge';
import { Clock, Building2, UserCircle2 } from 'lucide-react';
import type { Workflow } from '../types/workflowTypes';
import { formatMessageTime } from '../../CommunicationCenter/utils/formatter';
import { MOCK_USERS, MOCK_DEPARTMENTS } from '../data/mockData';

import { clsx } from 'clsx';

interface WorkflowCardProps {
  workflow: Workflow;
  onClick?: (workflow: Workflow) => void;
}

export const WorkflowCard = ({ workflow, onClick }: WorkflowCardProps) => {
  const initiator = MOCK_USERS[workflow.initiatorId as keyof typeof MOCK_USERS];
  const department = MOCK_DEPARTMENTS.find(d => d.id === workflow.departmentId);

  return (
    <div 
      className="bg-white dark:bg-ink rounded-2xl border border-gray-200 dark:border-ink-light p-5 hover:border-gold-500/50 transition-colors shadow-sm cursor-pointer group"
      onClick={() => onClick && onClick(workflow)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">
            {workflow.category} • {workflow.id}
          </span>
          <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">
            {workflow.title}
          </h3>
        </div>
        <WorkflowStatusBadge status={workflow.status} />
      </div>

      <p className="text-sm text-gray-500 mb-4 line-clamp-2 min-h-[40px]">
        {workflow.description}
      </p>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="font-medium text-gray-600 dark:text-gray-300">Progress</span>
          <span className="font-bold text-gray-900 dark:text-white">{workflow.progress}%</span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-ink-light rounded-full h-1.5">
          <div 
            className={clsx(
              "h-1.5 rounded-full",
              workflow.status === 'Completed' ? "bg-emerald-500" : 
              workflow.status === 'Escalated' ? "bg-orange-500" : 
              workflow.status === 'Rejected' ? "bg-red-500" : "bg-gold-500"
            )}
            style={{ width: `${workflow.progress}%` }} 
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-ink-light">
        <div className="flex items-center space-x-3 text-xs text-gray-500 font-medium">
          <div className="flex items-center">
            {initiator?.avatar ? (
              <img src={initiator.avatar} alt="" className="w-5 h-5 rounded-full mr-1.5" />
            ) : (
              <UserCircle2 className="w-4 h-4 mr-1.5" />
            )}
            {initiator?.name || 'System'}
          </div>
          <div className="flex items-center">
            <Building2 className="w-3.5 h-3.5 mr-1" />
            {department?.name}
          </div>
        </div>
        {workflow.dueDate && (
          <div className={clsx(
            "flex items-center text-xs font-semibold",
            workflow.dueDate < new Date().toISOString() && workflow.status !== 'Completed' ? "text-red-500" : "text-gray-400"
          )}>
            <Clock className="w-3.5 h-3.5 mr-1" />
            {formatMessageTime(workflow.dueDate)}
          </div>
        )}
      </div>
    </div>
  );
};

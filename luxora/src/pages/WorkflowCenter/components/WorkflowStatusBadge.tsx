import { clsx } from 'clsx';
import type { WorkflowStatus, ApprovalStatus, TaskStatus } from '../types/workflowTypes';

interface WorkflowStatusBadgeProps {
  status: WorkflowStatus | ApprovalStatus | TaskStatus;
  className?: string;
}

export const WorkflowStatusBadge = ({ status, className }: WorkflowStatusBadgeProps) => {
  const getColors = () => {
    switch (status) {
      case 'Completed':
      case 'Approved':
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/50';
      case 'Rejected':
      case 'Returned':
      case 'Blocked':
      case 'Archived':
        return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/50';
      case 'Escalated':
        return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-900/50';
      case 'Pending Approval':
      case 'In Review':
      case 'In Progress':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/50';
      case 'Draft':
      case 'Pending':
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-ink-light/50 dark:text-gray-300 dark:border-ink-light';
    }
  };

  return (
    <span className={clsx("px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border", getColors(), className)}>
      {status}
    </span>
  );
};

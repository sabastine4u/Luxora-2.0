
import { Clock, Building2, UserCircle2, ArrowRight } from 'lucide-react';
import type { Approval } from '../types/workflowTypes';
import { formatMessageTime } from '../../CommunicationCenter/utils/formatter';
import { MOCK_USERS, MOCK_DEPARTMENTS } from '../data/mockData';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { WorkflowStatusBadge } from './WorkflowStatusBadge';
import { clsx } from 'clsx';

interface ApprovalCardProps {
  approval: Approval;
  onClick?: (approval: Approval) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

export const ApprovalCard = ({ approval, onClick, onApprove, onReject }: ApprovalCardProps) => {
  const requester = MOCK_USERS[approval.requesterId as keyof typeof MOCK_USERS];
  const department = MOCK_DEPARTMENTS.find(d => d.id === approval.departmentId);

  return (
    <div className="bg-white dark:bg-ink rounded-2xl border border-gray-200 dark:border-ink-light p-6 hover:shadow-md transition-shadow group flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            {requester?.avatar ? (
              <img src={requester.avatar} alt="" className="w-10 h-10 rounded-xl object-cover border border-gray-100 dark:border-ink-light" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-ink-light flex items-center justify-center text-gray-500">
                <UserCircle2 className="w-6 h-6" />
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 bg-white dark:bg-ink rounded-full p-0.5">
              <Building2 className="w-3.5 h-3.5 text-gold-500" />
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">{approval.title}</h3>
            <div className="text-xs text-gray-500 flex items-center space-x-2 mt-0.5">
              <span className="font-medium text-gray-700 dark:text-gray-300">{requester?.name || 'System'}</span>
              <span>•</span>
              <span>{department?.name}</span>
            </div>
          </div>
        </div>
        <WorkflowStatusBadge status={approval.status} />
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 line-clamp-2 flex-1">
        {approval.description}
      </p>

      {approval.dueDate && (
        <div className="flex items-center text-xs font-medium text-gray-500 mb-6 bg-gray-50 dark:bg-ink-light/20 p-2.5 rounded-lg border border-gray-100 dark:border-ink-light">
          <Clock className={clsx("w-4 h-4 mr-2", approval.dueDate < new Date().toISOString() && approval.status === 'Pending' ? "text-red-500" : "text-gray-400")} />
          Due: <span className={clsx("ml-1", approval.dueDate < new Date().toISOString() && approval.status === 'Pending' ? "text-red-600 font-bold" : "text-gray-700 dark:text-gray-300")}>{formatMessageTime(approval.dueDate)}</span>
        </div>
      )}

      {(approval.status === 'Pending' || approval.status === 'In Review') ? (
        <div className="flex items-center space-x-3 pt-4 border-t border-gray-100 dark:border-ink-light mt-auto">
          <GhostButton className="flex-1 justify-center py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => { if (onReject) onReject(approval.id); }}>
            Reject
          </GhostButton>
          <GoldButton className="flex-1 justify-center py-2" onClick={() => { if (onApprove) onApprove(approval.id); }}>
            Approve
          </GoldButton>
        </div>
      ) : (
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-ink-light mt-auto">
          <span className="text-xs font-medium text-gray-500">Processed</span>
          <GhostButton size="sm" onClick={() => onClick && onClick(approval)}>
            View Details <ArrowRight className="w-4 h-4 ml-2" />
          </GhostButton>
        </div>
      )}
    </div>
  );
};

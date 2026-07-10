import { CheckCircle2, XCircle, Clock, FileText, Building2, UserCircle2, DollarSign } from 'lucide-react';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { formatMessageTime } from '../../CommunicationCenter/utils/formatter';
import { clsx } from 'clsx';
import type { Approval } from '../types/notificationTypes';
import { MOCK_USERS } from '../data/mockData';

interface ApprovalCenterProps {
  approvals: Approval[];
}

export const ApprovalCenter = ({ approvals }: ApprovalCenterProps) => {
  const pendingApprovals = approvals.filter(a => a.status === 'Pending' || a.status === 'Waiting Review');
  const pastApprovals = approvals.filter(a => a.status === 'Approved' || a.status === 'Rejected');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-500 bg-red-50 dark:bg-red-900/20';
      case 'high': return 'text-orange-500 bg-orange-50 dark:bg-orange-900/20';
      case 'medium': return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'low': return 'text-gray-500 bg-gray-50 dark:bg-ink-light';
      default: return 'text-gray-500 bg-gray-50 dark:bg-ink-light';
    }
  };

  const getDepartmentIcon = (dept: string) => {
    switch (dept) {
      case 'Sales': return <Building2 className="w-5 h-5" />;
      case 'Finance': return <DollarSign className="w-5 h-5" />;
      case 'Procurement': return <FileText className="w-5 h-5" />;
      default: return <UserCircle2 className="w-5 h-5" />;
    }
  };

  const renderApprovalCard = (approval: Approval) => {
    const requester = MOCK_USERS[Object.keys(MOCK_USERS).find(k => MOCK_USERS[k].id === approval.requesterId) || ''];

    return (
      <div key={approval.id} className="bg-white dark:bg-ink p-6 rounded-2xl border border-gray-200 dark:border-ink-light shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-ink-light flex items-center justify-center text-gray-500">
              {getDepartmentIcon(approval.department)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{approval.title}</h3>
              <div className="text-xs text-gray-500 flex items-center space-x-2 mt-1">
                <span>{requester?.name}</span>
                <span>•</span>
                <span>{approval.department}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={clsx("text-[10px] uppercase font-bold px-2 py-1 rounded", getPriorityColor(approval.priority))}>
              {approval.priority}
            </span>
            <span 
              className={clsx(
                "px-2.5 py-1 rounded-full text-xs font-semibold capitalize",
                approval.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' :
                approval.status === 'Rejected' ? 'bg-red-50 text-red-700' :
                approval.status === 'Pending' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-700'
              )}
            >
              {approval.status}
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 line-clamp-2">
          {approval.description}
        </p>

        {approval.dueDate && (
          <div className="flex items-center text-xs font-medium text-gray-500 mb-6">
            <Clock className="w-4 h-4 mr-2" />
            Due: {formatMessageTime(approval.dueDate)}
          </div>
        )}

        {(approval.status === 'Pending' || approval.status === 'Waiting Review') ? (
          <div className="flex items-center space-x-3 pt-4 border-t border-gray-100 dark:border-ink-light">
            <GoldButton className="flex-1 justify-center py-2">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Approve
            </GoldButton>
            <GhostButton className="flex-1 justify-center py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </GhostButton>
          </div>
        ) : (
          <div className="flex items-center space-x-3 pt-4 border-t border-gray-100 dark:border-ink-light justify-center">
            <span className="text-sm font-medium text-gray-500">
              Processed on {new Date().toLocaleDateString()}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 dark:bg-ink-dark/30">
      <div className="h-16 border-b border-gray-100 dark:border-ink-light bg-white dark:bg-ink flex items-center justify-between px-6 shrink-0">
        <h2 className="text-[15px] font-semibold text-gray-900 dark:text-white">Enterprise Approvals</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        
        <section>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 px-1">Action Required</h3>
          {pendingApprovals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingApprovals.map(renderApprovalCard)}
            </div>
          ) : (
            <div className="bg-white dark:bg-ink rounded-2xl border border-gray-200 dark:border-ink-light p-8 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">All caught up</h4>
              <p className="text-gray-500 text-sm">You have no pending approvals requiring your attention.</p>
            </div>
          )}
        </section>

        <section>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 px-1 mt-8">Recent History</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75">
            {pastApprovals.map(renderApprovalCard)}
          </div>
        </section>

      </div>
    </div>
  );
};

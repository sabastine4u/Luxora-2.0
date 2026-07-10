import { ExternalLink, CheckCircle2, UserCircle2, Building2, MessageSquare, Paperclip, Clock, ShieldAlert } from 'lucide-react';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { Modal } from '../../../components/ui/Modal';
import { formatMessageTime } from '../../CommunicationCenter/utils/formatter';
import type { Approval } from '../types/workflowTypes';
import { MOCK_USERS, MOCK_DEPARTMENTS, MOCK_WORKFLOWS } from '../data/mockData';
import { WorkflowStatusBadge } from './WorkflowStatusBadge';
import { clsx } from 'clsx';
import { ActivityTimeline } from '../../../components/dashboard/shared/timelines/ActivityTimeline';

interface ApprovalDetailPanelProps {
  approval: Approval | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: string, notes: string) => void;
  onReject: (id: string, notes: string) => void;
}

export const ApprovalDetailPanel = ({ approval, isOpen, onClose, onApprove, onReject }: ApprovalDetailPanelProps) => {
  if (!approval) return null;

  const requester = MOCK_USERS[approval.requesterId as keyof typeof MOCK_USERS];
  const reviewer = MOCK_USERS[approval.reviewerId as keyof typeof MOCK_USERS];
  const department = MOCK_DEPARTMENTS.find(d => d.id === approval.departmentId);
  const workflow = MOCK_WORKFLOWS.find(w => w.id === approval.workflowId);

  const historyItems = approval.history.map(h => {
    const user = MOCK_USERS[h.reviewerId as keyof typeof MOCK_USERS];
    return {
      title: `${h.action} by ${user?.name || 'System'}`,
      desc: h.notes,
      time: formatMessageTime(h.timestamp),
      icon: h.action === 'Approved' ? CheckCircle2 : h.action === 'Rejected' ? ShieldAlert : h.action === 'Commented' ? MessageSquare : Clock,
      color: h.action === 'Approved' ? 'text-emerald-500' : h.action === 'Rejected' ? 'text-red-500' : 'text-blue-500'
    };
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Approval #${approval.id}`} size="xl">
      <div className="flex flex-col md:flex-row h-[70vh] max-h-[800px]">
        {/* Left Column: Details */}
        <div className="w-full md:w-3/5 p-6 overflow-y-auto border-r border-gray-100 dark:border-ink-light space-y-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <WorkflowStatusBadge status={approval.status} />
              <span className={clsx("px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border", 
                approval.priority === 'Critical' ? 'bg-red-50 text-red-600 border-red-200' :
                'bg-gray-50 text-gray-600 border-gray-200'
              )}>
                {approval.priority} Priority
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{approval.title}</h2>
            <p className="text-gray-600 dark:text-gray-400">{approval.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-ink-light/20 p-4 rounded-xl border border-gray-100 dark:border-ink-light">
              <span className="text-xs text-gray-500 font-medium block mb-2">Requester</span>
              <div className="flex items-center">
                {requester?.avatar ? (
                  <img src={requester.avatar} alt="" className="w-8 h-8 rounded-full mr-3" />
                ) : <UserCircle2 className="w-8 h-8 mr-3 text-gray-400" />}
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white text-sm">{requester?.name}</div>
                  <div className="text-xs text-gray-500">{requester?.role}</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-ink-light/20 p-4 rounded-xl border border-gray-100 dark:border-ink-light">
              <span className="text-xs text-gray-500 font-medium block mb-2">Reviewer</span>
              <div className="flex items-center">
                {reviewer?.avatar ? (
                  <img src={reviewer.avatar} alt="" className="w-8 h-8 rounded-full mr-3" />
                ) : <UserCircle2 className="w-8 h-8 mr-3 text-gray-400" />}
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white text-sm">{reviewer?.name}</div>
                  <div className="text-xs text-gray-500">{reviewer?.role}</div>
                </div>
              </div>
            </div>
          </div>

          {workflow && (
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Related Workflow</h3>
              <div className="border border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-semibold text-blue-900 dark:text-blue-400">{workflow.title}</div>
                  <div className="text-xs text-blue-600 dark:text-blue-500 flex items-center mt-1">
                    <Building2 className="w-3.5 h-3.5 mr-1.5" />
                    {department?.name} Department
                  </div>
                </div>
                <GhostButton size="sm" className="text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30">
                  View full workflow <ExternalLink className="w-4 h-4 ml-1.5" />
                </GhostButton>
              </div>
            </div>
          )}

          <div>
             <h3 className="font-bold text-gray-900 dark:text-white mb-4">Attached Documents</h3>
             <div className="border border-gray-200 dark:border-ink-light rounded-xl overflow-hidden divide-y divide-gray-100 dark:divide-ink-light">
                <div className="p-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-ink-light/20 transition-colors cursor-pointer">
                   <div className="flex items-center">
                      <Paperclip className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Revised_Budget_Q3.pdf</span>
                   </div>
                   <span className="text-xs text-gray-400">1.2 MB</span>
                </div>
                <div className="p-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-ink-light/20 transition-colors cursor-pointer">
                   <div className="flex items-center">
                      <Paperclip className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Vendor_Quotes_Summary.xlsx</span>
                   </div>
                   <span className="text-xs text-gray-400">450 KB</span>
                </div>
             </div>
          </div>
        </div>

        {/* Right Column: Timeline & Actions */}
        <div className="w-full md:w-2/5 flex flex-col bg-gray-50/50 dark:bg-ink-light/5">
          <div className="flex-1 overflow-y-auto p-6 border-b border-gray-100 dark:border-ink-light">
             <h3 className="font-bold text-gray-900 dark:text-white mb-6">Approval History</h3>
             <ActivityTimeline items={historyItems} />
          </div>
          
          <div className="p-6 bg-white dark:bg-ink">
             {(approval.status === 'Pending' || approval.status === 'In Review') ? (
               <div className="space-y-4">
                 <textarea 
                   placeholder="Add notes for your decision (Optional)..."
                   className="w-full bg-gray-50 dark:bg-ink-light border border-gray-200 dark:border-ink-light/50 rounded-xl p-3 text-sm focus:outline-none focus:border-gold-500 focus:bg-white dark:focus:bg-ink transition-colors resize-none h-24"
                   id="approvalNotes"
                 />
                 <div className="flex space-x-3">
                    <GhostButton 
                      className="flex-1 justify-center text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={() => {
                        const notes = (document.getElementById('approvalNotes') as HTMLTextAreaElement)?.value || 'Rejected.';
                        onReject(approval.id, notes);
                      }}
                    >
                      Reject
                    </GhostButton>
                    <GoldButton 
                      className="flex-1 justify-center"
                      onClick={() => {
                        const notes = (document.getElementById('approvalNotes') as HTMLTextAreaElement)?.value || 'Approved.';
                        onApprove(approval.id, notes);
                      }}
                    >
                      Approve
                    </GoldButton>
                 </div>
               </div>
             ) : (
               <div className="text-center py-4 bg-gray-50 dark:bg-ink-light rounded-xl border border-gray-200 dark:border-ink-light/50">
                 <CheckCircle2 className={clsx("w-8 h-8 mx-auto mb-2", approval.status === 'Approved' ? "text-emerald-500" : "text-gray-400")} />
                 <span className="font-semibold text-gray-900 dark:text-white">This request has been {approval.status.toLowerCase()}.</span>
               </div>
             )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

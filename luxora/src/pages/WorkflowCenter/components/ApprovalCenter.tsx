import { useState } from 'react';
import { useWorkflowCenter } from '../hooks/useWorkflowCenter';
import { ApprovalCard } from './ApprovalCard';
import { ApprovalDetailPanel } from './ApprovalDetailPanel';
import { WorkflowSearch } from './WorkflowSearch';
import type { Approval } from '../types/workflowTypes';

export const ApprovalCenter = () => {
  const { approvals, searchQuery, setSearchQuery, actions } = useWorkflowCenter();
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null);

  const filteredApprovals = approvals.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-white dark:bg-ink">
      <div className="p-6 border-b border-gray-100 dark:border-ink-light shrink-0">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Approval Center</h1>
        <WorkflowSearch query={searchQuery} onChange={setSearchQuery} placeholder="Search approvals by request, department, or reviewer..." />
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApprovals.map(approval => (
            <ApprovalCard 
              key={approval.id} 
              approval={approval} 
              onClick={(a) => setSelectedApproval(a)}
              onApprove={(id) => actions.approveAction(id, "Approved from center.")}
              onReject={(id) => actions.rejectAction(id, "Rejected from center.")}
            />
          ))}
        </div>
      </div>

      <ApprovalDetailPanel 
        approval={selectedApproval} 
        isOpen={selectedApproval !== null}
        onClose={() => setSelectedApproval(null)}
        onApprove={(id, notes) => { actions.approveAction(id, notes); setSelectedApproval(null); }}
        onReject={(id, notes) => { actions.rejectAction(id, notes); setSelectedApproval(null); }}
      />
    </div>
  );
};

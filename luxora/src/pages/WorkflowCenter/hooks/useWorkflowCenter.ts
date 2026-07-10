import { useState } from 'react';
import { MOCK_WORKFLOWS, MOCK_APPROVALS, MOCK_TASKS, MOCK_ESCALATIONS, MOCK_TEMPLATES } from '../data/mockData';
import type { WorkflowWorkspace } from '../constants/workflowConstants';

export const useWorkflowCenter = () => {
  const [activeWorkspace, setActiveWorkspace] = useState<WorkflowWorkspace>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [workflows] = useState(MOCK_WORKFLOWS);
  const [approvals, setApprovals] = useState(MOCK_APPROVALS);
  const [tasks] = useState(MOCK_TASKS);
  const [escalations] = useState(MOCK_ESCALATIONS);
  const [templates] = useState(MOCK_TEMPLATES);

  // Derived state for metrics
  const activeWorkflowsCount = workflows.filter(w => !['Completed', 'Archived', 'Rejected'].includes(w.status)).length;
  const pendingApprovalsCount = approvals.filter(a => a.status === 'Pending' || a.status === 'In Review').length;
  const escalationCount = escalations.filter(e => e.status === 'Active').length;

  const approveAction = (approvalId: string, notes: string) => {
    setApprovals(prev => prev.map(a => 
      a.id === approvalId 
        ? { 
            ...a, 
            status: 'Approved', 
            history: [...a.history, { 
              id: `hist_${Date.now()}`, 
              approvalId, 
              reviewerId: 'usr_admin', 
              action: 'Approved', 
              notes, 
              timestamp: new Date().toISOString() 
            }] 
          } 
        : a
    ));
  };

  const rejectAction = (approvalId: string, notes: string) => {
    setApprovals(prev => prev.map(a => 
      a.id === approvalId 
        ? { 
            ...a, 
            status: 'Rejected', 
            history: [...a.history, { 
              id: `hist_${Date.now()}`, 
              approvalId, 
              reviewerId: 'usr_admin', 
              action: 'Rejected', 
              notes, 
              timestamp: new Date().toISOString() 
            }] 
          } 
        : a
    ));
  };

  return {
    activeWorkspace,
    setActiveWorkspace,
    searchQuery,
    setSearchQuery,
    workflows,
    approvals,
    tasks,
    escalations,
    templates,
    metrics: {
      activeWorkflowsCount,
      pendingApprovalsCount,
      escalationCount
    },
    actions: {
      approveAction,
      rejectAction
    }
  };
};

import type { Workflow, Approval, Task, Escalation, WorkflowTemplate, Department } from '../types/workflowTypes';

const now = new Date();
const timeMinus = (hours: number) => new Date(now.getTime() - hours * 60 * 60 * 1000).toISOString();
const timePlus = (hours: number) => new Date(now.getTime() + hours * 60 * 60 * 1000).toISOString();

export const MOCK_DEPARTMENTS: Department[] = [
  { id: 'dept_sales', name: 'Sales' },
  { id: 'dept_agencies', name: 'Agencies' },
  { id: 'dept_finance', name: 'Finance' },
  { id: 'dept_procurement', name: 'Procurement' },
  { id: 'dept_compliance', name: 'Compliance' },
  { id: 'dept_marketing', name: 'Marketing' },
  { id: 'dept_support', name: 'Support' },
  { id: 'dept_executive', name: 'Executive' },
];

export const MOCK_USERS = {
  'usr_admin': { id: 'usr_admin', name: 'Sarah Chen', role: 'Super Admin', department: 'Executive', avatar: 'https://i.pravatar.cc/150?u=sarah' },
  'usr_manager': { id: 'usr_manager', name: 'Michael Ross', role: 'Management', department: 'Sales', avatar: 'https://i.pravatar.cc/150?u=mike' },
  'usr_compliance': { id: 'usr_compliance', name: 'Elena Rodriguez', role: 'Compliance Officer', department: 'Compliance', avatar: 'https://i.pravatar.cc/150?u=elena' },
  'usr_finance': { id: 'usr_finance', name: 'David Kim', role: 'Finance Director', department: 'Finance', avatar: 'https://i.pravatar.cc/150?u=david' },
  'usr_procurement': { id: 'usr_procurement', name: 'James Wilson', role: 'Procurement Head', department: 'Procurement', avatar: 'https://i.pravatar.cc/150?u=james' },
};

export const MOCK_WORKFLOWS: Workflow[] = [
  {
    id: 'wf_001',
    title: 'Victoria Island Villa Listing Approval',
    description: 'Full review and approval process for premium listing at Victoria Island.',
    category: 'Listing',
    status: 'In Review',
    priority: 'High',
    initiatorId: 'usr_manager',
    departmentId: 'dept_sales',
    relatedEntityId: 'prop_123',
    createdAt: timeMinus(48),
    updatedAt: timeMinus(2),
    dueDate: timePlus(24),
    progress: 40,
    steps: [
      { id: 'step_1', workflowId: 'wf_001', title: 'Initial Submission', description: 'Listing details submitted by agent.', departmentId: 'dept_sales', status: 'Completed', order: 1, isCurrent: false, completedAt: timeMinus(47) },
      { id: 'step_2', workflowId: 'wf_001', title: 'Compliance Check', description: 'Verify property documents and title.', departmentId: 'dept_compliance', assigneeId: 'usr_compliance', status: 'In Progress', order: 2, isCurrent: true, dueDate: timePlus(12) },
      { id: 'step_3', workflowId: 'wf_001', title: 'Management Approval', description: 'Final sign-off before publishing.', departmentId: 'dept_executive', status: 'Pending', order: 3, isCurrent: false },
    ]
  },
  {
    id: 'wf_002',
    title: 'Q3 Enterprise Marketing Campaign Budget',
    description: 'Procurement and finance review for upcoming marketing push.',
    category: 'Finance',
    status: 'Pending Approval',
    priority: 'Critical',
    initiatorId: 'usr_admin',
    departmentId: 'dept_marketing',
    createdAt: timeMinus(72),
    updatedAt: timeMinus(5),
    dueDate: timePlus(48),
    progress: 75,
    steps: [
      { id: 'step_4', workflowId: 'wf_002', title: 'Budget Proposal', description: 'Marketing submits budget.', departmentId: 'dept_marketing', status: 'Completed', order: 1, isCurrent: false, completedAt: timeMinus(70) },
      { id: 'step_5', workflowId: 'wf_002', title: 'Procurement Review', description: 'Review vendor contracts.', departmentId: 'dept_procurement', assigneeId: 'usr_procurement', status: 'Completed', order: 2, isCurrent: false, completedAt: timeMinus(24) },
      { id: 'step_6', workflowId: 'wf_002', title: 'Finance Final Approval', description: 'Approve release of funds.', departmentId: 'dept_finance', assigneeId: 'usr_finance', status: 'In Review', order: 3, isCurrent: true, dueDate: timePlus(24) },
    ]
  },
  {
    id: 'wf_003',
    title: 'Agency Onboarding: Prime Realty Ltd',
    description: 'End-to-end verification and onboarding process for new partner agency.',
    category: 'Agency',
    status: 'Active',
    priority: 'Medium',
    initiatorId: 'usr_manager',
    departmentId: 'dept_agencies',
    createdAt: timeMinus(12),
    updatedAt: timeMinus(1),
    dueDate: timePlus(168),
    progress: 15,
    steps: [
      { id: 'step_7', workflowId: 'wf_003', title: 'Document Collection', description: 'Collect CAC and directorship docs.', departmentId: 'dept_agencies', status: 'In Progress', order: 1, isCurrent: true },
      { id: 'step_8', workflowId: 'wf_003', title: 'Compliance Verification', description: 'Background checks.', departmentId: 'dept_compliance', status: 'Pending', order: 2, isCurrent: false },
      { id: 'step_9', workflowId: 'wf_003', title: 'Account Activation', description: 'Create platform credentials.', departmentId: 'dept_support', status: 'Pending', order: 3, isCurrent: false },
    ]
  }
];

export const MOCK_APPROVALS: Approval[] = [
  {
    id: 'app_001',
    workflowId: 'wf_002',
    stepId: 'step_6',
    title: 'Approve Q3 Marketing Budget',
    description: 'Final sign-off required for ₦45,000,000 marketing campaign allocation.',
    requesterId: 'usr_manager',
    reviewerId: 'usr_finance',
    departmentId: 'dept_finance',
    status: 'In Review',
    priority: 'Critical',
    dueDate: timePlus(24),
    createdAt: timeMinus(24),
    updatedAt: timeMinus(5),
    history: [
      { id: 'hist_1', approvalId: 'app_001', reviewerId: 'usr_manager', action: 'Created', notes: 'Submitted for finance review after procurement clearance.', timestamp: timeMinus(24) },
      { id: 'hist_2', approvalId: 'app_001', reviewerId: 'usr_finance', action: 'Commented', notes: 'Reviewing the revised vendor quotes.', timestamp: timeMinus(5) }
    ]
  },
  {
    id: 'app_002',
    workflowId: 'wf_001',
    stepId: 'step_2',
    title: 'Compliance Clearance: Victoria Island Listing',
    description: 'Verify C of O and related ownership documentation before publishing.',
    requesterId: 'usr_manager',
    reviewerId: 'usr_compliance',
    departmentId: 'dept_compliance',
    status: 'Pending',
    priority: 'High',
    dueDate: timePlus(12),
    createdAt: timeMinus(47),
    updatedAt: timeMinus(47),
    history: [
      { id: 'hist_3', approvalId: 'app_002', reviewerId: 'usr_manager', action: 'Created', notes: 'Documents uploaded and ready for review.', timestamp: timeMinus(47) }
    ]
  }
];

export const MOCK_TASKS: Task[] = [
  {
    id: 'task_001',
    workflowId: 'wf_003',
    stepId: 'step_7',
    title: 'Follow up on Agency Documents',
    description: 'Call Prime Realty Ltd to expedite CAC document submission.',
    assigneeId: 'usr_manager',
    departmentId: 'dept_agencies',
    status: 'Pending',
    priority: 'Medium',
    dueDate: timePlus(24),
    estimatedCompletion: timePlus(48),
    createdAt: timeMinus(2)
  },
  {
    id: 'task_002',
    workflowId: 'wf_001',
    stepId: 'step_2',
    title: 'Title Deed Verification',
    description: 'Cross-check title deed with Lagos State Land Registry.',
    assigneeId: 'usr_compliance',
    departmentId: 'dept_compliance',
    status: 'In Progress',
    priority: 'High',
    dueDate: timePlus(8),
    estimatedCompletion: timePlus(6),
    createdAt: timeMinus(20)
  }
];

export const MOCK_ESCALATIONS: Escalation[] = [
  {
    id: 'esc_001',
    workflowId: 'wf_001',
    taskId: 'task_002',
    reason: 'SLA Breach on Document Verification',
    level: 'Level 1',
    escalatedBy: 'System',
    escalatedTo: 'usr_admin',
    timestamp: timeMinus(2),
    status: 'Active'
  }
];

export const MOCK_TEMPLATES: WorkflowTemplate[] = [
  {
    id: 'tpl_001',
    title: 'Standard Property Listing',
    description: 'Default 3-step approval process for new properties.',
    category: 'Listing',
    estimatedDurationDays: 3,
    defaultSteps: [
      { title: 'Agent Submission', description: 'Submit property details.', departmentId: 'dept_sales', order: 1 },
      { title: 'Compliance Review', description: 'Verify documents.', departmentId: 'dept_compliance', order: 2 },
      { title: 'Final Publish', description: 'Publish to live site.', departmentId: 'dept_sales', order: 3 }
    ]
  }
];

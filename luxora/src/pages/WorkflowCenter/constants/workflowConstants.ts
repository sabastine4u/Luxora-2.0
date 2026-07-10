import type { WorkflowStatus, WorkflowPriority, WorkflowCategory, TaskStatus, ApprovalStatus, EscalationLevel } from '../types/workflowTypes';

export const WORKFLOW_STATUSES: WorkflowStatus[] = ['Draft', 'Active', 'Pending Approval', 'In Review', 'Escalated', 'Completed', 'Rejected', 'Archived'];
export const WORKFLOW_PRIORITIES: WorkflowPriority[] = ['Low', 'Medium', 'High', 'Critical'];
export const WORKFLOW_CATEGORIES: WorkflowCategory[] = ['Property', 'Listing', 'Agency', 'Agent', 'Buyer', 'Owner', 'Procurement', 'Finance', 'Compliance', 'Deal', 'HR', 'System'];
export const TASK_STATUSES: TaskStatus[] = ['Pending', 'In Progress', 'In Review', 'Completed', 'Blocked'];
export const APPROVAL_STATUSES: ApprovalStatus[] = ['Pending', 'In Review', 'Approved', 'Rejected', 'Returned', 'Escalated', 'Completed'];
export const ESCALATION_LEVELS: EscalationLevel[] = ['Level 1', 'Level 2', 'Executive'];

export const DEPARTMENTS = {
  SALES: 'dept_sales',
  AGENCIES: 'dept_agencies',
  FINANCE: 'dept_finance',
  PROCUREMENT: 'dept_procurement',
  COMPLIANCE: 'dept_compliance',
  MARKETING: 'dept_marketing',
  SUPPORT: 'dept_support',
  EXECUTIVE: 'dept_executive',
} as const;

export const WORKFLOW_NAV_ITEMS = [
  { id: 'dashboard', label: 'Workflow Dashboard', icon: 'LayoutDashboard' },
  { id: 'approvals', label: 'Approval Center', icon: 'CheckCircle' },
  { id: 'tasks', label: 'Task Assignment', icon: 'ClipboardList' },
  { id: 'builder', label: 'Workflow Builder', icon: 'GitMerge' },
  { id: 'templates', label: 'Workflow Templates', icon: 'Copy' },
  { id: 'escalations', label: 'Escalation Center', icon: 'AlertTriangle' },
  { id: 'timeline', label: 'Workflow Timeline', icon: 'History' },
  { id: 'sla', label: 'SLA Dashboard', icon: 'Clock' },
  { id: 'analytics', label: 'Workflow Analytics', icon: 'BarChart3' },
  { id: 'departments', label: 'Department Overview', icon: 'Building2' },
  { id: 'executive', label: 'Executive Insights', icon: 'LineChart' },
] as const;

export type WorkflowWorkspace = typeof WORKFLOW_NAV_ITEMS[number]['id'];

export const SLA_THRESHOLDS = {
  CRITICAL: 2, // hours
  HIGH: 24, // hours
  MEDIUM: 48, // hours
  LOW: 168, // hours (7 days)
} as const;

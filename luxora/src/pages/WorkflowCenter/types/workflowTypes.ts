export type WorkflowStatus = 'Draft' | 'Active' | 'Pending Approval' | 'In Review' | 'Escalated' | 'Completed' | 'Rejected' | 'Archived';
export type WorkflowPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type WorkflowCategory = 'Property' | 'Listing' | 'Agency' | 'Agent' | 'Buyer' | 'Owner' | 'Procurement' | 'Finance' | 'Compliance' | 'Deal' | 'HR' | 'System';
export type TaskStatus = 'Pending' | 'In Progress' | 'In Review' | 'Completed' | 'Blocked';
export type ApprovalStatus = 'Pending' | 'In Review' | 'Approved' | 'Rejected' | 'Returned' | 'Escalated' | 'Completed';
export type EscalationLevel = 'Level 1' | 'Level 2' | 'Executive';

export interface Department {
  id: string;
  name: string;
}

export interface WorkflowStep {
  id: string;
  workflowId: string;
  title: string;
  description: string;
  departmentId: string;
  assigneeId?: string;
  status: TaskStatus;
  order: number;
  isCurrent: boolean;
  dueDate?: string;
  completedAt?: string;
}

export interface Workflow {
  id: string;
  title: string;
  description: string;
  category: WorkflowCategory;
  status: WorkflowStatus;
  priority: WorkflowPriority;
  initiatorId: string;
  departmentId: string;
  relatedEntityId?: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  completedAt?: string;
  steps: WorkflowStep[];
  progress: number; // 0-100
}

export interface WorkflowTemplate {
  id: string;
  title: string;
  description: string;
  category: WorkflowCategory;
  defaultSteps: Omit<WorkflowStep, 'id' | 'workflowId' | 'status' | 'isCurrent' | 'completedAt'>[];
  estimatedDurationDays: number;
}

export interface ApprovalHistory {
  id: string;
  approvalId: string;
  reviewerId: string;
  action: 'Created' | 'Assigned' | 'Approved' | 'Rejected' | 'Returned' | 'Escalated' | 'Commented';
  notes: string;
  timestamp: string;
}

export interface Approval {
  id: string;
  workflowId: string;
  stepId: string;
  title: string;
  description: string;
  requesterId: string;
  reviewerId: string;
  departmentId: string;
  status: ApprovalStatus;
  priority: WorkflowPriority;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  history: ApprovalHistory[];
}

export interface Task {
  id: string;
  workflowId: string;
  stepId: string;
  title: string;
  description: string;
  assigneeId: string;
  departmentId: string;
  status: TaskStatus;
  priority: WorkflowPriority;
  dueDate: string;
  estimatedCompletion: string;
  createdAt: string;
}

export interface Escalation {
  id: string;
  workflowId: string;
  taskId?: string;
  approvalId?: string;
  reason: string;
  level: EscalationLevel;
  escalatedBy: string;
  escalatedTo: string;
  timestamp: string;
  status: 'Active' | 'Resolved';
}

export interface SLARecord {
  id: string;
  workflowId: string;
  departmentId: string;
  expectedDurationMinutes: number;
  actualDurationMinutes?: number;
  breached: boolean;
  breachReason?: string;
}

export interface Assignment {
  id: string;
  userId: string;
  role: string;
  departmentId: string;
}

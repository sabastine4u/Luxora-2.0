export type NotificationSource = 'Communication' | 'Properties' | 'Listings' | 'Leads' | 'Clients' | 'Deals' | 'Appointments' | 'Agencies' | 'Finance' | 'Procurement' | 'Compliance' | 'Super Admin' | 'Management' | 'System';

export type NotificationCategory = 'Information' | 'Success' | 'Warning' | 'Error' | 'Reminder' | 'Approval' | 'Assignment' | 'Announcement' | 'Security';

export type Priority = 'low' | 'medium' | 'high' | 'critical';

export type Department = 'Sales' | 'Finance' | 'Procurement' | 'Compliance' | 'Support' | 'Management' | 'Executive' | 'Agencies';

export type ActivityStatus = 'Pending' | 'In Progress' | 'Completed' | 'Failed' | 'Archived' | 'Approved' | 'Rejected' | 'Escalated' | 'Waiting Review';

export type NotificationAction = 'Mark Read' | 'Mark Unread' | 'Archive' | 'Delete' | 'Snooze' | 'Export' | 'Approve' | 'Reject';

export interface User {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  department?: Department;
  onlineStatus: 'online' | 'offline' | 'busy' | 'away';
  lastSeen?: string;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  source: NotificationSource;
  category: NotificationCategory;
  priority: Priority;
  isRead: boolean;
  isArchived: boolean;
  isSnoozed?: boolean;
  snoozeUntil?: string;
  relatedUserId?: string;
  relatedModuleId?: string;
}

export interface Activity {
  id: string;
  actorId: string;
  action: string;
  description: string;
  timestamp: string;
  department: Department;
  source: NotificationSource;
  status: ActivityStatus;
  priority: Priority;
  relatedModuleId?: string;
}

export interface Reminder {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  assigneeId: string;
  priority: Priority;
  relatedModuleId?: string;
  isCompleted: boolean;
  type: 'Follow-up' | 'Meeting' | 'Renewal' | 'Deadline';
}

export interface Approval {
  id: string;
  requesterId: string;
  title: string;
  description: string;
  department: Department;
  priority: Priority;
  status: ActivityStatus;
  dueDate?: string;
  relatedModuleId?: string;
}

export interface WorkflowEvent {
  id: string;
  title: string;
  status: ActivityStatus;
  timestamp: string;
  description: string;
}

export interface SavedView {
  id: string;
  name: string;
  filters: Record<string, unknown>;
}

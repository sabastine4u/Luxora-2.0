import type { NotificationSource, NotificationCategory, Department, Priority } from '../types/notificationTypes';

export const NOTIFICATION_SOURCES: NotificationSource[] = [
  'System', 'Communication', 'Deals', 'Listings', 'Properties', 'Finance', 'Procurement', 'Compliance', 'Executive', 'Super Admin', 'Management', 'Agencies', 'Appointments', 'Clients', 'Leads'
] as NotificationSource[];

export const NOTIFICATION_CATEGORIES: NotificationCategory[] = [
  'Information', 'Success', 'Warning', 'Error', 'Reminder', 'Approval', 'Assignment', 'Announcement', 'Security'
];

export const DEPARTMENTS: Department[] = [
  'Sales', 'Finance', 'Procurement', 'Compliance', 'Support', 'Management', 'Executive', 'Agencies'
];

export const PRIORITIES: Priority[] = ['low', 'medium', 'high', 'critical'];

export const NAVIGATION_CATEGORIES = [
  { id: 'all', label: 'All Notifications', icon: 'Inbox' },
  { id: 'unread', label: 'Unread', icon: 'BellDot' },
  { id: 'mentions', label: 'Mentions', icon: 'AtSign' },
  { id: 'approvals', label: 'Approvals', icon: 'CheckSquare' },
  { id: 'reminders', label: 'Reminders', icon: 'Clock' },
  { id: 'activities', label: 'Activities', icon: 'Activity' },
  { id: 'executive', label: 'Executive Dashboard', icon: 'Briefcase' },
  { id: 'finance', label: 'Finance', icon: 'DollarSign' },
  { id: 'properties', label: 'Properties', icon: 'Building2' },
  { id: 'deals', label: 'Deals', icon: 'FileText' },
  { id: 'compliance', label: 'Compliance', icon: 'ShieldAlert' },
  { id: 'archived', label: 'Archived', icon: 'Archive' }
];

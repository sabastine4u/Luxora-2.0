import type { Notification, Activity, Reminder, Approval, User, WorkflowEvent } from '../types/notificationTypes';

const timeMinus = (minutes: number) => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - minutes);
  return d.toISOString();
};

const timePlus = (minutes: number) => {
  const d = new Date();
  d.setMinutes(d.getMinutes() + minutes);
  return d.toISOString();
};

export const MOCK_USERS: Record<string, User> = {
  superAdmin: { id: 'u1', name: 'Eleanor Vance', role: 'Super Admin', department: 'Executive', onlineStatus: 'online' },
  management: { id: 'u2', name: 'Marcus Sterling', role: 'Regional Manager', department: 'Management', onlineStatus: 'busy' },
  agent: { id: 'u3', name: 'Sarah Jenkins', role: 'Senior Agent', department: 'Sales', onlineStatus: 'online' },
  finance: { id: 'u4', name: 'David Chen', role: 'Financial Controller', department: 'Finance', onlineStatus: 'away', lastSeen: timeMinus(15) },
  compliance: { id: 'u5', name: 'Rachel Green', role: 'Compliance Officer', department: 'Compliance', onlineStatus: 'offline', lastSeen: timeMinus(120) },
  procurement: { id: 'u6', name: 'Tom Hardy', role: 'Procurement Specialist', department: 'Procurement', onlineStatus: 'online' },
};

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    title: 'High-Value Property Approved',
    description: 'The listing for "Victoria Island Villa" has been approved by management and is now live.',
    timestamp: timeMinus(5),
    source: 'Properties',
    category: 'Success',
    priority: 'high',
    isRead: false,
    isArchived: false,
    relatedUserId: MOCK_USERS.management.id,
  },
  {
    id: 'n2',
    title: 'Fraud Alert: Suspicious Transaction',
    description: 'A transaction for Deal #8492 originated from a high-risk IP address. Immediate review required.',
    timestamp: timeMinus(15),
    source: 'Compliance',
    category: 'Security',
    priority: 'critical',
    isRead: false,
    isArchived: false,
    relatedUserId: MOCK_USERS.compliance.id,
  },
  {
    id: 'n3',
    title: 'Commission Payment Processed',
    description: 'Your commission for the Lekki Phase 1 deal has been processed and deposited.',
    timestamp: timeMinus(120),
    source: 'Finance',
    category: 'Information',
    priority: 'medium',
    isRead: true,
    isArchived: false,
  },
  {
    id: 'n4',
    title: 'New Lead Assigned',
    description: 'A high-net-worth client from Dubai has been assigned to your portfolio.',
    timestamp: timeMinus(1440),
    source: 'Leads',
    category: 'Assignment',
    priority: 'high',
    isRead: true,
    isArchived: true,
  }
];

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 'a1',
    actorId: MOCK_USERS.agent.id,
    action: 'created listing',
    description: 'Drafted a new listing for "Ikoyi Waterfront Penthouse".',
    timestamp: timeMinus(10),
    department: 'Sales',
    source: 'Listings',
    status: 'Pending',
    priority: 'medium'
  },
  {
    id: 'a2',
    actorId: MOCK_USERS.finance.id,
    action: 'approved payment',
    description: 'Approved vendor payment #V-9021 for marketing materials.',
    timestamp: timeMinus(45),
    department: 'Finance',
    source: 'Finance',
    status: 'Approved',
    priority: 'low'
  },
  {
    id: 'a3',
    actorId: MOCK_USERS.compliance.id,
    action: 'flagged user',
    description: 'Flagged user ID #902 for missing KYC documentation.',
    timestamp: timeMinus(90),
    department: 'Compliance',
    source: 'Compliance',
    status: 'Escalated',
    priority: 'high'
  },
  {
    id: 'a4',
    actorId: MOCK_USERS.superAdmin.id,
    action: 'published announcement',
    description: 'Published Q3 Financial Objectives to the company.',
    timestamp: timeMinus(300),
    department: 'Executive',
    source: 'System',
    status: 'Completed',
    priority: 'critical'
  }
];

export const MOCK_REMINDERS: Reminder[] = [
  {
    id: 'r1',
    title: 'Client Follow-up: Mr. Al-Fayed',
    description: 'Call regarding the commercial property portfolio.',
    dueDate: timePlus(120),
    assigneeId: MOCK_USERS.agent.id,
    priority: 'high',
    isCompleted: false,
    type: 'Follow-up'
  },
  {
    id: 'r2',
    title: 'Quarterly Compliance Report',
    description: 'Submit the regional compliance audit to the board.',
    dueDate: timeMinus(1440),
    assigneeId: MOCK_USERS.compliance.id,
    priority: 'critical',
    isCompleted: false,
    type: 'Deadline'
  },
  {
    id: 'r3',
    title: 'Team Sync',
    description: 'Weekly sales pipeline review.',
    dueDate: timePlus(2880),
    assigneeId: MOCK_USERS.management.id,
    priority: 'medium',
    isCompleted: false,
    type: 'Meeting'
  }
];

export const MOCK_APPROVALS: Approval[] = [
  {
    id: 'ap1',
    requesterId: MOCK_USERS.agent.id,
    title: 'Listing Price Reduction',
    description: 'Requesting 5% price reduction on Victoria Island Villa to stimulate offers.',
    department: 'Sales',
    priority: 'high',
    status: 'Pending',
    dueDate: timePlus(240)
  },
  {
    id: 'ap2',
    requesterId: MOCK_USERS.procurement.id,
    title: 'New Agency Software License',
    description: 'Procurement of 50 enterprise licenses for CRM expansion.',
    department: 'Procurement',
    priority: 'medium',
    status: 'Waiting Review'
  },
  {
    id: 'ap3',
    requesterId: MOCK_USERS.agent.id,
    title: 'Marketing Budget Exception',
    description: 'Additional $5,000 requested for exclusive launch event.',
    department: 'Finance',
    priority: 'low',
    status: 'Rejected'
  }
];

export const MOCK_WORKFLOW: WorkflowEvent[] = [
  { id: 'we1', title: 'Listing Drafted', status: 'Completed', timestamp: timeMinus(10080), description: 'Agent created initial draft.' },
  { id: 'we2', title: 'Media Uploaded', status: 'Completed', timestamp: timeMinus(8640), description: '4K video and virtual tour attached.' },
  { id: 'we3', title: 'Management Review', status: 'Completed', timestamp: timeMinus(4320), description: 'Approved by Regional Manager.' },
  { id: 'we4', title: 'Published to Portal', status: 'Completed', timestamp: timeMinus(1440), description: 'Listing went live on Luxora portal.' },
  { id: 'we5', title: 'First Offer Received', status: 'Pending', timestamp: timeMinus(5), description: 'Awaiting agent response to initial offer.' },
];

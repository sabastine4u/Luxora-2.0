export const CRM_WORKSPACES = [
  'dashboard',
  'directory',
  'profile',
  'customer360',
  'pipeline',
  'activities',
  'analytics',
  'executive',
  'follow-ups',
  'organizations'
] as const;

export type CRMWorkspace = typeof CRM_WORKSPACES[number];

export const NAVIGATION_CATEGORIES = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { id: 'directory', label: 'All Contacts', icon: 'Users' },
  { id: 'organizations', label: 'Organizations', icon: 'Building2' },
  { id: 'pipeline', label: 'Lead Pipeline', icon: 'Kanban' },
  { id: 'activities', label: 'Activities', icon: 'Activity' },
  { id: 'follow-ups', label: 'Follow-ups', icon: 'CalendarClock' },
  { id: 'customer360', label: 'Customer 360', icon: 'Focus' },
  { id: 'analytics', label: 'Analytics', icon: 'BarChart3' },
  { id: 'executive', label: 'Executive Insights', icon: 'Sparkles' },
];

export const FILTER_CONTACT_TYPES = [
  'Buyer', 'Owner', 'Agent', 'Agency', 'Vendor', 'Investor', 
  'Developer', 'Lawyer', 'FinancialInstitution', 'Lead'
];

export const LEAD_SOURCES = [
  'Website Referral', 'Social Media', 'Direct Call', 'Walk-in', 'Event', 'Partner Agency'
];

export const INDUSTRIES = [
  'Real Estate', 'Finance', 'Legal', 'Construction', 'Technology', 'Government', 'Retail'
];

export const PIPELINE_STAGES = [
  { id: 'New', label: 'New', color: 'border-blue-500' },
  { id: 'Qualified', label: 'Qualified', color: 'border-indigo-500' },
  { id: 'Engaged', label: 'Engaged', color: 'border-purple-500' },
  { id: 'Negotiating', label: 'Negotiating', color: 'border-yellow-500' },
  { id: 'Closed Won', label: 'Closed Won', color: 'border-emerald-500' },
  { id: 'Closed Lost', label: 'Closed Lost', color: 'border-red-500' }
];

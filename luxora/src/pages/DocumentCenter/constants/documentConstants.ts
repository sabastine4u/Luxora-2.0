export const DOCUMENT_CATEGORIES = [
  'Property Images',
  'Floor Plans',
  'Contracts',
  'Legal Documents',
  'Internal Policies',
  'Marketing',
  'HR',
  'Finance',
  'Procurement'
] as const;

export const ASSET_TYPES = [
  'Image',
  'Video',
  'PDF',
  'Word',
  'Excel',
  'CAD',
  'Audio',
  'Unknown'
] as const;

export const DEPARTMENTS = [
  { id: 'dept-exec', name: 'Executive' },
  { id: 'dept-sales', name: 'Sales & Leasing' },
  { id: 'dept-finance', name: 'Finance' },
  { id: 'dept-legal', name: 'Legal & Compliance' },
  { id: 'dept-hr', name: 'Human Resources' },
  { id: 'dept-marketing', name: 'Marketing' },
  { id: 'dept-procurement', name: 'Procurement' },
  { id: 'dept-prop-mgmt', name: 'Property Management' }
] as const;

export const PERMISSION_LEVELS = ['View', 'Comment', 'Edit', 'Manage'] as const;

export const APPROVAL_STATUSES = ['Draft', 'Pending', 'Approved', 'Rejected', 'Requires Changes'] as const;

export type DocumentWorkspace = 'dashboard' | 'explorer' | 'library' | 'preview' | 'versions' | 'approvals' | 'sharing' | 'audit' | 'analytics' | 'executive' | 'recent' | 'favorites' | 'archives' | 'trash';

export const NAVIGATION_CATEGORIES = [
  { id: 'explorer', label: 'Folder Explorer', icon: 'FolderTree' },
  { id: 'recent', label: 'Recent Files', icon: 'Clock' },
  { id: 'favorites', label: 'Favorites', icon: 'Star' },
  { id: 'shared', label: 'Shared with Me', icon: 'Users' },
  { id: 'approvals', label: 'Approval Center', icon: 'CheckCircle' },
  { id: 'archives', label: 'Archives', icon: 'Archive' },
  { id: 'trash', label: 'Trash', icon: 'Trash2' },
] as const;

export const SORT_OPTIONS = [
  { id: 'name_asc', label: 'Name (A-Z)' },
  { id: 'name_desc', label: 'Name (Z-A)' },
  { id: 'date_desc', label: 'Newest First' },
  { id: 'date_asc', label: 'Oldest First' },
  { id: 'size_desc', label: 'Size (Largest)' },
  { id: 'size_asc', label: 'Size (Smallest)' },
];

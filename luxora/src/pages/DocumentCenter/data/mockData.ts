import type { Document, FolderNode, Tag, FileVersion, AuditLog, DocumentApproval, SharingRecord } from '../types/documentTypes';

export const MOCK_USERS = {
  'user-1': { id: 'user-1', name: 'Sarah Jenkins', avatar: 'https://i.pravatar.cc/150?u=sarah' },
  'user-2': { id: 'user-2', name: 'Michael Chen', avatar: 'https://i.pravatar.cc/150?u=michael' },
  'user-3': { id: 'user-3', name: 'Emma Davis', avatar: 'https://i.pravatar.cc/150?u=emma' },
  'user-4': { id: 'user-4', name: 'James Wilson', avatar: 'https://i.pravatar.cc/150?u=james' },
};

export const MOCK_DEPARTMENTS = [
  { id: 'dept-exec', name: 'Executive' },
  { id: 'dept-sales', name: 'Sales & Leasing' },
  { id: 'dept-finance', name: 'Finance' },
  { id: 'dept-legal', name: 'Legal & Compliance' },
  { id: 'dept-hr', name: 'Human Resources' },
  { id: 'dept-marketing', name: 'Marketing' },
  { id: 'dept-procurement', name: 'Procurement' },
  { id: 'dept-prop-mgmt', name: 'Property Management' }
];


export const MOCK_TAGS: Tag[] = [
  { id: 'tag-1', name: 'Confidential', color: 'bg-red-100 text-red-700' },
  { id: 'tag-2', name: 'Q3 2026', color: 'bg-blue-100 text-blue-700' },
  { id: 'tag-3', name: 'Client Facing', color: 'bg-emerald-100 text-emerald-700' },
  { id: 'tag-4', name: 'Draft', color: 'bg-gray-100 text-gray-700' },
  { id: 'tag-5', name: 'High Priority', color: 'bg-orange-100 text-orange-700' }
];

export const MOCK_FOLDERS: FolderNode[] = [
  { id: 'folder-root', name: 'Enterprise Root', parentId: null, isRestricted: false, createdAt: new Date().toISOString() },
  { id: 'folder-legal', name: 'Legal & Compliance', parentId: 'folder-root', departmentId: 'dept-legal', isRestricted: true, createdAt: new Date().toISOString() },
  { id: 'folder-properties', name: 'Properties', parentId: 'folder-root', isRestricted: false, createdAt: new Date().toISOString() },
  { id: 'folder-prop-1', name: 'The Azure Tower', parentId: 'folder-properties', isRestricted: false, createdAt: new Date().toISOString() },
  { id: 'folder-marketing', name: 'Marketing Assets', parentId: 'folder-root', departmentId: 'dept-marketing', isRestricted: false, createdAt: new Date().toISOString() },
];

export const MOCK_DOCUMENTS: Document[] = [
  {
    id: 'doc-1',
    name: 'Azure Tower - Penthouse Floor Plan.pdf',
    folderId: 'folder-prop-1',
    assetType: 'PDF',
    category: 'Floor Plans',
    sizeBytes: 4500000,
    tags: [MOCK_TAGS[2]],
    metadata: {
      created: new Date(Date.now() - 864000000).toISOString(),
      lastModified: new Date(Date.now() - 3600000).toISOString(),
      ownerId: 'user-1',
      departmentId: 'dept-prop-mgmt',
      relatedEntities: [{ type: 'Property', id: 'prop-1', name: 'The Azure Tower' }],
      retentionStatus: 'Active',
      storageLocation: 'Cloud'
    },
    currentVersion: 3,
    approvalStatus: 'Approved',
    isShared: true,
    isFavorite: true
  },
  {
    id: 'doc-2',
    name: 'Q3 Sales Forecast & Commission Policy.xlsx',
    folderId: 'folder-root',
    assetType: 'Excel',
    category: 'Finance',
    sizeBytes: 1200000,
    tags: [MOCK_TAGS[0], MOCK_TAGS[1]],
    metadata: {
      created: new Date(Date.now() - 1500000000).toISOString(),
      lastModified: new Date(Date.now() - 86400000).toISOString(),
      ownerId: 'user-2',
      departmentId: 'dept-finance',
      relatedEntities: [],
      retentionStatus: 'Active',
      storageLocation: 'Cloud'
    },
    currentVersion: 1,
    approvalStatus: 'Pending',
    isShared: false,
    isFavorite: false
  },
  {
    id: 'doc-3',
    name: 'Standard Lease Agreement - Template 2026.docx',
    folderId: 'folder-legal',
    assetType: 'Word',
    category: 'Legal Documents',
    sizeBytes: 850000,
    tags: [MOCK_TAGS[0], MOCK_TAGS[4]],
    metadata: {
      created: new Date(Date.now() - 3000000000).toISOString(),
      lastModified: new Date(Date.now() - 500000000).toISOString(),
      ownerId: 'user-3',
      departmentId: 'dept-legal',
      relatedEntities: [],
      retentionStatus: 'Active',
      storageLocation: 'Cloud'
    },
    currentVersion: 5,
    approvalStatus: 'Approved',
    isShared: true,
    isFavorite: true
  },
  {
    id: 'doc-4',
    name: 'Azure Tower - Promo Video (Final).mp4',
    folderId: 'folder-marketing',
    assetType: 'Video',
    category: 'Marketing',
    sizeBytes: 154000000,
    tags: [MOCK_TAGS[2]],
    metadata: {
      created: new Date(Date.now() - 200000000).toISOString(),
      lastModified: new Date(Date.now() - 10000000).toISOString(),
      ownerId: 'user-4',
      departmentId: 'dept-marketing',
      relatedEntities: [{ type: 'Property', id: 'prop-1', name: 'The Azure Tower' }],
      retentionStatus: 'Active',
      storageLocation: 'Cloud'
    },
    currentVersion: 2,
    approvalStatus: 'Approved',
    isShared: true,
    isFavorite: false
  }
];

export const MOCK_VERSIONS: FileVersion[] = [
  { id: 'ver-1', documentId: 'doc-1', versionNumber: 3, uploadedBy: 'user-1', timestamp: new Date(Date.now() - 3600000).toISOString(), sizeBytes: 4500000, status: 'Current', changeSummary: 'Updated master bedroom dimensions.' },
  { id: 'ver-2', documentId: 'doc-1', versionNumber: 2, uploadedBy: 'user-1', timestamp: new Date(Date.now() - 86400000).toISOString(), sizeBytes: 4400000, status: 'Superseded', changeSummary: 'Fixed balcony layout.' },
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: 'audit-1', documentId: 'doc-1', userId: 'user-2', action: 'Viewed', timestamp: new Date(Date.now() - 1800000).toISOString() },
  { id: 'audit-2', documentId: 'doc-1', userId: 'user-1', action: 'Edited', timestamp: new Date(Date.now() - 3600000).toISOString(), details: 'Uploaded v3' },
];

export const MOCK_APPROVALS: DocumentApproval[] = [
  { id: 'appr-1', documentId: 'doc-2', approverId: 'user-3', status: 'Pending', timestamp: new Date(Date.now() - 86400000).toISOString() }
];

export const MOCK_SHARING: SharingRecord[] = [
  { id: 'share-1', documentId: 'doc-3', sharedBy: 'user-3', sharedWith: ['user-1', 'user-2'], permissions: 'View', isPublicLink: false }
];

export type AssetType = 'Image' | 'Video' | 'PDF' | 'Word' | 'Excel' | 'CAD' | 'Audio' | 'Unknown';
export type ApprovalStatus = 'Draft' | 'Pending' | 'Approved' | 'Rejected' | 'Requires Changes';
export type PermissionLevel = 'View' | 'Comment' | 'Edit' | 'Manage';
export type Category = 'Property Images' | 'Floor Plans' | 'Contracts' | 'Legal Documents' | 'Internal Policies' | 'Marketing' | 'HR' | 'Finance' | 'Procurement';
export type RetentionStatus = 'Active' | 'Archived' | 'Pending Deletion';
export type StorageLocation = 'Cloud' | 'Local' | 'Glacier';
export type VersionStatus = 'Current' | 'Superseded' | 'Draft';

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Department {
  id: string;
  name: string;
}

export interface RelatedEntity {
  type: 'Property' | 'Client' | 'Deal' | 'Workflow' | 'Conversation';
  id: string;
  name: string;
}

export interface Permission {
  userId: string;
  level: PermissionLevel;
}

export interface SharingRecord {
  id: string;
  documentId: string;
  sharedBy: string;
  sharedWith: string[];
  permissions: PermissionLevel;
  expirationDate?: string;
  isPublicLink: boolean;
}

export interface DocumentApproval {
  id: string;
  documentId: string;
  approverId: string;
  status: ApprovalStatus;
  notes?: string;
  timestamp: string;
}

export interface FileVersion {
  id: string;
  documentId: string;
  versionNumber: number;
  uploadedBy: string;
  timestamp: string;
  sizeBytes: number;
  changeSummary?: string;
  status: VersionStatus;
}

export interface AuditLog {
  id: string;
  documentId: string;
  userId: string;
  action: 'Viewed' | 'Edited' | 'Shared' | 'Approved' | 'Downloaded' | 'Archived' | 'Deleted' | 'Restored' | 'Uploaded';
  timestamp: string;
  details?: string;
}

export interface Metadata {
  created: string;
  lastModified: string;
  ownerId: string;
  departmentId: string;
  relatedEntities: RelatedEntity[];
  retentionStatus: RetentionStatus;
  storageLocation: StorageLocation;
}

export interface Document {
  id: string;
  name: string;
  folderId: string | null; // null if in root
  assetType: AssetType;
  category: Category;
  sizeBytes: number;
  tags: Tag[];
  metadata: Metadata;
  currentVersion: number;
  approvalStatus: ApprovalStatus;
  isShared: boolean;
  isFavorite: boolean;
  previewUrl?: string; // Optional URL for preview image
}

export interface FolderNode {
  id: string;
  name: string;
  parentId: string | null;
  departmentId?: string;
  isRestricted: boolean;
  color?: string;
  createdAt: string;
}

export interface FolderTree {
  nodes: FolderNode[];
}

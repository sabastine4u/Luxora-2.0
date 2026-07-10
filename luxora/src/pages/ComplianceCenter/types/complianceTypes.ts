export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type ComplianceStatus = 'Compliant' | 'Non-Compliant' | 'Pending Review' | 'At Risk' | 'Expired';
export type AuditStatus = 'Scheduled' | 'In Progress' | 'Completed' | 'Findings Open' | 'Closed';
export type InspectionStatus = 'Upcoming' | 'Completed' | 'Failed' | 'Passed with Conditions';
export type RecordType = 'Property' | 'Agent' | 'Agency' | 'Vendor' | 'Financial' | 'Procurement';
export type IncidentStatus = 'Open' | 'Under Investigation' | 'Resolved' | 'Escalated';

export interface ComplianceRecord {
  id: string;
  type: RecordType;
  title: string;
  status: ComplianceStatus;
  deadline?: string;
  ownerId: string;
  department: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  relatedId?: string; // Property ID, User ID, Vendor ID, etc.
  description: string;
  lastUpdated: string;
}

export interface RiskAssessment {
  id: string;
  category: string;
  level: RiskLevel;
  score: number; // 0-100
  title: string;
  description: string;
  mitigationPlan: string;
  ownerId: string;
  status: 'Identified' | 'Mitigated' | 'Accepted' | 'Escalated';
  relatedId?: string;
}

export interface Audit {
  id: string;
  title: string;
  type: 'Internal' | 'External';
  status: AuditStatus;
  auditor: string;
  department: string;
  dateStarted: string;
  dateCompleted?: string;
  findingsCount: number;
}

export interface Inspection {
  id: string;
  title: string;
  type: 'Property' | 'Safety' | 'Compliance' | 'Environmental';
  status: InspectionStatus;
  inspector: string;
  date: string;
  relatedPropertyId?: string;
  score?: number;
}

export interface License {
  id: string;
  title: string;
  type: 'License' | 'Permit' | 'Certification';
  holderName: string;
  issueDate: string;
  expiryDate: string;
  status: 'Active' | 'Expired' | 'Renewing' | 'Suspended';
  issuingAuthority: string;
}

export interface KYCRecord {
  id: string;
  entityName: string;
  entityType: 'Buyer' | 'Owner' | 'Vendor' | 'Agent';
  verificationLevel: string;
  amlStatus: 'Clear' | 'Flagged' | 'Under Review';
  status: 'Verified' | 'Pending' | 'Rejected';
  lastChecked: string;
}

export interface Incident {
  id: string;
  title: string;
  type: 'Legal' | 'Compliance' | 'Security' | 'Operational';
  status: IncidentStatus;
  severity: RiskLevel;
  dateReported: string;
  description: string;
  assignedTo: string;
}

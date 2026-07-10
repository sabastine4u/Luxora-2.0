export type ContactType = 'Buyer' | 'Owner' | 'Agent' | 'Agency' | 'Vendor' | 'Investor' | 'Developer' | 'Lawyer' | 'FinancialInstitution' | 'Lead' | 'Internal';
export type ContactStatus = 'Active' | 'Inactive' | 'Pending' | 'Archived' | 'Blocked';
export type RelationshipStage = 'New' | 'Qualified' | 'Engaged' | 'Negotiating' | 'Closed Won' | 'Closed Lost' | 'Dormant';
export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type RelationshipHealth = 'Healthy' | 'Needs Follow-up' | 'High Risk' | 'Dormant' | 'Lost Contact';
export type CustomerSegment = 'VIP' | 'Investor' | 'Returning Buyer' | 'Luxury Buyer' | 'Commercial Client' | 'First-Time Buyer' | 'Agency Partner' | 'High Risk' | 'Dormant' | 'Standard';
export type ActivityType = 'Call' | 'Email' | 'Message' | 'Meeting' | 'Property Visit' | 'Workflow Event' | 'Note' | 'Appointment' | 'Document';

export interface ContactTag {
  id: string;
  name: string;
  color: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface Contact {
  id: string;
  type: ContactType;
  firstName: string;
  lastName: string;
  avatar?: string;
  title?: string;
  department?: string;
  companyId?: string; // Links to Organization if applicable
  email: string;
  phone: string;
  secondaryPhone?: string;
  address?: Address;
  status: ContactStatus;
  stage: RelationshipStage;
  priority: PriorityLevel;
  health: RelationshipHealth;
  segment: CustomerSegment;
  tags: string[]; // Tag IDs
  source: string;
  assignedTo: string; // Internal User ID
  lastActivityAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Organization {
  id: string;
  type: ContactType; // Agency, Developer, FinancialInstitution, LawFirm, etc.
  name: string;
  logo?: string;
  industry: string;
  website: string;
  email: string;
  phone: string;
  address: Address;
  status: ContactStatus;
  primaryContactId?: string;
  health: RelationshipHealth;
  assignedTo: string; // Internal User ID
  createdAt: string;
  updatedAt: string;
}

export interface CRMActivity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  contactId: string;
  createdBy: string; // User ID
  timestamp: string;
  relatedEntity?: {
    type: 'Property' | 'Listing' | 'Deal' | 'Workflow' | 'Document' | 'Appointment';
    id: string;
    name: string;
  };
}

export interface Note {
  id: string;
  contactId: string;
  content: string;
  authorId: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FollowUp {
  id: string;
  contactId: string;
  title: string;
  description: string;
  dueDate: string;
  type: 'Call' | 'Email' | 'Meeting' | 'Reminder';
  status: 'Pending' | 'Completed' | 'Overdue' | 'Cancelled';
  assignedTo: string;
}

export interface Opportunity {
  id: string;
  contactId: string;
  title: string;
  value: number; // e.g., Potential commission or deal size
  currency: string;
  stage: RelationshipStage;
  probability: number; // 0-100
  expectedCloseDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface RelationshipGraphNode {
  id: string;
  label: string;
  type: string;
  avatar?: string;
}

export interface RelationshipGraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
}

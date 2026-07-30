export interface AgencyAgent {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  verified: boolean;
  assigned: number;
  score: number;
  department: string;
  level: string;
  joinDate: string;
  activeLeads: number;
  clientSat: number;
  // Enterprise Extended Fields
  dob?: string;
  gender?: string;
  residentialAddress?: string;
  emergencyContact?: string;
  nextOfKin?: string;
  nationality?: string;
  yearsOfExperience?: number;
  biography?: string;
  languages?: string[];
  specializations?: string[];
  serviceAreas?: string[];
  coverageRadius?: string;
  licenseNumber?: string;
  certifications?: string[];
  branch?: string;
  agencyVerificationStatus?: string;
  employmentStatus?: string;
  employmentType?: string;
  employmentContract?: string;
  backgroundCheckStatus?: string;
  licenseStatus?: string;
  internalNotes?: string;
  revenueGenerated?: string;
  commissionEarned?: string;
  pendingAssignments?: number;
  appointments?: number;
  openDeals?: number;
  avgResponseTime?: string;
  capacity?: number;
}

export interface AgencyClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  status: string;
  transactions: number;
  agent: string;
  lastComm: string;
}

export interface AgencyLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  interest: string;
  budget: string;
  status: string;
  agent: string;
  score: number;
  source: string;
  age: number;
  lastContact: string;
}

export interface AgencyCommission {
  id: string;
  agent: string;
  property: string;
  date: string;
  amount: string;
  status: string;
  dealValue: string;
}

export interface AgencyAssignment {
  id: string;
  propertyTitle: string;
  propertyLocation: string;
  propertyType: string;
  propertyPrice: string;
  ownerName: string;
  source: string;
  priority: string; // 'High', 'Medium', 'Low'
  verificationLevel: string; // 'Premium', 'Standard', 'Pending'
  recommendedAgent: string | null;
  responseDeadline: string;
  status: string; // 'Pending Agent', 'Accepted', 'Declined', 'Unassigned', 'Hold'
}

export interface AdminAgent {
  id: string;
  name: string;
  agency: string;
  deals: number;
  joined: string;
  status: string;
}

export interface AdminAgency {
  id: string;
  name: string;
  agents: number;
  listings: number;
  joined: string;
  status: string;
}

export interface AdminBuyer {
  id: string;
  name: string;
  email: string;
  saved: number;
  joined: string;
  lastActive: string;
  status: string;
}

export interface AdminOwner {
  id: string;
  name: string;
  email: string;
  properties: number;
  joined: string;
  status: string;
}

export interface AdminListing {
  id: string;
  title: string;
  owner: string;
  location: string;
  price: string;
  status: string;
  priority: string;
  verification?: {
    status: string;
    checklist: { id: string; text: string; checked: boolean }[];
    documents: { name: string; type: string; size?: string }[];
    notes: string;
    history: { title: string; time: string; type: string }[];
  };
  assignment?: {
    id: string;
    status: "Ready for Agency Assignment" | "Assigned to Agency" | "Agency Acknowledged" | "Cancelled";
    agencyId?: string;
    agencyName?: string;
    assignedBy?: string;
    assignedAt?: string;
    acknowledgedAt?: string;
    priority?: "Low" | "Medium" | "High" | "Urgent";
    notes?: string;
  };
}

export interface AdminVerification {
  id: string;
  type: string;
  title: string;
  submitter: string;
  date: string;
  status: string;
}

export interface AdminComplaint {
  id: string;
  type: string;
  user: string;
  target: string;
  status: string;
  priority: string;
  date: string;
}

export interface AdminTransaction {
  id: string;
  property: string;
  agency: string;
  value: string;
  fee: string;
}

export type ProvisioningEntityType = "administrator" | "agency" | "internal_staff";

export interface AdministratorProvisioningData {
  fullName: string;
  email: string;
  phone: string;
  region: string;
  businessUnit: string;
  department: string;
  role: string;
  tempPassword?: string;
}

export interface AgencyProvisioningData {
  agencyName: string;
  registrationNumber: string;
  agencyCategory: string;
  contactPerson: string;
  email: string;
  phone: string;
  primaryRegion: string;
  assignedAdministrator: string;
}

export interface InternalStaffProvisioningData {
  fullName: string;
  email: string;
  phone: string;
  department: string;
  jobTitle: string;
  reportingAdministrator: string;
  businessUnit: string;
  tempPassword?: string;
}

export type EnterpriseProvisioningPayload =
  | { type: "administrator"; payload: AdministratorProvisioningData }
  | { type: "agency"; payload: AgencyProvisioningData }
  | { type: "internal_staff"; payload: InternalStaffProvisioningData };

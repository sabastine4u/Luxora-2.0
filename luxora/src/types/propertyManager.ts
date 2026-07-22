export interface Tenant {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  property: string;
  unit: string;
  status: 'Active' | 'Moving Out' | 'Eviction' | 'Past';
  leaseEnds: string;
  rentAmount?: number;
  balance?: number;
}

export interface Lease {
  id: string;
  tenantId: string;
  propertyId: string;
  unit: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  deposit: number;
  status: 'Active' | 'Expiring Soon' | 'Expired' | 'Terminated';
  documents?: string[];
}

export interface MaintenanceRequest {
  id: string;
  title: string;
  description?: string;
  propertyId: string;
  unit: string;
  tenantId?: string;
  priority: 'Low' | 'Medium' | 'High' | 'Emergency';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  assignedVendor?: string;
  createdAt: string;
  updatedAt?: string;
  estimatedCost?: number;
}

export interface Inspection {
  id: string;
  propertyId: string;
  unit?: string;
  inspector: string;
  date: string;
  type: 'Move-in' | 'Move-out' | 'Routine' | 'Emergency';
  status: 'Scheduled' | 'Completed' | 'Pending Review';
  score?: number;
  reportUrl?: string;
  issuesFound?: number;
}

export interface Payment {
  id: string;
  tenantId: string;
  propertyId: string;
  amount: number;
  date: string;
  method: 'Bank Transfer' | 'Card' | 'Cash' | 'Cheque';
  status: 'Paid' | 'Pending' | 'Overdue' | 'Failed';
  reference?: string;
  receiptUrl?: string;
}

export interface Expense {
  id: string;
  propertyId: string;
  category: 'Maintenance' | 'Taxes' | 'Insurance' | 'Utilities' | 'Management Fee' | 'Other';
  amount: number;
  date: string;
  vendor?: string;
  description?: string;
  receiptUrl?: string;
}

export interface IncomeRecord {
  id: string;
  propertyId: string;
  category: 'Rent' | 'Late Fee' | 'Deposit' | 'Other';
  amount: number;
  date: string;
  tenantId?: string;
  description?: string;
}

export interface PropertyManagerActivity {
  id: string;
  type: 'Payment' | 'Maintenance' | 'Tenant' | 'Lease' | 'Inspection' | 'System';
  description: string;
  date: string;
  propertyId?: string;
}

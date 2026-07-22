export type ServiceStatus = 'Active' | 'Inactive' | 'Pending' | 'Suspended';
export type RequestStatus = 'Pending' | 'Assigned' | 'In Progress' | 'Completed' | 'Cancelled';
export type BookingStatus = 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Emergency';

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  activeProviders: number;
  activeRequests: number;
  monthlyRevenue: number;
  status: ServiceStatus;
}

export interface ServiceProvider {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  completedJobs: number;
  revenue: number;
  status: ServiceStatus;
  verificationStatus: 'Verified' | 'Pending' | 'Unverified';
  contactEmail: string;
  contactPhone: string;
}

export interface ServiceRequest {
  id: string;
  customerId: string;
  customerName: string;
  category: string;
  description: string;
  location: string;
  priority: PriorityLevel;
  status: RequestStatus;
  assignedProviderId?: string;
  assignedProviderName?: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  providerId: string;
  providerName: string;
  category: string;
  date: string;
  time: string;
  status: BookingStatus;
  amount: number;
}

export interface ProviderPayout {
  id: string;
  providerId: string;
  providerName: string;
  amount: number;
  date: string;
  status: 'Paid' | 'Pending' | 'Failed';
  period: string;
}

export interface ServiceFinancialTransaction {
  id: string;
  date: string;
  description: string;
  type: 'Revenue' | 'Payout' | 'Refund' | 'Commission';
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
}

export interface ServiceReview {
  id: string;
  bookingId: string;
  providerId: string;
  customerId: string;
  rating: number;
  comment: string;
  date: string;
}

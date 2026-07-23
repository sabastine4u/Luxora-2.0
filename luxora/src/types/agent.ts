export interface Agent {
  name: string;
  agency: string;
  avatar: string;
  id?: string;
  phone?: string;
  email?: string;
  image?: string;
  verified?: boolean;
  deals?: number;
  value?: string;
}

import type { LucideIcon } from 'lucide-react';

export interface Lead {
  [key: string]: unknown;
  id: string;
  name: string;
  avatar?: string;
  budget: string;
  property: string;
  location: string;
  phone: string;
  email: string;
  assignedDate: string;
  priority: 'High' | 'Medium' | 'Low';
  stage: string;
  type: string;
  financing: string;
  notes: string;
}

export interface Client {
  [key: string]: unknown;
  id: string;
  name: string;
  avatar?: string;
  type: 'Buyer' | 'Seller' | 'Investor' | 'Tenant' | 'Landlord' | string;
  status: 'Active' | 'Inactive' | 'Pending' | 'VIP' | 'Dormant' | string;
  phone: string;
  email: string;
  budget?: string;
  preferences?: string;
  lastContact: string;
  property?: string;
  totalValue?: string;
  engagementScore?: number;
}

export interface Appointment {
  [key: string]: unknown;
  id: string;
  title: string;
  clientName: string;
  date: string;
  time: string;
  location: string;
  type: 'Viewing' | 'Meeting' | 'Appraisal' | 'Closing' | 'Consultation' | 'Review' | string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Rescheduled' | 'Pending' | string;
  priority?: 'High' | 'Medium' | 'Low' | 'Normal' | string;
  notes?: string;
}

export interface Deal {
  [key: string]: unknown;
  id: string;
  property: string;
  client: string;
  amount: string;
  value?: string;
  stage: 'Negotiation' | 'Under Contract' | 'Closing' | 'Closed' | 'Closed Won' | 'Proposal' | 'Lost' | string;
  closingDate: string;
  expectedClose?: string;
  commission: string;
  probability: number;
  status?: string;
  readiness?: number;
}

export interface Commission {
  [key: string]: unknown;
  id: string;
  property: string;
  client?: string;
  amount: string;
  date: string;
  status: 'Paid' | 'Pending' | 'Processing' | string;
  type: 'Sale' | 'Rental' | 'Referral' | 'Sales Commission' | 'Referral Fee' | string;
  split?: string;
}

export interface AgentMetric {
  [key: string]: unknown;
  label: string;
  value: string;
  icon?: LucideIcon; // Will use Lucide icon components directly
  color?: string;
  bg?: string;
  trend?: string;
}

export interface PropertyListing {
  [key: string]: unknown;
  id: string;
  title: string;
  location: string;
  price: string;
  type: string;
  beds: number;
  baths: number;
  area: string;
  status: 'Available' | 'Pending' | 'Sold' | 'Rented' | 'Draft' | 'Archived' | string;
  image: string;
  views: number;
  saves: number;
  offers: number;
  viewingRequests: number;
  owner: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface PerformanceReport {
  [key: string]: unknown;
  id: string;
  title: string;
  date: string;
  type: string;
  status: 'Ready' | 'Generating' | 'Failed' | 'Generated' | 'Archived' | 'Processing' | string;
  size?: string;
  updated?: string;
}

export interface ActivityItem {
  id?: string;
  title: string;
  date: string;
  active: boolean;
  type?: string;
}

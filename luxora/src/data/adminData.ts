import type { AdminAgent, AdminAgency, AdminBuyer, AdminOwner, AdminListing, AdminVerification, AdminComplaint, AdminTransaction } from '../types/admin';

export const adminAgents: AdminAgent[] = [
  { id: 'AGT-001', name: 'Adaeze Okonkwo', agency: 'Meridian Luxury', deals: 42, joined: 'Jan 2024', status: 'Verified' },
  { id: 'AGT-002', name: 'Chioma Obi', agency: 'Meridian Luxury', deals: 12, joined: 'Mar 2024', status: 'Verified' },
  { id: 'AGT-003', name: 'Oluwaseun Adeyemi', agency: 'Independent', deals: 0, joined: 'Oct 2025', status: 'Pending KYC' },
];

export const adminAgencies: AdminAgency[] = [
  { id: 'AGC-101', name: 'Meridian Luxury', agents: 14, listings: 42, joined: 'Dec 2023', status: 'Verified' },
  { id: 'AGC-102', name: 'Eko Estates', agents: 8, listings: 24, joined: 'Feb 2024', status: 'Verified' },
  { id: 'AGC-103', name: 'Abuja Premier Properties', agents: 3, listings: 5, joined: 'Oct 2025', status: 'Pending Review' },
];

export const adminBuyers: AdminBuyer[] = [
  { id: 'BUY-401', name: 'Ngozi Eze', email: 'ngozi@example.com', saved: 24, joined: 'Oct 2025', lastActive: '2 hours ago', status: 'Active' },
  { id: 'BUY-402', name: 'Emeka Ike', email: 'emeka@example.com', saved: 12, joined: 'Sep 2025', lastActive: '1 day ago', status: 'Active' },
  { id: 'BUY-403', name: 'Aisha Bello', email: 'aisha@example.com', saved: 4, joined: 'Aug 2025', lastActive: '2 weeks ago', status: 'Inactive' },
];

export const adminOwners: AdminOwner[] = [
  { id: 'OWN-901', name: 'Aliko Dangote', email: 'aliko@example.com', properties: 12, joined: 'Jan 2024', status: 'Active' },
  { id: 'OWN-902', name: 'Tony Elumelu', email: 'tony@example.com', properties: 8, joined: 'Mar 2024', status: 'Active' },
  { id: 'OWN-903', name: 'Folorunso Alakija', email: 'f.alakija@example.com', properties: 5, joined: 'Jun 2024', status: 'Suspended' },
  { id: 'OWN-904', name: 'Femi Otedola', email: 'femi@example.com', properties: 3, joined: 'Aug 2024', status: 'Active' },
];

export const adminListings: AdminListing[] = [
  { id: 'LST-801', title: 'Skyline Penthouse', owner: 'Aliko Dangote', location: 'Ikoyi, Lagos', price: '₦450M', status: 'Pending Review', priority: 'High' },
  { id: 'LST-802', title: 'Banana Island Mansion', owner: 'Tony Elumelu', location: 'Banana Island', price: '₦1.2B', status: 'Approved', priority: 'Normal' },
  { id: 'LST-803', title: 'Lekki Phase 1 Duplex', owner: 'Femi Otedola', location: 'Lekki, Lagos', price: '₦200M', status: 'Rejected', priority: 'Normal' },
];

export const adminVerifications: AdminVerification[] = [
  { id: 'VQ-104', type: 'Property', title: 'Skyline Penthouse', submitter: 'Bisi Williams (Owner)', date: '2 hours ago', status: 'Pending Review' },
  { id: 'VQ-103', type: 'Agent KYC', title: 'Identity Verification', submitter: 'Chidi Okafor (Agent)', date: '5 hours ago', status: 'Pending Review' },
  { id: 'VQ-102', type: 'Agency', title: 'Business Registration', submitter: 'Meridian Luxury', date: '1 day ago', status: 'Requires Info' },
  { id: 'VQ-101', type: 'Property', title: 'Banana Island Plot', submitter: 'Anonymous', date: '2 days ago', status: 'Pending Review' },
];

export const adminComplaints: AdminComplaint[] = [
  { id: 'TKT-504', type: 'Listing Dispute', user: 'Ngozi Eze (Buyer)', target: 'Skyline Penthouse', status: 'Open', priority: 'High', date: '2 hours ago' },
  { id: 'TKT-503', type: 'Agent Conduct', user: 'Anonymous (Owner)', target: 'Oluwaseun Adeyemi', status: 'In Progress', priority: 'Medium', date: '1 day ago' },
  { id: 'TKT-502', type: 'Platform Bug', user: 'Chidi Okafor (Agent)', target: 'Messaging System', status: 'Resolved', priority: 'Low', date: '3 days ago' },
];

export const adminTransactions: AdminTransaction[] = [
  { id: 'D-9982', property: 'Skyline Penthouse', agency: 'Meridian Luxury', value: '₦450,000,000', fee: '₦22,500,000' },
  { id: 'D-9981', property: 'Banana Island Plot', agency: 'Independent (Oluwaseun)', value: '₦800,000,000', fee: '₦40,000,000' },
  { id: 'D-9980', property: 'Marina View Apartment', agency: 'Eko Estates', value: '₦120,000,000', fee: '₦6,000,000' },
];

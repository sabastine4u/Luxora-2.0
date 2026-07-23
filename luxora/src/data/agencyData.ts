import type { AgencyAgent, AgencyClient, AgencyLead, AgencyCommission } from '../types/agency';

export const agencyAgents: AgencyAgent[] = [
  { id: 'AGT-001', name: 'Sarah James', email: 'sarah@meridian.com', phone: '+234 800 123 4567', status: 'Active', verified: true, assigned: 12, score: 95, department: 'Residential', level: 'Senior Broker', joinDate: '2022', activeLeads: 24, clientSat: 4.9 },
  { id: 'AGT-002', name: 'Emeka Uzo', email: 'emeka@meridian.com', phone: '+234 800 234 5678', status: 'Active', verified: true, assigned: 8, score: 88, department: 'Commercial', level: 'Broker', joinDate: '2023', activeLeads: 15, clientSat: 4.7 },
  { id: 'AGT-003', name: 'Daniel O.', email: 'daniel@meridian.com', phone: '+234 800 345 6789', status: 'Pending', verified: false, assigned: 0, score: 0, department: 'Residential', level: 'Junior Broker', joinDate: '2025', activeLeads: 2, clientSat: 0 },
  { id: 'AGT-004', name: 'Michael Eze', email: 'michael@meridian.com', phone: '+234 800 456 7890', status: 'On Leave', verified: true, assigned: 2, score: 92, department: 'Luxury', level: 'Partner', joinDate: '2021', activeLeads: 5, clientSat: 5.0 },
];

export const agencyClients: AgencyClient[] = [
  { id: 'CLI-001', name: 'Aliko Dangote', email: 'aliko@dangote.com', phone: '+234 800 111 2222', type: 'Buyer', status: 'Active', transactions: 3, agent: 'Sarah James', lastComm: '2 days ago' },
  { id: 'CLI-002', name: 'Folorunso Alakija', email: 'f.alakija@faml.com', phone: '+234 800 333 4444', type: 'Owner', status: 'Active', transactions: 5, agent: 'Sarah James', lastComm: '1 week ago' },
  { id: 'CLI-003', name: 'Tony Elumelu', email: 'tony@heirs.com', phone: '+234 800 777 8888', type: 'Buyer', status: 'Inactive', transactions: 1, agent: 'Emeka Uzo', lastComm: '1 month ago' },
  { id: 'CLI-004', name: 'Jim Ovia', email: 'jim@zenith.com', phone: '+234 800 999 0000', type: 'Owner', status: 'Active', transactions: 2, agent: 'Michael Eze', lastComm: '3 days ago' },
  { id: 'CLI-005', name: 'Femi Otedola', email: 'femi@forte.com', phone: '+234 800 222 3333', type: 'Buyer', status: 'Active', transactions: 4, agent: 'Sarah James', lastComm: 'Yesterday' },
];

export const agencyLeads: AgencyLead[] = [
  { id: 'LD-1042', name: 'Aliko Dangote', email: 'aliko@dangote.com', phone: '+234 800 111 2222', interest: 'Ikoyi Penthouse', budget: '₦800M - ₦1B', status: 'Qualified', agent: 'Sarah James', score: 95, source: 'Website', age: 2, lastContact: '2 hours ago' },
  { id: 'LD-1041', name: 'Folorunso Alakija', email: 'f.alakija@faml.com', phone: '+234 800 333 4444', interest: 'Victoria Island Office', budget: '₦1.5B+', status: 'Contacted', agent: 'Sarah James', score: 88, source: 'Referral', age: 5, lastContact: 'Yesterday' },
  { id: 'LD-1040', name: 'Mike Adenuga', email: 'm.adenuga@globacom.com', phone: '+234 800 555 6666', interest: 'Banana Island Plot', budget: '₦500M - ₦700M', status: 'New', agent: 'Unassigned', score: 75, source: 'Social Media', age: 0, lastContact: 'Never' },
  { id: 'LD-1039', name: 'Tony Elumelu', email: 'tony@heirs.com', phone: '+234 800 777 8888', interest: 'Lekki Phase 1 Villa', budget: '₦300M - ₦500M', status: 'Converted', agent: 'Emeka Uzo', score: 100, source: 'Direct', age: 14, lastContact: '1 week ago' },
  { id: 'LD-1038', name: 'Jim Ovia', email: 'jim@zenith.com', phone: '+234 800 999 0000', interest: 'Eko Atlantic Condo', budget: '₦200M - ₦400M', status: 'Lost', agent: 'Michael Eze', score: 40, source: 'Event', age: 30, lastContact: '3 weeks ago' },
];

export const agencyCommissions: AgencyCommission[] = [
  { id: 'COM-2025-104', agent: 'Sarah James', property: 'The Continental Duplex', date: 'Oct 05, 2025', amount: '₦13,500,000', status: 'Pending', dealValue: '₦450M' },
  { id: 'COM-2025-103', agent: 'Emeka Uzo', property: 'Ikoyi Penthouse', date: 'Oct 01, 2025', amount: '₦25,500,000', status: 'Paid', dealValue: '₦850M' },
  { id: 'COM-2025-102', agent: 'Sarah James', property: 'Victoria Island Office', date: 'Sep 25, 2025', amount: '₦36,000,000', status: 'Paid', dealValue: '₦1.2B' },
  { id: 'COM-2025-101', agent: 'Michael Eze', property: 'Lekki Phase 1 Villa', date: 'Sep 15, 2025', amount: '₦8,500,000', status: 'Processing', dealValue: '₦280M' },
  { id: 'COM-2025-100', agent: 'Daniel O.', property: 'Banana Island Plot', date: 'Sep 10, 2025', amount: '₦15,000,000', status: 'Overdue', dealValue: '₦500M' },
];

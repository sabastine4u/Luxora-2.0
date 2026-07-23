import { UserCheck, Clock, CheckCircle2, DollarSign, Building2, Calendar, FileCheck, FileText } from 'lucide-react';
import type { Lead, Client, Appointment, Deal, Commission, PerformanceReport, ActivityItem } from '../types/agent';

// MOCK_LEADS for AssignedLeads
export const MOCK_LEADS: Lead[] = [
  {
    id: 'L-245', name: 'Bisi Williams', budget: '₦400M - ₦500M', property: 'Skyline Penthouse Residence',
    location: 'Eko Atlantic', phone: '+234 800 111 2222', email: 'bisi@example.com', assignedDate: 'Today',
    priority: 'High', stage: 'new', type: 'Buyer', financing: 'Pre-approved Mortgage',
    notes: 'Looking for a penthouse with ocean views. Needs to move in within 3 months.'
  },
  {
    id: 'L-244', name: 'Chidi Okafor', budget: '₦150M - ₦200M', property: 'Marina View Apartment',
    location: 'Lekki Phase 1', phone: '+234 800 333 4444', email: 'chidi@example.com', assignedDate: 'Yesterday',
    priority: 'Medium', stage: 'contacted', type: 'Buyer', financing: 'Cash Buyer',
    notes: 'Interested in investment properties. High yield preferred.'
  }
];

export const leads = [
  { id: 'LD-4001', name: 'Dr. Tunde Bakare', property: 'Skyline Penthouse', source: 'Website', status: 'Hot', date: 'Today, 09:30 AM', score: 95 },
  { id: 'LD-4002', name: 'Mrs. Folake Ojo', property: 'Victoria Island Duplex', source: 'Referral', status: 'Contacted', date: 'Yesterday', score: 75 },
  { id: 'LD-4003', name: 'Chinedu Eze', property: 'Lekki Phase 1 Villa', source: 'Social Media', status: 'New', date: 'Today, 08:15 AM', score: 85 },
  { id: 'LD-4004', name: 'Aisha Mohammed', property: 'Maitama Mansion', source: 'Direct', status: 'Qualified', date: 'Oct 2, 2026', score: 60 },
  { id: 'LD-4005', name: 'David Okafor', property: 'Eko Atlantic Condo', source: 'Website', status: 'Dormant', date: 'Sep 15, 2026', score: 30 },
];

export const followUpQueue = [
  { name: 'Dr. Tunde Bakare', action: 'Send detailed floor plans', time: 'Today, 2:00 PM', priority: 'High', icon: FileText },
  { name: 'Chinedu Eze', action: 'Initial Discovery Call', time: 'Today, 4:00 PM', priority: 'High', icon: Clock },
];

export const clients: Client[] = [
  { id: 'CL-3001', name: 'Aliko Dangote', type: 'Investor', status: 'VIP', lastContact: '2 days ago', totalValue: '₦2.5B', engagementScore: 98, phone: '+234 800 111 1111', email: 'aliko@example.com' },
  { id: 'CL-3002', name: 'Folorunso Alakija', type: 'Owner', status: 'Active', lastContact: '1 week ago', totalValue: '₦1.2B', engagementScore: 85, phone: '+234 800 222 2222', email: 'folorunso@example.com' },
  { id: 'CL-3003', name: 'Tony Elumelu', type: 'Buyer', status: 'Active', lastContact: 'Today', totalValue: '₦850M', engagementScore: 92, phone: '+234 800 333 3333', email: 'tony@example.com' },
  { id: 'CL-3004', name: 'Mike Adenuga', type: 'Investor', status: 'Dormant', lastContact: '3 months ago', totalValue: '₦4.1B', engagementScore: 40, phone: '+234 800 444 4444', email: 'mike@example.com' },
  { id: 'CL-3005', name: 'Jim Ovia', type: 'Owner', status: 'VIP', lastContact: 'Yesterday', totalValue: '₦1.8B', engagementScore: 95, phone: '+234 800 555 5555', email: 'jim@example.com' },
];

export const appointments: Appointment[] = [
  { id: 'APT-001', clientName: 'Tony Elumelu', title: 'Viewing: Lekki Phase 1 Villa', date: 'Today', time: '2:00 PM', type: 'Viewing', location: 'In-Person', status: 'Scheduled', priority: 'High' },
  { id: 'APT-002', clientName: 'Sarah Smith', title: 'Initial Consultation', date: 'Tomorrow', time: '10:00 AM', type: 'Consultation', location: 'Virtual', status: 'Pending', priority: 'Normal' },
  { id: 'APT-003', clientName: 'Aliko Dangote', title: 'Contract Signing', date: 'Next Wed', time: '1:00 PM', type: 'Meeting', location: 'In-Person', status: 'Scheduled', priority: 'High' },
  { id: 'APT-004', clientName: 'Folorunso Alakija', title: 'Portfolio Review', date: 'Yesterday', time: 'N/A', type: 'Review', location: 'Virtual', status: 'Completed', priority: 'High' },
  { id: 'APT-005', clientName: 'Mike Adenuga', title: 'Property Tour: Banana Island', date: 'Last Monday', time: 'N/A', type: 'Viewing', location: 'In-Person', status: 'Cancelled', priority: 'High' },
];

export const deals: Deal[] = [
  { id: 'DL-5001', property: 'Skyline Penthouse', client: 'Aliko Dangote', amount: '₦850,000,000', value: '₦850,000,000', closingDate: 'Nov 15, 2026', expectedClose: 'Nov 15, 2026', stage: 'Negotiation', status: 'Active', probability: 80, readiness: 75, commission: '₦42,500,000' },
  { id: 'DL-5002', property: 'Victoria Island Office', client: 'Folorunso Alakija', amount: '₦1,200,000,000', value: '₦1,200,000,000', closingDate: 'Dec 1, 2026', expectedClose: 'Dec 1, 2026', stage: 'Under Contract', status: 'Pending', probability: 95, readiness: 98, commission: '₦60,000,000' },
  { id: 'DL-5003', property: 'Lekki Phase 1 Villa', client: 'Tony Elumelu', amount: '₦450,000,000', value: '₦450,000,000', closingDate: 'Oct 5, 2026', expectedClose: 'Oct 5, 2026', stage: 'Closed Won', status: 'Closed', probability: 100, readiness: 100, commission: '₦22,500,000' },
  { id: 'DL-5004', property: 'Banana Island Plot', client: 'Mike Adenuga', amount: '₦600,000,000', value: '₦600,000,000', closingDate: 'Oct 12, 2026', expectedClose: 'Oct 12, 2026', stage: 'Proposal', status: 'Active', probability: 40, readiness: 30, commission: '₦30,000,000' },
];

export const commissions: Commission[] = [
  { id: 'CM-901', property: 'Skyline Penthouse', client: 'Aliko Dangote', amount: '₦12,500,000', status: 'Pending', date: 'Nov 15, 2026', type: 'Sales Commission', split: '70/30' },
  { id: 'CM-902', property: 'Victoria Island Office', client: 'Folorunso Alakija', amount: '₦8,400,000', status: 'Processing', date: 'Oct 28, 2026', type: 'Sales Commission', split: '70/30' },
  { id: 'CM-903', property: 'Lekki Phase 1 Villa', client: 'Tony Elumelu', amount: '₦4,500,000', status: 'Paid', date: 'Oct 5, 2026', type: 'Sales Commission', split: '70/30' },
  { id: 'CM-904', property: 'Banana Island Plot', client: 'Mike Adenuga', amount: '₦1,200,000', status: 'Paid', date: 'Sep 12, 2026', type: 'Referral Fee', split: '100/0' },
];

export const KPI_DATA_LEADS = [
  { label: 'Total Leads', value: '45', icon: UserCheck, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { label: 'New Leads', value: '12', icon: Clock, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  { label: 'Qualified Leads', value: '18', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { label: 'Viewings Scheduled', value: '8', icon: Calendar, color: 'text-gold-400', bg: 'bg-gold-400/10' },
  { label: 'Closed Deals', value: '5', icon: DollarSign, color: 'text-rose-400', bg: 'bg-rose-400/10' },
];

export const KPI_DATA_PROPERTIES = [
  { label: 'Active Listings', value: '28', icon: Building2, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { label: 'Pending Approval', value: '4', icon: Clock, color: 'text-gold-400', bg: 'bg-gold-400/10' },
  { label: 'Sold Properties', value: '142', icon: CheckCircle2, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { label: 'Rented Properties', value: '86', icon: FileCheck, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
  { label: 'Draft Listings', value: '3', icon: FileText, color: 'text-ink/60', bg: 'bg-white/5' },
];

export const ACTIVITY_TIMELINE: ActivityItem[] = [
  { title: 'Deal Closed', date: 'Oct 28', active: false },
  { title: 'Offer Submitted', date: 'Oct 26', active: false },
  { title: 'Viewing Completed', date: 'Oct 24', active: true },
  { title: 'Viewing Scheduled', date: 'Oct 22', active: true },
  { title: 'Buyer Contacted', date: 'Oct 21', active: true },
  { title: 'Lead Assigned', date: 'Oct 21', active: true },
];

export const mockReports: PerformanceReport[] = [
  { id: 'REP-001', title: 'Q3 2026 Performance Summary', date: 'Oct 1, 2026', type: 'Sales Reports', status: 'Generated', size: '2.4 MB', updated: 'Today, 09:41 AM' },
  { id: 'REP-002', title: 'September Leads Conversion', date: 'Oct 1, 2026', type: 'Leads Reports', status: 'Generated', size: '1.8 MB', updated: 'Today, 08:30 AM' },
  { id: 'REP-003', title: 'Q2 2026 Commission Statement', date: 'Jul 1, 2026', type: 'Commission Reports', status: 'Archived', updated: 'Jul 1, 2026' },
  { id: 'REP-004', title: 'Active Listings Overview', date: 'Oct 5, 2026', type: 'Listings Reports', status: 'Processing', updated: 'Just now' },
  { id: 'REP-005', title: 'September Viewings Log', date: 'Oct 1, 2026', type: 'Viewing Reports', status: 'Generated', updated: 'Oct 1, 2026' },
];

export const relationshipRecommendations = [
  { text: 'Send Q3 Luxury Market Report to Mike Adenuga to re-engage.', icon: 'Zap', color: 'text-blue-400', type: 'Nurture' },
  { text: 'Follow up on Folorunso Alakija\'s portfolio review.', icon: 'Calendar', color: 'text-emerald-400', type: 'Action' },
];

export const milestones = [
  { name: 'Aliko Dangote', event: '2-Year Anniversary', date: 'Tomorrow', icon: 'Award', color: 'text-gold-400' },
  { name: 'Tony Elumelu', event: 'Birthday', date: 'Oct 15', icon: 'Gift', color: 'text-rose-400' },
];

export const upcomingActivities = [
  { title: 'Annual Review', desc: 'Jim Ovia - Portfolio assessment', time: 'Friday, 2:00 PM', icon: 'Star', color: 'text-gold-400' },
  { title: 'Lease Renewal', desc: 'Mike Adenuga - Commercial property', time: 'Next Week', icon: 'CheckCircle2', color: 'text-blue-400' },
];

export const loyaltyDistribution = [
  { label: 'VIP (Multiple Deals)', value: 15, color: 'bg-gold-400' },
  { label: 'Active (Current Deal)', value: 35, color: 'bg-emerald-400' },
  { label: 'Past Client (Nurture)', value: 50, color: 'bg-blue-400' },
];

export const topPerformingProperties = [
  { name: 'Skyline Penthouse', views: '12.4k', favs: 842, offers: 4, status: 'Sold', rev: '₦185M' },
  { name: 'Aurora Studio', views: '8.2k', favs: 512, offers: 2, status: 'Active', rev: '-' },
  { name: 'Garden Court Villa', views: '15.1k', favs: 1024, offers: 6, status: 'Pending', rev: '₦680M' },
];

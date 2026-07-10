import type { Contact, Organization, CRMActivity, Note, FollowUp, Opportunity, ContactTag } from '../types/crmTypes';

export const MOCK_CRM_TAGS: ContactTag[] = [
  { id: 'tag-1', name: 'High Net Worth', color: 'bg-purple-100 text-purple-700' },
  { id: 'tag-2', name: 'Cash Buyer', color: 'bg-emerald-100 text-emerald-700' },
  { id: 'tag-3', name: 'International', color: 'bg-blue-100 text-blue-700' },
  { id: 'tag-4', name: 'Urgent', color: 'bg-red-100 text-red-700' },
  { id: 'tag-5', name: 'Repeat Client', color: 'bg-gold-100 text-gold-700' }
];

export const MOCK_ORGANIZATIONS: Organization[] = [
  {
    id: 'org-1',
    type: 'Agency',
    name: 'Prime Estate Partners',
    industry: 'Real Estate',
    website: 'www.primeestate.ng',
    email: 'contact@primeestate.ng',
    phone: '+234 800 000 1111',
    address: { street: '12 Victoria St', city: 'Lagos', state: 'LA', country: 'Nigeria', zipCode: '100001' },
    status: 'Active',
    health: 'Healthy',
    assignedTo: 'user-1',
    createdAt: '2025-01-10T10:00:00Z',
    updatedAt: '2026-06-15T14:30:00Z'
  },
  {
    id: 'org-2',
    type: 'FinancialInstitution',
    name: 'Zenith Global Bank',
    industry: 'Finance',
    website: 'www.zenithglobal.com',
    email: 'mortgage@zenithglobal.com',
    phone: '+234 800 000 2222',
    address: { street: '4 Marina Rd', city: 'Lagos', state: 'LA', country: 'Nigeria', zipCode: '100002' },
    status: 'Active',
    health: 'Healthy',
    assignedTo: 'user-1',
    createdAt: '2024-11-05T09:00:00Z',
    updatedAt: '2026-07-01T11:00:00Z'
  }
];

export const MOCK_CONTACTS: Contact[] = [
  {
    id: 'contact-1',
    type: 'Buyer',
    firstName: 'Alexander',
    lastName: 'Okafor',
    avatar: 'https://i.pravatar.cc/150?u=alex',
    title: 'Managing Director',
    companyId: 'org-2',
    email: 'a.okafor@example.com',
    phone: '+234 812 345 6789',
    status: 'Active',
    stage: 'Negotiating',
    priority: 'High',
    health: 'Healthy',
    segment: 'VIP',
    tags: ['tag-1', 'tag-2'],
    source: 'Website Referral',
    assignedTo: 'user-1',
    lastActivityAt: '2026-07-09T10:30:00Z',
    createdAt: '2026-01-15T09:00:00Z',
    updatedAt: '2026-07-09T10:30:00Z'
  },
  {
    id: 'contact-2',
    type: 'Owner',
    firstName: 'Beatrice',
    lastName: 'Adeyemi',
    avatar: 'https://i.pravatar.cc/150?u=bea',
    email: 'b.adeyemi@example.com',
    phone: '+234 803 456 7890',
    status: 'Active',
    stage: 'Engaged',
    priority: 'Medium',
    health: 'Needs Follow-up',
    segment: 'Investor',
    tags: ['tag-5'],
    source: 'Direct Call',
    assignedTo: 'user-2',
    lastActivityAt: '2026-07-05T14:15:00Z',
    createdAt: '2025-08-20T11:00:00Z',
    updatedAt: '2026-07-05T14:15:00Z'
  },
  {
    id: 'contact-3',
    type: 'Agent',
    firstName: 'David',
    lastName: 'Johnson',
    avatar: 'https://i.pravatar.cc/150?u=davidj',
    title: 'Senior Broker',
    companyId: 'org-1',
    email: 'david@primeestate.ng',
    phone: '+234 809 111 2222',
    status: 'Active',
    stage: 'Closed Won',
    priority: 'Low',
    health: 'Healthy',
    segment: 'Agency Partner',
    tags: [],
    source: 'Partner Agency',
    assignedTo: 'user-1',
    lastActivityAt: '2026-07-08T16:45:00Z',
    createdAt: '2024-03-12T08:30:00Z',
    updatedAt: '2026-07-08T16:45:00Z'
  },
  {
    id: 'contact-4',
    type: 'Lead',
    firstName: 'Sarah',
    lastName: 'Connor',
    email: 'sarah.c@example.com',
    phone: '+44 7700 900077',
    status: 'Pending',
    stage: 'New',
    priority: 'High',
    health: 'High Risk',
    segment: 'Luxury Buyer',
    tags: ['tag-3', 'tag-4'],
    source: 'Social Media',
    assignedTo: 'user-3',
    lastActivityAt: '2026-07-01T09:00:00Z',
    createdAt: '2026-07-01T09:00:00Z',
    updatedAt: '2026-07-01T09:00:00Z'
  }
];

export const MOCK_CRM_ACTIVITIES: CRMActivity[] = [
  {
    id: 'act-1',
    type: 'Meeting',
    title: 'Initial Consultation',
    description: 'Discussed luxury property requirements in Eko Atlantic.',
    contactId: 'contact-1',
    createdBy: 'user-1',
    timestamp: '2026-07-09T10:30:00Z'
  },
  {
    id: 'act-2',
    type: 'Property Visit',
    title: 'Viewed Azure Tower Penthouse',
    description: 'Client was very impressed. Requested financial projections.',
    contactId: 'contact-1',
    createdBy: 'user-1',
    timestamp: '2026-07-08T14:00:00Z',
    relatedEntity: { type: 'Property', id: 'prop-1', name: 'Azure Tower Penthouse' }
  },
  {
    id: 'act-3',
    type: 'Email',
    title: 'Sent Market Report',
    description: 'Emailed Q3 2026 Market Report for Lekki Phase 1.',
    contactId: 'contact-2',
    createdBy: 'user-2',
    timestamp: '2026-07-05T14:15:00Z'
  }
];

export const MOCK_CRM_NOTES: Note[] = [
  {
    id: 'note-1',
    contactId: 'contact-1',
    content: 'Prefers communication via WhatsApp. Looking for high-floor apartments only. Budget is flexible if the property is fully serviced.',
    authorId: 'user-1',
    isPinned: true,
    createdAt: '2026-01-16T10:00:00Z',
    updatedAt: '2026-01-16T10:00:00Z'
  }
];

export const MOCK_CRM_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-1',
    contactId: 'contact-1',
    title: 'Azure Penthouse Purchase',
    value: 850000000,
    currency: 'NGN',
    stage: 'Negotiating',
    probability: 75,
    expectedCloseDate: '2026-07-30T00:00:00Z',
    createdAt: '2026-06-20T09:00:00Z',
    updatedAt: '2026-07-08T15:00:00Z'
  },
  {
    id: 'opp-2',
    contactId: 'contact-4',
    title: 'Banana Island Villa Interest',
    value: 1200000000,
    currency: 'NGN',
    stage: 'Qualified',
    probability: 30,
    expectedCloseDate: '2026-09-15T00:00:00Z',
    createdAt: '2026-07-01T10:00:00Z',
    updatedAt: '2026-07-01T10:00:00Z'
  }
];

export const MOCK_CRM_FOLLOWUPS: FollowUp[] = [
  {
    id: 'fu-1',
    contactId: 'contact-2',
    title: 'Check on Listing Strategy',
    description: 'Call Beatrice to finalize the pricing strategy for her new listing.',
    dueDate: '2026-07-10T10:00:00Z',
    type: 'Call',
    status: 'Pending',
    assignedTo: 'user-2'
  },
  {
    id: 'fu-2',
    contactId: 'contact-4',
    title: 'Send Initial Brochure',
    description: 'Email the luxury portfolio brochure.',
    dueDate: '2026-07-08T15:00:00Z',
    type: 'Email',
    status: 'Overdue',
    assignedTo: 'user-3'
  }
];

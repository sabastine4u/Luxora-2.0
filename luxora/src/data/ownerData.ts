import { properties } from './luxoraData';
import type { VerificationProperty, PropertyRequest, ListingJourneyData, PropertyPerformance, PaymentHistory, UpcomingPayment, OwnerOffer } from '../types/owner';

export const mockVerifications: VerificationProperty[] = [
  {
    id: 'PR-101',
    name: 'The Sapphire Residences',
    image: properties[0].image,
    submissionDate: '2025-10-12',
    officer: { name: 'David Adebayo', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop', email: 'david@luxora.com' },
    status: 'Document Review',
    progressPercent: 35,
    estimatedRemaining: '5-7 Business Days',
    expectedPublication: 'Nov 02, 2025',
    stages: [
      { name: 'Submitted', status: 'completed', dateCompleted: 'Oct 12, 2025', officerName: 'System', notes: 'Initial request received.' },
      { name: 'Documents Received', status: 'completed', dateCompleted: 'Oct 13, 2025', officerName: 'System', notes: 'All initial files uploaded.' },
      { name: 'Document Review', status: 'current', officerName: 'David Adebayo', notes: 'Reviewing title deed and tax clearance.' },
      { name: 'Inspection Scheduled', status: 'pending' },
      { name: 'Inspection Completed', status: 'pending' },
      { name: 'Compliance Review', status: 'pending' },
      { name: 'Approved', status: 'pending' },
      { name: 'Published', status: 'pending' }
    ],
    documents: [
      { name: 'Title Deed', status: 'pending', type: 'PDF' },
      { name: 'Government ID', status: 'verified', type: 'Image' },
      { name: 'Property Photos', status: 'verified', type: 'Images' },
      { name: 'Survey Plan', status: 'verified', type: 'PDF' },
      { name: 'Tax Clearance', status: 'rejected', type: 'PDF' },
      { name: 'Utility Bill', status: 'verified', type: 'PDF' },
      { name: 'Inspection Form', status: 'pending', type: 'Form' }
    ],
    history: [
      { title: 'Officer Assigned', date: 'Oct 14, 2025', description: 'David Adebayo assigned to review.' },
      { title: 'Documents Uploaded', date: 'Oct 13, 2025', description: '6 documents uploaded by owner.' },
      { title: 'Property Submitted', date: 'Oct 12, 2025', description: 'Verification request initiated.' }
    ]
  },
  {
    id: 'PR-102',
    name: 'Oceanview Villa #4',
    image: properties[1].image,
    submissionDate: '2025-09-28',
    officer: { name: 'Sarah Ken', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop', email: 'sarah@luxora.com' },
    status: 'Published',
    progressPercent: 100,
    estimatedRemaining: 'None',
    expectedPublication: 'Oct 05, 2025',
    stages: [
      { name: 'Submitted', status: 'completed', dateCompleted: 'Sep 28, 2025' },
      { name: 'Documents Received', status: 'completed', dateCompleted: 'Sep 28, 2025' },
      { name: 'Document Review', status: 'completed', dateCompleted: 'Sep 29, 2025' },
      { name: 'Inspection Scheduled', status: 'completed', dateCompleted: 'Sep 30, 2025' },
      { name: 'Inspection Completed', status: 'completed', dateCompleted: 'Oct 02, 2025' },
      { name: 'Compliance Review', status: 'completed', dateCompleted: 'Oct 04, 2025' },
      { name: 'Approved', status: 'completed', dateCompleted: 'Oct 04, 2025' },
      { name: 'Published', status: 'completed', dateCompleted: 'Oct 05, 2025' }
    ],
    documents: [
      { name: 'Title Deed', status: 'verified', type: 'PDF' },
      { name: 'Government ID', status: 'verified', type: 'Image' },
      { name: 'Property Photos', status: 'verified', type: 'Images' },
      { name: 'Survey Plan', status: 'verified', type: 'PDF' },
      { name: 'Tax Clearance', status: 'verified', type: 'PDF' },
      { name: 'Utility Bill', status: 'verified', type: 'PDF' },
      { name: 'Inspection Form', status: 'verified', type: 'Form' }
    ],
    history: [
      { title: 'Published', date: 'Oct 05, 2025', description: 'Property is live.' },
      { title: 'Approval Granted', date: 'Oct 04, 2025', description: 'Final compliance passed.' },
      { title: 'Inspection Completed', date: 'Oct 02, 2025', description: 'Physical inspection passed.' },
      { title: 'Property Submitted', date: 'Sep 28, 2025', description: 'Request initiated.' }
    ]
  }
];

export const mockRequests: PropertyRequest[] = [
  {
    id: 'PR-101',
    name: 'The Sapphire Residences',
    type: 'Penthouse',
    location: 'Eko Atlantic, Lagos',
    image: properties[0].image,
    submissionDate: '2025-10-12',
    lastUpdated: '2025-10-14',
    status: 'Documents Verified',
    progress: 40,
    agent: { name: 'James Okoro', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop' },
    timeline: [
      { stage: 'Submitted', date: 'Oct 12', status: 'completed' },
      { stage: 'Documents Verified', date: 'Oct 14', status: 'current' },
      { stage: 'Inspection Scheduled', date: 'Pending', status: 'pending' },
      { stage: 'Published', date: 'Pending', status: 'pending' }
    ],
    documents: [
      { name: 'Title Deed.pdf', status: 'verified' },
      { name: 'Property Layout.pdf', status: 'verified' },
      { name: 'Utility Bill.pdf', status: 'verified' }
    ],
    notes: 'Awaiting scheduling of physical inspection.'
  },
  {
    id: 'PR-102',
    name: 'Oceanview Villa #4',
    type: 'Villa',
    location: 'Lekki Phase 1, Lagos',
    image: properties[1].image,
    submissionDate: '2025-09-28',
    lastUpdated: '2025-10-02',
    status: 'Published',
    progress: 100,
    agent: { name: 'Sarah Adeyemi', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop' },
    timeline: [
      { stage: 'Submitted', date: 'Sep 28', status: 'completed' },
      { stage: 'Documents Verified', date: 'Sep 29', status: 'completed' },
      { stage: 'Inspection Complete', date: 'Oct 1', status: 'completed' },
      { stage: 'Published', date: 'Oct 2', status: 'completed' }
    ],
    documents: [
      { name: 'Title Deed.pdf', status: 'verified' },
      { name: 'Property Layout.pdf', status: 'verified' }
    ],
    notes: 'Successfully listed and live on the marketplace.'
  },
  {
    id: 'PR-103',
    name: 'Ikoyi Luxury Apartment',
    type: 'Apartment',
    location: 'Ikoyi, Lagos',
    image: properties[2].image,
    submissionDate: '2025-10-25',
    lastUpdated: '2025-10-25',
    status: 'Draft',
    progress: 10,
    agent: { name: 'Unassigned', avatar: '' },
    timeline: [
      { stage: 'Draft Created', date: 'Oct 25', status: 'current' },
      { stage: 'Submitted', date: 'Pending', status: 'pending' }
    ],
    documents: [],
    notes: 'Please complete the property details to submit.'
  }
];

export const STAGE_NAMES = [
  'Property Submitted', 'Documents Uploaded', 'Documents Verified', 'Inspection Scheduled',
  'Inspection Completed', 'Compliance Review', 'Photography', 'Content Creation',
  'SEO Optimization', 'Published', 'Receiving Leads', 'Viewing Requests',
  'Offers Received', 'Negotiation', 'Sold / Rented'
];

export const mockJourneys: ListingJourneyData[] = [
  {
    id: 'LJ-101',
    name: 'The Sapphire Residences',
    address: 'Eko Atlantic City, Lagos',
    type: 'Penthouse',
    image: properties[0].image,
    status: 'Content Creation',
    agent: { name: 'Sarah Ken', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop' },
    progressPercent: 50,
    daysSinceSubmission: 8,
    estDaysRemaining: 4,
    expectedGoLive: 'Oct 20, 2025',
    alerts: [
      { type: 'warning', message: 'Missing Owner Action: Please approve the drafted property description.' }
    ],
    activityFeed: [
      { title: 'Photography Completed', date: 'Oct 15, 2025', type: 'success' },
      { title: 'Officer Assigned', date: 'Oct 14, 2025', type: 'info' },
      { title: 'Inspection Confirmed', date: 'Oct 13, 2025', type: 'success' },
      { title: 'Documents Uploaded', date: 'Oct 12, 2025', type: 'info' }
    ],
    stages: STAGE_NAMES.map((name, idx) => {
      let status = 'Pending';
      let date = undefined;
      let officer = undefined;
      let notes = undefined;
      let estCompletion = undefined;

      if (idx < 7) {
        status = 'Completed';
        date = 'Oct 14, 2025';
        officer = 'Sarah Ken';
      } else if (idx === 7) {
        status = 'Current';
        officer = 'Marketing Team';
        estCompletion = 'Oct 17, 2025';
        notes = 'Drafting luxury descriptions.';
      }

      return { name, description: `Process for ${name.toLowerCase()}.`, status, date, officer, notes, estCompletion };
    })
  },
  {
    id: 'LJ-102',
    name: 'Oceanview Villa #4',
    address: 'Lekki Phase 1, Lagos',
    type: 'Villa',
    image: properties[1].image,
    status: 'Published',
    agent: { name: 'James Okoro', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop' },
    progressPercent: 66,
    daysSinceSubmission: 15,
    estDaysRemaining: 0,
    expectedGoLive: 'Live Now',
    alerts: [],
    activityFeed: [
      { title: 'Offer Received', date: 'Oct 16, 2025', type: 'success' },
      { title: 'Listing Live', date: 'Oct 15, 2025', type: 'success' },
      { title: 'SEO Published', date: 'Oct 14, 2025', type: 'info' }
    ],
    stages: STAGE_NAMES.map((name, idx) => {
      let status = 'Pending';
      if (idx < 10) status = 'Completed';
      else if (idx === 10) status = 'Current';

      return { 
        name, 
        description: `Process for ${name.toLowerCase()}.`, 
        status, 
        date: status === 'Completed' ? 'Oct 15, 2025' : undefined,
        officer: 'James Okoro'
      };
    })
  }
];

export const mockOffers: OwnerOffer[] = [
  {
    id: 'OFF-105',
    property: { id: 'p1', name: 'Skyline Penthouse Residence', image: properties[0].image, askingPrice: 420000000 },
    buyer: { name: 'Bisi Williams', avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop', email: 'bisi@example.com', phone: '+234 800 000 0000' },
    amount: 410000000,
    date: '2025-10-15',
    lastUpdated: '2025-10-15',
    status: 'Pending',
    deposit: 41000000,
    financing: 'Mortgage',
    mortgageStatus: 'Pre-approved',
    message: 'I love the penthouse! I have my mortgage pre-approved and I am ready to close quickly if we can agree on 410M.',
    timeline: [
      { title: 'Offer Submitted', date: 'Oct 15, 2025', type: 'info' }
    ]
  },
  {
    id: 'OFF-104',
    property: { id: 'p2', name: 'Garden Court Villa', image: properties[1].image, askingPrice: 680000000 },
    buyer: { name: 'Chidi Okafor', avatar: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=100&h=100&fit=crop', email: 'chidi@example.com', phone: '+234 800 111 1111' },
    amount: 680000000,
    date: '2025-10-10',
    lastUpdated: '2025-10-14',
    status: 'Accepted',
    deposit: 136000000,
    financing: 'Cash',
    mortgageStatus: 'N/A',
    message: 'Full asking price in cash. Let us proceed to contract signing.',
    timeline: [
      { title: 'Accepted', date: 'Oct 14, 2025', type: 'success' },
      { title: 'Viewed by Owner', date: 'Oct 11, 2025', type: 'info' },
      { title: 'Offer Submitted', date: 'Oct 10, 2025', type: 'info' }
    ]
  },
  {
    id: 'OFF-102',
    property: { id: 'p3', name: 'Banana Island Plot', image: properties[2].image, askingPrice: 250000000 },
    buyer: { name: 'Anonymous Buyer', avatar: '', email: 'agent@example.com', phone: 'Contact Agent' },
    amount: 200000000,
    date: '2025-10-05',
    lastUpdated: '2025-10-06',
    status: 'Countered',
    deposit: 20000000,
    financing: 'Mortgage',
    mortgageStatus: 'Pending',
    message: 'Looking for a quick deal at 200M.',
    timeline: [
      { title: 'Counter Sent', date: 'Oct 06, 2025', type: 'warning' },
      { title: 'Offer Submitted', date: 'Oct 05, 2025', type: 'info' }
    ]
  }
];

export const mockPerformance: PropertyPerformance[] = [
  { id: '1', property: 'Garden Court Villa', tenant: 'Chidi Okafor', rent: 4700000, status: 'Paid', nextDueDate: 'Nov 01, 2025', occupancy: '100%' },
  { id: '2', property: 'Marina View Apartment', tenant: 'Bisi Williams', rent: 1300000, status: 'Pending', nextDueDate: 'Oct 05, 2025', occupancy: '100%' },
  { id: '3', property: 'Banana Island Plot', tenant: 'N/A', rent: 0, status: 'Overdue', nextDueDate: 'N/A', occupancy: '0% (Vacant)' }
];

export const mockHistory: PaymentHistory[] = [
  { id: 'PH-001', date: 'Oct 01, 2025', tenant: 'Chidi Okafor', property: 'Garden Court Villa', amount: 4700000, method: 'Bank Transfer', status: 'Paid' },
  { id: 'PH-002', date: 'Sep 28, 2025', tenant: 'Bisi Williams', property: 'Marina View Apartment', amount: 650000, method: 'Card', status: 'Partial' },
  { id: 'PH-003', date: 'Sep 01, 2025', tenant: 'Chidi Okafor', property: 'Garden Court Villa', amount: 4700000, method: 'Bank Transfer', status: 'Paid' },
  { id: 'PH-004', date: 'Aug 15, 2025', tenant: 'Nnamdi Eze', property: 'Victoria Island Duplex', amount: 2500000, method: 'Cash', status: 'Late' }
];

export const mockUpcoming: UpcomingPayment[] = [
  { id: 'UP-001', tenant: 'Bisi Williams', property: 'Marina View Apartment', dueDate: 'Oct 05, 2025', amount: 1300000 },
  { id: 'UP-002', tenant: 'Chidi Okafor', property: 'Garden Court Villa', dueDate: 'Nov 01, 2025', amount: 4700000 }
];

export const mockChartData = [
  { month: 'Jan', income: 8.5 },
  { month: 'Feb', income: 8.5 },
  { month: 'Mar', income: 9.0 },
  { month: 'Apr', income: 9.0 },
  { month: 'May', income: 10.5 },
  { month: 'Jun', income: 10.5 },
  { month: 'Jul', income: 12.0 },
  { month: 'Aug', income: 12.0 },
  { month: 'Sep', income: 14.5 },
  { month: 'Oct', income: 14.5 },
  { month: 'Nov', income: 0 },
  { month: 'Dec', income: 0 },
];

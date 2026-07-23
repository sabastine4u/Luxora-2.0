export interface DocStatusType {
  name: string;
  status: 'pending' | 'verified' | 'rejected';
  type?: string;
}

export interface VerificationProperty {
  id: string;
  name: string;
  image: string;
  submissionDate: string;
  officer: { name: string; avatar: string; email: string };
  status: string;
  progressPercent: number;
  estimatedRemaining: string;
  expectedPublication: string;
  stages: { name: string; status: 'completed' | 'current' | 'pending'; dateCompleted?: string; officerName?: string; notes?: string }[];
  documents: DocStatusType[];
  history: { title: string; date: string; description: string }[];
}

export interface PropertyRequest {
  id: string;
  name: string;
  type: string;
  location: string;
  image: string;
  submissionDate: string;
  lastUpdated: string;
  status: string;
  progress: number;
  agent: { name: string; avatar: string };
  timeline: { stage: string; date: string; status: 'completed' | 'current' | 'pending' }[];
  documents: DocStatusType[];
  notes?: string;
}

export interface ListingJourneyData {
  id: string;
  name: string;
  address: string;
  type: string;
  image: string;
  status: string;
  agent: { name: string; avatar: string };
  progressPercent: number;
  daysSinceSubmission: number;
  estDaysRemaining: number;
  expectedGoLive: string;
  alerts: { type: 'warning' | 'error'; message: string }[];
  stages: { name: string; description?: string; status: string; date?: string; officer?: string; notes?: string; estCompletion?: string }[];
  activityFeed: { title: string; date: string; type: 'success' | 'info' | 'warning' }[];
}

export interface PropertyPerformance {
  id: string;
  property: string;
  tenant: string;
  rent: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  nextDueDate: string;
  occupancy: string;
}

export interface PaymentHistory {
  id: string;
  date: string;
  property: string;
  tenant: string;
  amount: number;
  method: string;
  status: 'Paid' | 'Partial' | 'Late';
}

export interface UpcomingPayment {
  id: string;
  property: string;
  tenant: string;
  amount: number;
  dueDate: string;
}

export interface OwnerOfferTimeline {
  title: string;
  date: string;
  type: 'success' | 'info' | 'warning';
}

export interface OwnerOffer {
  id: string;
  property: { id: string; name: string; image: string; askingPrice: number };
  buyer: { name: string; avatar: string; email: string; phone: string };
  amount: number;
  date: string;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Countered';
  lastUpdated: string;
  deposit: number;
  financing: string;
  mortgageStatus: string;
  message: string;
  timeline: OwnerOfferTimeline[];
}

export interface BuyerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  joinDate: string;
  preferredLocations: string[];
  budget: { min: number; max: number };
}

export interface SavedProperty {
  id: string;
  propertyId: string;
  savedAt: string;
  notes?: string;
}

export interface ViewingRequest {
  id: string | number;
  propertyTitle: string;
  location: string;
  propertyType: string;
  date: string;
  time: string;
  status: 'Pending' | 'Confirmed' | 'Rescheduled' | 'Completed' | 'Cancelled';
  agent: string;
  image: string;
  instructions: string;
  meetingPoint: string;
  agentNotes: string;
  specialRequests: string;
  summary: string;
}

export interface OfferTimelineEvent {
  date: string;
  event: string;
}

export interface Offer {
  id: string;
  propertyTitle: string;
  location: string;
  propertyType: string;
  askingPrice: number;
  offerAmount: number;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Counter Offer Received' | 'Accepted' | 'Rejected' | 'Withdrawn' | 'Expired';
  date: string;
  agent: string;
  image: string;
  summary: string;
  timeline: OfferTimelineEvent[];
  counterOfferDetails: string | null;
  agentNotes: string;
  buyerNotes: string;
  estimatedClosing: string;
}

export interface MortgageScenario {
  id: string;
  propertyValue: number;
  downPayment: number;
  loanTerm: number;
  interestRate: number;
  monthlyPayment: number;
}

export interface BuyerNotification {
  id: string;
  type: 'PropertyUpdate' | 'ViewingAlert' | 'OfferUpdate' | 'Message';
  title: string;
  message: string;
  date: string;
  isRead: boolean;
}

export interface AgentConversation {
  id: string;
  agentId: string;
  agentName: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

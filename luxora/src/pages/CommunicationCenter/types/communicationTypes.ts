export type UserRole = 
  | 'Super Admin'
  | 'Management'
  | 'Agency'
  | 'Agent'
  | 'Buyer'
  | 'Owner'
  | 'Finance'
  | 'Procurement'
  | 'Compliance'
  | 'Customer Support';

export type TaskStatus = 'Due Today' | 'Tomorrow' | 'Waiting' | 'Overdue' | 'Scheduled' | 'Completed';

export interface FollowUpTask {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: PriorityLevel;
  dueDate: string;
  ownerId: string;
  relatedConversationId?: string;
  tags: string[];
}

export interface CommunicationTemplate {
  id: string;
  title: string;
  content: string;
  category: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: 'Viewing' | 'Meeting' | 'Closing' | 'Inspection' | 'FollowUp' | 'Internal';
  date: string; // ISO string
  participants: string[];
  location?: string;
}

export type OnlineStatus = 'online' | 'offline' | 'away' | 'busy';

export type ConversationType = 
  | 'Direct'
  | 'Team'
  | 'Property'
  | 'Deal'
  | 'Appointment'
  | 'Agency'
  | 'Announcement'
  | 'System';

export type MessageType = 
  | 'Text'
  | 'Image'
  | 'Document'
  | 'VoiceNote'
  | 'SharedProperty'
  | 'SharedListing'
  | 'SharedDeal'
  | 'SharedAppointment'
  | 'SystemNotification';

export type MessageStatus = 'sent' | 'delivered' | 'read' | 'failed';

export type NotificationType = 
  | 'NewMessage'
  | 'AppointmentReminder'
  | 'PropertyUpdate'
  | 'ListingUpdate'
  | 'DealUpdate'
  | 'LeadNotification'
  | 'CommissionAlert'
  | 'Announcement'
  | 'SystemAlert'
  | 'PriorityAlert';

export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';

export interface Participant {
  id: string;
  name: string;
  avatar?: string;
  role: UserRole;
  department?: string;
  onlineStatus: OnlineStatus;
  lastSeen?: string; // ISO timestamp
  permissions?: string[];
}

export interface Reaction {
  emoji: string;
  userId: string;
}

export interface Attachment {
  id: string;
  type: 'image' | 'document' | 'voice' | 'other';
  url: string;
  name: string;
  size?: number; // in bytes
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  type: MessageType;
  content: string;
  timestamp: string; // ISO timestamp
  status: MessageStatus;
  isEdited?: boolean;
  replyToId?: string; // ID of the message being replied to
  reactions?: Reaction[];
  attachments?: Attachment[];
  metadata?: Record<string, unknown>; // Avoid `any`
}

export interface Conversation {
  id: string;
  type: ConversationType;
  participants: Participant[];
  lastMessage?: Message;
  unreadCount: number;
  isPinned?: boolean;
  isFavorite?: boolean;
  isArchived?: boolean;
  isMuted?: boolean;
  priority?: PriorityLevel;
  tags?: string[];
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  title?: string; // For group/team/property conversations
  propertyId?: string;
  dealId?: string;
  appointmentId?: string;
  internalNotes?: string;
}

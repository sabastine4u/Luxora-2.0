// src/modules/enterprise/communication/communicationTypes.ts
import type { EnterpriseEvent } from '../events/types';

export type ConversationStatus = 'active' | 'archived' | 'closed';
export type MessageType = 'user' | 'system' | 'attachment';
export type Visibility = 'public' | 'private' | 'internal';

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string; // Document, Image, Video, PDF, etc.
  size: number;
}

export interface Mention {
  userId: string;
  username: string;
}

export interface ConversationMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: string;
  messageType: MessageType;
  content: string;
  attachments?: Attachment[];
  mentions?: Mention[];
  createdAt: Date;
  editedAt?: Date;
  systemGenerated: boolean;
}

export interface Conversation {
  id: string;
  entityType: string;
  entityId: string;
  title: string;
  participants: string[]; // User IDs
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  lastActivity: Date;
  status: ConversationStatus;
  visibility: Visibility;
}

export interface CommunicationHandler {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handle: (event: EnterpriseEvent<any>) => void | Promise<void>;
}

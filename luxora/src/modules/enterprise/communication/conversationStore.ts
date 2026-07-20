// src/modules/enterprise/communication/conversationStore.ts
import type { Conversation, ConversationMessage } from './communicationTypes';

/**
 * A centralized, in-memory store for conversations and messages.
 * In a real application, this interfaces with a robust database and real-time sockets.
 */
class ConversationStore {
  private static instance: ConversationStore;
  private conversations: Map<string, Conversation>;
  private messages: Map<string, ConversationMessage[]>; // Map conversationId to an array of messages

  private constructor() {
    this.conversations = new Map();
    this.messages = new Map();
  }

  public static getInstance(): ConversationStore {
    if (!ConversationStore.instance) {
      ConversationStore.instance = new ConversationStore();
    }
    return ConversationStore.instance;
  }

  // --- Conversations ---

  public createConversation(conversation: Conversation): void {
    if (!this.conversations.has(conversation.id)) {
      this.conversations.set(conversation.id, conversation);
      this.messages.set(conversation.id, []);
    }
  }

  public getConversation(id: string): Conversation | undefined {
    return this.conversations.get(id);
  }

  public getConversationByEntity(entityType: string, entityId: string): Conversation | undefined {
    return Array.from(this.conversations.values()).find(
      (c) => c.entityType === entityType && c.entityId === entityId
    );
  }

  public getAllConversations(): Conversation[] {
    return Array.from(this.conversations.values());
  }

  public getConversationsByParticipant(participantId: string): Conversation[] {
    return this.getAllConversations().filter(c => c.participants.includes(participantId));
  }

  public updateConversationStatus(id: string, status: Conversation['status']): void {
    const conv = this.conversations.get(id);
    if (conv) {
      conv.status = status;
      conv.updatedAt = new Date();
    }
  }

  public addParticipant(conversationId: string, participantId: string): void {
    const conv = this.conversations.get(conversationId);
    if (conv && !conv.participants.includes(participantId)) {
      conv.participants.push(participantId);
      conv.updatedAt = new Date();
    }
  }

  // --- Messages ---

  public addMessage(message: ConversationMessage): void {
    const convMessages = this.messages.get(message.conversationId);
    if (convMessages) {
      convMessages.push(message);
      // Update conversation last activity
      const conv = this.conversations.get(message.conversationId);
      if (conv) {
        conv.lastActivity = message.createdAt;
        conv.updatedAt = message.createdAt;
      }
    }
  }

  public getMessages(conversationId: string): ConversationMessage[] {
    return this.messages.get(conversationId) || [];
  }
}

export const conversationStore = ConversationStore.getInstance();

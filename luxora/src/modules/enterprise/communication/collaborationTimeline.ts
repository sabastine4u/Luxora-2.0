// src/modules/enterprise/communication/collaborationTimeline.ts
import { conversationStore } from './conversationStore';
import type { ConversationMessage } from './communicationTypes';

export interface TimelineEvent {
  id: string;
  type: 'message' | 'system' | 'attachment';
  content: string;
  timestamp: Date;
  actor?: string;
  actorRole?: string;
}

/**
 * Extracts an ordered activity timeline for a given business entity.
 */
export function getEntityTimeline(entityType: string, entityId: string): TimelineEvent[] {
  const conversation = conversationStore.getConversationByEntity(entityType, entityId);
  
  if (!conversation) {
    return [];
  }

  const messages = conversationStore.getMessages(conversation.id);

  const timeline: TimelineEvent[] = messages.map((msg: ConversationMessage) => {
    let type: TimelineEvent['type'] = 'message';
    if (msg.systemGenerated) type = 'system';
    else if (msg.attachments && msg.attachments.length > 0) type = 'attachment';

    return {
      id: msg.id,
      type,
      content: msg.content,
      timestamp: msg.createdAt,
      actor: msg.senderId,
      actorRole: msg.senderRole,
    };
  });

  // Sort chronological
  return timeline.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
}

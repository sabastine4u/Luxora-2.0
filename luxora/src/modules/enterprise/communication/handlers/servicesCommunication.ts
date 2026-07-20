// src/modules/enterprise/communication/handlers/servicesCommunication.ts
import type { CommunicationHandler } from '../communicationTypes';
import { ENTERPRISE_EVENTS } from '../../events/registry';
import { conversationStore } from '../conversationStore';

export const servicesCommunicationHandler: CommunicationHandler = {
  name: 'Services Communication',
  handle: async (event) => {
    const jobId = event.payload?.jobId || event.payload?.entityId || 'unknown-job';

    let conversation = conversationStore.getConversationByEntity('ServiceJob', jobId);

    if (!conversation && event.type === ENTERPRISE_EVENTS.SERVICES_JOB_CREATED) {
      conversation = {
        id: crypto.randomUUID(),
        entityType: 'ServiceJob',
        entityId: jobId,
        title: `Service Job Discussion: ${jobId}`,
        participants: ['customer-id', 'provider-id'],
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastActivity: new Date(),
        status: 'active',
        visibility: 'public',
      };
      conversationStore.createConversation(conversation);
    }

    if (conversation) {
      conversationStore.addMessage({
        id: crypto.randomUUID(),
        conversationId: conversation.id,
        senderId: 'system',
        senderRole: 'System',
        messageType: 'system',
        content: `Service Event: ${event.type}`,
        createdAt: new Date(),
        systemGenerated: true,
      });
    }
  }
};

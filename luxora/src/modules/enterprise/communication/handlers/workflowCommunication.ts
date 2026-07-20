// src/modules/enterprise/communication/handlers/workflowCommunication.ts
import type { CommunicationHandler } from '../communicationTypes';
import { ENTERPRISE_EVENTS } from '../../events/registry';
import { conversationStore } from '../conversationStore';

export const workflowCommunicationHandler: CommunicationHandler = {
  name: 'Workflow Communication',
  handle: async (event) => {
    const workflowId = event.payload?.workflowId || event.payload?.eventId || 'unknown-workflow';

    let conversation = conversationStore.getConversationByEntity('Workflow', workflowId);

    if (!conversation && event.type === ENTERPRISE_EVENTS.WORKFLOW_STARTED) {
      conversation = {
        id: crypto.randomUUID(),
        entityType: 'Workflow',
        entityId: workflowId,
        title: `Workflow Discussion: ${workflowId}`,
        participants: ['system-admin', 'assigned-user'],
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastActivity: new Date(),
        status: 'active',
        visibility: 'internal',
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
        content: `Workflow Event: ${event.type}`,
        createdAt: new Date(),
        systemGenerated: true,
      });
    }
  }
};

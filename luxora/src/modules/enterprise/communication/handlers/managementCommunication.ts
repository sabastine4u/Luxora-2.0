// src/modules/enterprise/communication/handlers/managementCommunication.ts
import type { CommunicationHandler } from '../communicationTypes';
import { ENTERPRISE_EVENTS } from '../../events/registry';
import { conversationStore } from '../conversationStore';

export const managementCommunicationHandler: CommunicationHandler = {
  name: 'Management Communication',
  handle: async (event) => {
    const propertyId = event.payload?.propertyId || event.payload?.entityId || 'unknown-property';

    let conversation = conversationStore.getConversationByEntity('PropertyManagement', propertyId);

    if (!conversation && event.type === ENTERPRISE_EVENTS.MANAGEMENT_PROPERTY_VERIFIED) {
      conversation = {
        id: crypto.randomUUID(),
        entityType: 'PropertyManagement',
        entityId: propertyId,
        title: `Management Discussion: ${propertyId}`,
        participants: ['manager-id', 'owner-id'],
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
        content: `Management Event: ${event.type}`,
        createdAt: new Date(),
        systemGenerated: true,
      });
    }
  }
};

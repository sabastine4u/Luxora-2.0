// src/modules/enterprise/communication/handlers/propertyCommunication.ts
import type { CommunicationHandler } from '../communicationTypes';
import { ENTERPRISE_EVENTS } from '../../events/registry';
import { conversationStore } from '../conversationStore';

export const propertyCommunicationHandler: CommunicationHandler = {
  name: 'Property Communication',
  handle: async (event) => {
    // Extract property ID from event payload
    // Using a fallback for demonstration; robust implementation would validate schema
    const propertyId = event.payload?.propertyId || event.payload?.entityId || 'unknown-property';

    let conversation = conversationStore.getConversationByEntity('Property', propertyId);

    if (!conversation && event.type === ENTERPRISE_EVENTS.PROPERTY_SUBMITTED) {
      conversation = {
        id: crypto.randomUUID(),
        entityType: 'Property',
        entityId: propertyId,
        title: `Property Discussion: ${propertyId}`,
        participants: ['owner-id', 'agency-id'], // Placeholder IDs
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastActivity: new Date(),
        status: 'active',
        visibility: 'private',
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
        content: `System Event: ${event.type}`,
        createdAt: new Date(),
        systemGenerated: true,
      });
    }
  }
};

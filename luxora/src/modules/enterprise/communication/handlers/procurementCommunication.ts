// src/modules/enterprise/communication/handlers/procurementCommunication.ts
import type { CommunicationHandler } from '../communicationTypes';
import { ENTERPRISE_EVENTS } from '../../events/registry';
import { conversationStore } from '../conversationStore';

export const procurementCommunicationHandler: CommunicationHandler = {
  name: 'Procurement Communication',
  handle: async (event) => {
    const requestId = event.payload?.requestId || event.payload?.entityId || 'unknown-request';

    let conversation = conversationStore.getConversationByEntity('PurchaseRequest', requestId);

    if (!conversation && event.type === ENTERPRISE_EVENTS.PROCUREMENT_PURCHASE_REQUEST_CREATED) {
      conversation = {
        id: crypto.randomUUID(),
        entityType: 'PurchaseRequest',
        entityId: requestId,
        title: `Purchase Request Discussion: ${requestId}`,
        participants: ['requester-id', 'procurement-id'],
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
        content: `Procurement Event: ${event.type}`,
        createdAt: new Date(),
        systemGenerated: true,
      });
    }
  }
};

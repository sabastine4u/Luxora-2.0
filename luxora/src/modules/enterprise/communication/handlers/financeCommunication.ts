// src/modules/enterprise/communication/handlers/financeCommunication.ts
import type { CommunicationHandler } from '../communicationTypes';
import { ENTERPRISE_EVENTS } from '../../events/registry';
import { conversationStore } from '../conversationStore';

export const financeCommunicationHandler: CommunicationHandler = {
  name: 'Finance Communication',
  handle: async (event) => {
    const refundId = event.payload?.refundId || event.payload?.entityId || 'unknown-refund';

    let conversation = conversationStore.getConversationByEntity('RefundRequest', refundId);

    if (!conversation && event.type === ENTERPRISE_EVENTS.FINANCE_REFUND_REQUESTED) {
      conversation = {
        id: crypto.randomUUID(),
        entityType: 'RefundRequest',
        entityId: refundId,
        title: `Refund Discussion: ${refundId}`,
        participants: ['customer-id', 'finance-id'],
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
        content: `Finance Event: ${event.type}`,
        createdAt: new Date(),
        systemGenerated: true,
      });
    }
  }
};

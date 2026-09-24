import http from './http';

export const messageApi = {
  listMessages: (conversationId, params = {}) =>
    http.get(`/messages/conversations/${conversationId}/messages`, { params }),
  sendMessage: (conversationId, body) =>
    http.post(`/messages/conversations/${conversationId}/messages`, { type: 'text', body }),
  markConversationRead: (conversationId) =>
    http.patch(`/messages/conversations/${conversationId}/read`),
};

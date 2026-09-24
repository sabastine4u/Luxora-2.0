import http from './http';

export const conversationApi = {
  listConversations: (params = {}) => http.get('/conversations', { params }),
  getConversation: (conversationId) => http.get(`/conversations/${conversationId}`),
  createConversation: (payload) => http.post('/conversations', payload),
  archiveConversation: (conversationId) => http.patch(`/conversations/${conversationId}/archive`),
  unarchiveConversation: (conversationId) => http.patch(`/conversations/${conversationId}/unarchive`),
};

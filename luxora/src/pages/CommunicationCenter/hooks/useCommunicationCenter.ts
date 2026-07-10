import { useState, useCallback, useMemo } from 'react';
import type { Conversation, Message, MessageType } from '../types/communicationTypes';
import { MOCK_CONVERSATIONS, MOCK_MESSAGES, CURRENT_USER } from '../data/mockData';

export const useCommunicationCenter = () => {
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(conversations[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const activeConversation = useMemo(() => 
    conversations.find(c => c.id === activeConversationId),
  [conversations, activeConversationId]);

  const activeMessages = useMemo(() => 
    messages.filter(m => m.conversationId === activeConversationId)
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
  [messages, activeConversationId]);

  const sendMessage = useCallback((content: string, type: MessageType = 'Text') => {
    if (!activeConversationId) return;

    const newMessage: Message = {
      id: `m-new-${Date.now()}`,
      conversationId: activeConversationId,
      senderId: CURRENT_USER.id,
      type,
      content,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };

    setMessages(prev => [...prev, newMessage]);
    
    // Update last message in conversation
    setConversations(prev => prev.map(c => 
      c.id === activeConversationId 
        ? { ...c, lastMessage: newMessage, updatedAt: newMessage.timestamp } 
        : c
    ));
    
    // Mock auto-reply for demo purposes after 2 seconds
    setTimeout(() => {
      const autoReply: Message = {
        id: `m-reply-${Date.now()}`,
        conversationId: activeConversationId,
        senderId: activeConversation?.participants.find(p => p.id !== CURRENT_USER.id)?.id || 'system',
        type: 'Text',
        content: 'Thanks for your message. This is an automated mock response.',
        timestamp: new Date().toISOString(),
        status: 'delivered'
      };
      setMessages(prev => [...prev, autoReply]);
      setConversations(prev => prev.map(c => 
        c.id === activeConversationId 
          ? { ...c, lastMessage: autoReply, updatedAt: autoReply.timestamp } 
          : c
      ));
    }, 2000);

  }, [activeConversationId, activeConversation]);

  const selectConversation = useCallback((id: string) => {
    setActiveConversationId(id);
    // Mark as read
    setConversations(prev => prev.map(c => c.id === id ? { ...c, unreadCount: 0 } : c));
  }, []);

  const filteredConversations = useMemo(() => {
    let filtered = conversations;
    
    if (activeCategory !== 'all') {
      if (activeCategory === 'unread') filtered = filtered.filter(c => c.unreadCount > 0);
      else if (activeCategory === 'favorites') filtered = filtered.filter(c => c.isFavorite);
      else if (activeCategory === 'archived') filtered = filtered.filter(c => c.isArchived);
      else filtered = filtered.filter(c => c.type.toLowerCase() === activeCategory.toLowerCase());
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        c.title?.toLowerCase().includes(query) ||
        c.participants.some(p => p.name.toLowerCase().includes(query)) ||
        c.lastMessage?.content.toLowerCase().includes(query)
      );
    }

    return filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [conversations, activeCategory, searchQuery]);

  return {
    conversations: filteredConversations,
    activeConversation,
    activeMessages,
    currentUser: CURRENT_USER,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    selectConversation,
    sendMessage
  };
};

import { useCallback, useEffect, useRef, useState } from 'react';
import { conversationApi } from '../../api/conversation.api';
import { messageApi } from '../../api/message.api';
import { useSession } from '../../contexts/SessionContext';
import { socketService } from '../../services/socket.service';

const byNewest = (items: any[]) => [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
const mergeMessages = (current: any[], incoming: any[]) => byNewest([...current, ...incoming].reduce<any[]>((merged, message) => {
  const index = merged.findIndex((item) => item._id === message._id);
  if (index === -1) merged.push(message); else merged[index] = message;
  return merged;
}, []));
const byConversationActivity = (items: any[]) => [...items].sort((a, b) => new Date(b.lastMessageAt || b.updatedAt || 0).getTime() - new Date(a.lastMessageAt || a.updatedAt || 0).getTime());
const validConversation = (value: any) => Boolean(value?._id && Array.isArray(value?.participantDisplays));
const validMessage = (value: any) => Boolean(value?._id && value?.senderDisplay && typeof value?.body === 'string');

export function useMessaging() {
  const { user, isAuthenticated, isAuthLoading } = useSession();
  const generation = useRef(0);
  const selectedIdRef = useRef<string | null>(null);
  const conversationsRef = useRef<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const current = useCallback((version: number, userId: string) => generation.current === version && isAuthenticated && user?.id === userId, [isAuthenticated, user?.id]);

  useEffect(() => { selectedIdRef.current = selectedId; }, [selectedId]);
  useEffect(() => { conversationsRef.current = conversations; }, [conversations]);

  const loadConversations = useCallback(async () => {
    const userId = user?.id; const version = generation.current;
    if (!userId || !isAuthenticated) return;
    setLoadingConversations(true); setError(null);
    try {
      const result: any = await conversationApi.listConversations({ limit: 20 });
      if (!current(version, userId)) return;
      if (!Array.isArray(result?.conversations)) throw new Error('The server returned an invalid conversation response.');
      setConversations(result.conversations.filter(validConversation));
    } catch (cause) { if (current(version, userId)) setError(cause instanceof Error ? cause.message : 'Unable to load conversations.'); }
    finally { if (current(version, userId)) setLoadingConversations(false); }
  }, [current, isAuthenticated, user?.id]);

  const selectConversation = useCallback(async (conversationId: string) => {
    const userId = user?.id; const version = generation.current;
    if (!userId || !isAuthenticated) return;
    setSelectedId(conversationId); setMessages([]); setLoadingMessages(true); setError(null);
    try {
      const result: any = await messageApi.listMessages(conversationId, { limit: 100 });
      if (!current(version, userId) || selectedIdRef.current !== conversationId) return;
      if (!Array.isArray(result?.messages)) throw new Error('The server returned an invalid message response.');
      setMessages((items) => mergeMessages(items, result.messages.filter(validMessage)));
      const read: any = await messageApi.markConversationRead(conversationId);
      if (!current(version, userId) || selectedIdRef.current !== conversationId) return;
      if (!validConversation(read?.conversation)) throw new Error('The server returned an invalid read-state response.');
      setConversations((items) => items.map((item) => item._id === conversationId ? read.conversation : item));
    } catch (cause) { if (current(version, userId)) setError(cause instanceof Error ? cause.message : 'Unable to load messages.'); }
    finally { if (current(version, userId)) setLoadingMessages(false); }
  }, [current, isAuthenticated, user?.id]);

  const sendMessage = useCallback(async (body: string) => {
    const userId = user?.id; const version = generation.current; const conversationId = selectedId;
    if (!conversationId || sending || !userId || !isAuthenticated || !body.trim() || body.trim().length > 2000) return false;
    setSending(true); setError(null);
    try {
      const result: any = await messageApi.sendMessage(conversationId, body.trim());
      if (!validMessage(result?.message) || !validConversation(result?.conversation)) throw new Error('The server returned an invalid message response.');
      if (!current(version, userId)) return false;
      setMessages((items) => byNewest([...items.filter((item) => item._id !== result.message._id), result.message]));
      setConversations((items) => items.map((item) => item._id === conversationId ? result.conversation : item));
      return true;
    } catch (cause) { if (current(version, userId)) setError(cause instanceof Error ? cause.message : 'Unable to send message.'); return false; }
    finally { if (current(version, userId)) setSending(false); }
  }, [current, isAuthenticated, selectedId, sending, user?.id]);

  const archiveConversation = useCallback(async (conversationId: string) => {
    const userId = user?.id; const version = generation.current;
    if (!userId || !isAuthenticated) return false;
    try { const result: any = await conversationApi.archiveConversation(conversationId); if (!validConversation(result?.conversation)) throw new Error('The server returned an invalid archive response.'); if (!current(version, userId)) return false; setConversations((items) => items.filter((item) => item._id !== conversationId)); if (selectedId === conversationId) { setSelectedId(null); setMessages([]); } return true; }
    catch (cause) { if (current(version, userId)) setError(cause instanceof Error ? cause.message : 'Unable to archive conversation.'); return false; }
  }, [current, isAuthenticated, selectedId, user?.id]);

  useEffect(() => {
    generation.current += 1;
    setConversations([]); setMessages([]); setSelectedId(null); setError(null);
    setLoadingConversations(false); setLoadingMessages(false); setSending(false);
    if (!isAuthLoading && isAuthenticated && user?.id) void loadConversations();
  }, [isAuthenticated, isAuthLoading, loadConversations, user?.id]);

  useEffect(() => {
    const userId = user?.id;
    const version = generation.current;
    if (!userId || !isAuthenticated || isAuthLoading) return;

    const unsubscribeMessage = socketService.onMessage((payload) => {
      if (!current(version, userId)) return;
      const eventMessage: any = payload?.message;
      const conversationId = typeof payload?.conversationId === 'string' ? payload.conversationId : null;
      if (!conversationId || !validMessage(eventMessage) || String(eventMessage.conversation) !== conversationId) {
        console.warn('Ignoring invalid realtime message payload.');
        return;
      }
      const knownConversation = conversationsRef.current.find((item) => item._id === conversationId);
      if (!knownConversation) {
        // A valid event can race the first inbox request. Do not trust it for
        // insertion without a known authorized conversation; reconcile from
        // REST instead.
        void loadConversations();
        return;
      }

      setConversations((items) => byConversationActivity(items.map((item) => item._id === conversationId
        ? { ...item, lastMessageAt: eventMessage.createdAt, lastMessageId: eventMessage._id }
        : item)));

      if (selectedIdRef.current === conversationId) {
        setMessages((items) => mergeMessages(items, [eventMessage]));
        if (eventMessage.sender !== userId) {
          void messageApi.markConversationRead(conversationId).then((read: any) => {
            if (current(version, userId) && selectedIdRef.current === conversationId && validConversation(read?.conversation)) {
              setConversations((items) => items.map((item) => item._id === conversationId ? read.conversation : item));
            }
          }).catch(() => {});
        }
      }
    });

    const unsubscribeReconnect = socketService.onReconnect(() => {
      if (!current(version, userId)) return;
      void loadConversations();
      const activeConversationId = selectedIdRef.current;
      if (activeConversationId) void selectConversation(activeConversationId);
    });

    return () => { unsubscribeMessage(); unsubscribeReconnect(); };
  }, [current, isAuthenticated, isAuthLoading, loadConversations, selectConversation, user?.id]);

  return { conversations, selectedId, messages, loadingConversations, loadingMessages, sending, error, selectConversation, sendMessage, archiveConversation };
}

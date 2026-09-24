import { useEffect, useRef, useState } from 'react';
import { Archive, ChevronLeft, MessageSquare, Send } from 'lucide-react';
import { EmptyState } from '../layout/EmptyState';
import { useSession } from '../../contexts/SessionContext';
import { useMessaging } from './useMessaging';

interface MessagingUIProps { userRole: string; }
const time = (value?: string) => value ? new Date(value).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' }) : '';
const Avatar = ({ person }: { person?: any }) => person?.avatar ? <img src={person.avatar} alt="" className="h-9 w-9 rounded-full object-cover" /> : <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-400/20 text-xs font-bold text-gold-400">{person?.name?.slice(0, 1)?.toUpperCase() || '?'}</span>;

export function MessagingUI(_props: MessagingUIProps) {
  const { user } = useSession(); const state = useMessaging();
  const [draft, setDraft] = useState(''); const [showChat, setShowChat] = useState(false); const end = useRef<HTMLDivElement>(null);
  const selected = state.conversations.find((item) => item._id === state.selectedId);
  const people = selected?.participantDisplays?.filter((person: any) => person.userId !== user?.id) || [];
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth' }); }, [state.messages]);
  const submit = async () => { if (await state.sendMessage(draft)) setDraft(''); };
  return <div className="flex h-[calc(100vh-140px)] overflow-hidden rounded-2xl border border-white/10 bg-navy-800/50">
    <aside className={`w-full border-r border-white/10 lg:flex lg:w-80 ${showChat ? 'hidden' : 'flex'} flex-col`}>
      <div className="border-b border-white/10 p-4"><h3 className="font-heading font-bold text-cream">Messages</h3><p className="text-xs text-ink/50">Your authorized conversations</p></div>
      <div className="flex-1 overflow-y-auto p-2">
        {state.loadingConversations && <p className="p-3 text-sm text-ink/60">Loading conversations...</p>}{state.error && <p role="alert" className="p-3 text-sm text-rose-300">{state.error}</p>}
        {!state.loadingConversations && !state.error && !state.conversations.length && <p className="p-3 text-sm text-ink/60">No authorized conversations yet.</p>}
        {state.conversations.map((conversation) => { const other = conversation.participantDisplays?.find((p: any) => p.userId !== user?.id) || conversation.participantDisplays?.[0]; return <button key={conversation._id} onClick={() => { void state.selectConversation(conversation._id); setShowChat(true); }} className={`mb-1 flex w-full items-center gap-3 rounded-xl p-3 text-left ${state.selectedId === conversation._id ? 'bg-gold-400/10' : 'hover:bg-white/5'}`}><Avatar person={other} /><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-cream">{other?.name || 'Conversation'}</span><span className="block truncate text-xs text-gold-400">{other?.role || conversation.type.replace('_', ' ')}</span><span className="block text-[10px] text-ink/50">{time(conversation.lastMessageAt)}</span></span></button>; })}
      </div>
    </aside>
    <section className={`flex flex-1 flex-col ${showChat ? 'flex' : 'hidden lg:flex'}`}>{selected ? <>
      <header className="flex items-center gap-3 border-b border-white/10 p-4"><button className="lg:hidden" onClick={() => setShowChat(false)}><ChevronLeft className="text-cream" /></button><Avatar person={people[0]} /><div className="min-w-0 flex-1"><p className="truncate font-semibold text-cream">{people.map((p: any) => p.name).join(', ') || 'Conversation'}</p><p className="truncate text-xs text-ink/50">{people.map((p: any) => p.role).join(', ') || 'Persisted conversation'}</p></div><button onClick={() => void state.archiveConversation(selected._id)} title="Archive conversation" className="rounded-lg p-2 text-ink/50 hover:bg-white/5 hover:text-gold-400"><Archive className="h-4 w-4" /></button></header>
      <div className="flex-1 space-y-3 overflow-y-auto p-4">{state.loadingMessages && <p className="text-sm text-ink/60">Loading messages...</p>}{!state.loadingMessages && !state.messages.length && <p className="text-sm text-ink/60">No messages yet.</p>}{[...state.messages].reverse().map((message) => { const mine = message.sender === user?.id; return <div key={message._id} className={`flex items-end gap-2 ${mine ? 'justify-end' : 'justify-start'}`}>{!mine && <Avatar person={message.senderDisplay} />}<div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${mine ? 'bg-gold-400 text-navy-900' : 'bg-white/10 text-cream'}`}><p>{message.body}</p><p className="mt-1 text-[10px] opacity-60">{message.senderDisplay?.name || 'Participant'} · {message.senderDisplay?.role || 'Participant'} · {time(message.createdAt)}</p></div></div>; })}<div ref={end} /></div>
      <footer className="flex gap-2 border-t border-white/10 p-4"><textarea value={draft} maxLength={2000} disabled={state.sending} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); void submit(); } }} placeholder="Write a message..." className="min-h-11 flex-1 resize-none rounded-xl border border-white/10 bg-navy-900 px-3 py-2 text-sm text-cream" /><button disabled={state.sending || !draft.trim()} onClick={() => void submit()} className="rounded-xl bg-gold-400 px-4 text-navy-900 disabled:opacity-50"><Send className="h-4 w-4" /></button></footer>
    </> : <EmptyState icon={<MessageSquare className="h-12 w-12 text-gold-400" />} title="Select a conversation" description="Choose a conversation to view its messages." />}</section>
  </div>;
}

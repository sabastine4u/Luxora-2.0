import { useState, useRef, useEffect } from 'react';
import { Search, Send, MoreVertical, Image as ImageIcon, Paperclip, Bell } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  role: string;
  avatar: string;
  unread: number;
  time: string;
  lastMessage: string;
  isOnline?: boolean;
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  time: string;
}

interface MessagingUIProps {
  userRole: 'Buyer' | 'Owner' | 'Agent' | 'Agency' | 'Admin';
}

export function MessagingUI({ userRole }: MessagingUIProps) {
  // Generate mock contacts based on role
  const getMockContacts = (): Contact[] => {
    const adminNotification: Contact = {
      id: 'admin-1',
      name: 'System Notifications',
      role: 'Admin',
      avatar: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=200&fit=crop',
      unread: 1,
      time: '10:00 AM',
      lastMessage: 'Your listing has been approved.',
      isOnline: true,
    };

    if (userRole === 'Buyer') {
      return [
        { id: 'agent-1', name: 'Adaeze Okonkwo', role: 'Agent - Meridian Luxury', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=200&h=200&fit=crop', unread: 2, time: '10:42 AM', lastMessage: 'The viewing for Skyline Penthouse is confirmed.', isOnline: true },
        { id: 'agent-2', name: 'Tunde Bakare', role: 'Agent - Crest & Crown', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=200&h=200&fit=crop', unread: 0, time: 'Yesterday', lastMessage: 'Let me know if you need more details on the Garden Court Villa.', isOnline: false },
        adminNotification
      ];
    }
    
    if (userRole === 'Owner') {
      return [
        { id: 'agent-1', name: 'Michael Eze', role: 'Agent - Luxora Core', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=200&h=200&fit=crop', unread: 0, time: '2:15 PM', lastMessage: 'I have 3 potential buyers scheduled for viewing this week.', isOnline: true },
        { id: 'agency-1', name: 'Sarah Jenkins', role: 'Agency Manager', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=200&h=200&fit=crop', unread: 1, time: 'Yesterday', lastMessage: 'Your updated contract has been uploaded.', isOnline: false },
        adminNotification
      ];
    }

    if (userRole === 'Agent') {
      return [
        { id: 'buyer-1', name: 'David Smith', role: 'Buyer', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=200&h=200&fit=crop', unread: 1, time: '09:30 AM', lastMessage: 'Perfect. 10:00 AM works.', isOnline: true },
        { id: 'owner-1', name: 'Grace Adeleke', role: 'Property Owner', avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?w=200&h=200&fit=crop', unread: 0, time: 'Yesterday', lastMessage: 'Please ensure they remove their shoes.', isOnline: false },
        { id: 'agency-1', name: 'James Carter', role: 'Agency Director', avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?w=200&h=200&fit=crop', unread: 0, time: 'Mon', lastMessage: 'Great job closing the Ikoyi deal.', isOnline: false },
        adminNotification
      ];
    }

    return [
      { id: 'c-1', name: 'Support Team', role: 'Support', avatar: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=200&fit=crop', unread: 0, time: '12:00 PM', lastMessage: 'How can we help you today?', isOnline: true }
    ];
  };

  const getMockMessages = (contactId: string): Message[] => {
    if (contactId === 'admin-1') {
      return [
        { id: 'm1', senderId: 'admin-1', text: 'Welcome to Luxora. Your account has been verified.', time: '08:00 AM' },
        { id: 'm2', senderId: 'admin-1', text: 'Your listing "Skyline Penthouse" has been approved and is now live.', time: '10:00 AM' }
      ];
    }

    return [
      { id: 'm1', senderId: contactId, text: 'Hello! Are you available to discuss the property?', time: '09:15 AM' },
      { id: 'm2', senderId: 'me', text: 'Hi! Yes, I am available now.', time: '09:30 AM' },
      { id: 'm3', senderId: contactId, text: 'Great. Let me send you the details.', time: '09:35 AM' },
    ];
  };

  const [contacts, setContacts] = useState<Contact[]>(getMockContacts());
  const [activeContact, setActiveContact] = useState<Contact>(contacts[0]);
  const [messages, setMessages] = useState<Message[]>(getMockMessages(contacts[0].id));
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle marking contact as read when clicking on it
  const handleContactClick = (contact: Contact) => {
    setActiveContact(contact);
    setMessages(getMockMessages(contact.id));
    
    if (contact.unread > 0) {
      setContacts(prev => prev.map(c => 
        c.id === contact.id ? { ...c, unread: 0 } : c
      ));
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');

    // Simulate response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const responseMsg: Message = {
        id: (Date.now() + 1).toString(),
        senderId: activeContact.id,
        text: 'Thanks for your message. I will review and get back to you shortly.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, responseMsg]);
      
      // Update contact's last message
      setContacts(prev => prev.map(c => 
        c.id === activeContact.id ? { ...c, lastMessage: responseMsg.text, time: responseMsg.time } : c
      ));
    }, 2000);
  };

  return (
    <div className="flex h-[calc(100vh-140px)] flex-col lg:flex-row overflow-hidden rounded-2xl border border-white/10 bg-navy-800/50">
      
      {/* Contacts Sidebar */}
      <div className="w-full lg:w-80 border-r border-white/10 flex flex-col">
        <div className="p-4 border-b border-white/10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
            <input 
              type="text" 
              placeholder="Search messages..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-white/10 bg-navy-900/80 py-2 pl-9 pr-4 text-sm text-cream placeholder:text-ink/40 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50 transition-all"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 no-scrollbar space-y-1">
          {filteredContacts.map((contact) => (
            <button 
              key={contact.id}
              onClick={() => handleContactClick(contact)}
              className={`w-full flex items-start gap-3 rounded-xl p-3 text-left transition-colors ${
                activeContact.id === contact.id ? 'bg-gold-400/10 border border-gold-400/20' : 'hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className="relative shrink-0">
                {contact.role === 'Admin' ? (
                  <div className="h-12 w-12 rounded-full bg-navy-900 flex items-center justify-center border border-white/10 text-gold-400">
                    <Bell className="h-6 w-6" />
                  </div>
                ) : (
                  <img src={contact.avatar} alt={contact.name} className="h-12 w-12 rounded-full object-cover" />
                )}
                {contact.isOnline && contact.role !== 'Admin' && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-navy-800"></span>
                )}
                {contact.unread > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold-400 text-[10px] font-bold text-navy-900 ring-2 ring-navy-800">
                    {contact.unread}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="truncate font-semibold text-cream text-sm">{contact.name}</h4>
                  <span className="text-[10px] text-ink/50 whitespace-nowrap ml-2">{contact.time}</span>
                </div>
                <p className={`truncate text-xs ${contact.unread > 0 ? 'text-cream font-medium' : 'text-ink/60'}`}>
                  {contact.lastMessage}
                </p>
              </div>
            </button>
          ))}
          {filteredContacts.length === 0 && (
            <div className="text-center p-4 text-sm text-ink/40">No conversations found.</div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-navy-900/30">
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-4 bg-navy-800/50">
          <div className="flex items-center gap-3">
            {activeContact.role === 'Admin' ? (
               <div className="h-10 w-10 rounded-full bg-navy-900 flex items-center justify-center border border-white/10 text-gold-400">
                 <Bell className="h-5 w-5" />
               </div>
            ) : (
               <div className="relative">
                 <img src={activeContact.avatar} alt={activeContact.name} className="h-10 w-10 rounded-full object-cover" />
                 {activeContact.isOnline && (
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-navy-800"></span>
                  )}
               </div>
            )}
            <div>
              <h3 className="font-semibold text-cream text-sm flex items-center gap-2">
                {activeContact.name}
              </h3>
              <p className="text-xs text-ink/50">{activeContact.role}</p>
            </div>
          </div>
          <button className="text-ink/40 hover:text-cream"><MoreVertical className="h-5 w-5" /></button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
          {messages.map((msg, index) => {
            const isMe = msg.senderId === 'me';
            const isAdmin = activeContact.role === 'Admin';
            const showAvatar = !isMe && !isAdmin && (index === 0 || messages[index - 1].senderId !== msg.senderId);

            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                {!isMe && !isAdmin && (
                  <div className="w-8 mr-2 shrink-0 flex items-end pb-1">
                    {showAvatar && <img src={activeContact.avatar} alt="" className="h-6 w-6 rounded-full" />}
                  </div>
                )}
                <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm relative group ${
                  isMe 
                    ? 'bg-gold-gradient text-navy-900 rounded-br-sm' 
                    : isAdmin
                      ? 'bg-navy-800/80 border border-gold-400/20 text-cream rounded-bl-sm w-full'
                      : 'bg-navy-800 border border-white/10 text-cream rounded-bl-sm'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <div className={`mt-1 text-[10px] text-right ${isMe ? 'text-navy-900/60' : 'text-ink/40'}`}>
                    {msg.time}
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Typing Indicator */}
          {isTyping && (
             <div className="flex justify-start">
               <div className="w-8 mr-2 shrink-0"></div>
               <div className="bg-navy-800 border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
                 <div className="w-1.5 h-1.5 bg-ink/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                 <div className="w-1.5 h-1.5 bg-ink/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                 <div className="w-1.5 h-1.5 bg-ink/40 rounded-full animate-bounce"></div>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        {activeContact.role !== 'Admin' && (
          <div className="p-4 bg-navy-800/50 border-t border-white/10">
            <div className="flex items-center gap-2">
              <button className="p-2 text-ink/40 hover:text-cream hover:bg-white/5 rounded-full transition-colors shrink-0">
                <Paperclip className="h-5 w-5" />
              </button>
              <button className="p-2 text-ink/40 hover:text-cream hover:bg-white/5 rounded-full transition-colors shrink-0">
                <ImageIcon className="h-5 w-5" />
              </button>
              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..." 
                className="flex-1 rounded-full border border-white/10 bg-navy-900/80 py-2.5 px-4 text-sm text-cream placeholder:text-ink/40 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50"
              />
              <button 
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="p-2.5 bg-gold-400 text-navy-900 rounded-full hover:bg-gold-300 transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

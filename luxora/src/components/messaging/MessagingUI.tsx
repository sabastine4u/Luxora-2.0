import { useState, useRef, useEffect, useMemo } from 'react';
import { Search, Send, MoreVertical, Image as ImageIcon, Paperclip, Bell, Smile, MapPin, CheckCheck, Check, MessageSquare, ChevronLeft } from 'lucide-react';
import { GhostButton, GoldButton } from '../ui/ui';
import { EmptyState } from '../layout/EmptyState';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useToast } from '../../contexts/ToastContext';

interface Contact {
  id: string;
  name: string;
  role: string;
  avatar: string;
  unread: number;
  time: string;
  lastMessage: string;
  isOnline?: boolean;
  propertyName?: string;
  propertyId?: string;
  propertyImage?: string;
  propertyPrice?: string;
  propertyLocation?: string;
  propertyStatus?: string;
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  time: string;
  read?: boolean;
}

interface MessagingUIProps {
  userRole: 'Buyer' | 'Owner' | 'Agent' | 'Agency' | 'Admin' | 'Manager' | 'Procurement' | 'Finance' | 'Analyst' | 'Property Manager';
}

export function MessagingUI({ userRole }: MessagingUIProps) {
  const navigate = useNavigate();
  const { showToast } = useToast();

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
        { 
          id: 'agent-1', name: 'Adaeze Okonkwo', role: 'Agent', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=200&h=200&fit=crop', 
          unread: 2, time: '10:42 AM', lastMessage: 'The viewing for Skyline Penthouse is confirmed.', isOnline: true,
          propertyName: 'Skyline Penthouse',
          propertyId: 'PROP-001',
          propertyImage: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=200',
          propertyPrice: '₦185,000,000',
          propertyLocation: 'Victoria Island, Lagos'
        },
        { 
          id: 'owner-1', name: 'Tunde Bakare', role: 'Owner', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=200&h=200&fit=crop', 
          unread: 0, time: 'Yesterday', lastMessage: 'Let me know if you need more details on the Garden Court Villa.', isOnline: false,
          propertyName: 'Garden Court Villa',
          propertyId: 'PROP-002',
          propertyImage: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=200',
          propertyPrice: '₦680,000,000',
          propertyLocation: 'Banana Island, Lagos'
        },
        { 
          id: 'agency-1', name: 'Meridian Luxury', role: 'Agency', avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?w=200&h=200&fit=crop', 
          unread: 0, time: 'Monday', lastMessage: 'Here are the floor plans you requested.', isOnline: true,
        },
        adminNotification
      ];
    }
    
    if (userRole === 'Owner') {
      return [
        { 
          id: 'agent-1', name: 'Michael Eze', role: 'Agent - Luxora Core', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=200&h=200&fit=crop', 
          unread: 0, time: '2:15 PM', lastMessage: 'I have 3 potential buyers scheduled for viewing this week.', isOnline: true,
          propertyName: 'Skyline Penthouse',
          propertyId: 'PROP-001',
          propertyImage: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=200',
          propertyPrice: '₦185,000,000',
          propertyLocation: 'Victoria Island, Lagos'
        },
        { 
          id: 'manager-1', name: 'Sarah Jenkins', role: 'Property Manager', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=200&h=200&fit=crop', 
          unread: 1, time: 'Yesterday', lastMessage: 'The maintenance at the villa is completed.', isOnline: false,
          propertyName: 'Garden Court Villa',
          propertyId: 'PROP-002',
          propertyImage: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=200',
          propertyPrice: '₦680,000,000',
          propertyLocation: 'Banana Island, Lagos'
        },
        {
          id: 'buyer-1', name: 'Emeka Obi', role: 'Buyer', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=200&h=200&fit=crop',
          unread: 2, time: 'Monday', lastMessage: 'Is the price negotiable?', isOnline: true,
          propertyName: 'Lekki Phase 1 Duplex',
          propertyId: 'PROP-003',
          propertyImage: 'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=200',
          propertyPrice: '₦120,000,000',
          propertyLocation: 'Lekki Phase 1, Lagos'
        },
        adminNotification
      ];
    }

    if (userRole === 'Agent') {
      return [
        { id: 'buyer-1', name: 'David Smith', role: 'Buyer', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=200&h=200&fit=crop', unread: 1, time: '09:30 AM', lastMessage: 'Perfect. 10:00 AM works.', isOnline: true,
          propertyName: 'Skyline Penthouse', propertyImage: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=200', propertyPrice: '₦185,000,000', propertyLocation: 'Victoria Island, Lagos', propertyStatus: 'Active'
        },
        { id: 'owner-1', name: 'Grace Adeleke', role: 'Property Owner', avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?w=200&h=200&fit=crop', unread: 0, time: 'Yesterday', lastMessage: 'Please ensure they remove their shoes.', isOnline: false,
          propertyName: 'Aurora Studio', propertyImage: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=200', propertyPrice: '₦45,000,000', propertyLocation: 'Yaba, Lagos', propertyStatus: 'Pending'
        },
        { id: 'agency-1', name: 'James Carter', role: 'Agency Director', avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?w=200&h=200&fit=crop', unread: 0, time: 'Mon', lastMessage: 'Great job closing the Ikoyi deal.', isOnline: false },
        { id: 'manager-1', name: 'Frank Nnamdi', role: 'Property Manager', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=200&h=200&fit=crop', unread: 2, time: 'Tue', lastMessage: 'The plumbing issue at the penthouse is resolved.', isOnline: true,
          propertyName: 'Skyline Penthouse', propertyImage: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=200', propertyPrice: '₦185,000,000', propertyLocation: 'Victoria Island, Lagos', propertyStatus: 'Active'
        },
        adminNotification
      ];
    }

    if (userRole === 'Agency') {
      return [
        { id: 'agent-1', name: 'Adaeze Okonkwo', role: 'Agent - Lekki Branch', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200', unread: 2, time: '10:42 AM', lastMessage: 'The client accepted the counter-offer.', isOnline: true,
          propertyName: 'Skyline Penthouse', propertyImage: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=200', propertyPrice: '₦420,000,000', propertyLocation: 'Eko Atlantic, Lagos', propertyStatus: 'Pending'
        },
        { id: 'owner-1', name: 'Tunde Bakare', role: 'Property Owner', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200', unread: 0, time: 'Yesterday', lastMessage: 'When will the agency fees be remitted?', isOnline: false,
          propertyName: 'Garden Court Villa', propertyImage: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=200', propertyPrice: '₦680,000,000', propertyLocation: 'Banana Island, Lagos', propertyStatus: 'Active'
        },
        { id: 'buyer-1', name: 'Dr. Chidi Okafor', role: 'Buyer', avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=200', unread: 1, time: 'Monday', lastMessage: 'I need to schedule a meeting with the agency director.', isOnline: true },
        { id: 'manager-1', name: 'Sarah Jenkins', role: 'Property Manager', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200', unread: 0, time: 'Sep 28', lastMessage: 'The maintenance report for the Ikoyi block is attached.', isOnline: false },
        { id: 'admin-1', name: 'System Notifications', role: 'Admin', avatar: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=200&fit=crop', unread: 0, time: 'Sep 25', lastMessage: 'Your agency license verification is complete.', isOnline: true },
        { id: 'super-1', name: 'Luxora Corporate', role: 'Super Admin', avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200', unread: 0, time: 'Sep 20', lastMessage: 'Please review the updated platform terms.', isOnline: false }
      ];
    }

    if (userRole === 'Finance') {
      return [
        { id: 'admin-1', name: 'System Notifications', role: 'Admin', avatar: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=200&fit=crop', unread: 2, time: '09:00 AM', lastMessage: 'Monthly reconciliation report is ready for review.', isOnline: true },
        { id: 'manager-1', name: 'Olivia Chen', role: 'Management', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200', unread: 1, time: 'Yesterday', lastMessage: 'Can we discuss the budget variance for Q3?', isOnline: true },
        { id: 'procurement-1', name: 'David Kim', role: 'Procurement', avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=200', unread: 0, time: 'Monday', lastMessage: 'Vendor invoice #INV-492 has been uploaded.', isOnline: false },
        { id: 'agent-1', name: 'Sarah Jenkins', role: 'Agent', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200', unread: 0, time: 'Last Week', lastMessage: 'When will my commission for the Ikoyi deal be processed?', isOnline: true }
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
      { id: 'm2', senderId: 'me', text: 'Hi! Yes, I am available now.', time: '09:30 AM', read: true },
      { id: 'm3', senderId: contactId, text: 'Great. Let me send you the details.', time: '09:35 AM' },
    ];
  };

  const [contacts, setContacts] = useState<Contact[]>(getMockContacts());
  const [activeContact, setActiveContact] = useState<Contact>(contacts[0]);
  const [messages, setMessages] = useState<Message[]>(getMockMessages(contacts[0].id));
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [isTyping, setIsTyping] = useState(false);
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredContacts = useMemo(() => {
    let result = contacts.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.propertyName && c.propertyName.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (filterType === 'Agents') result = result.filter(c => c.role.includes('Agent'));
    else if (filterType === 'Owners') result = result.filter(c => c.role.includes('Owner') || c.role === 'Property Owner');
    else if (filterType === 'Agencies') result = result.filter(c => c.role.includes('Agency'));
    else if (filterType === 'Unread') result = result.filter(c => c.unread > 0);

    return result;
  }, [contacts, searchQuery, filterType]);

  // Handle marking contact as read when clicking on it
  const handleContactClick = (contact: Contact) => {
    setActiveContact(contact);
    setMessages(getMockMessages(contact.id));
    
    if (contact.unread > 0) {
      setContacts(prev => prev.map(c => 
        c.id === contact.id ? { ...c, unread: 0 } : c
      ));
    }
    setShowChatOnMobile(true);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, showChatOnMobile]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };

    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');

    // Simulate response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      // Mark as read when they reply
      setMessages(prev => prev.map(m => m.senderId === 'me' ? { ...m, read: true } : m));
      
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

  if (contacts.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-12 h-[calc(100vh-140px)] flex items-center justify-center">
        <EmptyState
          icon={<MessageSquare className="h-12 w-12 text-gold-400" />}
          title="No conversations found."
          description="When you connect with agents, owners, or agencies, your messages will appear here."
          actionLabel="Browse Properties"
          onAction={() => navigate(ROUTES.PROPERTIES)}
        />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-140px)] overflow-hidden rounded-2xl border border-white/10 bg-navy-800/50 relative">
      
      {/* Contacts Sidebar */}
      <div className={`w-full lg:w-80 border-r border-white/10 flex-col absolute inset-0 lg:static z-10 bg-navy-800/95 lg:bg-transparent ${showChatOnMobile ? 'hidden lg:flex' : 'flex'}`}>
        <div className="p-4 border-b border-white/10 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
            <input 
              type="text" 
              placeholder="Search by name or property..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-white/10 bg-navy-900/80 py-2 pl-9 pr-4 text-sm text-cream placeholder:text-ink/40 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50 transition-all"
            />
          </div>
          {userRole !== 'Admin' && (
             <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
               {['All', 'Agents', 'Owners', 'Agencies', 'Unread'].map(filter => (
                 <button
                   key={filter}
                   onClick={() => setFilterType(filter)}
                   className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${
                     filterType === filter ? 'bg-gold-400 text-navy-900 font-bold' : 'bg-white/5 text-ink/60 hover:text-cream hover:bg-white/10'
                   }`}
                 >
                   {filter}
                 </button>
               ))}
             </div>
          )}
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
                <p className={`truncate text-[10px] ${contact.propertyName ? 'text-gold-400' : 'text-ink/50'}`}>
                  {contact.propertyName ? contact.propertyName : contact.role}
                </p>
                <p className={`truncate text-xs mt-0.5 ${contact.unread > 0 ? 'text-cream font-medium' : 'text-ink/60'}`}>
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
      <div className={`flex-1 flex-col h-full bg-navy-900/30 absolute inset-0 lg:static z-20 bg-navy-900 lg:bg-transparent ${!showChatOnMobile ? 'hidden lg:flex' : 'flex'}`}>
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-4 bg-navy-800/50">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-ink/40 hover:text-cream mr-1" onClick={() => setShowChatOnMobile(false)}>
              <ChevronLeft className="h-6 w-6" />
            </button>
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

        {/* Property Context Card */}
        {activeContact.propertyName && (userRole === 'Buyer' || userRole === 'Agent' || userRole === 'Owner') && (
          <div className="bg-navy-800/80 border-b border-white/10 p-4 shrink-0 flex flex-col sm:flex-row gap-4 justify-between items-center shadow-lg">
             <div className="flex gap-4 w-full sm:w-auto items-center">
               <img src={activeContact.propertyImage} className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white/10" alt={activeContact.propertyName} />
               <div className="min-w-0">
                 <h4 className="font-semibold text-cream text-sm truncate">
                   {activeContact.propertyName}
                   {activeContact.propertyStatus && <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">{activeContact.propertyStatus}</span>}
                 </h4>
                 <div className="text-[11px] text-ink/60 flex items-center gap-1 mt-1 truncate"><MapPin className="h-3 w-3 shrink-0" /> {activeContact.propertyLocation}</div>
                 <div className="text-gold-400 font-bold text-sm mt-1">{activeContact.propertyPrice}</div>
               </div>
             </div>
             <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
               {userRole === 'Agent' ? (
                 <>
                   <GhostButton size="sm" onClick={() => navigate(ROUTES.PROPERTIES)}>Open Property</GhostButton>
                   <GhostButton size="sm" onClick={() => showToast({ type: 'info', title: 'Calling Client', description: 'Initiating call...' })}>Call Client</GhostButton>
                   <GhostButton size="sm">Schedule Viewing</GhostButton>
                   <GoldButton size="sm">View Offer</GoldButton>
                 </>
               ) : (
                 <>
                   <GhostButton size="sm" onClick={() => navigate(ROUTES.PROPERTIES)}>View Property</GhostButton>
                   <GhostButton size="sm">Schedule Viewing</GhostButton>
                   <GoldButton size="sm">Make Offer</GoldButton>
                   <GhostButton size="sm" className="text-rose-400 border-rose-400/20 hover:text-rose-300 hover:bg-rose-400/10">Report</GhostButton>
                 </>
               )}
             </div>
          </div>
        )}

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
                <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm relative group ${
                  isMe 
                    ? 'bg-gold-gradient text-navy-900 rounded-br-sm' 
                    : isAdmin
                      ? 'bg-navy-800/80 border border-gold-400/20 text-cream rounded-bl-sm w-full'
                      : 'bg-navy-800 border border-white/10 text-cream rounded-bl-sm'
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  <div className={`mt-1 text-[10px] text-right flex items-center justify-end gap-1 ${isMe ? 'text-navy-900/60' : 'text-ink/40'}`}>
                    <span>{msg.time}</span>
                    {isMe && (
                      msg.read ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />
                    )}
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
            <div className="flex items-center gap-1 sm:gap-2">
              <button className="p-2 text-ink/40 hover:text-cream hover:bg-white/5 rounded-full transition-colors shrink-0">
                <Paperclip className="h-5 w-5" />
              </button>
              <button className="p-2 text-ink/40 hover:text-cream hover:bg-white/5 rounded-full transition-colors shrink-0 hidden sm:block">
                <ImageIcon className="h-5 w-5" />
              </button>
              <button className="p-2 text-ink/40 hover:text-cream hover:bg-white/5 rounded-full transition-colors shrink-0 hidden sm:block">
                <Smile className="h-5 w-5" />
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
                className="p-2.5 bg-gold-400 text-navy-900 rounded-full hover:bg-gold-300 transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed ml-1"
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

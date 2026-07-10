import type { Participant, Conversation, Message, CommunicationTemplate, FollowUpTask, CalendarEvent } from '../types/communicationTypes';

const now = new Date();
const timeMinus = (minutes: number) => new Date(now.getTime() - minutes * 60000).toISOString();

export const MOCK_USERS: Record<string, Participant> = {
  superAdmin: {
    id: 'u-1',
    name: 'Alexander Sterling',
    role: 'Super Admin',
    department: 'Executive',
    onlineStatus: 'online',
    lastSeen: timeMinus(0),
    avatar: 'https://ui-avatars.com/api/?name=Alexander+Sterling&background=1E3A8A&color=fff',
  },
  management: {
    id: 'u-2',
    name: 'Victoria Chase',
    role: 'Management',
    department: 'Operations',
    onlineStatus: 'away',
    lastSeen: timeMinus(15),
    avatar: 'https://ui-avatars.com/api/?name=Victoria+Chase&background=B4975A&color=fff',
  },
  agencyAdmin: {
    id: 'u-3',
    name: 'Marcus Thorne',
    role: 'Agency',
    department: 'Thorne Real Estate',
    onlineStatus: 'online',
    lastSeen: timeMinus(0),
    avatar: 'https://ui-avatars.com/api/?name=Marcus+Thorne&background=1E3A8A&color=fff',
  },
  agent: {
    id: 'u-4',
    name: 'Sarah Jenkins',
    role: 'Agent',
    department: 'Sales',
    onlineStatus: 'busy',
    lastSeen: timeMinus(5),
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Jenkins&background=B4975A&color=fff',
  },
  buyer: {
    id: 'u-5',
    name: 'James Wilson',
    role: 'Buyer',
    onlineStatus: 'offline',
    lastSeen: timeMinus(120),
    avatar: 'https://ui-avatars.com/api/?name=James+Wilson&background=F5F5DC&color=333',
  },
  owner: {
    id: 'u-6',
    name: 'Eleanor Vance',
    role: 'Owner',
    onlineStatus: 'online',
    lastSeen: timeMinus(0),
    avatar: 'https://ui-avatars.com/api/?name=Eleanor+Vance&background=F5F5DC&color=333',
  },
  finance: {
    id: 'u-7',
    name: 'David Chen',
    role: 'Finance',
    department: 'Accounting',
    onlineStatus: 'online',
    lastSeen: timeMinus(0),
    avatar: 'https://ui-avatars.com/api/?name=David+Chen&background=1E3A8A&color=fff',
  },
  procurement: {
    id: 'u-8',
    name: 'Elena Rodriguez',
    role: 'Procurement',
    department: 'Purchasing',
    onlineStatus: 'offline',
    lastSeen: timeMinus(300),
    avatar: 'https://ui-avatars.com/api/?name=Elena+Rodriguez&background=B4975A&color=fff',
  },
  compliance: {
    id: 'u-9',
    name: 'Robert Hayes',
    role: 'Compliance',
    department: 'Legal',
    onlineStatus: 'online',
    lastSeen: timeMinus(0),
    avatar: 'https://ui-avatars.com/api/?name=Robert+Hayes&background=1E3A8A&color=fff',
  },
  support: {
    id: 'u-10',
    name: 'Support Team',
    role: 'Customer Support',
    department: 'Support',
    onlineStatus: 'online',
    lastSeen: timeMinus(0),
    avatar: 'https://ui-avatars.com/api/?name=Support+Team&background=B4975A&color=fff',
  }
};

export const MOCK_MESSAGES: Message[] = [
  // Conversation 1: Buyer <-> Agent
  {
    id: 'm-1',
    conversationId: 'c-1',
    senderId: MOCK_USERS.buyer.id,
    type: 'Text',
    content: 'Hi Sarah, I saw the new listing in Victoria Island. Is it still available for a viewing this weekend?',
    timestamp: timeMinus(1440),
    status: 'read'
  },
  {
    id: 'm-2',
    conversationId: 'c-1',
    senderId: MOCK_USERS.agent.id,
    type: 'Text',
    content: 'Hello James! Yes, it is. I can schedule you in for Saturday at 2 PM. Does that work?',
    timestamp: timeMinus(1430),
    status: 'read'
  },
  {
    id: 'm-3',
    conversationId: 'c-1',
    senderId: MOCK_USERS.buyer.id,
    type: 'Text',
    content: 'Perfect. See you then.',
    timestamp: timeMinus(1400),
    status: 'read'
  },
  {
    id: 'm-4',
    conversationId: 'c-1',
    senderId: MOCK_USERS.agent.id,
    type: 'SharedListing',
    content: 'Here are the details for the property we will be viewing.',
    timestamp: timeMinus(1300),
    status: 'read',
    metadata: {
      propertyTitle: 'Luxury 4-Bed Villa',
      location: 'Victoria Island',
      price: '₦ 450,000,000'
    }
  },
  {
    id: 'm-5',
    conversationId: 'c-1',
    senderId: MOCK_USERS.buyer.id,
    type: 'Text',
    content: 'Thanks Sarah. Looking forward to it.',
    timestamp: timeMinus(10),
    status: 'delivered'
  },

  // Conversation 2: Internal Team Chat
  {
    id: 'm-10',
    conversationId: 'c-2',
    senderId: MOCK_USERS.management.id,
    type: 'SystemNotification',
    content: 'Team, please ensure all Q3 reports are finalized by Friday.',
    timestamp: timeMinus(2880),
    status: 'read'
  },
  {
    id: 'm-11',
    conversationId: 'c-2',
    senderId: MOCK_USERS.finance.id,
    type: 'Text',
    content: 'Understood. Accounting is wrapping up the final figures now.',
    timestamp: timeMinus(2800),
    status: 'read'
  },
  {
    id: 'm-12',
    conversationId: 'c-2',
    senderId: MOCK_USERS.compliance.id,
    type: 'Text',
    content: 'Legal review is complete.',
    timestamp: timeMinus(120),
    status: 'read'
  },
  
  // Conversation 3: Agent <-> Owner
  {
    id: 'm-20',
    conversationId: 'c-3',
    senderId: MOCK_USERS.owner.id,
    type: 'Text',
    content: 'Hi Sarah, any updates on the tenant screening?',
    timestamp: timeMinus(60),
    status: 'read'
  },
  {
    id: 'm-21',
    conversationId: 'c-3',
    senderId: MOCK_USERS.agent.id,
    type: 'Text',
    content: 'We have two strong candidates. I will send their profiles shortly.',
    timestamp: timeMinus(55),
    status: 'read'
  },
  {
    id: 'm-22',
    conversationId: 'c-3',
    senderId: MOCK_USERS.agent.id,
    type: 'Document',
    content: 'Background Check Summary.pdf',
    timestamp: timeMinus(5),
    status: 'delivered',
    attachments: [
      { id: 'a-1', type: 'document', name: 'Background Check Summary.pdf', url: '#', size: 1024000 }
    ]
  }
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'c-1',
    type: 'Direct',
    participants: [MOCK_USERS.buyer, MOCK_USERS.agent],
    lastMessage: MOCK_MESSAGES.find(m => m.id === 'm-5'),
    unreadCount: 1,
    isPinned: true,
    isFavorite: true,
    tags: ['Viewing Scheduled'],
    createdAt: timeMinus(10000),
    updatedAt: timeMinus(10)
  },
  {
    id: 'c-2',
    type: 'Team',
    title: 'Management Updates',
    participants: [MOCK_USERS.superAdmin, MOCK_USERS.management, MOCK_USERS.finance, MOCK_USERS.compliance, MOCK_USERS.procurement],
    lastMessage: MOCK_MESSAGES.find(m => m.id === 'm-12'),
    unreadCount: 0,
    isPinned: false,
    isFavorite: false,
    tags: ['Internal', 'Q3'],
    createdAt: timeMinus(20000),
    updatedAt: timeMinus(120)
  },
  {
    id: 'c-3',
    type: 'Property',
    title: 'Lekki Phase 1 - 5 Bed Detached',
    participants: [MOCK_USERS.owner, MOCK_USERS.agent],
    lastMessage: MOCK_MESSAGES.find(m => m.id === 'm-22'),
    unreadCount: 2,
    isPinned: false,
    isFavorite: true,
    propertyId: 'p-1',
    createdAt: timeMinus(5000),
    updatedAt: timeMinus(5)
  },
  {
    id: 'c-4',
    type: 'System',
    title: 'System Notifications',
    participants: [MOCK_USERS.superAdmin],
    lastMessage: {
      id: 'm-100',
      conversationId: 'c-4',
      senderId: 'system',
      type: 'SystemNotification',
      content: 'Server maintenance scheduled for 2AM WAT.',
      timestamp: timeMinus(30),
      status: 'delivered'
    },
    unreadCount: 1,
    isPinned: true,
    createdAt: timeMinus(1000),
    updatedAt: timeMinus(30)
  }
];

export const CURRENT_USER = MOCK_USERS.agent;

export const MOCK_TEMPLATES: CommunicationTemplate[] = [
  { id: 't1', title: 'Welcome Buyer', category: 'Onboarding', content: 'Hello! Welcome to Luxora. I will be your dedicated agent for finding your dream home.' },
  { id: 't2', title: 'Viewing Reminder', category: 'Scheduling', content: 'This is a friendly reminder for our property viewing scheduled for tomorrow. Please let me know if you need to reschedule.' },
  { id: 't3', title: 'Offer Accepted', category: 'Transactions', content: 'Great news! Your offer has been officially accepted by the owner. I will send over the next steps shortly.' },
  { id: 't4', title: 'Offer Rejected', category: 'Transactions', content: 'Unfortunately, the owner has decided to proceed with another offer. Let\'s review our other options.' },
  { id: 't5', title: 'Property Update', category: 'General', content: 'I have some new updates regarding the property we discussed. Let me know when you have a moment to chat.' },
  { id: 't6', title: 'Inspection Reminder', category: 'Scheduling', content: 'A reminder that the property inspection is scheduled for this week. Our verified inspector will be on-site.' },
];

export const MOCK_TASKS: FollowUpTask[] = [
  { id: 'tsk1', title: 'Send revised contract', status: 'Due Today', priority: 'high', dueDate: timeMinus(-60), ownerId: MOCK_USERS.agent.id, tags: ['Contract', 'Urgent'] },
  { id: 'tsk2', title: 'Follow up on Victoria Island viewing', status: 'Due Today', priority: 'medium', dueDate: timeMinus(-120), ownerId: MOCK_USERS.agent.id, relatedConversationId: 'c-1', tags: ['Follow-up'] },
  { id: 'tsk3', title: 'Confirm tenant background check', status: 'Waiting', priority: 'medium', dueDate: timeMinus(1440), ownerId: MOCK_USERS.agent.id, relatedConversationId: 'c-3', tags: ['Compliance'] },
  { id: 'tsk4', title: 'Prepare Q3 performance review', status: 'Tomorrow', priority: 'low', dueDate: timeMinus(-1440), ownerId: MOCK_USERS.agent.id, tags: ['Internal'] },
];

export const MOCK_CALENDAR: CalendarEvent[] = [
  { id: 'evt1', title: 'Victoria Island Villa Viewing', type: 'Viewing', date: timeMinus(-1440), participants: [MOCK_USERS.agent.id, MOCK_USERS.buyer.id], location: 'Victoria Island, Lagos' },
  { id: 'evt2', title: 'Management Q3 Sync', type: 'Meeting', date: timeMinus(-2880), participants: [MOCK_USERS.management.id, MOCK_USERS.agent.id] },
  { id: 'evt3', title: 'Client Closing - Lekki Phase 1', type: 'Closing', date: timeMinus(-4320), participants: [MOCK_USERS.agent.id, MOCK_USERS.owner.id], location: 'Luxora HQ' },
];

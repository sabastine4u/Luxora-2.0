import { LeftNavigation } from './components/LeftNavigation';
import { ConversationList } from './components/ConversationList';
import { ConversationWindow } from './components/ConversationWindow';
import { useCommunicationCenter } from './hooks/useCommunicationCenter';
import { SharedFileWorkspace } from './components/SharedFileWorkspace';
import { SharedCalendar } from './components/SharedCalendar';
import { FollowUpCenter } from './components/FollowUpCenter';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { PresenceDashboard } from './components/PresenceDashboard';
import { AnnouncementCenter } from './components/AnnouncementCenter';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

export default function CommunicationCenterPage() {
  const {
    conversations,
    activeConversation,
    activeMessages,
    currentUser,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    selectConversation,
    sendMessage
  } = useCommunicationCenter();

  // Example unread counts logic
  const unreadCounts = conversations.reduce((acc, conv) => {
    const type = conv.type.toLowerCase();
    if (conv.unreadCount > 0) {
      acc[type] = (acc[type] || 0) + conv.unreadCount;
      acc['all'] = (acc['all'] || 0) + conv.unreadCount;
      acc['unread'] = (acc['unread'] || 0) + conv.unreadCount;
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <DashboardLayout activeTab="Communication Center">
      <div className="h-[calc(100vh-theme(spacing.20))] flex bg-white dark:bg-ink rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-ink-light">
      <LeftNavigation 
        activeCategory={activeCategory} 
        onCategorySelect={setActiveCategory}
        unreadCounts={unreadCounts}
      />
      {/* Main Content Area */}
      {activeCategory === 'files' ? (
        <SharedFileWorkspace />
      ) : activeCategory === 'calendar' ? (
        <SharedCalendar />
      ) : activeCategory === 'tasks' ? (
        <FollowUpCenter />
      ) : activeCategory === 'analytics' ? (
        <AnalyticsDashboard />
      ) : activeCategory === 'presence' ? (
        <PresenceDashboard />
      ) : activeCategory === 'announcements' ? (
        <AnnouncementCenter />
      ) : (
        <>
          <ConversationList 
            conversations={conversations}
            currentUser={currentUser}
            activeConversationId={activeConversation?.id || null}
            onSelectConversation={selectConversation}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          
          <ConversationWindow 
            conversation={activeConversation}
            messages={activeMessages}
            currentUser={currentUser}
            onSendMessage={sendMessage}
          />
        </>
      )}
      </div>
    </DashboardLayout>
  );
}

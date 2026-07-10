import type { Conversation, Participant } from '../types/communicationTypes';
import { ConversationCard } from './ConversationCard';
import { Search, Filter, Plus } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';

interface ConversationListProps {
  conversations: Conversation[];
  currentUser: Participant;
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const ConversationList = ({ 
  conversations, 
  currentUser, 
  activeConversationId, 
  onSelectConversation,
  searchQuery,
  onSearchChange
}: ConversationListProps) => {
  return (
    <div className="w-80 flex flex-col h-full bg-white dark:bg-ink border-r border-gray-100 dark:border-ink-light">
      <div className="p-4 border-b border-gray-100 dark:border-ink-light space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Conversations</h2>
          <GhostButton size="sm" className="w-8 h-8 p-0 rounded-full bg-gray-50 dark:bg-ink-light">
            <Plus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </GhostButton>
        </div>

        <div className="relative flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-gray-400" />
          <input 
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-10 py-2 bg-gray-50 dark:bg-ink-dark/50 border border-gray-200 dark:border-ink-light rounded-xl text-sm focus:outline-none focus:border-gold-500 transition-colors dark:text-white placeholder-gray-400"
          />
          <GhostButton size="sm" className="absolute right-1 w-7 h-7 p-0 rounded-full text-gray-400">
            <Filter className="w-3.5 h-3.5" />
          </GhostButton>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {conversations.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            No conversations found.
          </div>
        ) : (
          conversations.map(conversation => (
            <ConversationCard 
              key={conversation.id}
              conversation={conversation}
              currentUser={currentUser}
              isActive={activeConversationId === conversation.id}
              onClick={onSelectConversation}
            />
          ))
        )}
      </div>
    </div>
  );
};

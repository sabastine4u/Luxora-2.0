import type { Conversation, Participant } from '../types/communicationTypes';
import { formatMessageTime } from '../utils/formatter';
import { OnlineIndicator } from './OnlineIndicator';
import { clsx } from 'clsx';
import { Pin } from 'lucide-react';

interface ConversationCardProps {
  conversation: Conversation;
  currentUser: Participant;
  isActive: boolean;
  onClick: (id: string) => void;
}

export const ConversationCard = ({ conversation, currentUser, isActive, onClick }: ConversationCardProps) => {
  const isGroup = conversation.participants.length > 2;
  const otherParticipant = conversation.participants.find(p => p.id !== currentUser.id);
  
  const title = conversation.title || (otherParticipant ? otherParticipant.name : 'Unknown');
  const avatar = isGroup ? null : otherParticipant?.avatar;
  const onlineStatus = isGroup ? 'online' : (otherParticipant?.onlineStatus || 'offline');
  const lastMessage = conversation.lastMessage;

  return (
    <div 
      onClick={() => onClick(conversation.id)}
      className={clsx(
        'flex items-start space-x-3 p-3 rounded-xl cursor-pointer transition-colors border',
        isActive 
          ? 'bg-navy-50 dark:bg-ink-light border-navy-100 dark:border-ink' 
          : 'bg-white dark:bg-ink border-transparent hover:bg-gray-50 dark:hover:bg-ink-light/50'
      )}
    >
      <div className="relative flex-shrink-0">
        {avatar ? (
          <img src={avatar} alt={title} className="w-12 h-12 rounded-full object-cover bg-gray-100" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gold-100 dark:bg-gold-900/30 flex items-center justify-center text-gold-600 dark:text-gold-400 font-medium">
            {title.substring(0, 2).toUpperCase()}
          </div>
        )}
        {!isGroup && (
          <OnlineIndicator 
            status={onlineStatus} 
            size="sm"
            className="absolute bottom-0 right-0"
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-1">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate pr-2">
            {title}
          </h4>
          {lastMessage && (
            <span className="text-xs text-gray-400 whitespace-nowrap">
              {formatMessageTime(lastMessage.timestamp)}
            </span>
          )}
        </div>

        <div className="flex justify-between items-center">
          <p className={clsx(
            'text-sm truncate pr-2',
            conversation.unreadCount > 0 ? 'font-medium text-gray-900 dark:text-gray-100' : 'text-gray-500'
          )}>
            {lastMessage?.content || 'No messages yet'}
          </p>
          <div className="flex items-center space-x-1 flex-shrink-0">
            {conversation.isPinned && <Pin className="w-3 h-3 text-gray-400" />}
            {conversation.unreadCount > 0 && (
              <span className="bg-gold-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {conversation.unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

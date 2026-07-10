import type { Conversation, Participant } from '../types/communicationTypes';
import { OnlineIndicator } from './OnlineIndicator';
import { Phone, Video, MoreVertical, Info, Sparkles } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';

interface ConversationHeaderProps {
  conversation: Conversation;
  currentUser: Participant;
  onToggleInfo: () => void;
  onStartVoice?: () => void;
  onStartVideo?: () => void;
  onOpenAssistant?: () => void;
}

export const ConversationHeader = ({ conversation, currentUser, onToggleInfo, onStartVoice, onStartVideo, onOpenAssistant }: ConversationHeaderProps) => {
  const isGroup = conversation.participants.length > 2;
  const otherParticipant = conversation.participants.find(p => p.id !== currentUser.id);
  
  const title = conversation.title || (otherParticipant ? otherParticipant.name : 'Unknown');
  const avatar = isGroup ? null : otherParticipant?.avatar;
  const onlineStatus = isGroup ? 'online' : (otherParticipant?.onlineStatus || 'offline');
  const subtitle = isGroup ? `${conversation.participants.length} participants` : otherParticipant?.role;

  return (
    <div className="h-16 border-b border-gray-100 dark:border-ink-light bg-white dark:bg-ink flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <div className="relative">
          {avatar ? (
            <img src={avatar} alt={title} className="w-10 h-10 rounded-full object-cover bg-gray-100" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gold-100 dark:bg-gold-900/30 flex items-center justify-center text-gold-600 dark:text-gold-400 font-medium">
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
        
        <div>
          <h2 className="text-[15px] font-semibold text-gray-900 dark:text-white">{title}</h2>
          <p className="text-xs text-gray-500 capitalize">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center space-x-1 border-r border-gray-100 dark:border-ink-light pr-2">
        <div title="AI Assistant">
          <GhostButton size="sm" onClick={onOpenAssistant} className="w-9 h-9 p-0 rounded-full text-gold-500 hover:bg-gold-50 dark:hover:bg-gold-900/20 group">
            <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </GhostButton>
        </div>
        <div title="Start Voice Call">
          <GhostButton size="sm" onClick={onStartVoice} className="w-9 h-9 p-0 rounded-full text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20">
            <Phone className="w-4 h-4" />
          </GhostButton>
        </div>
        <div title="Start Video Call">
          <GhostButton size="sm" onClick={onStartVideo} className="w-9 h-9 p-0 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20">
            <Video className="w-4 h-4" />
          </GhostButton>
        </div>
      </div>

      <div className="flex items-center space-x-1 pl-2">
        <GhostButton size="sm" onClick={onToggleInfo} className="w-9 h-9 p-0 rounded-full text-gray-500">
          <Info className="w-4 h-4" />
        </GhostButton>
        <GhostButton size="sm" className="w-9 h-9 p-0 rounded-full text-gray-500">
          <MoreVertical className="w-4 h-4" />
        </GhostButton>
      </div>
    </div>
  );
};

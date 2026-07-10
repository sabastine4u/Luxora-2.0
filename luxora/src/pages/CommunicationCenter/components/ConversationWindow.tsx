import { useEffect, useRef, useState } from 'react';
import type { Conversation, Message, Participant } from '../types/communicationTypes';
import { ConversationHeader } from './ConversationHeader';
import { ConversationInfoPanel } from './ConversationInfoPanel';
import { AIAssistantPanel } from './AIAssistantPanel';
import { VoiceVideoPlaceholder } from './VoiceVideoPlaceholder';
import { MessageBubble } from './MessageBubble';
import { MessageComposer } from './MessageComposer';
import { EmptyConversation } from './EmptyConversation';

interface ConversationWindowProps {
  conversation?: Conversation;
  messages: Message[];
  currentUser: Participant;
  onSendMessage: (content: string) => void;
}

export const ConversationWindow = ({ 
  conversation, 
  messages, 
  currentUser, 
  onSendMessage
}: ConversationWindowProps) => {
  const [showInfo, setShowInfo] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [composerTemplate, setComposerTemplate] = useState('');
  const [callType, setCallType] = useState<'voice' | 'video' | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!conversation) {
    return <EmptyConversation />;
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 dark:bg-ink-dark/30">
      <ConversationHeader 
        conversation={conversation} 
        currentUser={currentUser} 
        onToggleInfo={() => setShowInfo(!showInfo)}
        onOpenAssistant={() => setShowAIAssistant(!showAIAssistant)}
        onStartVoice={() => setCallType('voice')}
        onStartVideo={() => setCallType('video')}
      />
      
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-2 scroll-smooth"
      >
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm">
            No messages yet. Send a message to start the conversation.
          </div>
        ) : (
          messages.map(message => (
            <MessageBubble 
              key={message.id} 
              message={message} 
              isOwn={message.senderId === currentUser.id} 
            />
          ))
        )}
      </div>

      <MessageComposer onSendMessage={onSendMessage} externalContent={composerTemplate} />

      {/* Info Panel Overlay */}
      {showInfo && (
        <ConversationInfoPanel 
          conversation={conversation} 
          currentUser={currentUser}
          onClose={() => setShowInfo(false)} 
        />
      )}

      {/* AI Assistant Panel */}
      {showAIAssistant && (
        <AIAssistantPanel
          onClose={() => setShowAIAssistant(false)}
          onApplyTemplate={(text) => setComposerTemplate(text)}
        />
      )}

      {/* Call Modals */}
      {callType && (
        <VoiceVideoPlaceholder 
          type={callType} 
          title={conversation.title || conversation.participants.filter(p => p.id !== currentUser.id).map(p => p.name).join(', ')} 
          onClose={() => setCallType(null)} 
        />
      )}
    </div>
  );
};

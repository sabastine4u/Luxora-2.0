import type { Message } from '../types/communicationTypes';
import { formatMessageTime } from '../utils/formatter';
import { ReadReceipt } from './ReadReceipt';
import { clsx } from 'clsx';
import { FileText, Play } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export const MessageBubble = ({ message, isOwn }: MessageBubbleProps) => {
  const renderAttachment = () => {
    if (!message.attachments?.length) return null;
    
    return message.attachments.map(attachment => (
      <div key={attachment.id} className="mt-2 p-2 rounded-xl bg-white/10 flex items-center space-x-2">
        {attachment.type === 'image' && (
          <img src={attachment.url} alt={attachment.name} className="w-48 h-auto rounded-lg object-cover" />
        )}
        {attachment.type === 'document' && (
          <div className="flex items-center space-x-2 text-sm">
            <FileText className="w-4 h-4" />
            <span>{attachment.name}</span>
          </div>
        )}
        {attachment.type === 'voice' && (
          <div className="flex items-center space-x-2 w-48 h-10 bg-black/10 rounded-full px-3">
            <Play className="w-4 h-4" />
            <div className="flex-1 h-1 bg-white/30 rounded-full">
              <div className="w-1/3 h-full bg-white rounded-full" />
            </div>
          </div>
        )}
      </div>
    ));
  };

  const renderMetadata = () => {
    if (!message.metadata) return null;

    if (message.type === 'SharedListing' || message.type === 'SharedProperty') {
      return (
        <div className="mt-2 p-3 bg-white dark:bg-ink/50 rounded-xl border border-gray-100 dark:border-ink-light">
          <p className="font-semibold text-gray-900 dark:text-white">{String(message.metadata.propertyTitle)}</p>
          <p className="text-sm text-gray-500">{String(message.metadata.location)}</p>
          <p className="text-sm font-medium text-gold-500 mt-1">{String(message.metadata.price)}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={clsx(
      'flex w-full mt-4',
      isOwn ? 'justify-end' : 'justify-start'
    )}>
      <div className={clsx(
        'max-w-[70%] rounded-2xl p-4 shadow-sm relative group',
        isOwn 
          ? 'bg-navy-600 text-white rounded-br-sm' 
          : 'bg-white dark:bg-ink text-gray-900 dark:text-gray-100 border border-gray-100 dark:border-ink-light rounded-bl-sm'
      )}>
        {String(message.type) === 'Announcement' && (
          <div className="text-xs font-semibold uppercase tracking-wider text-gold-400 mb-1">
            Announcement
          </div>
        )}
        
        {message.content && (
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
        )}
        
        {renderMetadata()}
        {renderAttachment()}

        <div className={clsx(
          'flex items-center justify-end mt-2 space-x-1 text-xs',
          isOwn ? 'text-navy-200' : 'text-gray-400'
        )}>
          <span>{formatMessageTime(message.timestamp)}</span>
          {isOwn && <ReadReceipt status={message.status} />}
        </div>
      </div>
    </div>
  );
};

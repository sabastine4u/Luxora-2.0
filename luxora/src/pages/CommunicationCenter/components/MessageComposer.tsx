import { useState, useEffect } from 'react';
import { Smile, Paperclip, Image as ImageIcon, Mic, Send, Loader2, FileText } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';
import type { MessageType } from '../types/communicationTypes';
import { MESSAGE_MAX_LENGTH } from '../constants/communicationConstants';
import { MOCK_TEMPLATES } from '../data/mockData';

interface MessageComposerProps {
  onSendMessage: (content: string, type?: MessageType) => void;
  externalContent?: string;
}

export const MessageComposer = ({ onSendMessage, externalContent = '' }: MessageComposerProps) => {
  const [content, setContent] = useState(externalContent);
  const [isSending, setIsSending] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  // Update content if externalContent changes (e.g. AI Assistant template applied)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (externalContent) setContent(externalContent);
  }, [externalContent]);

  const handleSend = () => {
    if (!content.trim()) return;
    setIsSending(true);
    // simulate a small delay to feel realistic
    setTimeout(() => {
      onSendMessage(content.trim());
      setContent('');
      setIsSending(false);
    }, 150);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-ink border-t border-gray-100 dark:border-ink-light">
      <div className="flex items-end space-x-2 bg-gray-50 dark:bg-ink-dark/50 rounded-2xl p-2 border border-gray-200 dark:border-ink-light focus-within:border-gold-500 dark:focus-within:border-gold-500 transition-colors">
        
        <div className="flex flex-col justify-end space-y-1 pb-1 relative">
          <div title="Templates">
            <GhostButton size="sm" onClick={() => setShowTemplates(!showTemplates)} className="w-8 h-8 p-0 rounded-full text-gold-500 hover:bg-gold-50 dark:hover:bg-gold-900/20 transition-colors">
              <FileText className="w-4 h-4" />
            </GhostButton>
          </div>
          <GhostButton size="sm" className="w-8 h-8 p-0 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <Paperclip className="w-4 h-4" />
          </GhostButton>

          {showTemplates && (
            <div className="absolute bottom-full left-0 mb-2 w-64 bg-white dark:bg-ink rounded-xl shadow-lg border border-gray-100 dark:border-ink-light overflow-hidden z-20">
              <div className="p-2 bg-gray-50 dark:bg-ink-light border-b border-gray-100 dark:border-ink-light text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Templates
              </div>
              <div className="max-h-60 overflow-y-auto">
                {MOCK_TEMPLATES.map(t => (
                  <button 
                    key={t.id}
                    onClick={() => { setContent(t.content); setShowTemplates(false); }}
                    className="w-full text-left p-3 text-sm hover:bg-gray-50 dark:hover:bg-ink-light/50 transition-colors border-b border-gray-50 dark:border-ink-light/50 last:border-0"
                  >
                    <div className="font-medium text-gray-900 dark:text-white mb-0.5">{t.title}</div>
                    <div className="text-xs text-gray-500 truncate">{t.content}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 max-h-32 min-h-[40px] bg-transparent resize-none outline-none text-[15px] py-2.5 px-2 text-gray-900 dark:text-white placeholder-gray-400"
          rows={1}
          maxLength={MESSAGE_MAX_LENGTH}
        />

        <div className="flex items-center space-x-1 pb-1 pr-1">
          <GhostButton size="sm" className="w-8 h-8 p-0 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <Smile className="w-4 h-4" />
          </GhostButton>
          <GhostButton size="sm" className="w-8 h-8 p-0 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <ImageIcon className="w-4 h-4" />
          </GhostButton>
          <GhostButton size="sm" className="w-8 h-8 p-0 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <Mic className="w-4 h-4" />
          </GhostButton>
          
          <button
            onClick={handleSend}
            disabled={!content.trim() || isSending}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-navy-600 hover:bg-navy-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors ml-2"
          >
            {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-0.5" />}
          </button>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-2 px-2 text-[11px] text-gray-400">
        <span className="flex items-center">
          <strong>Enter</strong> <span className="mx-1">to send,</span> <strong>Shift + Enter</strong> <span className="ml-1">for new line</span>
        </span>
        {content.length > MESSAGE_MAX_LENGTH * 0.8 && (
          <span className={content.length >= MESSAGE_MAX_LENGTH ? 'text-red-500' : ''}>
            {content.length} / {MESSAGE_MAX_LENGTH}
          </span>
        )}
      </div>
    </div>
  );
};

import type { Conversation, Participant } from '../types/communicationTypes';
import { X, FileText, Image as ImageIcon, Building2, Briefcase, Calendar } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';

interface ConversationInfoPanelProps {
  conversation?: Conversation;
  currentUser: Participant;
  onClose: () => void;
}

export const ConversationInfoPanel = ({ conversation, currentUser, onClose }: ConversationInfoPanelProps) => {
  if (!conversation) return null;

  const isGroup = conversation.participants.length > 2;
  const otherParticipant = conversation.participants.find(p => p.id !== currentUser.id);
  const title = conversation.title || (otherParticipant ? otherParticipant.name : 'Unknown');

  return (
    <div className="w-72 flex flex-col h-full bg-white dark:bg-ink border-l border-gray-100 dark:border-ink-light">
      <div className="p-4 border-b border-gray-100 dark:border-ink-light flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">Details</h2>
        <GhostButton size="sm" onClick={onClose} className="w-8 h-8 p-0 rounded-full text-gray-400">
          <X className="w-4 h-4" />
        </GhostButton>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Profile Section */}
        <div className="flex flex-col items-center text-center">
          {otherParticipant?.avatar && !isGroup ? (
            <img src={otherParticipant.avatar} alt={title} className="w-20 h-20 rounded-full object-cover bg-gray-100 mb-3 border-2 border-white dark:border-ink shadow-sm" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gold-100 dark:bg-gold-900/30 flex items-center justify-center text-gold-600 dark:text-gold-400 font-bold text-2xl mb-3">
              {title.substring(0, 2).toUpperCase()}
            </div>
          )}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          <p className="text-sm text-gray-500 capitalize">{isGroup ? `${conversation.participants.length} Participants` : otherParticipant?.role}</p>
          {!isGroup && otherParticipant?.department && (
            <p className="text-xs text-gray-400 mt-1">{otherParticipant.department}</p>
          )}
        </div>

        {/* Info Items */}
        <div className="space-y-3">
          {conversation.propertyId && (
            <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-300">
              <Building2 className="w-4 h-4 text-gold-500" />
              <span>Property Reference</span>
            </div>
          )}
          {conversation.dealId && (
            <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-300">
              <Briefcase className="w-4 h-4 text-gold-500" />
              <span>Related Deal</span>
            </div>
          )}
          {conversation.appointmentId && (
            <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-300">
              <Calendar className="w-4 h-4 text-gold-500" />
              <span>Appointment Info</span>
            </div>
          )}
        </div>

        {/* Shared Media */}
        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Shared Media</h4>
          <div className="grid grid-cols-3 gap-2">
            <div className="aspect-square bg-gray-100 dark:bg-ink-light rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
              <ImageIcon className="w-5 h-5 text-gray-400" />
            </div>
            <div className="aspect-square bg-gray-100 dark:bg-ink-light rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
              <ImageIcon className="w-5 h-5 text-gray-400" />
            </div>
            <div className="aspect-square bg-gray-100 dark:bg-ink-light rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
              <span className="text-xs font-medium text-gray-500">+12</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-ink-light pt-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 px-2">Internal Notes</h3>
          <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/50 rounded-xl p-3 mx-2">
            <textarea 
              className="w-full bg-transparent border-none focus:ring-0 text-sm text-yellow-800 dark:text-yellow-500 placeholder-yellow-600/50 dark:placeholder-yellow-600/50 resize-none"
              placeholder="Add private note..."
              rows={3}
              defaultValue={conversation.internalNotes || ""}
            />
          </div>
        </div>

        {/* Shared Files */}
        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Shared Files</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50 dark:bg-ink-light cursor-pointer hover:bg-gray-100 dark:hover:bg-ink-light/80 transition-colors">
              <div className="p-2 bg-white dark:bg-ink rounded shadow-sm">
                <FileText className="w-4 h-4 text-gold-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">Contract_Draft.pdf</p>
                <p className="text-xs text-gray-500">1.2 MB</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

import { X, ExternalLink } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { formatMessageTime } from '../../CommunicationCenter/utils/formatter';
import type { Notification } from '../types/notificationTypes';
import { MOCK_USERS } from '../data/mockData';

interface NotificationDetailModalProps {
  notification: Notification | null;
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDetailModal = ({ notification, isOpen, onClose }: NotificationDetailModalProps) => {
  if (!notification) return null;

  const relatedUser = notification.relatedUserId ? MOCK_USERS[Object.keys(MOCK_USERS).find(k => MOCK_USERS[k].id === notification.relatedUserId) || ''] : null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Notification Details" size="md">
      <div className="p-6">
        
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-gray-100 dark:bg-ink-light text-gray-600 dark:text-gray-300">
            {notification.source}
          </span>
          <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
            {notification.category}
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{notification.title}</h3>
        <p className="text-sm text-gray-500 mb-6">{formatMessageTime(notification.timestamp)}</p>

        <div className="bg-gray-50 dark:bg-ink-light/20 rounded-xl p-4 border border-gray-100 dark:border-ink-light mb-6">
           <p className="text-sm text-gray-700 dark:text-gray-300">{notification.description}</p>
        </div>

        {relatedUser && (
          <div className="flex items-center space-x-3 mb-6 p-4 rounded-xl border border-gray-100 dark:border-ink-light">
             {relatedUser.avatar ? (
                <img src={relatedUser.avatar} alt="" className="w-10 h-10 rounded-full" />
             ) : (
                <div className="w-10 h-10 rounded-full bg-gold-100 dark:bg-gold-900/30 flex items-center justify-center text-gold-600 font-bold">
                   {relatedUser.name.charAt(0)}
                </div>
             )}
             <div>
               <p className="text-sm font-semibold text-gray-900 dark:text-white">{relatedUser.name}</p>
               <p className="text-xs text-gray-500">{relatedUser.role} • {relatedUser.department}</p>
             </div>
          </div>
        )}

        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100 dark:border-ink-light">
          <GhostButton onClick={onClose}>
             <X className="w-4 h-4 mr-2" />
             Dismiss
          </GhostButton>
          <GoldButton>
             {notification.category === 'Approval' ? 'Review Approval' : 'View in Module'}
             <ExternalLink className="w-4 h-4 ml-2" />
          </GoldButton>
        </div>

      </div>
    </Modal>
  );
};

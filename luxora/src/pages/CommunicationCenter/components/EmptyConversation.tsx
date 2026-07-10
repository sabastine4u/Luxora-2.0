import { MessageSquare } from 'lucide-react';

export const EmptyConversation = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 dark:bg-ink-dark/50">
      <div className="w-16 h-16 rounded-full bg-navy-50 dark:bg-ink flex items-center justify-center mb-4">
        <MessageSquare className="w-8 h-8 text-navy-400 dark:text-gray-400" />
      </div>
      <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No Conversation Selected</h3>
      <p className="text-gray-500 text-center max-w-sm">
        Select a conversation from the sidebar or start a new one to begin messaging.
      </p>
    </div>
  );
};

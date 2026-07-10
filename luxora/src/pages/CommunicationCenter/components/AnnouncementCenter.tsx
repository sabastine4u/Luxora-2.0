import { Megaphone, Info, CheckCircle2, MoreHorizontal } from 'lucide-react';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { formatMessageTime } from '../utils/formatter';
import { MOCK_MESSAGES } from '../data/mockData';

export const AnnouncementCenter = () => {
  const announcements = MOCK_MESSAGES.filter(m => m.type === 'SystemNotification');

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 dark:bg-ink-dark/30">
      
      {/* Header */}
      <div className="h-16 border-b border-gray-100 dark:border-ink-light bg-white dark:bg-ink flex items-center justify-between px-6 shrink-0">
        <div>
          <h2 className="text-[15px] font-semibold text-gray-900 dark:text-white flex items-center">
            <Megaphone className="w-4 h-4 mr-2 text-gold-500" />
            Announcement Center
          </h2>
          <p className="text-xs text-gray-500">Enterprise Company News & Alerts</p>
        </div>
        <GoldButton size="sm">
          New Announcement
        </GoldButton>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          
          {announcements.map(announcement => (
            <div key={announcement.id} className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-5 hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-gold-500" />
              
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2 mb-3 text-xs font-semibold uppercase tracking-wider text-gold-500">
                  <Info className="w-4 h-4" />
                  <span>Company News</span>
                </div>
                
                <div className="flex items-center space-x-3 text-xs text-gray-400">
                  <span>{formatMessageTime(announcement.timestamp)}</span>
                  <GhostButton size="sm" className="w-8 h-8 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="w-4 h-4" />
                  </GhostButton>
                </div>
              </div>

              <p className="text-gray-900 dark:text-white text-sm leading-relaxed mb-4">
                {announcement.content}
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100 dark:border-ink-light">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-500" /> 
                    142 Read
                  </span>
                  <span>12 Unread</span>
                </div>
                <span>Expires in 2 days</span>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

import { ActivityTimeline } from '../../../components/dashboard/shared/timelines/ActivityTimeline';
import { MOCK_USERS } from '../data/mockData';
import { Filter, Calendar, Activity as ActivityIcon, CheckCircle2, ShieldAlert, AlertCircle } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';
import type { Activity } from '../types/notificationTypes';
import { formatMessageTime } from '../../CommunicationCenter/utils/formatter';

interface ActivityFeedProps {
  activities: Activity[];
}

export const ActivityFeed = ({ activities }: ActivityFeedProps) => {
  const getIconForStatus = (status: string) => {
    switch(status) {
      case 'Completed':
      case 'Approved': return CheckCircle2;
      case 'Failed':
      case 'Rejected': return ShieldAlert;
      case 'Escalated': return AlertCircle;
      default: return ActivityIcon;
    }
  };

  const getColorForStatus = (status: string) => {
    switch(status) {
      case 'Completed':
      case 'Approved': return 'text-emerald-500';
      case 'Failed':
      case 'Rejected': return 'text-red-500';
      case 'Escalated': return 'text-orange-500';
      default: return 'text-blue-500';
    }
  };

  const transformedActivities = activities.map(act => {
    const user = MOCK_USERS[Object.keys(MOCK_USERS).find(k => MOCK_USERS[k].id === act.actorId) || ''];
    return {
      title: act.action,
      desc: `${act.description} - By ${user?.name || 'System'}`,
      time: formatMessageTime(act.timestamp),
      icon: getIconForStatus(act.status),
      color: getColorForStatus(act.status)
    };
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-ink">
      {/* Header */}
      <div className="h-16 border-b border-gray-100 dark:border-ink-light flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center space-x-2">
          <h2 className="text-[15px] font-semibold text-gray-900 dark:text-white">Enterprise Activity Feed</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <GhostButton size="sm" className="text-gray-500 hover:text-gold-600">
            <Calendar className="w-4 h-4 mr-2" />
            Today
          </GhostButton>
          <div className="w-px h-4 bg-gray-200 dark:bg-ink-light mx-2" />
          <GhostButton size="sm" className="text-gray-500">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </GhostButton>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full">
        <ActivityTimeline items={transformedActivities} />
      </div>
    </div>
  );
};

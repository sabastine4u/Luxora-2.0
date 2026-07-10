import { Clock, MapPin, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { formatMessageTime } from '../utils/formatter';
import { MOCK_CALENDAR, MOCK_USERS } from '../data/mockData';
import { clsx } from 'clsx';

export const SharedCalendar = () => {
  const getEventColor = (type: string) => {
    switch (type) {
      case 'Viewing': return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800';
      case 'Team Meeting': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
      case 'Closing': return 'bg-gold-100 text-gold-700 border-gold-200 dark:bg-gold-900/30 dark:text-gold-400 dark:border-gold-800';
      default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-ink-light dark:text-gray-300 dark:border-ink';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 dark:bg-ink-dark/30">
      
      {/* Header */}
      <div className="h-16 border-b border-gray-100 dark:border-ink-light bg-white dark:bg-ink flex items-center justify-between px-6">
        <div>
          <h2 className="text-[15px] font-semibold text-gray-900 dark:text-white">Shared Calendar</h2>
          <p className="text-xs text-gray-500">Collaboration Scheduling</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <GhostButton size="sm" className="w-8 h-8 p-0 rounded-full">
              <ChevronLeft className="w-4 h-4 text-gray-500" />
            </GhostButton>
            <span className="text-sm font-medium text-gray-900 dark:text-white min-w-[100px] text-center">October 2023</span>
            <GhostButton size="sm" className="w-8 h-8 p-0 rounded-full">
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </GhostButton>
          </div>
          <GoldButton size="sm">
            Schedule Event
          </GoldButton>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Events</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"/>Viewings</span>
              <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-blue-500 mr-2 ml-3"/>Meetings</span>
              <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-gold-500 mr-2 ml-3"/>Closings</span>
            </div>
          </div>

          <div className="space-y-4">
            {MOCK_CALENDAR.map(event => (
              <div key={event.id} className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-5 flex items-start hover:shadow-md transition-shadow">
                
                <div className="flex-shrink-0 w-16 text-center mr-6">
                  <div className="text-sm font-bold text-gray-900 dark:text-white">
                    {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className="text-2xl font-light text-gold-500">
                    {new Date(event.date).getDate()}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-1">
                    <h4 className="text-base font-semibold text-gray-900 dark:text-white truncate">{event.title}</h4>
                    <span className={clsx("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border", getEventColor(event.type))}>
                      {event.type}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500 mt-3">
                    <div className="flex items-center space-x-1.5">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{formatMessageTime(event.date)}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center space-x-1.5">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="truncate max-w-[200px]">{event.location}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1.5">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>{event.participants.length} Participants</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex -space-x-2">
                  {event.participants.slice(0, 3).map((pid, i) => {
                    const user = Object.values(MOCK_USERS).find(u => u.id === pid);
                    return user?.avatar ? (
                      <img key={i} src={user.avatar} alt="" className="w-8 h-8 rounded-full border-2 border-white dark:border-ink relative z-10 hover:z-20" title={user.name} />
                    ) : null;
                  })}
                </div>

              </div>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
};

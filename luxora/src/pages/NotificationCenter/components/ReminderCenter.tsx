import { CheckCircle2, Clock, Calendar, CheckSquare, MoreHorizontal, Check } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';
import { formatMessageTime } from '../../CommunicationCenter/utils/formatter';
import { clsx } from 'clsx';
import type { Reminder } from '../types/notificationTypes';
import { MOCK_USERS } from '../data/mockData';

interface ReminderCenterProps {
  reminders: Reminder[];
}

export const ReminderCenter = ({ reminders }: ReminderCenterProps) => {

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-500 bg-red-50 dark:bg-red-900/20';
      case 'high': return 'text-orange-500 bg-orange-50 dark:bg-orange-900/20';
      case 'medium': return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'low': return 'text-gray-500 bg-gray-50 dark:bg-ink-light';
      default: return 'text-gray-500 bg-gray-50 dark:bg-ink-light';
    }
  };

  const getReminderIcon = (type: string) => {
    switch (type) {
      case 'Follow-up': return <CheckSquare className="w-5 h-5 text-gold-500" />;
      case 'Meeting': return <Calendar className="w-5 h-5 text-blue-500" />;
      case 'Renewal': return <Clock className="w-5 h-5 text-purple-500" />;
      case 'Deadline': return <Clock className="w-5 h-5 text-red-500" />;
      default: return <CheckCircle2 className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 dark:bg-ink-dark/30">
      <div className="h-16 border-b border-gray-100 dark:border-ink-light bg-white dark:bg-ink flex items-center justify-between px-6 shrink-0">
        <h2 className="text-[15px] font-semibold text-gray-900 dark:text-white">Smart Reminder Center</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Sections */}
        {['Overdue', 'Today', 'Upcoming'].map(section => {
          
          let filtered: Reminder[];
          if (section === 'Overdue') {
             filtered = reminders.filter(r => r.dueDate < new Date().toISOString() && !r.isCompleted);
          } else if (section === 'Today') {
             // simplified mock logic
             filtered = reminders.filter(r => r.dueDate > new Date().toISOString() && r.priority === 'high');
          } else {
             filtered = reminders.filter(r => r.dueDate > new Date().toISOString() && r.priority !== 'high');
          }

          if (filtered.length === 0) return null;

          return (
            <div key={section} className="bg-white dark:bg-ink rounded-2xl border border-gray-200 dark:border-ink-light overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-ink-light flex items-center justify-between bg-gray-50/50 dark:bg-ink-light/10">
                <h3 className="font-semibold text-gray-900 dark:text-white">{section}</h3>
                <span className="text-xs font-medium text-gray-500">{filtered.length} tasks</span>
              </div>
              
              <div className="divide-y divide-gray-50 dark:divide-ink-light/50">
                {filtered.map(reminder => {
                  const assignee = MOCK_USERS[Object.keys(MOCK_USERS).find(k => MOCK_USERS[k].id === reminder.assigneeId) || ''];
                  return (
                    <div key={reminder.id} className="p-4 flex items-center hover:bg-gray-50/50 dark:hover:bg-ink-light/20 transition-colors group">
                      
                      <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600 mr-4 cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-colors flex items-center justify-center group/check">
                         <Check className="w-3 h-3 text-emerald-500 opacity-0 group-hover/check:opacity-100" />
                      </div>
                      
                      <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-ink-light flex items-center justify-center mr-4 shrink-0">
                        {getReminderIcon(reminder.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900 dark:text-white truncate">{reminder.title}</h4>
                          <span className={clsx("text-[10px] uppercase font-bold px-1.5 py-0.5 rounded", getPriorityColor(reminder.priority))}>
                            {reminder.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">{reminder.description}</p>
                      </div>

                      <div className="flex items-center space-x-6 mr-6 shrink-0 text-sm">
                        <div className="flex flex-col items-end">
                          <span className="text-gray-400 text-xs">Assignee</span>
                          <span className="font-medium text-gray-700 dark:text-gray-300">{assignee?.name}</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-gray-400 text-xs">Due</span>
                          <span className={clsx("font-medium", section === 'Overdue' ? "text-red-500" : "text-gray-700 dark:text-gray-300")}>
                            {formatMessageTime(reminder.dueDate)}
                          </span>
                        </div>
                      </div>

                      <GhostButton size="sm" className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-gray-700 shrink-0">
                        <MoreHorizontal className="w-5 h-5" />
                      </GhostButton>

                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

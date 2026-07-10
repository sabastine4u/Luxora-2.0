import { MOCK_TASKS } from '../data/mockData';
import { formatMessageTime } from '../utils/formatter';
import { CheckCircle2, Clock, AlertCircle, Plus, MoreHorizontal } from 'lucide-react';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { clsx } from 'clsx';
import type { TaskStatus, PriorityLevel } from '../types/communicationTypes';

export const FollowUpCenter = () => {
  const categories: TaskStatus[] = ['Due Today', 'Tomorrow', 'Waiting', 'Overdue', 'Scheduled'];

  const getPriorityColor = (priority: PriorityLevel) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'high': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'medium': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'low': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 dark:bg-ink-dark/30">
      
      {/* Header */}
      <div className="h-16 border-b border-gray-100 dark:border-ink-light bg-white dark:bg-ink flex items-center justify-between px-6 shrink-0">
        <div>
          <h2 className="text-[15px] font-semibold text-gray-900 dark:text-white">Smart Follow-up Center</h2>
          <p className="text-xs text-gray-500">Enterprise Task Board</p>
        </div>
        <GoldButton size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Create Task
        </GoldButton>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-x-auto p-6 flex space-x-6 items-start">
        
        {categories.map(status => {
          const tasks = MOCK_TASKS.filter(t => t.status === status);
          
          return (
            <div key={status} className="flex-shrink-0 w-80 bg-gray-100/50 dark:bg-ink-light/20 rounded-2xl p-4 border border-gray-200/50 dark:border-ink-light/50 flex flex-col max-h-full">
              
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                  {status}
                  <span className="ml-2 bg-white dark:bg-ink text-gray-500 dark:text-gray-400 text-xs py-0.5 px-2 rounded-full shadow-sm">
                    {tasks.length}
                  </span>
                </h3>
                <GhostButton size="sm" className="w-8 h-8 p-0 rounded-full">
                  <MoreHorizontal className="w-4 h-4 text-gray-500" />
                </GhostButton>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {tasks.length === 0 ? (
                  <div className="py-8 text-center border-2 border-dashed border-gray-200 dark:border-ink-light rounded-xl">
                    <p className="text-sm text-gray-400">No tasks</p>
                  </div>
                ) : (
                  tasks.map(task => (
                    <div key={task.id} className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                      
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className={clsx("px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider", getPriorityColor(task.priority))}>
                            {task.priority}
                          </span>
                        </div>
                        <CheckCircle2 className="w-5 h-5 text-gray-300 dark:text-gray-600 hover:text-emerald-500 transition-colors" />
                      </div>

                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 leading-snug group-hover:text-gold-600 transition-colors">
                        {task.title}
                      </h4>

                      <div className="flex items-center justify-between text-xs mt-auto">
                        <div className="flex items-center space-x-1.5 text-gray-500">
                          {status === 'Overdue' ? <AlertCircle className="w-3.5 h-3.5 text-red-500" /> : <Clock className="w-3.5 h-3.5" />}
                          <span className={status === 'Overdue' ? 'text-red-500 font-medium' : ''}>
                            {formatMessageTime(task.dueDate)}
                          </span>
                        </div>
                        
                        <div className="flex space-x-1">
                          {task.tags.map((tag, i) => (
                            <span key={i} className="px-1.5 py-0.5 bg-gray-50 dark:bg-ink-light rounded text-[10px] text-gray-500 truncate max-w-[60px]" title={tag}>
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                    </div>
                  ))
                )}
              </div>

            </div>
          )
        })}

      </div>
    </div>
  );
};

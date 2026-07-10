import { MOCK_WORKFLOW } from '../data/mockData';
import { formatMessageTime } from '../../CommunicationCenter/utils/formatter';
import { Check, Clock } from 'lucide-react';
import { clsx } from 'clsx';

export const WorkflowTimeline = () => {
  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 dark:bg-ink-dark/30">
      
      <div className="h-16 border-b border-gray-100 dark:border-ink-light bg-white dark:bg-ink flex items-center justify-between px-6 shrink-0">
        <div>
          <h2 className="text-[15px] font-semibold text-gray-900 dark:text-white">Workflow Timeline</h2>
          <p className="text-xs text-gray-500">End-to-end enterprise process tracking</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex justify-center">
        
        <div className="w-full max-w-3xl bg-white dark:bg-ink rounded-2xl border border-gray-200 dark:border-ink-light p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100 dark:border-ink-light">
             <h3 className="text-lg font-bold text-gray-900 dark:text-white">Property Listing: Victoria Island Villa</h3>
             <span className="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 px-3 py-1 text-xs font-bold uppercase rounded-full tracking-wider">
               In Progress
             </span>
          </div>

          <div className="relative border-l-2 border-gray-100 dark:border-ink-light ml-4 space-y-8 pb-4">
            {MOCK_WORKFLOW.map((event) => {
              const isCompleted = event.status === 'Completed';
              return (
                <div key={event.id} className="relative pl-8">
                  {/* Timeline Dot */}
                  <div className={clsx(
                    "absolute -left-[11px] top-1 w-5 h-5 rounded-full flex items-center justify-center border-2 bg-white dark:bg-ink",
                    isCompleted ? "border-emerald-500" : "border-blue-500"
                  )}>
                    {isCompleted ? (
                      <Check className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="bg-gray-50 dark:bg-ink-light/20 p-4 rounded-xl border border-gray-100 dark:border-ink-light/50">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={clsx("font-semibold", isCompleted ? "text-gray-900 dark:text-white" : "text-blue-600 dark:text-blue-400")}>
                        {event.title}
                      </h4>
                      <span className="text-xs text-gray-400 font-medium">
                        {formatMessageTime(event.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">{event.description}</p>
                    
                    {!isCompleted && (
                      <div className="flex space-x-3">
                         <button className="text-xs font-semibold text-white bg-gold-500 hover:bg-gold-600 px-3 py-1.5 rounded-lg transition-colors">
                           Review Offer
                         </button>
                         <button className="text-xs font-semibold text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-ink-light hover:bg-gray-300 dark:hover:bg-gray-700 px-3 py-1.5 rounded-lg transition-colors">
                           Request Details
                         </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            
            {/* Future Placeholder */}
            <div className="relative pl-8 opacity-50">
               <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 bg-white dark:bg-ink" />
               <div className="p-4 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 flex items-center text-gray-400">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Deal Closed</span>
               </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

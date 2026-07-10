import { useCRMCenter } from '../hooks/useCRMCenter';
import { Activity, Phone, Mail, MessageSquare, Calendar, Building2, CheckCircle, FileText } from 'lucide-react';
import { formatMessageTime } from '../../CommunicationCenter/utils/formatter';
import { MOCK_CONTACTS } from '../data/mockData';

export const ActivityCenter = () => {
  const { activities } = useCRMCenter();

  const getIcon = (type: string) => {
    switch (type) {
      case 'Call': return <Phone className="w-4 h-4 text-blue-500" />;
      case 'Email': return <Mail className="w-4 h-4 text-emerald-500" />;
      case 'Message': return <MessageSquare className="w-4 h-4 text-purple-500" />;
      case 'Meeting': return <Calendar className="w-4 h-4 text-orange-500" />;
      case 'Property Visit': return <Building2 className="w-4 h-4 text-gold-500" />;
      case 'Workflow Event': return <CheckCircle className="w-4 h-4 text-indigo-500" />;
      case 'Document': return <FileText className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto h-full flex flex-col">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
          <Activity className="w-6 h-6 mr-3 text-gold-500" />
          Enterprise Activity Center
        </h2>
        <p className="text-gray-500">Global chronological timeline of all customer interactions and events.</p>
      </div>

      <div className="bg-white dark:bg-ink border border-gray-200 dark:border-ink-light rounded-xl overflow-hidden flex-1 flex flex-col">
        <div className="overflow-y-auto flex-1 p-6 space-y-6 relative custom-scrollbar">
          <div className="absolute left-[39px] top-6 bottom-6 w-px bg-gray-200 dark:bg-ink-light" />
          
          {activities.map((activity) => {
            const contact = MOCK_CONTACTS.find(c => c.id === activity.contactId);
            
            return (
              <div key={activity.id} className="flex relative z-10 group">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-ink border-2 border-gray-200 dark:border-ink-light flex items-center justify-center shrink-0 shadow-sm mr-4 group-hover:border-gold-500 transition-colors">
                  {getIcon(activity.type)}
                </div>
                <div className="flex-1 bg-gray-50 dark:bg-ink-light/30 rounded-xl p-4 border border-transparent group-hover:border-gray-200 dark:group-hover:border-ink-light transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-bold text-gray-900 dark:text-white text-sm">
                      {activity.title}
                    </div>
                    <div className="text-xs text-gray-500 bg-white dark:bg-ink px-2 py-1 rounded shadow-sm border border-gray-100 dark:border-ink-light">
                      {formatMessageTime(activity.timestamp)}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {activity.description}
                  </div>

                  <div className="flex items-center space-x-3 pt-3 border-t border-gray-200 dark:border-ink-light">
                    <div className="flex items-center space-x-1.5 text-xs font-medium text-gray-500">
                      {contact?.avatar ? (
                        <img src={contact.avatar} alt="Avatar" className="w-4 h-4 rounded-full" />
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-gray-200 dark:bg-ink-light flex items-center justify-center font-bold">
                          {contact?.firstName?.[0] || '?'}
                        </div>
                      )}
                      <span>{contact?.firstName} {contact?.lastName}</span>
                    </div>
                    
                    {activity.relatedEntity && (
                      <>
                        <span className="text-gray-300 dark:text-gray-600">•</span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors">
                          {activity.relatedEntity.type}: {activity.relatedEntity.name}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

import { useDocumentCenter } from '../hooks/useDocumentCenter';
import { Shield, Eye, Edit3, Share2, CheckCircle, Download, Archive, Trash2, Upload } from 'lucide-react';
import { MOCK_USERS } from '../data/mockData';
import { formatMessageTime } from '../../CommunicationCenter/utils/formatter';

export const AuditLog = () => {
  const { auditLogs, documents } = useDocumentCenter();

  const getIcon = (action: string) => {
    switch (action) {
      case 'Viewed': return <Eye className="w-4 h-4 text-gray-500" />;
      case 'Edited': return <Edit3 className="w-4 h-4 text-blue-500" />;
      case 'Shared': return <Share2 className="w-4 h-4 text-purple-500" />;
      case 'Approved': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'Downloaded': return <Download className="w-4 h-4 text-gray-500" />;
      case 'Archived': return <Archive className="w-4 h-4 text-orange-500" />;
      case 'Deleted': return <Trash2 className="w-4 h-4 text-red-500" />;
      case 'Uploaded': return <Upload className="w-4 h-4 text-gold-500" />;
      default: return <Shield className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto h-full flex flex-col">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Audit Log</h2>
        <p className="text-gray-500">Enterprise activity timeline for document compliance and tracking.</p>
      </div>

      <div className="bg-white dark:bg-ink border border-gray-200 dark:border-ink-light rounded-xl overflow-hidden flex-1 flex flex-col">
        <div className="overflow-y-auto flex-1 p-6 space-y-6 relative">
          <div className="absolute left-[39px] top-6 bottom-6 w-px bg-gray-200 dark:bg-ink-light" />
          
          {auditLogs.map((log) => {
            const user = MOCK_USERS[log.userId as keyof typeof MOCK_USERS];
            const doc = documents.find(d => d.id === log.documentId);
            
            return (
              <div key={log.id} className="flex relative z-10">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-ink border-2 border-gray-200 dark:border-ink-light flex items-center justify-center shrink-0 shadow-sm mr-4">
                  {getIcon(log.action)}
                </div>
                <div className="flex-1 bg-gray-50 dark:bg-ink-light/30 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-semibold text-gray-900 dark:text-white text-sm">
                      <span className="text-blue-600 dark:text-blue-400">{user?.name || 'Unknown'}</span> {log.action.toLowerCase()} <span className="font-bold">{doc?.name || 'Unknown Document'}</span>
                    </div>
                    <div className="text-xs text-gray-500">{formatMessageTime(log.timestamp)}</div>
                  </div>
                  {log.details && (
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 bg-white dark:bg-ink p-3 rounded-lg border border-gray-100 dark:border-ink-light">
                      {log.details}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

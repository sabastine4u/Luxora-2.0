import { useDocumentCenter } from '../hooks/useDocumentCenter';
import { Users, Link as LinkIcon, Settings, Trash2 } from 'lucide-react';
import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { MOCK_USERS } from '../data/mockData';

export const SharingCenter = () => {
  const { shares, documents } = useDocumentCenter();

  return (
    <div className="p-8 max-w-5xl mx-auto h-full flex flex-col">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Sharing & Permissions</h2>
          <p className="text-gray-500">Manage active sharing links and external access to documents.</p>
        </div>
        <GoldButton>
          <Users className="w-4 h-4 mr-2" /> Share Document
        </GoldButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shares.map(share => {
          const doc = documents.find(d => d.id === share.documentId);
          if (!doc) return null;

          return (
            <div key={share.id} className="bg-white dark:bg-ink border border-gray-200 dark:border-ink-light rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                  {share.isPublicLink ? <LinkIcon className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-1 rounded bg-gray-100 text-gray-600 dark:bg-ink-light dark:text-gray-400">
                  {share.permissions} Access
                </span>
              </div>
              
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1 truncate" title={doc.name}>{doc.name}</h4>
              <p className="text-xs text-gray-500 mb-4 truncate">
                Shared with {share.sharedWith.map(id => MOCK_USERS[id as keyof typeof MOCK_USERS]?.name).join(', ') || 'Public Link'}
              </p>

              <div className="flex items-center space-x-2 pt-4 border-t border-gray-100 dark:border-ink-light">
                <GhostButton className="flex-1 justify-center text-xs">
                  <Settings className="w-3.5 h-3.5 mr-1" /> Edit
                </GhostButton>
                <GhostButton className="flex-1 justify-center text-xs text-red-600 hover:bg-red-50">
                  <Trash2 className="w-3.5 h-3.5 mr-1" /> Revoke
                </GhostButton>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

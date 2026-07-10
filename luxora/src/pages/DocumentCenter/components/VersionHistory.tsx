import { useDocumentCenter } from '../hooks/useDocumentCenter';
import { History, ArrowRight, UserCircle2, ArrowLeftRight } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';
import { formatMessageTime } from '../../CommunicationCenter/utils/formatter';
import { MOCK_USERS } from '../data/mockData';
import { clsx } from 'clsx';

export const VersionHistory = () => {
  const { versions, selectedDocument } = useDocumentCenter();

  if (!selectedDocument) return null;

  const docVersions = versions.filter(v => v.documentId === selectedDocument.id).sort((a, b) => b.versionNumber - a.versionNumber);

  return (
    <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-ink-light">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
            <History className="w-5 h-5 mr-2 text-gold-500" /> Version History
          </h2>
          <p className="text-sm text-gray-500 mt-1">{selectedDocument.name}</p>
        </div>
        <GhostButton>
          <ArrowLeftRight className="w-4 h-4 mr-2" /> Compare Versions
        </GhostButton>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
        {docVersions.map((version, index) => {
          const user = MOCK_USERS[version.uploadedBy as keyof typeof MOCK_USERS];
          return (
            <div key={version.id} className="relative pl-6">
              {index !== docVersions.length - 1 && (
                <div className="absolute left-2.5 top-6 bottom-[-24px] w-px bg-gray-200 dark:bg-ink-light" />
              )}
              <div className={clsx(
                "absolute left-1 top-1.5 w-3 h-3 rounded-full border-2",
                version.status === 'Current' 
                  ? "bg-gold-500 border-gold-200 dark:border-gold-900/50" 
                  : "bg-gray-300 dark:bg-gray-600 border-white dark:border-ink"
              )} />
              
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-gray-900 dark:text-white">Version {version.versionNumber}.0</span>
                  <span className={clsx(
                    "text-[10px] uppercase font-bold px-2 py-0.5 rounded",
                    version.status === 'Current' ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600 dark:bg-ink-light dark:text-gray-400"
                  )}>
                    {version.status}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {formatMessageTime(version.timestamp)}
                </div>
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {version.changeSummary || 'No change summary provided.'}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 dark:bg-ink-light/30 rounded-lg p-3">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center"><UserCircle2 className="w-3.5 h-3.5 mr-1" /> {user?.name || 'Unknown User'}</span>
                  <span>{(version.sizeBytes / 1024 / 1024).toFixed(1)} MB</span>
                </div>
                {version.status !== 'Current' && (
                  <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-semibold flex items-center">
                    Restore <ArrowRight className="w-3 h-3 ml-1" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {docVersions.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No version history found for this document.
          </div>
        )}
      </div>
    </div>
  );
};

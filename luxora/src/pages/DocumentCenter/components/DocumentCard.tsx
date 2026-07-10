import { FileText, MoreVertical, Image as ImageIcon, FileSpreadsheet, FileIcon, Video } from 'lucide-react';
import type { Document } from '../types/documentTypes';
import { formatMessageTime } from '../../CommunicationCenter/utils/formatter';
import { clsx } from 'clsx';
import { GhostButton } from '../../../components/ui/ui';

interface DocumentCardProps {
  document: Document;
  onClick: (doc: Document) => void;
  viewMode: 'grid' | 'list';
}

export const DocumentCard = ({ document, onClick, viewMode }: DocumentCardProps) => {
  const getIcon = () => {
    switch (document.assetType) {
      case 'Image': return <ImageIcon className="w-8 h-8 text-blue-500" />;
      case 'Excel': return <FileSpreadsheet className="w-8 h-8 text-emerald-500" />;
      case 'Video': return <Video className="w-8 h-8 text-purple-500" />;
      case 'PDF': return <FileIcon className="w-8 h-8 text-red-500" />;
      default: return <FileText className="w-8 h-8 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (document.approvalStatus) {
      case 'Approved': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Rejected': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  if (viewMode === 'list') {
    return (
      <div 
        onClick={() => onClick(document)}
        className="flex items-center justify-between p-3 bg-white dark:bg-ink border-b border-gray-100 dark:border-ink-light hover:bg-gray-50 dark:hover:bg-ink-light/50 cursor-pointer transition-colors group"
      >
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-ink-light/50 flex items-center justify-center shrink-0">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm text-gray-900 dark:text-white truncate">{document.name}</h4>
            <div className="flex items-center text-xs text-gray-500 space-x-2 mt-0.5">
              <span>v{document.currentVersion}.0</span>
              <span>•</span>
              <span>{(document.sizeBytes / 1024 / 1024).toFixed(1)} MB</span>
              <span>•</span>
              <span>{formatMessageTime(document.metadata.lastModified)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 shrink-0">
          <span className={clsx("text-[10px] font-bold uppercase px-2 py-0.5 rounded border", getStatusColor())}>
            {document.approvalStatus}
          </span>
          <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={() => onClick(document)}
      className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-4 hover:shadow-md hover:border-gold-500/50 transition-all cursor-pointer group flex flex-col h-full relative overflow-hidden"
    >
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <GhostButton size="sm" className="bg-white/90 dark:bg-ink/90 backdrop-blur-sm shadow-sm h-8 w-8 p-0 flex items-center justify-center rounded-full">
          <MoreVertical className="w-4 h-4" />
        </GhostButton>
      </div>

      <div className="h-32 bg-gray-50 dark:bg-ink-light/20 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
        {getIcon()}
      </div>

      <div className="flex-1 flex flex-col">
        <h4 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2 mb-1" title={document.name}>{document.name}</h4>
        
        <div className="flex items-center justify-between text-xs text-gray-500 mt-auto pt-3 border-t border-gray-100 dark:border-ink-light">
          <span>{(document.sizeBytes / 1024 / 1024).toFixed(1)} MB</span>
          <span className={clsx("text-[10px] font-bold uppercase px-2 py-0.5 rounded border", getStatusColor())}>
            {document.approvalStatus}
          </span>
        </div>
      </div>
    </div>
  );
};

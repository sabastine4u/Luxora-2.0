import type { Document } from '../types/documentTypes';
import { Image as ImageIcon, FileText, Video, X, Maximize2, Download } from 'lucide-react';
import { GhostButton, GoldButton } from '../../../components/ui/ui';

interface PreviewPanelProps {
  document: Document | null;
  onClose: () => void;
  isOpen: boolean;
}

export const PreviewPanel = ({ document, onClose, isOpen }: PreviewPanelProps) => {
  if (!isOpen || !document) return null;

  return (
    <div className="w-96 bg-white dark:bg-ink border-l border-gray-200 dark:border-ink-light flex flex-col h-full shadow-2xl relative z-20">
      <div className="p-4 border-b border-gray-100 dark:border-ink-light flex items-center justify-between shrink-0 bg-gray-50/50 dark:bg-ink-light/10">
        <h3 className="font-bold text-gray-900 dark:text-white truncate pr-4">Preview</h3>
        <button onClick={onClose} className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-ink-light transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Mock Viewer */}
        <div className="w-full aspect-[3/4] bg-gray-100 dark:bg-ink-light rounded-xl border border-gray-200 dark:border-ink-light flex flex-col items-center justify-center relative group overflow-hidden mb-6">
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10 backdrop-blur-[2px]">
            <GhostButton className="bg-white/90 text-gray-900 shadow-sm border-gray-200">
              <Maximize2 className="w-4 h-4 mr-2" /> View Full Screen
            </GhostButton>
          </div>
          
          {document.assetType === 'Image' ? (
            <ImageIcon className="w-20 h-20 text-gray-300" />
          ) : document.assetType === 'Video' ? (
            <Video className="w-20 h-20 text-gray-300" />
          ) : (
            <div className="flex flex-col items-center text-gray-400">
              <FileText className="w-20 h-20 mb-4 text-gray-300" />
              <div className="text-sm font-medium">Document Preview generated</div>
              <div className="text-xs mt-1">Page 1 of 12</div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white break-words">{document.name}</h4>
            <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">Version {document.currentVersion}.0</div>
          </div>
          
          <div className="flex space-x-3 pt-4 border-t border-gray-100 dark:border-ink-light">
            <GhostButton className="flex-1 justify-center">
              <Download className="w-4 h-4 mr-2" /> Download
            </GhostButton>
            <GoldButton className="flex-1 justify-center">
              Share Asset
            </GoldButton>
          </div>
        </div>
      </div>
    </div>
  );
};

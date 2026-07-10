import { UploadCloud, FolderPlus } from 'lucide-react';
import { GoldButton, GhostButton } from '../../../components/ui/ui';

export const UploadCenter = () => {
  return (
    <div className="bg-white dark:bg-ink p-8 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center text-center max-w-2xl mx-auto my-12 transition-colors hover:border-gold-400 dark:hover:border-gold-500 hover:bg-gold-50/30 dark:hover:bg-gold-900/10">
      <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-6">
        <UploadCloud className="w-8 h-8 text-blue-500" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Upload Digital Assets</h3>
      <p className="text-sm text-gray-500 mb-8 max-w-sm">
        Drag and drop your files here, or click to browse. Supported formats: PDF, DOCX, XLSX, MP4, JPG, PNG, CAD.
      </p>
      
      <div className="flex space-x-4">
        <GhostButton className="bg-white dark:bg-ink">
          <FolderPlus className="w-4 h-4 mr-2" /> Create Folder
        </GhostButton>
        <GoldButton>
          Browse Files
        </GoldButton>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 dark:border-ink-light w-full text-left">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Upload Queue (0)</div>
        <div className="text-sm text-gray-500 italic text-center py-4 bg-gray-50 dark:bg-ink-light/20 rounded-lg">
          No active uploads.
        </div>
      </div>
    </div>
  );
};

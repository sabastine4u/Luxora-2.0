import type { Document } from '../types/documentTypes';
import { PlayCircle, Image as ImageIcon } from 'lucide-react';

interface AssetCardProps {
  document: Document;
  onClick: (doc: Document) => void;
}

export const AssetCard = ({ document, onClick }: AssetCardProps) => {
  return (
    <div 
      onClick={() => onClick(document)}
      className="bg-white dark:bg-ink rounded-xl overflow-hidden border border-gray-200 dark:border-ink-light hover:shadow-lg hover:border-gold-500/50 transition-all cursor-pointer group relative"
    >
      <div className="aspect-[4/3] bg-gray-100 dark:bg-ink-light flex items-center justify-center relative group-hover:scale-105 transition-transform duration-500">
        {document.assetType === 'Video' ? (
          <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur flex items-center justify-center text-white">
            <PlayCircle className="w-6 h-6" />
          </div>
        ) : (
          <ImageIcon className="w-12 h-12 text-gray-300 dark:text-gray-600" />
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-12">
        <h4 className="font-semibold text-sm text-white truncate drop-shadow-md">{document.name}</h4>
        <div className="flex items-center justify-between mt-1 text-xs text-gray-300 font-medium">
          <span className="uppercase tracking-wider">{document.category}</span>
          <span>{(document.sizeBytes / 1024 / 1024).toFixed(1)} MB</span>
        </div>
      </div>
    </div>
  );
};

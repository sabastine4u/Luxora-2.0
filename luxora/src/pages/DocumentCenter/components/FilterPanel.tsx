import { Filter, ChevronDown, Check } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';
import { DOCUMENT_CATEGORIES, ASSET_TYPES } from '../constants/documentConstants';
import { useState } from 'react';
import { clsx } from 'clsx';

export const FilterPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  return (
    <div className="relative">
      <GhostButton onClick={() => setIsOpen(!isOpen)} className={clsx(isOpen && "bg-gray-100 dark:bg-ink-light")}>
        <Filter className="w-4 h-4 mr-2" />
        Filters
        <ChevronDown className="w-3 h-3 ml-2 text-gray-400" />
      </GhostButton>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-ink border border-gray-200 dark:border-ink-light rounded-xl shadow-lg z-50 p-4">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">File Type</h4>
          <div className="space-y-1 mb-4">
            {ASSET_TYPES.slice(0, 5).map(type => (
              <button 
                key={type}
                onClick={() => setSelectedType(type === selectedType ? null : type)}
                className="w-full flex items-center justify-between px-2 py-1.5 hover:bg-gray-50 dark:hover:bg-ink-light rounded text-sm text-gray-700 dark:text-gray-300 transition-colors"
              >
                {type}
                {selectedType === type && <Check className="w-3 h-3 text-gold-500" />}
              </button>
            ))}
          </div>

          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Category</h4>
          <div className="space-y-1">
            {DOCUMENT_CATEGORIES.slice(0, 4).map(cat => (
              <button 
                key={cat}
                className="w-full flex items-center justify-between px-2 py-1.5 hover:bg-gray-50 dark:hover:bg-ink-light rounded text-sm text-gray-700 dark:text-gray-300 transition-colors"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

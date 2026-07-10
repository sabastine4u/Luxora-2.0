import { Search, X } from 'lucide-react';
import { useDocumentCenter } from '../hooks/useDocumentCenter';

export const SearchBar = () => {
  const { searchQuery, setSearchQuery } = useDocumentCenter();

  return (
    <div className="flex items-center bg-gray-100 dark:bg-ink-light/50 rounded-xl px-3 py-2 flex-1 max-w-xl border border-transparent focus-within:border-gold-500 focus-within:bg-white dark:focus-within:bg-ink transition-all">
      <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
      <input 
        type="text" 
        placeholder="Search documents, folders, tags, or metadata..." 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white w-full placeholder-gray-400"
      />
      {searchQuery && (
        <button onClick={() => setSearchQuery('')} className="ml-2 text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

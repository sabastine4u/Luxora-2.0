import { Search, X } from 'lucide-react';
import { useCRMCenter } from '../hooks/useCRMCenter';

export const SearchBar = () => {
  const { searchQuery, setSearchQuery } = useCRMCenter();

  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Search contacts, organizations, emails..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="block w-full pl-10 pr-10 py-2 border border-gray-200 dark:border-ink-light rounded-lg leading-5 bg-gray-50 dark:bg-ink-light/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 sm:text-sm transition-colors"
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

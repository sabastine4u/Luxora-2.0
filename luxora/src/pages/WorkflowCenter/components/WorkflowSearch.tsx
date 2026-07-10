import { Search, Filter } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';

interface WorkflowSearchProps {
  query: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const WorkflowSearch = ({ query, onChange, placeholder = "Search workflows, properties, agents..." }: WorkflowSearchProps) => {
  return (
    <div className="flex items-center space-x-3 w-full">
      <div className="flex-1 flex items-center bg-gray-100 dark:bg-ink-light/50 rounded-xl px-3 py-2 border border-transparent focus-within:border-gold-500 focus-within:bg-white dark:focus-within:bg-ink transition-colors">
        <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
        <input 
          type="text" 
          placeholder={placeholder}
          value={query}
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white w-full placeholder-gray-400"
        />
      </div>
      <GhostButton size="sm" className="shrink-0 text-gray-500">
        <Filter className="w-4 h-4 mr-2" />
        Advanced Filters
      </GhostButton>
    </div>
  );
};

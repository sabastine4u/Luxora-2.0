import { Filter } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';

export const FilterPanel = () => {
  return (
    <div className="flex items-center space-x-2">
      <GhostButton className="text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-ink-light">
        <Filter className="w-4 h-4 mr-2" />
        Filters
      </GhostButton>
    </div>
  );
};

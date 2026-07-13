
import { ChevronDown } from 'lucide-react';
import type { SortOption } from '../../hooks/usePropertySearch';

interface PropertySortControlsProps {
  sort: SortOption;
  setSort: (sort: SortOption) => void;
}

export function PropertySortControls({ sort, setSort }: PropertySortControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-ink/70">Sort by:</span>
      <div className="relative">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="appearance-none bg-navy-800/50 border border-white/10 rounded-xl py-2 pl-3 pr-8 text-sm font-medium text-cream outline-none focus:border-gold-400/50"
        >
          <option value="newest" className="bg-navy-900">Newest First</option>
          <option value="price-asc" className="bg-navy-900">Price: Low to High</option>
          <option value="price-desc" className="bg-navy-900">Price: High to Low</option>
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
      </div>
    </div>
  );
}

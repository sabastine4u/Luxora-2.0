import { Search, Filter, ArrowUpDown, Download, RefreshCw } from 'lucide-react';
import type { ReactNode } from 'react';
import { GhostButton } from '../../../ui/ui';

export interface DataTableToolbarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  actions?: ReactNode;
  showSearch?: boolean;
  showExport?: boolean;
  showFilter?: boolean;
  showSort?: boolean;
  showRefresh?: boolean;
  onExport?: () => void;
  onFilter?: () => void;
  onSort?: () => void;
  onRefresh?: () => void;
  children?: ReactNode;
}

export function DataTableToolbar({
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search...",
  actions,
  showSearch = true,
  showExport = false,
  showFilter = false,
  showSort = false,
  showRefresh = false,
  onExport,
  onFilter,
  onSort,
  onRefresh,
  children
}: DataTableToolbarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-navy-800/30 p-4 rounded-2xl border border-white/5">
      {showSearch ? (
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input 
            type="text" 
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-2.5 pl-10 pr-4 text-sm text-cream placeholder:text-ink/40 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50 transition-all"
          />
        </div>
      ) : <div />}
      
      <div className="flex flex-wrap gap-3 w-full md:w-auto">
        {showFilter && (
          <GhostButton size="sm" className="bg-navy-900/80" onClick={onFilter}>
            <Filter className="h-4 w-4 mr-2"/> Filter
          </GhostButton>
        )}
        {showSort && (
          <GhostButton size="sm" className="bg-navy-900/80" onClick={onSort}>
            <ArrowUpDown className="h-4 w-4 mr-2"/> Sort
          </GhostButton>
        )}
        {showRefresh && (
          <GhostButton size="sm" className="bg-navy-900/80" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-2"/> Refresh
          </GhostButton>
        )}
        {showExport && (
          <GhostButton size="sm" className="bg-navy-900/80" onClick={onExport}>
            <Download className="h-4 w-4 mr-2"/> Export
          </GhostButton>
        )}
        {actions}
        {children}
      </div>
    </div>
  );
}

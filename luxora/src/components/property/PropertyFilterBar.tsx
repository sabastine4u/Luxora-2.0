
import { Search, ChevronDown } from 'lucide-react';
import { propertyTypes, locations, budgets } from '../../data/uiData';

interface PropertyFilterBarProps {
  search: string;
  setSearch: (s: string) => void;
  type: string;
  setType: (t: string) => void;
  location: string;
  setLocation: (l: string) => void;
  budget: string;
  setBudget: (b: string) => void;
  children?: React.ReactNode;
}

export function PropertyFilterBar({
  search, setSearch,
  type, setType,
  location, setLocation,
  budget, setBudget,
  children
}: PropertyFilterBarProps) {
  return (
    <div className="mb-10 rounded-2xl border border-white/10 bg-navy-800/50 p-4 backdrop-blur-md md:p-6 md:sticky md:top-24 md:z-40">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/50" />
          <input
            type="text"
            placeholder="Search properties or locations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-3.5 pl-12 pr-4 text-sm text-cream placeholder-ink/50 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50"
          />
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-2 gap-4 md:flex md:w-auto">
          {/* Type */}
          <div className="relative">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full appearance-none rounded-xl border border-white/10 bg-navy-900/50 py-3.5 pl-4 pr-10 text-sm text-cream focus:border-gold-400/50 focus:outline-none md:w-40"
            >
              {propertyTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
          </div>

          {/* Location */}
          <div className="relative">
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full appearance-none rounded-xl border border-white/10 bg-navy-900/50 py-3.5 pl-4 pr-10 text-sm text-cream focus:border-gold-400/50 focus:outline-none md:w-44"
            >
              {locations.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
          </div>

          {/* Budget */}
          <div className="relative col-span-2 md:col-span-1">
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full appearance-none rounded-xl border border-white/10 bg-navy-900/50 py-3.5 pl-4 pr-10 text-sm text-cream focus:border-gold-400/50 focus:outline-none md:w-48"
            >
              {budgets.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
          </div>
        </div>
      </div>
      
      {children}
    </div>
  );
}

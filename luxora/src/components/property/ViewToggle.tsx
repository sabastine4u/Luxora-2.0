import { LayoutGrid, List, Map } from 'lucide-react';

interface ViewToggleProps {
  viewMode: 'grid' | 'list' | 'map';
  setViewMode: (mode: 'grid' | 'list' | 'map') => void;
}

export function ViewToggle({ viewMode, setViewMode }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-navy-800/50 p-1 backdrop-blur-md">
      <button
        onClick={() => setViewMode('grid')}
        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
          viewMode === 'grid'
            ? 'bg-gold-400 text-navy-900 shadow-lux'
            : 'text-ink/60 hover:bg-white/5 hover:text-cream'
        }`}
        title="Grid View"
      >
        <LayoutGrid className="h-4 w-4" />
      </button>
      <button
        onClick={() => setViewMode('list')}
        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
          viewMode === 'list'
            ? 'bg-gold-400 text-navy-900 shadow-lux'
            : 'text-ink/60 hover:bg-white/5 hover:text-cream'
        }`}
        title="List View"
      >
        <List className="h-4 w-4" />
      </button>
      <button
        onClick={() => setViewMode('map')}
        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
          viewMode === 'map'
            ? 'bg-gold-400 text-navy-900 shadow-lux'
            : 'text-ink/60 hover:bg-white/5 hover:text-cream'
        }`}
        title="Map View"
      >
        <Map className="h-4 w-4" />
      </button>
    </div>
  );
}

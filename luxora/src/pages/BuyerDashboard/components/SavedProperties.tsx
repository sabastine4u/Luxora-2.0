import { useState, useMemo } from 'react';
import { Heart, Scale, Share2, Trash2, Clock, Star, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { properties } from '../../../data/luxoraData';
import { useFavorites } from '../../../contexts/FavoriteContext';
import { useSession } from '../../../contexts/SessionContext';
import { useToast } from '../../../contexts/ToastContext';
import { PropertyCard } from '../../../components/property/PropertyCard';
import { EmptyState } from '../../../components/layout';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { ROUTES } from '../../../constants/routes';
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal';
import { ShareModal } from './modals/ShareModal';

export default function SavedProperties() {
  const { favoriteProperties: savedProperties, toggleFavorite } = useFavorites();
  const { toggleCompareProperty } = useSession();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterLocation, setFilterLocation] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const { showToast } = useToast();

  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const baseProps = useMemo(() => {
    return savedProperties
      .map((id) => properties.find((p) => p.id === id))
      .filter((p): p is NonNullable<typeof p> => p !== undefined);
  }, [savedProperties]);

  const metrics = useMemo(() => {
    const total = baseProps.length;
    let lastSaved = 'None';
    if (total > 0) {
      lastSaved = baseProps[total - 1].title;
    }
    
    const premiumCount = baseProps.filter(p => p.verified.includes('Premium')).length;
    const featuredCount = baseProps.filter(p => p.tag === 'Featured').length;
    
    const totalValue = baseProps.reduce((sum, p) => sum + p.priceValue, 0);
    const avgValue = total > 0 ? totalValue / total : 0;

    const formatPrice = (val: number) => `₦${(val / 1_000_000).toFixed(1)}M`;

    return {
      total,
      lastSaved: lastSaved.length > 20 ? lastSaved.substring(0, 20) + '...' : lastSaved,
      premiumCount,
      featuredCount,
      totalValue: formatPrice(totalValue),
      avgValue: formatPrice(avgValue),
    };
  }, [baseProps]);

  const filteredAndSortedProps = useMemo(() => {
    let result = [...baseProps];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(q));
    }

    if (filterType !== 'All') result = result.filter((p) => p.type === filterType);
    if (filterLocation !== 'All') result = result.filter((p) => p.location.includes(filterLocation));

    result.sort((a, b) => {
      if (sortBy === 'price_asc') return a.priceValue - b.priceValue;
      if (sortBy === 'price_desc') return b.priceValue - a.priceValue;
      if (sortBy === 'alpha') return a.title.localeCompare(b.title);
      if (sortBy === 'oldest') return savedProperties.indexOf(a.id) - savedProperties.indexOf(b.id);
      return 0; 
    });

    if (sortBy === 'newest') result.reverse();
    return result;
  }, [baseProps, searchQuery, filterType, filterLocation, sortBy, savedProperties]);

  const uniqueTypes = ['All', ...new Set(properties.map((p) => p.type))];
  const uniqueLocations = ['All', ...new Set(properties.map((p) => p.location.split(',')[0].trim()))];

  const handleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredAndSortedProps.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filteredAndSortedProps.map(p => p.id)));
  };

  const handleBulkRemoveConfirm = () => {
    selectedIds.forEach(id => toggleFavorite(id));
    setSelectedIds(new Set());
    showToast({ type: 'success', title: 'Removed', description: 'Properties removed from favorites.' });
  };

  const handleBulkCompare = () => {
    let added = 0;
    let limitHit = false;
    for (const id of Array.from(selectedIds)) {
      const result = toggleCompareProperty(id);
      if (result === 'limit_reached') {
        limitHit = true;
        break;
      }
      if (result === 'added') added++;
    }
    setSelectedIds(new Set());
    if (limitHit) {
      showToast({ type: 'warning', title: 'Compare Limit Reached', description: `Added ${added} to compare. Compare limit (4) reached.` });
    } else {
      showToast({ type: 'success', title: 'Added to Compare', description: `Added ${added} properties to compare.` });
    }
  };

  const handleShareSubmit = (method: string) => {
    showToast({ type: 'success', title: 'Shared via ' + method, description: 'Property sharing initiated.' });
  };

  if (baseProps.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-12">
        <EmptyState
          icon={<Heart className="h-12 w-12 text-gold-400" />}
          title="My Favorites is Empty"
          description="You haven't saved any properties yet. Browse our collection and click the heart icon to save your favorites."
          actionLabel="Browse Properties"
          onAction={() => navigate(ROUTES.PROPERTIES)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col gap-2">
        <h2 className="font-heading text-2xl font-bold text-cream">My Favorites</h2>
        <p className="text-sm text-ink/60">Manage and compare your saved properties.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Total Saved" value={metrics.total.toString()} trend="+2 this week" trendColor="text-emerald-400" icon={Heart} />
        <KPICard title="Last Saved" value={metrics.lastSaved} icon={Clock} />
        <KPICard title="Premium Properties" value={metrics.premiumCount.toString()} icon={Star} />
        <KPICard title="Total Value" value={metrics.totalValue} icon={TrendingUp} />
      </div>

      <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <button 
              onClick={handleSelectAll}
              className="text-xs font-semibold text-gold-400 hover:text-gold-300 transition-colors"
            >
              {selectedIds.size === filteredAndSortedProps.length ? 'Deselect All' : 'Select All'}
            </button>
            {selectedIds.size > 0 && (
              <span className="text-xs text-cream bg-white/10 px-2 py-0.5 rounded-full">
                {selectedIds.size} Selected
              </span>
            )}
          </div>
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2">
              <button onClick={handleBulkCompare} className="flex items-center gap-1.5 text-xs text-cream/70 hover:text-gold-400 transition-colors px-2 py-1 rounded-lg hover:bg-white/5">
                <Scale className="h-3.5 w-3.5" /> Compare
              </button>
              <button onClick={() => setIsShareOpen(true)} className="flex items-center gap-1.5 text-xs text-cream/70 hover:text-blue-400 transition-colors px-2 py-1 rounded-lg hover:bg-white/5">
                <Share2 className="h-3.5 w-3.5" /> Share
              </button>
              <button onClick={() => setIsRemoveOpen(true)} className="flex items-center gap-1.5 text-xs text-rose-400/70 hover:text-rose-400 transition-colors px-2 py-1 rounded-lg hover:bg-white/5">
                <Trash2 className="h-3.5 w-3.5" /> Remove
              </button>
            </div>
          )}
        </div>

        <DataTableToolbar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search favorites..."
          actions={
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 pt-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider text-ink/50 font-semibold pl-1">City</label>
                <select value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)} className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-2.5 text-sm text-cream focus:outline-none">
                  {uniqueLocations.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider text-ink/50 font-semibold pl-1">Property Type</label>
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-2.5 text-sm text-cream focus:outline-none">
                  {uniqueTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider text-ink/50 font-semibold pl-1">Sort By</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-2.5 text-sm text-cream focus:outline-none">
                  <option value="newest">Recently Saved</option>
                  <option value="oldest">Oldest Saved</option>
                  <option value="price_desc">Price (High to Low)</option>
                  <option value="price_asc">Price (Low to High)</option>
                  <option value="alpha">Alphabetical</option>
                </select>
              </div>
            </div>
          }
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredAndSortedProps.map((property) => (
          <div key={property.id} className="relative group">
            <div className="absolute top-4 left-4 z-10">
              <input
                type="checkbox"
                checked={selectedIds.has(property.id)}
                onChange={() => handleSelect(property.id)}
                className="h-5 w-5 rounded border-white/20 bg-navy-900/80 checked:bg-gold-400 checked:border-gold-400 focus:ring-gold-400 focus:ring-offset-navy-900 cursor-pointer backdrop-blur-sm"
              />
            </div>
            <PropertyCard property={property} />
          </div>
        ))}
      </div>

      <ConfirmationModal
        isOpen={isRemoveOpen}
        onClose={() => setIsRemoveOpen(false)}
        onConfirm={handleBulkRemoveConfirm}
        title="Remove Saved Properties"
        message={`Are you sure you want to remove ${selectedIds.size} propert${selectedIds.size === 1 ? 'y' : 'ies'} from your favorites?`}
        confirmText="Remove"
        type="danger"
      />

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        onShare={handleShareSubmit}
        propertyTitle={`${selectedIds.size} Selected Properties`}
      />
    </div>
  );
}

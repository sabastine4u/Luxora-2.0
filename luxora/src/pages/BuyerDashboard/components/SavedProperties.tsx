import { useState, useMemo } from 'react';
import { Search, Heart, Star, TrendingUp, Building2, Calculator, Trash2, Scale, Share2 } from 'lucide-react';
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

    if (filterType !== 'All') {
      result = result.filter((p) => p.type === filterType);
    }

    if (filterLocation !== 'All') {
      result = result.filter((p) => p.location.includes(filterLocation));
    }

    result.sort((a, b) => {
      if (sortBy === 'price_asc') {
        return a.priceValue - b.priceValue;
      } else if (sortBy === 'price_desc') {
        return b.priceValue - a.priceValue;
      } else if (sortBy === 'alpha') {
        return a.title.localeCompare(b.title);
      } else if (sortBy === 'oldest') {
        return savedProperties.indexOf(a.id) - savedProperties.indexOf(b.id);
      }
      return 0; // Default: 'newest' handled below
    });

    if (sortBy === 'newest') {
      // Reverse array to put latest inserted first
      result.reverse();
    }

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
    if (selectedIds.size === filteredAndSortedProps.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredAndSortedProps.map(p => p.id)));
    }
  };

  const handleBulkRemove = () => {
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
      if (result === 'added') {
        added++;
      }
    }
    setSelectedIds(new Set());
    if (limitHit) {
      showToast({ type: 'warning', title: 'Compare Limit Reached', description: `Added ${added} to compare. Compare limit (4) reached.` });
    } else {
      showToast({ type: 'success', title: 'Added to Compare', description: `Added ${added} properties to compare.` });
    }
  };

  const handleBulkShare = () => {
    showToast({ type: 'info', title: 'Share Properties', description: 'Bulk sharing will be available during backend integration.' });
  };

  if (baseProps.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-12">
        <EmptyState
          icon={<Heart className="h-12 w-12 text-gold-400" />}
          title="My Favorites is Empty"
          description="You haven't saved any properties yet. Browse our premium collection to build your luxury portfolio."
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
        <p className="text-sm text-ink/60">Your curated collection of premium properties.</p>
      </div>

      {/* Metrics Section */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KPICard 
          title="Favorite Properties" value={metrics.total.toString()} icon={Heart} 
          iconColor="text-rose-400" backgroundColor="bg-rose-400/10" 
          iconBorder={true} valueTypography="heading" labelTypography="small" hoverEffect="lift"
        />
        <KPICard 
          title="Last Saved" value={metrics.lastSaved} icon={TrendingUp} 
          iconColor="text-emerald-400" backgroundColor="bg-emerald-400/10" 
          iconBorder={true} valueTypography="heading" labelTypography="small" hoverEffect="lift"
        />
        <KPICard 
          title="Premium Verified" value={metrics.premiumCount.toString()} icon={Star} 
          iconColor="text-gold-400" backgroundColor="bg-gold-400/10" 
          iconBorder={true} valueTypography="heading" labelTypography="small" hoverEffect="lift"
        />
        <KPICard 
          title="Featured Listings" value={metrics.featuredCount.toString()} icon={Building2} 
          iconColor="text-blue-400" backgroundColor="bg-blue-400/10" 
          iconBorder={true} valueTypography="heading" labelTypography="small" hoverEffect="lift"
        />
        <KPICard 
          title="Avg Saved Price" value={metrics.avgValue} icon={Calculator} 
          iconColor="text-purple-400" backgroundColor="bg-purple-400/10" 
          iconBorder={true} valueTypography="heading" labelTypography="small" hoverEffect="lift"
        />
        <KPICard 
          title="Favorites Value" value={metrics.totalValue} icon={Calculator} 
          iconColor="text-gold-400" backgroundColor="bg-gold-400/10" 
          iconBorder={true} valueTypography="heading" labelTypography="small" hoverEffect="lift"
        />
      </div>

      <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 backdrop-blur-md space-y-4">
        {/* Bulk Actions Header */}
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
              <button onClick={handleBulkShare} className="flex items-center gap-1.5 text-xs text-cream/70 hover:text-blue-400 transition-colors px-2 py-1 rounded-lg hover:bg-white/5">
                <Share2 className="h-3.5 w-3.5" /> Share
              </button>
              <button onClick={handleBulkRemove} className="flex items-center gap-1.5 text-xs text-rose-400/70 hover:text-rose-400 transition-colors px-2 py-1 rounded-lg hover:bg-white/5">
                <Trash2 className="h-3.5 w-3.5" /> Remove
              </button>
            </div>
          )}
        </div>

        {/* Search & Filters */}
        <DataTableToolbar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search favorites..."
          actions={
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 pt-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider text-ink/50 font-semibold pl-1">City</label>
                <select
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-2.5 text-sm text-cream focus:border-gold-400/50 focus:outline-none transition-all appearance-none"
                >
                  {uniqueLocations.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider text-ink/50 font-semibold pl-1">Property Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-2.5 text-sm text-cream focus:border-gold-400/50 focus:outline-none transition-all appearance-none"
                >
                  {uniqueTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider text-ink/50 font-semibold pl-1">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-2.5 text-sm text-cream focus:border-gold-400/50 focus:outline-none transition-all appearance-none"
                >
                  <option value="newest">Newest Saved</option>
                  <option value="oldest">Oldest Saved</option>
                  <option value="price_desc">Highest Price</option>
                  <option value="price_asc">Lowest Price</option>
                  <option value="alpha">Alphabetical</option>
                </select>
              </div>
            </div>
          }
        />
      </div>

      {filteredAndSortedProps.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedProps.map((property) => {
            const isSelected = selectedIds.has(property.id);
            return (
              <div key={property.id} className="relative group">
                <PropertyCard property={property} />
                
                {/* Selection Overlay */}
                <div 
                  className={`absolute top-4 left-4 z-10 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                >
                  <button
                    onClick={(e) => { e.stopPropagation(); handleSelect(property.id); }}
                    className={`flex h-8 w-8 items-center justify-center rounded-xl border-2 transition-all ${
                      isSelected 
                        ? 'bg-gold-400 border-gold-400 text-navy-900' 
                        : 'bg-navy-900/80 border-white/20 text-transparent hover:border-gold-400/50 backdrop-blur-sm'
                    }`}
                  >
                    <svg className={`h-4 w-4 ${isSelected ? 'opacity-100' : 'opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-12">
           <EmptyState
            icon={<Search className="h-8 w-8 text-gold-400" />}
            title="No matching properties"
            description="Adjust your search and filter criteria to find what you're looking for."
          />
        </div>
      )}
    </div>
  );
}

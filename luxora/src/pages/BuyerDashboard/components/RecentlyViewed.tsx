import { useState, useMemo } from 'react';
import { Search, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { properties } from '../../../data/luxoraData';
import { useSession } from '../../../contexts/SessionContext';
import { PropertyCard } from '../../../components/property/PropertyCard';
import { EmptyState } from '../../../components/layout';
import { ROUTES } from '../../../constants/routes';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';

export default function RecentlyViewed() {
  const { recentlyViewed } = useSession();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterLocation, setFilterLocation] = useState('All');
  const [filterVerification, setFilterVerification] = useState('All');
  const [sortBy, setSortBy] = useState('recent');

  const baseProps = useMemo(() => {
    return recentlyViewed
      .map((id) => properties.find((p) => p.id === id))
      .filter((p): p is NonNullable<typeof p> => p !== undefined);
  }, [recentlyViewed]);

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

    if (filterVerification !== 'All') {
      result = result.filter((p) => p.verified.some(v => v === filterVerification));
    }

    result.sort((a, b) => {
      if (sortBy === 'price_asc') {
        return a.priceValue - b.priceValue;
      } else if (sortBy === 'price_desc') {
        return b.priceValue - a.priceValue;
      }
      return 0;
    });

    // The recentlyViewed list is appended to, meaning newest is at the end.
    // So 'recent' should reverse the array.
    if (sortBy === 'recent') {
       result.reverse();
    }

    return result;
  }, [baseProps, searchQuery, filterType, filterLocation, filterVerification, sortBy]);

  const uniqueTypes = ['All', ...new Set(properties.map((p) => p.type))];
  const uniqueLocations = ['All', ...new Set(properties.map((p) => p.location))];
  const uniqueVerifications = ['All', 'Title', 'Structural', 'Legal'];

  if (baseProps.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-12">
        <EmptyState
          icon={<EyeOff className="h-12 w-12 text-gold-400" />}
          title="No recently viewed properties"
          description="Properties you browse will appear here for easy access."
          actionLabel="Browse Properties"
          onAction={() => navigate(ROUTES.PROPERTIES)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col gap-2">
        <h2 className="font-heading text-2xl font-bold text-cream">Recently Viewed</h2>
        <p className="text-sm text-ink/60">You have recently viewed {baseProps.length} propert{baseProps.length === 1 ? 'y' : 'ies'}.</p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 backdrop-blur-md space-y-4">
        {/* Search */}
        <DataTableToolbar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search recently viewed..."
          actions={
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 pt-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider text-ink/50 font-semibold pl-1">Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-2.5 text-sm text-cream focus:border-gold-400/50 focus:outline-none transition-all"
                >
                  {uniqueTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider text-ink/50 font-semibold pl-1">Location</label>
                <select
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-2.5 text-sm text-cream focus:border-gold-400/50 focus:outline-none transition-all"
                >
                  {uniqueLocations.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider text-ink/50 font-semibold pl-1">Verification</label>
                <select
                  value={filterVerification}
                  onChange={(e) => setFilterVerification(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-2.5 text-sm text-cream focus:border-gold-400/50 focus:outline-none transition-all"
                >
                  {uniqueVerifications.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider text-ink/50 font-semibold pl-1">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-2.5 text-sm text-cream focus:border-gold-400/50 focus:outline-none transition-all"
                >
                  <option value="recent">Most Recent</option>
                  <option value="price_asc">Price (Low → High)</option>
                  <option value="price_desc">Price (High → Low)</option>
                </select>
              </div>
            </div>
          }
        />
      </div>

      {filteredAndSortedProps.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedProps.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
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

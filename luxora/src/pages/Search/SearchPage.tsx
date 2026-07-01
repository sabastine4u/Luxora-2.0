import { useState, useMemo } from 'react';
import { Search, Map, SlidersHorizontal, ChevronDown, MapPin } from 'lucide-react';
import { PageLayout } from '../../components/layout';
import { properties } from '../../data/luxoraData';
import { propertyTypes, locations } from '../../data/uiData';
import { PropertyCard } from '../../components/property/PropertyCard';
import { Slider } from '../../components/ui/Slider';

type SortOption = 'newest' | 'price-asc' | 'price-desc';

export default function SearchPage() {
  // Filters State
  const [search, setSearch] = useState('');
  const [type, setType] = useState('Any Type');
  const [location, setLocation] = useState('Any Location');
  const [minPriceM, setMinPriceM] = useState(0);
  const [maxPriceM, setMaxPriceM] = useState(1000);
  const [beds, setBeds] = useState('Any');
  const [baths, setBaths] = useState('Any');
  
  // View State
  const [sort, setSort] = useState<SortOption>('newest');
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  // Filter Logic
  const filteredProperties = useMemo(() => {
    let result = properties;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q));
    }

    if (type !== 'Any Type') {
      result = result.filter(p => p.type === type);
    }

    if (location !== 'Any Location') {
      result = result.filter(p => p.location.includes(location));
    }

    if (minPriceM > 0) {
      result = result.filter(p => (p.priceValue / 1_000_000) >= minPriceM);
    }

    if (maxPriceM < 1000) {
      result = result.filter(p => (p.priceValue / 1_000_000) <= maxPriceM);
    }

    if (beds !== 'Any') {
      result = result.filter(p => p.beds >= parseInt(beds, 10));
    }

    if (baths !== 'Any') {
      result = result.filter(p => p.baths >= parseInt(baths, 10));
    }

    // Sort
    result = [...result].sort((a, b) => {
      if (sort === 'price-asc') return a.priceValue - b.priceValue;
      if (sort === 'price-desc') return b.priceValue - a.priceValue;
      return 0; // newest
    });

    return result;
  }, [search, type, location, minPriceM, maxPriceM, beds, baths, sort]);

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const currentProperties = filteredProperties.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <PageLayout>
      <div className="flex min-h-screen pt-20">
        {/* Sidebar Filters */}
        <aside className="hidden w-80 shrink-0 border-r border-white/10 bg-navy-900 p-6 lg:block h-[calc(100vh-80px)] sticky top-20 overflow-y-auto">
          <div className="mb-6 flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-gold-400" />
            <h2 className="font-heading text-lg font-bold text-cream">Filters</h2>
          </div>

          <div className="space-y-6">
            {/* Search */}
            <div>
              <label className="mb-2 block text-sm font-medium text-ink/70">Keyword</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
                <input
                  type="text"
                  placeholder="e.g. Pool, Marina"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="w-full rounded-xl border border-white/10 bg-navy-800/50 py-2.5 pl-10 pr-4 text-sm text-cream placeholder-ink/50 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="mb-2 block text-sm font-medium text-ink/70">Location</label>
              <div className="relative">
                <select
                  value={location}
                  onChange={(e) => { setLocation(e.target.value); setPage(1); }}
                  className="w-full appearance-none rounded-xl border border-white/10 bg-navy-800/50 py-2.5 pl-4 pr-10 text-sm text-cream focus:border-gold-400/50 focus:outline-none"
                >
                  {locations.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
              </div>
            </div>

            {/* Type */}
            <div>
              <label className="mb-2 block text-sm font-medium text-ink/70">Property Type</label>
              <div className="relative">
                <select
                  value={type}
                  onChange={(e) => { setType(e.target.value); setPage(1); }}
                  className="w-full appearance-none rounded-xl border border-white/10 bg-navy-800/50 py-2.5 pl-4 pr-10 text-sm text-cream focus:border-gold-400/50 focus:outline-none"
                >
                  {propertyTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="mb-4 block text-sm font-medium text-ink/70">Price Range (Millions ₦)</label>
              <div className="space-y-4">
                <Slider
                  label="Minimum"
                  value={minPriceM}
                  min={0}
                  max={1000}
                  step={10}
                  suffix="M"
                  prefix="₦"
                  onChange={(v) => { setMinPriceM(v); if(v > maxPriceM) setMaxPriceM(v); setPage(1); }}
                />
                <Slider
                  label="Maximum"
                  value={maxPriceM}
                  min={0}
                  max={1000}
                  step={10}
                  suffix={maxPriceM === 1000 ? "M+" : "M"}
                  prefix="₦"
                  onChange={(v) => { setMaxPriceM(v); if(v < minPriceM) setMinPriceM(v); setPage(1); }}
                />
              </div>
            </div>

            {/* Beds & Baths */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-ink/70">Beds (Min)</label>
                <div className="relative">
                  <select
                    value={beds}
                    onChange={(e) => { setBeds(e.target.value); setPage(1); }}
                    className="w-full appearance-none rounded-xl border border-white/10 bg-navy-800/50 py-2.5 pl-4 pr-10 text-sm text-cream focus:border-gold-400/50 focus:outline-none"
                  >
                    <option value="Any">Any</option>
                    {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}+</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-ink/70">Baths (Min)</label>
                <div className="relative">
                  <select
                    value={baths}
                    onChange={(e) => { setBaths(e.target.value); setPage(1); }}
                    className="w-full appearance-none rounded-xl border border-white/10 bg-navy-800/50 py-2.5 pl-4 pr-10 text-sm text-cream focus:border-gold-400/50 focus:outline-none"
                  >
                    <option value="Any">Any</option>
                    {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}+</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-navy-900/50">
          
          {/* Map Placeholder */}
          <div className="h-64 md:h-80 w-full relative bg-navy-800 border-b border-white/10 overflow-hidden">
            <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-navy-900/60" />
            
            {/* Map Markers Mockup */}
            <div className="absolute top-1/3 left-1/4">
              <div className="flex items-center justify-center h-8 w-8 bg-gold-400 rounded-full shadow-lux text-navy-900 animate-pulse">
                <MapPin className="h-4 w-4" />
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2">
              <div className="flex items-center justify-center h-8 w-8 bg-gold-400 rounded-full shadow-lux text-navy-900 animate-pulse">
                <MapPin className="h-4 w-4" />
              </div>
            </div>
            <div className="absolute bottom-1/3 right-1/4">
              <div className="flex items-center justify-center h-8 w-8 bg-gold-400 rounded-full shadow-lux text-navy-900 animate-pulse">
                <MapPin className="h-4 w-4" />
              </div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-navy-900/80 backdrop-blur-md border border-white/10 px-6 py-3 rounded-full flex items-center gap-3">
                <Map className="h-5 w-5 text-gold-400" />
                <span className="text-cream font-medium">Interactive Map View</span>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 max-w-7xl mx-auto">
            {/* Header: Count & Sort */}
            <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-2xl font-bold font-heading text-cream">Properties for Sale</h1>
                <p className="text-sm text-ink/70 mt-1">
                  Showing <span className="font-semibold text-gold-300">{filteredProperties.length}</span> results matching your criteria
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-ink/70">Sort by:</span>
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => { setSort(e.target.value as SortOption); setPage(1); }}
                    className="appearance-none bg-navy-800/50 border border-white/10 rounded-xl py-2 pl-3 pr-8 text-sm font-medium text-cream outline-none focus:border-gold-400/50"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
                </div>
              </div>
            </div>

            {/* Grid */}
            {currentProperties.length > 0 ? (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                  {currentProperties.map(p => (
                    <PropertyCard key={p.id} property={p} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center gap-2">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`flex h-10 w-10 items-center justify-center rounded-xl border text-sm font-semibold transition-colors ${
                          page === i + 1
                            ? 'border-gold-400 bg-gold-400/10 text-gold-300'
                            : 'border-white/10 bg-navy-800/50 text-ink/70 hover:border-white/20 hover:text-cream'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center border border-white/5 rounded-3xl bg-navy-800/20 backdrop-blur-sm">
                <div className="bg-navy-800 p-4 rounded-full mb-4">
                  <Search className="h-8 w-8 text-ink/50" />
                </div>
                <h3 className="text-xl font-semibold text-cream mb-2">No properties found</h3>
                <p className="text-ink/60 max-w-md">
                  We couldn't find any properties matching your current filters. Try adjusting your search criteria or zooming out on the map.
                </p>
                <button 
                  onClick={() => {
                    setSearch(''); setType('Any Type'); setLocation('Any Location'); 
                    setMinPriceM(0); setMaxPriceM(1000); setBeds('Any'); setBaths('Any');
                  }}
                  className="mt-6 text-gold-400 hover:text-gold-300 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </PageLayout>
  );
}

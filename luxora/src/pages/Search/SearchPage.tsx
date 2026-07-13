import { Search, Map, SlidersHorizontal, ChevronDown, MapPin } from 'lucide-react';
import { PageLayout } from '../../components/layout';
import { propertyTypes, locations } from '../../data/uiData';
import { Slider } from '../../components/ui/Slider';
import { usePropertySearch } from '../../hooks/usePropertySearch';
import { PropertySortControls } from '../../components/property/PropertySortControls';
import { PropertyGrid } from '../../components/property/PropertyGrid';
import { PropertyPagination } from '../../components/property/PropertyPagination';
import { PropertyFilterChips } from '../../components/property/PropertyFilterChips';
import { PropertyResultsSummary } from '../../components/property/PropertyResultsSummary';
import { ViewToggle } from '../../components/property/ViewToggle';

export default function SearchPage() {
  const {
    search, setSearch,
    type, setType,
    location, setLocation,
    minPriceM, setMinPriceM,
    maxPriceM, setMaxPriceM,
    beds, setBeds,
    baths, setBaths,
    sort, setSort,
    page, goToPage,
    filteredProperties,
    paginatedProperties,
    totalPages,
    totalProperties,
    viewMode,
    setViewMode,
    resetFilters
  } = usePropertySearch({ initialItemsPerPage: 6 });

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
                  onChange={(e) => setSearch(e.target.value)}
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
                  onChange={(e) => setLocation(e.target.value)}
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
                  onChange={(e) => setType(e.target.value)}
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
                  onChange={(v) => { setMinPriceM(v); if(v > maxPriceM) setMaxPriceM(v); }}
                />
                <Slider
                  label="Maximum"
                  value={maxPriceM}
                  min={0}
                  max={1000}
                  step={10}
                  suffix={maxPriceM === 1000 ? "M+" : "M"}
                  prefix="₦"
                  onChange={(v) => { setMaxPriceM(v); if(v < minPriceM) setMinPriceM(v); }}
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
                    onChange={(e) => setBeds(e.target.value)}
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
                    onChange={(e) => setBaths(e.target.value)}
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
                <PropertyResultsSummary filteredCount={filteredProperties.length} totalCount={totalProperties} />
              </div>
              
              <div className="flex items-center gap-4">
                <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
                <PropertySortControls sort={sort} setSort={setSort} />
              </div>
            </div>

            <PropertyFilterChips 
              search={search} setSearch={setSearch}
              type={type} setType={setType}
              location={location} setLocation={setLocation}
              minPriceM={minPriceM} setMinPriceM={setMinPriceM}
              maxPriceM={maxPriceM} setMaxPriceM={setMaxPriceM}
              beds={beds} setBeds={setBeds}
              baths={baths} setBaths={setBaths}
              resetFilters={resetFilters}
            />

            {/* Grid */}
            <PropertyGrid 
              properties={paginatedProperties} 
              gridClassName="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
              viewMode={viewMode}
              onClearFilters={resetFilters}
            >
              <PropertyPagination 
                currentPage={page} 
                totalPages={totalPages} 
                onPageChange={goToPage} 
              />
            </PropertyGrid>
          </div>
        </main>
      </div>
    </PageLayout>
  );
}

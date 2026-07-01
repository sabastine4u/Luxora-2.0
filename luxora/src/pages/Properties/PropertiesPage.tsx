import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { PageLayout, Section, Container, PageHeader, Breadcrumb, EmptyState } from '../../components/layout';
import { PropertyCard } from '../../components/property/PropertyCard';
import { properties } from '../../data/luxoraData';
import { propertyTypes, locations, budgets } from '../../data/uiData';

type SortOption = 'newest' | 'price-asc' | 'price-desc';

export default function PropertiesPage() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('Any Type');
  const [location, setLocation] = useState('Any Location');
  const [budget, setBudget] = useState('Any Budget');
  const [sort, setSort] = useState<SortOption>('newest');
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

  // Derive max budget from string (super simple for mockup purposes)
  const getBudgetMax = (b: string) => {
    if (b === 'Any Budget') return Infinity;
    if (b === '₦50M – ₦100M') return 100_000_000;
    if (b === '₦100M – ₦300M') return 300_000_000;
    if (b === '₦300M – ₦700M') return 700_000_000;
    if (b === '₦700M+') return Infinity;
    return Infinity;
  };
  const getBudgetMin = (b: string) => {
    if (b === 'Any Budget') return 0;
    if (b === '₦50M – ₦100M') return 50_000_000;
    if (b === '₦100M – ₦300M') return 100_000_000;
    if (b === '₦300M – ₦700M') return 300_000_000;
    if (b === '₦700M+') return 700_000_000;
    return 0;
  };

  const filteredProperties = useMemo(() => {
    let result = properties;

    // Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q));
    }

    // Type
    if (type !== 'Any Type') {
      result = result.filter(p => p.type === type);
    }

    // Location
    if (location !== 'Any Location') {
      result = result.filter(p => p.location.includes(location));
    }

    // Budget
    if (budget !== 'Any Budget') {
      const min = getBudgetMin(budget);
      const max = getBudgetMax(budget);
      result = result.filter(p => p.priceValue >= min && p.priceValue <= max);
    }

    // Sort
    result = [...result].sort((a, b) => {
      if (sort === 'price-asc') return a.priceValue - b.priceValue;
      if (sort === 'price-desc') return b.priceValue - a.priceValue;
      return 0; // newest (mock)
    });

    return result;
  }, [search, type, location, budget, sort]);

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const currentProperties = filteredProperties.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <PageLayout>
      <Container className="pt-24 md:pt-32">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Properties' },
          ]}
        />
        
        <PageHeader
          title="Explore Properties"
          description="Discover verified luxury homes, apartments, and commercial spaces across prime locations."
        />

        {/* Filters */}
        <div className="mb-10 rounded-2xl border border-white/10 bg-navy-800/50 p-4 backdrop-blur-md md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/50" />
              <input
                type="text"
                placeholder="Search properties or locations..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-3.5 pl-12 pr-4 text-sm text-cream placeholder-ink/50 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50"
              />
            </div>

            {/* Dropdowns */}
            <div className="grid grid-cols-2 gap-4 md:flex md:w-auto">
              {/* Type */}
              <div className="relative">
                <select
                  value={type}
                  onChange={(e) => { setType(e.target.value); setPage(1); }}
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
                  onChange={(e) => { setLocation(e.target.value); setPage(1); }}
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
                  onChange={(e) => { setBudget(e.target.value); setPage(1); }}
                  className="w-full appearance-none rounded-xl border border-white/10 bg-navy-900/50 py-3.5 pl-4 pr-10 text-sm text-cream focus:border-gold-400/50 focus:outline-none md:w-48"
                >
                  {budgets.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
              </div>
            </div>
          </div>

          {/* Bottom Bar: Results Count & Sort */}
          <div className="mt-4 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-4 sm:flex-row sm:items-center">
            <div className="text-sm text-ink/70">
              Showing <span className="font-semibold text-cream">{filteredProperties.length}</span> verified properties
            </div>
            
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-ink/50" />
              <span className="text-sm text-ink/70">Sort by:</span>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => { setSort(e.target.value as SortOption); setPage(1); }}
                  className="appearance-none bg-transparent py-1 pl-2 pr-8 text-sm font-medium text-cream outline-none focus:ring-0"
                >
                  <option value="newest" className="bg-navy-900">Newest First</option>
                  <option value="price-asc" className="bg-navy-900">Price: Low to High</option>
                  <option value="price-desc" className="bg-navy-900">Price: High to Low</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Grid */}
      <Section noPadding className="pb-24 md:pb-32">
        <Container>
          {currentProperties.length > 0 ? (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
            <EmptyState
              title="No properties found"
              description="We couldn't find any properties matching your current filters. Try adjusting your search criteria."
              actionLabel="Clear Filters"
              onAction={() => {
                setSearch('');
                setType('Any Type');
                setLocation('Any Location');
                setBudget('Any Budget');
              }}
            />
          )}
        </Container>
      </Section>
    </PageLayout>
  );
}

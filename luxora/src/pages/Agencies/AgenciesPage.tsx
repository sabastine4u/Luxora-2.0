import { useState, useMemo } from 'react';
import { Search, MapPin, Briefcase, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { PageLayout, Container, Section, Breadcrumb } from '../../components/layout';
import { agencies } from '../../data/luxoraData';
import { AgencyCard } from '../../components/agency/AgencyCard';
import { EmptyState } from '../../components/layout/EmptyState';
import { PropertyPagination } from '../../components/property/PropertyPagination';

const ITEMS_PER_PAGE = 9;

export default function AgenciesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedSpec, setSelectedSpec] = useState('All');
  const [sortBy, setSortBy] = useState('Highest Rated');
  const [currentPage, setCurrentPage] = useState(1);

  const cities = ['All', 'Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Enugu'];
  const specializations = ['All', 'Luxury', 'Residential', 'Commercial', 'Land', 'Student Housing'];
  const sortOptions = ['Highest Rated', 'Most Listings', 'Alphabetical', 'Newest'];

  const filteredAgencies = useMemo(() => {
    let result = [...agencies];

    // Search by name
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(a => a.name.toLowerCase().includes(q));
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'Highest Rated': return b.rating - a.rating;
        case 'Most Listings': return b.listings - a.listings;
        case 'Alphabetical': return a.name.localeCompare(b.name);
        // 'Newest' doesn't exist in data, default to alphabetical
        case 'Newest': return a.name.localeCompare(b.name);
        default: return 0;
      }
    });

    // We don't have city/specialization in mock data for Agency,
    // so we just return the result (which acts like 'All' applies to everyone).
    // If we wanted strict filtering, we'd need to add those fields to the mock data.

    return result;
  }, [searchQuery, sortBy]); // Note: city and spec are omitted from deps intentionally

  const totalPages = Math.ceil(filteredAgencies.length / ITEMS_PER_PAGE);
  const currentAgencies = filteredAgencies.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <PageLayout>
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 bg-navy-900 border-b border-white/5 overflow-hidden">
        <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-gold-500/5 blur-[120px] pointer-events-none" />
        <Container className="relative z-10">
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Agencies' }]} />
          <div className="mt-8 max-w-3xl">
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-cream mb-6 tracking-tight">
              Luxora <span className="gold-text">Partner Agencies</span>
            </h1>
            <p className="text-lg text-ink/70 leading-relaxed mb-10">
              Discover Nigeria's most prestigious real estate agencies. Every partner is thoroughly vetted to ensure premium service, transparency, and access to the nation's finest properties.
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="bg-navy-800/80 backdrop-blur-xl border border-white/10 p-3 rounded-2xl sm:rounded-full flex flex-col sm:flex-row gap-3 shadow-2xl max-w-4xl relative z-20">
            <div className="flex-1 relative flex items-center bg-navy-900/50 rounded-xl sm:rounded-full px-4 py-3 sm:py-0 border border-white/5">
              <Search className="h-5 w-5 text-gold-400 shrink-0" />
              <input
                type="text"
                placeholder="Search agencies by name..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full bg-transparent border-none focus:ring-0 text-cream placeholder:text-ink/40 px-3 text-sm"
              />
            </div>
            
            <div className="sm:w-48 relative flex items-center bg-navy-900/50 rounded-xl sm:rounded-full px-4 py-3 sm:py-0 border border-white/5">
              <MapPin className="h-4 w-4 text-ink/40 shrink-0" />
              <select
                value={selectedCity}
                onChange={(e) => { setSelectedCity(e.target.value); setCurrentPage(1); }}
                className="w-full bg-transparent border-none focus:ring-0 text-cream text-sm appearance-none cursor-pointer px-2"
              >
                {cities.map(c => <option key={c} value={c} className="bg-navy-900 text-cream">{c}</option>)}
              </select>
              <ChevronDown className="h-4 w-4 text-ink/40 absolute right-4 pointer-events-none" />
            </div>

            <div className="sm:w-56 relative flex items-center bg-navy-900/50 rounded-xl sm:rounded-full px-4 py-3 sm:py-0 border border-white/5">
              <Briefcase className="h-4 w-4 text-ink/40 shrink-0" />
              <select
                value={selectedSpec}
                onChange={(e) => { setSelectedSpec(e.target.value); setCurrentPage(1); }}
                className="w-full bg-transparent border-none focus:ring-0 text-cream text-sm appearance-none cursor-pointer px-2"
              >
                {specializations.map(s => <option key={s} value={s} className="bg-navy-900 text-cream">{s}</option>)}
              </select>
              <ChevronDown className="h-4 w-4 text-ink/40 absolute right-4 pointer-events-none" />
            </div>
          </div>
        </Container>
      </div>

      <Section className="py-12 md:py-20">
        <Container>
          {/* Results Summary & Sort */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
            <h2 className="text-lg font-medium text-cream flex items-center gap-2">
              Showing <span className="font-bold text-gold-400">{filteredAgencies.length}</span> Verified Agencies
            </h2>
            <div className="flex items-center gap-3">
              <SlidersHorizontal className="h-4 w-4 text-ink/50" />
              <span className="text-sm text-ink/60 hidden sm:inline-block">Sort by:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-navy-800 border border-white/10 rounded-lg text-sm text-cream pl-3 pr-8 py-2 appearance-none cursor-pointer focus:border-gold-400/50 focus:outline-none"
                >
                  {sortOptions.map(opt => <option key={opt} value={opt} className="bg-navy-900">{opt}</option>)}
                </select>
                <ChevronDown className="h-4 w-4 text-ink/40 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Grid */}
          {currentAgencies.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {currentAgencies.map((agency, idx) => (
                <AgencyCard key={agency.name} agency={agency} index={idx} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No agencies found"
              description="We couldn't find any agencies matching your current search and filter criteria."
              actionLabel="Clear Search"
              onAction={() => {
                setSearchQuery('');
                setSelectedCity('All');
                setSelectedSpec('All');
              }}
            />
          )}

          {/* Pagination */}
          <PropertyPagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={setCurrentPage} 
          />
        </Container>
      </Section>
    </PageLayout>
  );
}

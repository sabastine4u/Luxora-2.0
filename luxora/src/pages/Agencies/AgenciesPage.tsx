import { useEffect, useMemo, useState } from 'react';
import {
  Search,
  MapPin,
  Briefcase,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';

import {
  PageLayout,
  Container,
  Section,
  Breadcrumb,
} from '../../components/layout';

import { AgencyCard } from '../../components/agency/AgencyCard';
import { EmptyState } from '../../components/layout/EmptyState';
import { PropertyPagination } from '../../components/property/PropertyPagination';
import { agencyApi } from '../../api/agency.api';

import type { PublicAgency } from '../../types';

const ITEMS_PER_PAGE = 9;

type SortOption =
  | 'Most Listings'
  | 'Alphabetical'
  | 'Newest';

export default function AgenciesPage() {
  const [agencies, setAgencies] = useState<PublicAgency[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedSpec, setSelectedSpec] = useState('All');

  const [sortBy, setSortBy] =
    useState<SortOption>('Most Listings');

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let mounted = true;

    const loadAgencies = async () => {
      try {
        setIsLoading(true);

        const response = await agencyApi.getPublicAgencies({
          page: 1,
          limit: 100,
        });

        if (!mounted) return;

        const agencyList = Array.isArray(
          response?.agencies,
        )
          ? response.agencies
          : [];

        setAgencies(agencyList);
      } catch (error) {
        console.error(
          'Failed to load public agencies:',
          error,
        );

        if (!mounted) return;

        setAgencies([]);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadAgencies();

    return () => {
      mounted = false;
    };
  }, []);

  const cities = useMemo(() => {
    const values = agencies.flatMap(
      (agency) => agency.serviceAreas || [],
    );

    return [
      'All',
      ...Array.from(new Set(values)).sort(
        (a, b) => a.localeCompare(b),
      ),
    ];
  }, [agencies]);

  const specializations = useMemo(() => {
    const values = agencies.flatMap(
      (agency) => agency.specializations || [],
    );

    return [
      'All',
      ...Array.from(new Set(values)).sort(
        (a, b) => a.localeCompare(b),
      ),
    ];
  }, [agencies]);

  const filteredAgencies = useMemo(() => {
    let result = [...agencies];

    const query =
      searchQuery.trim().toLowerCase();

    if (query) {
      result = result.filter((agency) => {
        return (
          agency.name
            .toLowerCase()
            .includes(query) ||
          agency.serviceAreas.some((area) =>
            area.toLowerCase().includes(query),
          ) ||
          agency.specializations.some(
            (specialization) =>
              specialization
                .toLowerCase()
                .includes(query),
          )
        );
      });
    }

    if (selectedCity !== 'All') {
      result = result.filter((agency) =>
        agency.serviceAreas.some(
          (area) =>
            area.toLowerCase() ===
            selectedCity.toLowerCase(),
        ),
      );
    }

    if (selectedSpec !== 'All') {
      result = result.filter((agency) =>
        agency.specializations.some(
          (specialization) =>
            specialization.toLowerCase() ===
            selectedSpec.toLowerCase(),
        ),
      );
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'Alphabetical':
          return a.name.localeCompare(b.name);

        case 'Newest':
          return (
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
          );

        case 'Most Listings':
        default:
          return (
            b.listingCount -
            a.listingCount
          );
      }
    });

    return result;
  }, [
    agencies,
    searchQuery,
    selectedCity,
    selectedSpec,
    sortBy,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    selectedCity,
    selectedSpec,
    sortBy,
  ]);

  const totalPages = Math.ceil(
    filteredAgencies.length / ITEMS_PER_PAGE,
  );

  const currentAgencies =
    filteredAgencies.slice(
      (currentPage - 1) *
        ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE,
    );

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCity('All');
    setSelectedSpec('All');
    setSortBy('Most Listings');
    setCurrentPage(1);
  };

  return (
   <PageLayout footerVariant="compact">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-white/5 bg-navy-900 pb-20 pt-32">
        <div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-gold-500/5 blur-[120px]" />

        <Container className="relative z-10">
          <Breadcrumb
            items={[
              {
                label: 'Home',
                href: '/',
              },
              {
                label: 'Agencies',
              },
            ]}
          />

          <div className="mt-8 max-w-3xl">
            <h1 className="mb-6 font-heading text-4xl font-bold tracking-tight text-cream sm:text-5xl lg:text-6xl">
              Luxora{' '}
              <span className="gold-text">
                Partner Agencies
              </span>
            </h1>

            <p className="mb-10 text-lg leading-relaxed text-ink/70">
              Discover real estate agencies operating
              across the Luxora marketplace and explore
              their published listings and active agents.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative z-20 flex max-w-4xl flex-col gap-3 rounded-2xl border border-white/10 bg-navy-800/80 p-3 shadow-2xl backdrop-blur-xl sm:flex-row sm:rounded-full">
            <div className="relative flex flex-1 items-center rounded-xl border border-white/5 bg-navy-900/50 px-4 py-3 sm:rounded-full sm:py-0">
              <Search className="h-5 w-5 shrink-0 text-gold-400" />

              <input
                type="text"
                placeholder="Search agencies by name..."
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(
                    event.target.value,
                  )
                }
                className="w-full border-none bg-transparent px-3 text-sm text-cream placeholder:text-ink/40 focus:ring-0"
              />
            </div>

            <div className="relative flex items-center rounded-xl border border-white/5 bg-navy-900/50 px-4 py-3 sm:w-52 sm:rounded-full sm:py-0">
              <MapPin className="h-4 w-4 shrink-0 text-ink/40" />

              <select
                value={selectedCity}
                onChange={(event) =>
                  setSelectedCity(
                    event.target.value,
                  )
                }
                className="w-full cursor-pointer appearance-none border-none bg-transparent px-2 text-sm text-cream focus:ring-0"
              >
                {cities.map((city) => (
                  <option
                    key={city}
                    value={city}
                    className="bg-navy-900 text-cream"
                  >
                    {city}
                  </option>
                ))}
              </select>

              <ChevronDown className="pointer-events-none absolute right-4 h-4 w-4 text-ink/40" />
            </div>

            <div className="relative flex items-center rounded-xl border border-white/5 bg-navy-900/50 px-4 py-3 sm:w-60 sm:rounded-full sm:py-0">
              <Briefcase className="h-4 w-4 shrink-0 text-ink/40" />

              <select
                value={selectedSpec}
                onChange={(event) =>
                  setSelectedSpec(
                    event.target.value,
                  )
                }
                className="w-full cursor-pointer appearance-none border-none bg-transparent px-2 text-sm text-cream focus:ring-0"
              >
                {specializations.map(
                  (specialization) => (
                    <option
                      key={specialization}
                      value={specialization}
                      className="bg-navy-900 text-cream"
                    >
                      {specialization}
                    </option>
                  ),
                )}
              </select>

              <ChevronDown className="pointer-events-none absolute right-4 h-4 w-4 text-ink/40" />
            </div>
          </div>
        </Container>
      </div>

      <Section className="py-12 md:py-20">
        <Container>
          <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <h2 className="flex items-center gap-2 text-lg font-medium text-cream">
              Showing{' '}
              <span className="font-bold text-gold-400">
                {filteredAgencies.length}
              </span>{' '}
              Active Agencies
            </h2>

            <div className="flex items-center gap-3">
              <SlidersHorizontal className="h-4 w-4 text-ink/50" />

              <span className="hidden text-sm text-ink/60 sm:inline-block">
                Sort by:
              </span>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(event) =>
                    setSortBy(
                      event.target.value as SortOption,
                    )
                  }
                  className="cursor-pointer appearance-none rounded-lg border border-white/10 bg-navy-800 py-2 pl-3 pr-8 text-sm text-cream focus:border-gold-400/50 focus:outline-none"
                >
                  <option
                    value="Most Listings"
                    className="bg-navy-900"
                  >
                    Most Listings
                  </option>

                  <option
                    value="Alphabetical"
                    className="bg-navy-900"
                  >
                    Alphabetical
                  </option>

                  <option
                    value="Newest"
                    className="bg-navy-900"
                  >
                    Newest
                  </option>
                </select>

                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="rounded-3xl border border-white/10 bg-navy-800/50 p-5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-14 w-14 animate-pulse rounded-2xl bg-white/10" />

                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-3/4 animate-pulse rounded bg-white/10" />
                        <div className="h-3 w-1/2 animate-pulse rounded bg-white/10" />
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/5 pt-4">
                      <div className="h-10 animate-pulse rounded bg-white/10" />
                      <div className="h-10 animate-pulse rounded bg-white/10" />
                    </div>
                  </div>
                ),
              )}
            </div>
          ) : currentAgencies.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {currentAgencies.map(
                (agency, index) => (
                  <AgencyCard
                    key={agency.id}
                    agency={agency}
                    index={index}
                  />
                ),
              )}
            </div>
          ) : (
            <EmptyState
              title="No agencies found"
              description="We couldn't find any active agencies matching your current search and filters."
              actionLabel="Clear Filters"
              onAction={clearFilters}
            />
          )}

          {!isLoading &&
            totalPages > 1 && (
              <PropertyPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
        </Container>
      </Section>
    </PageLayout>
  );
}
import { useEffect, useState } from 'react';
import {
  Search,
  MapPin,
  Home,
  Wallet,
  ChevronDown,
  ArrowRight,
  Star,
} from 'lucide-react';

import type { ReactNode } from 'react';

import { GoldButton, GhostButton } from '../ui/ui';
import { locations, budgets } from '../../data/uiData';
import { PROPERTY_TYPES } from '../../constants/propertyOptions';
import { Section, Container } from '../layout';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useRecentSearches } from '../../hooks/useRecentSearches';
import { marketplaceApi } from '../../api/marketplace.api';

// Use the canonical Luxora property categories everywhere in the live search UI.
// "Any Type" remains the search default and is not part of the backend category list.
const propertyTypeOptions = [
  'Any Type',
  ...PROPERTY_TYPES
    .filter((option) => option.value)
    .map((option) => option.label),
];

interface MarketplaceSummary {
  publishedListings: number;
  publishedPropertyValue: number;
  activeAgents: number;
  activeUsers: number;
}

export default function Hero() {
  const navigate = useNavigate();
  const {
    recentSearches,
    addSearch,
  } = useRecentSearches();

  const [
    marketplaceSummary,
    setMarketplaceSummary,
  ] = useState<MarketplaceSummary | null>(null);

  const [
    isHeroDataLoading,
    setIsHeroDataLoading,
  ] = useState(true);

  const getInitialState = (
    key: string,
    fallback: string,
  ) => {
    if (recentSearches.length > 0) {
      const latest = recentSearches[0];

      if (key === 'listingType') {
        return latest.listingType;
      }

      if (key === 'propertyType') {
        return latest.propertyType;
      }

      if (key === 'location') {
        return latest.location;
      }

      if (key === 'budget') {
        return latest.budget;
      }
    }

    return fallback;
  };

  // Load real marketplace figures used by the homepage Hero.
  useEffect(() => {
    let mounted = true;

    const loadMarketplaceSummary = async () => {
      try {
        setIsHeroDataLoading(true);

        const response =
          await marketplaceApi.getPublicMarketplaceSummary();

        if (!mounted) return;

        const summary =
          response?.summary ??
          response?.data?.summary ??
          null;

        if (summary) {
          setMarketplaceSummary({
            publishedListings:
              Number(
                summary.publishedListings,
              ) || 0,

            publishedPropertyValue:
              Number(
                summary.publishedPropertyValue,
              ) || 0,

            activeAgents:
              Number(
                summary.activeAgents,
              ) || 0,

            activeUsers:
              Number(
                summary.activeUsers,
              ) || 0,
          });
        } else {
          setMarketplaceSummary(null);
        }
      } catch (error) {
        console.error(
          'Failed to load homepage marketplace summary:',
          error,
        );

        if (!mounted) return;

        setMarketplaceSummary(null);
      } finally {
        if (mounted) {
          setIsHeroDataLoading(false);
        }
      }
    };

    loadMarketplaceSummary();

    return () => {
      mounted = false;
    };
  }, []);

  // Local state initialized from localStorage.
  const [
    listingType,
    setListingType,
  ] = useState(() =>
    getInitialState(
      'listingType',
      'buy',
    ),
  );

  const [
    type,
    setType,
  ] = useState(() =>
    getInitialState(
      'propertyType',
      'Any Type',
    ),
  );

  const [
    location,
    setLocation,
  ] = useState(() =>
    getInitialState(
      'location',
      'Any Location',
    ),
  );

  const [
    budget,
    setBudget,
  ] = useState(() =>
    getInitialState(
      'budget',
      'Any Budget',
    ),
  );

  const handleSearch = () => {
    // Store in global recent searches.
    addSearch({
      keyword: '',
      location,
      propertyType: type,
      listingType,
      budget,
    });

    // Build URLSearchParams using parameter names from usePropertySearch.
    const params = new URLSearchParams();

    if (listingType) {
      params.append(
        'listingType',
        listingType,
      );
    }

    if (
      type &&
      type !== 'Any Type'
    ) {
      params.append(
        'propertyType',
        type,
      );
    }

    if (
      location &&
      location !== 'Any Location'
    ) {
      params.append(
        'location',
        location,
      );
    }

    if (
      budget &&
      budget !== 'Any Budget'
    ) {
      params.append(
        'budget',
        budget,
      );
    }

    navigate(
      `${ROUTES.PROPERTIES}?${params.toString()}`,
    );
  };

  const handlePopularArea = (
    area: string,
  ) => {
    const params =
      new URLSearchParams();

    params.append(
      'location',
      area,
    );

    navigate(
      `${ROUTES.PROPERTIES}?${params.toString()}`,
    );
  };

  const formatHeroCurrency = (
    value: number,
  ) => {
    if (
      !Number.isFinite(value) ||
      value <= 0
    ) {
      return '₦0';
    }

    if (
      value >=
      1_000_000_000
    ) {
      return `₦${(
        value / 1_000_000_000
      ).toFixed(1)}B`;
    }

    if (
      value >=
      1_000_000
    ) {
      return `₦${(
        value / 1_000_000
      ).toFixed(1)}M`;
    }

    if (
      value >=
      1_000
    ) {
      return `₦${Math.round(
        value / 1_000,
      )}K`;
    }

    return `₦${value.toLocaleString(
      'en-NG',
    )}`;
  };

  const listingTabs = [
    'buy',
    'rent',
    'lease',
  ];

  return (
    <Section
      className="relative min-h-screen overflow-hidden"
      noPadding
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/302769/pexels-photo-302769.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Luxury property"
          fetchPriority="high"
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-navy-900/85 via-navy-900/70 to-navy-900" />

        <div className="absolute inset-0 bg-gradient-to-r from-navy-900/80 via-transparent to-transparent" />
      </div>

      {/* Floating accent orbs */}
      <div className="absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-gold-400/10 blur-[120px]" />

      <div className="absolute -right-32 top-1/2 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px]" />

      {/* Content */}
      <Container className="relative z-10 flex flex-col items-center pt-32 pb-20 md:pt-40 md:pb-28">
        {/* Trust pill */}
        <div className="animate-fade-in mb-6 inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold-200 backdrop-blur-md">
          <Star className="h-3.5 w-3.5 fill-gold-400 text-gold-400" />

          Nigeria's Most Trusted Property Ecosystem
        </div>

        {/* Headline */}
        <h1 className="animate-fade-up text-center font-heading text-4xl font-extrabold leading-[1.1] tracking-tight text-cream text-balance sm:text-5xl md:text-6xl lg:text-7xl">
          Find Properties You Can
          <br />
          <span className="gold-text">
            Trust And Afford
          </span>
        </h1>

        {/* Subheadline */}
        <p
          className="animate-fade-up mt-6 max-w-2xl text-center text-base leading-relaxed text-ink/80 sm:text-lg md:text-xl"
          style={{
            animationDelay: '120ms',
          }}
        >
          Verified properties, expert agents, flexible payment plans, and
          complete property services — all in one premium platform.
        </p>

        {/* CTA buttons */}
        <div
          className="animate-fade-up mt-8 flex flex-col items-center gap-3 sm:flex-row"
          style={{
            animationDelay: '240ms',
          }}
        >
          <GoldButton
            size="lg"
            onClick={() =>
              navigate(
                ROUTES.PROPERTIES,
              )
            }
          >
            Browse Properties
            <ArrowRight className="h-4 w-4" />
          </GoldButton>

          <GhostButton
            size="lg"
            onClick={() =>
              navigate(
                ROUTES.REGISTER,
              )
            }
          >
            List Your Property
          </GhostButton>
        </div>

        {/* Search bar */}
        <div
          className="animate-fade-up mt-12 w-full max-w-4xl"
          style={{
            animationDelay: '360ms',
          }}
        >
          {/* Listing Tabs */}
          <div
            className="mb-4 flex items-center justify-center gap-2 sm:gap-4"
            role="tablist"
            aria-label="Listing Type"
          >
            {listingTabs.map(
              (tab) => (
                <button
                  key={tab}
                  role="tab"
                  aria-selected={
                    listingType === tab
                  }
                  onClick={() =>
                    setListingType(
                      tab,
                    )
                  }
                  className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                    listingType === tab
                      ? 'border border-gold-400/60 bg-gold-400/10 text-gold-300'
                      : 'text-cream hover:bg-white/5'
                  }`}
                  aria-label={`Select ${tab} listing type`}
                >
                  {tab
                    .charAt(0)
                    .toUpperCase() +
                    tab.slice(1)}
                </button>
              ),
            )}
          </div>

          <div className="glass rounded-2xl p-2 shadow-lux transition-shadow duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] focus-within:shadow-[0_0_20px_rgba(212,175,55,0.2)] focus-within:ring-1 focus-within:ring-gold-400/50 md:rounded-full">
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <SearchField
                icon={
                  <Home
                    className="h-4 w-4"
                    aria-hidden="true"
                  />
                }
                label="Property Type"
                value={type}
                options={
                  propertyTypeOptions
                }
                onChange={setType}
                ariaLabel="Select property type"
              />

              <Divider />

              <SearchField
                icon={
                  <MapPin
                    className="h-4 w-4"
                    aria-hidden="true"
                  />
                }
                label="Location"
                value={location}
                options={locations}
                onChange={setLocation}
                ariaLabel="Select location"
              />

              <Divider />

              <SearchField
                icon={
                  <Wallet
                    className="h-4 w-4"
                    aria-hidden="true"
                  />
                }
                label="Budget"
                value={budget}
                options={budgets}
                onChange={setBudget}
                ariaLabel="Select budget"
              />

              <div className="p-1">
                <GoldButton
                  size="md"
                  className="w-full shadow-none transition-transform hover:scale-105 active:scale-95 focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 focus:ring-offset-navy-900 md:w-auto"
                  onClick={
                    handleSearch
                  }
                  aria-label="Search properties"
                >
                  <Search
                    className="h-4 w-4"
                    aria-hidden="true"
                  />

                  Search
                </GoldButton>
              </div>
            </div>
          </div>

          {/* Popular Areas */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="mr-2 text-sm font-medium text-ink/70">
              Popular Areas:
            </span>

            {[
              'Lekki',
              'Eko Atlantic',
              'Ikoyi',
              'Abuja',
            ].map(
              (area) => (
                <button
                  key={area}
                  onClick={() =>
                    handlePopularArea(
                      area,
                    )
                  }
                  className="rounded-full border border-white/10 bg-navy-800/50 px-4 py-1.5 text-xs font-medium text-cream transition-colors hover:border-gold-400/50 hover:bg-white/5"
                  aria-label={`Search in ${area}`}
                >
                  {area}
                </button>
              ),
            )}
          </div>
        </div>

        {/* Real marketplace stats */}
        <div
          className="animate-fade-up mt-14 grid w-full max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4"
          style={{
            animationDelay: '480ms',
          }}
        >
          {isHeroDataLoading ? (
            Array.from({
              length: 4,
            }).map(
              (_, index) => (
                <div
                  key={index}
                  className="text-center"
                >
                  <div className="mx-auto h-9 w-24 animate-pulse rounded bg-white/10 sm:h-10 sm:w-28" />

                  <div className="mx-auto mt-2 h-3 w-20 animate-pulse rounded bg-white/10" />
                </div>
              ),
            )
          ) : (
            [
              {
                label:
                  'Published Listings',
                formatted:
                  (
                    marketplaceSummary?.publishedListings ??
                    0
                  ).toLocaleString(
                    'en-NG',
                  ),
              },
              {
                label:
                  'Published Property Value',
                formatted:
                  formatHeroCurrency(
                    marketplaceSummary?.publishedPropertyValue ??
                      0,
                  ),
              },
              {
                label:
                  'Active Agents',
                formatted:
                  (
                    marketplaceSummary?.activeAgents ??
                    0
                  ).toLocaleString(
                    'en-NG',
                  ),
              },
              {
                label:
                  'Active Users',
                formatted:
                  (
                    marketplaceSummary?.activeUsers ??
                    0
                  ).toLocaleString(
                    'en-NG',
                  ),
              },
            ].map(
              (stat) => (
                <div
                  key={stat.label}
                  className="text-center"
                >
                  <div className="font-heading text-2xl font-bold text-cream sm:text-3xl">
                    {stat.formatted}
                  </div>

                  <div className="mt-1 text-xs font-medium uppercase tracking-wider text-ink/60">
                    {stat.label}
                  </div>
                </div>
              ),
            )
          )}
        </div>
      </Container>
    </Section>
  );
}

function Divider() {
  return (
    <div
      className="hidden h-10 w-px bg-white/10 md:block"
      aria-hidden="true"
    />
  );
}

function SearchField({
  icon,
  label,
  value,
  options,
  onChange,
  ariaLabel,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  ariaLabel?: string;
}) {
  const [open, setOpen] =
    useState(false);

  return (
    <div className="group relative flex-1 px-3 py-2">
      <div className="flex items-center gap-2.5">
        <span
          className="text-gold-400"
          aria-hidden="true"
        >
          {icon}
        </span>

        <div className="flex-1">
          <div
            className="text-[10px] font-semibold uppercase tracking-wider text-ink/50 transition-colors group-hover:text-ink/70 group-focus-within:text-gold-400/70"
            id={`label-${label.replace(
              /\s+/g,
              '-',
            )}`}
          >
            {label}
          </div>

          <button
            onClick={() =>
              setOpen(!open)
            }
            className="flex w-full items-center justify-between gap-1 rounded text-left text-sm font-medium text-cream focus:text-gold-300 focus:outline-none"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-labelledby={`label-${label.replace(
              /\s+/g,
              '-',
            )}`}
            aria-label={ariaLabel}
          >
            <span className="truncate">
              {value}
            </span>

            <ChevronDown
              className={`h-3.5 w-3.5 flex-shrink-0 text-ink/50 transition-transform duration-200 ${
                open
                  ? 'rotate-180 text-gold-400'
                  : ''
              }`}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() =>
              setOpen(false)
            }
            aria-hidden="true"
          />

          <div
            className="absolute left-0 right-0 top-full z-20 mt-2 max-h-60 overflow-y-auto overflow-x-hidden rounded-xl border border-white/10 bg-navy-800 shadow-2xl animate-fade-in-up"
            role="listbox"
            aria-labelledby={`label-${label.replace(
              /\s+/g,
              '-',
            )}`}
          >
            {options.map(
              (opt) => (
                <button
                  key={opt}
                  role="option"
                  aria-selected={
                    opt === value
                  }
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  className={`block w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-white/5 focus:bg-white/5 focus:outline-none ${
                    opt === value
                      ? 'text-gold-300'
                      : 'text-ink/80'
                  }`}
                >
                  {opt}
                </button>
              ),
            )}
          </div>
        </>
      )}
    </div>
  );
}
import {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin,
  ShieldCheck,
  Phone,
  Mail,
  Building2,
  TrendingUp,
  Users,
  Award,
  Briefcase,
  MessageCircle,
  CheckCircle2,
  Navigation,
  ArrowUpRight,
  ArrowDownRight,
  Crown,
  LayoutGrid,
  Calendar,
  ExternalLink,
} from 'lucide-react';

import {
  PageLayout,
  Container,
  Section,
  Breadcrumb,
} from '../../components/layout';

import {
  GoldButton,
  GhostButton,
  Reveal,
} from '../../components/ui/ui';

import { PropertyGrid } from '../../components/property/PropertyGrid';
import { PropertyPagination } from '../../components/property/PropertyPagination';
import { EmptyState } from '../../components/layout/EmptyState';

import NotFoundPage from '../NotFound/NotFoundPage';

import { agencyApi } from '../../api/agency.api';
import { agentApi } from '../../api/agent.api';
import { propertyApi } from '../../api/property.api';
import {
  mapApiPropertiesToProperties,
} from '../../api/property.mapper';

import { ROUTES } from '../../constants/routes';

import type {
  PublicAgency,
  Property,
} from '../../types';

interface PublicAgencyAgent {
  id: string;
  slug: string;
  name: string;
  email: string;
  phone?: string | null;
  avatar?: string | null;
  verified: boolean;
  status: string;
  yearsOfExperience: number;
  level?: string | null;
  department?: string | null;
  branch?: string | null;
  specializations: string[];
  serviceStates: string[];
  neighborhoods: string[];
  coverageRadius?: string | null;
  createdAt: string;
  agency?: {
    id: string;
    name: string;
    status: string;
  } | null;
  listingCount: number;
  activeMarkets: string[];
  propertyTypes: string[];
}

const ITEMS_PER_PAGE = 6;

const formatLargeNum = (
  value: number,
): string => {
  if (!Number.isFinite(value) || value <= 0) {
    return '—';
  }

  if (value >= 1_000_000_000) {
    return `₦${(
      value / 1_000_000_000
    ).toFixed(1)}B`;
  }

  if (value >= 1_000_000) {
    return `₦${(
      value / 1_000_000
    ).toFixed(1)}M`;
  }

  if (value >= 1_000) {
    return `₦${Math.round(
      value,
    ).toLocaleString()}`;
  }

  return `₦${value.toLocaleString()}`;
};

const uniqueCaseInsensitive = (
  values: string[],
) => {
  const map = new Map<string, string>();

  values.forEach((value) => {
    if (!value) return;

    const cleaned = value.trim();

    if (!cleaned) return;

    const key = cleaned.toLowerCase();

    if (!map.has(key)) {
      map.set(key, cleaned);
    }
  });

  return Array.from(map.values());
};

const getInitials = (name: string) => {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!parts.length) {
    return 'A';
  }

  if (parts.length === 1) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

const normalizePhoneForWhatsApp = (
  phone?: string | null,
) => {
  if (!phone) return '';

  const digits = phone.replace(/\D/g, '');

  if (!digits) {
    return '';
  }

  if (digits.startsWith('0')) {
    return `234${digits.slice(1)}`;
  }

  if (digits.startsWith('234')) {
    return digits;
  }

  return digits;
};

export default function AgencyDetailsPage() {
  const { slug } =
    useParams<{ slug: string }>();

  const navigate = useNavigate();

  const [agency, setAgency] =
    useState<PublicAgency | null>(null);

  const [agents, setAgents] = useState<
    PublicAgencyAgent[]
  >([]);

  const [properties, setProperties] =
    useState<Property[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [hasError, setHasError] =
    useState(false);

  const [currentPage, setCurrentPage] =
    useState(1);

  useEffect(() => {
    let mounted = true;

    const loadAgency = async () => {
      if (!slug) {
        setHasError(true);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setHasError(false);

        const agencyResponse =
          await agencyApi.getPublicAgency(
            slug,
          );

        const resolvedAgency =
          agencyResponse?.agency;

        if (
          !resolvedAgency ||
          !mounted
        ) {
          if (mounted) {
            setHasError(true);
          }

          return;
        }

        setAgency(resolvedAgency);

        const [
          agentsResponse,
          propertiesResponse,
        ] = await Promise.all([
          agentApi.getPublicAgents({
            agencyId:
              resolvedAgency.id,
            limit: 100,
            page: 1,
            sort: 'listings',
          }),

          propertyApi.getProperties({
            agencyId:
              resolvedAgency.id,
            limit: 100,
            page: 1,
            sort: 'newest',
          }),
        ]);

        if (!mounted) return;

        const publicAgents =
          Array.isArray(
            agentsResponse?.agents,
          )
            ? agentsResponse.agents
            : [];

        const publicProperties =
          Array.isArray(
            propertiesResponse?.properties,
          )
            ? propertiesResponse.properties
            : [];

        setAgents(
          publicAgents as PublicAgencyAgent[],
        );

        setProperties(
          mapApiPropertiesToProperties(
            publicProperties,
          ),
        );
      } catch (error) {
        console.error(
          'Failed to load public Agency profile:',
          error,
        );

        if (!mounted) return;

        setHasError(true);
        setAgency(null);
        setAgents([]);
        setProperties([]);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadAgency();

    return () => {
      mounted = false;
    };
  }, [slug]);

  const serviceAreas = useMemo(() => {
    const fromAgency =
      agency?.serviceAreas || [];

    const fromProperties =
      properties.flatMap((property) => [
        property.city,
        property.state,
      ]);

    const fromAgents =
      agents.flatMap((agent) => [
        ...(agent.serviceStates || []),
        ...(agent.neighborhoods || []),
      ]);

    return uniqueCaseInsensitive([
      ...fromAgency,
      ...fromProperties,
      ...fromAgents,
    ]);
  }, [
    agency,
    properties,
    agents,
  ]);

  const propertyCategories =
    useMemo(() => {
      return uniqueCaseInsensitive(
        properties.map(
          (property) =>
            String(property.type || ''),
        ),
      );
    }, [properties]);

  const propertyStats =
    useMemo(() => {
      const priceProperties =
        properties.filter(
          (property) =>
            Number.isFinite(
              property.priceValue,
            ) &&
            property.priceValue > 0,
        );

      const totalListedPrice =
        priceProperties.reduce(
          (sum, property) =>
            sum + property.priceValue,
          0,
        );

      const averageListedPrice =
        priceProperties.length > 0
          ? totalListedPrice /
            priceProperties.length
          : 0;

      const sortedByPrice =
        [...priceProperties].sort(
          (a, b) =>
            b.priceValue -
            a.priceValue,
        );

      const highestValueProperty =
        sortedByPrice[0] || null;

      const lowestValueProperty =
        sortedByPrice[
          sortedByPrice.length - 1
        ] || null;

      const sortedByDate =
        [...properties].sort(
          (a, b) => {
            const dateA = a.createdAt
              ? new Date(
                  a.createdAt,
                ).getTime()
              : 0;

            const dateB = b.createdAt
              ? new Date(
                  b.createdAt,
                ).getTime()
              : 0;

            return dateB - dateA;
          },
        );

      const newestListing =
        sortedByDate[0] || null;

      const featuredProperties =
        properties.filter(
          (property) =>
            property.featuredLevel ===
              'Premium' ||
            property.featuredLevel ===
              'Exclusive',
        );

      const proListings =
        properties.filter(
          (property) =>
            property.listingTier === 'Pro',
        );

      const marketCounts = new Map<
        string,
        number
      >();

      properties.forEach(
        (property) => {
          const market =
            property.city ||
            property.state ||
            'Unknown';

          const normalized =
            market.trim();

          if (!normalized) return;

          marketCounts.set(
            normalized,
            (marketCounts.get(
              normalized,
            ) || 0) + 1,
          );
        },
      );

      const topMarkets =
        Array.from(
          marketCounts.entries(),
        )
          .sort(
            (a, b) =>
              b[1] - a[1],
          )
          .slice(0, 6)
          .map(
            ([location, count]) => ({
              location,
              count,
            }),
          );

      const typeCounts = new Map<
        string,
        number
      >();

      properties.forEach(
        (property) => {
          const type = String(
            property.type || 'Other',
          ).trim();

          typeCounts.set(
            type,
            (typeCounts.get(type) || 0) +
              1,
          );
        },
      );

      const propertyMix =
        Array.from(
          typeCounts.entries(),
        )
          .sort(
            (a, b) =>
              b[1] - a[1],
          )
          .map(
            ([type, count]) => ({
              type,
              count,
            }),
          );

      let residential = 0;
      let commercial = 0;
      let land = 0;
      let shortLet = 0;

      properties.forEach(
        (property) => {
          const type =
            String(
              property.type || '',
            ).toLowerCase();

          if (
            type.includes('land')
          ) {
            land += 1;
          } else if (
            type.includes(
              'office',
            ) ||
            type.includes(
              'warehouse',
            )
          ) {
            commercial += 1;
          } else if (
            type.includes(
              'short let',
            )
          ) {
            shortLet += 1;
          } else {
            residential += 1;
          }
        },
      );

      const total =
        properties.length || 1;

      return {
        totalListedPrice,
        averageListedPrice,
        highestPrice:
          highestValueProperty?.priceValue ||
          0,
        lowestPrice:
          lowestValueProperty?.priceValue ||
          0,
        highestValueProperty,
        newestListing,
        featuredProperties,
        proListings,
        topMarkets,
        propertyMix,
        residentialPercent:
          Math.round(
            (residential / total) *
              100,
          ),
        commercialPercent:
          Math.round(
            (commercial / total) *
              100,
          ),
        landPercent:
          Math.round(
            (land / total) *
              100,
          ),
        shortLetPercent:
          Math.round(
            (shortLet / total) *
              100,
          ),
      };
    }, [properties]);

  useEffect(() => {
    setCurrentPage(1);
  }, [properties.length]);

  const latestProperties =
    useMemo(() => {
      return [...properties].sort(
        (a, b) => {
          const dateA = a.createdAt
            ? new Date(
                a.createdAt,
              ).getTime()
            : 0;

          const dateB = b.createdAt
            ? new Date(
                b.createdAt,
              ).getTime()
            : 0;

          return dateB - dateA;
        },
      );
    }, [properties]);

  const totalPages = Math.ceil(
    latestProperties.length /
      ITEMS_PER_PAGE,
  );

  const paginatedProperties =
    latestProperties.slice(
      (currentPage - 1) *
        ITEMS_PER_PAGE,
      currentPage *
        ITEMS_PER_PAGE,
    );

  if (isLoading) {
    return (
      <PageLayout footerVariant="compact">
        <div className="min-h-screen bg-navy-900 pt-32">
          <Container>
            <div className="space-y-10">
              <div className="h-5 w-48 animate-pulse rounded bg-white/10" />

              <div className="flex flex-col gap-6 md:flex-row md:items-end">
                <div className="h-32 w-32 animate-pulse rounded-3xl bg-white/10" />

                <div className="flex-1 space-y-4">
                  <div className="h-10 w-2/3 animate-pulse rounded bg-white/10" />
                  <div className="h-5 w-1/2 animate-pulse rounded bg-white/10" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({
                  length: 4,
                }).map((_, index) => (
                  <div
                    key={index}
                    className="h-24 animate-pulse rounded-2xl bg-white/5"
                  />
                ))}
              </div>
            </div>
          </Container>
        </div>
      </PageLayout>
    );
  }

  if (
    hasError ||
    !agency
  ) {
    return <NotFoundPage />;
  }

  const agencyInitials =
    getInitials(
      agency.name,
    );

  const whatsappNumber =
    normalizePhoneForWhatsApp(
      agency.phone,
    );

  const featuredProperties =
    propertyStats.featuredProperties;

  const agencyStatus =
    agency.status === 'Active'
      ? 'Active Agency'
      : agency.status;

  return (
    <PageLayout footerVariant="compact">
      {/* ========================================
          HERO
      ======================================== */}
      <div className="relative overflow-hidden border-b border-white/5 bg-navy-900 pb-12 pt-32">
        <div className="absolute inset-x-0 top-0 h-80 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2000"
            alt="Luxury real estate"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-navy-900/55 via-navy-900/80 to-navy-900" />
        </div>

        <Container className="relative z-10 pt-10">
          <Breadcrumb
            items={[
              {
                label: 'Home',
                href: ROUTES.HOME,
              },
              {
                label: 'Agencies',
                href: ROUTES.AGENCIES,
              },
              {
                label: agency.name,
              },
            ]}
          />

          <div className="mt-8 flex flex-col items-start gap-8 md:flex-row md:items-end">
            <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-gold-500/30 to-gold-400/5 text-4xl font-bold text-gold-300 shadow-2xl ring-4 ring-navy-900">
              {agencyInitials}
            </div>

            <div className="flex-1 pb-2">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <h1 className="font-heading text-4xl font-bold tracking-tight text-cream sm:text-5xl">
                  {agency.name}
                </h1>

                <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {agencyStatus}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-ink/60">
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gold-400" />
                  {agency.agentCount}{' '}
                  Active Agents
                </span>

                <span className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gold-400" />
                  {agency.listingCount}{' '}
                  Published Listings
                </span>

                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gold-400" />
                  {serviceAreas.length ||
                    0}{' '}
                  Service Areas
                </span>
              </div>
            </div>

            <div className="flex w-full flex-wrap items-center gap-3 pb-2 md:w-auto">
              {agency.phone && (
                <GoldButton
                  size="md"
                  className="w-full justify-center gap-2 sm:w-auto"
                  onClick={() =>
                    (window.location.href = `tel:${agency.phone}`)
                  }
                >
                  <Phone className="h-4 w-4" />
                  Call Agency
                </GoldButton>
              )}

              {agency.email && (
                <GhostButton
                  className="w-full justify-center gap-2 sm:w-auto"
                  onClick={() =>
                    (window.location.href = `mailto:${agency.email}`)
                  }
                >
                  <Mail className="h-4 w-4" />
                  Email Agency
                </GhostButton>
              )}

              {whatsappNumber && (
                <GhostButton
                  className="w-full justify-center gap-2 sm:w-auto"
                  onClick={() =>
                    window.open(
                      `https://wa.me/${whatsappNumber}`,
                      '_blank',
                      'noopener,noreferrer',
                    )
                  }
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </GhostButton>
              )}
            </div>
          </div>
        </Container>
      </div>

      <Section className="relative bg-navy-900 py-12 md:py-20">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* ======================================
                LEFT COLUMN
            ====================================== */}
            <div className="space-y-10 lg:col-span-1">
              {/* Real marketplace signals */}
              <Reveal>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-4">
                    <ShieldCheck className="mb-2 h-6 w-6 text-emerald-400" />
                    <span className="text-center text-sm font-bold text-cream">
                      {agencyStatus}
                    </span>
                  </div>

                  <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-4">
                    <Building2 className="mb-2 h-6 w-6 text-gold-400" />
                    <span className="text-center text-sm font-bold text-cream">
                      {agency.listingCount}
                    </span>
                    <span className="mt-1 text-[10px] uppercase tracking-wider text-ink/40">
                      Published Listings
                    </span>
                  </div>

                  <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-4">
                    <Award className="mb-2 h-6 w-6 text-blue-400" />
                    <span className="text-center text-sm font-bold text-cream">
                      {featuredProperties.length}
                    </span>
                    <span className="mt-1 text-[10px] uppercase tracking-wider text-ink/40">
                      Featured
                    </span>
                  </div>

                  <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-4">
                    <Users className="mb-2 h-6 w-6 text-rose-400" />
                    <span className="text-center text-sm font-bold text-cream">
                      {agency.agentCount}
                    </span>
                    <span className="mt-1 text-[10px] uppercase tracking-wider text-ink/40">
                      Active Agents
                    </span>
                  </div>
                </div>
              </Reveal>

              {/* Company Overview */}
              <Reveal delay={100}>
                <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-8">
                  <h3 className="mb-4 font-heading text-xl font-bold text-cream">
                    Company Overview
                  </h3>

                  <p className="mb-6 text-sm leading-relaxed text-ink/70">
                    {agency.name} is an active Agency on
                    the Luxora marketplace with{' '}
                    {agency.listingCount}{' '}
                    published listings and{' '}
                    {agency.agentCount}{' '}
                    active agents. Its public marketplace
                    activity currently spans{' '}
                    {serviceAreas.length}{' '}
                    service areas.
                  </p>

                  <div className="space-y-4 border-t border-white/10 pt-4">
                    <div className="flex items-center justify-between gap-4 text-sm">
                      <span className="text-ink/50">
                        Contact Person
                      </span>

                      <span className="text-right font-medium text-cream">
                        {agency.contactPerson ||
                          'Not provided'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 text-sm">
                      <span className="text-ink/50">
                        Published Listings
                      </span>

                      <span className="font-medium text-cream">
                        {agency.listingCount}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 text-sm">
                      <span className="text-ink/50">
                        Average Listed Price
                      </span>

                      <span className="font-medium text-cream">
                        {formatLargeNum(
                          propertyStats.averageListedPrice,
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Coverage Areas */}
                  <div className="mt-6 border-t border-white/10 pt-6">
                    <h4 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cream">
                      <Navigation className="h-3.5 w-3.5 text-gold-400" />
                      Coverage Areas
                    </h4>

                    {serviceAreas.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {serviceAreas.map(
                          (area) => (
                            <span
                              key={area}
                              className="inline-flex items-center rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-ink/70"
                            >
                              {area}
                            </span>
                          ),
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-ink/50">
                        No service-area information is available yet.
                      </p>
                    )}
                  </div>

                  {/* Property Categories */}
                  <div className="mt-6 border-t border-white/10 pt-6">
                    <h4 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cream">
                      <Building2 className="h-3.5 w-3.5 text-gold-400" />
                      Property Categories
                    </h4>

                    {propertyCategories.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {propertyCategories.map(
                          (category) => (
                            <span
                              key={category}
                              className="inline-flex items-center rounded-lg border border-gold-400/20 bg-gold-400/5 px-3 py-1.5 text-xs text-gold-300"
                            >
                              {category}
                            </span>
                          ),
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-ink/50">
                        No published property categories are available yet.
                      </p>
                    )}
                  </div>
                </div>
              </Reveal>

              {/* Agency Strengths */}
              {propertyStats.propertyMix
                .length > 0 && (
                <Reveal delay={150}>
                  <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-8">
                    <h3 className="mb-4 font-heading text-xl font-bold text-cream">
                      Agency Strengths
                    </h3>

                    <div className="space-y-4">
                      {propertyStats.propertyMix
                        .slice(0, 8)
                        .map(
                          (mix) => (
                            <div
                              key={mix.type}
                              className="flex items-center justify-between gap-4"
                            >
                              <span className="text-sm text-ink/70">
                                {mix.type}
                              </span>

                              <div className="flex items-center gap-3">
                                <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/5">
                                  <div
                                    className="h-full rounded-full bg-gradient-to-r from-gold-400 to-gold-500"
                                    style={{
                                      width: `${Math.max(
                                        10,
                                        (mix.count /
                                          Math.max(
                                            1,
                                            properties.length,
                                          )) *
                                          100,
                                      )}%`,
                                    }}
                                  />
                                </div>

                                <span className="w-6 text-right text-xs font-medium text-cream">
                                  {mix.count}
                                </span>
                              </div>
                            </div>
                          ),
                        )}
                    </div>
                  </div>
                </Reveal>
              )}

              {/* Top Markets */}
              {propertyStats.topMarkets
                .length > 0 && (
                <Reveal delay={200}>
                  <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-8">
                    <h3 className="mb-4 font-heading text-xl font-bold text-cream">
                      Top Markets
                    </h3>

                    <div className="grid grid-cols-2 gap-3">
                      {propertyStats.topMarkets.map(
                        (market) => (
                          <div
                            key={market.location}
                            className="flex flex-col rounded-xl border border-white/10 bg-white/5 p-3"
                          >
                            <span className="truncate text-sm font-bold text-cream">
                              {market.location}
                            </span>

                            <span className="mt-1 text-xs text-ink/50">
                              {market.count}{' '}
                              Listings
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </Reveal>
              )}

              {/* Business Information */}
              <Reveal delay={250}>
                <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-8">
                  <h3 className="mb-4 font-heading text-xl font-bold text-cream">
                    Business Information
                  </h3>

                  <div className="space-y-4 text-sm">
                    <div className="flex items-start gap-3 text-ink/70">
                      <Briefcase className="mt-0.5 h-4 w-4 shrink-0 text-white/40" />

                      <div>
                        <div className="mb-1 text-cream">
                          Contact Person
                        </div>

                        <div>
                          {agency.contactPerson ||
                            'Not provided'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-ink/70">
                      <Mail className="h-4 w-4 shrink-0 text-white/40" />

                      {agency.email ? (
                        <a
                          href={`mailto:${agency.email}`}
                          className="break-all transition-colors hover:text-gold-400"
                        >
                          {agency.email}
                        </a>
                      ) : (
                        <span>
                          Business email not provided
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-ink/70">
                      <Phone className="h-4 w-4 shrink-0 text-white/40" />

                      {agency.phone ? (
                        <a
                          href={`tel:${agency.phone}`}
                          className="transition-colors hover:text-gold-400"
                        >
                          {agency.phone}
                        </a>
                      ) : (
                        <span>
                          Business phone not provided
                        </span>
                      )}
                    </div>

                    <div className="flex items-start gap-3 text-ink/70">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white/40" />

                      <div>
                        <div className="mb-1 text-cream">
                          Service Coverage
                        </div>

                        <div className="leading-relaxed">
                          {serviceAreas.join(
                            ', ',
                          ) ||
                            'Not provided'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-ink/70">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />

                      <span>
                        Marketplace status:{' '}
                        <span className="font-medium text-cream">
                          {agency.status}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Agency Statistics */}
              <Reveal delay={300}>
                <div>
                  <h3 className="mb-6 font-heading text-xl font-bold text-cream">
                    Agency Statistics
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                      <Building2 className="mb-3 h-5 w-5 text-gold-400" />

                      <div className="font-heading text-2xl font-bold text-cream">
                        {agency.listingCount}
                      </div>

                      <div className="mt-1 text-xs uppercase tracking-wider text-ink/50">
                        Published Listings
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                      <Users className="mb-3 h-5 w-5 text-blue-400" />

                      <div className="font-heading text-2xl font-bold text-cream">
                        {agency.agentCount}
                      </div>

                      <div className="mt-1 text-xs uppercase tracking-wider text-ink/50">
                        Active Agents
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                      <TrendingUp className="mb-3 h-5 w-5 text-emerald-400" />

                      <div className="font-heading text-2xl font-bold text-cream">
                        {formatLargeNum(
                          propertyStats.totalListedPrice,
                        )}
                      </div>

                      <div className="mt-1 text-xs uppercase tracking-wider text-ink/50">
                        Combined Listed Prices
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                      <ArrowUpRight className="mb-3 h-5 w-5 text-gold-400" />

                      <div className="font-heading text-2xl font-bold text-cream">
                        {formatLargeNum(
                          propertyStats.averageListedPrice,
                        )}
                      </div>

                      <div className="mt-1 text-xs uppercase tracking-wider text-ink/50">
                        Average Listed Price
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                      <MapPin className="mb-3 h-5 w-5 text-rose-400" />

                      <div className="font-heading text-2xl font-bold text-cream">
                        {serviceAreas.length}
                      </div>

                      <div className="mt-1 text-xs uppercase tracking-wider text-ink/50">
                        Service Areas
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                      <Crown className="mb-3 h-5 w-5 text-gold-400" />

                      <div className="font-heading text-2xl font-bold text-cream">
                        {propertyStats.proListings.length}
                      </div>

                      <div className="mt-1 text-xs uppercase tracking-wider text-ink/50">
                        Pro Listings
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Our Team */}
              <Reveal delay={400}>
                <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-8">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h3 className="font-heading text-xl font-bold text-cream">
                        Our Team
                      </h3>

                      <p className="mt-1 text-sm text-ink/50">
                        Active Agents currently
                        associated with this Agency.
                      </p>
                    </div>

                    <Award className="h-5 w-5 text-gold-400" />
                  </div>

                  {agents.length > 0 ? (
                    <div className="flex flex-col gap-4">
                      {agents.map(
                        (agent) => (
                          <button
                            key={agent.id}
                            type="button"
                            onClick={() =>
                              navigate(
                                ROUTES.AGENT_DETAILS.replace(
                                  ':slug',
                                  agent.slug,
                                ),
                              )
                            }
                            className="group flex w-full items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-4 text-left transition-all hover:border-gold-400/20 hover:bg-white/[0.06]"
                          >
                            {agent.avatar ? (
                              <img
                                src={agent.avatar}
                                alt={agent.name}
                                className="h-14 w-14 shrink-0 rounded-full object-cover"
                              />
                            ) : (
                              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gold-400/10 text-sm font-bold text-gold-300 ring-1 ring-gold-400/20">
                                {getInitials(
                                  agent.name,
                                )}
                              </div>
                            )}

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="truncate text-sm font-semibold text-cream">
                                  {agent.name}
                                </h4>

                                {agent.verified && (
                                  <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" />
                                )}
                              </div>

                              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink/50">
                                {agent.level && (
                                  <span>
                                    {agent.level}
                                  </span>
                                )}

                                {agent.yearsOfExperience >
                                  0 && (
                                  <span>
                                    {
                                      agent.yearsOfExperience
                                    }{' '}
                                    yrs experience
                                  </span>
                                )}

                                <span>
                                  {
                                    agent.listingCount
                                  }{' '}
                                  published listings
                                </span>
                              </div>

                              {agent.specializations
                                ?.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {agent.specializations
                                    .slice(0, 3)
                                    .map(
                                      (
                                        specialization,
                                      ) => (
                                        <span
                                          key={
                                            specialization
                                          }
                                          className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] text-ink/60"
                                        >
                                          {
                                            specialization
                                          }
                                        </span>
                                      ),
                                    )}
                                </div>
                              )}
                            </div>

                            <ExternalLink className="h-4 w-4 shrink-0 text-ink/30 transition-colors group-hover:text-gold-400" />
                          </button>
                        ),
                      )}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 text-center">
                      <Users className="mx-auto mb-3 h-8 w-8 text-white/10" />

                      <p className="font-medium text-cream">
                        No active agents
                      </p>

                      <p className="mt-1 text-sm text-ink/50">
                        This Agency does not currently have
                        public active Agents to display.
                      </p>
                    </div>
                  )}
                </div>
              </Reveal>

              {/* Reviews */}
              <Reveal delay={500}>
                <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-8">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h3 className="font-heading text-xl font-bold text-cream">
                        Agency Reviews
                      </h3>

                      <p className="mt-1 text-sm text-ink/50">
                        Public review data is not connected to
                        the Agency marketplace yet.
                      </p>
                    </div>

                    <MessageCircle className="h-5 w-5 text-gold-400" />
                  </div>

                  <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 text-center">
                    <MessageCircle className="mx-auto mb-3 h-8 w-8 text-white/10" />

                    <p className="font-medium text-cream">
                      No public reviews available
                    </p>

                    <p className="mt-1 text-sm leading-relaxed text-ink/50">
                      Review and rating records are not part
                      of the current public Agency data source.
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* ======================================
                RIGHT COLUMN
            ====================================== */}
            <div className="space-y-12 lg:col-span-2">
              {/* Portfolio Highlights */}
              {properties.length > 0 && (
                <Reveal delay={50}>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-navy-800/50 p-5">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs uppercase tracking-wider text-ink/50">
                          Highest Value
                        </span>

                        <Crown className="h-4 w-4 text-gold-400" />
                      </div>

                      <div>
                        <div className="truncate text-lg font-bold text-cream">
                          {propertyStats.highestValueProperty
                            ?.title ||
                            'N/A'}
                        </div>

                        <div className="mt-1 text-sm font-medium text-emerald-400">
                          {formatLargeNum(
                            propertyStats.highestPrice,
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-navy-800/50 p-5">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs uppercase tracking-wider text-ink/50">
                          Newest Listing
                        </span>

                        <Calendar className="h-4 w-4 text-blue-400" />
                      </div>

                      <div>
                        <div className="truncate text-lg font-bold text-cream">
                          {propertyStats
                            .newestListing
                            ?.title ||
                            'N/A'}
                        </div>

                        <div className="mt-1 text-sm font-medium text-gold-400">
                          {propertyStats
                            .newestListing
                            ?.price ||
                            'N/A'}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-navy-800/50 p-5">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs uppercase tracking-wider text-ink/50">
                          Featured
                        </span>

                        <Award className="h-4 w-4 text-gold-400" />
                      </div>

                      <div>
                        <div className="text-2xl font-bold text-cream">
                          {
                            featuredProperties.length
                          }
                        </div>

                        <div className="mt-1 text-xs text-ink/50">
                          Premium / Exclusive
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-navy-800/50 p-5">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs uppercase tracking-wider text-ink/50">
                          Pro
                        </span>

                        <ShieldCheck className="h-4 w-4 text-emerald-400" />
                      </div>

                      <div>
                        <div className="text-2xl font-bold text-cream">
                          {
                            propertyStats.proListings.length
                          }
                        </div>

                        <div className="mt-1 text-xs text-ink/50">
                          Pro Listings
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              )}

              {/* Market Intelligence */}
              <Reveal delay={150}>
                <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-8">
                  <h3 className="mb-6 flex items-center gap-2 font-heading text-xl font-bold text-cream">
                    <TrendingUp className="h-5 w-5 text-gold-400" />
                    Marketplace Snapshot
                  </h3>

                  <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
                    <div>
                      <div className="mb-1 text-sm text-ink/50">
                        Average Listed Price
                      </div>

                      <div className="text-xl font-bold text-cream">
                        {formatLargeNum(
                          propertyStats.averageListedPrice,
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="mb-1 flex items-center gap-1 text-sm text-ink/50">
                        <ArrowUpRight className="h-3 w-3 text-emerald-400" />
                        Highest Listed Price
                      </div>

                      <div className="text-xl font-bold text-emerald-400">
                        {formatLargeNum(
                          propertyStats.highestPrice,
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="mb-1 flex items-center gap-1 text-sm text-ink/50">
                        <ArrowDownRight className="h-3 w-3 text-rose-400" />
                        Lowest Listed Price
                      </div>

                      <div className="text-xl font-bold text-rose-400">
                        {formatLargeNum(
                          propertyStats.lowestPrice,
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="mb-1 text-sm text-ink/50">
                        Most Common Type
                      </div>

                      <div className="text-lg font-bold text-cream">
                        {propertyStats
                          .propertyMix[0]
                          ?.type ||
                          'N/A'}
                      </div>
                    </div>

                    <div>
                      <div className="mb-1 text-sm text-ink/50">
                        Most Active Market
                      </div>

                      <div className="text-lg font-bold text-cream">
                        {propertyStats
                          .topMarkets[0]
                          ?.location ||
                          'N/A'}
                      </div>
                    </div>

                    <div>
                      <div className="mb-1 text-sm text-ink/50">
                        Coverage Spread
                      </div>

                      <div className="text-lg font-bold text-cream">
                        {serviceAreas.length}{' '}
                        Areas
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Listing Mix */}
              <Reveal delay={200}>
                <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-8">
                  <h3 className="mb-6 flex items-center gap-2 font-heading text-xl font-bold text-cream">
                    <LayoutGrid className="h-5 w-5 text-emerald-400" />
                    Listing Mix
                  </h3>

                  <div className="space-y-5">
                    {[
                      {
                        label: 'Residential',
                        percent:
                          propertyStats.residentialPercent,
                        color: 'bg-blue-400',
                      },
                      {
                        label: 'Commercial',
                        percent:
                          propertyStats.commercialPercent,
                        color: 'bg-emerald-400',
                      },
                      {
                        label: 'Land',
                        percent:
                          propertyStats.landPercent,
                        color: 'bg-amber-500',
                      },
                      {
                        label: 'Short Let',
                        percent:
                          propertyStats.shortLetPercent,
                        color: 'bg-purple-400',
                      },
                    ].map((item) => (
                      <div
                        key={
                          item.label
                        }
                        className="flex items-center gap-4"
                      >
                        <span className="w-28 shrink-0 text-sm font-medium text-ink/70">
                          {item.label}
                        </span>

                        <div className="flex h-2 flex-1 overflow-hidden rounded-full bg-white/5">
                          <div
                            className={`h-full ${item.color} rounded-full`}
                            style={{
                              width: `${item.percent}%`,
                            }}
                          />
                        </div>

                        <span className="w-12 text-right text-sm font-bold text-cream">
                          {item.percent}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* Featured Collection */}
              {featuredProperties.length >
                0 && (
                <Reveal delay={250}>
                  <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                    <h2 className="font-heading text-2xl font-bold text-cream">
                      Featured Collection
                    </h2>

                    <span className="rounded-full bg-gold-400/10 px-3 py-1 text-sm font-medium text-gold-400">
                      {featuredProperties.length}{' '}
                      Properties
                    </span>
                  </div>

                  <PropertyGrid
                    properties={featuredProperties}
                    gridClassName="grid gap-6 sm:grid-cols-2"
                  />
                </Reveal>
              )}

              {/* Latest Listings */}
              <Reveal delay={300}>
                <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                  <h2 className="font-heading text-2xl font-bold text-cream">
                    Latest Listings
                  </h2>

                  <span className="text-sm font-medium text-ink/50">
                    Showing{' '}
                    {
                      paginatedProperties.length
                    }{' '}
                    of{' '}
                    {
                      latestProperties.length
                    }
                  </span>
                </div>

                {latestProperties.length >
                0 ? (
                  <PropertyGrid
                    properties={
                      paginatedProperties
                    }
                    gridClassName="grid gap-6 sm:grid-cols-2"
                  >
                    {totalPages > 1 && (
                      <PropertyPagination
                        currentPage={
                          currentPage
                        }
                        totalPages={
                          totalPages
                        }
                        onPageChange={
                          setCurrentPage
                        }
                      />
                    )}
                  </PropertyGrid>
                ) : (
                  <div className="rounded-3xl border border-white/10 bg-navy-800/30 px-6 py-12 text-center">
                    <Building2 className="mx-auto mb-4 h-12 w-12 text-white/10" />

                    <p className="font-medium text-cream">
                      No published listings
                    </p>

                    <p className="mt-1 text-sm text-ink/50">
                      This Agency does not currently have
                      published Properties on the marketplace.
                    </p>
                  </div>
                )}
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>
    </PageLayout>
  );
}
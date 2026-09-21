import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  useParams,
  useNavigate,
} from 'react-router-dom';

import {
  ShieldCheck,
  MapPin,
  Mail,
  Building2,
  TrendingUp,
  Handshake,
  CalendarCheck,
  ArrowRight,
  Phone,
  MessageCircle,
  Award,
  Crown,
  LayoutGrid,
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
import NotFoundPage from '../NotFound/NotFoundPage';
import { useSession } from '../../contexts/SessionContext';
import { ROUTES } from '../../constants/routes';
import { agentApi } from '../../api/agent.api';
import { agencyApi } from '../../api/agency.api';
import { propertyApi } from '../../api/property.api';
import {
  mapApiPropertiesToProperties,
} from '../../api/property.mapper';
import type {
  Property,
  PublicAgency,
  PublicAgent,
} from '../../types';

const ITEMS_PER_PAGE = 6;

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

  if (parts.length === 0) {
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
  if (!phone) {
    return '';
  }

  const digits = phone.replace(
    /\D/g,
    '',
  );

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

const formatLargeNum = (
  value: number,
) => {
  if (
    !Number.isFinite(value) ||
    value <= 0
  ) {
    return '—';
  }

  if (
    value >=
    1_000_000_000
  ) {
    return `₦${(
      value /
      1_000_000_000
    ).toFixed(1)}B`;
  }

  if (
    value >=
    1_000_000
  ) {
    return `₦${(
      value /
      1_000_000
    ).toFixed(1)}M`;
  }

  if (
    value >= 1_000
  ) {
    return `₦${Math.round(
      value / 1_000,
    )}K`;
  }

  return `₦${value.toLocaleString(
    'en-NG',
  )}`;
};

interface AgentResponse {
  agent?: PublicAgent;
  data?: {
    agent?: PublicAgent;
  };
}

interface AgencyListResponse {
  agencies?: PublicAgency[];
  data?: {
    agencies?: PublicAgency[];
  };
}

interface PropertyListResponse {
  properties?: unknown[];
  results?: unknown[];
  data?:
  | {
    properties?: unknown[];
    results?: unknown[];
  }
  | unknown[];
}

const extractProperties = (
  response: PropertyListResponse,
) => {
  if (Array.isArray(response?.properties)) {
    return response.properties;
  }

  if (Array.isArray(response?.results)) {
    return response.results;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (
    response?.data &&
    !Array.isArray(response.data)
  ) {
    if (
      Array.isArray(
        response.data.properties,
      )
    ) {
      return response.data.properties;
    }

    if (
      Array.isArray(
        response.data.results,
      )
    ) {
      return response.data.results;
    }
  }

  return [];
};

export default function AgentDetailsPage() {
  const { slug } =
    useParams<{
      slug: string;
    }>();

  const navigate = useNavigate();

  const {
    openScheduleViewingModal,
  } = useSession();

  const [
    agent,
    setAgent,
  ] = useState<PublicAgent | null>(
    null,
  );

  const [
    agency,
    setAgency,
  ] = useState<PublicAgency | null>(
    null,
  );

  const [
    properties,
    setProperties,
  ] = useState<Property[]>([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    hasError,
    setHasError,
  ] = useState(false);

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  useEffect(() => {
    let mounted = true;

    const loadAgentProfile =
      async () => {
        if (!slug) {
          setHasError(true);
          setIsLoading(false);
          return;
        }

        try {
          setIsLoading(true);
          setHasError(false);

          const agentResponse =
            (await agentApi.getPublicAgent(
              slug,
            )) as AgentResponse;

          const resolvedAgent =
            agentResponse?.agent ??
            agentResponse?.data?.agent ??
            null;

          if (
            !resolvedAgent
          ) {
            if (mounted) {
              setHasError(true);
              setAgent(null);
            }

            return;
          }

          if (!mounted) {
            return;
          }

          setAgent(resolvedAgent);

          const [
            agencyResult,
            propertiesResult,
          ] = await Promise.allSettled([
            resolvedAgent.agency?.id
              ? agencyApi.getPublicAgencies(
                {
                  page: 1,
                  limit: 100,
                },
              )
              : Promise.resolve(null),

            propertyApi.getProperties({
              agentId:
                resolvedAgent.id,
              status: 'Published',
              availabilityStatus:
                'Available',
              limit: 100,
              sort: 'newest',
            }),
          ]);

          if (!mounted) {
            return;
          }

          if (
            agencyResult.status ===
            'fulfilled' &&
            agencyResult.value
          ) {
            const agencyResponse =
              agencyResult.value as AgencyListResponse;

            const agencies =
              agencyResponse?.agencies ??
              agencyResponse?.data?.agencies ??
              [];

            const matchingAgency =
              agencies.find(
                (item) =>
                  item.id ===
                  resolvedAgent.agency?.id,
              ) ?? null;

            setAgency(
              matchingAgency,
            );
          }

          if (
            propertiesResult.status ===
            'fulfilled'
          ) {
            const propertyResponse =
              propertiesResult.value as PropertyListResponse;

            const rawProperties =
              extractProperties(
                propertyResponse,
              );

            setProperties(
              mapApiPropertiesToProperties(
                rawProperties,
              ),
            );
          } else {
            console.error(
              'Failed to load Agent published properties:',
              propertiesResult.reason,
            );

            setProperties([]);
          }
        } catch (error) {
          console.error(
            'Failed to load public Agent profile:',
            error,
          );

          if (!mounted) {
            return;
          }

          setAgent(null);
          setAgency(null);
          setProperties([]);
          setHasError(true);
        } finally {
          if (mounted) {
            setIsLoading(false);
          }
        }
      };

    loadAgentProfile();

    return () => {
      mounted = false;
    };
  }, [slug]);

  useEffect(() => {
    setCurrentPage(1);
  }, [properties.length]);

  const serviceAreas =
    useMemo(() => {
      const propertyAreas =
        properties.flatMap(
          (property) => [
            property.city,
            property.state,
          ],
        );

      return uniqueCaseInsensitive([
        ...(agent?.activeMarkets ||
          []),
        ...(agent?.serviceStates ||
          []),
        ...(agent?.neighborhoods ||
          []),
        ...propertyAreas,
      ]);
    }, [
      agent,
      properties,
    ]);

  const propertyCategories =
    useMemo(() => {
      const propertyTypes =
        properties.map(
          (property) =>
            String(
              property.type || '',
            ),
        );

      return uniqueCaseInsensitive([
        ...(agent?.propertyTypes ||
          []),
        ...propertyTypes,
      ]);
    }, [
      agent,
      properties,
    ]);

  const propertyStats =
    useMemo(() => {
      const pricedProperties =
        properties.filter(
          (property) =>
            Number.isFinite(
              property.priceValue,
            ) &&
            property.priceValue > 0,
        );

      const portfolioValue =
        pricedProperties.reduce(
          (sum, property) =>
            sum +
            property.priceValue,
          0,
        );

      const averagePrice =
        pricedProperties.length
          ? portfolioValue /
          pricedProperties.length
          : 0;

      const sortedByPrice =
        [...pricedProperties].sort(
          (a, b) =>
            b.priceValue -
            a.priceValue,
        );

      const highestValueProperty =
        sortedByPrice[0] || null;

      const sortedByDate =
        [...properties].sort(
          (a, b) => {
            const dateA =
              a.createdAt
                ? new Date(
                  a.createdAt,
                ).getTime()
                : 0;

            const dateB =
              b.createdAt
                ? new Date(
                  b.createdAt,
                ).getTime()
                : 0;

            return dateB - dateA;
          },
        );

      const latestProperty =
        sortedByDate[0] || null;

      const featuredProperties =
        properties.filter(
          (property) =>
            property.featuredLevel ===
            'Premium' ||
            property.featuredLevel ===
            'Exclusive',
        );

      const premiumProperties =
        properties.filter(
          (property) =>
            property.featuredLevel ===
            'Premium',
        );

      const marketCounts =
        new Map<
          string,
          number
        >();

      properties.forEach(
        (property) => {
          const location =
            property.city ||
            property.state;

          if (!location) {
            return;
          }

          const cleaned =
            location.trim();

          if (!cleaned) {
            return;
          }

          marketCounts.set(
            cleaned,
            (marketCounts.get(
              cleaned,
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

      const propertyTypeCounts =
        new Map<
          string,
          number
        >();

      properties.forEach(
        (property) => {
          const type = String(
            property.type ||
            'Other',
          ).trim();

          if (!type) {
            return;
          }

          propertyTypeCounts.set(
            type,
            (propertyTypeCounts.get(
              type,
            ) || 0) + 1,
          );
        },
      );

      const propertyMix =
        Array.from(
          propertyTypeCounts.entries(),
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

      const total =
        properties.length || 1;

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

      return {
        portfolioValue,
        averagePrice,
        highestPrice:
          highestValueProperty?.priceValue ||
          0,
        highestValueProperty,
        latestProperty,
        featuredProperties,
        premiumProperties,
        topMarkets,
        propertyMix,
        residentialPercent:
          Math.round(
            (residential /
              total) *
            100,
          ),
        commercialPercent:
          Math.round(
            (commercial /
              total) *
            100,
          ),
        landPercent:
          Math.round(
            (land /
              total) *
            100,
          ),
        shortLetPercent:
          Math.round(
            (shortLet /
              total) *
            100,
          ),
      };
    }, [properties]);

  const sortedProperties =
    useMemo(
      () =>
        [...properties].sort(
          (a, b) => {
            const dateA =
              a.createdAt
                ? new Date(
                  a.createdAt,
                ).getTime()
                : 0;

            const dateB =
              b.createdAt
                ? new Date(
                  b.createdAt,
                ).getTime()
                : 0;

            return dateB - dateA;
          },
        ),
      [properties],
    );

  const totalPages =
    Math.ceil(
      sortedProperties.length /
      ITEMS_PER_PAGE,
    );

  const paginatedProperties =
    sortedProperties.slice(
      (currentPage - 1) *
      ITEMS_PER_PAGE,
      currentPage *
      ITEMS_PER_PAGE,
    );

  const agencySlug =
    agency?.slug || null;

  const agencyName =
    agency?.name ||
    agent?.agency?.name ||
    'Independent Agent';

  const whatsappNumber =
    normalizePhoneForWhatsApp(
      agent?.phone,
    );

  const primarySpecialization =
    agent?.specializations?.[0] ||
    propertyCategories[0] ||
    null;

  if (isLoading) {
    return (
      <PageLayout footerVariant="compact">
        <div className="min-h-screen bg-navy-900 pt-32">
          <Container>
            <div className="space-y-10">
              <div className="h-5 w-56 animate-pulse rounded bg-white/10" />

              <div className="flex flex-col gap-8 md:flex-row">
                <div className="h-40 w-40 animate-pulse rounded-3xl bg-white/10" />

                <div className="flex-1 space-y-4">
                  <div className="h-10 w-2/3 animate-pulse rounded bg-white/10" />

                  <div className="h-5 w-1/2 animate-pulse rounded bg-white/10" />

                  <div className="h-12 w-full max-w-xl animate-pulse rounded bg-white/10" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({
                  length: 4,
                }).map(
                  (_, index) => (
                    <div
                      key={index}
                      className="h-24 animate-pulse rounded-2xl bg-white/5"
                    />
                  ),
                )}
              </div>
            </div>
          </Container>
        </div>
      </PageLayout>
    );
  }

  if (
    hasError ||
    !agent
  ) {
    return (
      <NotFoundPage />
    );
  }

  const agentInitials =
    getInitials(
      agent.name,
    );

  return (
    <PageLayout footerVariant="compact">
      {/* ========================================
          HERO
      ======================================== */}
      <div className="relative overflow-hidden border-b border-white/5 bg-navy-900 pb-20 pt-32">
        <div className="pointer-events-none absolute left-0 top-0 h-[600px] w-[600px] rounded-full bg-gold-500/5 blur-[120px]" />

        <Container className="relative z-10">
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
              ...(agencySlug
                ? [
                  {
                    label: agencyName,
                    href:
                      ROUTES.AGENCY_DETAILS.replace(
                        ':slug',
                        agencySlug,
                      ),
                  },
                ]
                : []),
              {
                label: agent.name,
              },
            ]}
          />

          <div className="mt-8 flex flex-col items-start gap-10 md:flex-row">
            {/* Agent Photo */}
            <div className="relative shrink-0">
              {agent.avatar ? (
                <img
                  src={agent.avatar}
                  alt={agent.name}
                  className="h-40 w-40 rounded-3xl object-cover shadow-2xl ring-1 ring-white/10"
                />
              ) : (
                <div className="flex h-40 w-40 items-center justify-center rounded-3xl bg-gradient-to-br from-gold-500/25 to-gold-400/5 text-4xl font-bold text-gold-300 shadow-2xl ring-1 ring-white/10">
                  {agentInitials}
                </div>
              )}

              {agent.verified && (
                <div className="absolute -bottom-3 -right-3 flex h-10 w-10 items-center justify-center rounded-full bg-navy-900 ring-2 ring-emerald-500/20">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                </div>
              )}
            </div>

            {/* Agent Info */}
            <div className="flex-1">
              <div className="mb-4 flex flex-col items-start gap-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="font-heading text-4xl font-bold tracking-tight text-cream sm:text-5xl">
                    {agent.name}
                  </h1>

                  {agent.verified && (
                    <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                      <ShieldCheck className="h-4 w-4" />
                      Verified
                    </div>
                  )}
                </div>

                {agencySlug ? (
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        ROUTES.AGENCY_DETAILS.replace(
                          ':slug',
                          agencySlug,
                        ),
                      )
                    }
                    className="mt-1 flex items-center gap-1.5 font-medium text-gold-400 transition-colors hover:text-gold-300 focus:outline-none"
                  >
                    <Building2 className="h-4 w-4" />
                    {agencyName}
                  </button>
                ) : (
                  <div className="mt-1 flex items-center gap-1.5 text-sm font-medium text-ink/60">
                    <Building2 className="h-4 w-4" />
                    {agencyName}
                  </div>
                )}
              </div>

              <div className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-ink/60">
                <span className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gold-400" />
                  {agent.listingCount}{' '}
                  Published Listings
                </span>

                {agent.yearsOfExperience >
                  0 && (
                    <span className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-gold-400" />
                      {
                        agent.yearsOfExperience
                      }{' '}
                      Years Experience
                    </span>
                  )}

                {primarySpecialization && (
                  <span className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-gold-400" />
                    {primarySpecialization}
                  </span>
                )}

                {serviceAreas.length >
                  0 && (
                    <span className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gold-400" />
                      {serviceAreas[0]}
                      {serviceAreas.length >
                        1 &&
                        ` +${serviceAreas.length -
                        1
                        }`}
                    </span>
                  )}
              </div>

              <div className="flex w-full flex-wrap items-center gap-4 md:w-auto">
                {agent.phone && (
                  <GoldButton
                    size="md"
                    className="w-full justify-center gap-2 sm:w-auto"
                    onClick={() =>
                      (window.location.href = `tel:${agent.phone}`)
                    }
                  >
                    <Phone className="h-4 w-4" />
                    Call Agent
                  </GoldButton>
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

                {agent.email && (
                  <GhostButton
                    className="w-full justify-center gap-2 sm:w-auto"
                    onClick={() =>
                      (window.location.href = `mailto:${agent.email}`)
                    }
                  >
                    <Mail className="h-4 w-4" />
                    Email
                  </GhostButton>
                )}

                {properties.length >
                  0 && (
                    <GhostButton
                      className="w-full justify-center gap-2 sm:w-auto"
                      onClick={() =>
                        openScheduleViewingModal(
                          properties[0].id,
                        )
                      }
                    >
                      <CalendarCheck className="h-4 w-4" />
                      Schedule Viewing
                    </GhostButton>
                  )}
              </div>
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
              {/* Professional Profile */}
              <Reveal>
                <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-8">
                  <h3 className="mb-4 font-heading text-xl font-bold text-cream">
                    Professional Profile
                  </h3>

                  <p className="mb-6 text-sm leading-relaxed text-ink/70">
                    {agent.name}{' '}
                    is an active real estate
                    professional on the Luxora
                    marketplace
                    {agencyName &&
                      ` with ${agencyName}`}{' '}
                    with{' '}
                    {agent.listingCount}{' '}
                    published listings
                    across{' '}
                    {serviceAreas.length}{' '}
                    active markets.
                  </p>

                  <div className="space-y-4 border-t border-white/10 pt-5">
                    {agent.level && (
                      <div className="flex items-center justify-between gap-4 text-sm">
                        <span className="text-ink/50">
                          Level
                        </span>

                        <span className="text-right font-medium text-cream">
                          {agent.level}
                        </span>
                      </div>
                    )}

                    {agent.department && (
                      <div className="flex items-center justify-between gap-4 text-sm">
                        <span className="text-ink/50">
                          Department
                        </span>

                        <span className="text-right font-medium text-cream">
                          {agent.department}
                        </span>
                      </div>
                    )}

                    {agent.branch && (
                      <div className="flex items-center justify-between gap-4 text-sm">
                        <span className="text-ink/50">
                          Branch
                        </span>

                        <span className="text-right font-medium text-cream">
                          {agent.branch}
                        </span>
                      </div>
                    )}

                    {agent.coverageRadius && (
                      <div className="flex items-center justify-between gap-4 text-sm">
                        <span className="text-ink/50">
                          Coverage
                        </span>

                        <span className="text-right font-medium text-cream">
                          {agent.coverageRadius}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-4 text-sm">
                      <span className="text-ink/50">
                        Status
                      </span>

                      <span className="font-medium text-emerald-400">
                        {agent.status}
                      </span>
                    </div>
                  </div>

                  {/* Property Expertise */}
                  {propertyCategories.length >
                    0 && (
                      <div className="mt-6 border-t border-white/10 pt-6">
                        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-cream">
                          Property Expertise
                        </h4>

                        <div className="flex flex-wrap gap-2">
                          {propertyCategories.map(
                            (category) => (
                              <span
                                key={
                                  category
                                }
                                className="inline-flex items-center rounded-lg border border-gold-400/20 bg-gold-400/5 px-3 py-1.5 text-xs text-gold-300"
                              >
                                {category}
                              </span>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                  {/* Markets Covered */}
                  {serviceAreas.length >
                    0 && (
                      <div className="mt-6 border-t border-white/10 pt-6">
                        <h4 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cream">
                          <MapPin className="h-3.5 w-3.5 text-gold-400" />
                          Markets Covered
                        </h4>

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
                      </div>
                    )}
                </div>
              </Reveal>

              {/* Marketplace Metrics */}
              <Reveal delay={100}>
                <h3 className="mb-6 font-heading text-xl font-bold text-cream">
                  Marketplace Metrics
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                    <Building2 className="mb-3 h-5 w-5 text-gold-400" />

                    <div className="font-heading text-2xl font-bold text-cream">
                      {agent.listingCount}
                    </div>

                    <div className="mt-1 text-xs uppercase tracking-wider text-ink/50">
                      Published Listings
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                    <Handshake className="mb-3 h-5 w-5 text-blue-400" />

                    <div className="font-heading text-2xl font-bold text-cream">
                      —
                    </div>

                    <div className="mt-1 text-xs uppercase tracking-wider text-ink/50">
                      Closed Deals
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                    <TrendingUp className="mb-3 h-5 w-5 text-emerald-400" />

                    <div className="font-heading text-2xl font-bold text-cream">
                      {formatLargeNum(
                        propertyStats.portfolioValue,
                      )}
                    </div>

                    <div className="mt-1 text-xs uppercase tracking-wider text-ink/50">
                      Listed Portfolio Value
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                    <Award className="mb-3 h-5 w-5 text-gold-400" />

                    <div className="font-heading text-2xl font-bold text-cream">
                      {formatLargeNum(
                        propertyStats.averagePrice,
                      )}
                    </div>

                    <div className="mt-1 text-xs uppercase tracking-wider text-ink/50">
                      Average Listed Price
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                    <MapPin className="mb-3 h-5 w-5 text-rose-400" />

                    <div className="font-heading text-2xl font-bold text-cream">
                      {propertyStats.topMarkets.length}
                    </div>

                    <div className="mt-1 text-xs uppercase tracking-wider text-ink/50">
                      Active Markets
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                    <Crown className="mb-3 h-5 w-5 text-emerald-400" />

                    <div className="font-heading text-2xl font-bold text-emerald-400">
                      {formatLargeNum(
                        propertyStats.highestPrice,
                      )}
                    </div>

                    <div className="mt-1 text-xs uppercase tracking-wider text-ink/50">
                      Highest Listing
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* View Agency CTA */}
              <Reveal delay={200}>
                <div className="flex flex-col items-center rounded-3xl border border-white/10 bg-gradient-to-br from-navy-800 to-navy-900 p-6 text-center md:p-8">
                  <Building2 className="mb-4 h-10 w-10 text-gold-400/50" />

                  <h3 className="mb-2 font-heading text-lg font-bold text-cream">
                    Representing{' '}
                    {agencyName}
                  </h3>

                  <p className="mb-6 text-sm leading-relaxed text-ink/60">
                    View the Agency profile, active team,
                    and published marketplace portfolio.
                  </p>

                  {agencySlug ? (
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          ROUTES.AGENCY_DETAILS.replace(
                            ':slug',
                            agencySlug,
                          ),
                        )
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-semibold text-cream transition-all hover:border-white/20 hover:bg-white/10 focus:outline-none"
                    >
                      View Agency Profile
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <span className="text-sm text-ink/40">
                      Agency profile unavailable
                    </span>
                  )}
                </div>
              </Reveal>

              {/* Public Reviews */}
              <Reveal delay={300}>
                <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-8">
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-heading text-xl font-bold text-cream">
                        Client Reviews
                      </h3>

                      <p className="mt-1 text-sm text-ink/50">
                        Public review and rating data is not
                        currently connected to the Agent profile.
                      </p>
                    </div>

                    <MessageCircle className="h-5 w-5 shrink-0 text-gold-400" />
                  </div>

                  <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 text-center">
                    <MessageCircle className="mx-auto mb-3 h-8 w-8 text-white/10" />

                    <p className="font-medium text-cream">
                      No public reviews available
                    </p>

                    <p className="mt-1 text-sm leading-relaxed text-ink/50">
                      Review and rating records are not part
                      of the current public Agent data source.
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* ======================================
                RIGHT COLUMN
            ====================================== */}
            <div className="space-y-12 lg:col-span-2">
              {/* Professional Highlights */}
              {properties.length >
                0 && (
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
                            {propertyStats.highestValueProperty?.title ||
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
                            Featured
                          </span>

                          <Award className="h-4 w-4 text-gold-400" />
                        </div>

                        <div>
                          <div className="text-2xl font-bold text-cream">
                            {
                              propertyStats
                                .featuredProperties
                                .length
                            }
                          </div>

                          <div className="mt-1 text-xs text-ink/50">
                            Highlighted Properties
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-navy-800/50 p-5">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs uppercase tracking-wider text-ink/50">
                            Premium
                          </span>

                          <ShieldCheck className="h-4 w-4 text-emerald-400" />
                        </div>

                        <div>
                          <div className="text-2xl font-bold text-cream">
                            {
                              propertyStats
                                .premiumProperties
                                .length
                            }
                          </div>

                          <div className="mt-1 text-xs text-ink/50">
                            Premium Properties
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-navy-800/50 p-5">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs uppercase tracking-wider text-ink/50">
                            Expertise
                          </span>

                          <Building2 className="h-4 w-4 text-blue-400" />
                        </div>

                        <div>
                          <div className="truncate text-lg font-bold text-cream">
                            {propertyStats
                              .propertyMix[0]
                              ?.type ||
                              'N/A'}
                          </div>

                          <div className="mt-1 text-xs text-ink/50">
                            Primary Type
                          </div>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                )}

              {/* Marketplace Snapshot */}
              <Reveal delay={100}>
                <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-8">
                  <h3 className="mb-6 flex items-center gap-2 font-heading text-xl font-bold text-cream">
                    <TrendingUp className="h-5 w-5 text-gold-400" />
                    Marketplace Snapshot
                  </h3>

                  <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
                    <div>
                      <div className="mb-1 text-sm text-ink/50">
                        Listed Portfolio Value
                      </div>

                      <div className="text-xl font-bold text-cream">
                        {formatLargeNum(
                          propertyStats.portfolioValue,
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="mb-1 text-sm text-ink/50">
                        Average Listed Price
                      </div>

                      <div className="text-xl font-bold text-cream">
                        {formatLargeNum(
                          propertyStats.averagePrice,
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="mb-1 text-sm text-ink/50">
                        Highest Listed Price
                      </div>

                      <div className="text-xl font-bold text-emerald-400">
                        {formatLargeNum(
                          propertyStats.highestPrice,
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
              {properties.length >
                0 && (
                  <Reveal delay={150}>
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
                            className:
                              'bg-blue-400',
                          },
                          {
                            label: 'Commercial',
                            percent:
                              propertyStats.commercialPercent,
                            className:
                              'bg-emerald-400',
                          },
                          {
                            label: 'Land',
                            percent:
                              propertyStats.landPercent,
                            className:
                              'bg-amber-500',
                          },
                          {
                            label: 'Short Let',
                            percent:
                              propertyStats.shortLetPercent,
                            className:
                              'bg-purple-400',
                          },
                        ].map(
                          (item) => (
                            <div
                              key={item.label}
                              className="flex items-center gap-4"
                            >
                              <span className="w-28 shrink-0 text-sm font-medium text-ink/70">
                                {item.label}
                              </span>

                              <div className="flex h-2 flex-1 overflow-hidden rounded-full bg-white/5">
                                <div
                                  className={`h-full rounded-full ${item.className}`}
                                  style={{
                                    width: `${item.percent}%`,
                                  }}
                                />
                              </div>

                              <span className="w-12 text-right text-sm font-bold text-cream">
                                {item.percent}%
                              </span>
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
                      <h3 className="mb-6 flex items-center gap-2 font-heading text-xl font-bold text-cream">
                        <MapPin className="h-5 w-5 text-gold-400" />
                        Top Markets
                      </h3>

                      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                        {propertyStats.topMarkets.map(
                          (market) => (
                            <div
                              key={
                                market.location
                              }
                              className="rounded-xl border border-white/10 bg-white/5 p-4"
                            >
                              <div className="truncate text-sm font-bold text-cream">
                                {
                                  market.location
                                }
                              </div>

                              <div className="mt-1 text-xs text-ink/50">
                                {market.count}{' '}
                                Published Listings
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </Reveal>
                )}

              {/* Featured Listings */}
              {propertyStats
                .featuredProperties
                .length > 0 && (
                  <Reveal delay={250}>
                    <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                      <h2 className="font-heading text-2xl font-bold text-cream">
                        Featured Properties
                      </h2>

                      <span className="rounded-full bg-gold-400/10 px-3 py-1 text-sm font-medium text-gold-400">
                        {
                          propertyStats
                            .featuredProperties
                            .length
                        }{' '}
                        Properties
                      </span>
                    </div>

                    <PropertyGrid
                      properties={
                        propertyStats.featuredProperties
                      }
                      gridClassName="grid gap-6 sm:grid-cols-2"
                    />
                  </Reveal>
                )}

              {/* Recent Listings */}
              <Reveal delay={300}>
                <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                  <h2 className="font-heading text-2xl font-bold text-cream">
                    Recent Listings
                  </h2>

                  <span className="text-sm font-medium text-ink/50">
                    Showing{' '}
                    {
                      paginatedProperties.length
                    }{' '}
                    of{' '}
                    {
                      sortedProperties.length
                    }
                  </span>
                </div>

                {sortedProperties.length >
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
                      This Agent does not currently have
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
import type { Property } from '../../../types';
import { mapApiPropertiesToProperties } from '../../../api/property.mapper';
import { propertyApi } from '../../../api/property.api';
import { useEffect, useMemo, useState } from 'react';
import { bookingApi } from '../../../api/booking.api';
import { offerApi } from '../../../api/offer.api';
import { getGreetingText } from '../../../utils/greeting';
import { WaveEmoji } from '../../../components/ui/WaveEmoji';
import {
  Heart,
  FileCheck,
  Eye,
  MessageSquare,
  TrendingUp,
  MapPin,
  Calculator,
  Activity,
  Search,
  CalendarClock,
} from 'lucide-react';
import { useSession } from '../../../contexts/SessionContext';
import { useFavorites } from '../../../contexts/FavoriteContext';
import { PropertyCard } from '../../../components/property/PropertyCard';
import { EmptyState } from '../../../components/layout';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { calculateMortgage, formatCurrency } from '../../../utils';

// Use the same real recommendation component and logic
// already used by the dedicated Buyer Recommendations section.
import RecommendedProperties from './RecommendedProperties';

interface OverviewPropertyResponse {
  properties?: unknown[];
  results?: unknown[];
  data?:
    | unknown[]
    | {
        properties?: unknown[];
        results?: unknown[];
      };
}

interface ActivityItem {
  id: string;
  type: 'viewing' | 'offer' | 'recent';
  title: string;
  description: string;
  date?: string;
  status?: string;
}

const getActivityDate = (value?: string) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const getStatusLabel = (status?: string) => {
  if (!status) {
    return '';
  }

  return status
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ');
};

export default function Overview({
  onNavigate,
}: {
  onNavigate: (tab: string) => void;
}) {
  const {
    user,
    recentlyViewed,
    unreadCount,
  } = useSession();

  const { favoriteProperties: savedProperties } =
    useFavorites();

  // Store the Buyer's viewing requests returned by the backend.
  const [viewingRequests, setViewingRequests] =
    useState<any[]>([]);

  // Store the Buyer's offers returned by the backend.
  const [offers, setOffers] = useState<any[]>([]);

  // Track the loading state for the Overview API requests.
  const [isOverviewLoading, setIsOverviewLoading] =
    useState(true);

  // Store the Buyer's recently viewed backend properties.
  const [recentViewedProperties, setRecentViewedProperties] =
    useState<Property[]>([]);

  // Track the Recently Viewed property requests separately.
  const [
    isRecentlyViewedLoading,
    setIsRecentlyViewedLoading,
  ] = useState(true);

  // Store the real published Buy properties used for the marketplace snapshot.
  const [marketProperties, setMarketProperties] =
    useState<Property[]>([]);

  // Track the marketplace snapshot loading state independently.
  const [isMarketLoading, setIsMarketLoading] =
    useState(true);

  // Greeting based on time.
  const greeting = getGreetingText(
    user?.name || 'Buyer',
  );

  /*
   * Load the Buyer's viewing requests and offers
   * for the Overview KPIs and Recent Activity.
   */
  useEffect(() => {
    const loadOverviewData = async () => {
      try {
        setIsOverviewLoading(true);

        // Load both resources at the same time.
        const [
          viewingsResponse,
          offersResponse,
        ] = await Promise.all([
          bookingApi.getMyBookings(),
          offerApi.getMyOffers(),
        ]);

        // Match the response structure already used
        // by the existing Buyer Viewing Requests page.
        setViewingRequests(
          viewingsResponse.data?.bookings ?? [],
        );

        // Match the response structure already used
        // by the existing Buyer Offers page.
        setOffers(
          offersResponse.data?.offers ?? [],
        );
      } catch (error) {
        console.error(
          'Failed to load Buyer Overview data:',
          error,
        );

        // Reset only the KPI/activity collections.
        setViewingRequests([]);
        setOffers([]);
      } finally {
        setIsOverviewLoading(false);
      }
    };

    void loadOverviewData();
  }, []);

  /*
   * Load the actual Properties the Buyer recently viewed.
   *
   * Keep this separate from the main Overview loading
   * because each viewed Property requires its own API
   * request.
   */
  useEffect(() => {
    let isActive = true;

    const loadRecentlyViewedProperties = async () => {
      /*
       * There is no request to make when the Buyer has
       * no recently viewed Property IDs.
       */
      if (recentlyViewed.length === 0) {
        if (isActive) {
          setRecentViewedProperties([]);
          setIsRecentlyViewedLoading(false);
        }

        return;
      }

      try {
        setIsRecentlyViewedLoading(true);

        /*
         * Fetch the actual backend Properties represented
         * by the Buyer's recently viewed IDs.
         */
        const responses = await Promise.all(
          recentlyViewed.map((propertyId) =>
            propertyApi.getPropertyById(propertyId),
          ),
        );

        if (!isActive) {
          return;
        }

        /*
         * Extract the Property documents from the
         * unwrapped API responses.
         */
        const rawProperties = responses
          .map(
            (response) =>
              (response as any)?.property,
          )
          .filter(Boolean);

        /*
         * Convert backend Properties into the canonical
         * frontend Property structure.
         */
        const mappedProperties =
          mapApiPropertiesToProperties(
            rawProperties,
          );

        setRecentViewedProperties(
          mappedProperties as Property[],
        );
      } catch (error) {
        if (!isActive) {
          return;
        }

        console.error(
          'Failed to load recently viewed properties:',
          error,
        );

        setRecentViewedProperties([]);
      } finally {
        if (isActive) {
          setIsRecentlyViewedLoading(false);
        }
      }
    };

    void loadRecentlyViewedProperties();

    return () => {
      isActive = false;
    };
  }, [recentlyViewed]);

  /*
   * Load current published Buy inventory for the marketplace
   * snapshot rather than displaying fabricated market figures.
   */
  useEffect(() => {
    let isActive = true;

    const loadMarketProperties = async () => {
      try {
        setIsMarketLoading(true);

        const response = await propertyApi.getProperties({
          status: 'Published',
          availabilityStatus: 'Available',
          transactionType: 'buy',
          limit: 100,
        });

        if (!isActive) {
          return;
        }

        const payload =
          response as unknown as OverviewPropertyResponse;

        let backendProperties: unknown[] = [];

        if (Array.isArray(payload.properties)) {
          backendProperties = payload.properties;
        } else if (Array.isArray(payload.results)) {
          backendProperties = payload.results;
        } else if (Array.isArray(payload.data)) {
          backendProperties = payload.data;
        } else if (
          payload.data &&
          typeof payload.data === 'object'
        ) {
          backendProperties =
            payload.data.properties ??
            payload.data.results ??
            [];
        }

        const mappedProperties =
          mapApiPropertiesToProperties(
            backendProperties,
          ) as Property[];

        setMarketProperties(mappedProperties);
      } catch (error) {
        if (!isActive) {
          return;
        }

        console.error(
          'Failed to load Buyer marketplace snapshot:',
          error,
        );

        setMarketProperties([]);
      } finally {
        if (isActive) {
          setIsMarketLoading(false);
        }
      }
    };

    void loadMarketProperties();

    return () => {
      isActive = false;
    };
  }, []);

  /*
   * Count viewing requests that are not completed
   * or cancelled.
   */
  const activeViewingRequests =
    viewingRequests.filter(
      (viewing) =>
        !['Completed', 'Cancelled'].includes(
          viewing.status,
        ),
    ).length;

  /*
   * Count offers that are still active and awaiting
   * resolution.
   */
  const pendingOffers = offers.filter(
    (offer) =>
      ![
        'Accepted',
        'Rejected',
        'Withdrawn',
        'Closed',
      ].includes(offer.status),
  ).length;

  /*
   * Preserve the Buyer's recently viewed ordering.
   *
   * The loading state prevents this from being treated
   * as an empty collection before the backend requests
   * have completed.
   */
  const recentProps = recentlyViewed
    .map((id) =>
      recentViewedProperties.find(
        (property) => property.id === id,
      ),
    )
    .filter(
      (property): property is Property =>
        property !== undefined,
    )
    .slice(0, 3);

  /*
   * Build a real marketplace snapshot from the current
   * published Buy inventory.
   */
  const marketSnapshot = useMemo(() => {
    const pricedProperties = marketProperties.filter(
      (property) =>
        Number.isFinite(property.priceValue) &&
        property.priceValue > 0,
    );

    const averagePrice =
      pricedProperties.length > 0
        ? pricedProperties.reduce(
            (total, property) =>
              total + property.priceValue,
            0,
          ) / pricedProperties.length
        : null;

    const locationCounts = new Map<string, number>();

    marketProperties.forEach((property) => {
      const location =
        property.city?.trim() ||
        property.location?.trim() ||
        'Other';

      locationCounts.set(
        location,
        (locationCounts.get(location) || 0) + 1,
      );
    });

    let leadingLocation: string | null = null;
    let leadingLocationCount = 0;

    locationCounts.forEach((count, location) => {
      if (count > leadingLocationCount) {
        leadingLocation = location;
        leadingLocationCount = count;
      }
    });

    return {
      averagePrice,
      leadingLocation,
      leadingLocationCount,
      totalListings: marketProperties.length,
    };
  }, [marketProperties]);

  /*
   * Use the Buyer's persisted budget when available for the
   * mortgage snapshot. Do not invent a budget value when none
   * has been saved in the Buyer's account.
   */
  const budgetMax =
    user?.settings?.buyer?.budgetMax ?? null;

  const mortgagePriceMillions =
    budgetMax && budgetMax > 0
      ? budgetMax / 1_000_000
      : null;

  const mortgageCalculation =
    mortgagePriceMillions !== null
      ? calculateMortgage(
          mortgagePriceMillions,
          20,
          36,
        )
      : null;

  /*
   * Build Recent Activity from real viewing and offer
   * records plus the real recently viewed Property list.
   */
  const recentActivity = useMemo<ActivityItem[]>(() => {
    const items: ActivityItem[] = [];

    viewingRequests.forEach((viewing) => {
      const propertyTitle =
        viewing.property?.title ||
        'Property viewing';

      items.push({
        id: `viewing-${viewing._id || viewing.id}`,
        type: 'viewing',
        title: 'Viewing request',
        description: `${propertyTitle} — ${
          getStatusLabel(viewing.status) || 'Submitted'
        }.`,
        date:
          getActivityDate(
            viewing.createdAt ||
              viewing.updatedAt ||
              viewing.viewingDate,
          ) || undefined,
        status: viewing.status,
      });
    });

    offers.forEach((offer) => {
      const propertyTitle =
        offer.property?.title ||
        'Property offer';

      items.push({
        id: `offer-${offer._id || offer.id}`,
        type: 'offer',
        title: 'Offer activity',
        description: `${propertyTitle} — ${
          getStatusLabel(offer.status) || 'Submitted'
        }.`,
        date:
          getActivityDate(
            offer.updatedAt ||
              offer.createdAt,
          ) || undefined,
        status: offer.status,
      });
    });

    recentProps.forEach((property) => {
      items.push({
        id: `recent-${property.id}`,
        type: 'recent',
        title: 'Recently viewed',
        description: property.title,
        date: undefined,
      });
    });

    return items.slice(0, 6);
  }, [viewingRequests, offers, recentProps]);

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Welcome Header */}
      <div className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-navy-800/50 p-6 backdrop-blur-md md:flex-row md:items-center md:p-8">
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="h-16 w-16 rounded-full border-2 border-gold-400/30 object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold-400/30 bg-navy-900 text-2xl font-bold text-gold-400">
            {user?.name?.charAt(0) || 'B'}
          </div>
        )}

        <div>
          <h2 className="font-heading text-2xl font-bold text-cream sm:text-3xl">
            {greeting} <WaveEmoji />
          </h2>

          <p className="mt-1 text-ink/70">
            Here&apos;s what&apos;s happening with your
            property search and applications today.
          </p>
        </div>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: 'Saved Properties',
            value: savedProperties.length.toString(),
            icon: Heart,
            color: 'text-rose-400',
            bg: 'bg-rose-400/10',
            onClick: () =>
              onNavigate('My Favorites'),
          },
          {
            label: 'Active Viewing Requests',
            value: isOverviewLoading
              ? '—'
              : activeViewingRequests.toString(),
            icon: Eye,
            color: 'text-blue-400',
            bg: 'bg-blue-400/10',
            onClick: () =>
              onNavigate('Viewing Requests'),
          },
          {
            label: 'Pending Offers',
            value: isOverviewLoading
              ? '—'
              : pendingOffers.toString(),
            icon: FileCheck,
            color: 'text-emerald-400',
            bg: 'bg-emerald-400/10',
            onClick: () =>
              onNavigate('Offers'),
          },
          {
            label: 'Unread Notifications',
            value: unreadCount.toString(),
            icon: MessageSquare,
            color: 'text-gold-400',
            bg: 'bg-gold-400/10',
          },
        ].map((stat, i) => (
          <KPICard
            key={i}
            title={stat.label}
            value={stat.value}
            icon={stat.icon}
            iconColor={stat.color}
            backgroundColor={stat.bg}
            hoverEffect={
              stat.onClick
                ? 'lift'
                : 'highlight'
            }
            iconBorder={true}
            valueTypography="heading"
            labelTypography="small"
            onClick={stat.onClick}
          />
        ))}
      </div>

      {/* 3. Recently Viewed */}
      <div>
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-heading text-xl font-bold text-cream">
            Recently Viewed
          </h3>

          <button
            onClick={() =>
              onNavigate('Recently Viewed')
            }
            className="text-xs font-semibold text-gold-400 hover:text-gold-300"
          >
            View all
          </button>
        </div>

        {isRecentlyViewedLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-navy-800/50"
                >
                  <div className="h-52 animate-pulse bg-white/5" />

                  <div className="space-y-3 p-5">
                    <div className="h-5 w-3/4 animate-pulse rounded bg-white/10" />
                    <div className="h-4 w-1/2 animate-pulse rounded bg-white/10" />
                    <div className="h-6 w-1/3 animate-pulse rounded bg-white/10" />
                  </div>
                </div>
              ),
            )}
          </div>
        ) : recentProps.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recentProps.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-8">
            <EmptyState
              icon={
                <Search className="h-8 w-8 text-gold-400" />
              }
              title="No recent views"
              description="Properties you view will appear here for quick access."
              actionLabel="Explore Properties"
              onAction={() =>
                (window.location.href = '/properties')
              }
            />
          </div>
        )}
      </div>

      {/* 4. Recommended Properties */}
      <RecommendedProperties />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* 5. Marketplace Snapshot */}
        <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 lg:col-span-2">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-400/10 text-purple-400">
              <TrendingUp className="h-5 w-5" />
            </div>

            <div>
              <h3 className="font-heading text-lg font-bold text-cream">
                Marketplace Snapshot
              </h3>

              <p className="mt-1 text-xs text-ink/50">
                Based on currently published Buy listings.
              </p>
            </div>
          </div>

          {isMarketLoading ? (
            <div className="grid gap-4 sm:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-24 animate-pulse rounded-2xl border border-white/5 bg-white/[0.02]"
                />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-center">
                <div className="mb-1 text-xs text-ink/50">
                  Average Buy Price
                </div>

                <div className="font-heading text-xl font-bold text-cream">
                  {marketSnapshot.averagePrice !== null
                    ? formatCurrency(
                        Math.round(
                          marketSnapshot.averagePrice,
                        ),
                      )
                    : '—'}
                </div>
              </div>

              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-center">
                <div className="mb-1 text-xs text-ink/50">
                  Most Listed Location
                </div>

                <div className="flex items-center justify-center gap-1 font-heading text-xl font-bold text-cream">
                  <MapPin className="h-4 w-4 text-gold-400" />
                  {marketSnapshot.leadingLocation || '—'}
                </div>

                <div className="mt-1 text-[10px] text-ink/40">
                  {marketSnapshot.leadingLocationCount > 0
                    ? `${marketSnapshot.leadingLocationCount} listing${
                        marketSnapshot.leadingLocationCount === 1
                          ? ''
                          : 's'
                      }`
                    : 'No current data'}
                </div>
              </div>

              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-center">
                <div className="mb-1 text-xs text-ink/50">
                  Available Buy Listings
                </div>

                <div className="font-heading text-xl font-bold text-emerald-400">
                  {marketSnapshot.totalListings}
                </div>

                <div className="mt-1 text-[10px] text-ink/40">
                  Published &amp; available
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 6. Mortgage Snapshot */}
        <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-400/10 text-gold-400">
              <Calculator className="h-5 w-5" />
            </div>

            <h3 className="font-heading text-lg font-bold text-cream">
              Mortgage Snapshot
            </h3>
          </div>

          {mortgagePriceMillions !== null &&
          mortgageCalculation ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                <span className="text-sm text-ink/60">
                  Your Budget
                </span>

                <span className="font-semibold text-cream">
                  {formatCurrency(
                    budgetMax as number,
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                <span className="text-sm text-ink/60">
                  Planning Deposit (20%)
                </span>

                <span className="font-semibold text-cream">
                  {formatCurrency(
                    Math.round(
                      (budgetMax as number) * 0.2,
                    ),
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-gold-400/20 bg-gold-400/5 p-4">
                <span className="text-sm font-medium text-gold-200">
                  Est. Monthly
                </span>

                <span className="font-bold text-gold-400">
                  {formatCurrency(
                    mortgageCalculation.monthly,
                  )}
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  onNavigate('Mortgage Tracker')
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-gold-400/20 bg-gold-400/5 px-4 py-3 text-sm font-semibold text-gold-300 transition-colors hover:bg-gold-400/10 hover:text-gold-200"
              >
                Open Mortgage Tracker
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
              <p className="text-sm leading-relaxed text-ink/60">
                Set your Buyer budget in Settings to see a
                personalized mortgage planning snapshot here.
              </p>

              <button
                type="button"
                onClick={() =>
                  onNavigate('Settings')
                }
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-cream transition-colors hover:border-gold-400/30 hover:text-gold-300"
              >
                Set Buyer Budget
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 7. Recent Activity Timeline */}
      <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
            <Activity className="h-5 w-5" />
          </div>

          <h3 className="font-heading text-lg font-bold text-cream">
            Recent Activity
          </h3>
        </div>

        {isOverviewLoading ||
        isRecentlyViewedLoading ? (
          <div className="space-y-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-start gap-4"
              >
                <div className="mt-1 h-6 w-6 animate-pulse rounded-full bg-white/10" />

                <div className="flex-1 space-y-2">
                  <div className="h-4 w-40 animate-pulse rounded bg-white/10" />
                  <div className="h-3 w-3/4 animate-pulse rounded bg-white/5" />
                  <div className="h-3 w-24 animate-pulse rounded bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        ) : recentActivity.length > 0 ? (
          <div className="ml-4 space-y-6 border-l-2 border-white/10 pl-4">
            {recentActivity.map((item) => {
              const Icon =
                item.type === 'viewing'
                  ? CalendarClock
                  : item.type === 'offer'
                    ? FileCheck
                    : Search;

              const iconColor =
                item.type === 'viewing'
                  ? 'text-blue-400'
                  : item.type === 'offer'
                    ? 'text-emerald-400'
                    : 'text-ink/40';

              return (
                <div
                  key={item.id}
                  className="relative"
                >
                  <div className="absolute -left-[25px] flex h-6 w-6 items-center justify-center rounded-full border-2 border-white/10 bg-navy-800">
                    <Icon
                      className={`h-3 w-3 ${iconColor}`}
                    />
                  </div>

                  <div className="pl-4">
                    <div className="text-sm font-semibold text-cream">
                      {item.title}
                    </div>

                    <div className="mt-1 text-xs text-ink/60">
                      {item.description}
                    </div>

                    {(item.date || item.status) && (
                      <div className="mt-1 text-[10px] text-ink/40">
                        {[
                          item.date,
                          getStatusLabel(item.status),
                        ]
                          .filter(Boolean)
                          .join(' • ')}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 text-center">
            <p className="text-sm text-ink/60">
              Your viewing requests, offers, and recently viewed
              properties will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
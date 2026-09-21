import type { Property } from '../../../types';
import { mapApiPropertiesToProperties } from '../../../api/property.mapper';
import { propertyApi } from '../../../api/property.api';
import { useEffect, useState } from 'react';
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
} from 'lucide-react';
import { useSession } from '../../../contexts/SessionContext';
import { useFavorites } from '../../../contexts/FavoriteContext';
import { PropertyCard } from '../../../components/property/PropertyCard';
import { EmptyState } from '../../../components/layout';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { calculateMortgage } from '../../../utils';

// Use the same real recommendation component and logic
// already fixed for the Buyer Dashboard.
import RecommendedProperties from './RecommendedProperties';

export default function Overview({
  onNavigate,
}: {
  onNavigate: (tab: string) => void;
}) {
  const { user, recentlyViewed } = useSession();
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

  // Greeting based on time.
  const greeting = getGreetingText(
    user?.name || 'Buyer',
  );

  /*
   * Load the Buyer's viewing requests and offers
   * for the Overview KPIs.
   *
   * Recommendations are intentionally NOT loaded here.
   * The dedicated RecommendedProperties component now
   * owns that logic.
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

        // Reset only the KPI-related collections.
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
   * Mortgage Snapshot currently uses the existing
   * dashboard calculation values.
   */
  const mockPrice = 150;
  const mockDown = 20;
  const mockMonths = 36;

  const { monthly } = calculateMortgage(
    mockPrice,
    mockDown,
    mockMonths,
  );

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
            Here's what's happening with your
            property search and applications today.
          </p>
        </div>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: 'Saved Properties',
            value:
              savedProperties.length.toString(),
            icon: Heart,
            color: 'text-rose-400',
            bg: 'bg-rose-400/10',
          },
          {
            label: 'Active Viewing Requests',
            value: isOverviewLoading
              ? '—'
              : activeViewingRequests.toString(),
            icon: Eye,
            color: 'text-blue-400',
            bg: 'bg-blue-400/10',
          },
          {
            label: 'Pending Offers',
            value: isOverviewLoading
              ? '—'
              : pendingOffers.toString(),
            icon: FileCheck,
            color: 'text-emerald-400',
            bg: 'bg-emerald-400/10',
          },
          {
            label: 'Unread Messages',
            value: '3',
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
            hoverEffect="lift"
            iconBorder={true}
            valueTypography="heading"
            labelTypography="small"
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
              onNavigate('Saved Properties')
            }
            className="text-xs font-semibold text-gold-400 hover:text-gold-300"
          >
            View all
          </button>
        </div>

        {isRecentlyViewedLoading ? (
          /*
           * Keep the Recently Viewed section in a loading
           * state until the backend Property requests finish.
           */
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
          /*
           * Empty state is only rendered AFTER the
           * Recently Viewed request has completed.
           */
          <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-8">
            <EmptyState
              icon={
                <Search className="h-8 w-8 text-gold-400" />
              }
              title="No recent views"
              description="Properties you view will appear here for quick access."
              actionLabel="Explore Properties"
              onAction={() =>
                (window.location.href =
                  '/properties')
              }
            />
          </div>
        )}
      </div>

      {/* 4. Recommended Properties */}
      {/*
       * Use the SAME recommendation component that powers
       * the dedicated Buyer Recommendations section.
       *
       * This prevents Overview and Recommended Properties
       * from maintaining two separate recommendation engines.
       *
       * RecommendedProperties also owns its own loading
       * skeleton and empty state.
       */}
      <RecommendedProperties />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* 5. Market Insights */}
        <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 lg:col-span-2">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-400/10 text-purple-400">
              <TrendingUp className="h-5 w-5" />
            </div>

            <h3 className="font-heading text-lg font-bold text-cream">
              Market Insights
            </h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-center">
              <div className="mb-1 text-xs text-ink/50">
                Avg Property Price
              </div>

              <div className="font-heading text-xl font-bold text-cream">
                ₦145M
              </div>

              <div className="mt-1 text-[10px] text-emerald-400">
                +2.4% this month
              </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-center">
              <div className="mb-1 text-xs text-ink/50">
                Trending Location
              </div>

              <div className="flex items-center justify-center gap-1 font-heading text-xl font-bold text-cream">
                <MapPin className="h-4 w-4 text-gold-400" />
                Ikoyi
              </div>

              <div className="mt-1 text-[10px] text-ink/40">
                High demand
              </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-center">
              <div className="mb-1 text-xs text-ink/50">
                Market Trend
              </div>

              <div className="font-heading text-xl font-bold text-emerald-400">
                Buyer's Market
              </div>

              <div className="mt-1 text-[10px] text-ink/40">
                Favorable negotiation
              </div>
            </div>
          </div>
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

          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] p-4">
              <span className="text-sm text-ink/60">
                Target Budget
              </span>

              <span className="font-semibold text-cream">
                ₦150M
              </span>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] p-4">
              <span className="text-sm text-ink/60">
                Down Payment (20%)
              </span>

              <span className="font-semibold text-cream">
                ₦30M
              </span>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-gold-400/20 bg-gold-400/5 p-4">
              <span className="text-sm font-medium text-gold-200">
                Est. Monthly
              </span>

              <span className="font-bold text-gold-400">
                ₦
                {(monthly / 1_000_000).toFixed(2)}
                M
              </span>
            </div>
          </div>
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

        <div className="ml-4 space-y-6 border-l-2 border-white/10 pl-4">
          <div className="relative">
            <div className="absolute -left-[25px] flex h-6 w-6 items-center justify-center rounded-full border-2 border-rose-400 bg-navy-800">
              <Heart className="h-3 w-3 text-rose-400" />
            </div>

            <div className="pl-4">
              <div className="text-sm font-semibold text-cream">
                Saved a property
              </div>

              <div className="mt-1 text-xs text-ink/60">
                You saved "Luxury Victoria Island Villa"
                to your favorites.
              </div>

              <div className="mt-1 text-[10px] text-ink/40">
                2 hours ago
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-[25px] flex h-6 w-6 items-center justify-center rounded-full border-2 border-blue-400 bg-navy-800">
              <Eye className="h-3 w-3 text-blue-400" />
            </div>

            <div className="pl-4">
              <div className="text-sm font-semibold text-cream">
                Submitted viewing request
              </div>

              <div className="mt-1 text-xs text-ink/60">
                Viewing requested for "Lekki Phase 1
                Modern Duplex" on Saturday at 2:00 PM.
              </div>

              <div className="mt-1 text-[10px] text-ink/40">
                Yesterday
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-[25px] flex h-6 w-6 items-center justify-center rounded-full border-2 border-emerald-400 bg-navy-800">
              <FileCheck className="h-3 w-3 text-emerald-400" />
            </div>

            <div className="pl-4">
              <div className="text-sm font-semibold text-cream">
                Received offer update
              </div>

              <div className="mt-1 text-xs text-ink/60">
                The seller for "Ikoyi Waterfront
                Penthouse" responded to your offer.
              </div>

              <div className="mt-1 text-[10px] text-ink/40">
                2 days ago
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-[25px] flex h-6 w-6 items-center justify-center rounded-full border-2 border-ink/40 bg-navy-800">
              <Search className="h-3 w-3 text-ink/40" />
            </div>

            <div className="pl-4">
              <div className="text-sm font-semibold text-cream">
                Viewed a property
              </div>

              <div className="mt-1 text-xs text-ink/60">
                You checked out "Banana Island Mansion".
              </div>

              <div className="mt-1 text-[10px] text-ink/40">
                3 days ago
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
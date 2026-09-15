import type { Property } from '../../../types';
import { mapApiPropertiesToProperties } from '../../../api/property.mapper';
import { propertyApi } from '../../../api/property.api';
import { useEffect, useState } from 'react';
import { bookingApi } from '../../../api/booking.api';
import { offerApi } from '../../../api/offer.api';
import { getGreetingText } from '../../../utils/greeting';
import { WaveEmoji } from '../../../components/ui/WaveEmoji';
import { Heart, FileCheck, Eye, MessageSquare, TrendingUp, MapPin, Calculator, Activity, Search } from 'lucide-react';
import { useSession } from '../../../contexts/SessionContext';
import { useFavorites } from '../../../contexts/FavoriteContext';
import { PropertyCard } from '../../../components/property/PropertyCard';
import { EmptyState } from '../../../components/layout';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { calculateMortgage } from '../../../utils';

export default function Overview({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const { user, recentlyViewed } = useSession();
  const { favoriteProperties: savedProperties } = useFavorites();

  // Store the Buyer's viewing requests returned by the backend.
  const [viewingRequests, setViewingRequests] = useState<any[]>([]);

  // Store the Buyer's offers returned by the backend.
  const [offers, setOffers] = useState<any[]>([]);

  // Track the loading state for the Overview API requests.
  const [isOverviewLoading, setIsOverviewLoading] = useState(true);

  // Store backend properties using the canonical frontend Property shape.
const [recommendedProperties, setRecommendedProperties] = useState<Property[]>([]);

// Store the Buyer's recently viewed backend properties.
const [recentViewedProperties, setRecentViewedProperties] = useState<Property[]>([]);
  // 1. Greeting based on time
  const greeting = getGreetingText(user?.name || 'Buyer');

  // Load the Buyer's viewing requests and offers for the Overview KPIs.
  useEffect(() => {
    const loadOverviewData = async () => {
      try {
        // Load both resources at the same time because the Overview needs both counts.
        const [viewingsResponse, offersResponse, propertiesResponse] =
          await Promise.all([
            bookingApi.getMyBookings(),
            offerApi.getMyOffers(),
            propertyApi.getProperties({
              status: 'Published',
              availabilityStatus: 'Available',
            }),
          ]);


        // Match the response structure already used by ViewingRequests.tsx.
        setViewingRequests(viewingsResponse.data?.bookings ?? []);

        // Match the response structure already used by Offers.tsx.
        setOffers(offersResponse.data?.offers ?? []);
        // Convert the backend properties into the frontend Property shape expected by PropertyCard.
        const mappedProperties = mapApiPropertiesToProperties(
          propertiesResponse.data?.properties ??
          propertiesResponse.data?.results ??
          propertiesResponse.data ??
          [],
        );

        // Keep only the first four available properties for the Overview recommendations.
        setRecommendedProperties(mappedProperties.slice(0, 4));
      } catch (error) {
        // Keep the Overview usable if one of the dashboard requests fails.
        console.error('Failed to load Buyer Overview data:', error);

        // Reset the collections so stale data is never shown.
        setViewingRequests([]);
        setOffers([]);
        setRecommendedProperties([]);
      } finally {
        // Finish the Overview loading state after both requests complete.
        setIsOverviewLoading(false);
      }
    };

    // Fetch Overview data when the Buyer Dashboard loads this component.
    loadOverviewData();
  }, []);

    // Load the actual Properties the Buyer recently viewed.
  useEffect(() => {
    const loadRecentlyViewedProperties = async () => {
      // Clear the section when there is no viewing history.
      if (recentlyViewed.length === 0) {
        setRecentViewedProperties([]);
        return;
      }

      try {
        // Fetch only the Properties represented by the Buyer's viewing history.
        const responses = await Promise.all(
          recentlyViewed.map((propertyId) =>
            propertyApi.getPropertyById(propertyId),
          ),
        );

        // Extract the Property documents from the API responses.
        const rawProperties = responses
          .map((response) => (response as any).property)
          .filter(Boolean);

        // Convert backend Properties into the frontend shape used by PropertyCard.
        const mappedProperties =
          mapApiPropertiesToProperties(rawProperties);

        // Store the mapped recently viewed Properties.
        setRecentViewedProperties(mappedProperties as Property[]);
      } catch (error) {
        // Keep the Overview usable if recently viewed Properties cannot be loaded.
        console.error(
          'Failed to load recently viewed properties:',
          error,
        );

        setRecentViewedProperties([]);
      }
    };

    // Refresh Recently Viewed whenever the viewing history changes.
    void loadRecentlyViewedProperties();
  }, [recentlyViewed]);

  // Count viewing requests that are not completed or cancelled.
  const activeViewingRequests = viewingRequests.filter(
    (viewing) =>
      !['Completed', 'Cancelled'].includes(viewing.status),
  ).length;

  // Count offers that are still active and awaiting resolution.
  const pendingOffers = offers.filter(
    (offer) =>
      !['Accepted', 'Rejected', 'Withdrawn', 'Closed'].includes(offer.status),
  ).length;

    // Match the Buyer's recently viewed IDs against real backend Properties.
  const recentProps = recentlyViewed
    .map((id) =>
      recentViewedProperties.find((property) => property.id === id),
    )
    .filter((property): property is Property => property !== undefined)
    .slice(0, 3);



  // 6. Mortgage Snapshot Mock
  const mockPrice = 150; // 150M
  const mockDown = 20;
  const mockMonths = 36;
  const { monthly } = calculateMortgage(mockPrice, mockDown, mockMonths);

  return (
    <div className="space-y-8 pb-12">

      {/* 1. Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-6 rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-8 backdrop-blur-md">
        {user?.avatar ? (
          <img src={user.avatar} alt={user.name} className="h-16 w-16 rounded-full border-2 border-gold-400/30 object-cover" />
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
            Here's what's happening with your property search and applications today.
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
          <h3 className="font-heading text-xl font-bold text-cream">Recently Viewed</h3>
          <button
            onClick={() => onNavigate('Saved Properties')}
            className="text-xs font-semibold text-gold-400 hover:text-gold-300"
          >
            View all
          </button>
        </div>
        {recentProps.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recentProps.map(p => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-8">
            <EmptyState
              icon={<Search className="h-8 w-8 text-gold-400" />}
              title="No recent views"
              description="Properties you view will appear here for quick access."
              actionLabel="Explore Properties"
              onAction={() => window.location.href = '/properties'}
            />
          </div>
        )}
      </div>

      {/* 4. Recommended Properties */}
      <div>
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-heading text-xl font-bold text-cream">Recommended For You</h3>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {recommendedProperties.map((property) => (
            <PropertyCard
              key={property._id || property.id}
              property={property}
            />
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* 5. Market Insights */}
        <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 lg:col-span-2">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-400/10 text-purple-400">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h3 className="font-heading text-lg font-bold text-cream">Market Insights</h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-center">
              <div className="text-xs text-ink/50 mb-1">Avg Property Price</div>
              <div className="font-heading text-xl font-bold text-cream">₦145M</div>
              <div className="text-[10px] text-emerald-400 mt-1">+2.4% this month</div>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-center">
              <div className="text-xs text-ink/50 mb-1">Trending Location</div>
              <div className="font-heading text-xl font-bold text-cream flex items-center justify-center gap-1">
                <MapPin className="h-4 w-4 text-gold-400" /> Ikoyi
              </div>
              <div className="text-[10px] text-ink/40 mt-1">High demand</div>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-center">
              <div className="text-xs text-ink/50 mb-1">Market Trend</div>
              <div className="font-heading text-xl font-bold text-emerald-400">Buyer's Market</div>
              <div className="text-[10px] text-ink/40 mt-1">Favorable negotiation</div>
            </div>
          </div>
        </div>

        {/* 6. Mortgage Snapshot */}
        <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-400/10 text-gold-400">
              <Calculator className="h-5 w-5" />
            </div>
            <h3 className="font-heading text-lg font-bold text-cream">Mortgage Snapshot</h3>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 flex justify-between items-center">
              <span className="text-sm text-ink/60">Target Budget</span>
              <span className="font-semibold text-cream">₦150M</span>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 flex justify-between items-center">
              <span className="text-sm text-ink/60">Down Payment (20%)</span>
              <span className="font-semibold text-cream">₦30M</span>
            </div>
            <div className="rounded-2xl border border-gold-400/20 bg-gold-400/5 p-4 flex justify-between items-center">
              <span className="text-sm font-medium text-gold-200">Est. Monthly</span>
              <span className="font-bold text-gold-400">₦{(monthly / 1_000_000).toFixed(2)}M</span>
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
          <h3 className="font-heading text-lg font-bold text-cream">Recent Activity</h3>
        </div>
        <div className="space-y-6 pl-4 border-l-2 border-white/10 ml-4">

          <div className="relative">
            <div className="absolute -left-[25px] flex h-6 w-6 items-center justify-center rounded-full bg-navy-800 border-2 border-rose-400">
              <Heart className="h-3 w-3 text-rose-400" />
            </div>
            <div className="pl-4">
              <div className="text-sm font-semibold text-cream">Saved a property</div>
              <div className="text-xs text-ink/60 mt-1">You saved "Luxury Victoria Island Villa" to your favorites.</div>
              <div className="text-[10px] text-ink/40 mt-1">2 hours ago</div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-[25px] flex h-6 w-6 items-center justify-center rounded-full bg-navy-800 border-2 border-blue-400">
              <Eye className="h-3 w-3 text-blue-400" />
            </div>
            <div className="pl-4">
              <div className="text-sm font-semibold text-cream">Submitted viewing request</div>
              <div className="text-xs text-ink/60 mt-1">Viewing requested for "Lekki Phase 1 Modern Duplex" on Saturday at 2:00 PM.</div>
              <div className="text-[10px] text-ink/40 mt-1">Yesterday</div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-[25px] flex h-6 w-6 items-center justify-center rounded-full bg-navy-800 border-2 border-emerald-400">
              <FileCheck className="h-3 w-3 text-emerald-400" />
            </div>
            <div className="pl-4">
              <div className="text-sm font-semibold text-cream">Received offer update</div>
              <div className="text-xs text-ink/60 mt-1">The seller for "Ikoyi Waterfront Penthouse" responded to your offer.</div>
              <div className="text-[10px] text-ink/40 mt-1">2 days ago</div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-[25px] flex h-6 w-6 items-center justify-center rounded-full bg-navy-800 border-2 border-ink/40">
              <Search className="h-3 w-3 text-ink/40" />
            </div>
            <div className="pl-4">
              <div className="text-sm font-semibold text-cream">Viewed a property</div>
              <div className="text-xs text-ink/60 mt-1">You checked out "Banana Island Mansion".</div>
              <div className="text-[10px] text-ink/40 mt-1">3 days ago</div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

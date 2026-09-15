import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Download,
  Home,
  Building2,
  Eye,
  Heart,
  TrendingUp,
  Filter,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Clock,
  Award,
  Share2,
  Megaphone,
  Target,
  Video,
} from 'lucide-react';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { StatusBadge } from '../../ManagementDashboard/components/shared/StatusBadge';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { ActivityTimeline } from '../../../components/dashboard/shared/timelines/ActivityTimeline';
import { ListingDetailModal } from './modals/ListingDetailModal';
import { ROUTES } from '../../../constants/routes';
import { agentApi } from '../../../api/agent.api';
import { useToast } from '../../../contexts/ToastContext';

interface AgentProperty {
  _id: string;
  title?: string;
  description?: string;
  propertyType?: string;
  transactionType?: string;
  country?: string;
  state?: string;
  city?: string;
  area?: string;
  price?: number | null;
  currency?: string;
  priceType?: string;
  priceFrequency?: string;
  images?: string[];
  coverImage?: string | null;
  videoUrl?: string | null;
  virtualTourUrl?: string | null;
  brochureUrl?: string | null;
  floorPlans?: string[];
  documents?: Array<{
    title?: string;
    name?: string;
    type?: string;
    url?: string;
    verified?: boolean;
  }>;
  listingTier?: string;
  featuredLevel?: string;
  verificationLevel?: string;
  inspectionStatus?: string;
  status?: string;
  availabilityStatus?: string;
  assignmentStatus?: string;
  assignedAt?: string;
  assignmentRespondedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  owner?: {
    _id?: string;
    fullName?: string;
    email?: string;
  } | null;
  agency?: {
    _id?: string;
    name?: string;
    status?: string;
  } | null;
  agent?: string | null;
}

interface ListingRow {
  id: string;
  propertyId: string;
  property: string;
  location: string;
  price: string;
  status: string;
  views: number;
  inquiries: number;
  daysOnMarket: number;
  qualityScore: number;
  propertyType: string;
  transactionType: string;
  verificationLevel: string;
  assignmentStatus: string;
  coverImage: string;
  description: string;
  owner: string;
  agency: string;
  images: string[];
  documents: AgentProperty['documents'];
  videoUrl: string;
  virtualTourUrl: string;
  brochureUrl: string;
  floorPlans: string[];
}

export default function MyListings() {
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Store the current listing search text.
  const [searchQuery, setSearchQuery] = useState('');

  // Store accepted Properties returned by the backend.
  const [properties, setProperties] = useState<AgentProperty[]>([]);

  // Track the initial Listings request.
  const [loading, setLoading] = useState(true);

  // Track the Listing currently opened in the details modal.
  const [selectedListing, setSelectedListing] =
    useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    // Load the authenticated Agent's accepted Listings.
    const loadListings = async () => {
      try {
        // Request accepted Properties from the backend.
        const response = await agentApi.getMyListings();

        // Read the unwrapped Property collection returned by the HTTP client.
        const listingProperties = response.properties || [];

        // Store the real Properties in local state.
        setProperties(listingProperties);
      } catch (error) {
        // Notify the Agent when the Listing request fails.
        showToast({
          type: 'error',
          title: 'Unable to load listings',
          description:
            'We could not retrieve your accepted properties.',
        });
      } finally {
        // Finish the loading state regardless of request outcome.
        setLoading(false);
      }
    };

    // Load Listings when the page mounts.
    loadListings();
  }, [showToast]);

  // Convert backend Properties into the table shape used by the existing UI.
  const listings = useMemo<ListingRow[]>(() => {
    return properties.map((property) => {
      // Calculate how many days the Property has existed in the Agent's portfolio.
      const createdDate = property.createdAt
        ? new Date(property.createdAt)
        : new Date();

      // Calculate days from creation until today.
      const daysOnMarket = Math.max(
        0,
        Math.floor(
          (Date.now() - createdDate.getTime()) /
            (1000 * 60 * 60 * 24),
        ),
      );

      // Calculate an honest content-quality score from available listing content.
      const qualityFields = [
        Boolean(property.title),
        Boolean(property.description),
        Boolean(property.images?.length),
        Boolean(property.videoUrl),
        Boolean(property.virtualTourUrl),
        Boolean(property.brochureUrl),
        Boolean(property.floorPlans?.length),
        Boolean(property.documents?.length),
      ];

      // Convert available content fields into a percentage.
      const qualityScore = Math.round(
        (qualityFields.filter(Boolean).length /
          qualityFields.length) *
          100,
      );

      // Format the real Property price for display.
      const formattedPrice =
        typeof property.price === 'number'
          ? new Intl.NumberFormat('en-NG', {
              style: 'currency',
              currency: property.currency || 'NGN',
              maximumFractionDigits: 0,
            }).format(property.price)
          : 'Price on request';

      // Build the readable Property location.
      const location =
        [property.area, property.city, property.state]
          .filter(Boolean)
          .join(', ') || 'Location unavailable';

      return {
        // Use MongoDB's Property ID as the stable Listing ID.
        id: property._id,

        // Preserve the original Property ID separately.
        propertyId: property._id,

        // Display the real Property title.
        property: property.title || 'Untitled Property',

        // Display the real Property location.
        location,

        // Display the real Property price.
        price: formattedPrice,

        // Display the actual Property lifecycle status.
        status: property.status || 'Draft',

        // Property views are not yet supplied by the Agent Listings endpoint.
        views: 0,

        // Property inquiries are not yet supplied by the Agent Listings endpoint.
        inquiries: 0,

        // Use the Property creation date as the current DOM basis.
        daysOnMarket,

        // Use available Property content to calculate a real completeness score.
        qualityScore,

        // Preserve the real Property category.
        propertyType: property.propertyType || 'Unknown',

        // Preserve the real transaction type.
        transactionType: property.transactionType || 'Unknown',

        // Preserve the real verification level.
        verificationLevel:
          property.verificationLevel || 'Unverified',

        // Preserve the accepted assignment state.
        assignmentStatus:
          property.assignmentStatus || 'Agent Accepted',

        // Prefer the cover image, then fall back to the first Property image.
        coverImage:
          property.coverImage ||
          property.images?.[0] ||
          '',

        // Preserve the real Property description.
        description: property.description || '',

        // Preserve the Owner name when available.
        owner: property.owner?.fullName || 'Private Owner',

        // Preserve the Agency name when available.
        agency: property.agency?.name || '—',

        // Preserve the gallery images.
        images: property.images || [],

        // Preserve Property documents.
        documents: property.documents || [],

        // Preserve optional media URLs.
        videoUrl: property.videoUrl || '',
        virtualTourUrl: property.virtualTourUrl || '',
        brochureUrl: property.brochureUrl || '',

        // Preserve available floor plans.
        floorPlans: property.floorPlans || [],
      };
    });
  }, [properties]);

  // Filter real Listings using the existing search field.
  const filteredListings = useMemo(() => {
    const search = searchQuery.toLowerCase();

    return listings.filter(
      (listing) =>
        listing.property.toLowerCase().includes(search) ||
        listing.location.toLowerCase().includes(search),
    );
  }, [listings, searchQuery]);

  // Calculate the total portfolio value from the real Property prices.
  const portfolioValue = useMemo(() => {
    const total = properties.reduce((sum, property) => {
      return sum + (typeof property.price === 'number' ? property.price : 0);
    }, 0);

    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(total);
  }, [properties]);

  // Calculate average days on market across the current Agent portfolio.
  const averageDaysOnMarket = useMemo(() => {
    if (listings.length === 0) {
      return 0;
    }

    const totalDays = listings.reduce(
      (sum, listing) => sum + listing.daysOnMarket,
      0,
    );

    return Math.round(totalDays / listings.length);
  }, [listings]);

  // Calculate the average content completeness score.
  const averageQualityScore = useMemo(() => {
    if (listings.length === 0) {
      return 0;
    }

    const totalScore = listings.reduce(
      (sum, listing) => sum + listing.qualityScore,
      0,
    );

    return Math.round(totalScore / listings.length);
  }, [listings]);

  // Count Listings currently in Draft or Pending Review status.
  const readyToPublishCount = useMemo(() => {
    return properties.filter(
      (property) =>
        property.status === 'Draft' ||
        property.status === 'Pending Review',
    ).length;
  }, [properties]);

  // Count Listings that are already Published.
  const activeMarketingCount = useMemo(() => {
    return properties.filter(
      (property) => property.status === 'Published',
    ).length;
  }, [properties]);

  // Count Listings with a content score below 70.
  const needsOptimizationCount = useMemo(() => {
    return listings.filter(
      (listing) => listing.qualityScore < 70,
    ).length;
  }, [listings]);

  // Calculate percentages used by the workflow status bars.
  const portfolioCount = properties.length || 1;

  const readyToPublishPercentage = Math.min(
    100,
    Math.round((readyToPublishCount / portfolioCount) * 100),
  );

  const activeMarketingPercentage = Math.min(
    100,
    Math.round((activeMarketingCount / portfolioCount) * 100),
  );

  const needsOptimizationPercentage = Math.min(
    100,
    Math.round((needsOptimizationCount / portfolioCount) * 100),
  );

  // Calculate the percentage of Listings containing at least one useful image.
  const imageReadyPercentage = useMemo(() => {
    if (properties.length === 0) {
      return 0;
    }

    const imageReady = properties.filter(
      (property) => Boolean(property.images?.length),
    ).length;

    return Math.round(
      (imageReady / properties.length) * 100,
    );
  }, [properties]);

  // Build marketing suggestions from real Listing content gaps.
  const marketingSuggestions = useMemo(() => {
    const suggestions: {
      text: string;
      icon: typeof Video;
      color: string;
      impact: string;
    }[] = [];

    const propertyWithoutVideo = listings.find(
      (listing) => !listing.videoUrl,
    );

    if (propertyWithoutVideo) {
      suggestions.push({
        text: `Add Video Tour to ${propertyWithoutVideo.property}`,
        icon: Video,
        color: 'text-rose-400',
        impact: 'High',
      });
    }

    const propertyWithoutVirtualTour = listings.find(
      (listing) => !listing.virtualTourUrl,
    );

    if (propertyWithoutVirtualTour) {
      suggestions.push({
        text: `Add Virtual Tour to ${propertyWithoutVirtualTour.property}`,
        icon: Sparkles,
        color: 'text-gold-400',
        impact: 'Medium',
      });
    }

    const propertyWithFewImages = listings.find(
      (listing) => listing.images.length < 5,
    );

    if (propertyWithFewImages) {
      suggestions.push({
        text: `Refresh photos for ${propertyWithFewImages.property}`,
        icon: Share2,
        color: 'text-blue-400',
        impact: 'High',
      });
    }

    return suggestions.slice(0, 3);
  }, [listings]);

  // Build real content optimization checklist values from the Agent portfolio.
  const optimizationChecklist = useMemo(() => {
    if (properties.length === 0) {
      return [
        {
          task: 'Professional Photography (15+)',
          completed: false,
        },
        {
          task: 'Virtual Tour / 3D Walkthrough',
          completed: false,
        },
        {
          task: 'Floor Plans Uploaded',
          completed: false,
        },
        {
          task: 'SEO Optimized Description',
          completed: false,
        },
      ];
    }

    return [
      {
        task: 'Professional Photography (15+)',
        completed: properties.every(
          (property) => (property.images?.length || 0) >= 15,
        ),
      },
      {
        task: 'Virtual Tour / 3D Walkthrough',
        completed: properties.every(
          (property) => Boolean(property.virtualTourUrl),
        ),
      },
      {
        task: 'Floor Plans Uploaded',
        completed: properties.every(
          (property) => Boolean(property.floorPlans?.length),
        ),
      },
      {
        task: 'SEO Optimized Description',
        completed: properties.every(
          (property) =>
            Boolean(property.description) &&
            property.description.trim().length >= 120,
        ),
      },
    ];
  }, [properties]);

  // Build alerts only when a real Listing has an obvious optimization issue.
  const expiringAlerts = useMemo(() => {
    return listings
      .filter(
        (listing) =>
          listing.daysOnMarket >= 90 ||
          listing.qualityScore < 50,
      )
      .slice(0, 3)
      .map((listing) => ({
        property: listing.property,
        reason:
          listing.daysOnMarket >= 90
            ? `${listing.daysOnMarket} days on market — review pricing and promotion.`
            : 'Listing content quality is below the recommended threshold.',
        urgency:
          listing.daysOnMarket >= 120 ||
          listing.qualityScore < 40
            ? 'High'
            : 'Medium',
      }));
  }, [listings]);

  // Build the promotion timeline from real portfolio items.
  const promotionCalendar = useMemo(() => {
    return listings.slice(0, 2).map((listing, index) => ({
      title:
        index === 0
          ? 'Review Listing Promotion'
          : 'Review Content Strategy',
      desc: listing.property,
      time: 'Portfolio',
      icon: index === 0 ? Share2 : Megaphone,
      color:
        index === 0
          ? 'text-rose-400'
          : 'text-blue-400',
    }));
  }, [listings]);

  // Open the details modal for a selected Listing.
  const handleViewListing = (
    listing: Record<string, unknown>,
  ) => {
    setSelectedListing(listing);
  };

  return (
    <div className="space-y-6 pb-12">
      <DashboardHeader
        name="Listing Workflow Intelligence"
        subtitle="My Listings contains properties that are currently assigned to you and have been accepted for active management."
        actions={
          <div className="flex gap-3">
            <GhostButton className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </GhostButton>

            <GoldButton
              onClick={() => navigate(ROUTES.CREATE_LISTING)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Listing
            </GoldButton>
          </div>
        }
      />

      {/* INTELLIGENCE HEADER */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="md:col-span-2 bg-gradient-to-br from-navy-800 to-navy-900 border border-white/10 rounded-2xl p-6 flex flex-col justify-center h-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-400/20 rounded-xl">
              <Megaphone className="h-6 w-6 text-blue-400" />
            </div>

            <h4 className="font-bold text-cream text-lg">
              Marketing Campaign Summary
            </h4>
          </div>

          <p className="text-sm text-ink/80 leading-relaxed mb-4">
            Your portfolio currently contains{' '}
            <strong className="text-emerald-400">
              {properties.length} accepted{' '}
              {properties.length === 1
                ? 'property'
                : 'properties'}
            </strong>
            . Average content completeness is{' '}
            <strong className="text-gold-400">
              {averageQualityScore}/100
            </strong>
            . Listing engagement metrics will appear here once the
            Agent analytics workflow is connected.
          </p>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
            <div>
              <div className="text-xs text-ink/60 mb-1">
                Portfolio
              </div>
              <div className="text-lg font-bold text-blue-400">
                {properties.length}
              </div>
            </div>

            <div>
              <div className="text-xs text-ink/60 mb-1">
                Image Ready
              </div>
              <div className="text-lg font-bold text-emerald-400">
                {imageReadyPercentage}%
              </div>
            </div>

            <div>
              <div className="text-xs text-ink/60 mb-1">
                Avg Content Score
              </div>
              <div className="text-lg font-bold text-gold-400">
                {averageQualityScore}
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-1 rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col h-full justify-between">
          <div>
            <h3 className="text-sm font-semibold text-ink/60 mb-4 flex items-center gap-2">
              <Target className="h-4 w-4 text-emerald-400" />
              Listing Workflow Status
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-cream font-medium">
                    Ready to Publish
                  </span>

                  <span className="text-blue-400">
                    {readyToPublishCount}
                  </span>
                </div>

                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-400 rounded-full"
                    style={{
                      width: `${readyToPublishPercentage}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-cream font-medium">
                    Active Marketing
                  </span>

                  <span className="text-emerald-400">
                    {activeMarketingCount}
                  </span>
                </div>

                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full"
                    style={{
                      width: `${activeMarketingPercentage}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-cream font-medium">
                    Needs Optimization
                  </span>

                  <span className="text-rose-400">
                    {needsOptimizationCount}
                  </span>
                </div>

                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-400 rounded-full"
                    style={{
                      width: `${needsOptimizationPercentage}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-1 rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col h-full">
          <h3 className="text-sm font-semibold text-ink/60 mb-4 text-center">
            Listing Renewal Tracker
          </h3>

          <div className="flex-1 flex flex-col justify-center gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink/60">
                Content Ready
              </span>

              <span className="text-sm font-medium text-emerald-400">
                {imageReadyPercentage}%
              </span>
            </div>

            <div className="w-full bg-white/5 rounded-full h-1.5">
              <div
                className="bg-emerald-400 h-1.5 rounded-full"
                style={{
                  width: `${imageReadyPercentage}%`,
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-ink/60">
                Action Required
              </span>

              <span className="text-sm font-medium text-rose-400">
                {needsOptimizationPercentage}%
              </span>
            </div>

            <div className="w-full bg-white/5 rounded-full h-1.5">
              <div
                className="bg-rose-400 h-1.5 rounded-full"
                style={{
                  width: `${needsOptimizationPercentage}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Properties"
          value={String(properties.length)}
          trend="Accepted portfolio"
          trendColor="text-emerald-400"
          icon={Building2}
        />

        <KPICard
          title="Portfolio Value"
          value={portfolioValue}
          trend="Based on current listing prices"
          trendColor="text-gold-400"
          icon={TrendingUp}
        />

        <KPICard
          title="Avg Days on Market"
          value={String(averageDaysOnMarket)}
          trend="Calculated from Property creation"
          trendColor="text-emerald-400"
          icon={Clock}
        />

        <KPICard
          title="Content Quality"
          value={`${averageQualityScore}/100`}
          trend="Listing completeness"
          trendColor="text-blue-400"
          icon={Award}
        />
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Main Table Area */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <DataTableToolbar
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder="Search listings..."
            />

            <GhostButton className="hidden sm:flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </GhostButton>
          </div>

          {loading ? (
            // Keep the table area stable while the real portfolio loads.
            <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-8 text-center">
              <div className="text-sm text-ink/60">
                Loading your listings...
              </div>
            </div>
          ) : filteredListings.length > 0 ? (
            <DataTable
              keyExtractor={(item: ListingRow) => item.id}
              columns={[
                {
                  header: 'Property',
                  render: (listing: ListingRow) => (
                    <div className="flex items-center gap-3">
                      {listing.coverImage ? (
                        <img
                          src={listing.coverImage}
                          alt={listing.property}
                          className="h-10 w-12 rounded-xl object-cover border border-white/10"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-cream">
                          <Home className="h-5 w-5 text-emerald-400" />
                        </div>
                      )}

                      <div>
                        <div className="font-semibold text-cream">
                          {listing.property}
                        </div>

                        <div className="text-xs text-ink/60">
                          {listing.location}
                        </div>
                      </div>
                    </div>
                  ),
                },

                {
                  header: 'Price',
                  render: (listing: ListingRow) => (
                    <div className="font-bold text-emerald-400">
                      {listing.price}
                    </div>
                  ),
                },

                {
                  header: 'Visibility',
                  render: (listing: ListingRow) => (
                    <div>
                      <div className="flex items-center gap-1.5 mb-1 text-sm text-cream">
                        <Eye className="h-3.5 w-3.5 text-blue-400" />
                        {listing.views}
                      </div>

                      <div className="flex items-center gap-1.5 text-sm text-cream">
                        <Heart className="h-3.5 w-3.5 text-rose-400" />
                        {listing.inquiries}
                      </div>

                      <div className="text-[10px] text-ink/40">
                        Analytics pending
                      </div>
                    </div>
                  ),
                },

                {
                  header: 'Quality',
                  render: (listing: ListingRow) => (
                    <div className="w-24">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-ink/60">
                          Score
                        </span>

                        <span className="text-cream">
                          {listing.qualityScore}
                        </span>
                      </div>

                      <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className={`h-full ${
                            listing.qualityScore >= 90
                              ? 'bg-emerald-400'
                              : listing.qualityScore >= 70
                                ? 'bg-gold-400'
                                : 'bg-rose-400'
                          }`}
                          style={{
                            width: `${listing.qualityScore}%`,
                          }}
                        />
                      </div>
                    </div>
                  ),
                },

                {
                  header: 'Status / DOM',
                  render: (listing: ListingRow) => (
                    <div>
                      <StatusBadge status={listing.status} />

                      <div className="text-xs text-ink/50 mt-1">
                        {listing.daysOnMarket} DOM
                      </div>
                    </div>
                  ),
                },

                {
                  header: 'Actions',
                  render: (listing: ListingRow) => (
                    <GhostButton
                      onClick={() =>
                        handleViewListing(
                          listing as unknown as Record<
                            string,
                            unknown
                          >,
                        )
                      }
                      className="h-8 px-3 text-xs"
                    >
                      View Details
                    </GhostButton>
                  ),
                },
              ]}
              data={filteredListings}
              onRowClick={(listing: ListingRow) =>
                handleViewListing(
                  listing as unknown as Record<
                    string,
                    unknown
                  >,
                )
              }
            />
          ) : (
            <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-8">
              <div className="flex flex-col items-center text-center">
                <Building2 className="h-10 w-10 text-gold-400 mb-3" />

                <h3 className="text-lg font-semibold text-cream">
                  No accepted listings yet.
                </h3>

                <p className="text-sm text-ink/60 mt-1">
                  Properties you accept from Incoming Assignments
                  will appear here.
                </p>

                {!loading && properties.length === 0 && (
                  <GoldButton
                    className="mt-5"
                    onClick={() => navigate(ROUTES.CREATE_LISTING)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Listing
                  </GoldButton>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Intelligence Side Panel */}
        <div className="space-y-6 lg:col-span-1">
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-gold-400" />
              Automated Marketing
            </h3>

            <div className="space-y-3">
              {marketingSuggestions.length > 0 ? (
                marketingSuggestions.map((rec, idx) => (
                  <div
                    key={idx}
                    className="flex gap-3 bg-navy-900/50 p-3 rounded-xl border border-white/5 cursor-pointer hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="pt-0.5">
                      <rec.icon
                        className={`h-4 w-4 ${rec.color}`}
                      />
                    </div>

                    <div>
                      <div className="text-xs text-cream leading-relaxed">
                        {rec.text}
                      </div>

                      <div
                        className={`text-[10px] mt-1 ${
                          rec.impact === 'High'
                            ? 'text-emerald-400'
                            : 'text-blue-400'
                        }`}
                      >
                        {rec.impact} Impact
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-ink/50">
                  No immediate marketing recommendations.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-rose-400" />
              Expiring Alerts
            </h3>

            <div className="space-y-3">
              {expiringAlerts.length > 0 ? (
                expiringAlerts.map((alert, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border ${
                      alert.urgency === 'High'
                        ? 'bg-rose-500/10 border-rose-500/30'
                        : 'bg-navy-900/50 border-white/5'
                    }`}
                  >
                    <div className="text-xs font-bold text-cream mb-1">
                      {alert.property}
                    </div>

                    <div className="text-[10px] text-ink/80">
                      {alert.reason}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-ink/50">
                  No active listing alerts.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              Optimization Checklist
            </h3>

            <div className="space-y-3">
              {optimizationChecklist.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2"
                >
                  <input
                    type="checkbox"
                    checked={item.completed}
                    readOnly
                    className="mt-0.5 accent-gold-400 bg-white/5 border-white/10"
                  />

                  <span
                    className={`text-xs ${
                      item.completed
                        ? 'text-ink/40 line-through'
                        : 'text-cream'
                    }`}
                  >
                    {item.task}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <ActivityTimeline
            title="Property Promotion Calendar"
            items={promotionCalendar}
          />
        </div>
      </div>

      <ListingDetailModal
        isOpen={!!selectedListing}
        onClose={() => setSelectedListing(null)}
        listing={selectedListing}
      />
    </div>
  );
}
import { useState, useEffect, useMemo } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import {
  Bed,
  Bath,
  Maximize,
  MapPin,
  BadgeCheck,
  AlertTriangle,
  CheckCircle2,
  Share2,
  LayoutGrid,
  Video,
  X,
  Heart,
  Scale,
  Download,
  FileText,
} from 'lucide-react';

// Import the Property API used to retrieve the published Property from the backend.
import { propertyApi } from '../../api/property.api';

// Import the mapper that converts backend Property data into the frontend Property shape.
import {
  mapApiPropertyToProperty,
  mapApiPropertiesToProperties,
} from '../../api/property.mapper';

// Import the canonical frontend Property type.
import type { Property } from '../../types';

import {
  PageLayout,
  Container,
  Section,
  Breadcrumb,
} from '../../components/layout';

import {
  GoldButton,
  GhostButton,
} from '../../components/ui/ui';

import { formatCurrency } from '../../utils';

import { PropertyCard } from '../../components/property/PropertyCard';
import { PropertyMap } from '../../components/property/PropertyMap';
import { PropertyGallery } from '../../components/property/PropertyGallery';
import { PropertySidebar } from '../../components/property/PropertySidebar';
import { MortgageCalculator } from '../../components/property/MortgageCalculator';

import { useSession } from '../../contexts/SessionContext';
import { useFavorites } from '../../contexts/FavoriteContext';
import { useToast } from '../../contexts/ToastContext';

import {
  agentNameToSlug,
  agencyNameToSlug,
} from '../../utils/agency';

import { ROUTES } from '../../constants/routes';
import { getSimilarProperties } from '../../utils/propertyRecommendations';

// Describe the unwrapped response returned by the public Property details API.
interface PropertyDetailsResponse {
  // Store the backend Property returned by the endpoint.
  property: unknown;
}

// Build the human-readable price period shown beneath the Property price.
const getPricePeriodLabel = (property: Property) => {
  // A total property price should never be described as monthly.
  if (property.priceFrequency === 'total') {
    return 'Total price';
  }

  // Display the actual monthly frequency when supplied by the backend.
  if (property.priceFrequency === 'monthly') {
    return 'Per month';
  }

  // Display yearly pricing accurately.
  if (property.priceFrequency === 'yearly') {
    return 'Per year';
  }

  // Display nightly pricing for short-let listings.
  if (property.priceFrequency === 'perNight') {
    return 'Per night';
  }

  // Display per-plot pricing for land listings.
  if (property.priceFrequency === 'perPlot') {
    return 'Per plot';
  }

  // Display per-acre pricing for land listings.
  if (property.priceFrequency === 'perAcre') {
    return 'Per acre';
  }

  // Use a neutral fallback when the pricing frequency is unavailable.
  return 'Price details available';
};

export default function PropertyDetailsPage() {
  // Read the Property ID from the current route.
  const { id } = useParams<{ id: string }>();

  // Provide navigation for the existing page actions.
  const navigate = useNavigate();

  // Store the Property returned by the backend.
  const [property, setProperty] = useState<Property | null>(null);

  // Track whether the Property request is still loading.
  const [isLoadingProperty, setIsLoadingProperty] = useState(true);

  // Store a readable error when the Property cannot be loaded.
  const [propertyError, setPropertyError] = useState<string | null>(null);

  // Retrieve the existing Property-related session actions.
  const {
    addRecentlyViewed,
    openScheduleViewingModal,
    toggleCompareProperty,
    recentlyViewed,
  } = useSession();

  const { isFavorite, toggleFavorite } = useFavorites();

  // Retrieve the published Property from the backend whenever the route ID changes.
  useEffect(() => {
    // Track whether this request is still associated with the current page instance.
    let isActive = true;

    // Fetch the Property details from the public API.
    const fetchProperty = async () => {
      // Stop when the route does not contain a Property ID.
      if (!id) {
        setPropertyError('Property ID is missing.');
        setIsLoadingProperty(false);
        return;
      }

      try {
        // Start the Property loading state.
        setIsLoadingProperty(true);

        // Clear any previous request error.
        setPropertyError(null);

        // Request the published Property by MongoDB ID.
        const response = (await propertyApi.getPropertyById(
          id,
        )) as unknown as PropertyDetailsResponse;

        // Ignore stale responses when the route has already changed.
        if (!isActive) {
          return;
        }

        // Treat a missing Property as a not-found condition.
        if (!response?.property) {
          setProperty(null);
          setPropertyError('Property not found.');
          return;
        }

        // Convert the backend Property into the frontend Property shape.
        const mappedProperty = mapApiPropertyToProperty(
          response.property,
        ) as Property;

        // Store the mapped Property for the existing page UI.
        setProperty(mappedProperty);

        // Create or reuse an anonymous browser identifier for analytics tracking.
        const storedVisitorId =
          localStorage.getItem('luxora_visitor_id');

        const visitorId =
          storedVisitorId ||
          (typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID()
            : `visitor-${Date.now()}-${Math.random()
                .toString(36)
                .slice(2)}`);

        // Persist the visitor identifier so repeated views can be deduplicated.
        if (!storedVisitorId) {
          localStorage.setItem(
            'luxora_visitor_id',
            visitorId,
          );
        }

        // Record the real Property view without blocking the Property Details page.
        void propertyApi
          .recordPropertyView(id, visitorId)
          .catch((viewError) => {
            // Keep analytics failures from breaking the Property Details page.
            console.error(
              'Failed to record Property view:',
              viewError,
            );
          });
      } catch (requestError) {
        // Ignore errors from an obsolete request.
        if (!isActive) {
          return;
        }

        // Clear stale Property data.
        setProperty(null);

        // Store the request error for the page state.
        setPropertyError(
          requestError instanceof Error
            ? requestError.message
            : 'Unable to load Property details.',
        );
      } finally {
        // Stop the loading state for the active request.
        if (isActive) {
          setIsLoadingProperty(false);
        }
      }
    };

    // Start the backend Property request.
    fetchProperty();

    // Mark the request inactive when the component unmounts or the ID changes.
    return () => {
      isActive = false;
    };
  }, [id]);

  // Contact Agent Modal State
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  const { showToast } = useToast();

  // Tabs State
  const [activeTab, setActiveTab] = useState('Overview');

  useEffect(() => {
    if (property) {
      addRecentlyViewed(property.id);
    }
  }, [property, addRecentlyViewed]);

  // Store published, available Properties used to calculate Similar Properties.
  const [similarPropertyCandidates, setSimilarPropertyCandidates] =
    useState<Property[]>([]);

  // Track the loading state for Similar Properties.
  const [isLoadingSimilarProperties, setIsLoadingSimilarProperties] =
    useState(true);

  // Load real published Properties that can be scored by the existing recommendation engine.
  useEffect(() => {
    let isActive = true;

    const loadSimilarPropertyCandidates = async () => {
      // Wait until the current Property has been loaded.
      if (!property) {
        setSimilarPropertyCandidates([]);
        setIsLoadingSimilarProperties(false);
        return;
      }

      try {
        // Start the Similar Properties loading state.
        setIsLoadingSimilarProperties(true);

        // Request real published, available properties.
        // Keep the same transaction type so buy listings recommend buy listings,
        // rent listings recommend rent listings, etc.
        const response = await propertyApi.getProperties({
          status: 'Published',
          availabilityStatus: 'Available',
          transactionType: property.transactionType,
          limit: 100,
        });

        // Ignore the response if the page has already changed.
        if (!isActive) {
          return;
        }

        /*
         * The HTTP client may unwrap the Axios response at runtime,
         * while the API method is still typed as AxiosResponse.
         *
         * Support the response shapes used across the application
         * without changing the shared API client.
         */
        const payload = response as unknown as {
          properties?: unknown[];
          results?: unknown[];
          data?:
            | {
                properties?: unknown[];
                results?: unknown[];
              }
            | unknown[];
        };

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

        // Convert all backend properties into the canonical frontend Property shape.
        const mappedProperties = mapApiPropertiesToProperties(
          backendProperties,
        ) as Property[];

        // Store the candidate Properties for the recommendation engine.
        setSimilarPropertyCandidates(mappedProperties);
      } catch (error) {
        // Ignore errors from an obsolete request.
        if (!isActive) {
          return;
        }

        // Keep the page usable even when Similar Properties cannot be loaded.
        console.error(
          'Failed to load Similar Properties:',
          error,
        );

        setSimilarPropertyCandidates([]);
      } finally {
        // Finish the Similar Properties loading state.
        if (isActive) {
          setIsLoadingSimilarProperties(false);
        }
      }
    };

    // Start the Similar Properties request.
    loadSimilarPropertyCandidates();

    // Mark the request inactive when the page changes.
    return () => {
      isActive = false;
    };
  }, [property]);

  // Use the existing Luxora recommendation engine instead of creating
  // a second recommendation system.
  const similarProperties = useMemo(() => {
    // Do not calculate recommendations until both the current Property
    // and candidate Properties are available.
    if (
      !property ||
      similarPropertyCandidates.length === 0
    ) {
      return [];
    }

    // Let the existing recommendation engine rank the real Properties.
    return getSimilarProperties(
      property,
      similarPropertyCandidates,
      4,
    );
  }, [property, similarPropertyCandidates]);

  // Store the real backend Properties represented by the Buyer's
  // Recently Viewed IDs.
  const [
    recentlyViewedProperties,
    setRecentlyViewedProperties,
  ] = useState<Property[]>([]);

  // Track the loading state while Recently Viewed Properties
  // are resolved through the backend.
  const [
    isLoadingRecentlyViewed,
    setIsLoadingRecentlyViewed,
  ] = useState(true);

  // Resolve the Buyer's Recently Viewed Property IDs against the real backend.
  useEffect(() => {
    let isActive = true;

    const loadRecentlyViewedProperties = async () => {
      /*
       * There is nothing to resolve when the Buyer has
       * no Recently Viewed IDs.
       */
      if (recentlyViewed.length === 0) {
        if (isActive) {
          setRecentlyViewedProperties([]);
          setIsLoadingRecentlyViewed(false);
        }

        return;
      }

      try {
        // Show loading until all Recently Viewed Properties are resolved.
        setIsLoadingRecentlyViewed(true);

        /*
         * Resolve the stored Property IDs through the real
         * Property API.
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
         * Extract the unwrapped Property records returned
         * by the Property API.
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
          ) as Property[];

        setRecentlyViewedProperties(
          mappedProperties,
        );
      } catch (error) {
        if (!isActive) {
          return;
        }

        console.error(
          'Failed to load Recently Viewed Properties:',
          error,
        );

        setRecentlyViewedProperties([]);
      } finally {
        if (isActive) {
          setIsLoadingRecentlyViewed(false);
        }
      }
    };

    void loadRecentlyViewedProperties();

    return () => {
      isActive = false;
    };
  }, [recentlyViewed]);

  /*
   * Preserve the Buyer's Recently Viewed ordering while
   * preventing the Property currently being viewed from
   * appearing in its own Recently Viewed section.
   */
  const displayedRecentlyViewedProperties =
    recentlyViewedProperties
      .filter(
        (viewedProperty) =>
          viewedProperty.id !== property?.id,
      )
      .slice(0, 4);

  // Show a simple loading state while the backend Property is being retrieved.
  if (isLoadingProperty) {
    return (
      <PageLayout>
        <Container className="pt-24 pb-24 md:pt-32">
          <div className="flex min-h-[40vh] items-center justify-center">
            <div className="text-sm text-ink/60">
              Loading Property...
            </div>
          </div>
        </Container>
      </PageLayout>
    );
  }

  // Redirect only after the backend confirms that the Property cannot be loaded.
  if (!property || propertyError) {
    return <Navigate to="/properties" replace />;
  }

  const tabs = [
    'Overview',
    'Amenities',
    'Location',
    'Floor Plan',
    'Virtual Tour',
    'Property Video',
  ];

  const saved = isFavorite(property.id);

  const handleContactSubmit = (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    setContactLoading(true);

    setTimeout(() => {
      setContactLoading(false);
      setContactSuccess(true);
    }, 1500);
  };

  const handleShareClick = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(
        window.location.href,
      );

      showToast({
        type: 'success',
        title: 'Link Copied',
        description:
          'Link copied to clipboard!',
      });
    }
  };

  const handleDownloadBrochure = () => {
    if (
      property.brochureUrl &&
      property.brochureUrl !== '#'
    ) {
      window.open(
        property.brochureUrl,
        '_blank',
      );
    } else {
      showToast({
        type: 'info',
        title: 'Coming Soon',
        description:
          'Brochure coming soon. Please contact the agent for more information.',
      });
    }
  };

  const handleCompareClick = () => {
    const result = toggleCompareProperty(
      property.id,
    );

    if (result === 'limit_reached') {
      showToast({
        type: 'warning',
        title: 'Limit Reached',
        description:
          'You can compare up to 4 properties.',
      });
    } else if (result === 'added') {
      showToast({
        type: 'success',
        title: 'Added to Compare',
        description:
          'Property added to your compare list.',
      });
    } else if (result === 'exists') {
      showToast({
        type: 'info',
        title: 'Removed from Compare',
        description:
          'Property removed from your compare list.',
      });
    }
  };

  const getTierBadge = () => {
    if (!property.listingTier) {
      return null;
    }

    if (property.listingTier === 'Pro') {
      return (
        <span className="inline-flex items-center rounded-md border border-gold-400/30 bg-gold-400/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-gold-400 shadow-[0_0_10px_rgba(212,175,55,0.2)]">
          {property.listingTier} Tier
        </span>
      );
    }

    if (property.listingTier === 'Plus') {
      return (
        <span className="inline-flex items-center rounded-md border border-blue-400/30 bg-blue-400/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-blue-400">
          Plus Tier
        </span>
      );
    }

    return (
      <span className="inline-flex items-center rounded-md border border-white/20 bg-white/5 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-cream/70">
        Basic Tier
      </span>
    );
  };

 return (
  <PageLayout footerVariant="compact">
      <Container className="pt-24 md:pt-32">
        <Breadcrumb
          items={[
            {
              label: 'Home',
              href: '/',
            },
            {
              label: 'Properties',
              href: '/properties',
            },
            {
              label: property.title,
            },
          ]}
        />

        <div className="mb-8 mt-6 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <h1 className="font-heading text-3xl font-bold text-cream sm:text-4xl">
                {property.title}
              </h1>

              {getTierBadge()}
            </div>

            <div className="mt-1 flex items-center gap-2 text-ink/70">
              <MapPin className="h-4 w-4" />
              {property.location}
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-between gap-4 text-left md:flex-col md:items-end md:gap-3 md:text-right">
            <div>
              <div className="font-heading text-3xl font-bold text-cream">
                {property.price}
              </div>

              <div className="text-sm font-medium text-gold-300">
                {getPricePeriodLabel(property)}
              </div>
            </div>

            {/* Header Action Area */}
            <div className="flex flex-wrap items-center gap-2">
              <GhostButton
                size="sm"
                className={`h-9 border border-white/10 px-3 text-xs transition-colors ${
                  saved
                    ? 'border-rose-500/20 bg-rose-500/10 text-rose-400'
                    : 'hover:border-rose-500/20 hover:bg-rose-500/10 hover:text-rose-400'
                }`}
                onClick={() =>
                  toggleFavorite(property.id)
                }
              >
                <Heart
                  className={`mr-1.5 h-3.5 w-3.5 ${
                    saved ? 'fill-current' : ''
                  }`}
                />
                {saved ? 'Saved' : 'Save'}
              </GhostButton>

              <GhostButton
                size="sm"
                className="h-9 border border-white/10 px-3 text-xs transition-colors hover:border-gold-400/20 hover:bg-gold-400/10 hover:text-gold-400"
                onClick={handleCompareClick}
              >
                <Scale className="mr-1.5 h-3.5 w-3.5" />
                Compare
              </GhostButton>

              <GhostButton
                size="sm"
                className="h-9 border border-white/10 px-3 text-xs transition-colors hover:bg-white/10"
                onClick={
                  handleDownloadBrochure
                }
              >
                <Download className="mr-1.5 h-3.5 w-3.5" />
                Brochure
              </GhostButton>

              <GhostButton
                size="sm"
                className="h-9 border border-white/10 px-3 text-xs transition-colors hover:bg-white/10"
                onClick={handleShareClick}
              >
                <Share2 className="mr-1.5 h-3.5 w-3.5" />
                Share
              </GhostButton>
            </div>
          </div>
        </div>

        {/* Gallery */}
        <PropertyGallery property={property} />
      </Container>

      <Section className="pb-24 pt-12 md:pb-32">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Main Content */}
            <div className="space-y-12 lg:col-span-2">
              {/* Quick Specs & Verification */}
              <div className="flex flex-col gap-10 border-b border-white/10 pb-10">
                <div className="flex flex-wrap items-center gap-8">
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-ink/50">
                        Bedrooms
                      </span>

                      <span className="flex items-center gap-2 font-semibold text-cream">
                        <Bed className="h-5 w-5 text-gold-400" />
                        {property.beds}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-ink/50">
                        Bathrooms
                      </span>

                      <span className="flex items-center gap-2 font-semibold text-cream">
                        <Bath className="h-5 w-5 text-gold-400" />
                        {property.baths}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-ink/50">
                        Area
                      </span>

                      <span className="flex items-center gap-2 font-semibold text-cream">
                        <Maximize className="h-5 w-5 text-gold-400" />
                        {property.area}
                      </span>
                    </div>
                  </div>

                  <div className="hidden h-12 w-px bg-white/10 md:block" />

                  <div className="flex flex-wrap gap-2">
                    {property.verified?.map(
                      (v) => (
                        <span
                          key={v}
                          className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/20 bg-gold-400/5 px-3 py-1.5 text-xs font-medium text-gold-200"
                        >
                          <BadgeCheck className="h-4 w-4 text-gold-400" />
                          {v} Verified
                        </span>
                      ),
                    )}
                  </div>
                </div>

                {/* Extended Property Facts */}
                <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-8 md:grid-cols-4">
                  <div className="cursor-default rounded-2xl border border-transparent p-4 transition-all duration-300 hover:-translate-y-1 hover:border-white/5 hover:bg-navy-800/30">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-ink/50">
                      Bedrooms
                    </span>

                    <span className="mt-1.5 block text-sm font-medium text-cream">
                      {property.beds}
                    </span>
                  </div>

                  <div className="cursor-default rounded-2xl border border-transparent p-4 transition-all duration-300 hover:-translate-y-1 hover:border-white/5 hover:bg-navy-800/30">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-ink/50">
                      Bathrooms
                    </span>

                    <span className="mt-1.5 block text-sm font-medium text-cream">
                      {property.baths}
                    </span>
                  </div>

                  <div className="cursor-default rounded-2xl border border-transparent p-4 transition-all duration-300 hover:-translate-y-1 hover:border-white/5 hover:bg-navy-800/30">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-ink/50">
                      Area
                    </span>

                    <span className="mt-1.5 block text-sm font-medium text-cream">
                      {property.area}
                    </span>
                  </div>

                  <div className="cursor-default rounded-2xl border border-transparent p-4 transition-all duration-300 hover:-translate-y-1 hover:border-white/5 hover:bg-navy-800/30">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-ink/50">
                      Parking Spaces
                    </span>

                    <span className="mt-1.5 block text-sm font-medium text-cream">
                      {property.parkingSpaces ??
                        'N/A'}
                    </span>
                  </div>

                  <div className="cursor-default rounded-2xl border border-transparent p-4 transition-all duration-300 hover:-translate-y-1 hover:border-white/5 hover:bg-navy-800/30">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-ink/50">
                      Year Built
                    </span>

                    <span className="mt-1.5 block text-sm font-medium text-cream">
                      {property.yearBuilt ??
                        'N/A'}
                    </span>
                  </div>

                  <div className="cursor-default rounded-2xl border border-transparent p-4 transition-all duration-300 hover:-translate-y-1 hover:border-white/5 hover:bg-navy-800/30">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-ink/50">
                      Property Status
                    </span>

                    <span className="mt-1.5 block text-sm font-medium text-cream">
                      {property.status ??
                        'Available'}
                    </span>
                  </div>

                  <div className="cursor-default rounded-2xl border border-transparent p-4 transition-all duration-300 hover:-translate-y-1 hover:border-white/5 hover:bg-navy-800/30">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-ink/50">
                      Verification
                    </span>

                    <span className="mt-1.5 flex items-center gap-1 text-sm font-medium text-cream">
                      {property.verified?.includes(
                        'Premium',
                      ) ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-gold-400" />
                      ) : null}

                      {property.verified?.length
                        ? 'Verified'
                        : 'Pending'}
                    </span>
                  </div>

                  <div className="cursor-default rounded-2xl border border-transparent p-4 transition-all duration-300 hover:-translate-y-1 hover:border-white/5 hover:bg-navy-800/30">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-ink/50">
                      Listing Tier
                    </span>

                    <span className="mt-1.5 block text-sm font-medium text-cream">
                      {property.listingTier ||
                        'Basic'}
                    </span>
                  </div>

                  <div className="cursor-default rounded-2xl border border-transparent p-4 transition-all duration-300 hover:-translate-y-1 hover:border-white/5 hover:bg-navy-800/30">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-ink/50">
                      Inspection Status
                    </span>

                    <span className="mt-1.5 block text-sm font-medium text-cream">
                      {property.inspectionStatus ??
                        'Pending'}
                    </span>
                  </div>

                  <div className="cursor-default rounded-2xl border border-transparent p-4 transition-all duration-300 hover:-translate-y-1 hover:border-white/5 hover:bg-navy-800/30">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-ink/50">
                      Availability Date
                    </span>

                    <span className="mt-1.5 block text-sm font-medium text-cream">
                      {property.availabilityDate ??
                        'Immediate'}
                    </span>
                  </div>

                  <div className="cursor-default rounded-2xl border border-transparent p-4 transition-all duration-300 hover:-translate-y-1 hover:border-white/5 hover:bg-navy-800/30">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-ink/50">
                      Furnishing
                    </span>

                    <span className="mt-1.5 block text-sm font-medium text-cream">
                      {property.furnishing ??
                        'N/A'}
                    </span>
                  </div>

                  <div className="cursor-default rounded-2xl border border-transparent p-4 transition-all duration-300 hover:-translate-y-1 hover:border-white/5 hover:bg-navy-800/30">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-ink/50">
                      Property Type
                    </span>

                    <span className="mt-1.5 block text-sm font-medium text-cream">
                      {property.type}
                    </span>
                  </div>

                  <div className="cursor-default rounded-2xl border border-transparent p-4 transition-all duration-300 hover:-translate-y-1 hover:border-white/5 hover:bg-navy-800/30">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-ink/50">
                      Transaction Type
                    </span>

                    <span className="mt-1.5 block text-sm font-medium capitalize text-cream">
                      {property.transactionType}
                    </span>
                  </div>
                </div>

                {/* Verified Documents */}
                {property.documents &&
                  property.documents.length >
                    0 && (
                    <div className="border-t border-white/10 pt-8">
                      <h4 className="mb-4 text-sm font-semibold text-cream">
                        Verified Documents
                      </h4>

                      <div className="flex flex-wrap gap-3">
                        {property.documents.map(
                          (doc, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 rounded-lg border border-white/10 bg-navy-800/30 px-3 py-2 text-xs"
                            >
                              <FileText className="h-3.5 w-3.5 text-ink/50" />

                              <span className="text-cream/80">
                                {doc.title}
                              </span>

                              {doc.verified ? (
                                <span className="ml-1 flex items-center gap-1 font-medium text-gold-400">
                                  <CheckCircle2 className="h-3 w-3" />
                                  Verified
                                </span>
                              ) : (
                                <span className="ml-1 flex items-center gap-1 font-medium text-ink/50">
                                  <AlertTriangle className="h-3 w-3" />
                                  Pending
                                </span>
                              )}
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
              </div>

              {/* Tabs Section */}
              <div>
                <div className="scrollbar-hide mb-6 flex overflow-x-auto border-b border-white/10">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() =>
                        setActiveTab(tab)
                      }
                      className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                        activeTab === tab
                          ? 'border-gold-400 text-gold-400'
                          : 'border-transparent text-ink/60 hover:text-cream'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div>
                  {activeTab === 'Overview' && (
                    <div className="animate-in space-y-6 fade-in duration-500">
                      <div className="space-y-4 leading-relaxed text-ink/70">
                        <p>
                          Experience unparalleled
                          luxury in this exquisite{' '}
                          {property.type.toLowerCase()}{' '}
                          located in the prestigious
                          neighborhood of{' '}
                          {property.location}.
                          Designed with meticulous
                          attention to detail, this
                          residence offers a seamless
                          blend of modern sophistication
                          and timeless elegance.
                        </p>
                      </div>

                      {property.features &&
                        property.features.length >
                          0 && (
                          <div>
                            <h4 className="mb-4 text-sm font-semibold text-cream">
                              Key Features
                            </h4>

                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                              {property.features.map(
                                (feature, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-navy-800/50 px-4 py-3 text-sm text-cream/80"
                                  >
                                    <CheckCircle2 className="h-4 w-4 shrink-0 text-gold-400" />

                                    <span className="truncate">
                                      {feature}
                                    </span>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  )}

                  {activeTab === 'Amenities' && (
                    <div className="animate-in fade-in duration-500">
                      {property.amenities &&
                      property.amenities.length >
                        0 ? (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                          {property.amenities.map(
                            (amenity) => (
                              <div
                                key={amenity}
                                className="flex items-center gap-2 rounded-xl border border-white/10 bg-navy-800/50 px-4 py-3 text-sm text-cream/80"
                              >
                                <CheckCircle2 className="h-4 w-4 shrink-0 text-gold-400" />

                                <span className="truncate">
                                  {amenity}
                                </span>
                              </div>
                            ),
                          )}
                        </div>
                      ) : (
                        <div className="rounded-xl border border-white/5 p-4 text-center text-ink/60">
                          No amenities available.
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'Location' && (
                    <div className="animate-in space-y-8 fade-in duration-500">
                      <PropertyMap
                        properties={[
                          property,
                        ]}
                        className="h-[400px] w-full overflow-hidden rounded-3xl"
                      />

                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                        <div className="rounded-xl border border-white/10 bg-navy-800/30 p-4 text-center">
                          <div className="mb-1 text-2xl font-bold text-gold-400">
                            {property.walkScore ||
                              '--'}
                            <span className="text-sm text-ink/50">
                              /100
                            </span>
                          </div>

                          <div className="text-xs uppercase tracking-wider text-cream/70">
                            Walk Score
                          </div>
                        </div>

                        <div className="rounded-xl border border-white/10 bg-navy-800/30 p-4 text-center">
                          <div className="mb-1 text-2xl font-bold text-gold-400">
                            {property.transitScore ||
                              '--'}
                            <span className="text-sm text-ink/50">
                              /100
                            </span>
                          </div>

                          <div className="text-xs uppercase tracking-wider text-cream/70">
                            Transit Score
                          </div>
                        </div>

                        <div className="rounded-xl border border-white/10 bg-navy-800/30 p-4 text-center">
                          <div className="mb-1 text-2xl font-bold text-gold-400">
                            {property.schoolScore ||
                              '--'}
                            <span className="text-sm text-ink/50">
                              /100
                            </span>
                          </div>

                          <div className="text-xs uppercase tracking-wider text-cream/70">
                            School Score
                          </div>
                        </div>
                      </div>

                      {property.nearbyPlaces &&
                        property.nearbyPlaces.length >
                          0 && (
                          <div>
                            <h4 className="mb-4 text-sm font-semibold text-cream">
                              Nearby Places
                            </h4>

                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                              {property.nearbyPlaces.map(
                                (
                                  place,
                                  idx,
                                ) => (
                                  <div
                                    key={idx}
                                    className="rounded-xl border border-white/10 bg-navy-800/30 p-4"
                                  >
                                    <div className="mb-1 flex items-start gap-1 text-sm font-medium text-cream">
                                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />

                                      <span>
                                        {
                                          place.title
                                        }
                                      </span>
                                    </div>

                                    <div className="pl-5 text-xs text-ink/50">
                                      {
                                        place.distance
                                      }
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  )}

                  {activeTab === 'Floor Plan' && (
                    <div className="animate-in flex min-h-[20rem] flex-col items-center justify-center rounded-3xl border border-white/10 bg-navy-800/50 p-8 text-center fade-in duration-500">
                      {property.floorPlans &&
                        property.floorPlans.length >
                          0 ? (
                        <>
                          <img
                            src={
                              property.floorPlans[0]
                            }
                            alt="Floor Plan"
                            loading="lazy"
                            className="mb-8 w-full max-w-2xl rounded-2xl object-contain"
                          />

                          <GhostButton
                            onClick={() =>
                              setContactModalOpen(
                                true,
                              )
                            }
                          >
                            Request Full Floor Plan
                          </GhostButton>
                        </>
                      ) : (
                        <>
                          <LayoutGrid className="mb-5 h-14 w-14 text-gold-400/30" />

                          <h4 className="mb-2 font-heading text-xl font-medium text-cream">
                            Floor plan coming soon
                          </h4>

                          <p className="mb-8 leading-relaxed text-sm text-ink/60">
                            Contact the agent to request
                            detailed floor plans
                          </p>

                          <GhostButton
                            onClick={() =>
                              setContactModalOpen(
                                true,
                              )
                            }
                          >
                            Request Floor Plan
                          </GhostButton>
                        </>
                      )}
                    </div>
                  )}

                  {activeTab === 'Virtual Tour' && (
                    <div className="animate-in flex h-[300px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-navy-800/50 p-8 text-center fade-in duration-500">
                      <Video className="mb-5 h-14 w-14 text-gold-400/30" />

                      <h4 className="mb-2 font-heading text-xl font-medium text-cream">
                        Virtual tour coming soon
                      </h4>

                      <p className="mb-8 leading-relaxed text-sm text-ink/60">
                        Request a live video
                        walkthrough from the agent
                      </p>

                      <GhostButton
                        onClick={() =>
                          openScheduleViewingModal(
                            property.id,
                          )
                        }
                      >
                        Request Virtual Tour
                      </GhostButton>
                    </div>
                  )}

                  {activeTab === 'Property Video' && (
                    <div className="animate-in flex min-h-[300px] flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-navy-800/50 p-4 text-center fade-in duration-500 md:p-8">
                      {property.videoUrl ? (
                        <div className="relative aspect-video w-full max-w-4xl overflow-hidden rounded-xl shadow-2xl">
                          <iframe
                            src={
                              property.videoUrl
                            }
                            title={`${property.title} Video Presentation`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute left-0 top-0 h-full w-full border-0"
                          />
                        </div>
                      ) : (
                        <>
                          <Video className="mb-5 h-14 w-14 text-gold-400/30" />

                          <h4 className="mb-2 font-heading text-xl font-medium text-cream">
                            Property video coming
                            soon
                          </h4>

                          <p className="mb-8 leading-relaxed text-sm text-ink/60">
                            Contact the agent to request
                            a video presentation
                          </p>

                          <GhostButton
                            onClick={() =>
                              setContactModalOpen(
                                true,
                              )
                            }
                          >
                            Request Video
                          </GhostButton>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Payment & Financing */}
              <div className="pb-4 pt-8">
                <h3 className="mb-6 font-heading text-2xl font-bold text-cream">
                  Payment & Financing
                </h3>

                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="rounded-3xl border border-white/10 bg-navy-800/30 p-6 md:p-8">
                    <h4 className="mb-6 border-b border-white/5 pb-4 text-sm font-semibold text-cream">
                      Financial Overview
                    </h4>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-white/5 py-2">
                        <span className="text-sm text-ink/60">
                          Purchase Price
                        </span>

                        <span className="text-sm font-bold text-cream">
                          {property.price}
                        </span>
                      </div>

                      <div className="flex items-center justify-between border-b border-white/5 py-2">
                        <span className="text-sm text-ink/60">
                          Deposit
                        </span>

                        <span className="text-sm font-medium text-cream">
                          {property.paymentSnapshot
                            ?.deposit ||
                            'Available on request'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between border-b border-white/5 py-2">
                        <span className="text-sm text-ink/60">
                          Agency Fee
                        </span>

                        <span className="text-sm font-medium text-cream">
                          {property.paymentSnapshot
                            ?.agencyFee ||
                            'Available on request'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between border-b border-white/5 py-2">
                        <span className="text-sm text-ink/60">
                          Legal Fee
                        </span>

                        <span className="text-sm font-medium text-cream">
                          {property.paymentSnapshot
                            ?.legalFee ||
                            'Available on request'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between border-b border-white/5 py-2">
                        <span className="text-sm text-ink/60">
                          Service Charge
                        </span>

                        <span className="text-sm font-medium text-cream">
                          {property.paymentSnapshot
                            ?.serviceCharge ||
                            'Available on request'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-ink/60">
                          Price per SQM
                        </span>

                        <span className="text-sm font-medium text-cream">
                          {property.paymentSnapshot
                            ?.pricePerSqm ||
                            'Available on request'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-navy-800/30 p-6 md:p-8">
                    <div>
                      <h4 className="mb-6 border-b border-white/5 pb-4 text-sm font-semibold text-cream">
                        Payment Plans
                      </h4>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between rounded-xl border border-white/5 bg-navy-900/50 p-3 transition-colors hover:border-gold-400/30">
                          <span className="text-sm font-medium text-cream">
                            12 Months
                          </span>

                          <span className="text-sm font-semibold text-gold-400">
                            {property.monthly
                              ? `${formatCurrency(
                                  property.priceValue /
                                    12,
                                )}/mo`
                              : 'Available on request'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between rounded-xl border border-white/5 bg-navy-900/50 p-3 transition-colors hover:border-gold-400/30">
                          <span className="text-sm font-medium text-cream">
                            24 Months
                          </span>

                          <span className="text-sm font-semibold text-gold-400">
                            {property.monthly
                              ? `${formatCurrency(
                                  property.priceValue /
                                    24,
                                )}/mo`
                              : 'Available on request'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between rounded-xl border border-white/5 bg-navy-900/50 p-3 transition-colors hover:border-gold-400/30">
                          <span className="text-sm font-medium text-cream">
                            36 Months
                          </span>

                          <span className="text-sm font-semibold text-gold-400">
                            {property.monthly
                              ? `${formatCurrency(
                                  (property.priceValue *
                                    1.1) /
                                    36,
                                )}/mo`
                              : 'Available on request'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 border-t border-white/5 pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-ink/50">
                            Mortgage Eligibility
                          </span>

                          <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-400">
                            <CheckCircle2 className="h-4 w-4" />
                            {property.mortgageSupport
                              ? 'Eligible'
                              : 'Not Eligible'}
                          </span>
                        </div>

                        <div>
                          <span className="mb-1 block text-right text-xs font-semibold uppercase tracking-widest text-ink/50">
                            Est. Monthly
                          </span>

                          <span className="text-lg font-bold text-cream">
                            {property.monthly}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mortgage Calculator */}
                <MortgageCalculator
                  property={property}
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="relative">
              <PropertySidebar
                property={property}
                onContactClick={() =>
                  setContactModalOpen(true)
                }
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* Related Properties */}
      <Section className="border-t border-white/5 bg-navy-900">
        <Container>
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="font-heading text-2xl font-bold text-cream">
                Similar Properties
              </h2>

              <p className="mt-1 text-sm text-ink/50">
                Properties selected based on type, location,
                price, and size.
              </p>
            </div>
          </div>

          {isLoadingSimilarProperties ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2, 3, 4].map(
                (item) => (
                  <div
                    key={item}
                    className="h-[420px] animate-pulse rounded-3xl border border-white/10 bg-navy-800/50"
                  />
                ),
              )}
            </div>
          ) : similarProperties.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {similarProperties.map(
                (p) => (
                  <PropertyCard
                    key={p.id}
                    property={p}
                  />
                ),
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-8 text-center">
              <p className="text-sm text-ink/60">
                No similar properties are currently available.
              </p>
            </div>
          )}
        </Container>
      </Section>

      {/* Recently Viewed */}
      <Section className="border-t border-white/5 bg-navy-900 pb-24">
        <Container>
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-heading text-2xl font-bold text-cream">
              Recently Viewed
            </h2>
          </div>

          {isLoadingRecentlyViewed ? (
            /*
             * Do not show the empty state while the backend
             * Recently Viewed requests are still loading.
             */
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-[420px] animate-pulse rounded-3xl border border-white/10 bg-navy-800/50"
                />
              ))}
            </div>
          ) : displayedRecentlyViewedProperties.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {displayedRecentlyViewedProperties.map(
                (viewedProperty) => (
                  <PropertyCard
                    key={viewedProperty.id}
                    property={viewedProperty}
                  />
                ),
              )}
            </div>
          ) : (
            /*
             * Only show the empty state after loading finishes.
             */
            <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-8 text-center">
              <p className="text-sm text-ink/60">
                No recently viewed properties yet.
              </p>
            </div>
          )}
        </Container>
      </Section>

      {/* Contact Agent Modal */}
      {contactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/90 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-navy-800 p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-300 md:p-8">
            <button
              className="absolute right-6 top-6 rounded-full p-2 text-ink/50 transition-colors hover:bg-white/5 hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
              onClick={() => {
                setContactModalOpen(false);
                setContactSuccess(false);
              }}
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="mb-2 font-heading text-2xl font-bold text-cream">
              Contact {property.agent.name}
            </h3>

            <div className="mb-6 flex items-center gap-3 border-b border-white/5 pb-6">
              <button
                onClick={() =>
                  navigate(
                    ROUTES.AGENT_DETAILS.replace(
                      ':slug',
                      agentNameToSlug(
                        property.agent.name,
                      ),
                    ),
                  )
                }
                className="shrink-0 transition-transform hover:scale-105 focus:outline-none"
              >
                <img
                  src={property.agent.avatar}
                  alt={property.agent.name}
                  className="h-10 w-10 rounded-full border border-gold-400/30 object-cover transition-colors hover:border-gold-400/80"
                />
              </button>

              <div>
                <button
                  onClick={() =>
                    navigate(
                      ROUTES.AGENT_DETAILS.replace(
                        ':slug',
                        agentNameToSlug(
                          property.agent.name,
                        ),
                      ),
                    )
                  }
                  className="block text-left text-sm font-semibold text-cream transition-colors hover:text-gold-400 focus:outline-none"
                >
                  {property.agent.name}
                </button>

                <button
                  onClick={() =>
                    navigate(
                      ROUTES.AGENCY_DETAILS.replace(
                        ':slug',
                        agencyNameToSlug(
                          property.agent.agency,
                        ),
                      ),
                    )
                  }
                  className="block w-full text-left text-xs text-ink/50 transition-colors hover:text-gold-300 focus:outline-none"
                >
                  {property.agent.agency}
                </button>
              </div>
            </div>

            {contactSuccess ? (
              <div className="py-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-400">
                  <CheckCircle2 className="h-8 w-8" />
                </div>

                <h4 className="mb-2 text-xl font-bold text-cream">
                  Message Sent!
                </h4>

                <p className="mb-8 text-ink/60">
                  The agent will be in touch within 24
                  hours.
                </p>

                <GhostButton
                  className="h-12 w-full justify-center"
                  onClick={() => {
                    setContactModalOpen(false);
                    setContactSuccess(false);
                  }}
                >
                  Close
                </GhostButton>
              </div>
            ) : (
              <form
                onSubmit={handleContactSubmit}
                className="space-y-4"
              >
                <div>
                  <input
                    type="text"
                    placeholder="Your full name"
                    required
                    className="w-full rounded-xl border border-white/10 bg-navy-900/50 px-4 py-3 text-sm text-cream shadow-inner transition-all placeholder:text-ink/50 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    required
                    className="w-full rounded-xl border border-white/10 bg-navy-900/50 px-4 py-3 text-sm text-cream shadow-inner transition-all placeholder:text-ink/50 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50"
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    placeholder="+234 800 000 0000"
                    required
                    className="w-full rounded-xl border border-white/10 bg-navy-900/50 px-4 py-3 text-sm text-cream shadow-inner transition-all placeholder:text-ink/50 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50"
                  />
                </div>

                <div>
                  <textarea
                    rows={4}
                    required
                    defaultValue={`I am interested in ${property.title} and would like more information.`}
                    className="w-full resize-none rounded-xl border border-white/10 bg-navy-900/50 px-4 py-3 text-sm text-cream shadow-inner transition-all placeholder:text-ink/50 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50"
                  />
                </div>

                <div className="pt-2">
                  <GoldButton
                    type="submit"
                    className="h-12 w-full justify-center text-sm"
                    disabled={contactLoading}
                  >
                    {contactLoading
                      ? 'Sending...'
                      : 'Send Message'}
                  </GoldButton>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </PageLayout>
  );
}
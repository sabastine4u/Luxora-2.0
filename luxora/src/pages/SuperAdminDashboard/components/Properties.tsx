import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  Building2,
  Calendar as CalendarIcon,
  Eye,
  FileCheck,
  FileText,
  Filter,
  Heart,
  MapPin,
  Plus,
  RefreshCw,
  Send,
  SlidersHorizontal,
  X,
} from 'lucide-react';

import type { Property } from '../../../types/property';

import { adminApi } from '../../../api/admin.api';

import {
  GhostButton,
  GoldButton,
} from '../../../components/ui/ui';

import { EmptyState } from '../../../components/layout/EmptyState';

import { PropertyCard } from '../../../components/property/PropertyCard';

import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';

import { useToast } from '../../../contexts/ToastContext';

import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';

import { ROUTES } from '../../../constants/routes';

type BackendSuperAdminProperty = {
  _id: string;

  title?: string;

  description?: string;

  propertyType?: string;

  transactionType?: string;

  state?: string;

  city?: string;

  area?: string;

  price?: number | null;

  rentAmount?: number | null;

  currency?: string;

  priceFrequency?: string;

  bedrooms?: number | null;

  bathrooms?: number | null;

  parkingSpaces?: number | null;

  propertySize?: number | null;

  propertySizeUnit?: string | null;

  yearBuilt?: number | null;

  images?: string[];

  coverImage?: string | null;

  videoUrl?: string | null;

  virtualTourUrl?: string | null;

  brochureUrl?: string | null;

  floorPlans?: string[];

  amenities?: string[];

  status?: string;

  availabilityStatus?: string;

  verificationLevel?: string;

  assignmentStatus?: string | null;

  origin?: string;

  createdAt?: string;

  updatedAt?: string;

  agent?: string | null;

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

  featuredLevel?: string;
};

type PropertyAnalytics = {
  views: number;

  saves: number;

  offers: number;
};

type SuperAdminListingsAnalytics = {
  totalViews: number;

  totalSaves: number;

  totalOffers: number;

  byProperty: Record<
    string,
    PropertyAnalytics
  >;
};

type SuperAdminListingProperty = Property & {
  lifecycleStatus: string;

  views: number;

  saves: number;

  offers: number;

  ownerName: string;

  ownerEmail: string;

  ownerPhone: string;

  agencyName: string;

  assignmentStatusDisplay: string;
};

const EMPTY_ANALYTICS: SuperAdminListingsAnalytics =
  {
    totalViews: 0,

    totalSaves: 0,

    totalOffers: 0,

    byProperty: {},
  };

const formatCurrency = (
  value?: number | null,

  currency = 'NGN',
) => {
  if (
    typeof value !== 'number' ||
    Number.isNaN(value)
  ) {
    return 'Price on request';
  }

  try {
    return new Intl.NumberFormat(
      'en-NG',
      {
        style: 'currency',

        currency,

        maximumFractionDigits: 0,
      },
    ).format(value);
  } catch {
    return `₦${value.toLocaleString(
      'en-NG',
    )}`;
  }
};

const getPriceValue = (
  property: BackendSuperAdminProperty,
) => {
  if (
    typeof property.price ===
      'number' &&
    property.price > 0
  ) {
    return property.price;
  }

  if (
    typeof property.rentAmount ===
      'number' &&
    property.rentAmount > 0
  ) {
    return property.rentAmount;
  }

  return undefined;
};

const getPriceFrequency = (
  value?: string,
): Property['priceFrequency'] => {
  if (
    value === 'total' ||
    value === 'monthly' ||
    value === 'yearly' ||
    value === 'perNight' ||
    value === 'perPlot' ||
    value === 'perAcre'
  ) {
    return value;
  }

  return undefined;
};

const getCanonicalStatus = (
  property: BackendSuperAdminProperty,
): Property['status'] => {
  switch (property.status) {
    case 'Sold':
      return 'Sold';

    case 'Rented':
      return 'Rented';

    case 'Draft':
      return 'Draft';

    case 'Archived':
      return 'Archived';

    case 'Under Offer':
      return 'Under Offer';

    case 'Pending':

    case 'Pending Review':

    case 'Approved':
      return 'Pending';

    default:
      return property.availabilityStatus ===
        'Available'
        ? 'Available'
        : 'Pending';
  }
};

const normalizeProperty = (
  property: BackendSuperAdminProperty,

  analytics: PropertyAnalytics,
): SuperAdminListingProperty => {
  const location = [
    property.area,

    property.city,

    property.state,
  ]
    .filter(Boolean)
    .join(', ') ||
    'Location unavailable';

  const priceValue =
    getPriceValue(property);

  const price = formatCurrency(
    priceValue,

    property.currency ||
      'NGN',
  );

  return {
    id: property._id,

    title:
      property.title ||
      'Untitled Property',

    description:
      property.description ||
      '',

    location,

    city:
      property.city ||
      '',

    state:
      property.state ||
      '',

    price,

    priceValue:
      priceValue || 0,

    monthly: price,

    currency:
      property.currency ||
      'NGN',

    priceFrequency:
      getPriceFrequency(
        property.priceFrequency,
      ),

    type:
      property.propertyType ||
      'Unknown',

    transactionType:
      property.transactionType ===
        'rent' ||
      property.transactionType ===
        'lease'
        ? property.transactionType
        : 'buy',

    beds:
      property.bedrooms || 0,

    baths:
      property.bathrooms || 0,

    area: property.propertySize
      ? `${property.propertySize.toLocaleString()} ${
          property.propertySizeUnit ||
          'sqm'
        }`
      : 'Size unavailable',

    image:
      property.coverImage ||
      property.images?.[0] ||
      '',

    gallery:
      property.images || [],

    verified:
      property.verificationLevel
        ? [
            property.verificationLevel,
          ]
        : [],

    agent: {
      name: property.agent
        ? 'Assigned Agent'
        : 'Unassigned',

      agency:
        property.agency?.name ||
        '—',

      avatar: '',

      id:
        property.agent ||
        undefined,

      verified:
        property.verificationLevel
          ?.toLowerCase()
          .includes('verified') ||
        false,
    },

    amenities:
      property.amenities ||
      [],

    parkingSpaces:
      property.parkingSpaces ??
      undefined,

    yearBuilt:
      property.yearBuilt ??
      undefined,

    floorPlans:
      property.floorPlans ||
      [],

    videoUrl:
      property.videoUrl ||
      undefined,

    virtualTourUrl:
      property.virtualTourUrl ||
      undefined,

    brochureUrl:
      property.brochureUrl ||
      undefined,

    documents: [],

    status:
      getCanonicalStatus(property),

    featuredLevel:
      property.featuredLevel ===
        'Premium' ||
      property.featuredLevel ===
        'Exclusive'
        ? property.featuredLevel
        : 'Standard',

    createdAt:
      property.createdAt,

    updatedAt:
      property.updatedAt,

    ownerId:
      property.owner?._id,

    agencyId:
      property.agency?._id,

    agentId:
      property.agent ||
      undefined,

    lifecycleStatus:
      property.status ||
      'Unknown',

    views:
      analytics.views,

    saves:
      analytics.saves,

    offers:
      analytics.offers,

    ownerName:
      property.owner?.fullName ||
      'Private Owner',

    ownerEmail:
      property.owner?.email ||
      'Not supplied',

    ownerPhone:
      'Not supplied',

    agencyName:
      property.agency?.name ||
      '—',

    assignmentStatusDisplay:
      property.origin === 'admin'
        ? property.assignmentStatus ||
          'Administrative Listing'
        : property.assignmentStatus ||
          'Unassigned',

    origin:
      property.origin === 'admin' ||
      property.origin === 'luxora'
        ? property.origin
        : 'admin',

    createdByRole:
      'Super Admin',
  };
};

export default function Properties() {
  const {
    showToast,
  } = useToast();

  const navigate =
    useNavigate();

  const [
    searchQuery,
    setSearchQuery,
  ] = useState('');

  const [
    properties,
    setProperties,
  ] = useState<
    SuperAdminListingProperty[]
  >([]);

  const [
    analytics,
    setAnalytics,
  ] =
    useState<SuperAdminListingsAnalytics>(
      EMPTY_ANALYTICS,
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    loadError,
    setLoadError,
  ] = useState(false);

  const [
    selectedProperty,
    setSelectedProperty,
  ] =
    useState<SuperAdminListingProperty | null>(
      null,
    );

  const [
    activeWorkflow,
    setActiveWorkflow,
  ] = useState<{
    title: string;

    type: string;

    data?: Record<
      string,
      unknown
    >;
  } | null>(null);

  const loadProperties =
    useCallback(
      async () => {
        setLoading(true);

        setLoadError(false);

        try {
          /*
           * This endpoint is intentionally creator-scoped.
           *
           * The backend determines the scope from:
           * createdBy = authenticated Super Admin
           * createdByRole = "Super Admin"
           */
          const response =
            await adminApi.getMyProperties();

          const backendProperties =
            Array.isArray(
              response?.properties,
            )
              ? (response.properties as BackendSuperAdminProperty[])
              : [];

          const backendAnalytics =
            response?.analytics ||
            EMPTY_ANALYTICS;

          const normalizedAnalytics: SuperAdminListingsAnalytics =
            {
              totalViews:
                typeof backendAnalytics.totalViews ===
                'number'
                  ? backendAnalytics.totalViews
                  : 0,

              totalSaves:
                typeof backendAnalytics.totalSaves ===
                'number'
                  ? backendAnalytics.totalSaves
                  : 0,

              totalOffers:
                typeof backendAnalytics.totalOffers ===
                'number'
                  ? backendAnalytics.totalOffers
                  : 0,

              byProperty:
                backendAnalytics.byProperty &&
                typeof backendAnalytics.byProperty ===
                  'object'
                  ? backendAnalytics.byProperty
                  : {},
            };

          setAnalytics(
            normalizedAnalytics,
          );

          setProperties(
            backendProperties.map(
              (property) =>
                normalizeProperty(
                  property,

                  normalizedAnalytics
                    .byProperty[
                    property._id
                  ] || {
                    views: 0,

                    saves: 0,

                    offers: 0,
                  },
                ),
            ),
          );
        } catch (error) {
          console.error(
            'Unable to load Super Admin Properties:',
            error,
          );

          setLoadError(
            true,
          );

          setProperties(
            [],
          );

          setAnalytics(
            EMPTY_ANALYTICS,
          );

          showToast({
            type: 'error',

            title:
              'Unable to load properties',

            description:
              'We could not retrieve the properties created by your Super Admin account.',
          });
        } finally {
          setLoading(false);
        }
      },

      [showToast],
    );

  useEffect(() => {
    void loadProperties();
  }, [loadProperties]);

  const handleWorkflow = (
    title: string,

    type: string,

    data?: Record<
      string,
      unknown
    >,
  ) => {
    setActiveWorkflow({
      title,

      type,

      data,
    });
  };

  const executeWorkflow = () => {
    showToast({
      type: 'success',

      title:
        'Action Initiated',

      description:
        `Executing: ${activeWorkflow?.title}. Integration pending.`,
    });

    setActiveWorkflow(
      null,
    );
  };

  const getStatusColor = (
    status?: string,
  ) => {
    switch (status) {
      case 'Available':

      case 'Published':
        return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';

      case 'Pending':

      case 'Pending Review':

      case 'Approved':

      case 'Agent Assigned':
        return 'text-gold-400 bg-gold-400/10 border-gold-400/20';

      case 'Sold':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20';

      case 'Rented':
        return 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20';

      case 'Draft':
        return 'text-ink/60 bg-white/5 border-white/10';

      case 'Archived':
        return 'text-rose-400 bg-rose-400/10 border-rose-400/20';

      default:
        return 'text-ink/60 bg-white/5 border-white/10';
    }
  };

  const filteredProperties =
    useMemo(() => {
      const query =
        searchQuery
          .trim()
          .toLowerCase();

      if (!query) {
        return properties;
      }

      return properties.filter(
        (property) =>
          [
            property.title,

            property.location,

            property.type,

            property.transactionType,

            property.lifecycleStatus,

            property.ownerName,

            property.agencyName,
          ].some(
            (value) =>
              String(value)
                .toLowerCase()
                .includes(query),
          ),
      );
    }, [
      properties,

      searchQuery,
    ]);

  const activeListings =
    properties.filter(
      (property) =>
        property.lifecycleStatus ===
          'Published' &&
        property.status ===
          'Available',
    ).length;

  const soldListings =
    properties.filter(
      (property) =>
        property.lifecycleStatus ===
        'Sold',
    ).length;
    // Preserve the existing Sold lifecycle metric.
void soldListings;

  const pendingReviewListings =
    properties.filter(
      (property) =>
        property.lifecycleStatus ===
        'Pending Review',
    ).length;

  const kpis = [
    {
      label:
        'Active Listings',

      value: loading
        ? '—'
        : activeListings.toString(),

      icon: Building2,

      color:
        'text-emerald-400',

      bg:
        'bg-emerald-400/10',
    },

    {
      label:
        'Total Views',

      value: loading
        ? '—'
        : analytics.totalViews.toLocaleString(),

      icon: Eye,

      color:
        'text-blue-400',

      bg:
        'bg-blue-400/10',
    },

    {
      label:
        'Total Saves',

      value: loading
        ? '—'
        : analytics.totalSaves.toLocaleString(),

      icon: Heart,

      color:
        'text-rose-400',

      bg:
        'bg-rose-400/10',
    },

    {
      label:
        'Total Offers',

      value: loading
        ? '—'
        : analytics.totalOffers.toLocaleString(),

      icon: FileCheck,

      color:
        'text-gold-400',

      bg:
        'bg-gold-400/10',
    },

    {
      label:
        'Pending Review',

      value: loading
        ? '—'
        : pendingReviewListings.toString(),

      icon: FileText,

      color:
        'text-indigo-400',

      bg:
        'bg-indigo-400/10',
    },
  ];

  const handleViewFullDetails = (
    propertyId: string,
  ) => {
    setSelectedProperty(
      null,
    );

    navigate(
      ROUTES.PROPERTY_DETAILS.replace(
        ':id',
        propertyId,
      ),
    );
  };

  const handleEditListing = (
    propertyId: string,
  ) => {
    setSelectedProperty(
      null,
    );

    navigate(
      `${ROUTES.CREATE_LISTING}?editId=${encodeURIComponent(
        propertyId,
      )}&adminEdit=true`,
    );
  };

  const handleShareListing =
    async (
      property: SuperAdminListingProperty,
    ) => {
      const propertyUrl =
        `${window.location.origin}${ROUTES.PROPERTY_DETAILS.replace(
          ':id',
          property.id,
        )}`;

      try {
        if (
          typeof navigator !==
            'undefined' &&
          typeof navigator.share ===
            'function'
        ) {
          await navigator.share({
            title:
              property.title,

            text:
              `View ${property.title} on Luxora.`,

            url: propertyUrl,
          });

          return;
        }

        if (
          typeof navigator !==
            'undefined' &&
          navigator.clipboard
        ) {
          await navigator.clipboard.writeText(
            propertyUrl,
          );

          showToast({
            type: 'success',

            title:
              'Listing Link Copied',

            description:
              'The public property link has been copied to your clipboard.',
          });

          return;
        }

        window.prompt(
          'Copy this property link:',

          propertyUrl,
        );
      } catch (error) {
        if (
          error instanceof
            DOMException &&
          error.name ===
            'AbortError'
        ) {
          return;
        }

        console.error(
          'Failed to share property:',
          error,
        );

        showToast({
          type: 'error',

          title:
            'Unable to Share Listing',

          description:
            'The property link could not be shared or copied.',
        });
      }
    };

  return (
    <div className="space-y-6 relative h-full flex flex-col pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">
            Properties
          </h2>

          <p className="text-sm text-ink/60">
            Review and manage properties created by your Super Admin account.
          </p>
        </div>

        <div className="flex gap-3">
          <GhostButton
            size="sm"
            onClick={() =>
              handleWorkflow(
                'Export CSV',

                'export',
              )
            }
          >
            <ArrowUpRight className="h-4 w-4 mr-2" />

            Export CSV
          </GhostButton>

          <GoldButton
            size="sm"
            onClick={() =>
              navigate(
                ROUTES.CREATE_LISTING,
              )
            }
          >
            <Plus className="h-4 w-4 mr-2" />

            Create Listing
          </GoldButton>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {kpis.map(
          (kpi) => (
            <div
              key={
                kpi.label
              }
              className="rounded-2xl border border-white/10 bg-navy-800/50 p-4 transition-all hover:bg-navy-800/80 flex items-center gap-4"
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${kpi.bg} ${kpi.color}`}
              >
                <kpi.icon className="h-6 w-6" />
              </div>

              <div>
                <div className="text-2xl font-bold text-cream leading-none">
                  {kpi.value}
                </div>

                <div className="text-xs font-medium text-ink/60 mt-1">
                  {kpi.label}
                </div>
              </div>
            </div>
          ),
        )}
      </div>

      <DataTableToolbar
        searchValue={
          searchQuery
        }
        onSearchChange={
          setSearchQuery
        }
        searchPlaceholder="Search by title, owner, or location..."
        actions={
          <>
            <GhostButton
              size="sm"
              className="bg-navy-900/80"
            >
              <Filter className="h-4 w-4 mr-2" />

              Status
            </GhostButton>

            <GhostButton
              size="sm"
              className="bg-navy-900/80"
            >
              <Briefcase className="h-4 w-4 mr-2" />

              Property Type
            </GhostButton>

            <GhostButton
              size="sm"
              className="bg-navy-900/80"
            >
              <MapPin className="h-4 w-4 mr-2" />

              Location
            </GhostButton>

            <GhostButton
              size="sm"
              className="bg-navy-900/80"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />

              Sort: Newest
            </GhostButton>
          </>
        }
      />

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({
            length: 8,
          }).map(
            (_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-3xl border border-white/10 bg-navy-800/50 animate-pulse"
              >
                <div className="aspect-[4/3] bg-white/5" />

                <div className="space-y-3 p-6">
                  <div className="h-3 w-1/3 rounded bg-white/5" />

                  <div className="h-5 w-4/5 rounded bg-white/5" />

                  <div className="h-4 w-2/3 rounded bg-white/5" />

                  <div className="h-10 w-full rounded bg-white/5" />
                </div>
              </div>
            ),
          )}
        </div>
      ) : loadError ? (
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-10 text-center">
          <RefreshCw className="mx-auto h-10 w-10 text-gold-400 mb-4" />

          <h3 className="font-heading text-lg font-semibold text-cream">
            Unable to load your properties
          </h3>

          <p className="mt-2 text-sm text-ink/60">
            The Super Admin Property request did not complete successfully.
          </p>

          <GoldButton
            size="sm"
            className="mt-5"
            onClick={() =>
              void loadProperties()
            }
          >
            <RefreshCw className="h-4 w-4 mr-2" />

            Retry
          </GoldButton>
        </div>
      ) : filteredProperties.length ===
        0 ? (
        <div className="py-12">
          <EmptyState
            icon={
              <Building2 className="h-12 w-12 text-gold-400" />
            }
            title="No properties found."
            description={
              searchQuery
                ? 'You do not have any properties matching your search.'
                : 'You do not have any properties created by this Super Admin account yet.'
            }
            actionLabel={
              searchQuery
                ? 'Clear Search'
                : 'Refresh Properties'
            }
            onAction={() =>
              searchQuery
                ? setSearchQuery('')
                : void loadProperties()
            }
          />
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProperties.map(
            (property) => (
              <div
                key={
                  property.id
                }
                className="relative cursor-pointer group"
                onClick={() =>
                  setSelectedProperty(
                    property,
                  )
                }
              >
                <div className="absolute top-4 left-4 z-10">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase shadow-lg backdrop-blur-md ${getStatusColor(
                      property.lifecycleStatus,
                    )}`}
                  >
                    {
                      property.lifecycleStatus
                    }
                  </span>
                </div>

                <div className="transform scale-100 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl group-hover:shadow-gold-400/10 pointer-events-none">
                  <PropertyCard
                    property={
                      property
                    }
                  />
                </div>

                <div className="absolute bottom-[88px] left-0 right-0 bg-navy-950/80 backdrop-blur-sm p-3 border-t border-white/10 grid grid-cols-3 gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-none">
                  <div className="text-center">
                    <div className="text-xs text-ink/50 mb-0.5 flex items-center justify-center gap-1">
                      <Eye className="h-3 w-3" />

                      Views
                    </div>

                    <div className="text-sm font-bold text-cream">
                      {property.views.toLocaleString()}
                    </div>
                  </div>

                  <div className="text-center border-l border-white/10">
                    <div className="text-xs text-ink/50 mb-0.5 flex items-center justify-center gap-1">
                      <Heart className="h-3 w-3" />

                      Saves
                    </div>

                    <div className="text-sm font-bold text-cream">
                      {property.saves.toLocaleString()}
                    </div>
                  </div>

                  <div className="text-center border-l border-white/10">
                    <div className="text-xs text-ink/50 mb-0.5 flex items-center justify-center gap-1">
                      <FileCheck className="h-3 w-3" />

                      Offers
                    </div>

                    <div className="text-sm font-bold text-cream">
                      {property.offers.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      )}

      {selectedProperty && (
        <>
          <div
            className="fixed inset-0 z-40 bg-navy-950/60 backdrop-blur-sm"
            onClick={() =>
              setSelectedProperty(
                null,
              )
            }
          />

          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-navy-900 border-l border-white/10 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-white/10 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                {selectedProperty.image && (
                  <img
                    src={
                      selectedProperty.image
                    }
                    alt={
                      selectedProperty.title
                    }
                    className="w-full h-full object-cover"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/90 to-transparent" />
              </div>

              <div className="relative z-10 w-full flex justify-between items-start">
                <div>
                  <h3 className="font-heading text-xl font-bold text-cream mb-1">
                    {
                      selectedProperty.title
                    }
                  </h3>

                  <div className="text-sm text-ink/60">
                    {
                      selectedProperty.location
                    }
                  </div>
                </div>

                <button
                  onClick={() =>
                    setSelectedProperty(
                      null,
                    )
                  }
                  className="p-2 text-ink/50 hover:text-cream rounded-lg hover:bg-white/5 transition-colors bg-navy-900/50 backdrop-blur-md border border-white/10"
                  aria-label="Close property details"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar relative z-10">
              <div className="flex items-center justify-between gap-4">
                <div className="font-heading text-3xl font-bold text-gold-400">
                  {
                    selectedProperty.price
                  }
                </div>

                <span
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold uppercase ${getStatusColor(
                    selectedProperty.lifecycleStatus,
                  )}`}
                >
                  {
                    selectedProperty.lifecycleStatus
                  }
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <GoldButton
                  size="sm"
                  onClick={() =>
                    handleEditListing(
                      selectedProperty.id,
                    )
                  }
                >
                  <FileText className="h-4 w-4 mr-2" />

                  Edit Listing
                </GoldButton>

                <GhostButton
                  size="sm"
                  onClick={() =>
                    void handleShareListing(
                      selectedProperty,
                    )
                  }
                >
                  <Send className="h-4 w-4 mr-2" />

                  Share
                </GhostButton>

                <GhostButton
                  size="sm"
                  onClick={() =>
                    handleWorkflow(
                      'Schedule Viewing',

                      'schedule_viewing',

                      {
                        propertyId:
                          selectedProperty.id,
                      },
                    )
                  }
                >
                  <CalendarIcon className="h-4 w-4 mr-2" />

                  Schedule
                </GhostButton>

                <GhostButton
                  size="sm"
                  onClick={() =>
                    handleWorkflow(
                      'View Offers',

                      'view_offers',

                      {
                        propertyId:
                          selectedProperty.id,
                      },
                    )
                  }
                >
                  <FileCheck className="h-4 w-4 mr-2" />

                  View Offers (
                  {
                    selectedProperty.offers
                  })
                </GhostButton>
              </div>

              <div className="space-y-4">
                <h4 className="font-heading text-sm font-bold text-cream uppercase tracking-wider text-ink/60 border-b border-white/5 pb-2">
                  Property Info
                </h4>

                <div className="grid gap-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-ink/50">
                      Property Type
                    </span>

                    <span className="text-cream font-medium text-right">
                      {
                        selectedProperty.type
                      }
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-ink/50">
                      Beds / Baths
                    </span>

                    <span className="text-cream font-medium text-right">
                      {
                        selectedProperty.beds
                      }{' '}
                      Bed /{' '}
                      {
                        selectedProperty.baths
                      }{' '}
                      Bath
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-ink/50">
                      Floor Area
                    </span>

                    <span className="text-cream font-medium text-right">
                      {
                        selectedProperty.area
                      }
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-ink/50">
                      Listing ID
                    </span>

                    <span className="text-cream font-medium text-right break-all">
                      {
                        selectedProperty.id
                      }
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-ink/50">
                      Assignment
                    </span>

                    <span className="text-cream font-medium text-right">
                      {
                        selectedProperty.assignmentStatusDisplay
                      }
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-heading text-sm font-bold text-cream uppercase tracking-wider text-ink/60 border-b border-white/5 pb-2">
                  Performance Metrics
                </h4>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-navy-800/50 border border-white/5 rounded-xl p-3">
                    <div className="flex items-center gap-2 text-ink/50 text-xs mb-1">
                      <Eye className="h-3.5 w-3.5" />

                      Views
                    </div>

                    <div className="text-lg font-bold text-cream">
                      {selectedProperty.views.toLocaleString()}
                    </div>
                  </div>

                  <div className="bg-navy-800/50 border border-white/5 rounded-xl p-3">
                    <div className="flex items-center gap-2 text-ink/50 text-xs mb-1">
                      <Heart className="h-3.5 w-3.5" />

                      Saves
                    </div>

                    <div className="text-lg font-bold text-cream">
                      {selectedProperty.saves.toLocaleString()}
                    </div>
                  </div>

                  <div className="bg-navy-800/50 border border-white/5 rounded-xl p-3">
                    <div className="flex items-center gap-2 text-ink/50 text-xs mb-1">
                      <FileCheck className="h-3.5 w-3.5" />

                      Offers
                    </div>

                    <div className="text-lg font-bold text-cream">
                      {selectedProperty.offers.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-heading text-sm font-bold text-cream uppercase tracking-wider text-ink/60 border-b border-white/5 pb-2">
                  Owner Info
                </h4>

                <div className="grid gap-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-ink/50">
                      Name
                    </span>

                    <span className="text-cream font-medium text-right">
                      {
                        selectedProperty.ownerName
                      }
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-ink/50">
                      Phone
                    </span>

                    <span className="text-cream font-medium text-right">
                      {
                        selectedProperty.ownerPhone
                      }
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-ink/50">
                      Email
                    </span>

                    <span className="text-cream font-medium text-right break-all">
                      {
                        selectedProperty.ownerEmail
                      }
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-ink/50">
                      Agency
                    </span>

                    <span className="text-cream font-medium text-right">
                      {
                        selectedProperty.agencyName
                      }
                    </span>
                  </div>
                </div>
              </div>

              <GhostButton
                className="w-full text-gold-400 hover:text-gold-300"
                onClick={() =>
                  handleViewFullDetails(
                    selectedProperty.id,
                  )
                }
              >
                View Full Details

                <ArrowRight className="h-4 w-4 ml-2" />
              </GhostButton>
            </div>
          </div>
        </>
      )}

      <EnterpriseDetailDrawer
        isOpen={
          !!activeWorkflow
        }
        onClose={() =>
          setActiveWorkflow(
            null,
          )
        }
        title={
          activeWorkflow?.title ||
          'Workflow'
        }
        footerActions={
          <GoldButton
            onClick={
              executeWorkflow
            }
            className="w-full justify-center"
          >
            Confirm Action
          </GoldButton>
        }
      >
        <div className="space-y-6">
          <div className="p-4 rounded-xl border border-white/10 bg-navy-900">
            <h4 className="text-sm font-semibold text-cream mb-2">
              Workflow Details
            </h4>

            <p className="text-sm text-ink/60 leading-relaxed">
              You are about to execute the{' '}
              <strong>
                {
                  activeWorkflow?.type
                }
              </strong>{' '}
              workflow. Review the action details below and confirm to continue.
            </p>
          </div>

          {activeWorkflow?.data && (
            <div className="p-4 rounded-xl border border-white/10 bg-navy-900/50">
              <h4 className="text-sm font-semibold text-cream mb-4">
                Context Data
              </h4>

              <div className="space-y-2 text-sm text-ink/80">
                {Object.entries(
                  activeWorkflow.data,
                ).map(
                  ([
                    key,
                    value,
                  ]) =>
                    typeof value ===
                      'string' ||
                    typeof value ===
                      'number' ? (
                      <div
                        key={key}
                        className="flex justify-between gap-4 border-b border-white/5 pb-2"
                      >
                        <span className="capitalize">
                          {key}
                        </span>

                        <span className="font-medium text-cream text-right">
                          {value}
                        </span>
                      </div>
                    ) : null,
                )}
              </div>
            </div>
          )}
        </div>
      </EnterpriseDetailDrawer>
    </div>
  );
}
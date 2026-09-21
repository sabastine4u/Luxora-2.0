import { useEffect, useMemo, useState } from 'react';

import {
  Building2,
  CheckCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react';

import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal';

import {
  RejectionReasonModal,
  type ReviewActionType,
} from './RejectionReasonModal';

import { ListingDetailModal } from './ListingDetailModal';
import { AgencyAssignmentModal } from './modals/AgencyAssignmentModal';

import {
  GhostButton,
  GoldButton,
} from '../../../components/ui/ui';

import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { SegmentedProgressBar } from '../../../components/dashboard/shared/widgets/SegmentedProgressBar';
import { ActivityTimeline } from '../../../components/dashboard/shared/timelines/ActivityTimeline';

import { ROUTES } from '../../../constants/routes';
import { useNavigate } from 'react-router-dom';

import { adminApi } from '../../../api/admin.api';
import { propertyApi } from '../../../api/property.api';
import { useToast } from '../../../contexts/ToastContext';

import type { AdminListing } from '../../../types/admin';

import { ListingTable } from '../../../components/dashboard/shared/tables/ListingTable';

export interface ListingsProps {
  pageTitle?: string;
  pageSubtitle?: string;
  mode?: 'operational' | 'oversight' | 'management';
}

interface AdminProperty {
  _id: string;
  title: string;

  transactionType?: string;

  state?: string;
  city?: string;
  area?: string | null;

  price?: number | null;
  rentAmount?: number | null;
  currency?: string;
  priceFrequency?: string | null;

  status?: string;
  verificationLevel?: string;
  assignmentStatus?: string | null;

  description?: string;
  propertyType?: string;

  bedrooms?: number;
  bathrooms?: number;
  toilets?: number;
  parkingSpaces?: number;

  propertySize?: number | null;
  propertySizeUnit?: string;

  yearBuilt?: number | null;
  furnishing?: string | null;
  propertyCondition?: string | null;

  images?: string[];
  coverImage?: string | null;

  origin?: string;
  createdByRole?: string;

  agency?: {
    _id?: string;
    name?: string;
  } | null;

  agent?: {
    _id?: string;
    user?: {
      fullName?: string;
    } | null;
  } | null;

  owner?: {
    _id?: string;
    fullName?: string;
  } | null;

  createdAt?: string;
  updatedAt?: string;

  documents?: Array<{
    title?: string;
    url?: string;
    verified?: boolean;
    uploadedAt?: string;
  }>;
}

/**
 * Convert the real Property response into the existing AdminListing
 * structure used by the Admin/Super Admin listing UI.
 */
const mapPropertyToAdminListing = (
  property: AdminProperty,
): AdminListing => {
  const rawPrice =
    property.transactionType === 'rent' ||
    property.priceFrequency === 'monthly' ||
    property.priceFrequency === 'yearly'
      ? property.rentAmount ?? property.price
      : property.price;

  const formattedPrice =
    typeof rawPrice === 'number'
      ? new Intl.NumberFormat('en-NG', {
          style: 'currency',
          currency: property.currency || 'NGN',
          maximumFractionDigits: 0,
        }).format(rawPrice)
      : 'N/A';

  const frequency =
    property.priceFrequency &&
    property.priceFrequency !== 'total'
      ? `/${property.priceFrequency}`
      : '';

  const listingStatus =
    property.status || 'Draft';

  let assignmentStatus:
    | 'Ready for Agency Assignment'
    | 'Assigned to Agency'
    | 'Agency Acknowledged'
    | 'Cancelled'
    | undefined;

  if (
    property.assignmentStatus ===
    'Agent Declined'
  ) {
    assignmentStatus = 'Cancelled';
  } else if (
    property.assignmentStatus ===
      'Agency Assigned' ||
    property.assignmentStatus ===
      'Agent Assigned' ||
    property.assignmentStatus ===
      'Agent Accepted'
  ) {
    assignmentStatus =
      'Assigned to Agency';
  } else if (
    property.assignmentStatus ===
    'Pending Agency Assignment'
  ) {
    assignmentStatus =
      'Ready for Agency Assignment';
  }

  return {
    id: property._id,

    title: property.title,

    owner:
      property.owner?.fullName ||
      'Unassigned',

    location:
      [property.city, property.state]
        .filter(Boolean)
        .join(', ') ||
      'Location not provided',

    price: `${formattedPrice}${frequency}`,

    status: listingStatus,

    propertyType: property.propertyType,
    transactionType: property.transactionType,
    description: property.description,

    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    toilets: property.toilets,
    parkingSpaces: property.parkingSpaces,

    propertySize: property.propertySize,
    propertySizeUnit:
      property.propertySizeUnit,

    yearBuilt: property.yearBuilt,
    furnishing: property.furnishing,
    propertyCondition:
      property.propertyCondition,

    priceFrequency:
      property.priceFrequency,

    images: property.images || [],
    coverImage:
      property.coverImage || null,

    origin: property.origin,
    createdByRole:
      property.createdByRole,

    verificationLevel:
      property.verificationLevel,

    assignmentStatus:
      property.assignmentStatus,

    documents:
      property.documents || [],

    agent: property.agent
      ? {
          id: property.agent._id,
          name:
            property.agent.user?.fullName ||
            'Unknown Agent',
        }
      : null,

    agency: property.agency
      ? {
          id: property.agency._id,
          name:
            property.agency.name ||
            'Unknown Agency',
        }
      : null,

    priority:
      property.verificationLevel ===
      'Unverified'
        ? 'High'
        : 'Normal',

    verification: {
      status: listingStatus,

      checklist: [],

      documents:
        property.documents?.map(
          (document, index) => ({
            name:
              document.title ||
              `Document ${index + 1}`,
            type:
              document.verified
                ? 'Verified Document'
                : 'Document',
            size:
              document.uploadedAt
                ? new Date(
                    document.uploadedAt,
                  ).toLocaleDateString()
                : undefined,
          }),
        ) || [],

      notes: `Verification level: ${
        property.verificationLevel ||
        'Unverified'
      }`,

      history: [],
    },

    assignment: assignmentStatus
      ? {
          id:
            property.agency?._id ||
            property._id,

          status: assignmentStatus,

          agencyId:
            property.agency?._id,

          agencyName:
            property.agency?.name,

          assignedAt:
            property.updatedAt,
        }
      : undefined,
  };
};

export default function Listings({
  pageTitle = 'Verification Queue',
  pageSubtitle =
    'Review, approve, and publish property submissions.',
  mode = 'operational',
}: ListingsProps) {
  const navigate = useNavigate();

  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] =
    useState('');

  const [statusFilter, setStatusFilter] =
    useState('All');

  const [selectedRows, setSelectedRows] =
    useState<Set<string>>(
      new Set(),
    );

  const [
    approvalModalOpen,
    setApprovalModalOpen,
  ] = useState(false);

  const [
    publishModalOpen,
    setPublishModalOpen,
  ] = useState(false);

  const [
    reasonModalOpen,
    setReasonModalOpen,
  ] = useState(false);

  const [actionType, setActionType] =
    useState<ReviewActionType>(
      'reject',
    );

  const [actionTarget, setActionTarget] =
    useState<string | null>(
      null,
    );

  const [previewListing, setPreviewListing] =
    useState<AdminListing | null>(
      null,
    );

  const [
    assignmentListing,
    setAssignmentListing,
  ] = useState<AdminListing | null>(
    null,
  );

  const [properties, setProperties] =
    useState<AdminProperty[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [loadError, setLoadError] =
    useState<string | null>(
      null,
    );

  const [
    isActionLoading,
    setIsActionLoading,
  ] = useState(false);

  const [reviewNotes, setReviewNotes] =
    useState('');

  /**
   * Fetch all real Properties available to Admin/Super Admin.
   */
  const loadProperties = async () => {
    try {
      setLoadError(null);

      const response =
        await adminApi.getProperties();

      const data =
        response as unknown as {
          properties?: AdminProperty[];
        };

      setProperties(
        data.properties || [],
      );
    } catch (error) {
      console.error(
        'Failed to load Admin properties:',
        error,
      );

      setLoadError(
        'Unable to load properties right now.',
      );

      setProperties([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadProperties();
  }, []);

  const adminListings = useMemo(
    () =>
      properties.map(
        mapPropertyToAdminListing,
      ),
    [properties],
  );

  const filteredListings =
    useMemo(() => {
      const search =
        searchQuery
          .trim()
          .toLowerCase();

      return adminListings.filter(
        (listing) => {
          const matchesSearch =
            !search ||
            listing.title
              .toLowerCase()
              .includes(search) ||
            listing.owner
              .toLowerCase()
              .includes(search);

          const matchesStatus =
            statusFilter === 'All' ||
            listing.status ===
              statusFilter;

          return (
            matchesSearch &&
            matchesStatus
          );
        },
      );
    }, [
      adminListings,
      searchQuery,
      statusFilter,
    ]);

  const totalListings =
    adminListings.length;

  const pendingReviewCount =
    adminListings.filter(
      (listing) =>
        listing.status ===
        'Pending Review',
    ).length;

  const approvedCount =
    adminListings.filter(
      (listing) =>
        listing.status ===
        'Approved',
    ).length;

  const draftCount =
    adminListings.filter(
      (listing) =>
        listing.status ===
        'Draft',
    ).length;

  const publishedCount =
    adminListings.filter(
      (listing) =>
        listing.status ===
        'Published',
    ).length;

  const completedListingsCount =
    adminListings.filter(
      (listing) =>
        listing.status === 'Sold' ||
        listing.status === 'Rented' ||
        listing.status === 'Leased',
    ).length;

  const approvalPercentage =
    totalListings > 0
      ? Math.round(
          (approvedCount /
            totalListings) *
            100,
        )
      : 0;

  const reviewPercentage =
    totalListings > 0
      ? Math.round(
          (pendingReviewCount /
            totalListings) *
            100,
        )
      : 0;

  const draftPercentage =
    totalListings > 0
      ? Math.round(
          (draftCount /
            totalListings) *
            100,
        )
      : 0;

  const toggleSelection = (
    id: string,
  ) => {
    const nextSelection =
      new Set(selectedRows);

    if (
      nextSelection.has(id)
    ) {
      nextSelection.delete(id);
    } else {
      nextSelection.add(id);
    }

    setSelectedRows(
      nextSelection,
    );
  };

  const toggleAll = () => {
    if (
      selectedRows.size ===
      filteredListings.length
    ) {
      setSelectedRows(
        new Set(),
      );

      return;
    }

    setSelectedRows(
      new Set(
        filteredListings.map(
          (listing) =>
            listing.id,
        ),
      ),
    );
  };

  /**
   * Open the correct confirmation/rejection workflow.
   */
  const handleReviewAction = (
    type:
      | 'approve'
      | 'return'
      | 'hold'
      | 'reject'
      | 'publish',
    notes = '',
  ) => {
    setReviewNotes(
      notes.trim(),
    );

    if (type === 'approve') {
      setApprovalModalOpen(true);
      return;
    }

    if (type === 'reject') {
      setActionType('reject');
      setReasonModalOpen(true);
      return;
    }

    if (type === 'publish') {
      setPublishModalOpen(true);
      return;
    }

    showToast({
      type: 'info',
      title:
        'Workflow Not Available Yet',
      description:
        'Return and Hold require dedicated backend workflow states.',
    });
  };

  /**
   * Approve one or many Pending Review Properties.
   */
  const handleApprove = async () => {
    try {
      setIsActionLoading(true);

      const ids =
        actionTarget === 'bulk'
          ? Array.from(selectedRows)
          : actionTarget
            ? [actionTarget]
            : [];

      if (ids.length === 0) {
        return;
      }

      const approvableListings =
        adminListings.filter(
          (listing) =>
            ids.includes(listing.id) &&
            listing.status ===
              'Pending Review',
        );

      if (
        approvableListings.length === 0
      ) {
        showToast({
          type: 'info',
          title: 'Nothing to Approve',
          description:
            'Only Properties with Pending Review status can be approved.',
        });

        return;
      }

      const notes =
        reviewNotes.trim();

      for (const listing of approvableListings) {
        await propertyApi.approveProperty(
          listing.id,
          {
            decision: 'Approved',
            reviewNotes: notes,
          },
        );
      }

      await loadProperties();

      setSelectedRows(
        new Set(),
      );

      setApprovalModalOpen(false);
      setActionTarget(null);
      setReviewNotes('');

      showToast({
        type: 'success',
        title:
          approvableListings.length ===
          1
            ? 'Property Approved'
            : 'Properties Approved',
        description:
          approvableListings.length ===
          1
            ? 'The Property was approved successfully.'
            : `${approvableListings.length} Properties were approved successfully.`,
      });
    } catch (error: any) {
      console.error(
        'Failed to approve Property:',
        error,
      );

      showToast({
        type: 'error',
        title: 'Approval Failed',
        description:
          error?.message ||
          error?.response?.data
            ?.message ||
          'The Property could not be approved.',
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  /**
   * Publish one Approved Property.
   */
  const handlePublish = async () => {
    try {
      setIsActionLoading(true);

      const id =
        actionTarget &&
        actionTarget !== 'bulk'
          ? actionTarget
          : null;

      if (!id) {
        showToast({
          type: 'error',
          title: 'Listing Not Selected',
          description:
            'Select an approved Property before publishing.',
        });

        return;
      }

      const listing =
        adminListings.find(
          (item) =>
            item.id === id,
        );

      if (!listing) {
        showToast({
          type: 'error',
          title: 'Listing Not Found',
          description:
            'The selected Property could not be found.',
        });

        return;
      }

      if (
        listing.status !==
        'Approved'
      ) {
        showToast({
          type: 'info',
          title: 'Cannot Publish',
          description:
            'Only Approved Properties can be published.',
        });

        return;
      }

      await propertyApi.publishProperty(
        id,
      );

      await loadProperties();

      setPublishModalOpen(false);
      setActionTarget(null);
      setReviewNotes('');

      showToast({
        type: 'success',
        title: 'Property Published',
        description:
          'The Property was published successfully.',
      });
    } catch (error: any) {
      console.error(
        'Failed to publish Property:',
        error,
      );

      showToast({
        type: 'error',
        title: 'Publish Failed',
        description:
          error?.message ||
          error?.response?.data
            ?.message ||
          'The Property could not be published.',
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  /**
   * Reject one or many Pending Review Properties.
   */
  const handleReject = async (
    reason: string,
  ) => {
    try {
      setIsActionLoading(true);

      const ids =
        actionTarget === 'bulk'
          ? Array.from(selectedRows)
          : actionTarget
            ? [actionTarget]
            : [];

      if (ids.length === 0) {
        return;
      }

      const rejectableListings =
        adminListings.filter(
          (listing) =>
            ids.includes(listing.id) &&
            listing.status ===
              'Pending Review',
        );

      if (
        rejectableListings.length === 0
      ) {
        showToast({
          type: 'info',
          title: 'Nothing to Reject',
          description:
            'Only Properties with Pending Review status can be rejected.',
        });

        return;
      }

      const detailNotes =
        reviewNotes.trim();

      const rejectionReason =
        reason.trim();

      const finalReviewNotes =
        [detailNotes, rejectionReason]
          .filter(Boolean)
          .join('\n\n');

      for (const listing of rejectableListings) {
        await propertyApi.approveProperty(
          listing.id,
          {
            decision: 'Rejected',
            reviewNotes:
              finalReviewNotes,
          },
        );
      }

      await loadProperties();

      setSelectedRows(
        new Set(),
      );

      setReasonModalOpen(false);
      setActionTarget(null);
      setReviewNotes('');

      showToast({
        type: 'success',
        title:
          rejectableListings.length ===
          1
            ? 'Property Rejected'
            : 'Properties Rejected',
        description:
          rejectableListings.length ===
          1
            ? 'The Property was rejected successfully.'
            : `${rejectableListings.length} Properties were rejected successfully.`,
      });
    } catch (error: any) {
      console.error(
        'Failed to reject Property:',
        error,
      );

      showToast({
        type: 'error',
        title: 'Rejection Failed',
        description:
          error?.message ||
          error?.response?.data
            ?.message ||
          'The Property could not be rejected.',
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  /**
   * Assign an Owner-originated Property to an Agency.
   */
  const handleAgencyAssignment = async (
    agencyId: string,
  ) => {
    try {
      setIsActionLoading(true);

      if (!assignmentListing) {
        return;
      }

      await propertyApi.assignPropertyToAgency(
        assignmentListing.id,
        agencyId,
      );

      await loadProperties();

      setAssignmentListing(null);

      showToast({
        type: 'success',
        title: 'Agency Assigned',
        description:
          `${assignmentListing.title} was assigned successfully.`,
      });
    } catch (error: any) {
      console.error(
        'Failed to assign Agency:',
        error,
      );

      showToast({
        type: 'error',
        title: 'Assignment Failed',
        description:
          error?.message ||
          error?.response?.data
            ?.message ||
          'The Property could not be assigned to the Agency.',
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  /**
   * Super Admin management mode uses the shared ListingTable
   * menu. Connect only the workflows that currently have
   * real backend support.
   */
  const handleManagementAction = (
    action: string,
    item: AdminListing,
  ) => {
    if (
      action === 'view_listing'
    ) {
      setPreviewListing(item);
      return;
    }

    if (action === 'publish') {
      setActionTarget(item.id);
      handleReviewAction(
        'publish',
      );
      return;
    }

    if (
      action === 'agent_assignment'
    ) {
      setAssignmentListing(item);
      return;
    }

    showToast({
      type: 'info',
      title:
        'Workflow Not Available Yet',
      description:
        `${action} is not connected to a real Property workflow yet.`,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <DashboardHeader
          name={pageTitle}
          subtitle={pageSubtitle}
        />

        <div className="mb-2">
          <h2 className="text-sm font-semibold text-ink/50 uppercase tracking-wider">
            Listing Analytics
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({
            length: 4,
          }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 animate-pulse"
            >
              <div className="h-4 w-28 rounded bg-white/10" />
              <div className="mt-4 h-8 w-20 rounded bg-white/10" />
              <div className="mt-4 h-3 w-32 rounded bg-white/10" />
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-navy-800/50 p-6 animate-pulse">
            <div className="h-5 w-64 rounded bg-white/10" />
            <div className="mt-6 h-4 w-full rounded bg-white/10" />
          </div>

          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 animate-pulse">
            <div className="h-5 w-40 rounded bg-white/10" />

            <div className="mt-6 space-y-4">
              <div className="h-4 w-full rounded bg-white/10" />
              <div className="h-4 w-4/5 rounded bg-white/10" />
              <div className="h-4 w-3/5 rounded bg-white/10" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 animate-pulse">
          <div className="h-5 w-48 rounded bg-white/10" />

          <div className="mt-6 space-y-4">
            {Array.from({
              length: 5,
            }).map((_, index) => (
              <div
                key={index}
                className="grid grid-cols-4 gap-4"
              >
                <div className="h-5 rounded bg-white/10" />
                <div className="h-5 rounded bg-white/10" />
                <div className="h-5 rounded bg-white/10" />
                <div className="h-5 rounded bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="space-y-6">
        <DashboardHeader
          name={pageTitle}
          subtitle={pageSubtitle}
        />

        <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-rose-400 mt-0.5" />

            <div>
              <h3 className="font-semibold text-cream">
                Unable to load listings
              </h3>

              <p className="mt-1 text-sm text-ink/60">
                {loadError}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader
        name={pageTitle}
        subtitle={pageSubtitle}
        actions={
          <GoldButton
            onClick={() =>
              navigate(
                ROUTES.CREATE_LISTING,
              )
            }
            className="flex items-center gap-2"
          >
            Create Platform Listing
          </GoldButton>
        }
      />

      <div className="mb-2">
        <h2 className="text-sm font-semibold text-ink/50 uppercase tracking-wider">
          Listing Analytics
        </h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Listings"
          value={totalListings.toString()}
          icon={Building2}
          trend={`${publishedCount} published`}
          trendColor="text-emerald-400"
        />

        <KPICard
          title="Pending Review"
          value={pendingReviewCount.toString()}
          icon={Clock}
          trend="Needs Action"
          trendColor="text-yellow-400"
          iconColor="text-yellow-400"
          backgroundColor="bg-yellow-400/10"
        />

        <KPICard
          title="Approved"
          value={approvedCount.toString()}
          icon={CheckCircle}
          trend={`${completedListingsCount} completed`}
          trendColor="text-emerald-400"
          iconColor="text-emerald-400"
        />

        <KPICard
          title="Draft Listings"
          value={draftCount.toString()}
          icon={AlertTriangle}
          trend="Not yet published"
          trendColor="text-rose-400"
          iconColor="text-rose-400"
          backgroundColor="bg-rose-400/10"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col justify-center space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-heading text-lg font-bold text-cream">
              Listing Distribution
            </h3>
          </div>

          <SegmentedProgressBar
            segments={[
              {
                label: 'Approved',
                value:
                  approvalPercentage,
                color:
                  'bg-emerald-400',
              },
              {
                label: 'Pending Review',
                value:
                  reviewPercentage,
                color:
                  'bg-yellow-400',
              },
              {
                label: 'Draft',
                value:
                  draftPercentage,
                color:
                  'bg-rose-400',
              },
            ]}
          />
        </div>

        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <ActivityTimeline
            title="Recently Approved"
            items={adminListings
              .filter(
                (listing) =>
                  listing.status ===
                  'Approved',
              )
              .slice(0, 2)
              .map((listing) => ({
                title:
                  listing.title,
                desc:
                  `Owner: ${listing.owner}`,
                time: 'Recently',
                color:
                  'text-emerald-400',
                icon: CheckCircle,
              }))}
          />
        </div>
      </div>

      {selectedRows.size > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl bg-gold-400/10 border border-gold-400/20 px-4 py-3 gap-4">
          <div className="flex items-center gap-4">
            <div className="text-sm font-semibold text-gold-400">
              {selectedRows.size}{' '}
              item
              {selectedRows.size !==
              1
                ? 's'
                : ''}{' '}
              selected
            </div>

            <div className="h-4 w-px bg-gold-400/30" />

            <button
              onClick={toggleAll}
              className="text-xs font-semibold text-gold-400 hover:text-gold-300 transition-colors"
            >
              Select All
            </button>

            <button
              onClick={() =>
                setSelectedRows(
                  new Set(),
                )
              }
              className="text-xs font-semibold text-gold-400 hover:text-gold-300 transition-colors"
            >
              Clear Selection
            </button>
          </div>

          <div className="flex items-center gap-2">
            <GhostButton
              size="sm"
              disabled={
                isActionLoading
              }
              className="text-rose-400 hover:text-rose-300 hover:bg-rose-400/10"
              onClick={() => {
                setActionTarget(
                  'bulk',
                );

                handleReviewAction(
                  'reject',
                );
              }}
            >
              Reject Selected
            </GhostButton>

            <GoldButton
              size="sm"
              disabled={
                isActionLoading
              }
              onClick={() => {
                setActionTarget(
                  'bulk',
                );

                handleReviewAction(
                  'approve',
                );
              }}
            >
              Approve Selected
            </GoldButton>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <DataTableToolbar
          searchValue={searchQuery}
          onSearchChange={
            setSearchQuery
          }
          searchPlaceholder="Search listings..."
        />

        <select
          className="rounded-xl border border-white/10 bg-navy-900/50 py-2.5 px-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none appearance-none min-w-[220px]"
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value,
            )
          }
        >
          <option value="All">
            All Listing Statuses
          </option>

          <option value="Draft">
            Draft
          </option>

          <option value="Pending Review">
            Pending Review
          </option>

          <option value="Approved">
            Approved
          </option>

          <option value="Published">
            Published
          </option>

          <option value="Sold">
            Sold
          </option>

          <option value="Rented">
            Rented
          </option>

          <option value="Leased">
            Leased
          </option>

          <option value="Archived">
            Archived
          </option>
        </select>
      </div>

      <ListingTable
        data={filteredListings}
        mode={mode}
        selectedRows={
          selectedRows
        }
        onToggleSelection={
          toggleSelection
        }
        onToggleAll={
          toggleAll
        }
        onReview={(item) =>
          setPreviewListing(item)
        }
        onApprove={(item) => {
          setActionTarget(item.id);
          handleReviewAction(
            'approve',
          );
        }}
        onReject={(item) => {
          setActionTarget(item.id);
          handleReviewAction(
            'reject',
          );
        }}
        onPublish={(item) => {
          setActionTarget(item.id);
          handleReviewAction(
            'publish',
          );
        }}
        onAssignAgency={(item) =>
          setAssignmentListing(item)
        }
        onMenuAction={(
          action,
          item,
        ) =>
          handleManagementAction(
            action,
            item,
          )
        }
      />

      <ConfirmationModal
        isOpen={
          approvalModalOpen
        }
        onClose={() => {
          if (!isActionLoading) {
            setApprovalModalOpen(
              false,
            );
            setActionTarget(null);
            setReviewNotes('');
          }
        }}
        onConfirm={
          handleApprove
        }
        title={
          actionTarget ===
          'bulk'
            ? `Approve ${selectedRows.size} Properties`
            : 'Approve Property'
        }
        message={
          actionTarget ===
          'bulk'
            ? `Are you sure you want to approve these ${selectedRows.size} properties?`
            : 'Are you sure you want to approve this Property?'
        }
        confirmText={
          isActionLoading
            ? 'Approving...'
            : 'Approve'
        }
      />

      <ConfirmationModal
        isOpen={
          publishModalOpen
        }
        onClose={() => {
          if (!isActionLoading) {
            setPublishModalOpen(
              false,
            );
            setActionTarget(null);
            setReviewNotes('');
          }
        }}
        onConfirm={
          handlePublish
        }
        title="Publish Property"
        message="Are you sure you want to publish this Approved Property? It will become visible in the public marketplace."
        confirmText={
          isActionLoading
            ? 'Publishing...'
            : 'Publish'
        }
      />

      <RejectionReasonModal
        isOpen={
          reasonModalOpen
        }
        actionType={
          actionType
        }
        onClose={() => {
          if (!isActionLoading) {
            setReasonModalOpen(
              false,
            );
            setActionTarget(null);
            setReviewNotes('');
          }
        }}
        onConfirm={async (
          reason,
          type,
        ) => {
          if (
            type === 'reject'
          ) {
            await handleReject(
              reason,
            );
          }
        }}
      />

      <ListingDetailModal
        key={
          previewListing?.id ||
          'modal'
        }
        isOpen={
          !!previewListing
        }
        onClose={() =>
          setPreviewListing(null)
        }
        listing={
          previewListing
        }
        onAction={(
          type,
          notes,
        ) => {
          setPreviewListing(
            null,
          );

          setReviewNotes(
            notes.trim(),
          );

          handleReviewAction(
            type,
            notes,
          );
        }}
      />

      <AgencyAssignmentModal
        isOpen={
          !!assignmentListing
        }
        onClose={() =>
          setAssignmentListing(null)
        }
        listing={
          assignmentListing
        }
        onAssign={(
          agencyId,
        ) => {
          void handleAgencyAssignment(
            agencyId,
          );
        }}
      />
    </div>
  );
}
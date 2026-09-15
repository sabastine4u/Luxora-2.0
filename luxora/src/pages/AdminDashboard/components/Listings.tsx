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
import { GhostButton, GoldButton } from '../../../components/ui/ui';
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
  mode?: 'operational' | 'oversight';
}

// Represent the Property structure returned by the Admin backend.
interface AdminProperty {
  _id: string;
  title: string;

  // Used to determine which price field should be displayed.
  transactionType?: string;

  state?: string;
  city?: string;

  // Sale/purchase price.
  price?: number | null;

  // Rental amount when available.
  rentAmount?: number | null;

  currency?: string;
  priceFrequency?: string | null;

  // Real Property lifecycle state from the backend.
  status?: string;

  // Real Property verification level from the backend.
  verificationLevel?: string;

  // Real Property assignment status from the backend.
  assignmentStatus?: string;

  // Populated Agency information.
  agency?: {
    _id?: string;
    name?: string;
  } | null;

  // Populated Agent information.
  agent?: {
    _id?: string;
    user?: {
      fullName?: string;
    } | null;
  } | null;

  // Populated Owner information.
  owner?: {
    _id?: string;
    fullName?: string;
  } | null;

  createdAt?: string;
  updatedAt?: string;

  // Property documents returned by the backend.
  documents?: Array<{
    name?: string;
    type?: string;
    size?: string;
  }>;
}

// Convert the real backend Property into the existing AdminListing table shape.
const mapPropertyToAdminListing = (
  property: AdminProperty,
): AdminListing => {
  // Use rentAmount for rental properties and price for other transaction types.
  const rawPrice =
    property.transactionType === 'rent' ||
    property.priceFrequency === 'monthly' ||
    property.priceFrequency === 'yearly'
      ? property.rentAmount ?? property.price
      : property.price;

  // Format the real property amount using Nigerian currency formatting.
  const formattedPrice =
    typeof rawPrice === 'number'
      ? new Intl.NumberFormat('en-NG', {
          style: 'currency',
          currency: property.currency || 'NGN',
          maximumFractionDigits: 0,
        }).format(rawPrice)
      : 'N/A';

  // Add the rental frequency when the backend provides one.
  const frequency =
    property.priceFrequency &&
    property.priceFrequency !== 'total'
      ? `/${property.priceFrequency}`
      : '';

  // Keep the actual Property lifecycle status from the backend.
  const listingStatus =
    property.status || 'Draft';

  // Convert backend assignment state into the existing AdminListing assignment values.
  let assignmentStatus:
    | 'Ready for Agency Assignment'
    | 'Assigned to Agency'
    | 'Agency Acknowledged'
    | 'Cancelled'
    | undefined;

  // Handle rejected Agent assignments.
  if (
    property.assignmentStatus ===
    'Agent Declined'
  ) {
    assignmentStatus = 'Cancelled';
  }

  // Handle Properties already assigned to an Agency.
  else if (
    property.assignmentStatus ===
      'Agency Assigned' ||
    property.assignmentStatus ===
      'Agent Assigned' ||
    property.assignmentStatus ===
      'Agent Accepted' ||
    property.agency
  ) {
    assignmentStatus =
      'Assigned to Agency';
  }

  // Handle Properties still waiting for an Agency.
  else if (
    property.assignmentStatus ===
    'Pending Agency Assignment'
  ) {
    assignmentStatus =
      'Ready for Agency Assignment';
  }

  return {
    // Keep the real MongoDB ID internally for backend actions and selection.
    id: property._id,

    // Display the actual Property title.
    title: property.title,

    // Display the readable Owner name.
    owner:
      property.owner?.fullName ||
      'Unassigned',

    // Display the readable location.
    location:
      [property.city, property.state]
        .filter(Boolean)
        .join(', ') ||
      'Location not provided',

    // Display the real Property amount.
    price: `${formattedPrice}${frequency}`,

    // Preserve the real lifecycle status.
    status: listingStatus,

    // Keep unverified Properties marked for attention.
    priority:
      property.verificationLevel ===
      'Unverified'
        ? 'High'
        : 'Normal',

    // Keep verification separate from lifecycle status.
    verification: {
      status: listingStatus,

      // Verification checklist will be connected separately.
      checklist: [],

      // Preserve real Property documents.
      documents:
        property.documents?.map(
          (document, index) => ({
            name:
              document.name ||
              `Document ${index + 1}`,
            type:
              document.type ||
              'Document',
            size: document.size,
          }),
        ) || [],

      // Preserve the real verification level for the detail UI.
      notes: `Verification level: ${
        property.verificationLevel ||
        'Unverified'
      }`,

      // Approval history will be connected through the Approval records later.
      history: [],
    },

    // Preserve Agency assignment information.
    assignment: assignmentStatus
      ? {
          // Keep an internal assignment reference.
          id:
            property.agency?._id ||
            property._id,

          // Preserve the assignment state.
          status: assignmentStatus,

          // Keep the Agency ID internally.
          agencyId:
            property.agency?._id,

          // Display the readable Agency name.
          agencyName:
            property.agency?.name,

          // Preserve the latest assignment timestamp.
          assignedAt:
            property.updatedAt,
        }
      : undefined,
  };
};

export default function Listings({
  pageTitle = 'Verification Queue',
  pageSubtitle = 'Review, verify, and approve property submissions before Agency Assignment.',
  mode = 'operational',
}: ListingsProps) {
  const navigate = useNavigate();

  // Show backend success and error feedback to the Admin.
  const { showToast } = useToast();

  // Search input state.
  const [searchQuery, setSearchQuery] =
    useState('');

  // Current lifecycle status filter.
  const [statusFilter, setStatusFilter] =
    useState('All');

  // Selected Property IDs.
  const [selectedRows, setSelectedRows] =
    useState<Set<string>>(
      new Set(),
    );

  // Approval confirmation modal state.
  const [approvalModalOpen, setApprovalModalOpen] =
    useState(false);

  // Rejection modal state.
  const [reasonModalOpen, setReasonModalOpen] =
    useState(false);

  // Current review action.
  const [actionType, setActionType] =
    useState<ReviewActionType>(
      'reject',
    );

  // Property ID or bulk action target.
  const [actionTarget, setActionTarget] =
    useState<string | null>(
      null,
    );

  // Property currently shown in the detail modal.
  const [previewListing, setPreviewListing] =
    useState<AdminListing | null>(
      null,
    );

  // Property currently shown in Agency Assignment modal.
  const [assignmentListing, setAssignmentListing] =
    useState<AdminListing | null>(
      null,
    );

  // Store the real Property records.
  const [properties, setProperties] =
    useState<AdminProperty[]>([]);

  // Track initial Property loading state.
  const [isLoading, setIsLoading] =
    useState(true);

  // Track errors from the initial Property request.
  const [loadError, setLoadError] =
    useState<string | null>(
      null,
    );

  // Track an active backend action.
  const [isActionLoading, setIsActionLoading] =
    useState(false);

  // Store notes typed into the Listing Detail Modal.
  const [reviewNotes, setReviewNotes] =
    useState('');

  // Fetch the full Admin Property collection.
  const loadProperties = async () => {
    try {
      // Clear an existing load error.
      setLoadError(null);

      // Request all Properties from the Admin endpoint.
const response =
  await adminApi.getProperties();

// The HTTP interceptor unwraps the Axios response at runtime,
// so cast the returned payload to the expected Property shape.
const data = response as unknown as {
  properties?: AdminProperty[];
};

// Store the returned Property collection.
setProperties(
  data.properties || [],
);
    } catch (error) {
      // Log the actual request failure.
      console.error(
        'Failed to load Admin properties:',
        error,
      );

      // Show a user-friendly page error.
      setLoadError(
        'Unable to load properties right now.',
      );

      // Clear incomplete data.
      setProperties([]);
    } finally {
      // Stop the initial loading state.
      setIsLoading(false);
    }
  };

  // Load Properties when the Admin page mounts.
  useEffect(() => {
    void loadProperties();
  }, []);

  // Convert backend Properties into the existing table shape.
  const adminListings = useMemo(
    () =>
      properties.map(
        mapPropertyToAdminListing,
      ),
    [properties],
  );

  // Filter the real listings.
  const filteredListings = useMemo(() => {
    return adminListings.filter(
      (listing) => {
        // Normalize the search input.
        const search =
          searchQuery
            .trim()
            .toLowerCase();

        // Search using the readable Property name.
        const matchesTitle =
          listing.title
            .toLowerCase()
            .includes(search);

        // Search using the readable Owner name.
        const matchesOwner =
          listing.owner
            .toLowerCase()
            .includes(search);

        // Match the actual Property lifecycle status.
        const matchesStatus =
          statusFilter ===
            'All' ||
          listing.status ===
            statusFilter;

        return (
          (matchesTitle ||
            matchesOwner) &&
          matchesStatus
        );
      },
    );
  }, [
    adminListings,
    searchQuery,
    statusFilter,
  ]);

  // Total number of real Properties.
  const totalListings =
    adminListings.length;

  // Properties waiting for Admin review.
  const pendingReviewCount =
    adminListings.filter(
      (listing) =>
        listing.status ===
        'Pending Review',
    ).length;

  // Properties approved by Admin/Super Admin.
  const approvedCount =
    adminListings.filter(
      (listing) =>
        listing.status ===
        'Approved',
    ).length;

  // Properties still in Draft.
  const draftCount =
    adminListings.filter(
      (listing) =>
        listing.status ===
        'Draft',
    ).length;

  // Published Properties.
  const publishedCount =
    adminListings.filter(
      (listing) =>
        listing.status ===
        'Published',
    ).length;

  // Completed marketplace transactions.
  const completedListingsCount =
    adminListings.filter(
      (listing) =>
        listing.status === 'Sold' ||
        listing.status === 'Rented' ||
        listing.status === 'Leased',
    ).length;

  // Approved percentage.
  const approvalPercentage =
    totalListings > 0
      ? Math.round(
          (approvedCount /
            totalListings) *
            100,
        )
      : 0;

  // Pending review percentage.
  const reviewPercentage =
    totalListings > 0
      ? Math.round(
          (pendingReviewCount /
            totalListings) *
            100,
        )
      : 0;

  // Draft percentage.
  const draftPercentage =
    totalListings > 0
      ? Math.round(
          (draftCount /
            totalListings) *
            100,
        )
      : 0;

  // Toggle one row using the internal Property ID.
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

  // Select all currently visible Properties.
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

  // Open the correct action modal and preserve Listing Detail notes.
  const handleReviewAction = (
    type:
      | 'approve'
      | 'return'
      | 'hold'
      | 'reject',
    notes = '',
  ) => {
    // Preserve the notes typed inside the Listing Detail Modal.
    setReviewNotes(
      notes.trim(),
    );

    // Approval uses the confirmation modal.
    if (type === 'approve') {
      setApprovalModalOpen(
        true,
      );
      return;
    }

    // Reject uses the real backend approval/rejection endpoint.
    if (type === 'reject') {
      setActionType(
        'reject',
      );

      setReasonModalOpen(
        true,
      );

      return;
    }

    // Return/Hold are not backed by supported Property lifecycle states yet.
    showToast({
      type: 'info',
      title: 'Workflow Not Available Yet',
      description:
        'Return and Hold require dedicated backend workflow states. They have not been mapped to another action.',
    });
  };

  // Approve one or many real Properties through the backend.
  const handleApprove = async () => {
    try {
      // Prevent duplicate clicks while the backend action is running.
      setIsActionLoading(true);

      // Determine whether this is a bulk approval or a single Property.
      const ids =
        actionTarget === 'bulk'
          ? Array.from(
              selectedRows,
            )
          : actionTarget
            ? [actionTarget]
            : [];

      // Stop if no Property was selected.
      if (ids.length === 0) {
        return;
      }

      // Only Properties already in Pending Review can be approved by the backend.
      const selectedListings =
        adminListings.filter(
          (listing) =>
            ids.includes(
              listing.id,
            ),
        );

      const approvableListings =
        selectedListings.filter(
          (listing) =>
            listing.status ===
            'Pending Review',
        );

      // Tell the Admin why nothing can be approved.
      if (
        approvableListings.length ===
        0
      ) {
        showToast({
          type: 'info',
          title: 'Nothing to Approve',
          description:
            'Only Properties with Pending Review status can be approved.',
        });

        return;
      }

      // Use the notes from the Listing Detail Modal as the real reviewNotes value.
      const formattedReviewNotes =
        reviewNotes.trim();

      // Approve every eligible Property through the existing approval API.
      for (const listing of approvableListings) {
        await propertyApi.approveProperty(
          listing.id,
          {
            decision:
              'Approved',

            // Persist the actual notes entered by the Admin.
            reviewNotes:
              formattedReviewNotes,
          },
        );
      }

      // Reload the real Property collection after successful approval.
      await loadProperties();

      // Clear selected rows after the backend succeeds.
      setSelectedRows(
        new Set(),
      );

      // Close the confirmation modal.
      setApprovalModalOpen(
        false,
      );

      // Clear the action target.
      setActionTarget(
        null,
      );

      // Clear the saved review notes.
      setReviewNotes('');

      // Tell the Admin the action succeeded.
      showToast({
        type:
          'success',
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
      // Log the actual backend failure.
      console.error(
        'Failed to approve Property:',
        error,
      );

      // Show the server's real error message when available.
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
      // Allow another action after the request finishes.
      setIsActionLoading(
        false,
      );
    }
  };

  // Reject one or many real Properties through the backend.
  const handleReject = async (
    reason: string,
  ) => {
    try {
      // Prevent repeated submissions while rejecting.
      setIsActionLoading(true);

      // Determine the target Property IDs.
      const ids =
        actionTarget === 'bulk'
          ? Array.from(
              selectedRows,
            )
          : actionTarget
            ? [actionTarget]
            : [];

      // Stop if no Property is selected.
      if (ids.length === 0) {
        return;
      }

      // Reject only Properties currently waiting for review.
      const selectedListings =
        adminListings.filter(
          (listing) =>
            ids.includes(
              listing.id,
            ),
        );

      const rejectableListings =
        selectedListings.filter(
          (listing) =>
            listing.status ===
            'Pending Review',
        );

      // Tell the Admin when none of the selected records can be rejected.
      if (
        rejectableListings.length ===
        0
      ) {
        showToast({
          type: 'info',
          title: 'Nothing to Reject',
          description:
            'Only Properties with Pending Review status can be rejected.',
        });

        return;
      }

      // Keep both note sources instead of losing the Listing Detail notes.
      const detailNotes =
        reviewNotes.trim();

      const rejectionReason =
        reason.trim();

      const finalReviewNotes =
        [detailNotes, rejectionReason]
          .filter(Boolean)
          .join('\n\n');

      // Reject every eligible Property through the real approval endpoint.
      for (const listing of rejectableListings) {
        await propertyApi.approveProperty(
          listing.id,
          {
            decision:
              'Rejected',

            // Persist both the Listing Detail notes and rejection reason.
            reviewNotes:
              finalReviewNotes,
          },
        );
      }

      // Reload the real Property collection after the rejection.
      await loadProperties();

      // Clear selected rows.
      setSelectedRows(
        new Set(),
      );

      // Close the rejection modal.
      setReasonModalOpen(
        false,
      );

      // Clear the action target.
      setActionTarget(
        null,
      );

      // Clear the stored Listing Detail notes.
      setReviewNotes('');

      // Notify the Admin.
      showToast({
        type:
          'success',
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
      // Log the actual rejection failure.
      console.error(
        'Failed to reject Property:',
        error,
      );

      // Display the backend error.
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
      // Allow another action after completion.
      setIsActionLoading(
        false,
      );
    }
  };

  // Assign a Property to a real Agency through the backend.
  const handleAgencyAssignment = async (
    agencyId: string,
  ) => {
    try {
      // Prevent duplicate assignment requests.
      setIsActionLoading(true);

      // Assignment requires a real Property ID.
      if (!assignmentListing) {
        return;
      }

      // Call the existing Admin/Super Admin Agency assignment endpoint.
      await propertyApi.assignPropertyToAgency(
        assignmentListing.id,
        agencyId,
      );

      // Reload the real Properties after the assignment succeeds.
      await loadProperties();

      // Close the assignment modal.
      setAssignmentListing(
        null,
      );

      // Notify the Admin.
      showToast({
        type: 'success',
        title: 'Agency Assigned',
        description:
          `${assignmentListing.title} was assigned successfully.`,
      });
    } catch (error: any) {
      // Log the real backend failure.
      console.error(
        'Failed to assign Agency:',
        error,
      );

      // Display the server's real error.
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
      // Allow another assignment after the request completes.
      setIsActionLoading(
        false,
      );
    }
  };

  // Display the loading state while the first Property request is running.
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

        {/* KPI loading skeletons. */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({
            length: 4,
          }).map(
            (_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 animate-pulse"
              >
                <div className="h-4 w-28 rounded bg-white/10" />
                <div className="mt-4 h-8 w-20 rounded bg-white/10" />
                <div className="mt-4 h-3 w-32 rounded bg-white/10" />
              </div>
            ),
          )}
        </div>

        {/* Analytics loading skeletons. */}
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

        {/* Listing table loading skeleton. */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 animate-pulse">
          <div className="h-5 w-48 rounded bg-white/10" />

          <div className="mt-6 space-y-4">
            {Array.from({
              length: 5,
            }).map(
              (_, index) => (
                <div
                  key={index}
                  className="grid grid-cols-4 gap-4"
                >
                  <div className="h-5 rounded bg-white/10" />
                  <div className="h-5 rounded bg-white/10" />
                  <div className="h-5 rounded bg-white/10" />
                  <div className="h-5 rounded bg-white/10" />
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    );
  }

  // Display a clear error when the Property collection cannot be loaded.
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
            title="Recently Verified"
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
                desc: `Owned by ${listing.owner}`,
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
        selectedRows={selectedRows}
        onToggleSelection={
          toggleSelection
        }
        onToggleAll={toggleAll}
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
        onAssignAgency={(item) =>
          setAssignmentListing(item)
        }
      />

      <ConfirmationModal
        isOpen={approvalModalOpen}
        onClose={() => {
          if (
            !isActionLoading
          ) {
            setApprovalModalOpen(
              false,
            );

            setActionTarget(
              null,
            );

            // Clear notes if the Admin cancels approval.
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
            ? `Are you sure you want to approve these ${selectedRows.size} properties? Only Properties currently pending review can be approved.`
            : 'Are you sure you want to approve this Property? It must currently be pending review.'
        }
        confirmText={
          isActionLoading
            ? 'Approving...'
            : 'Approve'
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
          if (
            !isActionLoading
          ) {
            setReasonModalOpen(
              false,
            );

            setActionTarget(
              null,
            );

            // Clear notes if the Admin cancels rejection.
            setReviewNotes('');
          }
        }}
        onConfirm={async (
          reason,
          type,
        ) => {
          // Only the Reject action currently has a matching backend workflow.
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
          setPreviewListing(
            null,
          )
        }
        listing={
          previewListing
        }
        onAction={(type, notes) => {
          // Close the detail modal before opening the next review modal.
          setPreviewListing(
            null,
          );

          // Preserve the actual notes entered in the Listing Detail Modal.
          setReviewNotes(
            notes.trim(),
          );

          // Continue with the selected backend review action.
          setTimeout(
            () =>
              handleReviewAction(
                type,
                notes,
              ),
            150,
          );
        }}
      />

      <AgencyAssignmentModal
        isOpen={
          !!assignmentListing
        }
        onClose={() =>
          setAssignmentListing(
            null,
          )
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
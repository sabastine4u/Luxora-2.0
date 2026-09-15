import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  MoreHorizontal,
  SearchX,
  Users,
  XCircle,
  UserPlus,
  Activity,
  UserCheck,
  CheckCircle,
  Loader2,
  Save,
  X,
  ShieldCheck,
  Eye,
} from 'lucide-react';

import { ActivityTimeline } from '../../../components/dashboard/shared/timelines/ActivityTimeline';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { useToast } from '../../../contexts/ToastContext';

import { adminApi } from '../../../api/admin.api';

import type { AdminBuyer } from '../../../types/admin';

/*
 * Extend the existing AdminBuyer type with the real backend fields
 * needed by the Admin Buyer management page.
 */
type AdminBuyerRow = AdminBuyer & {
  verificationStatus: 'Verified' | 'Pending';
  isActive: boolean;
  isVerified: boolean;
  phone: string;
  createdAt: string | null;
  lastLoginAt: string | null;
  lastActivityAt: string | null;
  bookings: number;
};

/*
 * Represent the real Buyer activity records returned by the backend.
 */
type BuyerActivity = {
  type: 'favorite' | 'booking';
  title: string;
  description: string;
  createdAt: string;
};

/*
 * Describe the payload returned by the Admin Buyer list endpoint.
 *
 * The HTTP client unwraps the Axios response at runtime, but the current
 * API method typing still exposes AxiosResponse to TypeScript.
 */
type GetBuyersResponse = {
  buyers?: any[];
  activities?: BuyerActivity[];
};

/*
 * Describe the payload returned by Buyer update endpoints.
 */
type BuyerUpdateResponse = {
  user: any;
};

/*
 * Convert a backend Buyer record into the structure used by this page.
 */
const mapUserToAdminBuyer = (
  apiUser: any,
): AdminBuyerRow => ({
  /*
   * Keep the MongoDB ID internally for row identity and future actions.
   */
  id: String(apiUser._id),

  /*
   * Display the real Buyer identity.
   */
  name: apiUser.fullName || 'Unnamed Buyer',
  email: apiUser.email || 'No email',

  /*
   * Use the real number of saved Properties returned by the backend.
   */
  saved: Number(apiUser.savedCount || 0),

  /*
   * Keep the raw creation timestamp internally for KPI calculations.
   */
  createdAt: apiUser.createdAt
    ? String(apiUser.createdAt)
    : null,

  /*
   * Format the real registration date for the table.
   */
  joined: apiUser.createdAt
    ? new Date(apiUser.createdAt).toLocaleDateString()
    : 'N/A',

  /*
   * Keep the latest successful-login timestamp from the backend.
   */
  lastLoginAt: apiUser.lastLoginAt
    ? String(apiUser.lastLoginAt)
    : null,

  /*
   * Keep the latest activity timestamp derived by the backend.
   */
  lastActivityAt: apiUser.lastActivityAt
    ? String(apiUser.lastActivityAt)
    : null,

  /*
   * Show the most meaningful real activity date in the UI.
   */
  lastActive: apiUser.lastActivityAt
    ? new Date(apiUser.lastActivityAt).toLocaleString()
    : 'N/A',

  /*
   * Account STATUS comes from isActive, not isVerified.
   */
  status: apiUser.isActive
    ? 'Active'
    : 'Suspended',

  /*
   * Keep the backend account-state flags separately.
   */
  isActive: Boolean(apiUser.isActive),
  isVerified: Boolean(apiUser.isVerified),

  /*
   * Verification is deliberately separate from operational status.
   */
  verificationStatus: apiUser.isVerified
    ? 'Verified'
    : 'Pending',

  /*
   * Preserve the real phone number for the Edit Buyer form.
   */
  phone: apiUser.phone || '',

  /*
   * Keep the real number of viewing requests submitted by this Buyer.
   */
  bookings: Number(apiUser.bookingCount || 0),
});

/*
 * Convert a backend timestamp into a short relative-time label.
 */
const formatRelativeTime = (value: string) => {
  const timestamp = new Date(value).getTime();
  const diff = Date.now() - timestamp;

  if (Number.isNaN(timestamp)) {
    return 'Unknown time';
  }

  if (diff < 60 * 1000) {
    return 'Just now';
  }

  if (diff < 60 * 60 * 1000) {
    return `${Math.floor(diff / (60 * 1000))} mins ago`;
  }

  if (diff < 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / (60 * 60 * 1000))} hours ago`;
  }

  return `${Math.floor(diff / (24 * 60 * 60 * 1000))} days ago`;
};

export default function Buyers() {
  /*
   * Store the current Buyer search query.
   */
  const [searchQuery, setSearchQuery] = useState('');

  /*
   * Store the selected Buyer for the detail drawer.
   */
  const [selectedUser, setSelectedUser] =
    useState<AdminBuyerRow | null>(null);

  /*
   * Store the real Buyer records returned by the backend.
   */
  const [buyers, setBuyers] = useState<AdminBuyerRow[]>([]);

  /*
   * Store the real recent Buyer activity returned by the backend.
   */
  const [activities, setActivities] = useState<BuyerActivity[]>([]);

  /*
   * Track the Buyer list loading state.
   */
  const [isLoadingBuyers, setIsLoadingBuyers] =
    useState(true);

  /*
   * Track whether the status filter controls are visible.
   */
  const [showStatusFilter, setShowStatusFilter] =
    useState(false);

  /*
   * Track the selected account-status filter.
   */
  const [statusFilter, setStatusFilter] =
    useState<'All' | 'Active' | 'Suspended'>('All');

  /*
   * Track whether the Edit Buyer controls are visible.
   */
  const [isEditingBuyer, setIsEditingBuyer] =
    useState(false);

  /*
   * Track the profile-save request.
   */
  const [isSavingBuyer, setIsSavingBuyer] =
    useState(false);

  /*
   * Track the suspend/reactivate request.
   */
  const [isUpdatingStatus, setIsUpdatingStatus] =
    useState(false);

  /*
   * Store the editable Buyer name.
   */
  const [editName, setEditName] = useState('');

  /*
   * Store the editable Buyer email.
   */
  const [editEmail, setEditEmail] = useState('');

  /*
   * Store the editable Buyer phone.
   */
  const [editPhone, setEditPhone] = useState('');

  /*
   * Use the existing project toast system for feedback.
   */
  const { showToast } = useToast();

  /*
   * Fetch the real Buyers and activity data from the Admin API.
   */
  const fetchBuyers = useCallback(async () => {
    try {
      setIsLoadingBuyers(true);

      const response = await adminApi.getBuyers();

      /*
       * The HTTP client unwraps the API envelope at runtime.
       *
       * Cast the returned payload to its real application shape so
       * TypeScript knows about buyers and activities.
       */
      const buyerResponse =
        response as unknown as GetBuyersResponse;

      /*
       * Map the real backend Buyer collection into UI rows.
       */
      setBuyers(
        (buyerResponse.buyers ?? []).map(
          mapUserToAdminBuyer,
        ),
      );

      /*
       * Keep the real Buyer activity feed synchronized with the list.
       */
      setActivities(
        buyerResponse.activities ?? [],
      );
    } catch (error) {
      console.error(
        'Failed to load buyers:',
        error,
      );

      setBuyers([]);
      setActivities([]);
    } finally {
      setIsLoadingBuyers(false);
    }
  }, []);

  /*
   * Load Buyers when the page opens.
   */
  useEffect(() => {
    void fetchBuyers();
  }, [fetchBuyers]);

  /*
   * Calculate the real number of Buyer registrations in the last 30 days.
   */
  const newRegistrations = useMemo(() => {
    const thirtyDaysAgo =
      Date.now() -
      30 * 24 * 60 * 60 * 1000;

    return buyers.filter((buyer) => {
      if (!buyer.createdAt) {
        return false;
      }

      const createdTime = new Date(
        buyer.createdAt,
      ).getTime();

      return (
        !Number.isNaN(createdTime) &&
        createdTime >= thirtyDaysAgo
      );
    }).length;
  }, [buyers]);

  /*
   * Calculate the real number of active Buyers.
   */
  const activeBuyers = useMemo(
    () =>
      buyers.filter(
        (buyer) => buyer.isActive,
      ).length,
    [buyers],
  );

  /*
   * Calculate the real number of suspended Buyers.
   */
  const suspendedBuyers = useMemo(
    () =>
      buyers.filter(
        (buyer) => !buyer.isActive,
      ).length,
    [buyers],
  );

  /*
   * Apply the search query and account-status filter
   * to the real Buyer records.
   */
  const filteredBuyers = useMemo(() => {
    const query = searchQuery
      .toLowerCase()
      .trim();

    return buyers.filter((buyer) => {
      const matchesSearch =
        !query ||
        buyer.name
          .toLowerCase()
          .includes(query) ||
        buyer.email
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === 'All' ||
        buyer.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [
    buyers,
    searchQuery,
    statusFilter,
  ]);

  /*
   * Open the detail drawer and initialize its editable fields
   * from the selected real Buyer record.
   */
  const handleSelectBuyer = (
    buyer: AdminBuyerRow,
  ) => {
    setSelectedUser(buyer);
    setIsEditingBuyer(false);
    setEditName(buyer.name);
    setEditEmail(buyer.email);
    setEditPhone(buyer.phone);
  };

  /*
   * Save the edited Buyer fields through the real backend endpoint.
   */
  const handleSaveBuyer = async () => {
    if (!selectedUser) {
      return;
    }

    try {
      setIsSavingBuyer(true);

      const response =
        await adminApi.updateBuyer(
          selectedUser.id,
          {
            fullName: editName,
            email: editEmail,
            phone: editPhone || null,
          },
        );

      /*
       * The HTTP client unwraps the API envelope at runtime.
       *
       * Type the actual application payload before reading user.
       */
      const buyerResponse =
        response as unknown as BuyerUpdateResponse;

      const updatedBuyer =
        mapUserToAdminBuyer(
          buyerResponse.user,
        );

      /*
       * Update the real Buyer row immediately.
       */
      setBuyers((current) =>
        current.map((buyer) =>
          buyer.id === updatedBuyer.id
            ? updatedBuyer
            : buyer,
        ),
      );

      /*
       * Keep the currently open drawer synchronized.
       */
      setSelectedUser(updatedBuyer);
      setEditName(updatedBuyer.name);
      setEditEmail(updatedBuyer.email);
      setEditPhone(updatedBuyer.phone);
      setIsEditingBuyer(false);

      showToast({
        type: 'success',
        title: 'Buyer Updated',
        description:
          'Buyer profile information was updated successfully.',
      });
    } catch (error) {
      console.error(
        'Failed to update Buyer:',
        error,
      );

      showToast({
        type: 'error',
        title: 'Update Failed',
        description:
          'The Buyer profile could not be updated.',
      });
    } finally {
      setIsSavingBuyer(false);
    }
  };

  /*
   * Suspend or reactivate the selected Buyer account.
   *
   * Verification is intentionally left unchanged.
   */
  const handleStatusChange = async () => {
    if (!selectedUser) {
      return;
    }

    const nextIsActive =
      !selectedUser.isActive;

    try {
      setIsUpdatingStatus(true);

      const response =
        await adminApi.updateBuyerStatus(
          selectedUser.id,
          nextIsActive,
        );

      /*
       * The HTTP client unwraps the API envelope at runtime.
       *
       * Type the actual application payload before reading user.
       */
      const buyerResponse =
        response as unknown as BuyerUpdateResponse;

      const updatedBuyer =
        mapUserToAdminBuyer(
          buyerResponse.user,
        );

      /*
       * Update the selected Buyer and list immediately.
       */
      setBuyers((current) =>
        current.map((buyer) =>
          buyer.id === updatedBuyer.id
            ? updatedBuyer
            : buyer,
        ),
      );

      setSelectedUser(updatedBuyer);

      showToast({
        type: 'success',
        title: nextIsActive
          ? 'Buyer Reactivated'
          : 'Buyer Suspended',
        description: nextIsActive
          ? 'The Buyer account is active again.'
          : 'The Buyer account has been suspended.',
      });
    } catch (error) {
      console.error(
        'Failed to update Buyer status:',
        error,
      );

      showToast({
        type: 'error',
        title: 'Status Update Failed',
        description:
          'The Buyer account status could not be changed.',
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  /*
   * Convert real backend activities into the existing
   * ActivityTimeline component shape.
   */
  const timelineItems = useMemo(
    () =>
      activities.map((activity) => ({
        title: activity.title,
        desc: activity.description,
        time: formatRelativeTime(
          activity.createdAt,
        ),
        color:
          activity.type === 'favorite'
            ? 'text-emerald-400'
            : 'text-blue-400',
        icon:
          activity.type === 'favorite'
            ? Activity
            : Eye,
      })),
    [activities],
  );

  return (
    <div className="space-y-6">
      {/* Page heading. */}
      <DashboardHeader
        name="Buyer Management"
        subtitle="Manage and monitor property buyers on the platform."
      />

      {/* Real Buyer KPI statistics. */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Buyers"
          value={
            isLoadingBuyers
              ? '—'
              : buyers.length.toLocaleString()
          }
          icon={Users}
          trend={
            isLoadingBuyers
              ? 'Loading buyers...'
              : 'Registered buyers'
          }
          trendColor="text-emerald-400"
          iconColor="text-blue-400"
        />

        <KPICard
          title="New Registrations"
          value={
            isLoadingBuyers
              ? '—'
              : newRegistrations.toLocaleString()
          }
          icon={UserPlus}
          trend="Last 30 days"
          trendColor="text-emerald-400"
          iconColor="text-purple-400"
        />

        <KPICard
          title="Active Buyers"
          value={
            isLoadingBuyers
              ? '—'
              : activeBuyers.toLocaleString()
          }
          icon={UserCheck}
          trend="Account status"
          trendColor="text-emerald-400"
          iconColor="text-emerald-400"
        />

        <KPICard
          title="Suspended Buyers"
          value={
            isLoadingBuyers
              ? '—'
              : suspendedBuyers.toLocaleString()
          }
          icon={XCircle}
          trend={
            isLoadingBuyers
              ? 'Loading...'
              : suspendedBuyers > 0
              ? 'Requires attention'
              : 'No suspended buyers'
          }
          trendColor="text-rose-400"
          iconColor="text-rose-400"
          backgroundColor="bg-rose-400/10"
        />
      </div>

      {/* Main Buyer management section. */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Buyer table section. */}
        <div className="lg:col-span-2 space-y-6">
          <DataTableToolbar
            searchValue={searchQuery}
            onSearchChange={
              setSearchQuery
            }
            searchPlaceholder="Search buyers..."
            showFilter
            onFilter={() =>
              setShowStatusFilter(
                (current) => !current,
              )
            }
            showRefresh
            onRefresh={() => {
              void fetchBuyers();
            }}
          />

          {/* Real account-status filter options. */}
          {showStatusFilter && (
            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-navy-800/30 p-3">
              {(
                ['All', 'Active', 'Suspended'] as const
              ).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() =>
                    setStatusFilter(status)
                  }
                  className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
                    statusFilter === status
                      ? 'border-gold-400/40 bg-gold-400/10 text-gold-300'
                      : 'border-white/10 bg-white/5 text-ink/60 hover:text-cream'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          )}

          <DataTable
            data={filteredBuyers}
            isLoading={isLoadingBuyers}
            keyExtractor={(buyer) => buyer.id}
            columns={[
              {
                /*
                 * Keep the MongoDB ID internal and show Buyer identity instead.
                 */
                header: 'Buyer',
                render: (buyer) => (
                  <div>
                    <div className="font-semibold text-cream">
                      {buyer.name}
                    </div>

                    <div className="text-xs text-ink/50">
                      {buyer.email}
                    </div>
                  </div>
                ),
              },

              {
                header: 'Saved Properties',
                render: (buyer) => (
                  <span className="font-semibold text-gold-400">
                    {buyer.saved}
                  </span>
                ),
              },

              {
                header: 'Joined / Last Active',
                render: (buyer) => (
                  <div>
                    <div className="text-ink/60">
                      {buyer.joined}
                    </div>

                    <div className="text-xs text-ink/40 mt-0.5">
                      {buyer.lastActive}
                    </div>
                  </div>
                ),
              },

              {
                header: 'Status',
                render: (buyer) => (
                  <div className="w-fit">
                    <EnterpriseStatusBadge
                      status={buyer.status}
                    />
                  </div>
                ),
              },

              {
                header: 'Verification',
                render: (buyer) => (
                  <div className="w-fit">
                    <EnterpriseStatusBadge
                      status={
                        buyer.verificationStatus
                      }
                    />
                  </div>
                ),
              },

              {
                header: (
                  <div className="text-right">
                    Actions
                  </div>
                ),
                className: 'text-right',
                render: (buyer) => (
                  <button
                    type="button"
                    className="rounded-lg p-2 text-ink/40 hover:bg-white/10 hover:text-cream transition-colors"
                    onClick={() =>
                      handleSelectBuyer(buyer)
                    }
                    title="View buyer details"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                ),
              },
            ]}
            emptyState={
              <div className="flex flex-col items-center justify-center py-12 text-center bg-navy-900/50 rounded-xl border border-white/5 border-dashed">
                {isLoadingBuyers ? (
                  <>
                    <Loader2 className="h-12 w-12 text-gold-400/60 mb-4 animate-spin" />

                    <h3 className="text-lg font-bold text-cream">
                      Loading buyers
                    </h3>

                    <p className="text-sm text-ink/50 mt-1">
                      Fetching real Buyer accounts from the backend.
                    </p>
                  </>
                ) : (
                  <>
                    <SearchX className="h-12 w-12 text-ink/20 mb-4" />

                    <h3 className="text-lg font-bold text-cream">
                      No buyers found
                    </h3>

                    <p className="text-sm text-ink/50 mt-1">
                      Try adjusting your search or filters.
                    </p>
                  </>
                )}
              </div>
            }
          />
        </div>

        {/* Real Buyer activity section. */}
        <ActivityTimeline
          title="Recently Active Buyers"
          items={timelineItems}
          emptyState={
            <div className="text-center py-6 text-sm text-ink/50">
              No recent Buyer activity.
            </div>
          }
        />
      </div>

      {/* Buyer details and editing drawer. */}
      <EnterpriseDetailDrawer
        isOpen={!!selectedUser}
        onClose={() => {
          setSelectedUser(null);
          setIsEditingBuyer(false);
        }}
        title="Buyer Details"
        subtitle={selectedUser?.name}
        footerActions={
          selectedUser ? (
            <div className="flex w-full flex-wrap gap-3">
              {/* Existing Edit Buyer action is preserved and functional. */}
              {!isEditingBuyer && (
                <GoldButton
                  onClick={() => {
                    setEditName(
                      selectedUser.name,
                    );
                    setEditEmail(
                      selectedUser.email,
                    );
                    setEditPhone(
                      selectedUser.phone,
                    );
                    setIsEditingBuyer(true);
                  }}
                  className="flex-1 min-w-[140px]"
                >
                  Edit Buyer
                </GoldButton>
              )}

              {/* Suspend or reactivate the real Buyer account. */}
              {!isEditingBuyer && (
                <GhostButton
                  onClick={() => {
                    void handleStatusChange();
                  }}
                  disabled={isUpdatingStatus}
                  className={`flex-1 min-w-[140px] ${
                    selectedUser.isActive
                      ? 'border-rose-500/20 text-rose-400 hover:bg-rose-500/10'
                      : 'border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10'
                  }`}
                >
                  {isUpdatingStatus ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : selectedUser.isActive ? (
                    <XCircle className="h-4 w-4" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}

                  {selectedUser.isActive
                    ? 'Suspend Buyer'
                    : 'Reactivate Buyer'}
                </GhostButton>
              )}

              {/* Show Save and Cancel while editing. */}
              {isEditingBuyer && (
                <>
                  <GoldButton
                    onClick={() => {
                      void handleSaveBuyer();
                    }}
                    disabled={isSavingBuyer}
                    className="flex-1 min-w-[140px]"
                  >
                    {isSavingBuyer ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}

                    Save Changes
                  </GoldButton>

                  <GhostButton
                    onClick={() => {
                      setEditName(
                        selectedUser.name,
                      );
                      setEditEmail(
                        selectedUser.email,
                      );
                      setEditPhone(
                        selectedUser.phone,
                      );
                      setIsEditingBuyer(false);
                    }}
                    disabled={isSavingBuyer}
                    className="flex-1 min-w-[140px]"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </GhostButton>
                </>
              )}
            </div>
          ) : null
        }
      >
        {selectedUser && (
          <div className="space-y-6">
            {isEditingBuyer ? (
              <>
                {/* Editable Buyer name. */}
                <div>
                  <label
                    htmlFor="buyer-name"
                    className="text-xs text-ink/60 uppercase tracking-wider mb-1 block"
                  >
                    Full Name
                  </label>

                  <input
                    id="buyer-name"
                    value={editName}
                    onChange={(event) =>
                      setEditName(
                        event.target.value,
                      )
                    }
                    className="w-full rounded-xl border border-white/10 bg-navy-800 px-4 py-3 text-sm text-cream outline-none focus:border-gold-400/50"
                  />
                </div>

                {/* Editable Buyer email. */}
                <div>
                  <label
                    htmlFor="buyer-email"
                    className="text-xs text-ink/60 uppercase tracking-wider mb-1 block"
                  >
                    Email
                  </label>

                  <input
                    id="buyer-email"
                    type="email"
                    value={editEmail}
                    onChange={(event) =>
                      setEditEmail(
                        event.target.value,
                      )
                    }
                    className="w-full rounded-xl border border-white/10 bg-navy-800 px-4 py-3 text-sm text-cream outline-none focus:border-gold-400/50"
                  />
                </div>

                {/* Editable Buyer phone. */}
                <div>
                  <label
                    htmlFor="buyer-phone"
                    className="text-xs text-ink/60 uppercase tracking-wider mb-1 block"
                  >
                    Phone
                  </label>

                  <input
                    id="buyer-phone"
                    value={editPhone}
                    onChange={(event) =>
                      setEditPhone(
                        event.target.value,
                      )
                    }
                    className="w-full rounded-xl border border-white/10 bg-navy-800 px-4 py-3 text-sm text-cream outline-none focus:border-gold-400/50"
                    placeholder="Optional phone number"
                  />
                </div>

                {/* Keep account status visible while editing. */}
                <div>
                  <div className="text-xs text-ink/60 uppercase tracking-wider mb-1">
                    Account Status
                  </div>

                  <EnterpriseStatusBadge
                    status={selectedUser.status}
                  />
                </div>

                {/* Verification remains separate and read-only here. */}
                <div>
                  <div className="text-xs text-ink/60 uppercase tracking-wider mb-1">
                    Verification
                  </div>

                  <EnterpriseStatusBadge
                    status={
                      selectedUser.verificationStatus
                    }
                  />
                </div>
              </>
            ) : (
              <>
                {/* Account status. */}
                <div>
                  <div className="text-xs text-ink/60 uppercase tracking-wider mb-1">
                    Account Status
                  </div>

                  <EnterpriseStatusBadge
                    status={selectedUser.status}
                  />
                </div>

                {/* Verification status. */}
                <div>
                  <div className="text-xs text-ink/60 uppercase tracking-wider mb-1">
                    Verification
                  </div>

                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-blue-400" />

                    <EnterpriseStatusBadge
                      status={
                        selectedUser.verificationStatus
                      }
                    />
                  </div>
                </div>

                {/* Buyer name. */}
                <div>
                  <div className="text-xs text-ink/60 uppercase tracking-wider mb-1">
                    Full Name
                  </div>

                  <div className="text-sm font-semibold text-cream">
                    {selectedUser.name}
                  </div>
                </div>

                {/* Buyer email. */}
                <div>
                  <div className="text-xs text-ink/60 uppercase tracking-wider mb-1">
                    Email
                  </div>

                  <div className="text-sm font-semibold text-cream">
                    {selectedUser.email}
                  </div>
                </div>

                {/* Buyer phone. */}
                <div>
                  <div className="text-xs text-ink/60 uppercase tracking-wider mb-1">
                    Phone
                  </div>

                  <div className="text-sm font-semibold text-cream">
                    {selectedUser.phone || 'Not provided'}
                  </div>
                </div>

                {/* Real saved-property count. */}
                <div>
                  <div className="text-xs text-ink/60 uppercase tracking-wider mb-1">
                    Saved Properties
                  </div>

                  <div className="text-sm font-semibold text-gold-400">
                    {selectedUser.saved}
                  </div>
                </div>

                {/* Real viewing-request count. */}
                <div>
                  <div className="text-xs text-ink/60 uppercase tracking-wider mb-1">
                    Viewing Requests
                  </div>

                  <div className="text-sm font-semibold text-gold-400">
                    {selectedUser.bookings}
                  </div>
                </div>

                {/* Real last-activity timestamp. */}
                <div>
                  <div className="text-xs text-ink/60 uppercase tracking-wider mb-1">
                    Last Active
                  </div>

                  <div className="text-sm font-semibold text-cream">
                    {selectedUser.lastActive}
                  </div>
                </div>

                {/* Real registration date. */}
                <div>
                  <div className="text-xs text-ink/60 uppercase tracking-wider mb-1">
                    Joined Date
                  </div>

                  <div className="text-sm font-semibold text-cream">
                    {selectedUser.joined}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </EnterpriseDetailDrawer>
    </div>
  );
}
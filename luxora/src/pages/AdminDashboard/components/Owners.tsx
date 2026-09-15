import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  MoreHorizontal,
  SearchX,
  Users,
  CheckCircle,
  Clock,
  UserPlus,
  Loader2,
} from 'lucide-react';

import { ActivityTimeline } from '../../../components/dashboard/shared/timelines/ActivityTimeline';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';

import { adminApi } from '../../../api/admin.api';

import type { AdminOwner } from '../../../types/admin';

/*
 * Extend the existing AdminOwner type with the Owner's
 * separate verification state and original creation date.
 */
type AdminOwnerRow = AdminOwner & {
  verificationStatus: 'Verified' | 'Pending';
  createdAt: string | null;
};

/*
 * Convert the real backend Owner response into the
 * structure required by the Admin Owner page.
 */
const mapUserToAdminOwner = (
  apiUser: any
): AdminOwnerRow => ({
  /*
   * Keep the MongoDB ID internally for row identity
   * and future actions.
   *
   * It is intentionally NOT displayed in the table.
   */
  id: String(apiUser._id),

  /*
   * Use the real Owner identity information returned
   * by the backend.
   */
  name: apiUser.fullName || 'Unnamed Owner',
  email: apiUser.email || 'No email',

  /*
   * The current Owner endpoint does not return
   * the Owner's property count.
   *
   * Do not invent a number.
   */
  properties: 0,

  /*
   * Keep the original backend date internally.
   */
  createdAt: apiUser.createdAt
    ? String(apiUser.createdAt)
    : null,

  /*
   * Use the real account creation date for display.
   */
  joined: apiUser.createdAt
    ? new Date(
        apiUser.createdAt
      ).toLocaleDateString()
    : 'N/A',

  /*
   * IMPORTANT:
   * isActive controls ACCOUNT STATUS.
   *
   * This must not be replaced with isVerified.
   */
  status: apiUser.isActive
    ? 'Active'
    : 'Suspended',

  /*
   * isVerified controls VERIFICATION separately.
   */
  verificationStatus: apiUser.isVerified
    ? 'Verified'
    : 'Pending',
});

export default function Owners() {
  /*
   * Search text used by the Owner table.
   */
  const [searchQuery, setSearchQuery] =
    useState('');

  /*
   * Owner selected for the detail drawer.
   */
  const [selectedUser, setSelectedUser] =
    useState<AdminOwnerRow | null>(null);

  /*
   * Real Owners loaded from the backend.
   */
  const [owners, setOwners] =
    useState<AdminOwnerRow[]>([]);

  /*
   * Track the real loading state for the Owner request.
   */
  const [isLoadingOwners, setIsLoadingOwners] =
    useState(true);

  /*
   * Fetch the real Owner records from the Admin API.
   */
  const fetchOwners = useCallback(async () => {
    try {
      setIsLoadingOwners(true);

      const response =
        await adminApi.getOwners();

      /*
       * The current API client returns the Owner
       * collection through the owners property.
       */
      const ownerResponse =
        response as unknown as {
          owners?: any[];
        };

      /*
       * Safely handle an empty response.
       */
      const ownerRecords =
        ownerResponse.owners ?? [];

      /*
       * Convert backend records into the AdminOwner
       * structure used by this page.
       */
      setOwners(
        ownerRecords.map(
          mapUserToAdminOwner
        )
      );
    } catch (error) {
      console.error(
        'Failed to load owners:',
        error
      );

      /*
       * Keep the table stable if the request fails.
       */
      setOwners([]);
    } finally {
      /*
       * Always end the loading state.
       */
      setIsLoadingOwners(false);
    }
  }, []);

  /*
   * Load Owners when the page opens.
   */
  useEffect(() => {
    void fetchOwners();
  }, [fetchOwners]);

  /*
   * Count Owners registered during the last 30 days
   * using the original backend creation timestamp.
   */
  const newRegistrations = useMemo(() => {
    const thirtyDaysAgo =
      Date.now() -
      30 * 24 * 60 * 60 * 1000;

    return owners.filter((owner) => {
      if (!owner.createdAt) {
        return false;
      }

      const joinedTime =
        new Date(
          owner.createdAt
        ).getTime();

      return (
        !Number.isNaN(joinedTime) &&
        joinedTime >= thirtyDaysAgo
      );
    }).length;
  }, [owners]);

  /*
   * Count verified Owners using the
   * separate verification state.
   */
  const verifiedOwners = useMemo(
    () =>
      owners.filter(
        (owner) =>
          owner.verificationStatus ===
          'Verified'
      ).length,
    [owners]
  );

  /*
   * Count Owners awaiting verification.
   */
  const pendingOwners = useMemo(
    () =>
      owners.filter(
        (owner) =>
          owner.verificationStatus ===
          'Pending'
      ).length,
    [owners]
  );

  /*
   * Filter real Owners by name or email.
   */
  const filteredOwners = useMemo(() => {
    const query =
      searchQuery
        .toLowerCase()
        .trim();

    if (!query) {
      return owners;
    }

    return owners.filter(
      (owner) =>
        owner.name
          .toLowerCase()
          .includes(query) ||
        owner.email
          .toLowerCase()
          .includes(query)
    );
  }, [
    owners,
    searchQuery,
  ]);

  return (
    <div className="space-y-6">
      {/* Page heading. */}
      <DashboardHeader
        name="Owner Management"
        subtitle="Manage and monitor property owners on the platform."
      />

      {/* Real Owner KPI statistics. */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Owners"
          value={
            isLoadingOwners
              ? '—'
              : owners.length.toLocaleString()
          }
          icon={Users}
          trend={
            isLoadingOwners
              ? 'Loading owners...'
              : 'Registered owners'
          }
          trendColor="text-emerald-400"
          iconColor="text-purple-400"
        />

        <KPICard
          title="New Registrations"
          value={
            isLoadingOwners
              ? '—'
              : newRegistrations.toLocaleString()
          }
          icon={UserPlus}
          trend="Last 30 days"
          trendColor="text-emerald-400"
          iconColor="text-emerald-400"
        />

        <KPICard
          title="Verified Owners"
          value={
            isLoadingOwners
              ? '—'
              : verifiedOwners.toLocaleString()
          }
          icon={CheckCircle}
          trend="Verification status"
          trendColor="text-emerald-400"
          iconColor="text-blue-400"
        />

        <KPICard
          title="Pending Verification"
          value={
            isLoadingOwners
              ? '—'
              : pendingOwners.toLocaleString()
          }
          icon={Clock}
          trend={
            isLoadingOwners
              ? 'Loading...'
              : pendingOwners > 0
              ? 'Action required'
              : 'All owners verified'
          }
          trendColor="text-yellow-400"
          iconColor="text-yellow-400"
          backgroundColor="bg-yellow-400/10"
        />
      </div>

      {/* Main Owner management section. */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Owner table section. */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search real Owner records by name or email. */}
          <DataTableToolbar
            searchValue={searchQuery}
            onSearchChange={
              setSearchQuery
            }
            searchPlaceholder="Search owners..."
          />

          <DataTable
            data={filteredOwners}

            /*
             * Keep the real ID as the internal row key.
             *
             * The raw MongoDB ID is intentionally hidden
             * from the Admin interface.
             */
            keyExtractor={(owner) =>
              owner.id
            }

            columns={[
              {
                /*
                 * Show useful Owner identity information
                 * instead of exposing the raw database ID.
                 */
                header: 'Owner',
                render: (owner) => (
                  <div>
                    <div className="font-semibold text-cream">
                      {owner.name}
                    </div>

                    <div className="text-xs text-ink/50">
                      {owner.email}
                    </div>
                  </div>
                ),
              },

              {
                /*
                 * Keep the current property count field.
                 *
                 * It remains 0 because the current backend
                 * Owner endpoint does not provide this value.
                 */
                header: 'Properties',
                render: (owner) => (
                  <span className="font-semibold text-gold-400">
                    {owner.properties}
                  </span>
                ),
              },

              {
                header: 'Joined Date',
                render: (owner) => (
                  <span className="text-ink/60">
                    {owner.joined}
                  </span>
                ),
              },

              {
                /*
                 * Account STATUS comes from isActive.
                 */
                header: 'Status',
                render: (owner) => (
                  <div className="w-fit">
                    <EnterpriseStatusBadge
                      status={owner.status}
                    />
                  </div>
                ),
              },

              {
                /*
                 * Verification is deliberately separate
                 * from the operational account status.
                 */
                header: 'Verification',
                render: (owner) => (
                  <div className="w-fit">
                    <EnterpriseStatusBadge
                      status={
                        owner.verificationStatus
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
                className:
                  'text-right',
                render: (owner) => (
                  <button
                    type="button"
                    className="rounded-lg p-2 text-ink/40 hover:bg-white/10 hover:text-cream transition-colors"
                    onClick={() =>
                      setSelectedUser(
                        owner
                      )
                    }
                    title="View owner details"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                ),
              },
            ]}

            /*
             * Display a loading state while the
             * backend Owner request is running.
             */
            emptyState={
              <div className="flex flex-col items-center justify-center py-12 text-center">
                {isLoadingOwners ? (
                  <>
                    <Loader2 className="h-12 w-12 text-gold-400/60 mb-4 animate-spin" />

                    <h3 className="text-lg font-bold text-cream">
                      Loading owners
                    </h3>

                    <p className="text-sm text-ink/50 mt-1">
                      Fetching Owner accounts from the backend.
                    </p>
                  </>
                ) : (
                  <>
                    <SearchX className="h-12 w-12 text-ink/20 mb-4" />

                    <h3 className="text-lg font-bold text-cream">
                      No owners found
                    </h3>

                    <p className="text-sm text-ink/50 mt-1">
                      Try adjusting your search.
                    </p>
                  </>
                )}
              </div>
            }
          />
        </div>

        {/* Owner activity section. */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          {/*
           * There is currently no real Owner activity endpoint.
           *
           * Keep the section present without displaying
           * fabricated activity data.
           */}
          <ActivityTimeline
            title="Recently Active Owners"
            items={[]}
          />
        </div>
      </div>

      {/* Owner details drawer. */}
      <EnterpriseDetailDrawer
        isOpen={
          !!selectedUser
        }
        onClose={() =>
          setSelectedUser(null)
        }
        title="Owner Details"
        subtitle={
          selectedUser?.name
        }
        footerActions={
          <button
            type="button"
            className="w-full rounded-xl bg-gold-400 py-3 text-sm font-bold text-navy-900 transition-colors hover:bg-gold-300"
          >
            Edit Owner
          </button>
        }
      >
        {selectedUser && (
          <div className="space-y-6">
            {/* Account status. */}
            <div>
              <div className="text-xs text-ink/60 uppercase tracking-wider mb-1">
                Account Status
              </div>

              <EnterpriseStatusBadge
                status={
                  selectedUser.status
                }
              />
            </div>

            {/* Verification status. */}
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

            {/* Owner name. */}
            <div>
              <div className="text-xs text-ink/60 uppercase tracking-wider mb-1">
                Full Name
              </div>

              <div className="text-sm font-semibold text-cream">
                {selectedUser.name}
              </div>
            </div>

            {/* Owner email. */}
            <div>
              <div className="text-xs text-ink/60 uppercase tracking-wider mb-1">
                Email
              </div>

              <div className="text-sm font-semibold text-cream">
                {selectedUser.email}
              </div>
            </div>

            {/* Current property count. */}
            <div>
              <div className="text-xs text-ink/60 uppercase tracking-wider mb-1">
                Total Properties
              </div>

              <div className="text-sm font-semibold text-gold-400">
                {selectedUser.properties}
              </div>
            </div>

            {/* Owner registration date. */}
            <div>
              <div className="text-xs text-ink/60 uppercase tracking-wider mb-1">
                Joined Date
              </div>

              <div className="text-sm font-semibold text-cream">
                {selectedUser.joined}
              </div>
            </div>
          </div>
        )}
      </EnterpriseDetailDrawer>
    </div>
  );
}
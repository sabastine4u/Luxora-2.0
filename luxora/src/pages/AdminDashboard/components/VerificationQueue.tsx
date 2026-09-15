import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle,
  Clock,
  ShieldAlert,
} from 'lucide-react';

import { SegmentedProgressBar } from '../../../components/dashboard/shared/widgets/SegmentedProgressBar';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal';
import { RejectionReasonModal } from './RejectionReasonModal';
import { VerificationDetailModal } from './VerificationDetailModal';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { VerificationTable } from '../../../components/dashboard/shared/tables/VerificationTable';

import { adminApi } from '../../../api/admin.api';
import type { AdminVerification } from '../../../types/admin';

type VerificationStatus =
  | 'Pending'
  | 'Verified'
  | 'Rejected'
  | 'Revoked';

type VerificationTab =
  | 'Overview'
  | 'Pending'
  | 'Verified'
  | 'Rejected'
  | 'Revoked';

interface ApiAgent {
  _id: string;
  fullName: string;
  email?: string;
  phone?: string;
  licenseNumber?: string;
  backgroundCheckStatus?: string;
  status?: string;
  createdAt?: string;

  agency?: {
    _id?: string;
    name?: string;
  } | null;
}

interface ApiVerification {
  _id: string;
  status?: string;
  verificationLevel?: string;
  reviewNotes?: string | null;
  rejectionReason?: string | null;

  reviewedBy?: {
    _id?: string;
    fullName?: string;
    email?: string;
  } | null;

  reviewedAt?: string | null;
  verifiedAt?: string | null;
  expiresAt?: string | null;
  createdAt?: string;

  documents?: unknown[];
  history?: unknown[];

  agent?: ApiAgent | null;

  user?: {
    _id?: string;
    fullName?: string;
    email?: string;
    isVerified?: boolean;
    verifiedAt?: string | null;
  } | null;

  agency?: {
    _id?: string;
    name?: string;
    status?: string;
  } | null;
}

interface VerificationSummary {
  pending: number;
  verified: number;
  rejected: number;
  revoked: number;
}

type VerificationTableItem = AdminVerification &
  Record<string, unknown>;

export default function VerificationQueue() {
  const [searchQuery, setSearchQuery] =
    useState('');

  // Track which Verification Center section is currently active.
  const [activeTab, setActiveTab] =
    useState<VerificationTab>('Overview');

  const [previewItem, setPreviewItem] =
    useState<VerificationTableItem | null>(null);

  const [approvalModalOpen, setApprovalModalOpen] =
    useState(false);

  const [rejectionModalOpen, setRejectionModalOpen] =
    useState(false);

  const [selectedRows, setSelectedRows] =
    useState<Set<string>>(new Set());

  const [actionTarget, setActionTarget] =
    useState<string | null>(null);

  const [reviewNotes, setReviewNotes] =
    useState('');

  const [agents, setAgents] =
    useState<ApiAgent[]>([]);

  const [verifications, setVerifications] =
    useState<ApiVerification[]>([]);

  // Store the aggregate Verification Center totals returned by the backend.
  const [verificationSummary, setVerificationSummary] =
    useState<VerificationSummary>({
      pending: 0,
      verified: 0,
      rejected: 0,
      revoked: 0,
    });

  const [isLoading, setIsLoading] =
    useState(true);

  const [isActionLoading, setIsActionLoading] =
    useState(false);

  // Convert a URL/status value into a valid Verification status.
  const normalizeStatus = (
    status: VerificationStatus
  ) => status;

  // Load real Agents and Verification records for the selected status.
  const loadVerificationData = async (
    status: VerificationStatus = 'Pending'
  ) => {
    try {
      setIsLoading(true);

      const [
        agentsResponse,
        verificationResponse,
        summaryResponse,
      ] = await Promise.all([
        adminApi.getAgents(),
        adminApi.getVerificationQueue(status),
        adminApi.getVerificationCenterSummary(),
      ]);

      const agentsData =
        agentsResponse as unknown as {
          agents?: ApiAgent[];
        };

      const verificationData =
        verificationResponse as unknown as {
          verifications?: ApiVerification[];
        };

      const summaryData =
        summaryResponse as unknown as {
          summary?: VerificationSummary;
        };

      // Store real Agents used by the operational account cards.
      setAgents(
        agentsData.agents || []
      );

      // Store records belonging to the selected Verification status.
      setVerifications(
        verificationData.verifications || []
      );

      // Keep all Verification Center counters synchronized with the backend.
      setVerificationSummary(
        summaryData.summary || {
          pending: 0,
          verified: 0,
          rejected: 0,
          revoked: 0,
        }
      );
    } catch (error) {
      console.error(
        'Failed to load Verification Center data:',
        error
      );

      // Clear displayed records when the backend request fails.
      setVerifications([]);

      setVerificationSummary({
        pending: 0,
        verified: 0,
        rejected: 0,
        revoked: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load the pending queue when the page first opens.
  useEffect(() => {
    loadVerificationData('Pending');
  }, []);

  // Load the selected Verification Center tab.
  useEffect(() => {
    if (activeTab === 'Overview') {
      // Overview uses the pending queue as its operational table.
      loadVerificationData('Pending');

      return;
    }

    // The remaining tabs load their matching backend status.
    loadVerificationData(
      normalizeStatus(
        activeTab
      )
    );
  }, [activeTab]);

  // Convert real backend Verification records into the existing table structure.
  const verificationTableData =
    useMemo<VerificationTableItem[]>(
      () =>
        verifications
          .filter(
            (verification) =>
              !!verification.agent
          )
          .map((verification) => ({
            id:
              verification.agent!._id,

            type:
              'Agent Verification',

            title:
              verification.agent
                ?.fullName ||
              verification.user
                ?.fullName ||
              'Unknown Agent',

            submitter:
              verification.agency
                ?.name ||
              verification.agent
                ?.agency?.name ||
              'No Agency Assigned',

            date:
              verification.createdAt
                ? new Date(
                    verification.createdAt
                  ).toLocaleDateString()
                : 'N/A',

            status:
              verification.status ||
              'Pending',

            // Preserve the real Verification record for the detail modal.
            verificationId:
              verification._id,

            agentName:
              verification.agent
                ?.fullName,

            fullName:
              verification.agent
                ?.fullName,

            email:
              verification.agent?.email,

            phone:
              verification.agent?.phone,

            licenseNumber:
              verification.agent
                ?.licenseNumber,

            backgroundCheckStatus:
              verification.agent
                ?.backgroundCheckStatus,

            agencyName:
              verification.agency
                ?.name ||
              verification.agent
                ?.agency?.name,

            verificationLevel:
              verification.verificationLevel,

            reviewNotes:
              verification.reviewNotes,

            rejectionReason:
              verification.rejectionReason,

            reviewedBy:
              verification.reviewedBy,

            reviewedAt:
              verification.reviewedAt,

            verifiedAt:
              verification.verifiedAt,

            expiresAt:
              verification.expiresAt,

            createdAt:
              verification.createdAt,

            documents:
              verification.documents ||
              [],

            history:
              verification.history ||
              [],
          })),
      [verifications]
    );

  // Search within the records loaded for the active tab.
  const filteredVerificationData =
    useMemo(() => {
      const query =
        searchQuery
          .trim()
          .toLowerCase();

      if (!query) {
        return verificationTableData;
      }

      return verificationTableData.filter(
        (item) =>
          item.title
            .toLowerCase()
            .includes(query) ||
          item.submitter
            .toLowerCase()
            .includes(query) ||
          item.status
            .toLowerCase()
            .includes(query)
      );
    }, [
      verificationTableData,
      searchQuery,
    ]);

  // Use real Agent account totals.
  const totalAgents =
    agents.length;

  const activeAgents =
    agents.filter(
      (agent) =>
        agent.status === 'Active'
    ).length;

  const suspendedAgents =
    agents.filter(
      (agent) =>
        agent.status === 'Suspended'
    ).length;

  // Use the backend Verification summary as the source of truth.
  const pendingCount =
    verificationSummary.pending;

  const verifiedCount =
    verificationSummary.verified;

  const rejectedCount =
    verificationSummary.rejected;

  const revokedCount =
    verificationSummary.revoked;

  // Calculate the real Verification status percentages.
  const summaryTotal =
    pendingCount +
      verifiedCount +
      rejectedCount +
      revokedCount;

  const verifiedPercentage =
    summaryTotal > 0
      ? Math.round(
          (verifiedCount /
            summaryTotal) *
            100
        )
      : 0;

  const pendingPercentage =
    summaryTotal > 0
      ? Math.round(
          (pendingCount /
            summaryTotal) *
            100
        )
      : 0;

  const rejectedPercentage =
    summaryTotal > 0
      ? Math.round(
          (rejectedCount /
            summaryTotal) *
            100
        )
      : 0;

  const revokedPercentage =
    summaryTotal > 0
      ? Math.round(
          (revokedCount /
            summaryTotal) *
            100
        )
      : 0;

  // Open the complete Verification record from the backend.
  const handleReview = async (
    item: AdminVerification
  ) => {
    try {
      const response =
        await adminApi.getAgentVerification(
          item.id
        );

      const data =
        response as unknown as {
          verification?: ApiVerification;
        };

      const verification =
        data.verification;

      // Fall back to the current table item when details are unavailable.
      if (!verification) {
        setPreviewItem(
          item as VerificationTableItem
        );

        return;
      }

      // Merge the complete backend record into the existing table shape.
      const detail: VerificationTableItem =
        {
          ...item,

          id:
            verification.agent?._id ||
            item.id,

          title:
            verification.agent?.fullName ||
            verification.user?.fullName ||
            item.title,

          submitter:
            verification.agency?.name ||
            verification.agent?.agency?.name ||
            item.submitter,

          status:
            verification.status ||
            item.status,

          date:
            verification.createdAt
              ? new Date(
                  verification.createdAt
                ).toLocaleDateString()
              : item.date,

          verificationId:
            verification._id,

          agentName:
            verification.agent?.fullName,

          fullName:
            verification.agent?.fullName,

          email:
            verification.agent?.email,

          phone:
            verification.agent?.phone,

          licenseNumber:
            verification.agent?.licenseNumber,

          backgroundCheckStatus:
            verification.agent
              ?.backgroundCheckStatus,

          agencyName:
            verification.agency?.name ||
            verification.agent?.agency?.name,

          verificationLevel:
            verification.verificationLevel,

          reviewNotes:
            verification.reviewNotes,

          rejectionReason:
            verification.rejectionReason,

          reviewedBy:
            verification.reviewedBy,

          reviewedAt:
            verification.reviewedAt,

          verifiedAt:
            verification.verifiedAt,

          expiresAt:
            verification.expiresAt,

          createdAt:
            verification.createdAt,

          documents:
            verification.documents ||
            [],

          history:
            verification.history ||
            [],
        };

      setPreviewItem(detail);
    } catch (error) {
      console.error(
        'Failed to load verification details:',
        error
      );

      // Keep the selected table row available if the details request fails.
      setPreviewItem(
        item as VerificationTableItem
      );
    }
  };

  // Prepare an approval action from the table or detail modal.
  const handleApprove = (
    item?: AdminVerification,
    notes = ''
  ) => {
    const target =
      item?.id ||
      previewItem?.id ||
      null;

    setActionTarget(target);

    setReviewNotes(
      notes.trim()
    );

    setApprovalModalOpen(true);
  };

  // Prepare a rejection action from the table or detail modal.
  const handleReject = (
    item?: AdminVerification,
    notes = ''
  ) => {
    const target =
      item?.id ||
      previewItem?.id ||
      null;

    setActionTarget(target);

    setReviewNotes(
      notes.trim()
    );

    setRejectionModalOpen(true);
  };

  // Remove a processed record from the current selection.
  const removeSelectedRow = (
    agentId: string
  ) => {
    setSelectedRows(
      (current) => {
        const updated =
          new Set(current);

        updated.delete(agentId);

        return updated;
      }
    );
  };

  // Approve the selected Agent Verification.
  const confirmApproval =
    async () => {
      if (!actionTarget) {
        return;
      }

      try {
        setIsActionLoading(true);

        // Persist the approval and reviewer notes through the real API.
        await adminApi.reviewAgentVerification(
          actionTarget,
          'Approved',
          reviewNotes
        );

        // Refresh the current Center tab and aggregate counters.
        await loadVerificationData(
          activeTab === 'Overview'
            ? 'Pending'
            : normalizeStatus(
                activeTab
              )
        );

        removeSelectedRow(
          actionTarget
        );

        setApprovalModalOpen(
          false
        );

        setPreviewItem(null);

        setActionTarget(null);

        setReviewNotes('');
      } catch (error) {
        console.error(
          'Failed to approve Agent verification:',
          error
        );
      } finally {
        setIsActionLoading(false);
      }
    };

  // Reject the selected Agent Verification.
  const confirmRejection =
    async (
      reason: string
    ) => {
      if (!actionTarget) {
        return;
      }

      // Combine reviewer notes and the required rejection reason.
      const finalReviewNotes =
        [
          reviewNotes.trim(),
          reason.trim(),
        ]
          .filter(Boolean)
          .join('\n\n');

      try {
        setIsActionLoading(true);

        // Persist the rejection and complete reason through the real API.
        await adminApi.reviewAgentVerification(
          actionTarget,
          'Rejected',
          finalReviewNotes
        );

        // Refresh the current Center tab and aggregate counters.
        await loadVerificationData(
          activeTab === 'Overview'
            ? 'Pending'
            : normalizeStatus(
                activeTab
              )
        );

        removeSelectedRow(
          actionTarget
        );

        setRejectionModalOpen(
          false
        );

        setPreviewItem(null);

        setActionTarget(null);

        setReviewNotes('');
      } catch (error) {
        console.error(
          'Failed to reject Agent verification:',
          error
        );
      } finally {
        setIsActionLoading(false);
      }
    };

  // Toggle one selected table row.
  const handleToggleSelection = (
    id: string
  ) => {
    const updated =
      new Set(selectedRows);

    if (updated.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
    }

    setSelectedRows(updated);
  };

  // Select or deselect all rows currently displayed.
  const handleToggleAll = () => {
    if (
      filteredVerificationData.length >
        0 &&
      selectedRows.size ===
        filteredVerificationData.length
    ) {
      setSelectedRows(
        new Set()
      );

      return;
    }

    setSelectedRows(
      new Set(
        filteredVerificationData.map(
          (item) => item.id
        )
      )
    );
  };

  // Change the active Verification Center section.
  const handleTabChange = (
    tab: VerificationTab
  ) => {
    setSearchQuery('');
    setSelectedRows(new Set());
    setActiveTab(tab);
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        name="Verification Center"
        subtitle="Review and manage Agent verification requests, credentials, and verification history."
      />

      {/* Verification Center navigation. */}
      <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-2">
        <div className="flex flex-wrap gap-2">
          {(
            [
              'Overview',
              'Pending',
              'Verified',
              'Rejected',
              'Revoked',
            ] as VerificationTab[]
          ).map((tab) => {
            const count =
              tab === 'Pending'
                ? pendingCount
                : tab === 'Verified'
                  ? verifiedCount
                  : tab === 'Rejected'
                    ? rejectedCount
                    : tab === 'Revoked'
                      ? revokedCount
                      : null;

            const isActive =
              activeTab === tab;

            return (
              <button
                key={tab}
                type="button"
                onClick={() =>
                  handleTabChange(tab)
                }
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-gold-400/10 text-gold-400 border border-gold-400/20'
                    : 'text-ink/60 hover:text-cream hover:bg-white/5 border border-transparent'
                }`}
              >
                <span>{tab}</span>

                {count !== null && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      isActive
                        ? 'bg-gold-400/10 text-gold-400'
                        : 'bg-white/5 text-ink/50'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Overview keeps the dashboard statistics visible. */}
      {activeTab === 'Overview' && (
        <>
          {/* Real Verification Center totals. */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <KPICard
              title="Pending Review"
              value={
                pendingCount.toString()
              }
              icon={Clock}
              trend="Action Required"
              trendColor="text-yellow-400"
              iconColor="text-yellow-400"
              backgroundColor="bg-yellow-400/10"
            />

            <KPICard
              title="Verified Agents"
              value={
                verifiedCount.toString()
              }
              icon={CheckCircle}
              trend="Verified Status"
              trendColor="text-emerald-400"
              iconColor="text-emerald-400"
              backgroundColor="bg-emerald-400/10"
            />

            <KPICard
              title="Rejected"
              value={
                rejectedCount.toString()
              }
              icon={ShieldAlert}
              trend="Verification Result"
              trendColor="text-rose-400"
              iconColor="text-rose-400"
              backgroundColor="bg-rose-400/10"
            />

            <KPICard
              title="Revoked"
              value={
                revokedCount.toString()
              }
              icon={ShieldAlert}
              trend="Verification Result"
              trendColor="text-orange-400"
              iconColor="text-orange-400"
              backgroundColor="bg-orange-400/10"
            />
          </div>

          <DataTableToolbar
            searchValue={
              searchQuery
            }
            onSearchChange={
              setSearchQuery
            }
            searchPlaceholder="Search pending verification..."
            showFilter
          />

          {/* Real Verification status distribution. */}
          <div className="grid gap-6 lg:grid-cols-2 mb-6">
            <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col justify-center space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-emerald-400" />

                <h3 className="font-heading text-lg font-bold text-cream">
                  Verification Status
                </h3>
              </div>

              <SegmentedProgressBar
                segments={[
                  {
                    label: 'Verified',
                    value:
                      verifiedPercentage,
                    color:
                      'bg-emerald-400',
                  },
                  {
                    label: 'Pending',
                    value:
                      pendingPercentage,
                    color:
                      'bg-yellow-400',
                  },
                  {
                    label: 'Rejected',
                    value:
                      rejectedPercentage,
                    color:
                      'bg-rose-400',
                  },
                  {
                    label: 'Revoked',
                    value:
                      revokedPercentage,
                    color:
                      'bg-orange-400',
                  },
                ]}
              />
            </div>

            <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col justify-center space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <ShieldAlert className="h-5 w-5 text-blue-400" />

                <h3 className="font-heading text-lg font-bold text-cream">
                  Agent Account Status
                </h3>
              </div>

              <div className="grid gap-3">
                <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3">
                  <span className="text-sm text-ink/60">
                    Total Agents
                  </span>

                  <span className="font-bold text-cream">
                    {totalAgents}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3">
                  <span className="text-sm text-ink/60">
                    Active
                  </span>

                  <span className="font-bold text-emerald-400">
                    {activeAgents}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3">
                  <span className="text-sm text-ink/60">
                    Suspended
                  </span>

                  <span className="font-bold text-rose-400">
                    {suspendedAgents}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Search for records in non-Overview status tabs. */}
      {activeTab !== 'Overview' && (
        <DataTableToolbar
          searchValue={
            searchQuery
          }
          onSearchChange={
            setSearchQuery
          }
          searchPlaceholder={`Search ${activeTab.toLowerCase()} verifications...`}
          showFilter
        />
      )}

      {/* Loading state for the selected Verification section. */}
      {isLoading ? (
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-8">
          <div className="space-y-4 animate-pulse">
            <div className="h-5 w-48 rounded bg-white/10" />
            <div className="h-12 w-full rounded bg-white/5" />
            <div className="h-12 w-full rounded bg-white/5" />
            <div className="h-12 w-full rounded bg-white/5" />
          </div>
        </div>
      ) : filteredVerificationData.length > 0 ? (
        <VerificationTable
          data={
            filteredVerificationData
          }
          mode="operational"
          selectedRows={
            selectedRows
          }
          onToggleSelection={
            handleToggleSelection
          }
          onToggleAll={
            handleToggleAll
          }
          onReview={
            handleReview
          }
          onApprove={(item) =>
            handleApprove(item)
          }
          onReject={(item) =>
            handleReject(item)
          }
        />
      ) : (
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-10 text-center">
          <CheckCircle className="h-10 w-10 text-ink/20 mx-auto mb-3" />

          <h3 className="text-lg font-semibold text-cream">
            No {activeTab.toLowerCase()} verification records
          </h3>

          <p className="text-sm text-ink/50 mt-2">
            There are currently no verification records in this section.
          </p>
        </div>
      )}

      {/* Open the complete real Verification record. */}
      <VerificationDetailModal
        isOpen={
          !!previewItem
        }
        onClose={() => {
          setPreviewItem(
            null
          );

          setReviewNotes(
            ''
          );
        }}
        item={
          previewItem
        }
        onApprove={(notes) =>
          handleApprove(
            previewItem ||
              undefined,
            notes
          )
        }
        onReject={(notes) =>
          handleReject(
            previewItem ||
              undefined,
            notes
          )
        }
      />

      {/* Confirm the real approval action. */}
      <ConfirmationModal
        isOpen={
          approvalModalOpen
        }
        onClose={() => {
          if (
            isActionLoading
          ) {
            return;
          }

          setApprovalModalOpen(
            false
          );

          setActionTarget(
            null
          );

          setReviewNotes(
            ''
          );
        }}
        onConfirm={
          confirmApproval
        }
        title="Approve Verification"
        message="Are you sure you want to approve this Agent verification request?"
        confirmText={
          isActionLoading
            ? 'Processing...'
            : 'Approve'
        }
      />

      {/* Collect the rejection reason before the real rejection request. */}
      <RejectionReasonModal
        isOpen={
          rejectionModalOpen
        }
        onClose={() => {
          if (
            isActionLoading
          ) {
            return;
          }

          setRejectionModalOpen(
            false
          );

          setActionTarget(
            null
          );

          setReviewNotes(
            ''
          );
        }}
        onConfirm={(
          reason
        ) =>
          confirmRejection(
            reason
          )
        }
        title="Reject Verification"
      />
    </div>
  );
}
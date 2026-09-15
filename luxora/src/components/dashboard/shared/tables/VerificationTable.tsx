import {
  CheckCircle,
  XCircle,
  Eye,
  ShieldAlert,
} from 'lucide-react';

import {
  GoldButton,
  GhostButton,
} from '../../../ui/ui';

import { DataTable } from './DataTable';
import { EnterpriseStatusBadge } from '../../../enterprise/EnterpriseStatusBadge';
import type { AdminVerification } from '../../../../types/admin';

export interface VerificationTableProps {
  data: AdminVerification[];
  mode?: 'operational' | 'oversight';
  onReview?: (item: AdminVerification) => void;
  onApprove?: (item: AdminVerification) => void;
  onReject?: (item: AdminVerification) => void;
  onOverride?: (item: AdminVerification) => void;
  selectedRows?: Set<string>;
  onToggleSelection?: (id: string) => void;
  onToggleAll?: () => void;
}

export function VerificationTable({
  data,
  mode = 'operational',
  onReview,
  onApprove,
  onReject,
  onOverride,
  selectedRows,
  onToggleSelection,
  onToggleAll,
}: VerificationTableProps) {
  return (
    <DataTable
      data={data}
      keyExtractor={(item) => item.id}
      columns={[
        // Keep row selection available for operational actions.
        ...(onToggleSelection && selectedRows
          ? [
              {
                header: (
                  <input
                    type="checkbox"
                    className="rounded border-white/20 bg-navy-900/50 text-gold-400 focus:ring-gold-400/50"
                    checked={
                      selectedRows.size ===
                        data.length &&
                      data.length > 0
                    }
                    onChange={onToggleAll}
                  />
                ),
                className: 'w-10 text-center',
                render: (
                  item: AdminVerification
                ) => (
                  <input
                    type="checkbox"
                    className="rounded border-white/20 bg-navy-900/50 text-gold-400 focus:ring-gold-400/50"
                    checked={selectedRows.has(
                      item.id
                    )}
                    onChange={() =>
                      onToggleSelection(
                        item.id
                      )
                    }
                  />
                ),
              },
            ]
          : []),

        // Do not expose the MongoDB ID in the visible Verification Center table.
        {
          header: 'Agent',
          render: (
            item: AdminVerification
          ) => (
            <div>
              <div className="font-semibold text-cream">
                {item.title}
              </div>

              <div className="text-xs text-ink/40">
                Agent Verification
              </div>
            </div>
          ),
        },

        // Show the verification category separately from its current state.
        {
          header: 'Type',
          render: () => (
            <span className="text-ink/60">
              Agent Verification
            </span>
          ),
        },

        // Show when the verification record was submitted.
        {
          header: 'Submitted',
          render: (
            item: AdminVerification
          ) => (
            <span className="text-ink/60">
              {item.date}
            </span>
          ),
        },

        // Show the Agency that owns the Agent.
        {
          header: 'Agency',
          render: (
            item: AdminVerification
          ) => (
            <span className="text-ink/60">
              {item.submitter}
            </span>
          ),
        },

        // Show the actual Verification status returned by the backend.
        {
          header: 'Status',
          render: (
            item: AdminVerification
          ) => (
            <div className="w-fit">
              <EnterpriseStatusBadge
                status={item.status}
              />
            </div>
          ),
        },

        // Oversight mode keeps the existing SLA presentation.
        ...(mode === 'oversight'
          ? [
              {
                header: 'SLA Status',
                render: () => (
                  <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase w-fit text-blue-400 bg-blue-400/10 border-blue-400/20">
                    Within SLA
                  </span>
                ),
              },
            ]
          : []),

        // Keep the existing action buttons and callbacks.
        {
          header: (
            <div className="text-right">
              Actions
            </div>
          ),
          className: 'text-right',
          render: (
            item: AdminVerification
          ) => (
            <div className="flex items-center justify-end gap-2">
              {mode === 'operational' && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      onApprove?.(item)
                    }
                    className="rounded-lg p-2 text-ink/40 hover:bg-emerald-400/10 hover:text-emerald-400 transition-colors"
                    title="Approve"
                  >
                    <CheckCircle className="h-5 w-5" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onReject?.(item)
                    }
                    className="rounded-lg p-2 text-ink/40 hover:bg-rose-400/10 hover:text-rose-400 transition-colors"
                    title="Reject"
                  >
                    <XCircle className="h-5 w-5" />
                  </button>
                </>
              )}

              {mode === 'oversight' && (
                <GhostButton
                  size="sm"
                  onClick={() =>
                    onOverride?.(item)
                  }
                  className="text-rose-400 hover:text-rose-300 hover:bg-rose-400/10 flex items-center gap-1"
                >
                  <ShieldAlert className="h-4 w-4" />
                  Override
                </GhostButton>
              )}

              <GoldButton
                size="sm"
                className="ml-2 flex items-center gap-2"
                onClick={() =>
                  onReview?.(item)
                }
              >
                <Eye className="h-4 w-4" />
                Review
              </GoldButton>
            </div>
          ),
        },
      ]}
      emptyState={
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <ShieldAlert className="h-12 w-12 text-ink/20 mb-4" />

          <h3 className="text-lg font-bold text-cream">
            No verification records
          </h3>

          <p className="text-sm text-ink/50 mt-1">
            There are currently no records in this Verification Center section.
          </p>
        </div>
      }
    />
  );
}
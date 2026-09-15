import { useState } from 'react';
import {
  Wallet,
  Briefcase,
  FileText,
  ShieldCheck,
  Banknote,
  AlertCircle,
  RefreshCcw,
  CalendarDays,
  Percent,
} from 'lucide-react';
import { Modal } from '../../../../components/ui/Modal';
import {
  GoldButton,
  GhostButton,
} from '../../../../components/ui/ui';
import { StatusBadge } from '../../../ManagementDashboard/components/shared/StatusBadge';
import { ActivityTimeline } from '../../../../components/dashboard/shared/timelines/ActivityTimeline';

interface CommissionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  commission:
    | Record<string, unknown>
    | null;
}

const formatCurrency = (
  amount: unknown,
) => {
  if (
    typeof amount !== 'number' ||
    Number.isNaN(amount)
  ) {
    return '₦0';
  }

  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (
  value: unknown,
) => {
  if (
    typeof value !== 'string' ||
    !value
  ) {
    return 'Not provided';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Not provided';
  }

  return date.toLocaleDateString(
    'en-NG',
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    },
  );
};

export function CommissionDetailModal({
  isOpen,
  onClose,
  commission,
}: CommissionDetailModalProps) {
  const [
    activeTab,
    setActiveTab,
  ] = useState<
    'overview' | 'history'
  >('overview');

  if (!commission) {
    return null;
  }

  const property =
    (commission.property as
      | Record<string, unknown>
      | null) || null;

  const offer =
    (commission.offer as
      | Record<string, unknown>
      | null) || null;

  const buyer =
    (offer?.buyer as
      | Record<string, unknown>
      | null) || null;

  const agency =
    (commission.agency as
      | Record<string, unknown>
      | null) || null;

  const dealValue =
    typeof commission.dealValue ===
    'number'
      ? commission.dealValue
      : 0;

  const commissionPool =
    typeof commission.commissionPool ===
    'number'
      ? commission.commissionPool
      : 0;

  const agentSharePercent =
    typeof commission.agentSharePercent ===
    'number'
      ? commission.agentSharePercent
      : 0;

  const agencySharePercent =
    typeof commission.agencySharePercent ===
    'number'
      ? commission.agencySharePercent
      : 0;

  const agentAmount =
    typeof commission.agentAmount ===
    'number'
      ? commission.agentAmount
      : 0;

  const agencyAmount =
    typeof commission.agencyAmount ===
    'number'
      ? commission.agencyAmount
      : 0;

  const transactionType =
    String(
      property?.transactionType ||
        'Transaction',
    );

  const propertyTitle =
    String(
      property?.title ||
        'Property unavailable',
    );

  const buyerName =
    String(
      buyer?.fullName ||
        'Buyer unavailable',
    );

  const agencyName =
    String(
      agency?.name ||
        'Agency unavailable',
    );

  const status =
    String(
      commission.status ||
        'Pending',
    );

  const commissionId =
    String(
      commission.commissionId ||
        commission._id ||
        'Commission',
    );

  const paymentTimeline = [
    {
      title: 'Commission Created',
      time: formatDate(
        commission.createdAt,
      ),
      desc:
        'Commission record created from the finalized transaction.',
      icon: Briefcase,
      color: 'text-blue-400',
    },
    {
      title: 'Payment Status',
      time: status,
      desc:
        status === 'Paid'
          ? `Paid on ${formatDate(
              commission.paidAt,
            )}`
          : commission.dueDate
            ? `Due on ${formatDate(
                commission.dueDate,
              )}`
            : 'No payment date has been recorded.',
      icon:
        status === 'Paid'
          ? ShieldCheck
          : RefreshCcw,
      color:
        status === 'Paid'
          ? 'text-emerald-400'
          : 'text-gold-400',
    },
    {
      title: 'Last Updated',
      time: formatDate(
        commission.updatedAt,
      ),
      desc:
        'Latest recorded change to this commission ledger entry.',
      icon: CalendarDays,
      color: 'text-ink/60',
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Commission Details"
      size="xl"
      actionButton={
        <GoldButton>
          Download Statement
        </GoldButton>
      }
    >
      <div className="space-y-8 pb-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-6 items-start border-b border-white/5 pb-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-navy-900 border border-white/10 shrink-0">
            <Wallet className="h-10 w-10 text-emerald-400" />
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-emerald-400">
                {formatCurrency(
                  agentAmount,
                )}
              </h2>

              <div className="text-cream text-lg font-medium mt-1">
                {propertyTitle}
              </div>

              <div className="text-xs text-ink/60 mt-1">
                {commissionId}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <StatusBadge
                status={status}
              />

              <span className="inline-flex items-center rounded-full border border-white/10 bg-navy-800/50 px-2.5 py-0.5 text-xs font-semibold text-ink/70">
                Type:{' '}
                {transactionType}
              </span>

              <span className="inline-flex items-center rounded-full border border-white/10 bg-navy-800/50 px-2.5 py-0.5 text-xs font-semibold text-gold-400">
                Due:{' '}
                {formatDate(
                  commission.dueDate,
                )}
              </span>
            </div>

            <div className="flex gap-4 pt-2">
              <GhostButton className="flex items-center gap-2 px-3 py-1.5 text-sm text-ink/60 hover:text-cream">
                <AlertCircle className="h-4 w-4" />
                Report Issue
              </GhostButton>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex border-b border-white/10">
          {[
            {
              id: 'overview',
              label:
                'Commission Breakdown',
            },
            {
              id: 'history',
              label:
                'Audit Trail & Timeline',
            },
          ].map(
            (tab) => (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(
                    tab.id as
                      | 'overview'
                      | 'history',
                  )
                }
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab ===
                  tab.id
                    ? 'border-gold-400 text-gold-400'
                    : 'border-transparent text-ink/60 hover:text-cream hover:border-white/20'
                }`}
              >
                {
                  tab.label
                }
              </button>
            ),
          )}
        </div>

        {/* Overview */}
        {activeTab ===
          'overview' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                <h3 className="font-heading text-sm font-semibold text-cream mb-4 flex items-center gap-2">
                  <Banknote className="h-4 w-4 text-ink/60" />
                  Commission Breakdown
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-ink/60">
                      Deal Value
                    </span>

                    <span className="text-cream">
                      {formatCurrency(
                        dealValue,
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-ink/60">
                      Commission Pool
                    </span>

                    <span className="text-cream">
                      {formatCurrency(
                        commissionPool,
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-ink/60">
                      Agent Share (
                      {
                        agentSharePercent
                      }
                      %)
                    </span>

                    <span className="text-emerald-400">
                      {formatCurrency(
                        agentAmount,
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-ink/60">
                      Agency Share (
                      {
                        agencySharePercent
                      }
                      %)
                    </span>

                    <span className="text-gold-400">
                      {formatCurrency(
                        agencyAmount,
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between pt-2 font-bold text-base">
                    <span className="text-cream">
                      Your Commission
                    </span>

                    <span className="text-emerald-400">
                      {formatCurrency(
                        agentAmount,
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                <h3 className="font-heading text-sm font-semibold text-cream mb-4 flex items-center gap-2">
                  <Percent className="h-4 w-4 text-ink/60" />
                  Commission Configuration
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-ink/60">
                      Agent Share
                    </span>

                    <span className="text-cream">
                      {
                        agentSharePercent
                      }
                      %
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-ink/60">
                      Agency Share
                    </span>

                    <span className="text-cream">
                      {
                        agencySharePercent
                      }
                      %
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-ink/60">
                      Total Split
                    </span>

                    <span className="text-emerald-400">
                      {agentSharePercent +
                        agencySharePercent}
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                <h3 className="font-heading text-sm font-semibold text-cream mb-4 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-ink/60" />
                  Related Deal Info
                </h3>

                <div className="space-y-3 text-sm">
                  <div>
                    <span className="block text-ink/60 text-xs mb-1">
                      Property
                    </span>

                    <span className="text-cream">
                      {propertyTitle}
                    </span>
                  </div>

                  <div>
                    <span className="block text-ink/60 text-xs mb-1">
                      Buyer
                    </span>

                    <span className="text-cream">
                      {buyerName}
                    </span>
                  </div>

                  <div>
                    <span className="block text-ink/60 text-xs mb-1">
                      Agency
                    </span>

                    <span className="text-cream">
                      {agencyName}
                    </span>
                  </div>

                  <div>
                    <span className="block text-ink/60 text-xs mb-1">
                      Deal Value
                    </span>

                    <span className="text-gold-400 font-medium">
                      {formatCurrency(
                        dealValue,
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                <h3 className="font-heading text-sm font-semibold text-cream mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-ink/60" />
                  Payment Information
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-ink/60">
                      Status
                    </span>

                    <span className="text-cream">
                      {status}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-ink/60">
                      Due Date
                    </span>

                    <span className="text-cream">
                      {formatDate(
                        commission.dueDate,
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-ink/60">
                      Paid Date
                    </span>

                    <span className="text-emerald-400">
                      {formatDate(
                        commission.paidAt,
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* History */}
        {activeTab ===
          'history' && (
          <div className="rounded-xl border border-white/5 bg-navy-900/50 p-6">
            <ActivityTimeline
              title="Commission Audit Trail"
              items={
                paymentTimeline
              }
            />
          </div>
        )}
      </div>
    </Modal>
  );
}
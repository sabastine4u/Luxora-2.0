import { useState } from 'react';
import {
  Briefcase,
  MapPin,
  User,
  CheckCircle2,
  FileText,
  CreditCard,
  Milestone,
  AlertCircle,
  FileSignature,
  Clock,
  ShieldCheck,
} from 'lucide-react';

import { Modal } from '../../../../components/ui/Modal';
import { GhostButton } from '../../../../components/ui/ui';
import { StatusBadge } from '../../../ManagementDashboard/components/shared/StatusBadge';
import { ActivityTimeline } from '../../../../components/dashboard/shared/timelines/ActivityTimeline';

interface DealDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  deal: Record<string, unknown> | null;
}

const formatCurrency = (
  amount: number | null | undefined,
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

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatDateTime = (
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

  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getString = (
  value: unknown,
  fallback = '',
) => {
  return typeof value === 'string'
    ? value
    : fallback;
};

const getNumber = (
  value: unknown,
  fallback = 0,
) => {
  return typeof value === 'number'
    ? value
    : fallback;
};

export function DealDetailModal({
  isOpen,
  onClose,
  deal,
}: DealDetailModalProps) {
  const [
    activeTab,
    setActiveTab,
  ] = useState<
    'overview' | 'documents' | 'timeline'
  >('overview');

  if (!deal) {
    return null;
  }

  /*
   * Core Deal information.
   */
  const dealId = getString(
    deal.dealId,
    'Deal ID unavailable',
  );

  const propertyTitle = getString(
    deal.property,
    'Property unavailable',
  );

  const clientName = getString(
    deal.client,
    'Buyer unavailable',
  );

  const buyerEmail = getString(
    deal.buyerEmail,
  );

  const buyerPhone = getString(
    deal.buyerPhone,
  );

  const ownerName = getString(
    deal.ownerName,
    'Owner unavailable',
  );

  const ownerEmail = getString(
    deal.ownerEmail,
  );

  const ownerPhone = getString(
    deal.ownerPhone,
  );

  const agency = getString(
    deal.agency,
    'Agency unavailable',
  );

  const propertyId =
    deal.propertyId;

  const propertyPrice =
    getNumber(
      deal.propertyPrice,
    );

  const offerAmount =
    getNumber(
      deal.offerAmount,
    );

  const counterOfferAmount =
    typeof deal.counterOfferAmount ===
    'number'
      ? deal.counterOfferAmount
      : null;

  const agreedAmount =
    getNumber(
      deal.agreedAmount,
      counterOfferAmount ??
        offerAmount,
    );

  const status = getString(
    deal.status,
    'Unknown',
  );

  const agreementStatus =
    getString(
      deal.agreementStatus,
      'Pending',
    );

  const paymentStatus =
    getString(
      deal.paymentStatus,
      'Pending',
    );

  const transactionType =
    getString(
      deal.transactionType,
      'buy',
    );

  const closingDate =
    getString(
      deal.closingDate,
      'Not provided',
    );

  const buyerNotes =
    getString(
      deal.buyerNotes,
    );

  const agentNotes =
    getString(
      deal.agentNotes,
    );

  const counterOfferDetails =
    getString(
      deal.counterOfferDetails,
    );

  const propertyStatus =
    getString(
      deal.propertyStatus,
      'Not supplied',
    );

  const propertyAvailability =
    getString(
      deal.propertyAvailability,
      'Not supplied',
    );

  const createdAt =
    getString(
      deal.createdAt,
    );

  const updatedAt =
    getString(
      deal.updatedAt,
    );

  const agreementCompletedAt =
    getString(
      deal.agreementCompletedAt,
    );

  const paymentVerifiedAt =
    getString(
      deal.paymentVerifiedAt,
    );

  const completedAt =
    getString(
      deal.completedAt,
    );

  const cancelledAt =
    getString(
      deal.cancelledAt,
    );

  /*
   * Build a real Deal lifecycle timeline.
   *
   * We only show events for which the backend has
   * actually supplied data.
   */
  const activityTimeline = [
    {
      title: 'Deal Created',
      time: formatDateTime(
        createdAt,
      ),
      desc:
        'The accepted Offer was converted into a persistent transaction Deal.',
      icon: FileText,
      color:
        'text-blue-400',
    },

    {
      title: 'Offer Accepted',
      time: formatDateTime(
        createdAt,
      ),
      desc:
        `Accepted transaction value: ${formatCurrency(
          agreedAmount,
        )}.`,
      icon: CheckCircle2,
      color:
        'text-emerald-400',
    },

    {
      title: 'Property Under Offer',
      time: formatDateTime(
        createdAt,
      ),
      desc:
        propertyStatus !==
          'Not supplied'
          ? `Property status: ${propertyStatus}${
              propertyAvailability !==
              'Not supplied'
                ? ` · Availability: ${propertyAvailability}`
                : ''
            }.`
          : 'The property was moved into the transaction stage when the Deal was created.',
      icon: Briefcase,
      color:
        'text-gold-400',
    },

    {
      title:
        `Agreement: ${agreementStatus}`,
      time: agreementCompletedAt
        ? formatDateTime(
            agreementCompletedAt,
          )
        : formatDateTime(
            updatedAt,
          ),
      desc:
        agreementStatus ===
        'Completed'
          ? 'The agreement stage has been completed.'
          : 'The Deal is still waiting for the agreement stage to be completed.',
      icon:
        ShieldCheck,
      color:
        agreementStatus ===
        'Completed'
          ? 'text-emerald-400'
          : 'text-orange-400',
    },

    {
      title:
        `Payment: ${paymentStatus}`,
      time: paymentVerifiedAt
        ? formatDateTime(
            paymentVerifiedAt,
          )
        : formatDateTime(
            updatedAt,
          ),
      desc:
        paymentStatus ===
        'Verified'
          ? 'Payment has been verified.'
          : 'Payment verification has not yet been completed.',
      icon:
        CreditCard,
      color:
        paymentStatus ===
        'Verified'
          ? 'text-emerald-400'
          : 'text-blue-400',
    },

    ...(status ===
      'Completed'
      ? [
          {
            title:
              'Deal Completed',
            time:
              completedAt
                ? formatDateTime(
                    completedAt,
                  )
                : formatDateTime(
                    updatedAt,
                  ),
            desc:
              'The transaction has been completed.',
            icon:
              CheckCircle2,
            color:
              'text-emerald-400',
          },
        ]
      : []),

    ...(status ===
      'Cancelled'
      ? [
          {
            title:
              'Deal Cancelled',
            time:
              cancelledAt
                ? formatDateTime(
                    cancelledAt,
                  )
                : formatDateTime(
                    updatedAt,
                  ),
            desc:
              'The transaction Deal has been cancelled.',
            icon:
              AlertCircle,
            color:
              'text-rose-400',
          },
        ]
      : []),

    {
      title:
        `Current Status: ${status}`,
      time: formatDateTime(
        updatedAt,
      ),
      desc:
        'Latest Deal state returned by the backend.',
      icon:
        status ===
        'Completed'
          ? CheckCircle2
          : AlertCircle,
      color:
        status ===
        'Completed'
          ? 'text-emerald-400'
          : 'text-ink/60',
    },
  ];

  /*
   * Document management is not yet a real Deal domain.
   *
   * These are informational placeholders only. We do not
   * allow the Agent to fake document actions from this page.
   */
  const documentItems = [
    {
      name:
        'Agreement Record',
      description:
        'Agreement document storage is not connected to the Deal API.',
      status:
        'Not Connected',
    },

    {
      name:
        'Payment Evidence',
      description:
        'Payment document storage is not connected to the Deal API.',
      status:
        'Not Connected',
    },

    {
      name:
        'Completion Documents',
      description:
        'Completion document storage is not connected to the Deal API.',
      status:
        'Not Connected',
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Deal Overview"
      size="2xl"
    >
      <div className="space-y-8 pb-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-6 items-start border-b border-white/5 pb-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-navy-900 border border-white/10 shrink-0">
            <Briefcase className="h-10 w-10 text-emerald-400" />
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-cream">
                {propertyTitle}
              </h2>

              <div className="text-ink/60 flex flex-wrap items-center gap-4 mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />

                  Deal:
                  {' '}
                  {dealId}
                </span>

                <span className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5" />

                  Buyer:
                  {' '}
                  {clientName}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <StatusBadge
                status={status}
              />

              <span className="inline-flex items-center rounded-full border border-white/10 bg-navy-800/50 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                Agreed Value:
                {' '}
                {formatCurrency(
                  agreedAmount,
                )}
              </span>

              <span className="inline-flex items-center rounded-full border border-white/10 bg-navy-800/50 px-2.5 py-0.5 text-xs font-semibold text-gold-400">
                Agreement:
                {' '}
                {agreementStatus}
              </span>

              <span className="inline-flex items-center rounded-full border border-white/10 bg-navy-800/50 px-2.5 py-0.5 text-xs font-semibold text-blue-400">
                Payment:
                {' '}
                {paymentStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex border-b border-white/10">
          {[
            {
              id: 'overview',
              label: 'Deal Overview',
            },
            {
              id: 'documents',
              label:
                'Documents & Records',
            },
            {
              id: 'timeline',
              label:
                'Activity Timeline',
            },
          ].map(
            (tab) => (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(
                    tab.id as
                      | 'overview'
                      | 'documents'
                      | 'timeline',
                  )
                }
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab ===
                  tab.id
                    ? 'border-gold-400 text-gold-400'
                    : 'border-transparent text-ink/60 hover:text-cream hover:border-white/20'
                }`}
              >
                {tab.label}
              </button>
            ),
          )}
        </div>

        {/* Overview */}
        {activeTab ===
          'overview' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
              {/* Financial Summary */}
              <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                <h3 className="font-heading text-sm font-semibold text-cream mb-4 flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-ink/60" />
                  Financial Summary
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-ink/60">
                      Property Price
                    </span>

                    <span className="text-cream font-bold">
                      {formatCurrency(
                        propertyPrice,
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-ink/60">
                      Initial Offer
                    </span>

                    <span className="text-cream font-bold">
                      {formatCurrency(
                        offerAmount,
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-ink/60">
                      Counter Offer
                    </span>

                    <span className="text-gold-400 font-bold">
                      {counterOfferAmount !==
                      null
                        ? formatCurrency(
                            counterOfferAmount,
                          )
                        : 'None'}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-ink/60">
                      Agreed Deal Value
                    </span>

                    <span className="text-emerald-400 font-bold">
                      {formatCurrency(
                        agreedAmount,
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-ink/60">
                      Agreement Status
                    </span>

                    <span className="text-cream font-semibold">
                      {
                        agreementStatus
                      }
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-ink/60">
                      Payment Status
                    </span>

                    <span className="text-cream font-semibold">
                      {
                        paymentStatus
                      }
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-ink/60">
                      Commission
                    </span>

                    <span className="text-gold-400 font-bold">
                      Not calculated
                    </span>
                  </div>
                </div>
              </div>

              {/* Deal State */}
              <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                <h3 className="font-heading text-sm font-semibold text-cream mb-4 flex items-center gap-2">
                  <Milestone className="h-4 w-4 text-ink/60" />
                  Deal State
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-ink/60">
                      Current Stage
                    </span>

                    <span className="text-cream font-semibold">
                      {status}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-ink/60">
                      Transaction
                    </span>

                    <span className="text-cream capitalize">
                      {
                        transactionType
                      }
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-ink/60">
                      Created
                    </span>

                    <span className="text-cream">
                      {formatDate(
                        createdAt,
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-ink/60">
                      Last Updated
                    </span>

                    <span className="text-cream">
                      {formatDate(
                        updatedAt,
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Offer Notes */}
              <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                <h3 className="font-heading text-sm font-semibold text-cream mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-ink/60" />
                  Transaction Notes
                </h3>

                <div className="space-y-3">
                  <div className="rounded-lg border border-white/5 bg-navy-800 p-3">
                    <div className="text-[10px] uppercase tracking-wider text-ink/40 mb-1">
                      Buyer Notes
                    </div>

                    <p className="text-xs text-ink/80 leading-relaxed">
                      {buyerNotes ||
                        'No buyer note was provided.'}
                    </p>
                  </div>

                  <div className="rounded-lg border border-white/5 bg-navy-800 p-3">
                    <div className="text-[10px] uppercase tracking-wider text-ink/40 mb-1">
                      Agent Notes
                    </div>

                    <p className="text-xs text-ink/80 leading-relaxed">
                      {agentNotes ||
                        'No agent note has been recorded.'}
                    </p>
                  </div>

                  {counterOfferDetails && (
                    <div className="rounded-lg border border-gold-400/10 bg-gold-400/5 p-3">
                      <div className="text-[10px] uppercase tracking-wider text-gold-400/60 mb-1">
                        Counter Offer Details
                      </div>

                      <p className="text-xs text-ink/80 leading-relaxed">
                        {
                          counterOfferDetails
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Deal Parties */}
              <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                <h3 className="font-heading text-sm font-semibold text-cream mb-4 flex items-center gap-2">
                  <Milestone className="h-4 w-4 text-ink/60" />
                  Deal Parties
                </h3>

                <div className="space-y-4">
                  {/* Buyer */}
                  <div className="bg-navy-800 p-3 rounded-lg border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-navy-950 flex items-center justify-center text-xs font-bold text-cream">
                        B
                      </div>

                      <div className="min-w-0">
                        <span className="block text-xs font-semibold text-cream">
                          Buyer
                        </span>

                        <span className="block text-[10px] text-ink/60 truncate">
                          {
                            clientName
                          }
                        </span>

                        {buyerEmail && (
                          <span className="block text-[10px] text-ink/40 truncate">
                            {
                              buyerEmail
                            }
                          </span>
                        )}

                        {buyerPhone && (
                          <span className="block text-[10px] text-ink/40">
                            {
                              buyerPhone
                            }
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Owner */}
                  <div className="bg-navy-800 p-3 rounded-lg border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-navy-950 flex items-center justify-center text-xs font-bold text-cream">
                        O
                      </div>

                      <div className="min-w-0">
                        <span className="block text-xs font-semibold text-cream">
                          Owner
                        </span>

                        <span className="block text-[10px] text-ink/60 truncate">
                          {
                            ownerName
                          }
                        </span>

                        {ownerEmail && (
                          <span className="block text-[10px] text-ink/40 truncate">
                            {
                              ownerEmail
                            }
                          </span>
                        )}

                        {ownerPhone && (
                          <span className="block text-[10px] text-ink/40">
                            {
                              ownerPhone
                            }
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Agency */}
                  <div className="bg-navy-800 p-3 rounded-lg border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-navy-950 flex items-center justify-center text-xs font-bold text-cream">
                        A
                      </div>

                      <div className="min-w-0">
                        <span className="block text-xs font-semibold text-cream">
                          Agency
                        </span>

                        <span className="block text-[10px] text-ink/60 truncate">
                          {
                            agency
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Property Information */}
              <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                <h3 className="font-heading text-sm font-semibold text-cream mb-4 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-ink/60" />
                  Property Information
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-white/5 pb-2 gap-4">
                    <span className="text-ink/60">
                      Property
                    </span>

                    <span className="text-cream text-right">
                      {
                        propertyTitle
                      }
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-ink/60">
                      Property ID
                    </span>

                    <span className="text-cream text-right break-all">
                      {propertyId
                        ? String(
                            propertyId,
                          )
                        : 'Unavailable'}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-ink/60">
                      Transaction
                    </span>

                    <span className="text-cream capitalize">
                      {
                        transactionType
                      }
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-ink/60">
                      Listed Price
                    </span>

                    <span className="text-cream">
                      {formatCurrency(
                        propertyPrice,
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-ink/60">
                      Estimated Closing
                    </span>

                    <span className="text-cream">
                      {
                        closingDate
                      }
                    </span>
                  </div>
                </div>
              </div>

              {/* Backend Availability */}
              <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                <h3 className="font-heading text-sm font-semibold text-cream mb-4 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-ink/60" />
                  Workflow Availability
                </h3>

                <div className="rounded-lg border border-dashed border-white/10 bg-navy-800/40 p-4">
                  <div className="text-sm font-semibold text-cream mb-1">
                    Read-only Deal view
                  </div>

                  <div className="text-xs text-ink/60 leading-relaxed">
                    Agreement, payment,
                    document, and completion
                    actions will be enabled
                    here once their backend
                    workflows are implemented.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Documents */}
        {activeTab ===
          'documents' && (
          <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
            <h3 className="font-heading text-sm font-semibold text-cream mb-4 flex items-center gap-2">
              <FileSignature className="h-4 w-4 text-ink/60" />
              Deal Documents & Records
            </h3>

            <div className="mb-5 rounded-lg border border-dashed border-white/10 bg-navy-800/40 p-4">
              <div className="text-sm font-semibold text-cream mb-1">
                Document management is not connected
              </div>

              <div className="text-xs text-ink/60 leading-relaxed">
                The current Deal API
                returns transaction state,
                but it does not yet return
                document records, upload
                state, signatures, or approval
                records.
              </div>
            </div>

            <div className="space-y-3">
              {documentItems.map(
                (
                  item,
                  index,
                ) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-4 bg-navy-800 p-4 rounded-lg border border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-white/5 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-ink/60" />
                      </div>

                      <div>
                        <div className="text-sm font-semibold text-cream">
                          {
                            item.name
                          }
                        </div>

                        <div className="text-[10px] text-ink/50 mt-0.5">
                          {
                            item.description
                          }
                        </div>
                      </div>
                    </div>

                    <span className="shrink-0 text-[10px] px-2 py-1 rounded-full bg-white/5 text-ink/50 border border-white/10">
                      {
                        item.status
                      }
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>
        )}

        {/* Timeline */}
        {activeTab ===
          'timeline' && (
          <div className="rounded-xl border border-white/5 bg-navy-900/50 p-6">
            <ActivityTimeline
              title="Deal Activity Timeline"
              items={
                activityTimeline
              }
            />
          </div>
        )}
      </div>
    </Modal>
  );
}
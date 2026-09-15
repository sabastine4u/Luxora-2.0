import { useState } from 'react';
import {
  Briefcase,
  MapPin,
  User,
  CheckCircle2,
  FileText,
  CreditCard,
  Target,
  Milestone,
  AlertCircle,
  FileSignature,
} from 'lucide-react';
import { Modal } from '../../../../components/ui/Modal';
import {
  GoldButton,
  GhostButton,
} from '../../../../components/ui/ui';
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

  return date.toLocaleDateString(
    'en-GB',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    },
  );
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
  const [activeTab, setActiveTab] =
    useState<
      'overview' | 'documents' | 'timeline'
    >('overview');

  if (!deal) {
    return null;
  }

  /*
   * Read the real Offer fields supplied by Deals.tsx.
   */
  const propertyTitle =
    getString(
      deal.property,
      'Property unavailable',
    );

  const clientName =
    getString(
      deal.client,
      'Buyer unavailable',
    );

  const buyerEmail =
    getString(
      deal.buyerEmail,
    );

  const buyerPhone =
    getString(
      deal.buyerPhone,
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

  const currentValue =
    counterOfferAmount ??
    offerAmount;

  const stage =
    getString(
      deal.stage,
      'Offer Submitted',
    );

  const status =
    getString(
      deal.status,
      'Submitted',
    );

  const closingDate =
    getString(
      deal.closingDate,
      'Not provided',
    );

  const transactionType =
    getString(
      deal.transactionType,
      'buy',
    );

  const agency =
    getString(
      deal.agency,
      'Agency unavailable',
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

  /*
   * There is currently no Deal/Document/Payment model
   * connected to this Offer, so these sections show
   * honest backend availability instead of fabricated data.
   */

  const activityTimeline = [
    {
      title:
        'Offer Created',
      time: formatDate(
        deal.createdAt,
      ),
      desc:
        `Offer submitted at ${formatCurrency(
          offerAmount,
        )}.`,
      icon: FileText,
      color: 'text-blue-400',
    },
    ...(counterOfferAmount !== null
      ? [
          {
            title:
              'Counter Offer',
            time: formatDate(
              deal.updatedAt,
            ),
            desc:
              `Counter offer recorded at ${formatCurrency(
                counterOfferAmount,
              )}.`,
            icon: Target,
            color: 'text-gold-400',
          },
        ]
      : []),
    {
      title:
        `Current Status: ${status}`,
      time: formatDate(
        deal.updatedAt,
      ),
      desc:
        'Latest offer lifecycle state returned by the backend.',
      icon:
        status === 'Accepted'
          ? CheckCircle2
          : AlertCircle,
      color:
        status === 'Accepted'
          ? 'text-emerald-400'
          : 'text-ink/60',
    },
  ];

  const documentChecklist = [
    {
      name:
        'Initial Offer Letter',
      status: 'Not Connected',
    },
    {
      name:
        'Proof of Funds',
      status: 'Not Connected',
    },
    {
      name:
        'Purchase Agreement',
      status: 'Not Connected',
    },
    {
      name:
        'Title Transfer Documents',
      status: 'Not Connected',
    },
  ];

  const handleRequestSignature =
    () => {
      showPlaceholderToast(
        'Request Signature',
        'Signature workflow is not connected to the Offer backend yet.',
      );
    };

  const handleFlagIssue = () => {
    showPlaceholderToast(
      'Flag Issue',
      'Issue-management workflow is not connected to the Offer backend yet.',
    );
  };

  const handleAdvanceStage =
    () => {
      showPlaceholderToast(
        'Advance Stage',
        'Deal stage advancement will be connected when the Agent negotiation workflow is implemented.',
      );
    };

  const handleViewBuyer =
    () => {
      showPlaceholderToast(
        'Buyer Profile',
        'Buyer profile navigation will be connected to the Agent Clients workflow.',
      );
    };

  const handleViewSeller =
    () => {
      showPlaceholderToast(
        'Seller Profile',
        'Seller/Owner profile navigation will be connected to the Owner workflow.',
      );
    };

  const handleDocumentAction =
    (
      documentName: string,
    ) => {
      showPlaceholderToast(
        documentName,
        'Document management is not connected to the current backend yet.',
      );
    };

  function showPlaceholderToast(
    title: string,
    description: string,
  ) {
    /*
     * Placeholder buttons are deliberately kept because
     * the existing UI functionality should remain visible.
     * The parent page already owns the ToastContext, so this
     * component does not invent another application state layer.
     */
    console.info(
      `${title}: ${description}`,
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Deal Overview"
      size="2xl"
      actionButton={
        <GoldButton
          onClick={
            handleAdvanceStage
          }
        >
          Advance Stage
        </GoldButton>
      }
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
                  Property ID:{' '}
                  {propertyId
                    ? String(
                        propertyId,
                      ).slice(
                        -8,
                      )
                    : 'Unavailable'}
                </span>

                <span className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5" />
                  Client:{' '}
                  {clientName}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <StatusBadge
                status={status}
              />

              <span className="inline-flex items-center rounded-full border border-white/10 bg-navy-800/50 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                Value:{' '}
                {formatCurrency(
                  currentValue,
                )}
              </span>

              <span className="inline-flex items-center rounded-full border border-white/10 bg-navy-800/50 px-2.5 py-0.5 text-xs font-semibold text-gold-400">
                Stage:{' '}
                {stage}
              </span>
            </div>

            <div className="flex gap-4 pt-2">
              <GhostButton
                onClick={
                  handleRequestSignature
                }
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gold-400 hover:text-gold-300"
              >
                <FileSignature className="h-4 w-4" />
                Request Signature
              </GhostButton>

              <GhostButton
                onClick={
                  handleFlagIssue
                }
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-400 hover:text-red-300"
              >
                <AlertCircle className="h-4 w-4" />
                Flag Issue
              </GhostButton>
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
                'Documents & Checklist',
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
                      Current Value
                    </span>

                    <span className="text-emerald-400 font-bold">
                      {formatCurrency(
                        currentValue,
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-ink/60">
                      Estimated Commission
                    </span>

                    <span className="text-gold-400 font-bold">
                      Not calculated
                    </span>
                  </div>
                </div>
              </div>

              {/* Offer Notes */}
              <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                <h3 className="font-heading text-sm font-semibold text-cream mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-ink/60" />
                  Offer Notes
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
                        {counterOfferDetails}
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
                  <div className="flex justify-between items-center bg-navy-800 p-2.5 rounded-lg border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-navy-950 flex items-center justify-center text-xs font-bold text-cream">
                        B
                      </div>

                      <div>
                        <span className="block text-xs font-semibold text-cream">
                          Buyer
                        </span>

                        <span className="block text-[10px] text-ink/60">
                          {clientName}
                        </span>

                        {buyerEmail && (
                          <span className="block text-[10px] text-ink/40">
                            {buyerEmail}
                          </span>
                        )}
                      </div>
                    </div>

                    <GhostButton
                      onClick={
                        handleViewBuyer
                      }
                      className="px-2 py-1 text-[10px]"
                    >
                      View
                    </GhostButton>
                  </div>

                  <div className="flex justify-between items-center bg-navy-800 p-2.5 rounded-lg border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-navy-950 flex items-center justify-center text-xs font-bold text-cream">
                        A
                      </div>

                      <div>
                        <span className="block text-xs font-semibold text-cream">
                          Agency
                        </span>

                        <span className="block text-[10px] text-ink/60">
                          {agency}
                        </span>
                      </div>
                    </div>

                    <GhostButton
                      onClick={
                        handleViewSeller
                      }
                      className="px-2 py-1 text-[10px]"
                    >
                      View
                    </GhostButton>
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
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-ink/60">
                      Property
                    </span>

                    <span className="text-cream text-right">
                      {propertyTitle}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-ink/60">
                      Transaction
                    </span>

                    <span className="text-cream capitalize">
                      {transactionType}
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
                      {closingDate}
                    </span>
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
              Required Documents
            </h3>

            <div className="mb-4 rounded-lg border border-dashed border-white/10 bg-navy-800/40 p-4">
              <div className="text-sm font-semibold text-cream mb-1">
                Document workflow not connected
              </div>

              <div className="text-xs text-ink/60 leading-relaxed">
                The current Offer backend does not yet
                contain document records, upload status,
                or approval status for this deal.
              </div>
            </div>

            <div className="space-y-3">
              {documentChecklist.map(
                (
                  item,
                  idx,
                ) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center bg-navy-800 p-3 rounded-lg border border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-4 w-4 rounded-full border border-ink/40 flex items-center justify-center" />

                      <span className="text-sm text-cream">
                        {item.name}
                      </span>
                    </div>

                    <GhostButton
                      onClick={() =>
                        handleDocumentAction(
                          item.name,
                        )
                      }
                      className="px-3 py-1 text-xs border border-white/10"
                    >
                      {item.status}
                    </GhostButton>
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
              title="Negotiation & Activity Timeline"
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
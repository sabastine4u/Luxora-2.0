import { useState } from 'react';
import {
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Building2,
  Heart,
  MessageSquare,
  Briefcase,
  FileText,
  Activity,
  CheckCircle2,
  Clock,
} from 'lucide-react';

import { Modal } from '../../../../components/ui/Modal';
import {
  GoldButton,
  GhostButton,
} from '../../../../components/ui/ui';
import { StatusBadge } from '../../../ManagementDashboard/components/shared/StatusBadge';
import { ActivityTimeline } from '../../../../components/dashboard/shared/timelines/ActivityTimeline';

// Real direct messaging APIs.
import { conversationApi } from '../../../../api/conversation.api';
import { messageApi } from '../../../../api/message.api';

interface ClientDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Record<string, unknown> | null;
}

export function ClientDetailModal({
  isOpen,
  onClose,
  client,
}: ClientDetailModalProps) {
  const [activeTab, setActiveTab] = useState<
    'profile' | 'transactions' | 'communication'
  >('profile');

  // Control the real Client messaging composer.
  const [
    isMessageComposerOpen,
    setIsMessageComposerOpen,
  ] = useState(false);

  // Store the message currently being written to the Client.
  const [messageText, setMessageText] =
    useState('');

  // Keep messaging submission separate from the rest of the modal.
  const [isMessaging, setIsMessaging] =
    useState(false);

  // Store a dedicated messaging error so it does not replace Client data.
  const [messageError, setMessageError] =
    useState('');

  // Show a dedicated success state after the message is persisted.
  const [messageSuccess, setMessageSuccess] =
    useState(false);

  if (!client) return null;

  // Read the real Client fields already supplied by Clients.tsx.
  const clientName =
    String(
      client.name ||
        'Unknown Client',
    );

  const clientEmail =
    String(
      client.email ||
        'N/A',
    );

  const clientPhone =
    String(
      client.phone ||
        'N/A',
    );

  const clientStatus =
    String(
      client.status ||
        'Past',
    );

  const relationshipStatus =
    String(
      client.relationshipStatus ||
        clientStatus ||
        'Past',
    );

  const clientType =
    String(
      client.type ||
        'Property Client',
    );

  const latestSource =
    String(
      client.latestSource ||
        'Unknown',
    );

  const inquiryCount =
    Number(
      client.inquiryCount ||
        0,
    );

  const propertyCount =
    Number(
      client.propertyCount ||
        0,
    );

  const isRegisteredUser =
    Boolean(
      client.isRegisteredUser,
    );

  const hasActiveInquiry =
    Boolean(
      client.hasActiveInquiry,
    );

  const lastContactAt =
    String(
      client.lastContactAt ||
        '',
    );

  const firstInteractionAt =
    String(
      client.firstInteractionAt ||
        '',
    );

  const lastContact =
    String(
      client.lastContact ||
        formatDateTime(
          lastContactAt,
        ),
    );

  const latestProperty =
    (client.latestProperty as
      | Record<string, unknown>
      | null
      | undefined) ||
    null;

  // Format the first interaction date for the profile section.
  const clientSince =
    formatDateTime(
      firstInteractionAt,
    );

  // Build a real activity timeline from the relationship data available today.
  const interactionHistory = [
    {
      title:
        hasActiveInquiry
          ? 'Active Client Relationship'
          : 'Client Relationship',
      time: lastContact,
      desc:
        `${inquiryCount} ${
          inquiryCount === 1
            ? 'inquiry'
            : 'inquiries'
        } across ${propertyCount} ${
          propertyCount === 1
            ? 'property'
            : 'properties'
        }.`,
      icon: hasActiveInquiry
        ? CheckCircle2
        : Activity,
      color: hasActiveInquiry
        ? 'text-emerald-400'
        : 'text-blue-400',
    },
    {
      title: 'First Interaction',
      time: clientSince,
      desc:
        `Client entered the Agent relationship through ${latestSource}.`,
      icon: Calendar,
      color: 'text-gold-400',
    },
    ...(latestProperty
      ? [
          {
            title:
              'Latest Property Interest',
            time:
              formatDateTime(
                lastContactAt,
              ),
            desc:
              String(
                latestProperty.title ||
                  'Property information unavailable',
              ),
            icon: Building2,
            color:
              'text-blue-400',
          },
        ]
      : []),
  ];

  // Build real communication information from the Client relationship.
  const communicationHistory = [
    {
      title: 'Latest Contact',
      time: lastContact,
      desc:
        `The most recent recorded Client activity is associated with ${clientStatus} status.`,
      icon: MessageSquare,
      color:
        'text-emerald-400',
    },
    {
      title: 'Lead Source',
      time: latestSource,
      desc:
        'This is the source recorded on the Client’s latest inquiry.',
      icon: FileText,
      color:
        'text-gold-400',
    },
    {
      title: 'Relationship',
      time: relationshipStatus,
      desc: hasActiveInquiry
        ? 'The Client currently has an active inquiry with the Agent.'
        : 'There is currently no active inquiry for this Client.',
      icon: Activity,
      color:
        hasActiveInquiry
          ? 'text-emerald-400'
          : 'text-blue-400',
    },
  ];

  // Start the real Agent-to-Client messaging workflow.
  const handleSendMessage = async () => {
    if (
      isMessaging ||
      messageSuccess ||
      !client
    ) {
      return;
    }

    // Anonymous inquiry contacts do not have a Luxora User account.
    if (!isRegisteredUser) {
      setMessageError(
        'This Client is not linked to a Luxora user account and cannot receive direct messages.',
      );

      return;
    }

    const body =
      messageText.trim();

    if (!body) {
      setMessageError(
        'Please enter a message.',
      );

      return;
    }

    if (body.length > 2000) {
      setMessageError(
        'Message cannot exceed 2000 characters.',
      );

      return;
    }

    if (
      !clientEmail.trim() ||
      clientEmail === 'N/A'
    ) {
      setMessageError(
        'This Client does not have an email address available for messaging.',
      );

      return;
    }

    try {
      setIsMessaging(true);
      setMessageError('');

      /*
       * Create or reuse the real direct conversation.
       *
       * IMPORTANT:
       * The frontend sends only the Client email.
       * The backend resolves the actual Luxora User from the
       * authenticated Agent's Inquiry relationship.
       */
      const conversationResponse =
        await conversationApi.createConversation({
          type: 'direct',
          clientEmail:
            clientEmail.trim(),
        });

      const conversationId =
        conversationResponse?.conversation?._id ??
        conversationResponse?.conversation?.id ??
        conversationResponse?.data?.conversation?._id ??
        conversationResponse?.data?.conversation?.id;

      if (!conversationId) {
        throw new Error(
          'The server did not return a conversation.',
        );
      }

      // Persist the actual message in the real conversation.
      await messageApi.sendMessage(
        String(conversationId),
        body,
      );

      setMessageSuccess(true);
      setMessageText('');
      setMessageError('');
    } catch (error) {
      console.error(
        'Failed to send Agent Client message:',
        error,
      );

      setMessageError(
        error instanceof Error
          ? error.message
          : 'Unable to send the message. Please try again.',
      );
    } finally {
      setIsMessaging(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Client Details"
      size="2xl"
    >
      <div className="space-y-8 pb-4">
        {/* Header Profile Section */}
        <div className="flex flex-col items-start gap-6 border-b border-white/5 pb-6 md:flex-row">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-navy-900">
            <User className="h-10 w-10 text-ink/40" />
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-cream">
                {
                  clientName
                }
              </h2>

              <div className="mt-1 flex flex-col gap-2 text-ink/60 md:flex-row md:items-center md:gap-4">
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />

                  {
                    clientEmail
                  }
                </span>

                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" />

                  {
                    clientPhone
                  }
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <StatusBadge
                status={
                  relationshipStatus
                }
              />

              {/* Registered-user state comes from the real backend record. */}
              <span className="inline-flex items-center rounded-full border border-white/10 bg-navy-800/50 px-2.5 py-0.5 text-xs font-semibold text-ink/70">
                {isRegisteredUser
                  ? 'Registered User'
                  : 'Contact Lead'}
              </span>

              {/* Use the real latest property type instead of a fake VIP label. */}
              <span className="inline-flex items-center rounded-full border border-white/10 bg-navy-800/50 px-2.5 py-0.5 text-xs font-semibold text-gold-400">
                {
                  clientType
                }
              </span>
            </div>

            <div className="flex gap-4 pt-2">
              {/* Real messaging button. */}
              <GhostButton
                disabled={
                  isMessaging ||
                  !isRegisteredUser
                }
                onClick={() => {
                  setIsMessageComposerOpen(
                    true,
                  );
                  setMessageText('');
                  setMessageSuccess(
                    false,
                  );
                  setMessageError('');
                }}
                className="flex items-center gap-2 px-3 py-1.5 text-sm"
                title={
                  isRegisteredUser
                    ? 'Message Client'
                    : 'This Client does not have a registered Luxora account'
                }
              >
                <MessageSquare className="h-4 w-4" />
                Message Client
              </GhostButton>

              {/* Call scheduling backend is not implemented yet. */}
              <GhostButton
                disabled
                className="flex items-center gap-2 px-3 py-1.5 text-sm"
              >
                <Calendar className="h-4 w-4" />
                Schedule Call
              </GhostButton>
            </div>

            {/* Real direct-message composer. */}
            {isMessageComposerOpen && (
              <div className="mt-4 rounded-xl border border-white/10 bg-navy-900/70 p-4">
                {messageSuccess ? (
                  <div className="space-y-3 text-center">
                    <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-400" />

                    <div className="text-sm font-semibold text-cream">
                      Message Sent
                    </div>

                    <div className="text-xs text-ink/60">
                      Your message was sent to this Client successfully.
                    </div>

                    <div className="flex justify-center gap-3 pt-1">
                      <GhostButton
                        type="button"
                        disabled={
                          isMessaging
                        }
                        onClick={() => {
                          setIsMessageComposerOpen(
                            false,
                          );
                          setMessageSuccess(
                            false,
                          );
                          setMessageText('');
                          setMessageError('');
                        }}
                      >
                        Close
                      </GhostButton>

                      <GoldButton
                        type="button"
                        disabled={
                          isMessaging
                        }
                        onClick={() => {
                          setMessageSuccess(
                            false,
                          );
                          setMessageText('');
                          setMessageError('');
                        }}
                      >
                        Send Another
                      </GoldButton>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-semibold text-cream">
                        Message Client
                      </div>

                      <div className="mt-1 text-xs text-ink/50">
                        Send a private message through Luxora's real conversation system.
                      </div>
                    </div>

                    {messageError && (
                      <div className="rounded-lg border border-rose-400/20 bg-rose-400/10 px-3 py-2 text-xs text-rose-300">
                        {
                          messageError
                        }
                      </div>
                    )}

                    <textarea
                      rows={4}
                      value={
                        messageText
                      }
                      onChange={(
                        event,
                      ) => {
                        setMessageText(
                          event.target.value,
                        );

                        if (
                          messageError
                        ) {
                          setMessageError(
                            '',
                          );
                        }
                      }}
                      maxLength={2000}
                      disabled={
                        isMessaging
                      }
                      placeholder="Write your message to this Client..."
                      className="w-full resize-none rounded-xl border border-white/10 bg-navy-800 px-3 py-3 text-sm text-cream placeholder:text-ink/30 outline-none focus:border-gold-400 disabled:opacity-60"
                    />

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[10px] text-ink/40">
                        {
                          messageText.length
                        }
                        /2000
                      </span>

                      <div className="flex gap-3">
                        <GhostButton
                          type="button"
                          disabled={
                            isMessaging
                          }
                          onClick={() => {
                            setIsMessageComposerOpen(
                              false,
                            );
                            setMessageText('');
                            setMessageError('');
                          }}
                        >
                          Cancel
                        </GhostButton>

                        <GoldButton
                          type="button"
                          disabled={
                            isMessaging ||
                            !messageText.trim()
                          }
                          onClick={
                            handleSendMessage
                          }
                        >
                          {isMessaging
                            ? 'Sending...'
                            : 'Send Message'}
                        </GoldButton>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex overflow-x-auto border-b border-white/10">
          {[
            {
              id: 'profile',
              label: 'Client Overview',
            },
            {
              id: 'transactions',
              label: 'Transactions & Activity',
            },
            {
              id: 'communication',
              label: 'Communication & Support',
            },
          ].map(
            (tab) => (
              <button
                key={
                  tab.id
                }
                onClick={() =>
                  setActiveTab(
                    tab.id as
                      | 'profile'
                      | 'transactions'
                      | 'communication',
                  )
                }
                className={`border-b-2 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab ===
                  tab.id
                    ? 'border-gold-400 text-gold-400'
                    : 'border-transparent text-ink/60 hover:border-white/20 hover:text-cream'
                }`}
              >
                {
                  tab.label
                }
              </button>
            ),
          )}
        </div>

        {/* Profile Tab */}
        {activeTab ===
          'profile' && (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              {/* Real Profile Information */}
              <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                <h3 className="mb-4 flex items-center gap-2 font-heading text-sm font-semibold text-cream">
                  <User className="h-4 w-4 text-ink/60" />
                  Profile Information
                </h3>

                <div className="space-y-3 text-sm">
                  <div>
                    <span className="mb-1 block text-xs text-ink/60">
                      Client Since
                    </span>

                    <span className="text-cream">
                      {
                        clientSince
                      }
                    </span>
                  </div>

                  <div>
                    <span className="mb-1 block text-xs text-ink/60">
                      Primary Interest
                    </span>

                    <span className="text-cream">
                      {
                        clientType
                      }
                    </span>
                  </div>

                  <div>
                    <span className="mb-1 block text-xs text-ink/60">
                      Lead Source
                    </span>

                    <span className="text-cream">
                      {
                        latestSource
                      }
                    </span>
                  </div>

                  <div>
                    <span className="mb-1 block text-xs text-ink/60">
                      Latest Contact
                    </span>

                    <span className="flex items-center gap-1 text-cream">
                      <Clock className="h-3.5 w-3.5 text-ink/40" />

                      {
                        lastContact
                      }
                    </span>
                  </div>
                </div>
              </div>

              {/* Real inquiry/property summary */}
              <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                <h3 className="mb-4 flex items-center gap-2 font-heading text-sm font-semibold text-cream">
                  <Heart className="h-4 w-4 text-ink/60" />
                  Relationship Summary
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-sm text-ink/60">
                      Inquiries
                    </span>

                    <span className="font-semibold text-cream">
                      {
                        inquiryCount
                      }
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-sm text-ink/60">
                      Properties Interested In
                    </span>

                    <span className="font-semibold text-cream">
                      {
                        propertyCount
                      }
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-ink/60">
                      Relationship
                    </span>

                    <span
                      className={
                        hasActiveInquiry
                          ? 'font-semibold text-emerald-400'
                          : 'font-semibold text-blue-400'
                      }
                    >
                      {
                        relationshipStatus
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Latest property from the real backend */}
              <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                <h3 className="mb-4 flex items-center gap-2 font-heading text-sm font-semibold text-cream">
                  <Building2 className="h-4 w-4 text-ink/60" />
                  Latest Property
                </h3>

                {latestProperty ? (
                  <div className="space-y-3 text-sm">
                    <div className="border-b border-white/5 pb-3">
                      <span className="mb-1 block text-cream">
                        {
                          String(
                            latestProperty.title ||
                              'Property information unavailable',
                          )
                        }
                      </span>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink/60">
                        <span>
                          {
                            String(
                              latestProperty.propertyType ||
                                'Property',
                            )
                          }
                        </span>

                        <span>
                          {
                            String(
                              latestProperty.transactionType ||
                                'Transaction',
                            )
                          }
                        </span>

                        <span>
                          {
                            String(
                              latestProperty.city ||
                                latestProperty.state ||
                                'Location unavailable',
                            )
                          }
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-ink/60">
                        Inquiry Status
                      </span>

                      <StatusBadge
                        status={
                          clientStatus
                        }
                      />
                    </div>

                    {latestProperty.price !==
                      undefined &&
                      latestProperty.price !==
                        null && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-ink/60">
                            Property Price
                          </span>

                          <span className="font-semibold text-gold-400">
                            {formatCurrency(
                              Number(
                                latestProperty.price,
                              ),
                              String(
                                latestProperty.currency ||
                                  'NGN',
                              ),
                            )}
                          </span>
                        </div>
                      )}

                    <GhostButton
                      disabled
                      className="w-full justify-center py-1 text-xs"
                    >
                      View Property
                    </GhostButton>
                  </div>
                ) : (
                  <div className="rounded-lg border border-white/5 bg-navy-800/50 p-4 text-sm text-ink/50">
                    No property is
                    currently
                    associated with
                    this Client record.
                  </div>
                )}
              </div>

              {/* CRM fields that are not available yet */}
              <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                <h3 className="mb-3 flex items-center gap-2 font-heading text-sm font-semibold text-cream">
                  <FileText className="h-4 w-4 text-ink/60" />
                  CRM Notes
                </h3>

                <p className="rounded-lg border border-white/5 bg-navy-800 p-3 text-xs leading-relaxed text-ink/60">
                  Internal CRM notes,
                  birthdays, addresses,
                  saved properties, and
                  portfolio value are not
                  stored by the current
                  Client backend.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Transactions & Activity Tab */}
        {activeTab ===
          'transactions' && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                <div className="mb-2 text-xs text-ink/60">
                  Inquiries
                </div>

                <div className="text-2xl font-bold text-cream">
                  {
                    inquiryCount
                  }
                </div>
              </div>

              <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                <div className="mb-2 text-xs text-ink/60">
                  Properties
                </div>

                <div className="text-2xl font-bold text-cream">
                  {
                    propertyCount
                  }
                </div>
              </div>

              <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                <div className="mb-2 text-xs text-ink/60">
                  Current Status
                </div>

                <div className="text-lg font-bold text-gold-400">
                  {
                    clientStatus
                  }
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/5 bg-navy-900/50 p-6">
              <ActivityTimeline
                title="Client Activity"
                items={
                  interactionHistory
                }
              />
            </div>

            <div className="rounded-xl border border-gold-400/10 bg-gold-400/5 p-4">
              <div className="flex items-start gap-3">
                <Briefcase className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />

                <div>
                  <div className="text-sm font-semibold text-cream">
                    Transaction history
                  </div>

                  <p className="mt-1 text-xs leading-relaxed text-ink/60">
                    No completed
                    transaction records
                    are currently exposed
                    by the Agent Client
                    endpoint, so this
                    section only shows the
                    real inquiry and
                    relationship activity
                    currently available.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Communication & Support Tab */}
        {activeTab ===
          'communication' && (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                <h3 className="mb-3 flex items-center gap-2 font-heading text-sm font-semibold text-cream">
                  <Mail className="h-4 w-4 text-ink/60" />
                  Contact Information
                </h3>

                <div className="space-y-3 text-sm">
                  <div>
                    <span className="mb-1 block text-xs text-ink/60">
                      Email
                    </span>

                    <span className="text-cream">
                      {
                        clientEmail
                      }
                    </span>
                  </div>

                  <div>
                    <span className="mb-1 block text-xs text-ink/60">
                      Phone
                    </span>

                    <span className="text-cream">
                      {
                        clientPhone
                      }
                    </span>
                  </div>

                  <div>
                    <span className="mb-1 block text-xs text-ink/60">
                      Lead Source
                    </span>

                    <span className="text-cream">
                      {
                        latestSource
                      }
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                <h3 className="mb-3 flex items-center gap-2 font-heading text-sm font-semibold text-cream">
                  <MapPin className="h-4 w-4 text-ink/60" />
                  Relationship Status
                </h3>

                <div className="space-y-3 text-sm">
                  <div>
                    <span className="mb-1 block text-xs text-ink/60">
                      Current Relationship
                    </span>

                    <StatusBadge
                      status={
                        relationshipStatus
                      }
                    />
                  </div>

                  <div>
                    <span className="mb-1 block text-xs text-ink/60">
                      Last Contact
                    </span>

                    <span className="flex items-center gap-1 text-cream">
                      <Clock className="h-3.5 w-3.5 text-ink/40" />

                      {
                        lastContact
                      }
                    </span>
                  </div>

                  <div>
                    <span className="mb-1 block text-xs text-ink/60">
                      Active Inquiry
                    </span>

                    <span
                      className={
                        hasActiveInquiry
                          ? 'font-semibold text-emerald-400'
                          : 'font-semibold text-blue-400'
                      }
                    >
                      {hasActiveInquiry
                        ? 'Yes'
                        : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/5 bg-navy-900/50 p-6">
              <ActivityTimeline
                title="Communication & Support History"
                items={
                  communicationHistory
                }
              />
            </div>

            <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
              <div className="flex items-start gap-3">
                <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />

                <div>
                  <div className="text-sm font-semibold text-cream">
                    Messaging
                  </div>

                  <p className="mt-1 text-xs leading-relaxed text-ink/60">
                    Direct Client messaging is now
                    available through Luxora's real
                    conversation system. Support-ticket
                    history is not yet exposed by the
                    current backend. The communication
                    information above is derived from
                    the real inquiry relationship.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

// Format a backend timestamp for human-readable dashboard display.
function formatDateTime(
  dateString?: string,
) {
  if (!dateString) {
    return 'Date unavailable';
  }

  const date =
    new Date(dateString);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return 'Date unavailable';
  }

  return date.toLocaleString(
    'en-NG',
    {
      dateStyle: 'medium',
      timeStyle: 'short',
    },
  );
}

// Format a real Property price using its backend currency when available.
function formatCurrency(
  value: number,
  currency = 'NGN',
) {
  return new Intl.NumberFormat(
    'en-NG',
    {
      style: 'currency',
      currency:
        currency || 'NGN',
      maximumFractionDigits: 0,
    },
  ).format(value);
}
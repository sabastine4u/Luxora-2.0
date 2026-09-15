import { useEffect, useMemo, useState } from 'react';
import {
  User,
  Phone,
  Mail,
  Calendar,
  Clock,
  Target,
  CheckCircle2,
  FileText,
  Activity,
  MessageSquare,
  MapPin,
  Building2,
  RefreshCw,
} from 'lucide-react';

import { Modal } from '../../../../components/ui/Modal';
import {
  GoldButton,
  GhostButton,
} from '../../../../components/ui/ui';
import { StatusBadge } from '../../../ManagementDashboard/components/shared/StatusBadge';
import { ActivityTimeline } from '../../../../components/dashboard/shared/timelines/ActivityTimeline';

import { agentApi } from '../../../../api/agent.api';

// Define the Lead activity shape returned by the backend.
interface LeadActivity {
  action: string;
  description?: string | null;
  performedBy?: string | null;
  createdAt: string;
}

// Define the Lead internal note shape returned by the backend.
interface LeadNote {
  _id?: string;
  text: string;
  addedBy?: string | null;
  addedAt: string;
}

// Define the properties accepted by the Lead detail modal.
interface LeadDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Record<string, unknown> | null;

  // Allow the parent page to receive the updated Lead after a successful action.
  onLeadUpdated?: (
    updatedLead: Record<string, unknown>,
  ) => void;
}

// Keep the available Lead statuses aligned with the backend Inquiry model.
const LEAD_STATUSES = [
  'New',
  'Contacted',
  'Viewing Scheduled',
  'Negotiating',
  'Closed',
  'Lost',
];

export function LeadDetailModal({
  isOpen,
  onClose,
  lead,
  onLeadUpdated,
}: LeadDetailModalProps) {
  const [activeTab, setActiveTab] = useState<
    'profile' | 'timeline' | 'notes'
  >('profile');

  // Keep a local copy so the modal immediately reflects backend changes.
  const [currentLead, setCurrentLead] =
    useState<Record<string, unknown> | null>(lead);

  // Store the status selected by the Agent.
  const [selectedStatus, setSelectedStatus] =
    useState('New');

  // Store optional context for a status change.
  const [statusNote, setStatusNote] = useState('');

  // Store the new internal note being entered.
  const [newNote, setNewNote] = useState('');

  // Store the requested viewing date.
  const [scheduledDate, setScheduledDate] =
    useState('');

  // Store the requested viewing time.
  const [scheduledTime, setScheduledTime] =
    useState('');

  // Store optional context for the viewing appointment.
  const [viewingNote, setViewingNote] =
    useState('');

  // Track whether an API operation is currently running.
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  // Store an API error for display inside the modal.
  const [errorMessage, setErrorMessage] =
    useState('');

  // Synchronize modal state whenever the selected Lead changes.
  useEffect(() => {
    setCurrentLead(lead);

    if (lead) {
      // Load the current real backend status.
      setSelectedStatus(
        String(lead.status || 'New'),
      );

      // Reset the temporary status-note input.
      setStatusNote('');

      // Load an existing viewing date if one exists.
      setScheduledDate(
        lead.scheduledDate
          ? formatDateInput(
              String(lead.scheduledDate),
            )
          : '',
      );

      // Load an existing viewing time if one exists.
      setScheduledTime(
        String(lead.scheduledTime || ''),
      );

      // Reset the temporary viewing note input.
      setViewingNote('');

      // Reset the temporary new-note input.
      setNewNote('');

      // Clear any previous API error.
      setErrorMessage('');

      // Always open a newly selected Lead on the profile tab.
      setActiveTab('profile');
    }
  }, [lead]);

  /*
   * IMPORTANT:
   * Everything below is calculated before the conditional return.
   * This keeps the Hook order identical on every render.
   */

  // Read the real backend activity history safely.
  const activities = (
    Array.isArray(currentLead?.activities)
      ? currentLead.activities
      : []
  ) as LeadActivity[];

  // Read the real backend internal notes safely.
  const notes = (
    Array.isArray(currentLead?.notes)
      ? currentLead.notes
      : []
  ) as LeadNote[];

  // Read the populated Property object preserved by the parent Leads page.
const property = (
  currentLead?.propertyData &&
  typeof currentLead.propertyData === 'object'
    ? currentLead.propertyData
    : currentLead?.property &&
        typeof currentLead.property === 'object'
      ? currentLead.property
      : null
) as Record<string, unknown> | null;

// Read the populated Agency object preserved by the parent Leads page.
const agency = (
  currentLead?.agencyData &&
  typeof currentLead.agencyData === 'object'
    ? currentLead.agencyData
    : currentLead?.agency &&
        typeof currentLead.agency === 'object'
      ? currentLead.agency
      : null
) as Record<string, unknown> | null;

// Read the populated Owner object preserved by the parent Leads page.
const owner = (
  currentLead?.ownerData &&
  typeof currentLead.ownerData === 'object'
    ? currentLead.ownerData
    : currentLead?.owner &&
        typeof currentLead.owner === 'object'
      ? currentLead.owner
      : null
) as Record<string, unknown> | null;

  // Convert real backend activities into the existing timeline component format.
  const communicationTimeline =
    useMemo(() => {
      return [...activities]
        .sort(
          (a, b) =>
            new Date(
              b.createdAt,
            ).getTime() -
            new Date(
              a.createdAt,
            ).getTime(),
        )
        .map((activity) => {
          const action =
            activity.action ||
            'Activity';

          let Icon = Activity;
          let color =
            'text-blue-400';

          if (
            action === 'Contacted' ||
            action === 'Created'
          ) {
            Icon = Phone;
            color =
              'text-blue-400';
          } else if (
            action === 'Note Added'
          ) {
            Icon = FileText;
            color =
              'text-gold-400';
          } else if (
            action ===
              'Viewing Scheduled' ||
            action ===
              'Viewing Rescheduled'
          ) {
            Icon = Calendar;
            color =
              'text-emerald-400';
          } else if (
            action ===
            'Viewing Cancelled'
          ) {
            Icon = Clock;
            color =
              'text-rose-400';
          } else if (
            action ===
            'Status Changed'
          ) {
            Icon = RefreshCw;
            color =
              'text-purple-400';
          }

          return {
            title: action,
            time: formatRelativeOrDate(
              activity.createdAt,
            ),
            desc:
              activity.description ||
              'Lead activity recorded.',
            icon: Icon,
            color,
          };
        });
    }, [activities]);

  // Build the real property location from the populated Property fields.
  const leadLocation = [
    property?.area,
    property?.city,
    property?.state,
  ]
    .filter(Boolean)
    .join(', ');

  // Determine whether this Lead already has a scheduled viewing.
  const hasViewingScheduled =
    Boolean(
      currentLead?.scheduledDate,
    ) ||
    Boolean(
      currentLead?.scheduledTime,
    );

  // Update the Lead status using the tested backend endpoint.
  const handleUpdateStatus = async () => {
    if (!currentLead) {
      return;
    }

    try {
      // Start the request state and clear stale errors.
      setIsSubmitting(true);
      setErrorMessage('');

      // Send the real Lead status update to the backend.
      const response =
        await agentApi.updateLeadStatus(
          String(
            currentLead._id ||
              currentLead.id,
          ),
          selectedStatus,
          statusNote.trim(),
        );

      // The shared HTTP client returns the response payload directly.
      const updatedInquiry =
        response?.inquiry;

      if (updatedInquiry) {
        // Refresh the modal with the updated Lead returned by the backend.
        setCurrentLead(
          updatedInquiry,
        );

        // Notify the parent Leads page so its data can stay synchronized.
        onLeadUpdated?.(
          updatedInquiry,
        );
      }

      // Clear the temporary status note after success.
      setStatusNote('');
    } catch (error) {
      // Keep the modal visible while reporting the failed API request.
      console.error(
        'Failed to update Lead status:',
        error,
      );

      setErrorMessage(
        'Unable to update the Lead status. Please try again.',
      );
    } finally {
      // End the request state.
      setIsSubmitting(false);
    }
  };

  // Add an internal note using the tested backend endpoint.
  const handleAddNote = async () => {
    if (
      !currentLead ||
      !newNote.trim()
    ) {
      return;
    }

    try {
      // Start the request state and clear stale errors.
      setIsSubmitting(true);
      setErrorMessage('');

      // Save the note to the authenticated Agent's Lead.
      const response =
        await agentApi.addLeadNote(
          String(
            currentLead._id ||
              currentLead.id,
          ),
          newNote.trim(),
        );

      // Read the updated Lead returned by the backend.
      const updatedInquiry =
        response?.inquiry;

      if (updatedInquiry) {
        // Refresh the modal with the saved note included.
        setCurrentLead(
          updatedInquiry,
        );

        // Notify the parent Leads page about the updated Lead.
        onLeadUpdated?.(
          updatedInquiry,
        );
      }

      // Clear the note input after success.
      setNewNote('');
    } catch (error) {
      // Keep the modal open and report the real API failure.
      console.error(
        'Failed to add Lead note:',
        error,
      );

      setErrorMessage(
        'Unable to add the Lead note. Please try again.',
      );
    } finally {
      // End the request state.
      setIsSubmitting(false);
    }
  };

  // Schedule or reschedule the Lead's viewing.
  const handleScheduleViewing =
    async () => {
      if (!currentLead) {
        return;
      }

      // Validate the required viewing fields before making the request.
      if (
        !scheduledDate ||
        !scheduledTime
      ) {
        setErrorMessage(
          'Select both a viewing date and time.',
        );
        return;
      }

      try {
        // Start the request state and clear stale errors.
        setIsSubmitting(true);
        setErrorMessage('');

        // Save the viewing schedule using the backend endpoint.
        const response =
          await agentApi.scheduleLeadViewing(
            String(
              currentLead._id ||
                currentLead.id,
            ),
            scheduledDate,
            scheduledTime,
            viewingNote.trim(),
          );

        // Read the updated Lead from the response.
        const updatedInquiry =
          response?.inquiry;

        if (updatedInquiry) {
          // Refresh the modal with the new viewing details.
          setCurrentLead(
            updatedInquiry,
          );

          // Notify the parent Leads page.
          onLeadUpdated?.(
            updatedInquiry,
          );
        }

        // Clear the temporary viewing note after success.
        setViewingNote('');
      } catch (error) {
        // Keep the modal visible and show the API failure.
        console.error(
          'Failed to schedule Lead viewing:',
          error,
        );

        setErrorMessage(
          'Unable to schedule the viewing. Please try again.',
        );
      } finally {
        // End the request state.
        setIsSubmitting(false);
      }
    };

  /*
   * Do not move this conditional above the Hooks.
   * currentLead can be null on the first render.
   */
  if (!currentLead) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Lead Profile"
      size="2xl"
      actionButton={
        <GoldButton
          onClick={
            handleUpdateStatus
          }
          disabled={isSubmitting}
        >
          {isSubmitting
            ? 'Updating...'
            : 'Update Status'}
        </GoldButton>
      }
    >
      <div className="space-y-8 pb-4">
        {/* Header Profile Section */}
        <div className="flex flex-col md:flex-row gap-6 items-start border-b border-white/5 pb-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gold-gradient text-4xl font-bold text-navy-900 shrink-0">
            {String(
              currentLead.name ||
                'L',
            )
              .charAt(0)
              .toUpperCase()}
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-cream flex items-center gap-2">
                {String(
                  currentLead.name ||
                    'Unknown Lead',
                )}
              </h2>

              <div className="text-ink/60 flex flex-wrap items-center gap-4 mt-2">
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  {String(
                    currentLead.email ||
                      'N/A',
                  )}
                </span>

                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" />
                  {String(
                    currentLead.phone ||
                      'N/A',
                  )}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <StatusBadge
                status={String(
                  currentLead.status ||
                    'New',
                )}
              />

              <span className="inline-flex items-center rounded-full border border-white/10 bg-navy-800/50 px-2.5 py-0.5 text-xs font-semibold text-ink/70">
                Source:{' '}
                {String(
                  currentLead.source ||
                    'Unknown',
                )}
              </span>
            </div>

            <div className="flex gap-4 pt-2">
              {/* Messaging remains disabled until the messaging backend exists. */}
              <GhostButton
                disabled
                className="flex items-center gap-2 px-3 py-1.5 text-sm"
                title="Messaging workflow is not implemented yet"
              >
                <MessageSquare className="h-4 w-4" />
                Message
              </GhostButton>

              <GhostButton
                onClick={() => {
                  setActiveTab(
                    'profile',
                  );

                  // Move the existing page to the real viewing section.
                  document
                    .getElementById(
                      'lead-viewing-section',
                    )
                    ?.scrollIntoView({
                      behavior:
                        'smooth',
                      block:
                        'center',
                    });
                }}
                className="flex items-center gap-2 px-3 py-1.5 text-sm"
              >
                <Calendar className="h-4 w-4" />
                Book Meeting
              </GhostButton>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
            {errorMessage}
          </div>
        )}

        {/* Navigation */}
        <div className="flex border-b border-white/10">
          {[
            {
              id: 'profile',
              label:
                'Lead Profile & Tasks',
            },
            {
              id: 'timeline',
              label:
                'Communication Timeline',
            },
            {
              id: 'notes',
              label:
                'Internal Notes',
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() =>
                setActiveTab(
                  tab.id as
                    | 'profile'
                    | 'timeline'
                    | 'notes',
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
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab ===
          'profile' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
              {/* Real Lead / Property Information */}
              <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                <h3 className="font-heading text-sm font-semibold text-cream mb-4 flex items-center gap-2">
                  <Target className="h-4 w-4 text-ink/60" />
                  Lead & Property Information
                </h3>

                <div className="space-y-3 text-sm">
                  <div>
                    <span className="block text-ink/60 text-xs mb-1">
                      Message
                    </span>

                    <span className="text-cream leading-relaxed">
                      {String(
                        currentLead.message ||
                          'No message provided.',
                      )}
                    </span>
                  </div>

                  <div>
                    <span className="block text-ink/60 text-xs mb-1">
                      Interested In
                    </span>

                    <span className="text-cream flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-gold-400" />

                      {String(
  property?.title ||
    currentLead.property ||
    'Property unavailable',
)}
                    </span>
                  </div>

                  <div>
                    <span className="block text-ink/60 text-xs mb-1">
                      Location
                    </span>

                    <span className="text-cream flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gold-400" />

                      {leadLocation ||
                        'Location unavailable'}
                    </span>
                  </div>

                  <div>
                    <span className="block text-ink/60 text-xs mb-1">
                      Property Transaction
                    </span>

                    <span className="text-cream capitalize">
                      {String(
                        property?.transactionType ||
                          'Not specified',
                      )}
                    </span>
                  </div>

                  <div>
                    <span className="block text-ink/60 text-xs mb-1">
                      Lead Created
                    </span>

                    <span className="text-cream">
                      {formatDateTime(
                        String(
                          currentLead.createdAt ||
                            '',
                        ),
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Real Lead Status Management */}
              <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                <h3 className="font-heading text-sm font-semibold text-cream mb-4 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-ink/60" />
                  Lead Status
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-ink/60 mb-2">
                      Current Status
                    </label>

                    <select
                      value={
                        selectedStatus
                      }
                      onChange={(
                        event,
                      ) =>
                        setSelectedStatus(
                          event.target
                            .value,
                        )
                      }
                      className="w-full rounded-lg border border-white/10 bg-navy-800 px-3 py-2 text-sm text-cream outline-none focus:border-gold-400"
                    >
                      {LEAD_STATUSES.map(
                        (
                          status,
                        ) => (
                          <option
                            key={
                              status
                            }
                            value={
                              status
                            }
                            className="bg-navy-900"
                          >
                            {
                              status
                            }
                          </option>
                        ),
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-ink/60 mb-2">
                      Status Note
                    </label>

                    <textarea
                      value={
                        statusNote
                      }
                      onChange={(
                        event,
                      ) =>
                        setStatusNote(
                          event.target
                            .value,
                        )
                      }
                      rows={3}
                      placeholder="Optional context for this status change..."
                      className="w-full rounded-lg border border-white/10 bg-navy-800 px-3 py-2 text-sm text-cream placeholder:text-ink/30 outline-none focus:border-gold-400 resize-none"
                    />
                  </div>

                  <GhostButton
                    onClick={
                      handleUpdateStatus
                    }
                    disabled={
                      isSubmitting
                    }
                    className="w-full"
                  >
                    {isSubmitting
                      ? 'Saving...'
                      : 'Save Status'}
                  </GhostButton>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Real Viewing Scheduler */}
              <div
                id="lead-viewing-section"
                className="rounded-xl border border-white/5 bg-navy-900/50 p-4"
              >
                <h3 className="font-heading text-sm font-semibold text-cream mb-4 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-ink/60" />
                  Viewing
                </h3>

                {hasViewingScheduled && (
                  <div className="mb-4 rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-3">
                    <div className="text-xs text-emerald-400 mb-1">
                      Current Appointment
                    </div>

                    <div className="text-sm text-cream">
                      {formatDateTime(
                        String(
                          currentLead.scheduledDate ||
                            '',
                        ),
                      )}
                    </div>

                    <div className="text-sm text-cream mt-1 flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-emerald-400" />

                      {String(
                        currentLead.scheduledTime ||
                          '',
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-ink/60 mb-2">
                      Viewing Date
                    </label>

                    <input
                      type="date"
                      value={
                        scheduledDate
                      }
                      onChange={(
                        event,
                      ) =>
                        setScheduledDate(
                          event.target
                            .value,
                        )
                      }
                      className="w-full rounded-lg border border-white/10 bg-navy-800 px-3 py-2 text-sm text-cream outline-none focus:border-gold-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-ink/60 mb-2">
                      Viewing Time
                    </label>

                    <input
                      type="text"
                      value={
                        scheduledTime
                      }
                      onChange={(
                        event,
                      ) =>
                        setScheduledTime(
                          event.target
                            .value,
                        )
                      }
                      placeholder="e.g. 4:00 PM"
                      className="w-full rounded-lg border border-white/10 bg-navy-800 px-3 py-2 text-sm text-cream placeholder:text-ink/30 outline-none focus:border-gold-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-ink/60 mb-2">
                      Viewing Note
                    </label>

                    <textarea
                      value={
                        viewingNote
                      }
                      onChange={(
                        event,
                      ) =>
                        setViewingNote(
                          event.target
                            .value,
                        )
                      }
                      rows={2}
                      placeholder="Optional appointment note..."
                      className="w-full rounded-lg border border-white/10 bg-navy-800 px-3 py-2 text-sm text-cream placeholder:text-ink/30 outline-none focus:border-gold-400 resize-none"
                    />
                  </div>

                  <GoldButton
                    onClick={
                      handleScheduleViewing
                    }
                    disabled={
                      isSubmitting
                    }
                    className="w-full"
                  >
                    {isSubmitting
                      ? 'Saving...'
                      : hasViewingScheduled
                        ? 'Reschedule Viewing'
                        : 'Schedule Viewing'}
                  </GoldButton>
                </div>
              </div>

              {/* Real Related Entities */}
              <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                <h3 className="font-heading text-sm font-semibold text-cream mb-4 flex items-center gap-2">
                  <User className="h-4 w-4 text-ink/60" />
                  Related Entities
                </h3>

                <div className="space-y-3 text-sm">
                  <div>
                    <span className="block text-ink/60 text-xs mb-1">
                      Assigned Agent
                    </span>

                    <span className="text-cream">
                      Current Agent
                    </span>
                  </div>

                  <div>
                    <span className="block text-ink/60 text-xs mb-1">
                      Agency
                    </span>

                    <span className="text-cream">
                      {String(
                        agency?.name ||
                          'Agency unavailable',
                      )}
                    </span>
                  </div>

                  <div>
                    <span className="block text-ink/60 text-xs mb-1">
                      Property Owner
                    </span>

                    <span className="text-cream">
                      {String(
                        owner?.fullName ||
                          'Owner unavailable',
                      )}
                    </span>

                    {owner?.email && (
                      <span className="block text-xs text-ink/50 mt-1">
                        {String(
                          owner.email,
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Real Backend Activity Timeline */}
        {activeTab ===
          'timeline' && (
          <div className="rounded-xl border border-white/5 bg-navy-900/50 p-6">
            {communicationTimeline.length >
            0 ? (
              <ActivityTimeline
                title="Communication History"
                items={
                  communicationTimeline
                }
              />
            ) : (
              <div className="text-sm text-ink/50 text-center py-10">
                No Lead activity has been recorded yet.
              </div>
            )}
          </div>
        )}

        {/* Real Backend Notes */}
        {activeTab ===
          'notes' && (
          <div className="space-y-4">
            <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
              <h3 className="font-heading text-sm font-semibold text-cream mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-ink/60" />
                Lead Notes
              </h3>

              <div className="space-y-3">
                {notes.length > 0 ? (
                  notes.map(
                    (note) => (
                      <div
                        key={
                          note._id ||
                          `${note.addedAt}-${note.text}`
                        }
                        className="p-4 bg-navy-800 rounded-lg border border-white/5"
                      >
                        <p className="text-sm text-ink/80 leading-relaxed">
                          {
                            note.text
                          }
                        </p>

                        <div className="text-[10px] text-ink/40 mt-3">
                          Added{' '}
                          {formatDateTime(
                            note.addedAt,
                          )}
                        </div>
                      </div>
                    ),
                  )
                ) : (
                  <div className="p-4 bg-navy-800 rounded-lg border border-white/5 min-h-[100px] flex items-center justify-center">
                    <span className="text-sm text-ink/50">
                      No internal notes yet.
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
              <label className="block text-xs text-ink/60 mb-2">
                Add Internal Note
              </label>

              <textarea
                value={newNote}
                onChange={(
                  event,
                ) =>
                  setNewNote(
                    event.target
                      .value,
                  )
                }
                rows={4}
                placeholder="Enter a private note about this Lead..."
                className="w-full rounded-lg border border-white/10 bg-navy-800 px-3 py-3 text-sm text-cream placeholder:text-ink/30 outline-none focus:border-gold-400 resize-none"
              />

              <div className="flex justify-end mt-3">
                <GoldButton
                  onClick={
                    handleAddNote
                  }
                  disabled={
                    isSubmitting ||
                    !newNote.trim()
                  }
                >
                  {isSubmitting
                    ? 'Saving...'
                    : 'Add Note'}
                </GoldButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

// Format an ISO backend timestamp for dashboard display.
function formatDateTime(
  dateString?: string,
) {
  if (!dateString) {
    return 'Date unavailable';
  }

  const date = new Date(
    dateString,
  );

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

// Display activity timestamps consistently with the rest of the dashboard.
function formatRelativeOrDate(
  dateString?: string,
) {
  return formatDateTime(
    dateString,
  );
}

// Convert a backend date into the yyyy-mm-dd format used by an HTML date input.
function formatDateInput(
  dateString: string,
) {
  const date = new Date(
    dateString,
  );

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return '';
  }

  return date
    .toISOString()
    .slice(0, 10);
}
import { useEffect, useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  CheckCircle2,
  FileText,
  Briefcase,
  Activity,
  AlertCircle,
} from 'lucide-react';
import { Modal } from '../../../../components/ui/Modal';
import { GoldButton, GhostButton } from '../../../../components/ui/ui';
import { StatusBadge } from '../../../ManagementDashboard/components/shared/StatusBadge';
import { ActivityTimeline } from '../../../../components/dashboard/shared/timelines/ActivityTimeline';
import { agentApi } from '../../../../api/agent.api';
import { useToast } from '../../../../contexts/ToastContext';

interface AppointmentNote {
  text: string;
  addedBy?: string;
  addedAt?: string;
}

interface AppointmentActivity {
  action: string;
  description?: string;
  performedBy?: string;
  createdAt?: string;
}

interface AppointmentRecord {
  id: string;
  inquiryId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  propertyId: string | null;
  title: string;
  propertyType: string;
  transactionType: string;
  scheduledDate: string;
  scheduledTime: string;
  date: string;
  time: string;
  location: string;
  status: string;
  appointmentStatus: 'Scheduled' | 'Completed' | 'Cancelled';
  priority: string;
  source: string;
  message: string;
  notes: AppointmentNote[];
  activities: AppointmentActivity[];
  createdAt: string;
  updatedAt: string;
}

interface AppointmentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: AppointmentRecord | null;
  onUpdated?: (
    updates: Partial<AppointmentRecord>,
  ) => void;
}

export function AppointmentDetailModal({
  isOpen,
  onClose,
  appointment,
  onUpdated,
}: AppointmentDetailModalProps) {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'notes' | 'history'
  >('overview');

  const [meetingNotes, setMeetingNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  const [rescheduleOpen, setRescheduleOpen] =
    useState(false);

  const [rescheduleDate, setRescheduleDate] =
    useState('');

  const [rescheduleTime, setRescheduleTime] =
    useState('');

  const [isRescheduling, setIsRescheduling] =
    useState(false);

  const [appointmentStatus, setAppointmentStatus] =
    useState<
      'Scheduled' | 'Completed' | 'Cancelled'
    >('Scheduled');

  const [isUpdatingStatus, setIsUpdatingStatus] =
    useState(false);

  /*
   * Keep all Hooks above the conditional return.
   */
  useEffect(() => {
    if (!appointment) {
      return;
    }

    const latestNote =
      appointment.notes?.length > 0
        ? appointment.notes[
            appointment.notes.length - 1
          ]?.text
        : '';

    setMeetingNotes(
      latestNote || appointment.message || '',
    );

    setRescheduleDate(
      appointment.scheduledDate
        ? appointment.scheduledDate.slice(0, 10)
        : '',
    );

    setRescheduleTime(
      appointment.scheduledTime || '',
    );

    setAppointmentStatus(
      appointment.appointmentStatus || 'Scheduled',
    );
  }, [appointment]);

  /*
   * Safe because this happens after all Hooks.
   */
  if (!appointment) {
    return null;
  }

  const hasNotes =
    appointment.notes &&
    appointment.notes.length > 0;

  const hasActivities =
    appointment.activities &&
    appointment.activities.length > 0;

  /*
   * Build the real appointment timeline directly.
   *
   * We do not need useMemo here because this list is small
   * and removing the memo avoids unnecessary Hook complexity.
   */
  const scheduleTimeline = hasActivities
    ? appointment.activities.map(
        (activity, index) => ({
          title:
            activity.action || 'Activity',

          time: activity.createdAt
            ? new Date(
                activity.createdAt,
              ).toLocaleString()
            : 'Time unavailable',

          desc:
            activity.description ||
            `Activity recorded by ${
              activity.performedBy ||
              'Agent'
            }`,

          icon:
            activity.action
              ?.toLowerCase()
              .includes('schedule') ||
            activity.action
              ?.toLowerCase()
              .includes('reschedule')
              ? Calendar
              : activity.action
                  ?.toLowerCase()
                  .includes('contact')
              ? User
              : Activity,

          color:
            activity.action
              ?.toLowerCase()
              .includes('schedule') ||
            activity.action
              ?.toLowerCase()
              .includes('reschedule')
              ? 'text-blue-400'
              : activity.action
                  ?.toLowerCase()
                  .includes('note')
              ? 'text-gold-400'
              : 'text-emerald-400',

          key: `${activity.createdAt || 'activity'}-${index}`,
        }),
      )
    : [
        {
          title: 'Appointment Scheduled',
          time: appointment.createdAt
            ? new Date(
                appointment.createdAt,
              ).toLocaleString()
            : 'Time unavailable',

          desc:
            'Scheduled viewing recorded on the client inquiry.',

          icon: Calendar,
          color: 'text-blue-400',
          key: 'appointment-created',
        },
      ];

  /*
   * Keep the existing Follow-up Tasks section.
   *
   * These remain UI-level tasks for now because the
   * current Inquiry backend does not yet have a task entity.
   */
  const followUpTasks = [
    {
      task: 'Send property comparison report',
      status: 'pending',
    },
    {
      task: 'Schedule secondary viewing',
      status: 'pending',
    },
    {
      task: 'Prepare offer documentation',
      status: 'completed',
    },
  ];

  /*
   * There is currently no Deal model connected to this
   * appointment, so do not display a fabricated transaction.
   */
  const relatedDeal = null;

  const handleSaveNotes = async () => {
    if (!appointment.inquiryId) {
      return;
    }

    const trimmedNotes =
      meetingNotes.trim();

    if (!trimmedNotes) {
      showToast({
        type: 'error',
        title: 'Notes Required',
        description:
          'Enter a note before saving.',
      });

      return;
    }

    try {
      setIsSavingNotes(true);

      await agentApi.addLeadNote(
        appointment.inquiryId,
        trimmedNotes,
      );

      showToast({
        type: 'success',
        title: 'Notes Saved',
        description:
          'The appointment note has been added successfully.',
      });
    } catch (error) {
      console.error(
        'Failed to save appointment notes:',
        error,
      );

      showToast({
        type: 'error',
        title: 'Unable to save notes',
        description:
          'The appointment note could not be saved.',
      });
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleReschedule = async () => {
    if (
      !appointment.inquiryId ||
      !rescheduleDate ||
      !rescheduleTime
    ) {
      showToast({
        type: 'error',
        title: 'Schedule Required',
        description:
          'Select both a date and time before rescheduling.',
      });

      return;
    }

    try {
      setIsRescheduling(true);

      await agentApi.scheduleLeadViewing(
        appointment.inquiryId,
        rescheduleDate,
        rescheduleTime,
        'Appointment rescheduled by Agent.',
      );

      setAppointmentStatus('Scheduled');

      onUpdated?.({
        scheduledDate: `${rescheduleDate}T00:00:00.000Z`,
        scheduledTime: rescheduleTime,
        appointmentStatus: 'Scheduled',
      });

      showToast({
        type: 'success',
        title: 'Appointment Rescheduled',
        description:
          'The viewing schedule has been updated successfully.',
      });

      setRescheduleOpen(false);

      onClose();
    } catch (error) {
      console.error(
        'Failed to reschedule appointment:',
        error,
      );

      showToast({
        type: 'error',
        title: 'Unable to reschedule',
        description:
          'The appointment could not be rescheduled.',
      });
    } finally {
      setIsRescheduling(false);
    }
  };

  const handleUpdateAppointmentStatus = async (
    newStatus:
      | 'Completed'
      | 'Cancelled',
  ) => {
    if (
      !appointment.inquiryId ||
      isUpdatingStatus
    ) {
      return;
    }

    if (appointmentStatus === newStatus) {
      return;
    }

    try {
      setIsUpdatingStatus(true);

      await agentApi.updateAppointmentStatus(
        appointment.inquiryId,
        newStatus,
      );

      setAppointmentStatus(newStatus);

      onUpdated?.({
        appointmentStatus: newStatus,
      });

      if (newStatus === 'Completed') {
        showToast({
          type: 'success',
          title: 'Appointment Completed',
          description:
            'The appointment has been marked as completed successfully.',
        });
      } else {
        showToast({
          type: 'success',
          title: 'Appointment Cancelled',
          description:
            'The appointment has been cancelled successfully.',
        });
      }

      onClose();
    } catch (error) {
      console.error(
        `Failed to update appointment to ${newStatus}:`,
        error,
      );

      showToast({
        type: 'error',
        title:
          newStatus === 'Completed'
            ? 'Unable to complete appointment'
            : 'Unable to cancel appointment',
        description:
          'The appointment status could not be updated.',
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleMarkCompleted = () => {
    handleUpdateAppointmentStatus(
      'Completed',
    );
  };

  const handleCancel = () => {
    handleUpdateAppointmentStatus(
      'Cancelled',
    );
  };

  const handleViewClient = () => {
    showToast({
      type: 'info',
      title: 'Client Profile',
      description:
        'Client profile navigation will use the Agent Clients page.',
    });
  };

  const handleViewProperty = () => {
    if (!appointment.propertyId) {
      showToast({
        type: 'error',
        title: 'Property Unavailable',
        description:
          'This appointment is not linked to a property record.',
      });

      return;
    }

    showToast({
      type: 'info',
      title: 'Property Record',
      description:
        'Property navigation will be connected to the property details route.',
    });
  };

  const isCompleted =
    appointmentStatus === 'Completed';

  const isCancelled =
    appointmentStatus === 'Cancelled';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Appointment Details"
      size="2xl"
      actionButton={
        <GoldButton
          onClick={() =>
            setRescheduleOpen((current) => !current)
          }
          disabled={
            isCompleted ||
            isCancelled ||
            isUpdatingStatus
          }
        >
          Reschedule
        </GoldButton>
      }
    >
      <div className="space-y-8 pb-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-6 items-start border-b border-white/5 pb-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-navy-900 border border-white/10 shrink-0">
            <Calendar className="h-10 w-10 text-gold-400" />
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-cream">
                {appointment.title ||
                  'Property Viewing'}
              </h2>

              <div className="text-ink/60 flex flex-wrap items-center gap-4 mt-1">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {appointment.time}
                </span>

                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {appointment.date}
                </span>

                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {appointment.location}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <StatusBadge
                status={
                  appointmentStatus ||
                  'Scheduled'
                }
              />

              <span className="inline-flex items-center rounded-full border border-white/10 bg-navy-800/50 px-2.5 py-0.5 text-xs font-semibold text-ink/70">
                Lead:{' '}
                {appointment.status ||
                  'Unknown'}
              </span>

              <span className="inline-flex items-center rounded-full border border-white/10 bg-navy-800/50 px-2.5 py-0.5 text-xs font-semibold text-ink/70">
                Priority:{' '}
                {appointment.priority ||
                  'Standard'}
              </span>

              <span className="inline-flex items-center rounded-full border border-white/10 bg-navy-800/50 px-2.5 py-0.5 text-xs font-semibold text-ink/70">
                Source: {appointment.source}
              </span>
            </div>

            <div className="flex gap-4 pt-2">
              <GhostButton
                onClick={
                  handleMarkCompleted
                }
                disabled={
                  isUpdatingStatus ||
                  isCompleted ||
                  isCancelled
                }
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-emerald-400 hover:text-emerald-300"
              >
                <CheckCircle2 className="h-4 w-4" />
                {isUpdatingStatus
                  ? 'Updating...'
                  : isCompleted
                  ? 'Completed'
                  : 'Mark Completed'}
              </GhostButton>

              <GhostButton
                onClick={handleCancel}
                disabled={
                  isUpdatingStatus ||
                  isCompleted ||
                  isCancelled
                }
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-400 hover:text-red-300"
              >
                <AlertCircle className="h-4 w-4" />
                {isCancelled
                  ? 'Cancelled'
                  : 'Cancel'}
              </GhostButton>
            </div>
          </div>
        </div>

        {/* Reschedule Panel */}
        {rescheduleOpen && (
          <div className="rounded-xl border border-gold-400/20 bg-gold-400/5 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-4 w-4 text-gold-400" />

              <h3 className="text-sm font-semibold text-cream">
                Reschedule Appointment
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-ink/60 mb-2">
                  New Date
                </label>

                <input
                  type="date"
                  value={rescheduleDate}
                  onChange={(event) =>
                    setRescheduleDate(
                      event.target.value,
                    )
                  }
                  className="w-full rounded-lg border border-white/10 bg-navy-800 px-3 py-2 text-sm text-cream focus:outline-none focus:border-gold-400/50"
                />
              </div>

              <div>
                <label className="block text-xs text-ink/60 mb-2">
                  New Time
                </label>

                <input
                  type="text"
                  value={rescheduleTime}
                  onChange={(event) =>
                    setRescheduleTime(
                      event.target.value,
                    )
                  }
                  placeholder="e.g. 4:00 PM"
                  className="w-full rounded-lg border border-white/10 bg-navy-800 px-3 py-2 text-sm text-cream placeholder:text-ink/40 focus:outline-none focus:border-gold-400/50"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <GhostButton
                onClick={() =>
                  setRescheduleOpen(false)
                }
              >
                Close
              </GhostButton>

              <GoldButton
                onClick={handleReschedule}
                disabled={isRescheduling}
              >
                {isRescheduling
                  ? 'Rescheduling...'
                  : 'Save New Schedule'}
              </GoldButton>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex border-b border-white/10">
          {[
            {
              id: 'overview',
              label: 'Overview & Info',
            },
            {
              id: 'notes',
              label: 'Notes & Tasks',
            },
            {
              id: 'history',
              label: 'Timeline & History',
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() =>
                setActiveTab(
                  tab.id as
                    | 'overview'
                    | 'notes'
                    | 'history',
                )
              }
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-gold-400 text-gold-400'
                  : 'border-transparent text-ink/60 hover:text-cream hover:border-white/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
              {/* Client Information */}
              <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                <h3 className="font-heading text-sm font-semibold text-cream mb-4 flex items-center gap-2">
                  <User className="h-4 w-4 text-ink/60" />
                  Client Information
                </h3>

                <div className="space-y-3 text-sm">
                  <div>
                    <span className="block text-ink/60 text-xs mb-1">
                      Name
                    </span>

                    <span className="text-cream">
                      {appointment.clientName}
                    </span>
                  </div>

                  <div>
                    <span className="block text-ink/60 text-xs mb-1">
                      Email
                    </span>

                    <span className="text-cream">
                      {appointment.clientEmail ||
                        'Not provided'}
                    </span>
                  </div>

                  <div>
                    <span className="block text-ink/60 text-xs mb-1">
                      Phone
                    </span>

                    <span className="text-cream">
                      {appointment.clientPhone ||
                        'Not provided'}
                    </span>
                  </div>

                  <GhostButton
                    onClick={handleViewClient}
                    className="w-full justify-center text-xs py-1 mt-2"
                  >
                    View Client Profile
                  </GhostButton>
                </div>
              </div>

              {/* Related Deal */}
              <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                <h3 className="font-heading text-sm font-semibold text-cream mb-4 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-ink/60" />
                  Related Deal
                </h3>

                {relatedDeal ? (
                  <div className="bg-navy-800 p-3 rounded-lg border border-white/5">
                    {/* Reserved for real Deal data once the Deal module is connected. */}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-white/10 bg-navy-800/40 p-4">
                    <div className="text-sm text-cream mb-1">
                      No deal linked
                    </div>

                    <div className="text-xs text-ink/60">
                      This appointment currently has no
                      associated transaction/deal record.
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              {/* Property Information */}
              <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                <h3 className="font-heading text-sm font-semibold text-cream mb-4 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-ink/60" />
                  Property Information
                </h3>

                <div className="space-y-3 text-sm">
                  <div>
                    <span className="block text-ink/60 text-xs mb-1">
                      Property
                    </span>

                    <span className="text-cream">
                      {appointment.title}
                    </span>
                  </div>

                  <div>
                    <span className="block text-ink/60 text-xs mb-1">
                      Property Type
                    </span>

                    <span className="text-cream">
                      {appointment.propertyType ||
                        'Not provided'}
                    </span>
                  </div>

                  <div>
                    <span className="block text-ink/60 text-xs mb-1">
                      Transaction
                    </span>

                    <span className="text-cream capitalize">
                      {appointment.transactionType ||
                        'Not provided'}
                    </span>
                  </div>

                  <div>
                    <span className="block text-ink/60 text-xs mb-1">
                      Location
                    </span>

                    <span className="text-cream flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-ink/40" />
                      {appointment.location}
                    </span>
                  </div>

                  <GhostButton
                    onClick={handleViewProperty}
                    className="w-full justify-center text-xs py-1 mt-2"
                  >
                    View Property
                  </GhostButton>
                </div>
              </div>

              {/* Appointment Request */}
              <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                <h3 className="font-heading text-sm font-semibold text-cream mb-4 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-ink/60" />
                  Appointment Request
                </h3>

                <p className="text-sm text-ink/80 leading-relaxed">
                  {appointment.message ||
                    'No appointment message was provided.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        {activeTab === 'notes' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4 h-full">
                <h3 className="font-heading text-sm font-semibold text-cream mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-ink/60" />
                  Meeting Notes
                </h3>

                {hasNotes && (
                  <div className="mb-4 space-y-2">
                    {appointment.notes.map(
                      (note, index) => (
                        <div
                          key={`${note.addedAt || 'note'}-${index}`}
                          className="rounded-lg border border-white/5 bg-navy-800/60 p-3"
                        >
                          <p className="text-sm text-ink/80">
                            {note.text}
                          </p>

                          <div className="text-[10px] text-ink/40 mt-2">
                            {note.addedBy ||
                              'Agent'}
                            {note.addedAt
                              ? ` • ${new Date(
                                  note.addedAt,
                                ).toLocaleString()}`
                              : ''}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                )}

                <textarea
                  className="w-full h-[160px] text-sm text-cream bg-navy-800 rounded-lg border border-white/5 p-3 focus:outline-none focus:border-gold-400/50 resize-none"
                  placeholder="Enter a new meeting note..."
                  value={meetingNotes}
                  onChange={(event) =>
                    setMeetingNotes(
                      event.target.value,
                    )
                  }
                />

                <div className="mt-3 flex justify-end">
                  <GhostButton
                    className="text-xs py-1 px-3"
                    onClick={
                      handleSaveNotes
                    }
                    disabled={isSavingNotes}
                  >
                    {isSavingNotes
                      ? 'Saving...'
                      : 'Save Notes'}
                  </GhostButton>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
              <h3 className="font-heading text-sm font-semibold text-cream mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-ink/60" />
                Follow-up Tasks
              </h3>

              <div className="space-y-3">
                {followUpTasks.map(
                  (item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3"
                    >
                      <div
                        className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                          item.status ===
                          'completed'
                            ? 'bg-emerald-400 border-emerald-400'
                            : 'border-ink/40'
                        }`}
                      >
                        {item.status ===
                          'completed' && (
                          <CheckCircle2 className="h-3 w-3 text-navy-900" />
                        )}
                      </div>

                      <span
                        className={`text-sm ${
                          item.status ===
                          'completed'
                            ? 'text-cream line-through opacity-50'
                            : 'text-cream'
                        }`}
                      >
                        {item.task}
                      </span>
                    </div>
                  ),
                )}
              </div>

              <GhostButton
                className="w-full justify-center text-xs py-1 mt-4 border border-dashed border-white/10"
                onClick={() =>
                  showToast({
                    type: 'info',
                    title: 'Tasks',
                    description:
                      'Task creation will be connected to the Agent task workflow.',
                  })
                }
              >
                + Add Task
              </GhostButton>
            </div>
          </div>
        )}

        {/* History */}
        {activeTab === 'history' && (
          <div className="rounded-xl border border-white/5 bg-navy-900/50 p-6">
            <ActivityTimeline
              title="Schedule Timeline"
              items={scheduleTimeline}
            />
          </div>
        )}
      </div>
    </Modal>
  );
}
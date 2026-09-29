import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import {
  GoldButton,
  GhostButton,
} from '../../../../components/ui/ui';
import { StatusBadge } from '../../../ManagementDashboard/components/shared/StatusBadge';
import { ActivityTimeline } from '../../../../components/dashboard/shared/timelines/ActivityTimeline';
import { bookingApi } from '../../../../api/booking.api';
import { useToast } from '../../../../contexts/ToastContext';
import { ROUTES } from '../../../../constants/routes';

interface AppointmentActivity {
  action: string;
  description?: string;
  performedBy?: string;
  createdAt?: string;
}

interface AppointmentRecord {
  id: string;
  inquiryId?: string;

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

  status:
    | 'Pending'
    | 'Confirmed'
    | 'Rescheduled'
    | 'Completed'
    | 'Cancelled'
    | 'Rejected';

  appointmentStatus:
    | 'Pending'
    | 'Confirmed'
    | 'Rescheduled'
    | 'Completed'
    | 'Cancelled'
    | 'Rejected';

  priority: string;
  source: string;
  message: string;

  notes?: {
    text: string;
    addedBy?: string;
    addedAt?: string;
  }[];

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
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'notes' | 'history'
  >('overview');

  const [isConfirming, setIsConfirming] =
    useState(false);

  const [isRejecting, setIsRejecting] =
    useState(false);

  const [isCompleting, setIsCompleting] =
    useState(false);

  /*
   * Reset the active tab whenever a different
   * viewing request is opened.
   */
  useEffect(() => {
    if (!appointment) {
      return;
    }

    setActiveTab('overview');
  }, [appointment]);

  /*
   * Keep all Hooks above the conditional return.
   */
  if (!appointment) {
    return null;
  }

  /*
   * Booking activity history comes from the
   * real Booking record mapped by Appointments.tsx.
   */
  const hasActivities =
    appointment.activities &&
    appointment.activities.length > 0;

  const scheduleTimeline = hasActivities
    ? appointment.activities.map(
        (activity, index) => ({
          title:
            activity.action ||
            'Activity',

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
              .includes('viewing')
              ? Calendar
              : activity.action
                  ?.toLowerCase()
                  .includes('confirm')
              ? CheckCircle2
              : activity.action
                  ?.toLowerCase()
                  .includes('reject')
              ? AlertCircle
              : Activity,

          color:
            activity.action
              ?.toLowerCase()
              .includes('confirm')
              ? 'text-emerald-400'
              : activity.action
                  ?.toLowerCase()
                  .includes('reject')
              ? 'text-rose-400'
              : activity.action
                  ?.toLowerCase()
                  .includes('viewing')
              ? 'text-blue-400'
              : 'text-gold-400',

          key: `${
            activity.createdAt ||
            'activity'
          }-${index}`,
        }),
      )
    : [
        {
          title:
            'Viewing Request Created',

          time: appointment.createdAt
            ? new Date(
                appointment.createdAt,
              ).toLocaleString()
            : 'Time unavailable',

          desc:
            'The Buyer submitted a viewing request for this property.',

          icon: Calendar,
          color: 'text-blue-400',
          key: 'booking-created',
        },
      ];

  /*
   * Confirm the real Booking.
   *
   * PATCH /api/v1/bookings/:bookingId/confirm
   */
  const handleConfirmBooking = async () => {
    if (
      appointment.appointmentStatus !==
      'Pending'
    ) {
      return;
    }

    if (
      isConfirming ||
      isRejecting
    ) {
      return;
    }

    try {
      setIsConfirming(true);

      const response =
        await bookingApi.confirmBooking(
          appointment.id,
        );

      const confirmedBooking =
        (response as any)?.data?.booking;

      if (!confirmedBooking?._id) {
        throw new Error(
          'The confirmed booking was not returned by the server.',
        );
      }

      const confirmedStatus =
        confirmedBooking.status ||
        'Confirmed';

      onUpdated?.({
        status: confirmedStatus,
        appointmentStatus:
          confirmedStatus,
        updatedAt:
          confirmedBooking.updatedAt ||
          new Date().toISOString(),
      });

      showToast({
        type: 'success',
        title:
          'Viewing Confirmed',
        description:
          'The Buyer viewing request has been confirmed successfully.',
      });

      onClose();
    } catch (error) {
      console.error(
        'Failed to confirm viewing:',
        error,
      );

      showToast({
        type: 'error',
        title:
          'Unable to confirm viewing',
        description:
          error instanceof Error
            ? error.message
            : 'The viewing request could not be confirmed.',
      });
    } finally {
      setIsConfirming(false);
    }
  };

  /*
   * Reject the real Booking.
   *
   * PATCH /api/v1/bookings/:bookingId/reject
   */
  const handleRejectBooking = async () => {
    if (
      appointment.appointmentStatus !==
        'Pending' &&
      appointment.appointmentStatus !==
        'Rescheduled'
    ) {
      return;
    }

    if (
      isConfirming ||
      isRejecting
    ) {
      return;
    }

    try {
      setIsRejecting(true);

      const response =
        await bookingApi.rejectBooking(
          appointment.id,
        );

      const rejectedBooking =
        (response as any)?.data?.booking;

      if (!rejectedBooking?._id) {
        throw new Error(
          'The rejected booking was not returned by the server.',
        );
      }

      onUpdated?.({
        status: 'Rejected',
        appointmentStatus:
          'Rejected',
        updatedAt:
          rejectedBooking.updatedAt ||
          new Date().toISOString(),
      });

      showToast({
        type: 'success',
        title:
          'Viewing Rejected',
        description:
          'The Buyer viewing request has been rejected.',
      });

      onClose();
    } catch (error) {
      console.error(
        'Failed to reject viewing:',
        error,
      );

      showToast({
        type: 'error',
        title:
          'Unable to reject viewing',
        description:
          error instanceof Error
            ? error.message
            : 'The viewing request could not be rejected.',
      });
    } finally {
      setIsRejecting(false);
    }
  };

  /*
   * Mark the confirmed Booking as completed.
   *
   * PATCH /api/v1/bookings/:bookingId/complete
   */
  const handleCompleteBooking = async () => {
    if (
      appointment.appointmentStatus !==
      'Confirmed'
    ) {
      return;
    }

    if (
      isConfirming ||
      isRejecting ||
      isCompleting
    ) {
      return;
    }

    try {
      setIsCompleting(true);

      const response =
        await bookingApi.completeBooking(
          appointment.id,
        );

      const completedBooking =
        (response as any)?.data?.booking;

      if (!completedBooking?._id) {
        throw new Error(
          'The completed booking was not returned by the server.',
        );
      }

      onUpdated?.({
        status: 'Completed',
        appointmentStatus:
          'Completed',
        updatedAt:
          completedBooking.updatedAt ||
          new Date().toISOString(),
      });

      showToast({
        type: 'success',
        title:
          'Viewing Completed',
        description:
          'The property viewing has been marked as completed.',
      });

      onClose();
    } catch (error) {
      console.error(
        'Failed to complete viewing:',
        error,
      );

      showToast({
        type: 'error',
        title:
          'Unable to complete viewing',
        description:
          error instanceof Error
            ? error.message
            : 'The viewing could not be marked as completed.',
      });
    } finally {
      setIsCompleting(false);
    }
  };

  /*
   * Navigate directly to the exact public
   * property associated with the Booking.
   */
  const handleViewProperty = () => {
    if (!appointment.propertyId) {
      showToast({
        type: 'error',
        title:
          'Property Unavailable',
        description:
          'This viewing request is not linked to a property record.',
      });

      return;
    }

    const propertyRoute =
      ROUTES.PROPERTY_DETAILS.replace(
        ':id',
        appointment.propertyId,
      );

    onClose();

    navigate(propertyRoute);
  };

  const isPending =
    appointment.appointmentStatus ===
    'Pending';

  const isConfirmed =
    appointment.appointmentStatus ===
    'Confirmed';

  const isCompleted =
    appointment.appointmentStatus ===
    'Completed';

  const isRejected =
    appointment.appointmentStatus ===
    'Rejected';

  const isCancelled =
    appointment.appointmentStatus ===
    'Cancelled';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Viewing Request Details"
      size="2xl"
      actionButton={
        isPending ? (
          <GoldButton
            onClick={
              handleConfirmBooking
            }
            disabled={
              isConfirming ||
              isRejecting
            }
          >
            {isConfirming
              ? 'Confirming...'
              : 'Confirm Viewing'}
          </GoldButton>
        ) : isConfirmed ? (
          <GoldButton
            onClick={
              handleCompleteBooking
            }
            disabled={
              isCompleting ||
              isConfirming ||
              isRejecting
            }
          >
            {isCompleting
              ? 'Completing...'
              : 'Mark Viewing Completed'}
          </GoldButton>
        ) : null
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

              <div className="text-ink/60 flex flex-wrap items-center gap-4 mt-2">
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
                  appointment.appointmentStatus ||
                  'Pending'
                }
              />

              <span className="inline-flex items-center rounded-full border border-white/10 bg-navy-800/50 px-2.5 py-0.5 text-xs font-semibold text-ink/70">
                Source:{' '}
                {appointment.source ||
                  'Buyer Viewing Request'}
              </span>

              <span className="inline-flex items-center rounded-full border border-white/10 bg-navy-800/50 px-2.5 py-0.5 text-xs font-semibold text-ink/70">
                Priority:{' '}
                {appointment.priority ||
                  'Standard'}
              </span>
            </div>

            {/* Booking Actions */}
            <div className="flex flex-wrap gap-3 pt-2">
              {isPending && (
                <>
                  <GoldButton
                    onClick={
                      handleConfirmBooking
                    }
                    disabled={
                      isConfirming ||
                      isRejecting
                    }
                    className="flex items-center gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4" />

                    {isConfirming
                      ? 'Confirming...'
                      : 'Confirm Viewing'}
                  </GoldButton>

                  <GhostButton
                    onClick={
                      handleRejectBooking
                    }
                    disabled={
                      isConfirming ||
                      isRejecting
                    }
                    className="flex items-center gap-2 text-rose-400 hover:text-rose-300"
                  >
                    <AlertCircle className="h-4 w-4" />

                    {isRejecting
                      ? 'Rejecting...'
                      : 'Reject Request'}
                  </GhostButton>
                </>
              )}

              {isConfirmed && (
                <span className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-sm font-medium text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  Viewing Confirmed
                </span>
              )}

              {isCompleted && (
                <span className="inline-flex items-center gap-2 rounded-lg border border-blue-400/20 bg-blue-400/10 px-3 py-2 text-sm font-medium text-blue-400">
                  <CheckCircle2 className="h-4 w-4" />
                  Viewing Completed
                </span>
              )}

              {isRejected && (
                <span className="inline-flex items-center gap-2 rounded-lg border border-rose-400/20 bg-rose-400/10 px-3 py-2 text-sm font-medium text-rose-400">
                  <AlertCircle className="h-4 w-4" />
                  Viewing Rejected
                </span>
              )}

              {isCancelled && (
                <span className="inline-flex items-center gap-2 rounded-lg border border-rose-400/20 bg-rose-400/10 px-3 py-2 text-sm font-medium text-rose-400">
                  <AlertCircle className="h-4 w-4" />
                  Viewing Cancelled
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex border-b border-white/10">
          {[
            {
              id: 'overview',
              label: 'Overview & Info',
            },
            {
              id: 'notes',
              label: 'Buyer Message',
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
                  Buyer Information
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

                  <div className="mt-2 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-center text-xs text-ink/40">
                    Client profile details are not available in the current Agent data source.
                  </div>
                </div>
              </div>

              {/* Viewing Schedule */}
              <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                <h3 className="font-heading text-sm font-semibold text-cream mb-4 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-ink/60" />
                  Viewing Schedule
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-ink/60">
                      Date
                    </span>

                    <span className="text-cream font-medium">
                      {appointment.date}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-ink/60">
                      Time
                    </span>

                    <span className="text-cream font-medium">
                      {appointment.time}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <span className="text-ink/60">
                      Location
                    </span>

                    <span className="text-cream font-medium text-right">
                      {appointment.location}
                    </span>
                  </div>
                </div>
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
                    onClick={
                      handleViewProperty
                    }
                    className="w-full justify-center text-xs py-2 mt-2"
                  >
                    View Property
                  </GhostButton>
                </div>
              </div>

              {/* Booking Information */}
              <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                <h3 className="font-heading text-sm font-semibold text-cream mb-4 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-ink/60" />
                  Booking Information
                </h3>

                <div className="space-y-3 text-sm">
                  <div>
                    <span className="block text-ink/60 text-xs mb-1">
                      Booking ID
                    </span>

                    <span className="text-gold-400 font-medium break-all">
                      {appointment.id}
                    </span>
                  </div>

                  <div>
                    <span className="block text-ink/60 text-xs mb-1">
                      Status
                    </span>

                    <span className="text-cream">
                      {appointment.appointmentStatus}
                    </span>
                  </div>

                  <div>
                    <span className="block text-ink/60 text-xs mb-1">
                      Request Source
                    </span>

                    <span className="text-cream">
                      Buyer Viewing Request
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Buyer Message */}
        {activeTab === 'notes' && (
          <div className="space-y-6">
            <div className="rounded-xl border border-white/5 bg-navy-900/50 p-5">
              <h3 className="font-heading text-sm font-semibold text-cream mb-4 flex items-center gap-2">
                <FileText className="h-4 w-4 text-ink/60" />
                Buyer Message
              </h3>

              <div className="rounded-lg border border-white/5 bg-navy-800/60 p-4">
                {appointment.message ? (
                  <p className="text-sm text-ink/80 leading-relaxed">
                    {appointment.message}
                  </p>
                ) : (
                  <p className="text-sm text-ink/50 italic">
                    The Buyer did not include a message
                    with this viewing request.
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-gold-400/10 bg-gold-400/5 p-5">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-gold-400 shrink-0 mt-0.5" />

                <div>
                  <h3 className="text-sm font-semibold text-cream mb-1">
                    Booking Notes
                  </h3>

                  <p className="text-xs text-ink/60 leading-relaxed">
                    Persistent Agent notes are not part of
                    the current Booking API yet. We are
                    keeping this section read-only rather
                    than writing notes into the old Inquiry
                    system.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* History */}
        {activeTab === 'history' && (
          <div className="rounded-xl border border-white/5 bg-navy-900/50 p-6">
            <ActivityTimeline
              title="Viewing Request Timeline"
              items={scheduleTimeline}
            />
          </div>
        )}
      </div>
    </Modal>
  );
}
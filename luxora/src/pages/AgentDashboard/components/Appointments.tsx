import { useEffect, useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  Video,
  AlertCircle,
  TrendingUp,
  Navigation,
  PieChart,
  ListTodo,
  CalendarClock,
} from 'lucide-react';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { GhostButton } from '../../../components/ui/ui';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { AppointmentDetailModal } from './modals/AppointmentDetailModal';
import { useToast } from '../../../contexts/ToastContext';
import { EmptyState } from '../../../components/layout/EmptyState';
import { bookingApi } from '../../../api/booking.api';

interface AppointmentType extends Record<string, unknown> {
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

  status: string;
  appointmentStatus: string;

  priority: string;
  source: string;
  message: string;

  notes: {
    text: string;
    addedBy?: string;
    addedAt?: string;
  }[];

  activities: {
    action: string;
    description?: string;
    performedBy?: string;
    createdAt?: string;
  }[];

  createdAt: string;
  updatedAt: string;
}

export default function Appointments() {
  const { showToast } = useToast();

  // Store the current appointment search text.
  const [searchQuery, setSearchQuery] = useState('');

  // Store real Buyer viewing requests returned by the Booking API.
  const [appointments, setAppointments] = useState<
    AppointmentType[]
  >([]);

  // Track whether the initial booking request is still running.
  const [loading, setLoading] = useState(true);

  // Store the booking currently opened in the details modal.
  const [selectedAppt, setSelectedAppt] =
    useState<AppointmentType | null>(null);

  /*
   * Load real Buyer viewing requests for the
   * authenticated Agent.
   */
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setLoading(true);

        const response =
          await bookingApi.getAgentBookings();

        /*
         * Booking API response:
         *
         * {
         *   status: "success",
         *   results: number,
         *   data: {
         *     bookings: []
         *   }
         * }
         */
        const bookingRecords =
          (response as any)?.data?.bookings ?? [];

        const mappedAppointments: AppointmentType[] =
          bookingRecords.map((booking: any) => {
            const property =
              booking.property || {};

            const buyer =
              booking.buyer || {};

            const viewingDate =
              booking.viewingDate || '';

            const parsedDate =
              viewingDate
                ? new Date(viewingDate)
                : null;

            const formattedDate =
              parsedDate &&
              !Number.isNaN(
                parsedDate.getTime(),
              )
                ? parsedDate.toLocaleDateString(
                    'en-GB',
                    {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    },
                  )
                : 'Date unavailable';

            const location = [
              property.area,
              property.city,
              property.state,
            ]
              .filter(Boolean)
              .join(', ');

            return {
              /*
               * Booking ID is now the primary identifier.
               */
              id:
                booking._id ||
                booking.id,

              /*
               * Kept only so the existing detail modal
               * remains compatible with its current interface.
               */
              inquiryId: '',

              /*
               * Buyer information from the real Booking.
               */
              clientName:
                buyer.fullName ||
                'Unknown Buyer',

              clientEmail:
                buyer.email || '',

              clientPhone:
                buyer.phone || '',

              /*
               * Real property information.
               */
              propertyId:
                property._id ||
                null,

              title:
                property.title ||
                'Property Viewing',

              propertyType:
                property.propertyType ||
                'Unknown',

              transactionType:
                property.transactionType ||
                'Unknown',

              /*
               * Raw backend schedule values.
               */
              scheduledDate:
                viewingDate,

              scheduledTime:
                booking.viewingTime ||
                '',

              /*
               * Display schedule values.
               */
              date:
                formattedDate,

              time:
                booking.viewingTime ||
                'Time unavailable',

              /*
               * Build the location from the
               * real property record.
               */
              location:
                location ||
                property.address ||
                'Location unavailable',

              /*
               * Booking lifecycle status.
               */
              status:
                booking.status ||
                'Pending',

              appointmentStatus:
                booking.status ||
                'Pending',

              /*
               * Booking currently has no priority field.
               */
              priority:
                'Standard',

              /*
               * Identify this as a Buyer booking.
               */
              source:
                'Buyer Viewing Request',

              message:
                booking.message ||
                '',

              /*
               * Booking does not currently expose
               * appointment notes.
               */
              notes: [],

              /*
               * Create a minimal activity entry
               * from the real Booking timestamp.
               */
              activities: [
                {
                  action:
                    'Viewing Request Created',

                  description:
                    'Buyer submitted a viewing request for this property.',

                  performedBy:
                    buyer.fullName ||
                    'Buyer',

                  createdAt:
                    booking.createdAt ||
                    '',
                },

                /*
                 * Add a confirmation activity when
                 * the Agent has already confirmed it.
                 */
                ...(booking.status ===
                  'Confirmed'
                  ? [
                      {
                        action:
                          'Viewing Request Confirmed',

                        description:
                          'Agent confirmed the Buyer viewing request.',

                        performedBy:
                          'Assigned Agent',

                        createdAt:
                          booking.updatedAt ||
                          '',
                      },
                    ]
                  : []),
              ],

              createdAt:
                booking.createdAt ||
                '',

              updatedAt:
                booking.updatedAt ||
                '',
            };
          });

        setAppointments(
          mappedAppointments,
        );
      } catch (error) {
        console.error(
          'Failed to load Agent viewing requests:',
          error,
        );

        showToast({
          type: 'error',
          title:
            'Unable to load viewing requests',
          description:
            'We could not retrieve your Buyer viewing requests.',
        });
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, [showToast]);

  /*
   * Search the real Booking collection by:
   * - Buyer
   * - Property title
   * - Location
   */
  const filteredAppts =
    appointments.filter(
      (appointment) =>
        appointment.clientName
          .toLowerCase()
          .includes(
            searchQuery.toLowerCase(),
          ) ||
        appointment.title
          .toLowerCase()
          .includes(
            searchQuery.toLowerCase(),
          ) ||
        appointment.location
          .toLowerCase()
          .includes(
            searchQuery.toLowerCase(),
          ),
    );

  // Open the existing appointment details modal.
  const handleViewAppt = (
    appt: AppointmentType,
  ) => {
    setSelectedAppt(appt);
  };

  /*
   * Keep the appointment list synchronized after
   * actions from AppointmentDetailModal.
   */
  const handleAppointmentUpdated = (
    updates: Partial<AppointmentType>,
  ) => {
    setAppointments(
      (currentAppointments) =>
        currentAppointments.map(
          (appointment) => {
            if (
              appointment.id !==
              selectedAppt?.id
            ) {
              return appointment;
            }

            const updatedAppointment = {
              ...appointment,
              ...updates,
            };

            /*
             * Keep the display date synchronized
             * when a booking schedule changes.
             */
            if (
              updates.scheduledDate
            ) {
              const parsedDate =
                new Date(
                  updates.scheduledDate,
                );

              if (
                !Number.isNaN(
                  parsedDate.getTime(),
                )
              ) {
                updatedAppointment.date =
                  parsedDate.toLocaleDateString(
                    'en-GB',
                    {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    },
                  );
              }
            }

            /*
             * Keep the display time synchronized.
             */
            if (
              updates.scheduledTime
            ) {
              updatedAppointment.time =
                updates.scheduledTime;
            }

            /*
             * Keep status fields synchronized.
             */
            if (
              updates.status
            ) {
              updatedAppointment.appointmentStatus =
                updates.status;

              updatedAppointment.status =
                updates.status;
            }

            return updatedAppointment;
          },
        ),
    );

    /*
     * Keep the selected booking synchronized too.
     */
    if (selectedAppt) {
      setSelectedAppt({
        ...selectedAppt,
        ...updates,
      });
    }
  };

  /*
   * Preparation checklist derived from the current
   * viewing requests. Unsupported checklist state is
   * intentionally not persisted.
   */
  const prepChecklist = [
    {
      task:
        'Review property details before viewing',
      completed: false,
    },
    {
      task:
        'Confirm Buyer viewing request',
      completed:
        appointments.some(
          (appointment) =>
            appointment.appointmentStatus ===
            'Confirmed',
        ),
    },
    {
      task:
        'Prepare viewing notes',
      completed: false,
    },
  ];

  /*
   * Schedule guidance based on the current appointments.
   * There is no route-planning backend, so no travel-time
   * or conflict data is fabricated here.
   */
  const conflictAlerts = [
    {
      title: 'Schedule Review',
      desc:
        'Review your confirmed viewing times before starting the day.',
      severity: 'Medium',
    },
  ];

  /*
   * Show a simple daily route from the appointment records.
   * This is a display-only sequence, not a route-optimization result.
   */
  const dailyRoute = [
    {
      time: '09:00 AM',
      location:
        'Agent Workspace',
      type: 'Start',
    },
    ...appointments
      .filter(
        (appointment) =>
          appointment.appointmentStatus ===
            'Pending' ||
          appointment.appointmentStatus ===
            'Confirmed',
      )
      .slice(0, 2)
      .map(
        (appointment) => ({
          time:
            appointment.time,

          location:
            appointment.title,

          type:
            'Viewing',
        }),
      ),
    {
      time: '04:00 PM',
      location:
        'Agent Workspace',
      type: 'End',
    },
  ];

  /*
   * Derive a few simple counts from the real Booking
   * collection instead of hardcoding those counts.
   */
  const pendingCount =
    appointments.filter(
      (appointment) =>
        appointment.appointmentStatus ===
        'Pending',
    ).length;

  const confirmedCount =
    appointments.filter(
      (appointment) =>
        appointment.appointmentStatus ===
        'Confirmed',
    ).length;

  const completedCount =
    appointments.filter(
      (appointment) =>
        appointment.appointmentStatus ===
        'Completed',
    ).length;

  return (
    <div className="space-y-6 pb-12">
      <DashboardHeader
        name="Schedule & Planning Intelligence"
        subtitle="Optimize your daily route, prepare for meetings, and manage Buyer viewing requests."
      />

      {/* INTELLIGENCE HEADER */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="md:col-span-2 bg-gradient-to-br from-navy-800 to-navy-900 border border-white/10 rounded-2xl p-6 flex flex-col justify-center h-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-400/20 rounded-xl">
              <CalendarClock className="h-6 w-6 text-blue-400" />
            </div>

            <h4 className="font-bold text-cream text-lg">
              Viewing Request Schedule
            </h4>
          </div>

          <p className="text-sm text-ink/80 leading-relaxed mb-4">
            You currently have{' '}
            <strong className="text-blue-400">
              {pendingCount} pending
            </strong>{' '}
            Buyer viewing request
            {pendingCount === 1
              ? ''
              : 's'} and{' '}
            <strong className="text-emerald-400">
              {confirmedCount} confirmed
            </strong>{' '}
            viewing
            {confirmedCount === 1
              ? ''
              : 's'}.
          </p>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
            <div>
              <div className="text-xs text-ink/60 mb-1">
                Total Requests
              </div>

              <div className="text-lg font-bold text-cream">
                {appointments.length}
              </div>
            </div>

            <div>
              <div className="text-xs text-ink/60 mb-1">
                Pending
              </div>

              <div className="text-lg font-bold text-blue-400">
                {pendingCount}
              </div>
            </div>

            <div>
              <div className="text-xs text-ink/60 mb-1">
                Completed
              </div>

              <div className="text-lg font-bold text-emerald-400">
                {completedCount}
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-1 rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col h-full justify-between">
          <div>
            <h3 className="text-sm font-semibold text-ink/60 mb-4 flex items-center gap-2">
              <PieChart className="h-4 w-4 text-purple-400" />
              Booking Status
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-cream font-medium">
                    Pending
                  </span>

                  <span className="text-blue-400">
                    {pendingCount}
                  </span>
                </div>

                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-400 rounded-full"
                    style={{
                      width:
                        appointments.length > 0
                          ? `${
                              (pendingCount /
                                appointments.length) *
                              100
                            }%`
                          : '0%',
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-cream font-medium">
                    Confirmed
                  </span>

                  <span className="text-emerald-400">
                    {confirmedCount}
                  </span>
                </div>

                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full"
                    style={{
                      width:
                        appointments.length > 0
                          ? `${
                              (confirmedCount /
                                appointments.length) *
                              100
                            }%`
                          : '0%',
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-cream font-medium">
                    Completed
                  </span>

                  <span className="text-gold-400">
                    {completedCount}
                  </span>
                </div>

                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold-400 rounded-full"
                    style={{
                      width:
                        appointments.length > 0
                          ? `${
                              (completedCount /
                                appointments.length) *
                              100
                            }%`
                          : '0%',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-1 rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col h-full">
          <h3 className="text-sm font-semibold text-ink/60 mb-4 text-center">
            Viewing Summary
          </h3>

          <div className="flex-1 flex flex-col justify-center gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink/60">
                Pending
              </span>

              <span className="text-sm font-medium text-blue-400">
                {pendingCount}
              </span>
            </div>

            <div className="w-full bg-white/5 rounded-full h-1.5">
              <div
                className="bg-blue-400 h-1.5 rounded-full"
                style={{
                  width:
                    appointments.length > 0
                      ? `${
                          (pendingCount /
                            appointments.length) *
                          100
                        }%`
                      : '0%',
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-ink/60">
                Confirmed
              </span>

              <span className="text-sm font-medium text-emerald-400">
                {confirmedCount}
              </span>
            </div>

            <div className="w-full bg-white/5 rounded-full h-1.5">
              <div
                className="bg-emerald-400 h-1.5 rounded-full"
                style={{
                  width:
                    appointments.length > 0
                      ? `${
                          (confirmedCount /
                            appointments.length) *
                          100
                        }%`
                      : '0%',
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-ink/60">
                Completed
              </span>

              <span className="text-sm font-medium text-gold-400">
                {completedCount}
              </span>
            </div>

            <div className="w-full bg-white/5 rounded-full h-1.5">
              <div
                className="bg-gold-400 h-1.5 rounded-full"
                style={{
                  width:
                    appointments.length > 0
                      ? `${
                          (completedCount /
                            appointments.length) *
                          100
                        }%`
                      : '0%',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Viewing Requests"
          value={String(appointments.length)}
          trend={`${pendingCount} pending`}
          trendColor="text-blue-400"
          icon={CalendarIcon}
        />

        <KPICard
          title="Confirmed Viewings"
          value={String(confirmedCount)}
          trend="Buyer requests confirmed"
          trendColor="text-emerald-400"
          icon={CalendarClock}
        />

        <KPICard
          title="Completed Viewings"
          value={String(completedCount)}
          trend="Inspection history"
          trendColor="text-gold-400"
          icon={ListTodo}
        />

        <KPICard
          title="Buyer Requests"
          value={String(appointments.length)}
          trend="Real Booking records"
          trendColor="text-blue-400"
          icon={TrendingUp}
        />
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Main Appointment Table */}
        <div className="lg:col-span-3 space-y-6">
          <DataTableToolbar
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search by buyer, property or location..."
          />

          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-8 text-center">
              <div className="text-sm text-ink/60">
                Loading viewing requests...
              </div>
            </div>
          ) : filteredAppts.length > 0 ? (
            <DataTable
              keyExtractor={(
                item: AppointmentType,
              ) => item.id}
              columns={[
                {
                  header: 'Time / Date',
                  render: (
                    appt: AppointmentType,
                  ) => (
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gold-400/20 flex items-center justify-center text-gold-400">
                        <Clock className="h-5 w-5" />
                      </div>

                      <div>
                        <div className="font-semibold text-cream">
                          {appt.date}
                        </div>

                        {appt.time !==
                          'Time unavailable' && (
                          <div className="text-xs text-ink/60">
                            {appt.time}
                          </div>
                        )}
                      </div>
                    </div>
                  ),
                },

                {
                  header: 'Buyer & Property',
                  render: (
                    appt: AppointmentType,
                  ) => (
                    <div>
                      <div className="font-medium text-cream flex items-center gap-1.5 mb-1">
                        <User className="h-3.5 w-3.5 text-gold-400" />

                        {appt.clientName}
                      </div>

                      <div className="text-xs text-ink/60">
                        {appt.title}
                      </div>
                    </div>
                  ),
                },

                {
                  header: 'Type / Location',
                  render: (
                    appt: AppointmentType,
                  ) => (
                    <div>
                      <div className="flex items-center gap-1.5 mb-1 text-sm text-cream">
                        {appt.location ===
                        'Virtual' ? (
                          <Video className="h-3.5 w-3.5 text-blue-400" />
                        ) : (
                          <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                        )}

                        {appt.location}
                      </div>

                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-white/5 text-ink/60 border border-white/10 uppercase tracking-wider">
                        Viewing
                      </span>
                    </div>
                  ),
                },

                {
                  header: 'Priority',
                  render: (
                    appt: AppointmentType,
                  ) => (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-white/5 text-ink/60 border border-white/10">
                      {appt.priority}
                    </span>
                  ),
                },

                {
                  header: 'Status',
                  render: (
                    appt: AppointmentType,
                  ) => (
                    <EnterpriseStatusBadge
                      status={
                        appt.appointmentStatus
                      }
                    />
                  ),
                },

                {
                  header: 'Actions',
                  render: (
                    appt: AppointmentType,
                  ) => (
                    <GhostButton
                      onClick={() =>
                        handleViewAppt(
                          appt,
                        )
                      }
                      className="h-8 px-3 text-xs"
                    >
                      View Details
                    </GhostButton>
                  ),
                },
              ]}
              data={filteredAppts}
              onRowClick={(
                appt: AppointmentType,
              ) =>
                handleViewAppt(appt)
              }
            />
          ) : (
            <EmptyState
              icon={
                <CalendarIcon className="h-8 w-8 text-gold-400" />
              }
              title="No viewing requests found."
              description="Buyer viewing requests for your assigned properties will appear here."
            />
          )}
        </div>

        {/* Schedule Analytics & Planning */}
        <div className="space-y-6 lg:col-span-1">
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-orange-400" />
              Schedule Alerts
            </h3>

            <div className="space-y-3">
              {conflictAlerts.map(
                (alert, idx) => (
                  <div
                    key={idx}
                    className="bg-orange-500/10 p-3 rounded-xl border border-orange-500/30"
                  >
                    <div className="text-xs font-bold text-orange-400 mb-1">
                      {alert.title}
                    </div>

                    <div className="text-[10px] text-ink/80">
                      {alert.desc}
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
              <ListTodo className="h-4 w-4 text-emerald-400" />
              Viewing Prep
            </h3>

            <div className="space-y-3">
              {prepChecklist.map(
                (item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2"
                  >
                    <input
                      type="checkbox"
                      checked={item.completed}
                      readOnly
                      className="mt-0.5 accent-gold-400 bg-white/5 border-white/10"
                    />

                    <span
                      className={`text-xs ${
                        item.completed
                          ? 'text-ink/40 line-through'
                          : 'text-cream'
                      }`}
                    >
                      {item.task}
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
              <Navigation className="h-4 w-4 text-blue-400" />
              Daily Route Planner
            </h3>

            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
              {dailyRoute.map(
                (stop, idx) => (
                  <div
                    key={idx}
                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                  >
                    <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-emerald-400 bg-navy-900 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10" />

                    <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-xl border border-white/5 bg-navy-900/50">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-cream text-xs">
                          {stop.time}
                        </span>

                        <span className="text-[10px] text-ink/60 px-1.5 py-0.5 bg-white/5 rounded">
                          {stop.type}
                        </span>
                      </div>

                      <div className="text-[10px] text-ink/80">
                        {stop.location}
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>

      <AppointmentDetailModal
        isOpen={!!selectedAppt}
        onClose={() =>
          setSelectedAppt(null)
        }
        appointment={selectedAppt}
        onUpdated={(
          updates,
        ) => {
          handleAppointmentUpdated(
            updates,
          );
        }}
      />
    </div>
  );
}
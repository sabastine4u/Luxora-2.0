/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, User, Video, AlertCircle, TrendingUp, Navigation, CalendarDays, PieChart, ListTodo, Route, CalendarClock } from 'lucide-react';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { StatusBadge } from '../../ManagementDashboard/components/shared/StatusBadge';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { AppointmentDetailModal } from './modals/AppointmentDetailModal';

export default function Appointments() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppt, setSelectedAppt] = useState<any | null>(null);

  const appointments = [
    { id: 'APT-001', client: 'Tony Elumelu', title: 'Viewing: Lekki Phase 1 Villa', date: 'Today, 2:00 PM', type: 'Viewing', location: 'In-Person', status: 'Scheduled', priority: 'High' },
    { id: 'APT-002', client: 'Sarah Smith', title: 'Initial Consultation', date: 'Tomorrow, 10:00 AM', type: 'Consultation', location: 'Virtual', status: 'Pending', priority: 'Normal' },
    { id: 'APT-003', client: 'Aliko Dangote', title: 'Contract Signing', date: 'Next Wed, 1:00 PM', type: 'Meeting', location: 'In-Person', status: 'Scheduled', priority: 'High' },
    { id: 'APT-004', client: 'Folorunso Alakija', title: 'Portfolio Review', date: 'Yesterday', type: 'Review', location: 'Virtual', status: 'Completed', priority: 'High' },
    { id: 'APT-005', client: 'Mike Adenuga', title: 'Property Tour: Banana Island', date: 'Last Monday', type: 'Viewing', location: 'In-Person', status: 'Cancelled', priority: 'High' },
  ];

  const filteredAppts = appointments.filter(a => 
    a.client.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewAppt = (appt: any) => {
    setSelectedAppt(appt);
  };

  const prepChecklist = [
    { task: 'Review Tony Elumelu property comps', completed: false },
    { task: 'Send virtual link to Sarah Smith', completed: true },
    { task: 'Print Aliko Dangote contracts', completed: false },
  ];

  const conflictAlerts = [
    { title: 'Tight Travel Buffer', desc: 'Only 15 mins between Victoria Island and Lekki Phase 1.', severity: 'Medium' },
  ];

  const dailyRoute = [
    { time: '10:00 AM', location: 'Victoria Island Office', type: 'Start' },
    { time: '11:30 AM', location: 'Skyline Penthouse (Viewing)', type: 'Stop 1' },
    { time: '02:00 PM', location: 'Lekki Phase 1 Villa (Viewing)', type: 'Stop 2' },
    { time: '04:00 PM', location: 'Victoria Island Office', type: 'End' },
  ];

  return (
    <div className="space-y-6 pb-12">
      <DashboardHeader
        name="Schedule & Planning Intelligence"
        subtitle="Optimize your daily route, prepare for meetings, and maximize schedule efficiency."
        actions={
          <div className="flex gap-3">
            <GhostButton className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" /> Sync Calendar
            </GhostButton>
            <GoldButton className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" /> New Event
            </GoldButton>
          </div>
        }
      />

      {/* INTELLIGENCE HEADER: SCHEDULE UTILIZATION & METRICS */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="md:col-span-2 bg-gradient-to-br from-navy-800 to-navy-900 border border-white/10 rounded-2xl p-6 flex flex-col justify-center h-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-400/20 rounded-xl">
              <CalendarClock className="h-6 w-6 text-blue-400" />
            </div>
            <h4 className="font-bold text-cream text-lg">Daily Schedule Optimizer</h4>
          </div>
          <p className="text-sm text-ink/80 leading-relaxed mb-4">
            Your schedule today is <strong className="text-blue-400">75% booked</strong>. 
            You have a <strong className="text-orange-400">tight travel buffer</strong> between your 11:30 AM and 2:00 PM viewings. 
            Consider moving your admin tasks to the 4:00 PM block for maximum productivity.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
            <div>
              <div className="text-xs text-ink/60 mb-1">Total Meetings</div>
              <div className="text-lg font-bold text-cream">3</div>
            </div>
            <div>
              <div className="text-xs text-ink/60 mb-1">Est. Travel Time</div>
              <div className="text-lg font-bold text-blue-400">1.5h</div>
            </div>
            <div>
              <div className="text-xs text-ink/60 mb-1">Focus Time</div>
              <div className="text-lg font-bold text-emerald-400">2h</div>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-1 rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col h-full justify-between">
          <div>
            <h3 className="text-sm font-semibold text-ink/60 mb-4 flex items-center gap-2">
              <PieChart className="h-4 w-4 text-purple-400" /> Weekly Schedule Heatmap
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-cream font-medium">Mornings (High Energy)</span>
                  <span className="text-emerald-400">60% Booked</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 w-[60%] rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-cream font-medium">Afternoons (Meetings)</span>
                  <span className="text-blue-400">85% Booked</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400 w-[85%] rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-cream font-medium">Evenings (Admin/Follow-up)</span>
                  <span className="text-gold-400">30% Booked</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gold-400 w-[30%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-1 rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col h-full">
          <h3 className="text-sm font-semibold text-ink/60 mb-4 text-center">Appointment Completion Summary</h3>
          <div className="flex-1 flex flex-col justify-center gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink/60">Success / Showed</span>
              <span className="text-sm font-medium text-emerald-400">92%</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1.5"><div className="bg-emerald-400 h-1.5 rounded-full w-[92%]"></div></div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink/60">Rescheduled</span>
              <span className="text-sm font-medium text-blue-400">5%</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1.5"><div className="bg-blue-400 h-1.5 rounded-full w-[5%]"></div></div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink/60">No-Show</span>
              <span className="text-sm font-medium text-rose-400">3%</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1.5"><div className="bg-rose-400 h-1.5 rounded-full w-[3%]"></div></div>
          </div>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Meetings This Week"
          value="18"
          trend="8 Viewings, 10 Calls"
          trendColor="text-blue-400"
          icon={CalendarIcon}
        />
        <KPICard
          title="Avg Travel Time"
          value="2.5h/day"
          trend="Optimize routes"
          trendColor="text-orange-400"
          icon={Route}
        />
        <KPICard
          title="High Priority"
          value="5"
          trend="Requires prep today"
          trendColor="text-gold-400"
          icon={AlertCircle}
        />
        <KPICard
          title="Meeting Conversion"
          value="24%"
          trend="Lead to Offer"
          trendColor="text-emerald-400"
          icon={TrendingUp}
        />
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Main Appointment Table */}
        <div className="lg:col-span-3 space-y-6">
          <DataTableToolbar
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search by client or title..."
          />

          <DataTable keyExtractor={(item: any, index: number) => item.id || String(index)}
            columns={[
              {
                header: 'Time / Date',
                render: (appt: any) => (
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gold-400/20 flex items-center justify-center text-gold-400">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-cream">{appt.date}</div>
                    </div>
                  </div>
                )
              },
              {
                header: 'Client & Details',
                render: (appt: any) => (
                  <div>
                    <div className="font-medium text-cream flex items-center gap-1.5 mb-1">
                      <User className="h-3.5 w-3.5 text-gold-400" /> {appt.client}
                    </div>
                    <div className="text-xs text-ink/60">{appt.title}</div>
                  </div>
                )
              },
              {
                header: 'Type / Location',
                render: (appt: any) => (
                  <div>
                    <div className="flex items-center gap-1.5 mb-1 text-sm text-cream">
                      {appt.location === 'Virtual' ? <Video className="h-3.5 w-3.5 text-blue-400" /> : <MapPin className="h-3.5 w-3.5 text-emerald-400" />}
                      {appt.location}
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-white/5 text-ink/60 border border-white/10 uppercase tracking-wider">
                      {appt.type}
                    </span>
                  </div>
                )
              },
              {
                header: 'Priority',
                render: (appt: any) => (
                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                    appt.priority === 'High' ? 'bg-orange-400/10 text-orange-400 border border-orange-400/20' : 'bg-white/5 text-ink/60 border border-white/10'
                  }`}>
                    {appt.priority}
                  </span>
                )
              },
              {
                header: 'Status',
                render: (appt: any) => <StatusBadge status={appt.status} />
              },
              {
                header: 'Actions',
                render: (appt: any) => (
                  <GhostButton 
                    onClick={() => handleViewAppt(appt)}
                    className="h-8 px-3 text-xs"
                  >
                    View Details
                  </GhostButton>
                )
              }
            ]}
            data={filteredAppts}
            onRowClick={(appt) => handleViewAppt(appt)}
          />
        </div>

        {/* Schedule Analytics & Planning */}
        <div className="space-y-6 lg:col-span-1">
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-orange-400" /> Time Conflict Alerts
            </h3>
            <div className="space-y-3">
              {conflictAlerts.map((alert, idx) => (
                <div key={idx} className="bg-orange-500/10 p-3 rounded-xl border border-orange-500/30">
                  <div className="text-xs font-bold text-orange-400 mb-1">{alert.title}</div>
                  <div className="text-[10px] text-ink/80">{alert.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
              <ListTodo className="h-4 w-4 text-emerald-400" /> Appointment Prep
            </h3>
            <div className="space-y-3">
              {prepChecklist.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <input type="checkbox" checked={item.completed} readOnly className="mt-0.5 accent-gold-400 bg-white/5 border-white/10" />
                  <span className={`text-xs ${item.completed ? 'text-ink/40 line-through' : 'text-cream'}`}>{item.task}</span>
                </div>
              ))}
            </div>
            <GoldButton className="w-full text-xs py-2 mt-4">Generate Agendas</GoldButton>
          </div>

          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
              <Navigation className="h-4 w-4 text-blue-400" /> Daily Route Planner
            </h3>
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
              {dailyRoute.map((stop, idx) => (
                <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-emerald-400 bg-navy-900 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10" />
                  <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-xl border border-white/5 bg-navy-900/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-cream text-xs">{stop.time}</span>
                      <span className="text-[10px] text-ink/60 px-1.5 py-0.5 bg-white/5 rounded">{stop.type}</span>
                    </div>
                    <div className="text-[10px] text-ink/80">{stop.location}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AppointmentDetailModal 
        isOpen={!!selectedAppt} 
        onClose={() => setSelectedAppt(null)} 
        appointment={selectedAppt} 
      />
    </div>
  );
}

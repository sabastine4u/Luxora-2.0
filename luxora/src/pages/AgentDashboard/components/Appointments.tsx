import { Calendar as CalendarIcon, Clock, MapPin, CheckCircle, XCircle } from 'lucide-react';
import { GoldButton, GhostButton } from '../../../components/ui/ui';

const mockAppointments = [
  { id: 1, title: 'Viewing: Skyline Penthouse', client: 'Bisi Williams', location: 'Eko Atlantic, Lagos', date: 'Today', time: '10:00 AM', status: 'Confirmed' },
  { id: 2, title: 'Listing Presentation', client: 'Chidi Okafor', location: 'Virtual', date: 'Tomorrow', time: '02:00 PM', status: 'Pending' },
  { id: 3, title: 'Viewing: Aurora Studio', client: 'Anonymous', location: 'Yaba, Lagos', date: 'Oct 20, 2025', time: '11:00 AM', status: 'Completed' },
];

export default function Appointments() {
  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'Confirmed': return { color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20', icon: CheckCircle };
      case 'Pending': return { color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20', icon: Clock };
      case 'Completed': return { color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20', icon: CheckCircle };
      default: return { color: 'text-ink/60', bg: 'bg-white/5 border-white/10', icon: XCircle };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Appointments</h2>
          <p className="text-sm text-ink/60">Your upcoming viewings and client meetings.</p>
        </div>
        <div className="flex gap-2">
          <GhostButton>Sync Calendar</GhostButton>
          <GoldButton>New Appointment</GoldButton>
        </div>
      </div>

      <div className="grid gap-4">
        {mockAppointments.map((apt) => {
          const cfg = getStatusConfig(apt.status);
          return (
            <div key={apt.id} className="flex flex-col md:flex-row gap-6 rounded-2xl border border-white/10 bg-navy-800/50 p-5">
              
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-heading text-lg font-semibold text-cream">{apt.title}</h3>
                    <span className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
                      <cfg.icon className="h-3 w-3" /> {apt.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-ink/60 mb-3">
                    <MapPin className="h-4 w-4" /> {apt.location}
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 bg-navy-900/50 rounded-lg px-3 py-1.5 border border-white/5 text-cream">
                    <CalendarIcon className="h-4 w-4 text-gold-400" /> {apt.date}
                  </div>
                  <div className="flex items-center gap-2 bg-navy-900/50 rounded-lg px-3 py-1.5 border border-white/5 text-cream">
                    <Clock className="h-4 w-4 text-gold-400" /> {apt.time}
                  </div>
                  <div className="text-ink/60">Client: <span className="text-cream">{apt.client}</span></div>
                </div>
              </div>

              <div className="flex flex-col justify-end md:border-l md:border-white/10 md:pl-6 gap-2 min-w-[140px]">
                {apt.status === 'Confirmed' ? (
                  <>
                    <GoldButton size="sm" className="w-full">Start Meeting</GoldButton>
                    <GhostButton size="sm" className="w-full">Reschedule</GhostButton>
                  </>
                ) : apt.status === 'Pending' ? (
                  <>
                    <GoldButton size="sm" className="w-full">Confirm</GoldButton>
                    <GhostButton size="sm" className="w-full text-rose-400">Decline</GhostButton>
                  </>
                ) : (
                  <GhostButton size="sm" className="w-full">Log Notes</GhostButton>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

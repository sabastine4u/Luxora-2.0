import { Calendar, Clock, MapPin, CheckCircle, XCircle, Clock3 } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';

const mockViewings = [
  { id: 1, property: 'Skyline Penthouse', location: 'Eko Atlantic, Lagos', date: 'Tomorrow', time: '10:00 AM', status: 'Confirmed', agent: 'Adaeze Okonkwo', image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { id: 2, property: 'Garden Court Villa', location: 'Banana Island, Lagos', date: 'Oct 28, 2025', time: '02:00 PM', status: 'Pending', agent: 'Tunde Bakare', image: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { id: 3, property: 'Aurora Smart Studio', location: 'Yaba, Lagos', date: 'Oct 20, 2025', time: '11:00 AM', status: 'Completed', agent: 'Kunle Sanusi', image: 'https://images.pexels.com/photos/1572889/pexels-photo-1572889.jpeg?auto=compress&cs=tinysrgb&w=200' },
];

export default function ViewingRequests() {
  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'Confirmed': return { color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20', icon: CheckCircle };
      case 'Pending': return { color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20', icon: Clock3 };
      case 'Completed': return { color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20', icon: CheckCircle };
      default: return { color: 'text-ink/60', bg: 'bg-white/5 border-white/10', icon: XCircle };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Viewing Requests</h2>
          <p className="text-sm text-ink/60">Manage your upcoming and past property tours.</p>
        </div>
      </div>

      <div className="grid gap-4">
        {mockViewings.map((viewing) => {
          const cfg = getStatusConfig(viewing.status);
          return (
            <div key={viewing.id} className="flex flex-col md:flex-row gap-6 rounded-2xl border border-white/10 bg-navy-800/50 p-5">
              <img src={viewing.image} alt={viewing.property} className="h-24 w-full md:w-32 rounded-xl object-cover" />
              
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-heading text-lg font-semibold text-cream">{viewing.property}</h3>
                    <span className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
                      <cfg.icon className="h-3 w-3" /> {viewing.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-ink/60 mb-3">
                    <MapPin className="h-4 w-4" /> {viewing.location}
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 bg-navy-900/50 rounded-lg px-3 py-1.5 border border-white/5 text-cream">
                    <Calendar className="h-4 w-4 text-gold-400" /> {viewing.date}
                  </div>
                  <div className="flex items-center gap-2 bg-navy-900/50 rounded-lg px-3 py-1.5 border border-white/5 text-cream">
                    <Clock className="h-4 w-4 text-gold-400" /> {viewing.time}
                  </div>
                  <div className="text-ink/60">Agent: <span className="text-cream">{viewing.agent}</span></div>
                </div>
              </div>

              <div className="flex flex-col justify-end md:border-l md:border-white/10 md:pl-6">
                {viewing.status === 'Confirmed' ? (
                  <GhostButton size="sm" className="w-full">Reschedule</GhostButton>
                ) : viewing.status === 'Pending' ? (
                  <GhostButton size="sm" className="w-full text-rose-400 hover:text-rose-300 hover:border-rose-400/50">Cancel</GhostButton>
                ) : (
                  <GhostButton size="sm" className="w-full">Provide Feedback</GhostButton>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

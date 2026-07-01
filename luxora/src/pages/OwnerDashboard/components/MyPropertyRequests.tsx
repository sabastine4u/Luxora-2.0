import { Building2, Plus, FileEdit, Clock, CheckCircle } from 'lucide-react';
import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { properties } from '../../../data/luxoraData';

const mockRequests = [
  { id: 'PR-101', title: 'Skyline Penthouse Residence', location: 'Eko Atlantic, Lagos', type: 'Penthouse', status: 'Listed', date: 'Oct 12, 2025', image: properties[0].image },
  { id: 'PR-102', title: 'Banana Island Plot', location: 'Banana Island, Lagos', type: 'Land', status: 'Pending Review', date: 'Oct 22, 2025', image: properties[1].image },
  { id: 'PR-103', title: 'Ikoyi Luxury Villa', location: 'Ikoyi, Lagos', type: 'Villa', status: 'Draft', date: 'Oct 28, 2025', image: properties[2].image },
];

export default function MyPropertyRequests() {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Listed': return { color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20', icon: CheckCircle };
      case 'Pending Review': return { color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20', icon: Clock };
      case 'Draft': return { color: 'text-ink/60', bg: 'bg-white/5 border-white/10', icon: FileEdit };
      default: return { color: 'text-ink/60', bg: 'bg-white/5 border-white/10', icon: Building2 };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">My Property Requests</h2>
          <p className="text-sm text-ink/60">Manage your property submissions and listings.</p>
        </div>
        <GoldButton className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add New Property
        </GoldButton>
      </div>

      <div className="grid gap-4">
        {mockRequests.map((req) => {
          const cfg = getStatusConfig(req.status);
          return (
            <div key={req.id} className="flex flex-col md:flex-row gap-6 rounded-2xl border border-white/10 bg-navy-800/50 p-5 transition-transform hover:-translate-y-1">
              <img src={req.image} alt={req.title} className="h-32 w-full md:w-48 rounded-xl object-cover" />
              
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-heading text-xl font-semibold text-cream">{req.title}</h3>
                    <span className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
                      <cfg.icon className="h-3.5 w-3.5" /> {req.status}
                    </span>
                  </div>
                  <div className="text-sm text-ink/60">{req.location} • {req.type}</div>
                  <div className="mt-2 text-xs text-ink/40">Submitted: {req.date}</div>
                </div>
                
                <div className="mt-4 flex gap-3">
                  <GhostButton size="sm">View Details</GhostButton>
                  {req.status === 'Draft' && <GoldButton size="sm">Continue Draft</GoldButton>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { Megaphone, Plus, Calendar } from 'lucide-react';
import { GoldButton } from '../../../components/ui/ui';

export default function Announcements() {
  const announcements = [
    { id: 1, title: 'Platform Maintenance Scheduled', date: 'Oct 15, 2025', target: 'All Users', status: 'Draft' },
    { id: 2, title: 'New Agency Commission Tiers', date: 'Oct 01, 2025', target: 'Agencies', status: 'Published' },
    { id: 3, title: 'KYC Requirements Update', date: 'Sep 12, 2025', target: 'Owners & Agents', status: 'Published' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">System Announcements</h2>
          <p className="text-sm text-ink/60">Broadcast messages to specific user roles or the entire platform.</p>
        </div>
        <GoldButton className="flex items-center gap-2"><Plus className="h-4 w-4" /> New Announcement</GoldButton>
      </div>

      <div className="space-y-4">
        {announcements.map((ann) => (
          <div key={ann.id} className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
               <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-400/10 text-blue-400 shrink-0">
                 <Megaphone className="h-5 w-5" />
               </div>
               <div>
                 <h3 className="font-heading text-lg font-semibold text-cream">{ann.title}</h3>
                 <div className="flex items-center gap-4 mt-1 text-sm text-ink/60">
                   <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {ann.date}</span>
                   <span className="flex items-center gap-1 border-l border-white/10 pl-4">Target: {ann.target}</span>
                 </div>
               </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${ann.status === 'Published' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-white/10 text-ink/60'}`}>
                {ann.status}
              </span>
              <button className="text-gold-400 hover:text-gold-300 text-sm font-medium transition-colors">Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

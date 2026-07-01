import { MessageSquare, Search, Filter, Mail } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';

export default function Complaints() {
  const complaints = [
    { id: 'CMP-201', subject: 'Agent Unresponsive', reporter: 'Buyer (BU-142)', status: 'Open', priority: 'High', date: '1 hour ago' },
    { id: 'CMP-202', subject: 'Listing Information Incorrect', reporter: 'Guest', status: 'In Progress', priority: 'Medium', date: '3 hours ago' },
    { id: 'CMP-203', subject: 'Platform Glitch on Checkout', reporter: 'Owner (OW-451)', status: 'Open', priority: 'Low', date: '1 day ago' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">User Complaints</h2>
          <p className="text-sm text-ink/60">Manage reports and dispute resolution.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
            <input 
              type="text" 
              placeholder="Search tickets..." 
              className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-2 pl-9 pr-4 text-sm text-cream placeholder:text-ink/40 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50"
            />
          </div>
          <GhostButton className="px-3"><Filter className="h-4 w-4" /></GhostButton>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-navy-800/50">
        <table className="w-full text-left text-sm">
          <thead className="bg-navy-900/50 text-xs uppercase text-ink/50 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-semibold">Ticket ID</th>
              <th className="px-6 py-4 font-semibold">Subject</th>
              <th className="px-6 py-4 font-semibold">Reporter</th>
              <th className="px-6 py-4 font-semibold">Priority</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {complaints.map((comp) => (
              <tr key={comp.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-medium text-cream">{comp.id}</td>
                <td className="px-6 py-4 font-semibold text-cream flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-ink/40" /> {comp.subject}
                </td>
                <td className="px-6 py-4 text-ink/60">{comp.reporter}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${comp.priority === 'High' ? 'text-rose-400 bg-rose-400/10 border-rose-400/20' : comp.priority === 'Medium' ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' : 'text-blue-400 bg-blue-400/10 border-blue-400/20'}`}>
                    {comp.priority}
                  </span>
                </td>
                <td className="px-6 py-4 text-ink/60">{comp.status}</td>
                <td className="px-6 py-4 text-right">
                   <button className="text-gold-400 hover:bg-gold-400/10 p-2 rounded-lg transition-colors"><Mail className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

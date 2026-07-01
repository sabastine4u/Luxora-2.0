import { Search, Filter, MessageSquare, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { GhostButton, GoldButton } from '../../../components/ui/ui';

const mockComplaints = [
  { id: 'TKT-504', type: 'Listing Dispute', user: 'Ngozi Eze (Buyer)', target: 'Skyline Penthouse', status: 'Open', priority: 'High', date: '2 hours ago' },
  { id: 'TKT-503', type: 'Agent Conduct', user: 'Anonymous (Owner)', target: 'Oluwaseun Adeyemi', status: 'In Progress', priority: 'Medium', date: '1 day ago' },
  { id: 'TKT-502', type: 'Platform Bug', user: 'Chidi Okafor (Agent)', target: 'Messaging System', status: 'Resolved', priority: 'Low', date: '3 days ago' },
];

export default function Complaints() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      case 'In Progress': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Resolved': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      default: return 'text-ink/60 bg-white/5 border-white/10';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Complaints & Tickets</h2>
          <p className="text-sm text-ink/60">Resolve user disputes, reported listings, and platform issues.</p>
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

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
          <div className="flex items-center gap-2 text-rose-400">
            <AlertTriangle className="h-5 w-5" />
            <div className="text-3xl font-bold">12</div>
          </div>
          <div className="text-sm text-ink/60 mt-1">Open Tickets</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
          <div className="text-3xl font-bold text-yellow-400">5</div>
          <div className="text-sm text-ink/60 mt-1">In Progress</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
          <div className="text-3xl font-bold text-emerald-400">428</div>
          <div className="text-sm text-ink/60 mt-1">Resolved (YTD)</div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-navy-800/50">
        <table className="w-full text-left text-sm">
          <thead className="bg-navy-900/50 text-xs uppercase text-ink/50 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-semibold">Ticket ID</th>
              <th className="px-6 py-4 font-semibold">Type / Priority</th>
              <th className="px-6 py-4 font-semibold">Reported By</th>
              <th className="px-6 py-4 font-semibold">Target</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {mockComplaints.map((ticket) => (
              <tr key={ticket.id} className="transition-colors hover:bg-white/[0.02]">
                <td className="px-6 py-4 font-medium text-cream">{ticket.id}</td>
                <td className="px-6 py-4">
                  <div className="font-semibold text-cream">{ticket.type}</div>
                  <div className={`text-xs mt-0.5 ${ticket.priority === 'High' ? 'text-rose-400' : ticket.priority === 'Medium' ? 'text-yellow-400' : 'text-blue-400'}`}>
                    {ticket.priority} Priority
                  </div>
                </td>
                <td className="px-6 py-4 text-ink/60">{ticket.user}</td>
                <td className="px-6 py-4 text-ink/60">{ticket.target}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    {ticket.status !== 'Resolved' && (
                      <button className="rounded-lg p-2 text-ink/40 hover:bg-emerald-400/10 hover:text-emerald-400 transition-colors" title="Mark Resolved">
                        <CheckCircle className="h-5 w-5" />
                      </button>
                    )}
                    <button className="rounded-lg p-2 text-ink/40 hover:bg-rose-400/10 hover:text-rose-400 transition-colors" title="Close Ticket">
                      <XCircle className="h-5 w-5" />
                    </button>
                    <GoldButton size="sm" className="ml-2 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" /> View Thread
                    </GoldButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

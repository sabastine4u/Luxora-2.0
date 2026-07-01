import { Wrench, Search, AlertCircle, Plus } from 'lucide-react';
import { GoldButton, GhostButton } from '../../../components/ui/ui';

export default function Maintenance() {
  const requests = [
    { id: 'MNT-102', issue: 'Leaking AC Unit', property: 'Lekki Phase 1 Apt', tenant: 'Sarah Jenkins', priority: 'High', status: 'In Progress', date: 'Oct 05, 2025' },
    { id: 'MNT-103', issue: 'Broken Door Hinge', property: 'Victoria Island Villa', tenant: 'Dr. Ayo Balogun', priority: 'Low', status: 'Pending', date: 'Oct 06, 2025' },
    { id: 'MNT-104', issue: 'Water Heater Malfunction', property: 'Abuja Central Office', tenant: 'TechFlow Ltd', priority: 'Urgent', status: 'Resolved', date: 'Oct 02, 2025' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Maintenance Requests</h2>
          <p className="text-sm text-ink/60">Manage tenant repair requests and assign vendors.</p>
        </div>
        <GoldButton className="flex items-center gap-2"><Plus className="h-4 w-4" /> Create Ticket</GoldButton>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input 
            type="text" 
            placeholder="Search tickets..." 
            className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-2 pl-9 pr-4 text-sm text-cream placeholder:text-ink/40 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50"
          />
        </div>
        <GhostButton className="px-4">Assign Vendor</GhostButton>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-navy-800/50">
        <table className="w-full text-left text-sm">
          <thead className="bg-navy-900/50 text-xs uppercase text-ink/50 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-semibold">Ticket ID</th>
              <th className="px-6 py-4 font-semibold">Issue</th>
              <th className="px-6 py-4 font-semibold">Property & Tenant</th>
              <th className="px-6 py-4 font-semibold">Date Logged</th>
              <th className="px-6 py-4 font-semibold">Priority</th>
              <th className="px-6 py-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {requests.map((req) => (
              <tr key={req.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-medium text-cream">{req.id}</td>
                <td className="px-6 py-4 font-semibold text-cream flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-ink/40" /> {req.issue}
                </td>
                <td className="px-6 py-4 text-ink/60">
                  <div className="font-medium text-cream">{req.property}</div>
                  <div className="text-xs">{req.tenant}</div>
                </td>
                <td className="px-6 py-4 text-ink/60">{req.date}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${req.priority === 'Urgent' ? 'text-rose-400 bg-rose-400/10 border-rose-400/20' : req.priority === 'High' ? 'text-orange-400 bg-orange-400/10 border-orange-400/20' : 'text-blue-400 bg-blue-400/10 border-blue-400/20'}`}>
                    {req.priority === 'Urgent' && <AlertCircle className="h-3 w-3 mr-1" />} {req.priority}
                  </span>
                </td>
                <td className="px-6 py-4">
                   <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${req.status === 'Resolved' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : req.status === 'In Progress' ? 'text-blue-400 bg-blue-400/10 border-blue-400/20' : 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'}`}>
                    {req.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

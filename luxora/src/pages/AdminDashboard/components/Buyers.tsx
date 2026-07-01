import { Search, Filter, MoreHorizontal, UserCheck, Clock } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';

const mockBuyers = [
  { id: 'BUY-401', name: 'Ngozi Eze', email: 'ngozi@example.com', saved: 24, joined: 'Oct 2025', lastActive: '2 hours ago', status: 'Active' },
  { id: 'BUY-402', name: 'Emeka Ike', email: 'emeka@example.com', saved: 12, joined: 'Sep 2025', lastActive: '1 day ago', status: 'Active' },
  { id: 'BUY-403', name: 'Aisha Bello', email: 'aisha@example.com', saved: 4, joined: 'Aug 2025', lastActive: '2 weeks ago', status: 'Inactive' },
];

export default function Buyers() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Buyers & Renters</h2>
          <p className="text-sm text-ink/60">Manage platform consumer accounts.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
            <input 
              type="text" 
              placeholder="Search buyers..." 
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
              <th className="px-6 py-4 font-semibold">User ID</th>
              <th className="px-6 py-4 font-semibold">Name / Email</th>
              <th className="px-6 py-4 font-semibold">Saved Properties</th>
              <th className="px-6 py-4 font-semibold">Joined / Last Active</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {mockBuyers.map((buyer) => (
              <tr key={buyer.id} className="transition-colors hover:bg-white/[0.02]">
                <td className="px-6 py-4 font-medium text-cream">{buyer.id}</td>
                <td className="px-6 py-4">
                  <div className="font-semibold text-cream">{buyer.name}</div>
                  <div className="text-xs text-ink/50">{buyer.email}</div>
                </td>
                <td className="px-6 py-4 font-semibold text-gold-400">{buyer.saved}</td>
                <td className="px-6 py-4">
                  <div className="text-ink/60">{buyer.joined}</div>
                  <div className="text-xs text-ink/40 mt-0.5">{buyer.lastActive}</div>
                </td>
                <td className="px-6 py-4">
                  {buyer.status === 'Active' ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 text-[10px] font-semibold text-emerald-400 uppercase">
                      <UserCheck className="h-3 w-3" /> Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-400/10 border border-yellow-400/20 px-2.5 py-1 text-[10px] font-semibold text-yellow-400 uppercase">
                      <Clock className="h-3 w-3" /> Inactive
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="rounded-lg p-2 text-ink/40 hover:bg-white/10 hover:text-cream transition-colors">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

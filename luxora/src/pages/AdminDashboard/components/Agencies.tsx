import { Search, Filter, MoreHorizontal, ShieldCheck, ShieldAlert } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';

const mockAgencies = [
  { id: 'AGC-101', name: 'Meridian Luxury', agents: 14, listings: 42, joined: 'Dec 2023', status: 'Verified' },
  { id: 'AGC-102', name: 'Eko Estates', agents: 8, listings: 24, joined: 'Feb 2024', status: 'Verified' },
  { id: 'AGC-103', name: 'Abuja Premier Properties', agents: 3, listings: 5, joined: 'Oct 2025', status: 'Pending Review' },
];

export default function Agencies() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Agencies Directory</h2>
          <p className="text-sm text-ink/60">Manage corporate real estate agencies on Luxora.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
            <input 
              type="text" 
              placeholder="Search agencies..." 
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
              <th className="px-6 py-4 font-semibold">Agency ID</th>
              <th className="px-6 py-4 font-semibold">Name</th>
              <th className="px-6 py-4 font-semibold">Total Agents</th>
              <th className="px-6 py-4 font-semibold">Active Listings</th>
              <th className="px-6 py-4 font-semibold">Joined Date</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {mockAgencies.map((agency) => (
              <tr key={agency.id} className="transition-colors hover:bg-white/[0.02]">
                <td className="px-6 py-4 font-medium text-cream">{agency.id}</td>
                <td className="px-6 py-4 font-semibold text-cream">{agency.name}</td>
                <td className="px-6 py-4 text-ink/60">{agency.agents}</td>
                <td className="px-6 py-4 font-semibold text-gold-400">{agency.listings}</td>
                <td className="px-6 py-4 text-ink/60">{agency.joined}</td>
                <td className="px-6 py-4">
                  {agency.status === 'Verified' ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 text-[10px] font-semibold text-emerald-400 uppercase">
                      <ShieldCheck className="h-3 w-3" /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-400/10 border border-blue-400/20 px-2.5 py-1 text-[10px] font-semibold text-blue-400 uppercase">
                      <ShieldAlert className="h-3 w-3" /> Pending
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

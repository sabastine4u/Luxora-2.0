import { Search, Filter, MoreHorizontal, UserCheck, ShieldAlert } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';

const mockAgents = [
  { id: 'AGT-001', name: 'Adaeze Okonkwo', agency: 'Meridian Luxury', deals: 42, joined: 'Jan 2024', status: 'Verified' },
  { id: 'AGT-002', name: 'Chioma Obi', agency: 'Meridian Luxury', deals: 12, joined: 'Mar 2024', status: 'Verified' },
  { id: 'AGT-003', name: 'Oluwaseun Adeyemi', agency: 'Independent', deals: 0, joined: 'Oct 2025', status: 'Pending KYC' },
];

export default function Agents() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Agents Directory</h2>
          <p className="text-sm text-ink/60">Manage real estate agents and monitor their KYC status.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
            <input 
              type="text" 
              placeholder="Search agents..." 
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
              <th className="px-6 py-4 font-semibold">Agent ID</th>
              <th className="px-6 py-4 font-semibold">Name</th>
              <th className="px-6 py-4 font-semibold">Agency Affiliation</th>
              <th className="px-6 py-4 font-semibold">Total Deals</th>
              <th className="px-6 py-4 font-semibold">Joined Date</th>
              <th className="px-6 py-4 font-semibold">KYC Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {mockAgents.map((agent) => (
              <tr key={agent.id} className="transition-colors hover:bg-white/[0.02]">
                <td className="px-6 py-4 font-medium text-cream">{agent.id}</td>
                <td className="px-6 py-4 font-semibold text-cream">{agent.name}</td>
                <td className="px-6 py-4 text-ink/60">{agent.agency}</td>
                <td className="px-6 py-4 font-semibold text-gold-400">{agent.deals}</td>
                <td className="px-6 py-4 text-ink/60">{agent.joined}</td>
                <td className="px-6 py-4">
                  {agent.status === 'Verified' ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 text-[10px] font-semibold text-emerald-400 uppercase">
                      <UserCheck className="h-3 w-3" /> Verified
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

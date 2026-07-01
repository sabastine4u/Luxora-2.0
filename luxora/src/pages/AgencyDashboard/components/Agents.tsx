import { MoreHorizontal, ShieldAlert, UserPlus, Phone, Mail } from 'lucide-react';
import { GoldButton } from '../../../components/ui/ui';
import { agentPerformance } from '../../../data/luxoraData';

export default function Agents() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Agents Roster</h2>
          <p className="text-sm text-ink/60">Manage your agency's real estate agents and their performance.</p>
        </div>
        <GoldButton className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" /> Invite Agent
        </GoldButton>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
          <div className="text-3xl font-bold text-cream">14</div>
          <div className="text-sm text-ink/60 mt-1">Total Agents</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
          <div className="text-3xl font-bold text-emerald-400">12</div>
          <div className="text-sm text-ink/60 mt-1">Active This Week</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
          <div className="text-3xl font-bold text-cream">142</div>
          <div className="text-sm text-ink/60 mt-1">Active Listings</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
          <div className="flex items-center gap-2 text-rose-400">
            <ShieldAlert className="h-5 w-5" />
            <div className="text-3xl font-bold">1</div>
          </div>
          <div className="text-sm text-ink/60 mt-1">Pending Kyc</div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-navy-800/50">
        <table className="w-full text-left text-sm">
          <thead className="bg-navy-900/50 text-xs uppercase text-ink/50 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-semibold">Agent</th>
              <th className="px-6 py-4 font-semibold">Deals Closed</th>
              <th className="px-6 py-4 font-semibold">Deal Value</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {agentPerformance.map((agent, i) => (
              <tr key={i} className="transition-colors hover:bg-white/[0.02]">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={agent.avatar} alt={agent.name} className="h-10 w-10 rounded-full object-cover border border-white/10" />
                    <div className="font-semibold text-cream">{agent.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-ink/60">{agent.deals}</td>
                <td className="px-6 py-4 font-bold text-gold-400">{agent.value}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-full bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 text-[10px] font-semibold text-emerald-400 uppercase">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="rounded-lg p-2 text-ink/40 hover:bg-gold-400/10 hover:text-gold-400 transition-colors"><Phone className="h-4 w-4" /></button>
                    <button className="rounded-lg p-2 text-ink/40 hover:bg-gold-400/10 hover:text-gold-400 transition-colors"><Mail className="h-4 w-4" /></button>
                    <button className="rounded-lg p-2 text-ink/40 hover:bg-white/10 hover:text-cream transition-colors"><MoreHorizontal className="h-4 w-4" /></button>
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

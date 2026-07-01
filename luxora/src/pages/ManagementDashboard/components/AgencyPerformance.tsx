import { Building2, Search, Filter } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';

export default function AgencyPerformance() {
  const rankings = [
    { rank: 1, name: 'Meridian Luxury', gmv: '₦8.4B', agents: 42, rating: 4.9 },
    { rank: 2, name: 'Eko Estates', gmv: '₦6.1B', agents: 28, rating: 4.8 },
    { rank: 3, name: 'Abuja Premier Properties', gmv: '₦4.2B', agents: 15, rating: 4.6 },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Agency Performance</h2>
          <p className="text-sm text-ink/60">Metrics and performance analysis for registered agencies.</p>
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
              <th className="px-6 py-4 font-semibold">Rank</th>
              <th className="px-6 py-4 font-semibold">Agency</th>
              <th className="px-6 py-4 font-semibold">Total GMV (YTD)</th>
              <th className="px-6 py-4 font-semibold">Active Agents</th>
              <th className="px-6 py-4 font-semibold">Avg Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rankings.map((agency) => (
              <tr key={agency.rank} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-medium text-cream flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-ink/40" /> #{agency.rank}
                </td>
                <td className="px-6 py-4 font-semibold text-cream">{agency.name}</td>
                <td className="px-6 py-4 font-bold text-gold-400">{agency.gmv}</td>
                <td className="px-6 py-4 text-ink/60">{agency.agents}</td>
                <td className="px-6 py-4 text-emerald-400 font-bold">{agency.rating} ★</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

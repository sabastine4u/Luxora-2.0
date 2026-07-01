import { Users, Search, Filter } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';

export default function AgentPerformance() {
  const agents = [
    { id: 'AGT-101', name: 'Chidi Okafor', agency: 'Meridian Luxury', sales: 42, rating: 4.9 },
    { id: 'AGT-102', name: 'Sarah Jacobs', agency: 'Eko Estates', sales: 38, rating: 4.8 },
    { id: 'AGT-103', name: 'Musa Bello', agency: 'Abuja Premier Properties', sales: 25, rating: 4.7 },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Agent Performance</h2>
          <p className="text-sm text-ink/60">Metrics and performance analysis for individual agents.</p>
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
              <th className="px-6 py-4 font-semibold">ID</th>
              <th className="px-6 py-4 font-semibold">Agent Name</th>
              <th className="px-6 py-4 font-semibold">Agency</th>
              <th className="px-6 py-4 font-semibold">Properties Sold</th>
              <th className="px-6 py-4 font-semibold">Avg Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {agents.map((agent) => (
              <tr key={agent.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-medium text-cream">{agent.id}</td>
                <td className="px-6 py-4 font-semibold text-cream flex items-center gap-2">
                  <Users className="h-4 w-4 text-ink/40" /> {agent.name}
                </td>
                <td className="px-6 py-4 text-ink/60">{agent.agency}</td>
                <td className="px-6 py-4 font-bold text-gold-400">{agent.sales}</td>
                <td className="px-6 py-4 text-emerald-400 font-bold">{agent.rating} ★</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

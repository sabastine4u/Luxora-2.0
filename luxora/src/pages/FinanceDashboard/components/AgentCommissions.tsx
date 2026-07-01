import { Users, Search, Download } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';

export default function AgentCommissions() {
  const commissions = [
    { id: 'AGT-COM-01', agent: 'Samuel Ojo', property: 'Lekki Phase 1 Apt', amount: '₦240,000', status: 'Paid', date: 'Oct 05, 2025' },
    { id: 'AGT-COM-02', agent: 'Chioma Eze', property: 'Victoria Island Villa', amount: '₦450,000', status: 'Pending', date: 'Oct 06, 2025' },
    { id: 'AGT-COM-03', agent: 'Tunde Bakare', property: 'Maitama Duplex', amount: '₦180,000', status: 'Paid', date: 'Oct 02, 2025' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Independent Agent Commissions</h2>
          <p className="text-sm text-ink/60">Disburse commissions to individual verified agents on the platform.</p>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input 
            type="text" 
            placeholder="Search by agent or property..." 
            className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-2 pl-9 pr-4 text-sm text-cream placeholder:text-ink/40 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50"
          />
        </div>
        <GhostButton className="px-4"><Download className="h-4 w-4 mr-2" /> Export</GhostButton>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-navy-800/50">
        <table className="w-full text-left text-sm">
          <thead className="bg-navy-900/50 text-xs uppercase text-ink/50 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-semibold">Ref ID</th>
              <th className="px-6 py-4 font-semibold">Agent Name</th>
              <th className="px-6 py-4 font-semibold">Property Sold/Rented</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Commission</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {commissions.map((com) => (
              <tr key={com.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-medium text-cream">{com.id}</td>
                <td className="px-6 py-4 font-semibold text-cream flex items-center gap-2">
                  <Users className="h-4 w-4 text-ink/40" /> {com.agent}
                </td>
                <td className="px-6 py-4 text-ink/60">{com.property}</td>
                <td className="px-6 py-4 text-ink/60">{com.date}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${com.status === 'Paid' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : 'text-blue-400 bg-blue-400/10 border-blue-400/20'}`}>
                    {com.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-bold text-gold-400">{com.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

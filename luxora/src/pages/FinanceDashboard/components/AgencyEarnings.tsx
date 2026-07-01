import { Building2, Search, Download } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';

export default function AgencyEarnings() {
  const earnings = [
    { id: 'AG-EARN-01', agency: 'Prime Real Estate', deals: 14, commission: '₦4,200,000', period: 'Sep 2025', status: 'Paid' },
    { id: 'AG-EARN-02', agency: 'Lagos Homes Ltd', deals: 8, commission: '₦1,850,000', period: 'Sep 2025', status: 'Paid' },
    { id: 'AG-EARN-03', agency: 'Abuja Elite Properties', deals: 5, commission: '₦950,000', period: 'Sep 2025', status: 'Pending' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Agency Earnings</h2>
          <p className="text-sm text-ink/60">Track and disburse agency-level commissions and platform earnings.</p>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input 
            type="text" 
            placeholder="Search by agency..." 
            className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-2 pl-9 pr-4 text-sm text-cream placeholder:text-ink/40 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50"
          />
        </div>
        <GhostButton className="px-4"><Download className="h-4 w-4 mr-2" /> Export CSV</GhostButton>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-navy-800/50">
        <table className="w-full text-left text-sm">
          <thead className="bg-navy-900/50 text-xs uppercase text-ink/50 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-semibold">Ref ID</th>
              <th className="px-6 py-4 font-semibold">Agency Name</th>
              <th className="px-6 py-4 font-semibold">Deals Closed</th>
              <th className="px-6 py-4 font-semibold">Period</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Total Commission</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {earnings.map((earn) => (
              <tr key={earn.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-medium text-cream">{earn.id}</td>
                <td className="px-6 py-4 font-semibold text-cream flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-ink/40" /> {earn.agency}
                </td>
                <td className="px-6 py-4 text-ink/60">{earn.deals}</td>
                <td className="px-6 py-4 text-ink/60">{earn.period}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${earn.status === 'Paid' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : 'text-blue-400 bg-blue-400/10 border-blue-400/20'}`}>
                    {earn.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-bold text-gold-400">{earn.commission}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

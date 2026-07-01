import { Banknote, Search, Download, CheckCircle } from 'lucide-react';
import { GoldButton, GhostButton } from '../../../components/ui/ui';

export default function OwnerPayments() {
  const payments = [
    { id: 'PAY-OW-102', owner: 'Chief Adebayo', property: 'Lekki Phase 1 Apt', amount: '₦120,000,000', period: 'Sep 2025', status: 'Cleared', date: 'Oct 05, 2025' },
    { id: 'PAY-OW-103', owner: 'Ngozi Okafor', property: 'Abuja Central Plaza', amount: '₦45,000,000', period: 'Sep 2025', status: 'Processing', date: 'Oct 06, 2025' },
    { id: 'PAY-OW-104', owner: 'David Smith', property: 'Victoria Island Villa', amount: '₦210,000,000', period: 'Sep 2025', status: 'Cleared', date: 'Oct 05, 2025' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Owner Payouts</h2>
          <p className="text-sm text-ink/60">Manage disbursements to property owners after platform fee deductions.</p>
        </div>
        <GoldButton>Process Batch Payout</GoldButton>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input 
            type="text" 
            placeholder="Search by owner or property..." 
            className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-2 pl-9 pr-4 text-sm text-cream placeholder:text-ink/40 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50"
          />
        </div>
        <GhostButton className="px-4"><Download className="h-4 w-4 mr-2" /> Export</GhostButton>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-navy-800/50">
        <table className="w-full text-left text-sm">
          <thead className="bg-navy-900/50 text-xs uppercase text-ink/50 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-semibold">Payment ID</th>
              <th className="px-6 py-4 font-semibold">Owner Name</th>
              <th className="px-6 py-4 font-semibold">Property</th>
              <th className="px-6 py-4 font-semibold">Period</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {payments.map((pay) => (
              <tr key={pay.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-medium text-cream">{pay.id}</td>
                <td className="px-6 py-4 font-semibold text-cream flex items-center gap-2">
                  <Banknote className="h-4 w-4 text-ink/40" /> {pay.owner}
                </td>
                <td className="px-6 py-4 text-ink/60">{pay.property}</td>
                <td className="px-6 py-4 text-ink/60">{pay.period}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${pay.status === 'Cleared' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : 'text-blue-400 bg-blue-400/10 border-blue-400/20'}`}>
                    {pay.status === 'Cleared' && <CheckCircle className="h-3 w-3" />} {pay.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-bold text-gold-400">{pay.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

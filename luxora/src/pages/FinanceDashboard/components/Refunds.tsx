import { MessageSquare, Search, Filter, AlertTriangle } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';

export default function Refunds() {
  const refunds = [
    { id: 'REF-0881', buyer: 'Musa Ibrahim', property: 'Abuja Central Office', amount: '₦5,000,000', reason: 'Failed Inspection', status: 'Pending Review', date: 'Oct 04, 2025' },
    { id: 'REF-0882', buyer: 'Sarah Jenkins', property: 'Lekki Studio Apt', amount: '₦150,000', reason: 'Booking Cancelled (Within 24h)', status: 'Processed', date: 'Oct 01, 2025' },
    { id: 'REF-0883', buyer: 'John Doe', property: 'Victoria Island Villa', amount: '₦10,000,000', reason: 'Mortgage Declined', status: 'Rejected', date: 'Sep 25, 2025' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Disputes & Refunds</h2>
          <p className="text-sm text-ink/60">Review, approve, or reject buyer refund requests.</p>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input 
            type="text" 
            placeholder="Search by buyer or property..." 
            className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-2 pl-9 pr-4 text-sm text-cream placeholder:text-ink/40 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50"
          />
        </div>
        <GhostButton className="px-4"><Filter className="h-4 w-4 mr-2" /> Filter</GhostButton>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-navy-800/50">
        <table className="w-full text-left text-sm">
          <thead className="bg-navy-900/50 text-xs uppercase text-ink/50 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-semibold">Ref ID</th>
              <th className="px-6 py-4 font-semibold">Buyer Name</th>
              <th className="px-6 py-4 font-semibold">Property</th>
              <th className="px-6 py-4 font-semibold">Reason</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {refunds.map((ref) => (
              <tr key={ref.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-medium text-cream">{ref.id}</td>
                <td className="px-6 py-4 font-semibold text-cream flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-ink/40" /> {ref.buyer}
                </td>
                <td className="px-6 py-4 text-ink/60">{ref.property}</td>
                <td className="px-6 py-4 text-ink/60">{ref.reason}</td>
                <td className="px-6 py-4">
                  {ref.status === 'Pending Review' ? (
                     <span className="inline-flex items-center gap-1 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase text-yellow-400">
                       <AlertTriangle className="h-3 w-3" /> {ref.status}
                     </span>
                  ) : (
                     <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${ref.status === 'Processed' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : 'text-rose-400 bg-rose-400/10 border-rose-400/20'}`}>
                       {ref.status}
                     </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right font-bold text-rose-400">{ref.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

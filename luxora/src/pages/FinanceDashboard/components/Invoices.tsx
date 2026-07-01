import { FileText, Search, Download, Plus } from 'lucide-react';
import { GoldButton, GhostButton } from '../../../components/ui/ui';

export default function Invoices() {
  const invoices = [
    { id: 'INV-FIN-9901', client: 'Lagos Homes Ltd', type: 'Agency Subscription (Annual)', amount: '₦500,000', status: 'Paid', date: 'Oct 01, 2025' },
    { id: 'INV-FIN-9902', client: 'David Smith', type: 'Premium Listing Fee', amount: '₦25,000', status: 'Overdue', date: 'Sep 15, 2025' },
    { id: 'INV-FIN-9903', client: 'Prime Real Estate', type: 'API Access Tier 2', amount: '₦150,000', status: 'Unpaid', date: 'Oct 05, 2025' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Client & Agency Invoices</h2>
          <p className="text-sm text-ink/60">Manage accounts receivable, subscriptions, and listing fees.</p>
        </div>
        <GoldButton className="flex items-center gap-2"><Plus className="h-4 w-4" /> Create Invoice</GoldButton>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input 
            type="text" 
            placeholder="Search invoices..." 
            className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-2 pl-9 pr-4 text-sm text-cream placeholder:text-ink/40 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50"
          />
        </div>
        <GhostButton className="px-4"><Download className="h-4 w-4 mr-2" /> Export</GhostButton>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-navy-800/50">
        <table className="w-full text-left text-sm">
          <thead className="bg-navy-900/50 text-xs uppercase text-ink/50 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-semibold">Invoice No.</th>
              <th className="px-6 py-4 font-semibold">Billed To</th>
              <th className="px-6 py-4 font-semibold">Description</th>
              <th className="px-6 py-4 font-semibold">Date Issued</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-medium text-cream">{inv.id}</td>
                <td className="px-6 py-4 font-semibold text-cream flex items-center gap-2">
                  <FileText className="h-4 w-4 text-ink/40" /> {inv.client}
                </td>
                <td className="px-6 py-4 text-ink/60">{inv.type}</td>
                <td className="px-6 py-4 text-ink/60">{inv.date}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${inv.status === 'Paid' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : inv.status === 'Unpaid' ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' : 'text-rose-400 bg-rose-400/10 border-rose-400/20'}`}>
                    {inv.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-bold text-gold-400">{inv.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

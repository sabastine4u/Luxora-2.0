import { FileBarChart, Search, Filter, Download } from 'lucide-react';

export default function Invoices() {
  const invoices = [
    { id: 'INV-2025-099', vendor: 'Amazon Web Services', amount: '₦14,500,000', date: 'Oct 05, 2025', due: 'Oct 15, 2025', status: 'Unpaid' },
    { id: 'INV-2025-098', vendor: 'Global Tech Supplies', amount: '₦8,500,000', date: 'Sep 28, 2025', due: 'Oct 12, 2025', status: 'Processing' },
    { id: 'INV-2025-097', vendor: 'Office World', amount: '₦450,000', date: 'Sep 15, 2025', due: 'Sep 30, 2025', status: 'Paid' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Vendor Invoices</h2>
          <p className="text-sm text-ink/60">Manage accounts payable and invoice approvals.</p>
        </div>
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
        <button className="flex items-center justify-center rounded-xl border border-white/10 bg-navy-900/80 px-4 text-sm text-cream hover:bg-white/5 transition-colors">
          <Filter className="h-4 w-4 mr-2" /> Status
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-navy-800/50">
        <table className="w-full text-left text-sm">
          <thead className="bg-navy-900/50 text-xs uppercase text-ink/50 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-semibold">Invoice ID</th>
              <th className="px-6 py-4 font-semibold">Vendor</th>
              <th className="px-6 py-4 font-semibold">Amount</th>
              <th className="px-6 py-4 font-semibold">Date Issued</th>
              <th className="px-6 py-4 font-semibold">Due Date</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-medium text-cream flex items-center gap-2">
                  <FileBarChart className="h-4 w-4 text-ink/40" /> {inv.id}
                </td>
                <td className="px-6 py-4 text-ink/60">{inv.vendor}</td>
                <td className="px-6 py-4 font-bold text-gold-400">{inv.amount}</td>
                <td className="px-6 py-4 text-ink/60">{inv.date}</td>
                <td className={`px-6 py-4 ${inv.status === 'Unpaid' ? 'text-rose-400 font-medium' : 'text-ink/60'}`}>{inv.due}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${inv.status === 'Paid' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : inv.status === 'Processing' ? 'text-blue-400 bg-blue-400/10 border-blue-400/20' : 'text-rose-400 bg-rose-400/10 border-rose-400/20'}`}>
                    {inv.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                   <button className="text-gold-400 hover:bg-gold-400/10 p-2 rounded-lg transition-colors"><Download className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

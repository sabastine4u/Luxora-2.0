import { ShoppingCart, Search, Filter, Download } from 'lucide-react';
import { GoldButton } from '../../../components/ui/ui';

export default function PurchaseOrders() {
  const orders = [
    { id: 'PO-9921', vendor: 'Global Tech Supplies', item: 'Dell XPS Laptops (x5)', amount: '₦8,500,000', status: 'Fulfilled', date: 'Sep 15, 2025' },
    { id: 'PO-9922', vendor: 'Office World', item: 'Printer Ink & Toner', amount: '₦450,000', status: 'In Transit', date: 'Oct 01, 2025' },
    { id: 'PO-9923', vendor: 'SecureNet Solutions', item: 'CCTV Installation', amount: '₦2,100,000', status: 'Processing', date: 'Oct 03, 2025' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Purchase Orders (PO)</h2>
          <p className="text-sm text-ink/60">Track external orders sent to vendors.</p>
        </div>
        <GoldButton>Create PO</GoldButton>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input 
            type="text" 
            placeholder="Search POs..." 
            className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-2 pl-9 pr-4 text-sm text-cream placeholder:text-ink/40 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50"
          />
        </div>
        <button className="flex items-center justify-center rounded-xl border border-white/10 bg-navy-900/80 px-4 text-sm text-cream hover:bg-white/5 transition-colors">
          <Filter className="h-4 w-4 mr-2" /> Filter
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-navy-800/50">
        <table className="w-full text-left text-sm">
          <thead className="bg-navy-900/50 text-xs uppercase text-ink/50 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-semibold">PO Number</th>
              <th className="px-6 py-4 font-semibold">Vendor</th>
              <th className="px-6 py-4 font-semibold">Description</th>
              <th className="px-6 py-4 font-semibold">Total Amount</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {orders.map((po) => (
              <tr key={po.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-medium text-cream">{po.id}</td>
                <td className="px-6 py-4 text-ink/60">{po.vendor}</td>
                <td className="px-6 py-4 font-semibold text-cream flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-ink/40" /> {po.item}
                </td>
                <td className="px-6 py-4 font-bold text-gold-400">{po.amount}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${po.status === 'Fulfilled' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : po.status === 'In Transit' ? 'text-blue-400 bg-blue-400/10 border-blue-400/20' : 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'}`}>
                    {po.status}
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

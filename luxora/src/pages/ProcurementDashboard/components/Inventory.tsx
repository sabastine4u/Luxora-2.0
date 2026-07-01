import { Package, Search, Filter, AlertTriangle } from 'lucide-react';
import { GoldButton } from '../../../components/ui/ui';

export default function Inventory() {
  const items = [
    { sku: 'INV-A101', item: 'A4 Printing Paper', category: 'Stationery', stock: 120, minLevel: 50, status: 'Healthy' },
    { sku: 'INV-A102', item: 'Black Ink Cartridges', category: 'Stationery', stock: 4, minLevel: 10, status: 'Low Stock' },
    { sku: 'INV-T201', item: 'Logitech Wireless Mouse', category: 'IT Accessories', stock: 15, minLevel: 10, status: 'Healthy' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Consumables Inventory</h2>
          <p className="text-sm text-ink/60">Track stock levels for office supplies and small accessories.</p>
        </div>
        <GoldButton>Update Stock</GoldButton>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input 
            type="text" 
            placeholder="Search items..." 
            className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-2 pl-9 pr-4 text-sm text-cream placeholder:text-ink/40 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50"
          />
        </div>
        <button className="flex items-center justify-center rounded-xl border border-white/10 bg-navy-900/80 px-4 text-sm text-cream hover:bg-white/5 transition-colors">
          <Filter className="h-4 w-4 mr-2" /> Low Stock
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-navy-800/50">
        <table className="w-full text-left text-sm">
          <thead className="bg-navy-900/50 text-xs uppercase text-ink/50 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-semibold">SKU</th>
              <th className="px-6 py-4 font-semibold">Item Name</th>
              <th className="px-6 py-4 font-semibold">Category</th>
              <th className="px-6 py-4 font-semibold">Current Stock</th>
              <th className="px-6 py-4 font-semibold">Min Level</th>
              <th className="px-6 py-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {items.map((item) => (
              <tr key={item.sku} className={`hover:bg-white/[0.02] transition-colors ${item.status === 'Low Stock' ? 'bg-rose-400/[0.02]' : ''}`}>
                <td className="px-6 py-4 font-medium text-cream">{item.sku}</td>
                <td className="px-6 py-4 font-semibold text-cream flex items-center gap-2">
                  <Package className="h-4 w-4 text-ink/40" /> {item.item}
                </td>
                <td className="px-6 py-4 text-ink/60">{item.category}</td>
                <td className={`px-6 py-4 font-bold ${item.status === 'Low Stock' ? 'text-rose-400' : 'text-cream'}`}>{item.stock}</td>
                <td className="px-6 py-4 text-ink/60">{item.minLevel}</td>
                <td className="px-6 py-4">
                  {item.status === 'Low Stock' ? (
                     <span className="inline-flex items-center gap-1 rounded-full border border-rose-400/20 bg-rose-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase text-rose-400">
                       <AlertTriangle className="h-3 w-3" /> Reorder
                     </span>
                  ) : (
                     <span className="inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase text-emerald-400">
                       Healthy
                     </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { Package, AlertTriangle, Filter } from 'lucide-react';
import { GoldButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';

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

      <DataTableToolbar
        searchValue=""
        onSearchChange={() => {}}
        searchPlaceholder="Search items..."
        actions={
          <button className="flex items-center justify-center rounded-xl border border-white/10 bg-navy-900/80 px-4 text-sm text-cream hover:bg-white/5 transition-colors">
            <Filter className="h-4 w-4 mr-2" /> Low Stock
          </button>
        }
      />

      <DataTable
        data={items}
        keyExtractor={(item) => item.sku}
        columns={[
          {
            header: "SKU",
            render: (item) => <span className="font-medium text-cream">{item.sku}</span>
          },
          {
            header: "Item Name",
            render: (item) => (
              <div className="font-semibold text-cream flex items-center gap-2">
                <Package className="h-4 w-4 text-ink/40" /> {item.item}
              </div>
            )
          },
          {
            header: "Category",
            render: (item) => <span className="text-ink/60">{item.category}</span>
          },
          {
            header: "Current Stock",
            render: (item) => <span className={`font-bold ${item.status === 'Low Stock' ? 'text-rose-400' : 'text-cream'}`}>{item.stock}</span>
          },
          {
            header: "Min Level",
            render: (item) => <span className="text-ink/60">{item.minLevel}</span>
          },
          {
            header: "Status",
            render: (item) => (
              item.status === 'Low Stock' ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-rose-400/20 bg-rose-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase text-rose-400">
                  <AlertTriangle className="h-3 w-3" /> Reorder
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase text-emerald-400">
                  Healthy
                </span>
              )
            )
          }
        ]}
      />
    </div>
  );
}

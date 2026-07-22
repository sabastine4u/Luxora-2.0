import { useState } from 'react';
import { Download, ShoppingCart, Eye, Truck, UserPlus } from 'lucide-react';
import { GoldButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { useWorkflowToast } from '../utils/workflowUtils';

export default function PurchaseOrders() {
  const [searchQuery, setSearchQuery] = useState('');
  const { showWorkflowToast } = useWorkflowToast();

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
        <GoldButton onClick={() => showWorkflowToast('Create PO')}>Create PO</GoldButton>
      </div>

      <DataTableToolbar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search POs..."
        showFilter
      />

      <DataTable
        data={orders}
        keyExtractor={(po) => po.id}
        columns={[
          {
            header: "PO Number",
            render: (po) => <span className="font-medium text-cream">{po.id}</span>
          },
          {
            header: "Vendor",
            render: (po) => <span className="text-ink/60">{po.vendor}</span>
          },
          {
            header: "Description",
            render: (po) => (
              <div className="font-semibold text-cream flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-ink/40" /> {po.item}
              </div>
            )
          },
          {
            header: "Total Amount",
            render: (po) => <span className="font-bold text-gold-400">{po.amount}</span>
          },
          {
            header: "Status",
            render: (po) => (
              <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${po.status === 'Fulfilled' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : po.status === 'In Transit' ? 'text-blue-400 bg-blue-400/10 border-blue-400/20' : 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'}`}>
                {po.status}
              </span>
            )
          },
          {
            header: <div className="text-right">Actions</div>,
            className: "text-right",
            render: () => (
              <div className="flex justify-end gap-2">
                <button 
                  className="text-gold-400 hover:bg-gold-400/10 p-2 rounded-lg transition-colors"
                  onClick={() => showWorkflowToast('View Details')}
                ><Eye className="h-4 w-4" /></button>
                <button 
                  className="text-blue-400 hover:bg-blue-400/10 p-2 rounded-lg transition-colors"
                  onClick={() => showWorkflowToast('Track Delivery')}
                ><Truck className="h-4 w-4" /></button>
                <button 
                  className="text-emerald-400 hover:bg-emerald-400/10 p-2 rounded-lg transition-colors"
                  onClick={() => showWorkflowToast('Assign Vendor')}
                ><UserPlus className="h-4 w-4" /></button>
                <button 
                  className="text-gold-400 hover:bg-gold-400/10 p-2 rounded-lg transition-colors"
                  onClick={() => showWorkflowToast('Download PO')}
                ><Download className="h-4 w-4" /></button>
              </div>
            )
          }
        ]}
      />
    </div>
  );
}

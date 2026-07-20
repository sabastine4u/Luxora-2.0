import { FileText, Download, Plus } from 'lucide-react';
import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { publishEvent } from '../../../modules/enterprise/events/publishEvent';
import { ENTERPRISE_EVENTS } from '../../../modules/enterprise/events/registry';

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
        <GoldButton className="flex items-center gap-2" onClick={() => {
          console.log('[Backend Simulation] Generating invoice...');
          setTimeout(() => {
            publishEvent(ENTERPRISE_EVENTS.FINANCE_INVOICE_GENERATED, {
              invoiceId: `INV-FIN-${Math.floor(1000 + Math.random() * 9000)}`,
              creatorId: 'current-user-finance',
              timestamp: new Date().toISOString()
            });
            alert('Success: Invoice Generated');
          }, 500);
        }}><Plus className="h-4 w-4" /> Create Invoice</GoldButton>
      </div>

      <DataTableToolbar
        searchValue=""
        onSearchChange={() => {}}
        searchPlaceholder="Search invoices..."
        actions={
          <GhostButton className="px-4"><Download className="h-4 w-4 mr-2" /> Export</GhostButton>
        }
      />

      <DataTable
        data={invoices}
        keyExtractor={(inv) => inv.id}
        columns={[
          {
            header: "Invoice No.",
            render: (inv) => <span className="font-medium text-cream">{inv.id}</span>
          },
          {
            header: "Billed To",
            render: (inv) => (
              <div className="font-semibold text-cream flex items-center gap-2">
                <FileText className="h-4 w-4 text-ink/40" /> {inv.client}
              </div>
            )
          },
          {
            header: "Description",
            render: (inv) => <span className="text-ink/60">{inv.type}</span>
          },
          {
            header: "Date Issued",
            render: (inv) => <span className="text-ink/60">{inv.date}</span>
          },
          {
            header: "Status",
            render: (inv) => (
              <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${inv.status === 'Paid' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : inv.status === 'Unpaid' ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' : 'text-rose-400 bg-rose-400/10 border-rose-400/20'}`}>
                {inv.status}
              </span>
            )
          },
          {
            header: <div className="text-right">Amount</div>,
            className: "text-right font-bold text-gold-400",
            render: (inv) => inv.amount
          }
        ]}
      />
    </div>
  );
}

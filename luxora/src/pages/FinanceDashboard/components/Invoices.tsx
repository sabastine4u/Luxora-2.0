import { useState } from 'react';
import { FileText, Plus, Send } from 'lucide-react';
import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { EnterpriseStatusBadge, EnterpriseExportMenu, EnterpriseDetailDrawer } from '../../../components/enterprise';
import { Modal } from '../../../components/ui/Modal';
import { useToast } from '../../../contexts/ToastContext';

interface InvoiceItem {
  id: string;
  client: string;
  type: string;
  amount: string;
  status: string;
  date: string;
  dueDate: string;
}

export default function Invoices() {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [selectedInv, setSelectedInv] = useState<InvoiceItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleAction = (action: string) => {
    showToast({ type: 'success', title: 'Backend Integration', description: `This feature (${action}) is ready and will become fully functional during backend integration.` });
  };

  const invoices = [
    { id: 'INV-FIN-9901', client: 'Lagos Homes Ltd', type: 'Agency Subscription (Annual)', amount: '₦500,000', status: 'Paid', date: 'Oct 01, 2026', dueDate: 'Oct 15, 2026' },
    { id: 'INV-FIN-9902', client: 'David Smith', type: 'Premium Listing Fee', amount: '₦25,000', status: 'Overdue', date: 'Sep 15, 2026', dueDate: 'Sep 30, 2026' },
    { id: 'INV-FIN-9903', client: 'Prime Real Estate', type: 'API Access Tier 2', amount: '₦150,000', status: 'Unpaid', date: 'Oct 05, 2026', dueDate: 'Oct 20, 2026' },
    { id: 'INV-FIN-9904', client: 'Chioma Eze', type: 'Featured Agent Listing', amount: '₦50,000', status: 'Draft', date: 'Oct 10, 2026', dueDate: 'Oct 24, 2026' },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Client & Agency Invoices</h2>
          <p className="text-sm text-ink/60">Manage accounts receivable, subscriptions, and listing fees.</p>
        </div>
        <div className="flex gap-3">
          <EnterpriseExportMenu onExport={(f) => handleAction(`Export as ${f.toUpperCase()}`)} />
          <GoldButton className="flex items-center gap-2" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4" /> Create Invoice
          </GoldButton>
        </div>
      </div>

      <div className="space-y-4">
        <DataTableToolbar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search invoices..."
          showFilter
          onFilter={() => handleAction('Filter Invoices')}
        />

        <DataTable
          data={invoices.filter(i => i.client.toLowerCase().includes(search.toLowerCase()) || i.id.toLowerCase().includes(search.toLowerCase()))}
          keyExtractor={(inv) => inv.id}
          onRowClick={(inv) => { setSelectedInv(inv); setIsDrawerOpen(true); }}
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
              render: (inv) => <EnterpriseStatusBadge status={inv.status} />
            },
            {
              header: <div className="text-right">Amount</div>,
              className: "text-right font-bold text-gold-400",
              render: (inv) => inv.amount
            }
          ]}
        />
      </div>

      <EnterpriseDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Invoice Details"
        subtitle={selectedInv?.id}
        footerActions={
          <>
            <GhostButton onClick={() => handleAction('Download PDF')}>Download PDF</GhostButton>
            {selectedInv?.status === 'Draft' && (
              <GoldButton className="flex items-center gap-2" onClick={() => handleAction('Send Invoice')}>
                <Send className="h-4 w-4" /> Send Invoice
              </GoldButton>
            )}
            {selectedInv?.status === 'Overdue' && (
              <GoldButton className="flex items-center gap-2" onClick={() => handleAction('Send Reminder')}>
                <Send className="h-4 w-4" /> Send Reminder
              </GoldButton>
            )}
          </>
        }
      >
        {selectedInv && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink/60">Status</span>
              <EnterpriseStatusBadge status={selectedInv.status} />
            </div>
            
            <div className="space-y-4 rounded-xl border border-white/10 bg-navy-900/50 p-4">
              <div className="flex justify-between">
                <span className="text-sm text-ink/60">Billed To</span>
                <span className="text-sm font-medium text-cream">{selectedInv.client}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-ink/60">Date Issued</span>
                <span className="text-sm font-medium text-cream">{selectedInv.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-ink/60">Due Date</span>
                <span className={`text-sm font-medium ${selectedInv.status === 'Overdue' ? 'text-rose-400' : 'text-cream'}`}>{selectedInv.dueDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-ink/60">Description</span>
                <span className="text-sm font-medium text-cream text-right ml-4">{selectedInv.type}</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-4 mt-4">
                <span className="text-sm font-bold text-cream">Total Amount</span>
                <span className="text-lg font-bold text-gold-400">{selectedInv.amount}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-cream">Timeline</h4>
              <div className="border-l border-white/10 ml-2 pl-4 py-2 space-y-4">
                <div>
                  <p className="text-xs text-ink/40">Today</p>
                  <p className="text-sm text-cream">Viewed by client</p>
                </div>
                <div>
                  <p className="text-xs text-ink/40">{selectedInv.date}</p>
                  <p className="text-sm text-cream">Invoice created</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </EnterpriseDetailDrawer>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Invoice"
        size="2xl"
        actionButton={
          <GoldButton onClick={() => { handleAction('Save as Draft'); setIsCreateModalOpen(false); }}>
            Save as Draft
          </GoldButton>
        }
      >
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Client Name</label>
              <input 
                type="text" 
                placeholder="Select or enter client name"
                className="w-full rounded-xl border border-white/10 bg-navy-900/80 px-4 py-2 text-sm text-cream placeholder:text-ink/40 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Due Date</label>
              <input 
                type="date" 
                className="w-full rounded-xl border border-white/10 bg-navy-900/80 px-4 py-2 text-sm text-cream placeholder:text-ink/40 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Description</label>
            <input 
              type="text" 
              placeholder="e.g. Premium Listing Subscription"
              className="w-full rounded-xl border border-white/10 bg-navy-900/80 px-4 py-2 text-sm text-cream placeholder:text-ink/40 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Amount (₦)</label>
            <input 
              type="number" 
              placeholder="0.00"
              className="w-full rounded-xl border border-white/10 bg-navy-900/80 px-4 py-2 text-sm text-cream placeholder:text-ink/40 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

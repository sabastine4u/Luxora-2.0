import { useState } from 'react';
import { Landmark, FileSignature, Upload } from 'lucide-react';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { EnterpriseStatusBadge, EnterpriseExportMenu, EnterpriseDetailDrawer } from '../../../components/enterprise';
import { Modal } from '../../../components/ui/Modal';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { useToast } from '../../../contexts/ToastContext';

interface TaxItem {
  id: string;
  type: string;
  period: string;
  amount: string;
  status: string;
  dueDate: string;
  authority: string;
}

export default function TaxCenter() {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [selectedTax, setSelectedTax] = useState<TaxItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);

  const handleAction = (action: string) => {
    showToast({ type: 'success', title: 'Backend Integration', description: `This feature (${action}) is ready and will become fully functional during backend integration.` });
  };

  const taxes = [
    { id: 'TAX-001', type: 'Value Added Tax (VAT)', period: 'Q3 2026', amount: '₦12,500,000', status: 'Pending', dueDate: 'Oct 21, 2026', authority: 'FIRS' },
    { id: 'TAX-002', type: 'Withholding Tax (WHT)', period: 'Sep 2026', amount: '₦4,200,000', status: 'Remitted', dueDate: 'Oct 15, 2026', authority: 'LIRS' },
    { id: 'TAX-003', type: 'PAYE Tax', period: 'Sep 2026', amount: '₦5,800,000', status: 'Remitted', dueDate: 'Oct 10, 2026', authority: 'LIRS' },
    { id: 'TAX-004', type: 'Company Income Tax', period: 'FY 2025', amount: '₦45,000,000', status: 'Filed', dueDate: 'Jun 30, 2026', authority: 'FIRS' },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Tax Center</h2>
          <p className="text-sm text-ink/60">Manage corporate tax compliance, filings, and remittances.</p>
        </div>
        <div className="flex gap-3">
          <EnterpriseExportMenu onExport={(f) => handleAction(`Export Tax Records as ${f.toUpperCase()}`)} />
          <GoldButton onClick={() => setIsFileModalOpen(true)}>
            <FileSignature className="h-4 w-4 mr-2" /> File Tax Return
          </GoldButton>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <KPICard 
          title="Total Tax Remitted (YTD)"
          value="₦85.4M"
          icon={Landmark}
          trend="+14% YoY"
          trendColor="text-emerald-400"
          iconColor="text-gold-400"
          backgroundColor="bg-gold-400/10"
        />
        <KPICard 
          title="Pending Tax Liabilities"
          value="₦12.5M"
          icon={Landmark}
          trend="Due in 5 days"
          trendColor="text-rose-400"
          iconColor="text-rose-400"
          backgroundColor="bg-rose-400/10"
        />
        <KPICard 
          title="Compliance Status"
          value="100%"
          icon={FileSignature}
          trend="All filings up to date"
          trendColor="text-emerald-400"
          iconColor="text-blue-400"
          backgroundColor="bg-blue-400/10"
        />
      </div>

      <div className="space-y-4">
        <DataTableToolbar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by tax type or authority..."
          showFilter
          onFilter={() => handleAction('Filter Tax Records')}
        />

        <DataTable
          data={taxes.filter(t => t.type.toLowerCase().includes(search.toLowerCase()) || t.authority.toLowerCase().includes(search.toLowerCase()))}
          keyExtractor={(tax) => tax.id}
          onRowClick={(tax: TaxItem) => { setSelectedTax(tax); setIsDrawerOpen(true); }}
          columns={[
            {
              header: "Ref ID",
              render: (tax) => <span className="font-medium text-cream">{tax.id}</span>
            },
            {
              header: "Tax Type",
              render: (tax) => (
                <div className="font-semibold text-cream flex items-center gap-2">
                  <Landmark className="h-4 w-4 text-ink/40" /> {tax.type}
                </div>
              )
            },
            {
              header: "Authority",
              render: (tax) => <span className="text-ink/60">{tax.authority}</span>
            },
            {
              header: "Period",
              render: (tax) => <span className="text-ink/60">{tax.period}</span>
            },
            {
              header: "Due Date",
              render: (tax) => <span className={`text-sm ${tax.status === 'Pending' ? 'text-rose-400 font-medium' : 'text-ink/60'}`}>{tax.dueDate}</span>
            },
            {
              header: "Status",
              render: (tax) => <EnterpriseStatusBadge status={tax.status} />
            },
            {
              header: <div className="text-right">Amount</div>,
              className: "text-right font-bold text-gold-400",
              render: (tax) => tax.amount
            }
          ]}
        />
      </div>

      <EnterpriseDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Tax Record Details"
        subtitle={selectedTax?.id}
        footerActions={
          <>
            <GhostButton onClick={() => handleAction('Download Receipt/Certificate')}>Download Certificate</GhostButton>
            {selectedTax?.status === 'Pending' && (
              <GoldButton onClick={() => handleAction('Remit Payment')}>Remit Payment</GoldButton>
            )}
          </>
        }
      >
        {selectedTax && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink/60">Status</span>
              <EnterpriseStatusBadge status={selectedTax.status} />
            </div>
            
            <div className="space-y-4 rounded-xl border border-white/10 bg-navy-900/50 p-4">
              <div className="flex justify-between">
                <span className="text-sm text-ink/60">Tax Type</span>
                <span className="text-sm font-medium text-cream">{selectedTax.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-ink/60">Authority</span>
                <span className="text-sm font-medium text-cream">{selectedTax.authority}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-ink/60">Period</span>
                <span className="text-sm font-medium text-cream">{selectedTax.period}</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-4 mt-4">
                <span className="text-sm font-bold text-cream">Tax Liability</span>
                <span className="text-lg font-bold text-gold-400">{selectedTax.amount}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-cream">Attached Documents</h4>
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-navy-900/50 p-3 hover:bg-white/5 transition-colors cursor-pointer" onClick={() => handleAction('View Document')}>
                 <FileSignature className="h-4 w-4 text-ink/40" />
                 <span className="text-sm text-cream flex-1">{selectedTax.type === 'Value Added Tax (VAT)' ? 'Q3_VAT_Computation.xlsx' : 'Payment_Receipt.pdf'}</span>
                 <span className="text-xs text-ink/40">45 KB</span>
              </div>
            </div>
          </div>
        )}
      </EnterpriseDetailDrawer>

      <Modal
        isOpen={isFileModalOpen}
        onClose={() => setIsFileModalOpen(false)}
        title="File Tax Return"
        size="md"
        actionButton={
          <GoldButton onClick={() => { handleAction('Submit Tax Return'); setIsFileModalOpen(false); }}>
            Submit Filing
          </GoldButton>
        }
      >
        <div className="space-y-6">
          <p className="text-sm text-ink/60">
            Submit a new tax filing or remittance record for approval and processing.
          </p>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Tax Type</label>
            <select className="w-full rounded-xl border border-white/10 bg-navy-900/80 px-4 py-2 text-sm text-cream focus:border-gold-400/50 focus:outline-none appearance-none">
              <option>Value Added Tax (VAT)</option>
              <option>Withholding Tax (WHT)</option>
              <option>PAYE Tax</option>
              <option>Company Income Tax (CIT)</option>
              <option>Education Tax</option>
            </select>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
             <div className="space-y-1.5">
               <label className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Period</label>
               <input 
                 type="text" 
                 placeholder="e.g. Q4 2026"
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
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Upload Computation/Evidence</label>
            <div 
              className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 bg-navy-900/50 p-6 cursor-pointer hover:bg-white/5 transition-colors"
              onClick={() => handleAction('Select File')}
            >
              <Upload className="h-6 w-6 text-ink/40" />
              <span className="text-sm text-cream">Click to upload files</span>
              <span className="text-xs text-ink/40">PDF, Excel, or CSV (Max 5MB)</span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

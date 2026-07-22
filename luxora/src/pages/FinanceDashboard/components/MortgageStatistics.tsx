import { useState } from 'react';
import { Home, Percent, TrendingUp } from 'lucide-react';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { EnterpriseStatusBadge, EnterpriseDetailDrawer, EnterpriseExportMenu } from '../../../components/enterprise';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { Modal } from '../../../components/ui/Modal';
import { useToast } from '../../../contexts/ToastContext';

interface MortgageItem {
  id: string;
  applicant: string;
  bank: string;
  amount: string;
  rate: string;
  status: string;
  date: string;
}

export default function MortgageStatistics() {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [selectedMtg, setSelectedMtg] = useState<MortgageItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  const handleAction = (action: string) => {
    showToast({ type: 'success', title: 'Backend Integration', description: `This feature (${action}) is ready and will become fully functional during backend integration.` });
  };

  const mortgages = [
    { id: 'MTG-001', applicant: 'Chinedu Eze', bank: 'Zenith Bank', amount: '₦45,000,000', rate: '14.5%', status: 'Approved', date: 'Oct 02, 2026' },
    { id: 'MTG-002', applicant: 'Amina Bello', bank: 'GTBank', amount: '₦120,000,000', rate: '15.2%', status: 'Underwriting', date: 'Oct 05, 2026' },
    { id: 'MTG-003', applicant: 'Emeka Uzo', bank: 'Access Bank', amount: '₦35,000,000', rate: '16.0%', status: 'Declined', date: 'Sep 28, 2026' },
    { id: 'MTG-004', applicant: 'Sarah Jenkins', bank: 'First Bank', amount: '₦80,000,000', rate: '14.0%', status: 'Processing', date: 'Oct 10, 2026' },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Mortgage Statistics</h2>
          <p className="text-sm text-ink/60">Monitor loan applications routed through Luxora partner banks.</p>
        </div>
        <div className="flex gap-3">
          <EnterpriseExportMenu onExport={(f) => handleAction(`Export as ${f.toUpperCase()}`)} />
          <GoldButton onClick={() => setIsCalculatorOpen(true)}>Loan Calculator</GoldButton>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <KPICard 
          title="Total Loan Volume"
          value="₦2.4B"
          icon={TrendingUp}
          trend="+12%"
          trendColor="text-emerald-400"
          iconColor="text-emerald-400"
          backgroundColor="bg-emerald-400/10"
        />
        <KPICard 
          title="Active Applications"
          value="45"
          icon={Home}
          trend="+5"
          trendColor="text-emerald-400"
          iconColor="text-gold-400"
          backgroundColor="bg-gold-400/10"
        />
        <KPICard 
          title="Average Approval Rate"
          value="68%"
          icon={Percent}
          trend="+2.4%"
          trendColor="text-emerald-400"
          iconColor="text-blue-400"
          backgroundColor="bg-blue-400/10"
        />
      </div>

      <div className="space-y-4">
        <DataTableToolbar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by applicant or bank..."
          showFilter
          onFilter={() => handleAction('Filter Applications')}
        />

        <DataTable
          data={mortgages.filter(m => m.applicant.toLowerCase().includes(search.toLowerCase()) || m.bank.toLowerCase().includes(search.toLowerCase()))}
          keyExtractor={(mtg) => mtg.id}
          onRowClick={(mtg) => { setSelectedMtg(mtg); setIsDrawerOpen(true); }}
          columns={[
            {
              header: "App ID",
              render: (mtg) => <span className="font-medium text-cream">{mtg.id}</span>
            },
            {
              header: "Applicant",
              render: (mtg) => (
                <div className="font-semibold text-cream flex items-center gap-2">
                  <Home className="h-4 w-4 text-ink/40" /> {mtg.applicant}
                </div>
              )
            },
            {
              header: "Partner Bank",
              render: (mtg) => <span className="text-ink/60">{mtg.bank}</span>
            },
            {
              header: "Rate",
              render: (mtg) => <span className="text-ink/60">{mtg.rate}</span>
            },
            {
              header: "Status",
              render: (mtg) => <EnterpriseStatusBadge status={mtg.status} />
            },
            {
              header: <div className="text-right">Requested Amount</div>,
              className: "text-right font-bold text-gold-400",
              render: (mtg) => mtg.amount
            }
          ]}
        />
      </div>

      <EnterpriseDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Application Details"
        subtitle={selectedMtg?.id}
        footerActions={
          <>
            <GhostButton onClick={() => handleAction('View Documents')}>View Documents</GhostButton>
            <GoldButton onClick={() => handleAction('Contact Bank')}>Contact Bank</GoldButton>
          </>
        }
      >
        {selectedMtg && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink/60">Status</span>
              <EnterpriseStatusBadge status={selectedMtg.status} />
            </div>
            
            <div className="space-y-4 rounded-xl border border-white/10 bg-navy-900/50 p-4">
              <div className="flex justify-between">
                <span className="text-sm text-ink/60">Date Applied</span>
                <span className="text-sm font-medium text-cream">{selectedMtg.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-ink/60">Applicant</span>
                <span className="text-sm font-medium text-cream">{selectedMtg.applicant}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-ink/60">Bank</span>
                <span className="text-sm font-medium text-cream">{selectedMtg.bank}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-ink/60">Interest Rate</span>
                <span className="text-sm font-medium text-cream">{selectedMtg.rate}</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-4 mt-4">
                <span className="text-sm font-bold text-cream">Requested Amount</span>
                <span className="text-lg font-bold text-gold-400">{selectedMtg.amount}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-cream">Platform Commission</h4>
              <div className="rounded-xl border border-white/5 bg-white/5 p-4 flex justify-between text-sm">
                 <span className="text-ink/60">Referral Fee (1%)</span>
                 <span className="text-emerald-400 font-medium">₦{parseInt(selectedMtg.amount.replace(/\D/g, '')) * 0.01 / 100}</span>
              </div>
            </div>
          </div>
        )}
      </EnterpriseDetailDrawer>

      <Modal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        title="Loan Calculator"
        size="md"
        actionButton={
          <GoldButton onClick={() => { handleAction('Save Estimate'); setIsCalculatorOpen(false); }}>
            Save Estimate
          </GoldButton>
        }
      >
        <div className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Property Value (₦)</label>
            <input 
              type="number" 
              defaultValue="50000000"
              className="w-full rounded-xl border border-white/10 bg-navy-900/80 px-4 py-2 text-sm text-cream placeholder:text-ink/40 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Down Payment (%)</label>
              <input 
                type="number" 
                defaultValue="20"
                className="w-full rounded-xl border border-white/10 bg-navy-900/80 px-4 py-2 text-sm text-cream placeholder:text-ink/40 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Interest Rate (%)</label>
              <input 
                type="number" 
                defaultValue="14.5"
                className="w-full rounded-xl border border-white/10 bg-navy-900/80 px-4 py-2 text-sm text-cream placeholder:text-ink/40 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Loan Term (Years)</label>
            <select className="w-full rounded-xl border border-white/10 bg-navy-900/80 px-4 py-2 text-sm text-cream focus:border-gold-400/50 focus:outline-none appearance-none">
              <option>10 Years</option>
              <option>15 Years</option>
              <option selected>20 Years</option>
              <option>25 Years</option>
            </select>
          </div>
          
          <div className="pt-4 border-t border-white/10 space-y-3">
             <div className="flex justify-between text-sm">
                <span className="text-ink/60">Loan Amount</span>
                <span className="font-semibold text-cream">₦40,000,000</span>
             </div>
             <div className="flex justify-between text-lg font-bold">
                <span className="text-cream">Estimated Monthly</span>
                <span className="text-gold-400">₦511,885</span>
             </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

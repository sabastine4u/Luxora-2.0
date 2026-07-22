import { useState } from 'react';
import { PieChart, Plus } from 'lucide-react';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { EnterpriseExportMenu } from '../../../components/enterprise';
import { Modal } from '../../../components/ui/Modal';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { useToast } from '../../../contexts/ToastContext';

export default function Budget() {
  const { showToast } = useToast();
  const [isAllocationModalOpen, setIsAllocationModalOpen] = useState(false);

  const handleAction = (action: string) => {
    showToast({ type: 'success', title: 'Backend Integration', description: `This feature (${action}) is ready and will become fully functional during backend integration.` });
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Corporate Budget</h2>
          <p className="text-sm text-ink/60">Monitor high-level corporate spending against allocated budgets.</p>
        </div>
        <div className="flex gap-3">
          <select 
            className="rounded-xl border border-white/10 bg-navy-900/80 py-2 px-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none appearance-none"
            onChange={() => handleAction('Change Fiscal Year')}
          >
            <option>FY 2026</option>
            <option>Q4 2026</option>
            <option>FY 2025</option>
          </select>
          <EnterpriseExportMenu onExport={(f) => handleAction(`Export Budget as ${f.toUpperCase()}`)} />
          <GoldButton onClick={() => setIsAllocationModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Allocate Funds
          </GoldButton>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <KPICard 
          title="Total Operating Budget"
          value="₦1.5B"
          icon={PieChart}
          trend="FY26 Allocation"
          trendColor="text-ink/40"
          iconColor="text-gold-400"
          backgroundColor="bg-gold-400/10"
        />
        <KPICard 
          title="Total Spent"
          value="₦850.5M"
          icon={PieChart}
          trend="56.7% of Budget"
          trendColor="text-emerald-400"
          iconColor="text-emerald-400"
          backgroundColor="bg-emerald-400/10"
        />
        <KPICard 
          title="Remaining Balance"
          value="₦649.5M"
          icon={PieChart}
          trend="43.3% Remaining"
          trendColor="text-blue-400"
          iconColor="text-blue-400"
          backgroundColor="bg-blue-400/10"
        />
      </div>

      <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
         <div className="flex justify-between items-center mb-6">
           <h3 className="font-heading text-lg font-semibold text-cream flex items-center gap-2">
             <PieChart className="h-5 w-5 text-gold-400" /> Operational Breakdown
           </h3>
           <GhostButton className="px-3 py-1" onClick={() => handleAction('View Variance Analysis')}>
             View Variance Analysis
           </GhostButton>
         </div>
         
         <div className="space-y-8">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-cream font-medium">Payroll & HR</span>
                <span className="text-ink/60">₦450.0M / ₦600.0M <span className="text-blue-400 ml-2">(75%)</span></span>
              </div>
              <div className="h-3 bg-navy-900 rounded-full overflow-hidden">
                <div className="h-full bg-blue-400 w-[75%]"></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-cream font-medium">Marketing & Sales</span>
                <span className="text-ink/60">₦285.5M / ₦300.0M <span className="text-rose-400 ml-2">(95%) - Warning</span></span>
              </div>
              <div className="h-3 bg-navy-900 rounded-full overflow-hidden flex">
                <div className="h-full bg-rose-400 w-[95%]"></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-cream font-medium">Technology & Infrastructure</span>
                <span className="text-ink/60">₦115.0M / ₦400.0M <span className="text-emerald-400 ml-2">(28%)</span></span>
              </div>
              <div className="h-3 bg-navy-900 rounded-full overflow-hidden flex">
                <div className="h-full bg-emerald-400 w-[28%]"></div>
              </div>
            </div>
         </div>
      </div>

      <Modal
        isOpen={isAllocationModalOpen}
        onClose={() => setIsAllocationModalOpen(false)}
        title="Allocate Budget Funds"
        actionButton={
          <GoldButton onClick={() => { handleAction('Allocate Funds'); setIsAllocationModalOpen(false); }}>
            Confirm Allocation
          </GoldButton>
        }
      >
        <div className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Department / Category</label>
            <select className="w-full rounded-xl border border-white/10 bg-navy-900/80 px-4 py-2 text-sm text-cream focus:border-gold-400/50 focus:outline-none appearance-none">
              <option>Marketing & Sales</option>
              <option>Payroll & HR</option>
              <option>Technology & Infrastructure</option>
              <option>Legal & Compliance</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Allocation Amount (₦)</label>
            <input 
              type="number" 
              placeholder="0.00"
              className="w-full rounded-xl border border-white/10 bg-navy-900/80 px-4 py-2 text-sm text-cream placeholder:text-ink/40 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Justification</label>
            <textarea 
              placeholder="Reason for allocation..."
              className="w-full rounded-xl border border-white/10 bg-navy-900/80 px-4 py-3 text-sm text-cream placeholder:text-ink/40 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50 min-h-[100px] resize-none"
            ></textarea>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/5 p-4 text-sm text-ink/60">
            Note: Allocations exceeding ₦50M require secondary approval from the Executive Board.
          </div>
        </div>
      </Modal>
    </div>
  );
}

import { PieChart, Download } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';

export default function Budget() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Corporate Budget</h2>
          <p className="text-sm text-ink/60">Monitor high-level corporate spending against allocated budgets.</p>
        </div>
        <select className="rounded-xl border border-white/10 bg-navy-900/80 py-2 px-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none appearance-none">
          <option>FY 2025</option>
          <option>Q4 2025</option>
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
           <div className="text-sm text-ink/60 mb-1">Total Operating Budget (FY25)</div>
           <div className="font-heading text-3xl font-bold text-cream">₦1.5B</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
           <div className="text-sm text-ink/60 mb-1">Total Spent</div>
           <div className="font-heading text-3xl font-bold text-emerald-400">₦850.5M</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
           <div className="text-sm text-ink/60 mb-1">Remaining Balance</div>
           <div className="font-heading text-3xl font-bold text-gold-400">₦649.5M</div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
         <div className="flex justify-between items-center mb-6">
           <h3 className="font-heading text-lg font-semibold text-cream flex items-center gap-2">
             <PieChart className="h-5 w-5 text-gold-400" /> Operational Breakdown
           </h3>
           <GhostButton className="px-3 py-1"><Download className="h-4 w-4 mr-2" /> Export</GhostButton>
         </div>
         
         <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-cream font-medium">Payroll & HR</span>
                <span className="text-ink/60">₦450.0M / ₦600.0M <span className="text-blue-400 ml-2">(75%)</span></span>
              </div>
              <div className="h-3 bg-navy-900 rounded-full overflow-hidden">
                <div className="h-full bg-blue-400 w-[75%]"></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-cream font-medium">Marketing & Sales</span>
                <span className="text-ink/60">₦285.5M / ₦300.0M <span className="text-rose-400 ml-2">(95%)</span></span>
              </div>
              <div className="h-3 bg-navy-900 rounded-full overflow-hidden flex">
                <div className="h-full bg-rose-400 w-[95%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-cream font-medium">Technology & Infrastructure</span>
                <span className="text-ink/60">₦115.0M / ₦400.0M <span className="text-emerald-400 ml-2">(28%)</span></span>
              </div>
              <div className="h-3 bg-navy-900 rounded-full overflow-hidden flex">
                <div className="h-full bg-emerald-400 w-[28%]"></div>
              </div>
            </div>
         </div>
      </div>
    </div>
  );
}

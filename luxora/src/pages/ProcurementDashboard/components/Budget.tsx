import { PieChart } from 'lucide-react';

export default function Budget() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Procurement Budget Allocation</h2>
          <p className="text-sm text-ink/60">Monitor departmental spending against allocated budgets.</p>
        </div>
        <select className="rounded-xl border border-white/10 bg-navy-900/80 py-2 px-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none appearance-none">
          <option>Q4 2025</option>
          <option>Q3 2025</option>
          <option>FY 2025</option>
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
           <div className="text-sm text-ink/60 mb-1">Total Procurement Budget (Q4)</div>
           <div className="font-heading text-3xl font-bold text-cream">₦150.0M</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
           <div className="text-sm text-ink/60 mb-1">Total Spent</div>
           <div className="font-heading text-3xl font-bold text-emerald-400">₦84.5M</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
           <div className="text-sm text-ink/60 mb-1">Remaining Balance</div>
           <div className="font-heading text-3xl font-bold text-gold-400">₦65.5M</div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
         <h3 className="font-heading text-lg font-semibold text-cream mb-6 flex items-center gap-2">
           <PieChart className="h-5 w-5 text-gold-400" /> Departmental Breakdown
         </h3>
         
         <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-cream font-medium">IT & Infrastructure</span>
                <span className="text-ink/60">₦45.0M / ₦60.0M <span className="text-emerald-400 ml-2">(75%)</span></span>
              </div>
              <div className="h-3 bg-navy-900 rounded-full overflow-hidden">
                <div className="h-full bg-blue-400 w-[75%]"></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-cream font-medium">Marketing & Events</span>
                <span className="text-ink/60">₦28.5M / ₦30.0M <span className="text-rose-400 ml-2">(95%)</span></span>
              </div>
              <div className="h-3 bg-navy-900 rounded-full overflow-hidden flex">
                <div className="h-full bg-rose-400 w-[95%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-cream font-medium">Facilities & Maintenance</span>
                <span className="text-ink/60">₦11.0M / ₦40.0M <span className="text-emerald-400 ml-2">(27.5%)</span></span>
              </div>
              <div className="h-3 bg-navy-900 rounded-full overflow-hidden flex">
                <div className="h-full bg-emerald-400 w-[27.5%]"></div>
              </div>
            </div>
         </div>
      </div>
    </div>
  );
}

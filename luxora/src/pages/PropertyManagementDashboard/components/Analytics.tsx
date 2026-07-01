import { PieChart, Download, Activity, Users } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';

export default function Analytics() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Portfolio Analytics</h2>
          <p className="text-sm text-ink/60">High-level metrics on property performance and occupancy.</p>
        </div>
        <GhostButton className="px-4"><Download className="h-4 w-4 mr-2" /> Export Report</GhostButton>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
           <div className="flex items-center gap-2 text-sm text-ink/60 mb-2">
             <Users className="h-4 w-4 text-gold-400" /> Portfolio Occupancy
           </div>
           <div className="font-heading text-3xl font-bold text-emerald-400">92%</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
           <div className="flex items-center gap-2 text-sm text-ink/60 mb-2">
             <Activity className="h-4 w-4 text-rose-400" /> Delinquency Rate
           </div>
           <div className="font-heading text-3xl font-bold text-cream">3.5%</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
           <div className="flex items-center gap-2 text-sm text-ink/60 mb-2">
             <PieChart className="h-4 w-4 text-blue-400" /> Expense Ratio
           </div>
           <div className="font-heading text-3xl font-bold text-cream">42%</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
           <div className="flex items-center gap-2 text-sm text-ink/60 mb-2">
             <Activity className="h-4 w-4 text-gold-400" /> Avg Tenant Tenure
           </div>
           <div className="font-heading text-3xl font-bold text-cream">2.4 Yrs</div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 h-[400px] flex flex-col">
          <h3 className="font-heading text-lg font-semibold text-cream mb-6">Occupancy Trend (Trailing 12M)</h3>
          <div className="flex-1 border-b border-l border-white/10 relative flex items-end justify-between px-4 pt-10 pb-4">
             {/* Mock Area Chart */}
             <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
               <path d="M0,100 L0,30 L20,25 L40,28 L60,15 L80,10 L100,8 L100,100 Z" fill="rgba(52,211,153,0.1)" />
               <path d="M0,30 L20,25 L40,28 L60,15 L80,10 L100,8" fill="none" stroke="#34d399" strokeWidth="2" />
             </svg>
          </div>
          <div className="flex justify-between px-4 mt-4 text-xs text-ink/40 font-medium">
            <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 h-[400px] flex flex-col">
          <h3 className="font-heading text-lg font-semibold text-cream mb-6">Maintenance Cost Breakdown</h3>
          <div className="flex-1 flex items-center justify-center relative">
             <div className="h-48 w-48 rounded-full border-[16px] border-navy-900 relative">
               {/* Mock Donut Chart Segments */}
               <div className="absolute inset-[-16px] rounded-full border-[16px] border-emerald-400" style={{ clipPath: 'polygon(50% 50%, 50% 0, 100% 0, 100% 100%, 50% 100%)' }}></div>
               <div className="absolute inset-[-16px] rounded-full border-[16px] border-gold-400" style={{ clipPath: 'polygon(50% 50%, 0 100%, 0 0, 50% 0)' }}></div>
               <div className="absolute inset-[-16px] rounded-full border-[16px] border-rose-400" style={{ clipPath: 'polygon(50% 50%, 0 100%, 50% 100%)' }}></div>
               <div className="absolute inset-0 flex items-center justify-center font-heading text-2xl font-bold text-cream">₦2.4M</div>
             </div>
          </div>
          <div className="flex justify-center gap-4 mt-4 text-xs text-ink/60">
            <div className="flex items-center gap-1"><div className="h-3 w-3 bg-emerald-400 rounded-sm"></div> Plumbing</div>
            <div className="flex items-center gap-1"><div className="h-3 w-3 bg-gold-400 rounded-sm"></div> Electrical</div>
            <div className="flex items-center gap-1"><div className="h-3 w-3 bg-rose-400 rounded-sm"></div> HVAC</div>
          </div>
        </div>
      </div>
    </div>
  );
}

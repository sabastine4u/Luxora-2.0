import { ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

export default function Revenue() {
  const metrics = [
    { label: 'Total Gross Revenue', value: '₦4.82B', delta: '+18.2%', up: true },
    { label: 'Net Profit', value: '₦1.25B', delta: '+12.4%', up: true },
    { label: 'Platform Fees', value: '₦482M', delta: '+8.1%', up: true },
    { label: 'Outstanding Receivables', value: '₦120M', delta: '-5.2%', up: false },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Revenue Overview</h2>
          <p className="text-sm text-ink/60">High-level financial performance and metrics.</p>
        </div>
        <select className="rounded-xl border border-white/10 bg-navy-900/80 py-2 px-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none appearance-none">
          <option>This Quarter</option>
          <option>Last Quarter</option>
          <option>Year to Date</option>
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <p className="text-sm font-medium text-ink/60 mb-2">{m.label}</p>
            <div className="flex items-end justify-between">
              <span className="font-heading text-3xl font-bold text-cream">{m.value}</span>
              <span className={`flex items-center gap-1 text-sm font-semibold ${m.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                {m.up ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                {m.delta}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 h-[400px] flex flex-col">
        <h3 className="font-heading text-lg font-semibold text-cream mb-6 flex items-center gap-2">
          <Activity className="h-5 w-5 text-gold-400" /> Revenue vs. Projections
        </h3>
        <div className="flex-1 border-b border-l border-white/10 relative flex items-end justify-between px-4 pt-10 pb-4">
           {/* Mock Chart Bars */}
           {[40, 60, 45, 80, 55, 90, 75, 100, 85, 95, 70, 85].map((h, i) => (
             <div key={i} className="w-12 flex items-end gap-1 group">
               <div className="w-5 bg-gold-400/20 rounded-t-sm transition-all group-hover:bg-gold-400/40" style={{ height: `${h * 0.8}%` }}></div>
               <div className="w-5 bg-gold-400 rounded-t-sm transition-all group-hover:bg-gold-300 shadow-[0_0_15px_rgba(212,175,55,0.2)]" style={{ height: `${h}%` }}></div>
             </div>
           ))}
        </div>
        <div className="flex justify-between px-4 mt-4 text-xs text-ink/40 font-medium">
          <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
        </div>
      </div>
    </div>
  );
}

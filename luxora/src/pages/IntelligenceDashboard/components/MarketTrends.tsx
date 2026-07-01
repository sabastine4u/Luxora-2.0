import { ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

export default function MarketTrends() {
  const metrics = [
    { label: 'Avg Sale Price (Lagos)', value: '₦125M', delta: '+4.2%', up: true },
    { label: 'Avg Rent (Abuja)', value: '₦4.5M/yr', delta: '+1.8%', up: true },
    { label: 'Days on Market', value: '42 Days', delta: '-12%', up: true },
    { label: 'Inventory Level', value: 'Low', delta: '-5%', up: false },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Market Trends</h2>
          <p className="text-sm text-ink/60">Macro-level real estate metrics and historical pricing data.</p>
        </div>
        <select className="rounded-xl border border-white/10 bg-navy-900/80 py-2 px-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none appearance-none">
          <option>Lagos - All Areas</option>
          <option>Lekki Phase 1</option>
          <option>Victoria Island</option>
          <option>Abuja Central</option>
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <p className="text-sm font-medium text-ink/60 mb-2">{m.label}</p>
            <div className="flex items-end justify-between">
              <span className="font-heading text-xl font-bold text-cream">{m.value}</span>
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
          <Activity className="h-5 w-5 text-gold-400" /> 12-Month Price Index (Luxury Sector)
        </h3>
        <div className="flex-1 border-b border-l border-white/10 relative flex items-end justify-between px-4 pt-10 pb-4">
           {/* Mock Area Chart */}
           <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
             <path d="M0,100 L0,70 L10,65 L20,72 L30,50 L40,55 L50,40 L60,45 L70,30 L80,25 L90,20 L100,10 L100,100 Z" fill="rgba(212,175,55,0.1)" />
             <path d="M0,70 L10,65 L20,72 L30,50 L40,55 L50,40 L60,45 L70,30 L80,25 L90,20 L100,10" fill="none" stroke="#D4AF37" strokeWidth="2" />
           </svg>
        </div>
        <div className="flex justify-between px-4 mt-4 text-xs text-ink/40 font-medium">
          <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
        </div>
      </div>
    </div>
  );
}

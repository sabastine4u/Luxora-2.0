import { LineChart, Activity } from 'lucide-react';

export default function GrowthForecast() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">5-Year Growth Forecast</h2>
          <p className="text-sm text-ink/60">AI-driven predictive models for capital appreciation.</p>
        </div>
        <select className="rounded-xl border border-white/10 bg-navy-900/80 py-2 px-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none appearance-none">
          <option>High-End Residential</option>
          <option>Commercial</option>
          <option>Mixed Use</option>
        </select>
      </div>

      <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 h-[450px] flex flex-col">
        <h3 className="font-heading text-lg font-semibold text-cream mb-6 flex items-center gap-2">
          <LineChart className="h-5 w-5 text-gold-400" /> Projected Capital Value Index
        </h3>
        
        <div className="flex-1 border-b border-l border-white/10 relative flex items-end justify-between px-4 pt-10 pb-4">
           {/* Mock Area Chart - Historical & Forecast */}
           <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
             {/* Historical (Solid) */}
             <path d="M0,100 L0,80 L20,70 L40,65 L50,100 Z" fill="rgba(255,255,255,0.05)" />
             <path d="M0,80 L20,70 L40,65 L50,55" fill="none" stroke="#facc15" strokeWidth="2" />
             
             {/* Forecast (Dashed) */}
             <path d="M50,100 L50,55 L70,40 L90,20 L100,10 L100,100 Z" fill="rgba(52,211,153,0.1)" />
             <path d="M50,55 L70,40 L90,20 L100,10" fill="none" stroke="#34d399" strokeWidth="2" strokeDasharray="4 4" />
           </svg>
           
           <div className="absolute left-1/2 top-0 bottom-0 border-l-2 border-dashed border-white/20"></div>
           <div className="absolute left-[40%] top-4 text-xs font-bold text-gold-400 bg-navy-900 px-2 py-1 rounded border border-gold-400/20">Present</div>
        </div>
        
        <div className="flex justify-between px-4 mt-4 text-xs text-ink/40 font-medium">
          <span>2022</span><span>2023</span><span>2024</span><span>2025</span><span className="text-emerald-400">2026 (Est)</span><span className="text-emerald-400">2027 (Est)</span><span className="text-emerald-400">2028 (Est)</span>
        </div>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400 shrink-0">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-semibold text-cream mb-1">Bull Case</h3>
            <p className="text-sm text-ink/60 mb-2">Assuming continued infrastructure development and FDI inflows.</p>
            <p className="font-bold text-emerald-400">+12.5% Annualized</p>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-400 shrink-0">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-semibold text-cream mb-1">Base Case</h3>
            <p className="text-sm text-ink/60 mb-2">Assuming historical average growth and inflation parity.</p>
            <p className="font-bold text-yellow-400">+8.0% Annualized</p>
          </div>
        </div>
      </div>
    </div>
  );
}

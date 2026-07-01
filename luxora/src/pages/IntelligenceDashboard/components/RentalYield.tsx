import { PieChart, Download } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';

export default function RentalYield() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Rental Yield Analytics</h2>
          <p className="text-sm text-ink/60">Compare average yields across different property types and zones.</p>
        </div>
        <GhostButton className="px-4"><Download className="h-4 w-4 mr-2" /> Export Data</GhostButton>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
           <div className="text-sm text-ink/60 mb-1">Average Yield (Lagos)</div>
           <div className="font-heading text-3xl font-bold text-emerald-400">7.2%</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
           <div className="text-sm text-ink/60 mb-1">Highest Yielding Zone</div>
           <div className="font-heading text-xl font-bold text-cream">Lekki Phase 1</div>
           <div className="text-sm text-gold-400 font-medium">9.5% Avg</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
           <div className="text-sm text-ink/60 mb-1">Best Asset Class</div>
           <div className="font-heading text-xl font-bold text-cream">2-Bed Apartments</div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
         <div className="flex justify-between items-center mb-6">
           <h3 className="font-heading text-lg font-semibold text-cream flex items-center gap-2">
             <PieChart className="h-5 w-5 text-gold-400" /> Yield by Neighborhood
           </h3>
         </div>
         
         <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-cream font-medium">Lekki Phase 1</span>
                <span className="text-emerald-400 font-bold">9.5%</span>
              </div>
              <div className="h-3 bg-navy-900 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 w-[95%]"></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-cream font-medium">Victoria Island</span>
                <span className="text-emerald-400 font-bold">8.2%</span>
              </div>
              <div className="h-3 bg-navy-900 rounded-full overflow-hidden flex">
                <div className="h-full bg-emerald-400 w-[82%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-cream font-medium">Ikoyi</span>
                <span className="text-yellow-400 font-bold">5.8%</span>
              </div>
              <div className="h-3 bg-navy-900 rounded-full overflow-hidden flex">
                <div className="h-full bg-yellow-400 w-[58%]"></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-cream font-medium">Ikeja GRA</span>
                <span className="text-emerald-400 font-bold">7.0%</span>
              </div>
              <div className="h-3 bg-navy-900 rounded-full overflow-hidden flex">
                <div className="h-full bg-emerald-400 w-[70%]"></div>
              </div>
            </div>
         </div>
      </div>
    </div>
  );
}

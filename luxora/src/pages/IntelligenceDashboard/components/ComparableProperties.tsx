import { Home, Search, SlidersHorizontal } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';

export default function ComparableProperties() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Comparable Properties (Comps)</h2>
          <p className="text-sm text-ink/60">Generate valuation estimates based on recently sold similar properties.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
        <h3 className="font-heading text-lg font-semibold text-cream mb-4">Target Property</h3>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
             <label className="block text-sm font-medium text-ink/60 mb-1">Property Type</label>
             <select className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-2 px-4 text-cream focus:border-gold-400/50 focus:outline-none appearance-none">
               <option>4-Bedroom Detached Duplex</option>
               <option>3-Bedroom Apartment</option>
               <option>5-Bedroom Mansion</option>
             </select>
          </div>
          <div className="flex-1">
             <label className="block text-sm font-medium text-ink/60 mb-1">Location</label>
             <select className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-2 px-4 text-cream focus:border-gold-400/50 focus:outline-none appearance-none">
               <option>Lekki Phase 1</option>
               <option>Victoria Island</option>
             </select>
          </div>
          <div className="flex-1">
             <label className="block text-sm font-medium text-ink/60 mb-1">Condition</label>
             <select className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-2 px-4 text-cream focus:border-gold-400/50 focus:outline-none appearance-none">
               <option>Newly Built</option>
               <option>Renovated</option>
               <option>Needs Work</option>
             </select>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <GhostButton className="px-4"><SlidersHorizontal className="h-4 w-4 mr-2" /> Advanced Filters</GhostButton>
          <button className="rounded-xl bg-gold-400 px-6 py-2 font-bold text-navy-900 hover:bg-gold-300 transition-colors flex items-center gap-2">
            <Search className="h-4 w-4" /> Generate Comps
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
         <div className="bg-navy-800/50 rounded-2xl border border-gold-400/30 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gold-400 text-navy-900 text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase">Estimated Value</div>
            <div className="text-sm text-ink/60 mb-1">Subject Property</div>
            <div className="font-heading text-3xl font-bold text-gold-400 mb-2">₦210,000,000</div>
            <div className="text-xs text-ink/40">Confidence Score: High (94%)</div>
         </div>
      </div>

      <h3 className="font-heading text-lg font-bold text-cream mb-4">Recent Comparable Sales</h3>
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-navy-800/50">
        <table className="w-full text-left text-sm">
          <thead className="bg-navy-900/50 text-xs uppercase text-ink/50 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-semibold">Address</th>
              <th className="px-6 py-4 font-semibold">Beds/Baths</th>
              <th className="px-6 py-4 font-semibold">Size (SQM)</th>
              <th className="px-6 py-4 font-semibold">Sale Date</th>
              <th className="px-6 py-4 font-semibold text-right">Sold Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr className="hover:bg-white/[0.02] transition-colors">
              <td className="px-6 py-4 font-semibold text-cream flex items-center gap-2">
                <Home className="h-4 w-4 text-ink/40" /> 14 Admiralty Way
              </td>
              <td className="px-6 py-4 text-ink/60">4 / 4.5</td>
              <td className="px-6 py-4 text-ink/60">450</td>
              <td className="px-6 py-4 text-ink/60">Sep 15, 2025</td>
              <td className="px-6 py-4 text-right font-bold text-emerald-400">₦205,000,000</td>
            </tr>
            <tr className="hover:bg-white/[0.02] transition-colors">
              <td className="px-6 py-4 font-semibold text-cream flex items-center gap-2">
                <Home className="h-4 w-4 text-ink/40" /> 8 Fola Osibo St
              </td>
              <td className="px-6 py-4 text-ink/60">4 / 5</td>
              <td className="px-6 py-4 text-ink/60">480</td>
              <td className="px-6 py-4 text-ink/60">Aug 22, 2025</td>
              <td className="px-6 py-4 text-right font-bold text-emerald-400">₦215,000,000</td>
            </tr>
            <tr className="hover:bg-white/[0.02] transition-colors">
              <td className="px-6 py-4 font-semibold text-cream flex items-center gap-2">
                <Home className="h-4 w-4 text-ink/40" /> 22 Freedom Way
              </td>
              <td className="px-6 py-4 text-ink/60">4 / 4</td>
              <td className="px-6 py-4 text-ink/60">420</td>
              <td className="px-6 py-4 text-ink/60">Jul 10, 2025</td>
              <td className="px-6 py-4 text-right font-bold text-emerald-400">₦198,000,000</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

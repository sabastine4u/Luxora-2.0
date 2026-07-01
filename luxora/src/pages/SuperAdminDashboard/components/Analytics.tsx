import { MousePointerClick, Users, Timer, Filter } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';

export default function Analytics() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Deep Analytics</h2>
          <p className="text-sm text-ink/60">User behavior, conversion funnels, and retention rates.</p>
        </div>
        <div className="flex gap-2">
          <select className="rounded-xl border border-white/10 bg-navy-900/80 py-2 px-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none appearance-none">
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>Year to Date</option>
          </select>
          <GhostButton className="px-3"><Filter className="h-4 w-4" /></GhostButton>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
           <div className="flex items-center justify-between mb-4">
             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-400/10 text-blue-400">
               <MousePointerClick className="h-5 w-5" />
             </div>
             <span className="text-emerald-400 text-xs font-bold">+4.2%</span>
           </div>
           <div className="text-sm text-ink/60 mb-1">Click-Through Rate (CTR)</div>
           <div className="font-heading text-3xl font-bold text-cream">8.4%</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
           <div className="flex items-center justify-between mb-4">
             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-400/10 text-purple-400">
               <Users className="h-5 w-5" />
             </div>
             <span className="text-emerald-400 text-xs font-bold">+12.1%</span>
           </div>
           <div className="text-sm text-ink/60 mb-1">User Retention (30 Day)</div>
           <div className="font-heading text-3xl font-bold text-cream">64.2%</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
           <div className="flex items-center justify-between mb-4">
             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-400/10 text-gold-400">
               <Timer className="h-5 w-5" />
             </div>
             <span className="text-rose-400 text-xs font-bold">-2.4%</span>
           </div>
           <div className="text-sm text-ink/60 mb-1">Avg Session Duration</div>
           <div className="font-heading text-3xl font-bold text-cream">4m 12s</div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
         <h3 className="font-heading text-lg font-semibold text-cream mb-6">User Conversion Funnel</h3>
         
         <div className="space-y-4 max-w-2xl mx-auto">
            <div className="relative">
               <div className="bg-navy-900/80 border border-white/10 rounded-xl p-4 flex justify-between items-center relative z-10 w-full">
                 <span className="font-semibold text-cream">1. Landing Page Visitors</span>
                 <span className="font-bold text-blue-400">142,500</span>
               </div>
               <div className="absolute left-1/2 -bottom-4 w-px h-4 bg-white/20"></div>
            </div>
            
            <div className="relative flex justify-center">
               <div className="bg-navy-900/80 border border-white/10 rounded-xl p-4 flex justify-between items-center relative z-10 w-11/12">
                 <span className="font-semibold text-cream">2. Searched for Property</span>
                 <span className="font-bold text-blue-400">89,200</span>
               </div>
               <div className="absolute left-1/2 -bottom-4 w-px h-4 bg-white/20"></div>
            </div>

            <div className="relative flex justify-center">
               <div className="bg-navy-900/80 border border-white/10 rounded-xl p-4 flex justify-between items-center relative z-10 w-5/6">
                 <span className="font-semibold text-cream">3. Registered / Logged In</span>
                 <span className="font-bold text-blue-400">45,100</span>
               </div>
               <div className="absolute left-1/2 -bottom-4 w-px h-4 bg-white/20"></div>
            </div>

            <div className="relative flex justify-center">
               <div className="bg-gold-400/10 border border-gold-400/30 rounded-xl p-4 flex justify-between items-center relative z-10 w-3/4">
                 <span className="font-semibold text-gold-400">4. Contacted Agent / Requested Viewing</span>
                 <span className="font-bold text-gold-400">12,450</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

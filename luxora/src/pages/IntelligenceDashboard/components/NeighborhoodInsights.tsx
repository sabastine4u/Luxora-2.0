import { MapPin, Shield, Zap, Building2, Train } from 'lucide-react';

export default function NeighborhoodInsights() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Neighborhood Insights</h2>
          <p className="text-sm text-ink/60">Deep dive into local amenities, safety scores, and infrastructure.</p>
        </div>
        <select className="rounded-xl border border-white/10 bg-navy-900/80 py-2 px-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none appearance-none">
          <option>Lekki Phase 1</option>
          <option>Victoria Island</option>
          <option>Ikoyi</option>
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 text-center">
           <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-400 mb-3">
             <Shield className="h-6 w-6" />
           </div>
           <div className="text-sm text-ink/60 mb-1">Safety Score</div>
           <div className="font-heading text-2xl font-bold text-cream">92/100</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 text-center">
           <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-400/10 text-blue-400 mb-3">
             <Building2 className="h-6 w-6" />
           </div>
           <div className="text-sm text-ink/60 mb-1">Commercial Density</div>
           <div className="font-heading text-2xl font-bold text-cream">High</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 text-center">
           <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400/10 text-yellow-400 mb-3">
             <Zap className="h-6 w-6" />
           </div>
           <div className="text-sm text-ink/60 mb-1">Power Grid Reliability</div>
           <div className="font-heading text-2xl font-bold text-cream">98% Uptime</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 text-center">
           <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-400/10 text-purple-400 mb-3">
             <Train className="h-6 w-6" />
           </div>
           <div className="text-sm text-ink/60 mb-1">Transit Accessibility</div>
           <div className="font-heading text-2xl font-bold text-cream">Moderate</div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
        <h3 className="font-heading text-lg font-semibold text-cream mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-gold-400" /> Upcoming Infrastructure Projects
        </h3>
        <div className="space-y-4">
          <div className="bg-navy-900/50 p-4 rounded-xl border border-white/5">
            <h4 className="font-semibold text-cream mb-1">Coastal Highway Extension</h4>
            <p className="text-sm text-ink/60 mb-2">Connecting directly to the main commercial artery, reducing traffic by an estimated 30%.</p>
            <div className="text-xs font-bold text-emerald-400">Expected Completion: Q4 2026</div>
          </div>
          <div className="bg-navy-900/50 p-4 rounded-xl border border-white/5">
            <h4 className="font-semibold text-cream mb-1">New Independent Power Plant</h4>
            <p className="text-sm text-ink/60 mb-2">Dedicated 50MW gas plant serving the immediate vicinity.</p>
            <div className="text-xs font-bold text-yellow-400">Under Construction - 60% Complete</div>
          </div>
        </div>
      </div>
    </div>
  );
}

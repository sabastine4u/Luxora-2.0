import { Brain, MapPin, TrendingUp, Search } from 'lucide-react';

export default function PropertyIntelligence() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Property Intelligence</h2>
          <p className="text-sm text-ink/60">Market trends, pricing heatmaps, and neighborhood appreciation data.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
            <input 
              type="text" 
              placeholder="Search region..." 
              className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-2 pl-9 pr-4 text-sm text-cream placeholder:text-ink/40 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col items-center justify-center min-h-[400px]">
          <Brain className="h-16 w-16 text-gold-400/50 mb-4" />
          <p className="text-cream font-semibold">AI Market Map (Mock)</p>
          <p className="text-sm text-ink/60">Visualize neighborhood hotspots and pricing density.</p>
        </div>
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-lg font-semibold text-cream mb-4">Top Appreciating Areas</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm text-cream">Ikoyi, Lagos</span>
                </div>
                <span className="text-sm font-bold text-emerald-400 flex items-center gap-1"><TrendingUp className="h-3 w-3" /> +14%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm text-cream">Maitama, Abuja</span>
                </div>
                <span className="text-sm font-bold text-emerald-400 flex items-center gap-1"><TrendingUp className="h-3 w-3" /> +11%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm text-cream">Victoria Island, Lagos</span>
                </div>
                <span className="text-sm font-bold text-emerald-400 flex items-center gap-1"><TrendingUp className="h-3 w-3" /> +8%</span>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-lg font-semibold text-cream mb-4">Average Time on Market</h3>
            <div className="text-3xl font-bold text-cream mb-1">42 Days</div>
            <div className="text-sm text-emerald-400">-5 days vs last quarter</div>
          </div>
        </div>
      </div>
    </div>
  );
}

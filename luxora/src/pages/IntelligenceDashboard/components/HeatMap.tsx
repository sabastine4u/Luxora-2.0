import { Map, Layers, Maximize } from 'lucide-react';
import { GoldButton } from '../../../components/ui/ui';

export default function HeatMap() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Spatial Heat Maps</h2>
          <p className="text-sm text-ink/60">Visualize pricing concentration, demand density, and rental yields.</p>
        </div>
        <div className="flex gap-2">
          <select className="rounded-xl border border-white/10 bg-navy-900/80 py-2 px-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none appearance-none">
            <option>Data Layer: Property Values</option>
            <option>Data Layer: Rental Demand</option>
            <option>Data Layer: Crime Rate</option>
          </select>
          <GoldButton className="px-3"><Layers className="h-4 w-4" /></GoldButton>
        </div>
      </div>

      <div className="relative rounded-2xl border border-white/10 bg-navy-800/50 overflow-hidden h-[600px] flex items-center justify-center group">
        
        {/* Placeholder Map Background Effect */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(212,175,55,0.8) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(220,38,38,0.8) 0%, transparent 40%), radial-gradient(circle at 20% 80%, rgba(52,211,153,0.8) 0%, transparent 50%)',
          filter: 'blur(40px)'
        }}></div>

        {/* Grid Overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}></div>

        <div className="relative z-10 text-center">
          <Map className="h-16 w-16 text-gold-400/50 mx-auto mb-4" />
          <h3 className="font-heading text-xl font-bold text-cream mb-2">Interactive Map Placeholder</h3>
          <p className="text-sm text-ink/60 max-w-md mx-auto">
            In production, this section will integrate with Mapbox or Google Maps API to render rich, interactive multi-layer data visualizations.
          </p>
        </div>

        <button className="absolute bottom-4 right-4 bg-navy-900/80 p-3 rounded-full border border-white/10 text-cream hover:bg-gold-400 hover:text-navy-900 hover:border-gold-400 transition-all shadow-lg backdrop-blur-sm">
          <Maximize className="h-5 w-5" />
        </button>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-navy-900/80 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
          <h4 className="text-xs font-bold text-cream uppercase tracking-wider mb-3">Value Density</h4>
          <div className="space-y-2 text-xs text-ink/80">
            <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-sm bg-rose-500"></div> High Concentration</div>
            <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-sm bg-gold-400"></div> Medium Concentration</div>
            <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-sm bg-emerald-400"></div> Low Concentration</div>
          </div>
        </div>
      </div>
    </div>
  );
}

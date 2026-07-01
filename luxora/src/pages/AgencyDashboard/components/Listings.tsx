import { Eye, Heart, Key, Filter } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';
import { properties } from '../../../data/luxoraData';

export default function Listings() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Firm Listings</h2>
          <p className="text-sm text-ink/60">Overview of all properties managed by your agency.</p>
        </div>
        <GhostButton className="flex items-center gap-2">
          <Filter className="h-4 w-4" /> Filter Listings
        </GhostButton>
      </div>

      <div className="grid gap-6">
        {properties.slice(0, 4).map((prop) => (
          <div key={prop.id} className="flex flex-col md:flex-row gap-6 rounded-2xl border border-white/10 bg-navy-800/50 p-5 transition-transform hover:-translate-y-1">
            <img src={prop.image} alt={prop.title} className="h-40 w-full md:w-56 rounded-xl object-cover" />
            
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-heading text-xl font-semibold text-cream">{prop.title}</h3>
                    <div className="text-sm text-ink/60 mt-1">{prop.location}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-heading text-xl font-bold text-gold-400">{prop.price}</div>
                    <span className="inline-block mt-1 rounded-full bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">Live</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <img src={prop.agent.avatar} alt={prop.agent.name} className="h-6 w-6 rounded-full object-cover" />
                  <span className="text-xs text-ink/60">Listed by <span className="font-medium text-cream">{prop.agent.name}</span></span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-4 py-4 border-t border-white/5">
                <div className="flex flex-col items-center">
                  <span className="flex items-center gap-1 text-sm text-ink/50"><Eye className="h-4 w-4" /> Views</span>
                  <span className="font-semibold text-cream mt-1">12.4k</span>
                </div>
                <div className="flex flex-col items-center border-l border-white/5">
                  <span className="flex items-center gap-1 text-sm text-ink/50"><Heart className="h-4 w-4" /> Saves</span>
                  <span className="font-semibold text-cream mt-1">1,204</span>
                </div>
                <div className="flex flex-col items-center border-l border-white/5">
                  <span className="flex items-center gap-1 text-sm text-ink/50"><Key className="h-4 w-4" /> Viewings</span>
                  <span className="font-semibold text-cream mt-1">45</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

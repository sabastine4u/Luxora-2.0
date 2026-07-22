import { useState } from 'react';
import { MapPin, Search, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { EnterpriseExportMenu, EnterpriseDetailDrawer, EnterpriseStatusBadge } from '../../../components/enterprise';
import { useToast } from '../../../contexts/ToastContext';
import type { NeighborhoodInsight } from '../types';

export default function NeighborhoodInsights() {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<NeighborhoodInsight | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleAction = (action: string) => {
    showToast({ type: 'success', title: 'Backend Integration', description: `This feature (${action}) is ready and will become fully functional during backend integration.` });
  };

  const neighborhoods: NeighborhoodInsight[] = [
    { id: 'N-1', name: 'Ikoyi (Old)', growthRate: '+4.5%', safetyScore: 92, amenityScore: 88, schoolRating: 95, medianPrice: '₦450M', trend: 'Rising' },
    { id: 'N-2', name: 'Lekki Phase 1', growthRate: '+7.2%', safetyScore: 85, amenityScore: 94, schoolRating: 82, medianPrice: '₦220M', trend: 'Rising' },
    { id: 'N-3', name: 'Victoria Island', growthRate: '+2.1%', safetyScore: 88, amenityScore: 96, schoolRating: 90, medianPrice: '₦350M', trend: 'Stable' },
    { id: 'N-4', name: 'Surulere', growthRate: '-1.5%', safetyScore: 70, amenityScore: 75, schoolRating: 72, medianPrice: '₦85M', trend: 'Declining' },
  ];

  const filtered = neighborhoods.filter(n => n.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream flex items-center gap-2">
            <MapPin className="h-6 w-6 text-gold-400" /> Neighborhood Insights
          </h2>
          <p className="text-sm text-ink/60">Hyper-local analytics on amenities, safety, and demographic shifts.</p>
        </div>
        <div className="flex gap-3">
          <EnterpriseExportMenu onExport={(f) => handleAction(`Export Neighborhood Data as ${f.toUpperCase()}`)} />
          <GoldButton onClick={() => handleAction('Compare Areas')}>
            Compare Areas
          </GoldButton>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-navy-800/50 p-2 rounded-xl border border-white/10 max-w-md">
         <Search className="h-4 w-4 text-ink/40 ml-2" />
         <input 
            type="text" 
            placeholder="Search neighborhoods..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none focus:outline-none text-sm text-cream w-full placeholder:text-ink/40"
         />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((n) => (
           <div 
             key={n.id} 
             onClick={() => { setSelectedNeighborhood(n); setIsDrawerOpen(true); }}
             className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col cursor-pointer hover:border-gold-400/30 transition-colors"
           >
             <div className="flex justify-between items-start mb-4">
                <h3 className="font-heading text-lg font-bold text-cream">{n.name}</h3>
                <EnterpriseStatusBadge status={n.trend} />
             </div>
             
             <div className="space-y-4 flex-1">
                <div>
                   <div className="text-xs text-ink/60 mb-1">Median Price</div>
                   <div className="font-semibold text-cream">{n.medianPrice}</div>
                </div>
                <div>
                   <div className="text-xs text-ink/60 mb-1">YoY Growth</div>
                   <div className={`font-semibold flex items-center gap-1 ${n.trend === 'Declining' ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {n.trend === 'Declining' ? <ArrowDownRight className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                      {n.growthRate}
                   </div>
                </div>
             </div>
           </div>
        ))}
        {filtered.length === 0 && (
           <div className="col-span-full py-12 text-center text-ink/60">
              No neighborhoods found matching "{searchQuery}"
           </div>
        )}
      </div>

      <EnterpriseDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Neighborhood Profile"
        subtitle={selectedNeighborhood?.name}
      >
        {selectedNeighborhood && (
          <div className="space-y-6">
             <div className="p-4 rounded-xl border border-white/10 bg-navy-900/50">
                <h4 className="text-sm font-semibold text-cream mb-4">Livability Scores</h4>
                <div className="space-y-4">
                   <div>
                      <div className="flex justify-between text-xs mb-1">
                         <span className="text-ink/60">Safety</span>
                         <span className="text-emerald-400 font-bold">{selectedNeighborhood.safetyScore}/100</span>
                      </div>
                      <div className="h-2 w-full bg-navy-950 rounded-full overflow-hidden">
                         <div className="h-full bg-emerald-400" style={{ width: `${selectedNeighborhood.safetyScore}%` }}></div>
                      </div>
                   </div>
                   <div>
                      <div className="flex justify-between text-xs mb-1">
                         <span className="text-ink/60">Amenities & Retail</span>
                         <span className="text-gold-400 font-bold">{selectedNeighborhood.amenityScore}/100</span>
                      </div>
                      <div className="h-2 w-full bg-navy-950 rounded-full overflow-hidden">
                         <div className="h-full bg-gold-400" style={{ width: `${selectedNeighborhood.amenityScore}%` }}></div>
                      </div>
                   </div>
                   <div>
                      <div className="flex justify-between text-xs mb-1">
                         <span className="text-ink/60">Schools</span>
                         <span className="text-blue-400 font-bold">{selectedNeighborhood.schoolRating}/100</span>
                      </div>
                      <div className="h-2 w-full bg-navy-950 rounded-full overflow-hidden">
                         <div className="h-full bg-blue-400" style={{ width: `${selectedNeighborhood.schoolRating}%` }}></div>
                      </div>
                   </div>
                </div>
             </div>

             <div className="flex gap-4">
                <GhostButton className="flex-1" onClick={() => handleAction('View Listings in Area')}>
                   View Properties
                </GhostButton>
                <GoldButton className="flex-1" onClick={() => handleAction('Download Local Report')}>
                   Download Report
                </GoldButton>
             </div>
          </div>
        )}
      </EnterpriseDetailDrawer>
    </div>
  );
}

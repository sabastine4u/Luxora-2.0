import { useState } from 'react';
import { Map, MapPin, Search, Maximize, Layers } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';
import { EnterpriseExportMenu } from '../../../components/enterprise';
import { useToast } from '../../../contexts/ToastContext';

export default function HeatMap() {
  const { showToast } = useToast();
  const [layer, setLayer] = useState('Pricing');
  const [region, setRegion] = useState('Lagos');

  const handleAction = (action: string) => {
    showToast({ type: 'success', title: 'Backend Integration', description: `This feature (${action}) is ready and will become fully functional during backend integration.` });
  };

  return (
    <div className="space-y-6 max-w-7xl h-[calc(100vh-140px)] flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream flex items-center gap-2">
            <Map className="h-6 w-6 text-gold-400" /> Geographic Heat Map
          </h2>
          <p className="text-sm text-ink/60">Interactive visual analysis of regional market dynamics.</p>
        </div>
        <div className="flex gap-3">
          <EnterpriseExportMenu onExport={(f) => handleAction(`Export Map Snapshot as ${f.toUpperCase()}`)} />
          <GhostButton onClick={() => handleAction('Toggle Fullscreen')}>
            <Maximize className="h-4 w-4 mr-2" /> Fullscreen
          </GhostButton>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-navy-800/50 flex-1 relative overflow-hidden flex flex-col">
         {/* Top Map Controls */}
         <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            <div className="bg-navy-900/90 backdrop-blur-sm border border-white/10 p-2 rounded-xl flex items-center gap-2">
               <Layers className="h-4 w-4 text-ink/40 ml-2" />
               <select 
                 value={layer} 
                 onChange={(e) => { setLayer(e.target.value); handleAction('Change Map Layer'); }}
                 className="bg-transparent border-none focus:outline-none text-sm text-cream appearance-none pr-8 cursor-pointer"
               >
                 <option>Pricing Heat</option>
                 <option>Demand Intensity</option>
                 <option>Yield Hotspots</option>
                 <option>Risk Distribution</option>
               </select>
            </div>
            
            <div className="bg-navy-900/90 backdrop-blur-sm border border-white/10 p-2 rounded-xl flex items-center gap-2">
               <MapPin className="h-4 w-4 text-ink/40 ml-2" />
               <select 
                 value={region} 
                 onChange={(e) => { setRegion(e.target.value); handleAction('Change Map Region'); }}
                 className="bg-transparent border-none focus:outline-none text-sm text-cream appearance-none pr-8 cursor-pointer"
               >
                 <option>Lagos Metro</option>
                 <option>Abuja FCT</option>
                 <option>Port Harcourt</option>
               </select>
            </div>
         </div>

         <div className="absolute top-4 right-4 z-10">
            <div className="bg-navy-900/90 backdrop-blur-sm border border-white/10 p-2 rounded-xl flex items-center gap-2 w-64">
               <Search className="h-4 w-4 text-ink/40" />
               <input 
                  type="text" 
                  placeholder="Search location..." 
                  className="bg-transparent border-none focus:outline-none text-sm text-cream w-full placeholder:text-ink/40"
               />
            </div>
         </div>

         {/* Mock Interactive Map Area */}
         <div 
           className="absolute inset-0 bg-navy-950 flex flex-col items-center justify-center text-center cursor-crosshair"
           onClick={() => handleAction('Select Map Region')}
         >
            {/* Visual placeholder for a real map component */}
            <div className="w-full h-full opacity-20 relative" style={{
               background: 'radial-gradient(circle at 50% 50%, rgba(212,175,55,0.4) 0%, rgba(10,25,47,1) 60%)',
               backgroundSize: '100px 100px'
            }}>
               <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-rose-500 rounded-full blur-3xl opacity-40"></div>
               <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-emerald-500 rounded-full blur-3xl opacity-30"></div>
               <div className="absolute bottom-1/4 right-1/3 w-40 h-40 bg-gold-400 rounded-full blur-3xl opacity-30"></div>
            </div>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
               <Map className="h-16 w-16 text-gold-400/20 mb-4" />
               <h3 className="font-heading text-xl font-bold text-cream/40 mb-2">Interactive Map Area</h3>
               <p className="text-ink/40 text-sm max-w-sm">Map rendering engine will be connected during backend integration. Currently simulating {layer} layer in {region}.</p>
            </div>
         </div>

         {/* Bottom Legend */}
         <div className="absolute bottom-4 right-4 z-10 bg-navy-900/90 backdrop-blur-sm border border-white/10 p-4 rounded-xl w-64">
            <h4 className="text-xs font-semibold text-cream mb-3 uppercase tracking-wider">{layer} Legend</h4>
            <div className="h-2 w-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-400 mb-2"></div>
            <div className="flex justify-between text-xs text-ink/60">
               <span>Low</span>
               <span>Medium</span>
               <span>High</span>
            </div>
         </div>
      </div>
    </div>
  );
}

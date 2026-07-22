import { useState } from 'react';
import { LineChart, Play, Filter } from 'lucide-react';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { EnterpriseDetailDrawer, EnterpriseExportMenu } from '../../../components/enterprise';
import { useToast } from '../../../contexts/ToastContext';
import type { ForecastScenario } from '../types';

export default function GrowthForecast() {
  const { showToast } = useToast();
  const [selectedScenario, setSelectedScenario] = useState<ForecastScenario | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleAction = (action: string) => {
    showToast({ type: 'success', title: 'Backend Integration', description: `This feature (${action}) is ready and will become fully functional during backend integration.` });
  };

  const scenarios: ForecastScenario[] = [
    { id: 'SC-1', name: 'Base Case', horizon: 5, expectedGrowth: 6.5, description: 'Moderate economic growth and stable inflation.', dataPoints: [100, 105, 112, 119, 128, 137] },
    { id: 'SC-2', name: 'Optimistic (Bull)', horizon: 5, expectedGrowth: 9.2, description: 'Aggressive infrastructure development and high foreign investment.', dataPoints: [100, 109, 122, 137, 153, 172] },
    { id: 'SC-3', name: 'Pessimistic (Bear)', horizon: 5, expectedGrowth: 3.1, description: 'Economic slowdown and rising interest rates.', dataPoints: [100, 102, 104, 107, 111, 116] },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream flex items-center gap-2">
            <LineChart className="h-6 w-6 text-gold-400" /> Growth Forecast
          </h2>
          <p className="text-sm text-ink/60">Predictive models for capital appreciation based on market variables.</p>
        </div>
        <div className="flex gap-3">
          <EnterpriseExportMenu onExport={(f) => handleAction(`Export Forecasts as ${f.toUpperCase()}`)} />
          <GoldButton onClick={() => handleAction('Build New Scenario')}>
            <Play className="h-4 w-4 mr-2" /> Scenario Builder
          </GoldButton>
        </div>
      </div>

      <div className="flex items-center gap-4 border-b border-white/10 pb-4">
         <GhostButton size="sm" onClick={() => handleAction('Filter: 5-Year Horizon')}><Filter className="h-4 w-4 mr-2" /> 5-Year Horizon</GhostButton>
         <GhostButton size="sm" className="text-ink/40" onClick={() => handleAction('Filter: 10-Year Horizon')}>10-Year Horizon</GhostButton>
         <GhostButton size="sm" className="text-ink/40" onClick={() => handleAction('Filter: Custom Horizon')}>Custom</GhostButton>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {scenarios.map((s) => (
           <div 
             key={s.id} 
             onClick={() => { setSelectedScenario(s); setIsDrawerOpen(true); }}
             className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col cursor-pointer hover:border-gold-400/30 transition-colors"
           >
             <h3 className="font-heading text-lg font-bold text-cream mb-2">{s.name}</h3>
             <p className="text-sm text-ink/60 mb-6 flex-1">{s.description}</p>
             <div className="flex justify-between items-end border-t border-white/10 pt-4">
                <div>
                   <div className="text-xs text-ink/40 mb-1">Expected Annual Growth</div>
                   <div className="font-semibold text-emerald-400">+{s.expectedGrowth}% YoY</div>
                </div>
                <div className="h-10 w-20 relative">
                   <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                     <path d="M0,100 L0,80 L20,70 L40,60 L60,40 L80,30 L100,10 L100,100 Z" fill="rgba(52,211,153,0.1)" />
                     <path d="M0,80 L20,70 L40,60 L60,40 L80,30 L100,10" fill="none" stroke="#34D399" strokeWidth="3" />
                   </svg>
                </div>
             </div>
           </div>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 h-[400px] flex flex-col relative overflow-hidden">
        <h3 className="font-heading text-lg font-semibold text-cream mb-6 flex items-center justify-between">
          <span>Comparative Value Projection (5 Years)</span>
          <GhostButton size="sm" onClick={() => handleAction('View Full Chart')}>Expand</GhostButton>
        </h3>
        <div className="flex-1 border-b border-l border-white/10 relative flex items-end justify-between px-4 pt-10 pb-4">
           {/* Mock Multi-Line Chart */}
           <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
             {/* Bear */}
             <path d="M0,80 L20,78 L40,75 L60,70 L80,68 L100,65" fill="none" stroke="#F43F5E" strokeWidth="2" opacity="0.6" strokeDasharray="4 4" />
             {/* Base */}
             <path d="M0,80 L20,70 L40,60 L60,40 L80,30 L100,10" fill="none" stroke="#D4AF37" strokeWidth="3" />
             {/* Bull */}
             <path d="M0,80 L20,65 L40,40 L60,15 L80,5 L100,0" fill="none" stroke="#34D399" strokeWidth="2" opacity="0.6" strokeDasharray="4 4" />
           </svg>
        </div>
        <div className="flex justify-between px-4 mt-4 text-xs text-ink/40 font-medium">
          <span>Year 0</span><span>Year 1</span><span>Year 2</span><span>Year 3</span><span>Year 4</span><span>Year 5</span>
        </div>
      </div>

      <EnterpriseDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Scenario Details"
        subtitle={selectedScenario?.name}
      >
        {selectedScenario && (
          <div className="space-y-6">
             <div className="p-4 rounded-xl border border-white/10 bg-navy-900/50 flex flex-col">
                <div className="text-sm text-ink/60 mb-2">Projected Asset Value (Year 5)</div>
                <div className="font-heading text-4xl font-bold text-emerald-400 mb-2">
                   ₦{(150000000 * Math.pow(1 + (selectedScenario.expectedGrowth / 100), 5)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div className="text-sm text-ink/80">Based on a ₦150M initial investment.</div>
             </div>
             
             <div>
                <h4 className="text-sm font-semibold text-cream mb-4">Assumptions</h4>
                <ul className="space-y-2 text-sm text-ink/60 list-disc list-inside">
                   <li>Inflation remains stable at current rates.</li>
                   <li>No major regulatory changes.</li>
                   <li>Property is maintained in good condition.</li>
                </ul>
             </div>
             <GoldButton className="w-full" onClick={() => { handleAction('Export Scenario'); setIsDrawerOpen(false); }}>
                Export Scenario Data
             </GoldButton>
          </div>
        )}
      </EnterpriseDetailDrawer>
    </div>
  );
}

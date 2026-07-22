import { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { EnterpriseExportMenu, EnterpriseDetailDrawer } from '../../../components/enterprise';
import { GhostButton } from '../../../components/ui/ui';
import { useToast } from '../../../contexts/ToastContext';
import type { MarketMetric } from '../types';

export default function MarketTrends() {
  const { showToast } = useToast();
  const [location, setLocation] = useState('Lagos - All Areas');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<MarketMetric | null>(null);

  const handleAction = (action: string) => {
    showToast({ type: 'success', title: 'Backend Integration', description: `This feature (${action}) is ready and will become fully functional during backend integration.` });
  };

  const metrics: MarketMetric[] = [
    { label: 'Avg Sale Price (Lagos)', value: '₦125M', delta: '+4.2%', up: true },
    { label: 'Avg Rent (Abuja)', value: '₦4.5M/yr', delta: '+1.8%', up: true },
    { label: 'Days on Market', value: '42 Days', delta: '-12%', up: true },
    { label: 'Inventory Level', value: 'Low', delta: '-5%', up: false },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Market Trends</h2>
          <p className="text-sm text-ink/60">Macro-level real estate metrics and historical pricing data.</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={location}
            onChange={(e) => { setLocation(e.target.value); handleAction('Filter Location'); }}
            className="rounded-xl border border-white/10 bg-navy-900/80 py-2 px-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none appearance-none"
          >
            <option>Lagos - All Areas</option>
            <option>Lekki Phase 1</option>
            <option>Victoria Island</option>
            <option>Abuja Central</option>
          </select>
          <EnterpriseExportMenu onExport={(f) => handleAction(`Export Trends as ${f.toUpperCase()}`)} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <div 
            key={m.label} 
            onClick={() => { setSelectedMetric(m); setIsDrawerOpen(true); }}
            className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 cursor-pointer hover:border-gold-400/30 transition-colors"
          >
            <p className="text-sm font-medium text-ink/60 mb-2">{m.label}</p>
            <div className="flex items-end justify-between">
              <span className="font-heading text-xl font-bold text-cream">{m.value}</span>
              <span className={`flex items-center gap-1 text-sm font-semibold ${m.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                {m.up ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                {m.delta}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 h-[400px] flex flex-col relative overflow-hidden">
        <h3 className="font-heading text-lg font-semibold text-cream mb-6 flex items-center justify-between">
          <span className="flex items-center gap-2"><Activity className="h-5 w-5 text-gold-400" /> 12-Month Price Index (Luxury Sector)</span>
          <GhostButton size="sm" onClick={() => handleAction('Expand Chart')}>Expand Chart</GhostButton>
        </h3>
        <div className="flex-1 border-b border-l border-white/10 relative flex items-end justify-between px-4 pt-10 pb-4">
           {/* Mock Area Chart */}
           <svg className="absolute inset-0 h-full w-full cursor-pointer hover:opacity-80 transition-opacity" onClick={() => handleAction('View Chart Data Point')} preserveAspectRatio="none" viewBox="0 0 100 100">
             <path d="M0,100 L0,70 L10,65 L20,72 L30,50 L40,55 L50,40 L60,45 L70,30 L80,25 L90,20 L100,10 L100,100 Z" fill="rgba(212,175,55,0.1)" />
             <path d="M0,70 L10,65 L20,72 L30,50 L40,55 L50,40 L60,45 L70,30 L80,25 L90,20 L100,10" fill="none" stroke="#D4AF37" strokeWidth="2" />
           </svg>
        </div>
        <div className="flex justify-between px-4 mt-4 text-xs text-ink/40 font-medium">
          <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
        </div>
      </div>

      <EnterpriseDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Metric Breakdown"
        subtitle={selectedMetric?.label}
      >
        {selectedMetric && (
          <div className="space-y-6">
             <div className="p-4 rounded-xl border border-white/10 bg-navy-900/50 flex flex-col items-center justify-center text-center">
                <div className="text-sm text-ink/60 mb-2">Current Value</div>
                <div className="font-heading text-4xl font-bold text-cream mb-2">{selectedMetric.value}</div>
                <div className={`flex items-center gap-1 font-semibold ${selectedMetric.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {selectedMetric.up ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                  {selectedMetric.delta} vs Last Year
                </div>
             </div>
             
             <div>
                <h4 className="text-sm font-semibold text-cream mb-4">Historical Context</h4>
                <div className="space-y-3">
                   <div className="flex justify-between p-3 border border-white/5 bg-white/5 rounded-lg">
                      <span className="text-ink/60 text-sm">Last Quarter</span>
                      <span className="text-cream text-sm">₦120M</span>
                   </div>
                   <div className="flex justify-between p-3 border border-white/5 bg-white/5 rounded-lg">
                      <span className="text-ink/60 text-sm">Last Year</span>
                      <span className="text-cream text-sm">₦110M</span>
                   </div>
                </div>
             </div>
          </div>
        )}
      </EnterpriseDetailDrawer>
    </div>
  );
}

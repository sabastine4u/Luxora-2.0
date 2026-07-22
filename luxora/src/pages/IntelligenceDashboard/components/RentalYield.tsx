import { useState } from 'react';
import { PieChart, Download, Save, RefreshCw, Home } from 'lucide-react';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { useToast } from '../../../contexts/ToastContext';
import { EnterpriseExportMenu, EnterpriseDetailDrawer } from '../../../components/enterprise';

export default function RentalYield() {
  const { showToast } = useToast();
  const [propertyType, setPropertyType] = useState('Luxury Apartment');
  const [purchasePrice, setPurchasePrice] = useState('200000000');
  const [annualRent, setAnnualRent] = useState('15000000');
  
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleAction = (action: string) => {
    showToast({ type: 'success', title: 'Backend Integration', description: `This feature (${action}) is ready and will become fully functional during backend integration.` });
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
      setShowResults(true);
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream flex items-center gap-2">
            <PieChart className="h-6 w-6 text-gold-400" /> Gross Rental Yield Calculator
          </h2>
          <p className="text-sm text-ink/60">Quick calculation of gross rental yield across property types.</p>
        </div>
        <div className="flex gap-3">
          <EnterpriseExportMenu onExport={(f) => handleAction(`Export Yield Analysis as ${f.toUpperCase()}`)} />
          <GhostButton onClick={() => handleAction('Compare Properties')}><Home className="h-4 w-4 mr-2" /> Compare</GhostButton>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={handleCalculate} className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 space-y-6">
           <h3 className="font-heading text-lg font-bold text-cream border-b border-white/10 pb-4">Yield Parameters</h3>
           
           <div className="space-y-4">
              <div>
                 <label className="block text-xs font-semibold text-ink/60 uppercase tracking-wider mb-2">Property Type</label>
                 <select 
                   value={propertyType} 
                   onChange={(e) => setPropertyType(e.target.value)} 
                   className="w-full rounded-xl border border-white/10 bg-navy-900/80 px-4 py-2 text-sm text-cream focus:border-gold-400/50 focus:outline-none appearance-none"
                 >
                   <option>Luxury Apartment</option>
                   <option>Detached Villa</option>
                   <option>Terrace Duplex</option>
                   <option>Commercial Space</option>
                 </select>
              </div>
              <div>
                 <label className="block text-xs font-semibold text-ink/60 uppercase tracking-wider mb-2">Purchase Price (₦)</label>
                 <input type="number" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} required className="w-full rounded-xl border border-white/10 bg-navy-900/80 px-4 py-2 text-sm text-cream focus:border-gold-400/50 focus:outline-none" />
              </div>
              <div>
                 <label className="block text-xs font-semibold text-ink/60 uppercase tracking-wider mb-2">Expected Annual Rent (₦)</label>
                 <input type="number" value={annualRent} onChange={(e) => setAnnualRent(e.target.value)} required className="w-full rounded-xl border border-white/10 bg-navy-900/80 px-4 py-2 text-sm text-cream focus:border-gold-400/50 focus:outline-none" />
              </div>
           </div>

           <GoldButton type="submit" className="w-full" disabled={isCalculating}>
              {isCalculating ? <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Calculating Yield...</> : 'Calculate Yield'}
           </GoldButton>
        </form>

        {showResults ? (
           <div className="rounded-2xl border border-emerald-400/30 bg-navy-800/80 p-6 flex flex-col justify-center items-center text-center animate-in zoom-in duration-500">
             <div className="text-sm text-ink/60 uppercase tracking-wider mb-4">Gross Rental Yield</div>
             <div className="font-heading text-6xl font-bold text-emerald-400 mb-6">7.5%</div>
             
             <div className="grid grid-cols-2 gap-4 w-full mb-8">
               <div className="p-3 bg-navy-900/50 rounded-lg border border-white/5">
                 <div className="text-xs text-ink/60">Purchase Price</div>
                 <div className="font-semibold text-cream">₦{parseInt(purchasePrice).toLocaleString()}</div>
               </div>
               <div className="p-3 bg-navy-900/50 rounded-lg border border-white/5">
                 <div className="text-xs text-ink/60">Annual Rent</div>
                 <div className="font-semibold text-cream">₦{parseInt(annualRent).toLocaleString()}</div>
               </div>
             </div>
             
             <div className="flex gap-4 w-full">
               <GhostButton className="flex-1" onClick={() => handleAction('Save to Portfolio')}>
                 <Save className="h-4 w-4 mr-2" /> Save
               </GhostButton>
               <GhostButton className="flex-1" onClick={() => setIsDrawerOpen(true)}>
                 Detailed Breakdown
               </GhostButton>
             </div>
           </div>
        ) : (
           <div className="rounded-2xl border border-white/10 bg-navy-800/30 p-6 flex flex-col items-center justify-center text-center">
              <PieChart className="h-16 w-16 text-ink/20 mb-4" />
              <h3 className="font-heading text-xl font-bold text-cream mb-2">Awaiting Parameters</h3>
              <p className="text-ink/60 max-w-sm">Enter the property type, purchase price, and expected annual rent to calculate the gross rental yield.</p>
           </div>
        )}
      </div>

      <EnterpriseDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Yield Breakdown"
        subtitle={propertyType}
      >
        <div className="space-y-6">
          <p className="text-sm text-ink/80">
            A 7.5% gross yield is considered strong for {propertyType}s in this market segment.
          </p>
          <div className="space-y-3">
             <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-ink/60">Market Average</span>
                <span className="text-cream">6.2%</span>
             </div>
             <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-ink/60">Prime Areas Avg</span>
                <span className="text-cream">7.0%</span>
             </div>
             <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-ink/60">Suburban Areas Avg</span>
                <span className="text-cream">5.5%</span>
             </div>
          </div>
          <GoldButton className="w-full" onClick={() => { handleAction('Export Breakdown'); setIsDrawerOpen(false); }}>
            <Download className="h-4 w-4 mr-2" /> Download Report
          </GoldButton>
        </div>
      </EnterpriseDetailDrawer>
    </div>
  );
}

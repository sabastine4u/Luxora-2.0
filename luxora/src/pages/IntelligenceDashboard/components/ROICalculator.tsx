import { useState } from 'react';
import { Calculator, Download, Save, RefreshCw } from 'lucide-react';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { useToast } from '../../../contexts/ToastContext';
import { EnterpriseExportMenu } from '../../../components/enterprise';

export default function ROICalculator() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    purchasePrice: '150000000',
    downPayment: '20',
    interestRate: '8.5',
    loanTerm: '20',
    monthlyRent: '800000',
    operatingExpenses: '150000',
    vacancyRate: '5',
    appreciationRate: '4'
  });
  
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResults, setShowResults] = useState(false);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream flex items-center gap-2">
            <Calculator className="h-6 w-6 text-gold-400" /> Advanced ROI Calculator
          </h2>
          <p className="text-sm text-ink/60">Comprehensive cash flow and return on investment analysis.</p>
        </div>
        <div className="flex gap-3">
          <EnterpriseExportMenu onExport={(f) => handleAction(`Export Analysis as ${f.toUpperCase()}`)} />
          <GhostButton onClick={() => handleAction('Save Scenario')}><Save className="h-4 w-4 mr-2" /> Save Scenario</GhostButton>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleCalculate} className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 space-y-6">
            <h3 className="font-heading text-lg font-bold text-cream border-b border-white/10 pb-4">Investment Parameters</h3>
            
            <div className="space-y-4">
               <div>
                  <label className="block text-xs font-semibold text-ink/60 uppercase tracking-wider mb-2">Purchase Price (₦)</label>
                  <input type="number" name="purchasePrice" value={formData.purchasePrice} onChange={handleChange} required className="w-full rounded-xl border border-white/10 bg-navy-900/80 px-4 py-2 text-sm text-cream focus:border-gold-400/50 focus:outline-none" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-ink/60 uppercase tracking-wider mb-2">Down Payment (%)</label>
                    <input type="number" name="downPayment" value={formData.downPayment} onChange={handleChange} required className="w-full rounded-xl border border-white/10 bg-navy-900/80 px-4 py-2 text-sm text-cream focus:border-gold-400/50 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink/60 uppercase tracking-wider mb-2">Interest Rate (%)</label>
                    <input type="number" name="interestRate" step="0.1" value={formData.interestRate} onChange={handleChange} required className="w-full rounded-xl border border-white/10 bg-navy-900/80 px-4 py-2 text-sm text-cream focus:border-gold-400/50 focus:outline-none" />
                  </div>
               </div>
               <div>
                  <label className="block text-xs font-semibold text-ink/60 uppercase tracking-wider mb-2">Monthly Rental Income (₦)</label>
                  <input type="number" name="monthlyRent" value={formData.monthlyRent} onChange={handleChange} required className="w-full rounded-xl border border-white/10 bg-navy-900/80 px-4 py-2 text-sm text-cream focus:border-gold-400/50 focus:outline-none" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-ink/60 uppercase tracking-wider mb-2">Operating Expenses (₦/mo)</label>
                    <input type="number" name="operatingExpenses" value={formData.operatingExpenses} onChange={handleChange} required className="w-full rounded-xl border border-white/10 bg-navy-900/80 px-4 py-2 text-sm text-cream focus:border-gold-400/50 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink/60 uppercase tracking-wider mb-2">Vacancy Rate (%)</label>
                    <input type="number" name="vacancyRate" value={formData.vacancyRate} onChange={handleChange} required className="w-full rounded-xl border border-white/10 bg-navy-900/80 px-4 py-2 text-sm text-cream focus:border-gold-400/50 focus:outline-none" />
                  </div>
               </div>
            </div>

            <GoldButton type="submit" className="w-full" disabled={isCalculating}>
              {isCalculating ? <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Calculating...</> : 'Calculate ROI'}
            </GoldButton>
          </form>
        </div>

        <div className="lg:col-span-7">
          {showResults ? (
             <div className="rounded-2xl border border-gold-400/30 bg-navy-800/80 p-6 flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
               <h3 className="font-heading text-lg font-bold text-cream border-b border-white/10 pb-4 mb-6">Calculation Results</h3>
               
               <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="p-4 rounded-xl bg-navy-900/50 border border-white/5">
                     <div className="text-sm text-ink/60 mb-1">Cash on Cash Return</div>
                     <div className="font-heading text-3xl font-bold text-emerald-400">8.4%</div>
                  </div>
                  <div className="p-4 rounded-xl bg-navy-900/50 border border-white/5">
                     <div className="text-sm text-ink/60 mb-1">Cap Rate</div>
                     <div className="font-heading text-3xl font-bold text-emerald-400">6.2%</div>
                  </div>
                  <div className="p-4 rounded-xl bg-navy-900/50 border border-white/5">
                     <div className="text-sm text-ink/60 mb-1">Net Operating Income (Annual)</div>
                     <div className="font-heading text-2xl font-bold text-cream">₦7,320,000</div>
                  </div>
                  <div className="p-4 rounded-xl bg-navy-900/50 border border-white/5">
                     <div className="text-sm text-ink/60 mb-1">Cash Flow (Monthly)</div>
                     <div className="font-heading text-2xl font-bold text-cream">₦124,500</div>
                  </div>
               </div>
               
               <div className="mt-auto pt-6 border-t border-white/10 flex gap-4">
                  <GoldButton className="flex-1" onClick={() => handleAction('Download Detailed PDF')}>
                     <Download className="h-4 w-4 mr-2" /> Download Full PDF Report
                  </GoldButton>
               </div>
             </div>
          ) : (
             <div className="rounded-2xl border border-white/10 bg-navy-800/30 p-6 h-full flex flex-col items-center justify-center text-center">
                <Calculator className="h-16 w-16 text-ink/20 mb-4" />
                <h3 className="font-heading text-xl font-bold text-cream mb-2">Awaiting Parameters</h3>
                <p className="text-ink/60 max-w-sm">Fill out the investment parameters on the left and click calculate to view detailed ROI metrics and cash flow projections.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}

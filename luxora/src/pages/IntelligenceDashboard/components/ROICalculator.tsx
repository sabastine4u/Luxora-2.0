import { useState } from 'react';
import { Calculator } from 'lucide-react';

export default function ROICalculator() {
  const [purchasePrice, setPurchasePrice] = useState('150000000');
  const [monthlyRent, setMonthlyRent] = useState('1200000');
  const [appreciation, setAppreciation] = useState('5');
  const [holdingPeriod, setHoldingPeriod] = useState('5');

  const price = Number(purchasePrice) || 0;
  const rent = Number(monthlyRent) || 0;
  const appRate = Number(appreciation) || 0;
  const years = Number(holdingPeriod) || 0;

  const totalRent = rent * 12 * years;
  const futureValue = price * Math.pow(1 + appRate / 100, years);
  const capitalGain = futureValue - price;
  const totalROI = totalRent + capitalGain;
  const roiPercentage = price > 0 ? (totalROI / price) * 100 : 0;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">ROI Calculator</h2>
          <p className="text-sm text-ink/60">Simulate investment returns based on rental income and appreciation.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <h3 className="font-heading text-lg font-semibold text-cream mb-4 flex items-center gap-2">
            <Calculator className="h-5 w-5 text-gold-400" /> Input Parameters
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-ink/60 mb-1">Purchase Price (₦)</label>
            <input 
              type="number" 
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-2 px-4 text-cream focus:border-gold-400/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink/60 mb-1">Expected Monthly Rent (₦)</label>
            <input 
              type="number" 
              value={monthlyRent}
              onChange={(e) => setMonthlyRent(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-2 px-4 text-cream focus:border-gold-400/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink/60 mb-1">Annual Appreciation (%)</label>
            <input 
              type="number" 
              value={appreciation}
              onChange={(e) => setAppreciation(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-2 px-4 text-cream focus:border-gold-400/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink/60 mb-1">Holding Period (Years)</label>
            <input 
              type="number" 
              value={holdingPeriod}
              onChange={(e) => setHoldingPeriod(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-2 px-4 text-cream focus:border-gold-400/50 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col justify-center">
          <h3 className="font-heading text-lg font-semibold text-cream mb-2">Projected Returns</h3>
          
          <div className="bg-navy-900/50 p-4 rounded-xl border border-white/5 mb-2">
            <p className="text-sm text-ink/60 mb-1">Total Rental Income</p>
            <p className="font-heading text-2xl font-bold text-cream">₦{totalRent.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </div>
          <div className="bg-navy-900/50 p-4 rounded-xl border border-white/5 mb-2">
            <p className="text-sm text-ink/60 mb-1">Estimated Capital Gain</p>
            <p className="font-heading text-2xl font-bold text-emerald-400">₦{capitalGain.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </div>
          <div className="bg-gold-400/10 p-4 rounded-xl border border-gold-400/20">
            <p className="text-sm text-gold-400 mb-1 font-medium">Total ROI Percentage</p>
            <p className="font-heading text-3xl font-bold text-gold-400">{roiPercentage.toFixed(2)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

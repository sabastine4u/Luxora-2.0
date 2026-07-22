import { useState } from 'react';
import { TrendingUp, LineChart, Crosshair, Zap } from 'lucide-react';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { Modal } from '../../../components/ui/Modal';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { useToast } from '../../../contexts/ToastContext';

export default function Forecasting() {
  const { showToast } = useToast();
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState(false);

  const handleAction = (action: string) => {
    showToast({ type: 'success', title: 'Backend Integration', description: `This feature (${action}) is ready and will become fully functional during backend integration.` });
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Financial Forecasting</h2>
          <p className="text-sm text-ink/60">Predictive analytics and revenue projections based on historical data.</p>
        </div>
        <div className="flex gap-3">
          <select 
            className="rounded-xl border border-white/10 bg-navy-900/80 py-2 px-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none appearance-none"
            onChange={() => handleAction('Change Forecast Horizon')}
          >
            <option>Next 6 Months</option>
            <option>Next 12 Months</option>
            <option>Next 3 Years</option>
          </select>
          <GoldButton onClick={() => setIsScenarioModalOpen(true)}>
            <Crosshair className="h-4 w-4 mr-2" /> Build Scenario
          </GoldButton>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <KPICard 
          title="Projected FY26 Revenue"
          value="₦6.8B"
          icon={TrendingUp}
          trend="+15.5% vs FY25"
          trendColor="text-emerald-400"
          iconColor="text-emerald-400"
          backgroundColor="bg-emerald-400/10"
        />
        <KPICard 
          title="Predicted Cash Flow"
          value="Positive"
          icon={LineChart}
          trend="Strong liquidity expected"
          trendColor="text-emerald-400"
          iconColor="text-gold-400"
          backgroundColor="bg-gold-400/10"
        />
        <KPICard 
          title="AI Confidence Score"
          value="92%"
          icon={Zap}
          trend="High Accuracy"
          trendColor="text-emerald-400"
          iconColor="text-blue-400"
          backgroundColor="bg-blue-400/10"
        />
      </div>

      <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-heading text-lg font-semibold text-cream flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-gold-400" /> Revenue Trajectory
          </h3>
          <GhostButton className="px-3 py-1" onClick={() => handleAction('Export Chart')}>
            Export Chart
          </GhostButton>
        </div>
        
        <div className="flex-1 h-[350px] border-b border-l border-white/10 relative flex items-end justify-between px-4 pt-10 pb-4">
           {/* Mock Chart Area */}
           <div className="absolute inset-0 pt-10 pb-4 px-4 flex items-end">
              <svg className="w-full h-full" preserveAspectRatio="none">
                 <path d="M0,250 C100,220 200,240 300,180 C400,120 500,150 600,80 C700,10 800,90 900,20 L900,300 L0,300 Z" fill="rgba(212,175,55,0.1)" />
                 <path d="M0,250 C100,220 200,240 300,180 C400,120 500,150 600,80 C700,10 800,90 900,20" fill="none" stroke="rgba(212,175,55,0.8)" strokeWidth="3" />
              </svg>
           </div>
        </div>
        <div className="flex justify-between px-4 mt-4 text-[10px] md:text-xs text-ink/40 font-medium">
          <span>Q1 26</span><span>Q2 26</span><span>Q3 26</span><span>Q4 26</span><span>Q1 27</span><span>Q2 27</span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <h3 className="font-heading text-lg font-semibold text-cream mb-4">Key Growth Drivers</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
               <span className="text-sm text-cream font-medium">Premium Listings Adoption</span>
               <span className="text-sm text-emerald-400 font-bold">+24%</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
               <span className="text-sm text-cream font-medium">Mortgage Referral Fees</span>
               <span className="text-sm text-emerald-400 font-bold">+18%</span>
            </div>
            <div className="flex justify-between items-center">
               <span className="text-sm text-cream font-medium">Agency Subscriptions</span>
               <span className="text-sm text-emerald-400 font-bold">+12%</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <h3 className="font-heading text-lg font-semibold text-cream mb-4">Risk Factors</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
               <span className="text-sm text-cream font-medium">Interest Rate Hikes</span>
               <span className="text-sm text-rose-400 font-bold">High Impact</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
               <span className="text-sm text-cream font-medium">Market Cool-down (Q3)</span>
               <span className="text-sm text-yellow-400 font-bold">Med Impact</span>
            </div>
            <div className="flex justify-between items-center">
               <span className="text-sm text-cream font-medium">Regulatory Changes</span>
               <span className="text-sm text-yellow-400 font-bold">Low Impact</span>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isScenarioModalOpen}
        onClose={() => setIsScenarioModalOpen(false)}
        title="Scenario Builder"
        size="md"
        actionButton={
          <GoldButton onClick={() => { handleAction('Run Simulation'); setIsScenarioModalOpen(false); }}>
            Run Simulation
          </GoldButton>
        }
      >
        <div className="space-y-6">
          <p className="text-sm text-ink/60">
            Adjust variables to see how different market conditions affect the revenue forecast.
          </p>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Property Sales Volume</label>
                <span className="text-xs text-gold-400 font-bold">+10%</span>
              </div>
              <input type="range" min="-50" max="50" defaultValue="10" className="w-full accent-gold-400" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Interest Rates (CBN)</label>
                <span className="text-xs text-gold-400 font-bold">+2.5%</span>
              </div>
              <input type="range" min="-10" max="10" step="0.5" defaultValue="2.5" className="w-full accent-gold-400" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Operating Expenses</label>
                <span className="text-xs text-gold-400 font-bold">-5%</span>
              </div>
              <input type="range" min="-30" max="30" defaultValue="-5" className="w-full accent-gold-400" />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

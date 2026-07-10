import { useState } from 'react';
import { Banknote, ArrowUpRight, ArrowDownRight, TrendingUp, PieChart, Activity, Download, DollarSign, BarChart3, LineChart } from 'lucide-react';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { SegmentedProgressBar } from '../../../components/dashboard/shared/widgets/SegmentedProgressBar';
import { GhostButton, GoldButton } from '../../../components/ui/ui';

export default function Revenue() {
  const [activeRegion, setActiveRegion] = useState('National');

  const productRevenue = [
    { label: 'Commission Fees', value: 68, color: 'bg-gold-400' },
    { label: 'Agency Subs', value: 17, color: 'bg-blue-400' },
    { label: 'Home Services Lead Gen', value: 15, color: 'bg-purple-400' },
  ];

  return (
    <div className="space-y-6 pb-12">
      <DashboardHeader 
        name="Enterprise Revenue Intelligence" 
        subtitle="Executive oversight of platform revenue, profitability, and financial forecasts."
        actions={
          <div className="flex gap-3">
            <GhostButton className="flex items-center gap-2">
              <PieChart className="h-4 w-4" /> Revenue By Region
            </GhostButton>
            <GoldButton className="flex items-center gap-2">
              <Download className="h-4 w-4" /> Export Financials
            </GoldButton>
          </div>
        }
      />

      {/* Revenue Forecast Dashboard */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-gradient-to-br from-navy-800 to-navy-900 border border-white/10 rounded-2xl p-6 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gold-400/20 rounded-xl">
              <TrendingUp className="h-6 w-6 text-gold-400" />
            </div>
            <h3 className="font-heading text-xl font-bold text-cream">Monthly Revenue Forecast</h3>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-ink/60 mb-1">Projected MRR</div>
              <div className="text-3xl font-bold text-cream">₦1.2B</div>
              <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1"><ArrowUpRight className="h-3 w-3" /> +8% MoM</div>
            </div>
            <div>
              <div className="text-sm text-ink/60 mb-1">Q4 Forecast</div>
              <div className="text-3xl font-bold text-emerald-400">₦4.5B</div>
              <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1"><ArrowUpRight className="h-3 w-3" /> Exceeds Target</div>
            </div>
            <div>
              <div className="text-sm text-ink/60 mb-1">Confidence Score</div>
              <div className="text-3xl font-bold text-blue-400">92%</div>
              <div className="text-xs text-ink/50 mt-2">AI Generated</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-purple-400" /> Profitability Indicators
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-cream">Gross Margin</span>
                <span className="text-emerald-400">82%</span>
              </div>
              <div className="w-full bg-navy-900/50 rounded-full h-1.5"><div className="bg-emerald-400 h-1.5 rounded-full" style={{width: '82%'}}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-cream">Operating Margin</span>
                <span className="text-blue-400">45%</span>
              </div>
              <div className="w-full bg-navy-900/50 rounded-full h-1.5"><div className="bg-blue-400 h-1.5 rounded-full" style={{width: '45%'}}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-cream">Net Profit Margin</span>
                <span className="text-gold-400">31%</span>
              </div>
              <div className="w-full bg-navy-900/50 rounded-full h-1.5"><div className="bg-gold-400 h-1.5 rounded-full" style={{width: '31%'}}></div></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Total Net Revenue (YTD)" value="₦12.4B" trend="+24% YoY" trendColor="text-emerald-400" icon={Banknote} />
        <KPICard title="Avg Revenue Per User" value="₦85K" trend="+5% YoY" trendColor="text-emerald-400" icon={DollarSign} />
        <KPICard title="Churn Rate (Revenue)" value="1.2%" trend="-0.4% YoY" trendColor="text-emerald-400" icon={ArrowDownRight} />
        <KPICard title="LTV / CAC Ratio" value="4.8x" trend="Highly Efficient" trendColor="text-blue-400" icon={BarChart3} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col justify-center">
          <SegmentedProgressBar title="Revenue by Product Category" segments={productRevenue} />
        </div>

        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-heading text-lg font-bold text-cream flex items-center gap-2">
              <LineChart className="h-5 w-5 text-emerald-400" /> National Revenue Snapshot
            </h3>
            <select 
              value={activeRegion}
              onChange={(e) => setActiveRegion(e.target.value)}
              className="bg-navy-900/50 border border-white/10 text-xs text-cream rounded-lg px-2 py-1"
            >
              <option>National</option>
              <option>Lagos Region</option>
              <option>Abuja FCT</option>
            </select>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-navy-900/50 border border-white/5 rounded-xl">
              <span className="text-sm font-medium text-cream">Lagos Region</span>
              <span className="text-sm font-bold text-emerald-400">₦8.2B <span className="text-xs text-ink/40 font-normal">(66%)</span></span>
            </div>
            <div className="flex justify-between items-center p-3 bg-navy-900/50 border border-white/5 rounded-xl">
              <span className="text-sm font-medium text-cream">Abuja FCT</span>
              <span className="text-sm font-bold text-gold-400">₦2.8B <span className="text-xs text-ink/40 font-normal">(22%)</span></span>
            </div>
            <div className="flex justify-between items-center p-3 bg-navy-900/50 border border-white/5 rounded-xl">
              <span className="text-sm font-medium text-cream">Port Harcourt</span>
              <span className="text-sm font-bold text-blue-400">₦1.4B <span className="text-xs text-ink/40 font-normal">(12%)</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

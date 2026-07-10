import { useState } from 'react';
import { Brain, MapPin, TrendingUp, BarChart3, Activity, PieChart, Lightbulb, Download } from 'lucide-react';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { SegmentedProgressBar } from '../../../components/dashboard/shared/widgets/SegmentedProgressBar';

export default function PropertyIntelligence() {
  const [activeRegion, setActiveRegion] = useState('National');

  const propertyTypes = [
    { label: 'Residential (Sale)', value: 45, color: 'bg-emerald-400' },
    { label: 'Residential (Rent)', value: 30, color: 'bg-blue-400' },
    { label: 'Commercial', value: 15, color: 'bg-gold-400' },
    { label: 'Land', value: 10, color: 'bg-purple-400' }
  ];

  return (
    <div className="space-y-6 pb-12">
      <DashboardHeader 
        name="Market Intelligence" 
        subtitle="National market analytics, regional performance, and property forecasting."
        actions={
          <div className="flex gap-3">
            <GhostButton className="flex items-center gap-2">
              <PieChart className="h-4 w-4" /> Market Reports
            </GhostButton>
            <GoldButton className="flex items-center gap-2">
              <Download className="h-4 w-4" /> Export Data
            </GoldButton>
          </div>
        }
      />

      <div className="grid md:grid-cols-3 gap-6">
        {/* Market Demand Heatmap / National Market Analytics */}
        <div className="md:col-span-2 bg-gradient-to-br from-navy-800 to-navy-900 border border-white/10 rounded-2xl p-6 flex flex-col justify-center">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-400/20 rounded-xl">
                <BarChart3 className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="font-heading text-xl font-bold text-cream">National Market Analytics</h3>
            </div>
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

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-navy-900/50 p-4 rounded-xl border border-white/5">
              <div className="text-sm text-ink/60 mb-1">Avg Listing Price</div>
              <div className="text-xl font-bold text-cream">₦145M</div>
              <div className="text-xs text-emerald-400 mt-1">+4.2% YoY</div>
            </div>
            <div className="bg-navy-900/50 p-4 rounded-xl border border-white/5">
              <div className="text-sm text-ink/60 mb-1">Time on Market</div>
              <div className="text-xl font-bold text-cream">38 Days</div>
              <div className="text-xs text-emerald-400 mt-1">-5 Days vs Q3</div>
            </div>
            <div className="bg-navy-900/50 p-4 rounded-xl border border-white/5">
              <div className="text-sm text-ink/60 mb-1">Inventory Growth</div>
              <div className="text-xl font-bold text-cream">+12%</div>
              <div className="text-xs text-emerald-400 mt-1">Healthy Supply</div>
            </div>
            <div className="bg-navy-900/50 p-4 rounded-xl border border-white/5">
              <div className="text-sm text-ink/60 mb-1">Demand Index</div>
              <div className="text-xl font-bold text-cream">Very High</div>
              <div className="text-xs text-emerald-400 mt-1">8.5/10 Rating</div>
            </div>
          </div>
          <SegmentedProgressBar title="Market Composition by Property Type" segments={propertyTypes} />
        </div>

        {/* AI Market Recommendations */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
              <Brain className="h-4 w-4 text-gold-400" /> AI Market Recommendations
            </h3>
            <div className="space-y-3">
              <div className="flex gap-3 bg-white/[0.02] border border-white/5 p-4 rounded-xl">
                <div className="pt-0.5"><Lightbulb className="h-4 w-4 text-gold-400" /></div>
                <div className="text-sm text-cream/90 leading-relaxed">Consider running targeted acquisition campaigns in Epe. Land values are projected to increase by 25% over the next 18 months.</div>
              </div>
              <div className="flex gap-3 bg-white/[0.02] border border-white/5 p-4 rounded-xl">
                <div className="pt-0.5"><TrendingUp className="h-4 w-4 text-emerald-400" /></div>
                <div className="text-sm text-cream/90 leading-relaxed">Demand for short-let apartments in VI has spiked 18%. Advise agencies to prioritize premium short-let listings.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Total Property Value" value="₦4.2T" trend="Platform GMV" trendColor="text-emerald-400" icon={Activity} />
        <KPICard title="Average Rental Yield" value="6.8%" trend="National Average" trendColor="text-emerald-400" icon={TrendingUp} />
        <KPICard title="Price Appreciation" value="12.4%" trend="Annual Forecast" trendColor="text-emerald-400" icon={BarChart3} />
        <KPICard title="New Developments" value="84" trend="Active projects" trendColor="text-blue-400" icon={MapPin} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Regional Performance Analytics */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <h3 className="font-heading text-lg font-bold text-cream mb-4 flex items-center gap-2">
             <MapPin className="h-5 w-5 text-emerald-400" /> Regional Performance Analytics
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-navy-900/50 border border-white/5 rounded-xl">
               <div className="flex justify-between items-center mb-2">
                 <span className="font-medium text-cream">Ikoyi, Lagos</span>
                 <span className="text-sm font-bold text-emerald-400">+14% Growth</span>
               </div>
               <div className="flex gap-4 text-xs text-ink/60">
                 <span>Avg Price: ₦450M</span>
                 <span>Avg Yield: 5.2%</span>
                 <span>Demand: Very High</span>
               </div>
            </div>
            <div className="p-4 bg-navy-900/50 border border-white/5 rounded-xl">
               <div className="flex justify-between items-center mb-2">
                 <span className="font-medium text-cream">Maitama, Abuja</span>
                 <span className="text-sm font-bold text-emerald-400">+11% Growth</span>
               </div>
               <div className="flex gap-4 text-xs text-ink/60">
                 <span>Avg Price: ₦380M</span>
                 <span>Avg Yield: 6.1%</span>
                 <span>Demand: High</span>
               </div>
            </div>
            <div className="p-4 bg-navy-900/50 border border-white/5 rounded-xl">
               <div className="flex justify-between items-center mb-2">
                 <span className="font-medium text-cream">Bodija, Ibadan</span>
                 <span className="text-sm font-bold text-blue-400">+8% Growth</span>
               </div>
               <div className="flex gap-4 text-xs text-ink/60">
                 <span>Avg Price: ₦120M</span>
                 <span>Avg Yield: 7.4%</span>
                 <span>Demand: Steady</span>
               </div>
            </div>
          </div>
        </div>

        {/* Property Forecast Dashboard & Market Trends */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col justify-center items-center min-h-[300px]">
          <Brain className="h-16 w-16 text-gold-400/50 mb-4" />
          <h3 className="font-heading text-xl font-bold text-cream">Property Forecast Visualizations</h3>
          <p className="text-sm text-ink/60 mt-2 text-center max-w-sm">
            Interactive heatmaps and predictive pricing charts would render here based on historical market data and macroeconomic indicators.
          </p>
        </div>
      </div>
    </div>
  );
}

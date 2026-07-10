import { useState } from 'react';
import { PieChart as PieChartIcon, BarChart3, LineChart, Map, TrendingUp, Filter, Activity, MapPin } from 'lucide-react';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { GhostButton, GoldButton } from '../../../components/ui/ui';

export default function Charts() {
  const [activeChart, setActiveChart] = useState('Revenue');

  return (
    <div className="space-y-6 pb-12">
      <DashboardHeader 
        name="Executive Visualization Center" 
        subtitle="Interactive executive charts, revenue trend visualizations, and geographic heatmaps."
        actions={
          <div className="flex gap-3">
            <select 
              value={activeChart}
              onChange={(e) => setActiveChart(e.target.value)}
              className="bg-navy-900/50 border border-white/10 text-sm text-cream rounded-lg px-3 py-2 appearance-none focus:outline-none focus:border-gold-400"
            >
              <option>Revenue Trends</option>
              <option>User Growth</option>
              <option>Geographic Maps</option>
            </select>
            <GoldButton className="flex items-center gap-2">
              <Filter className="h-4 w-4" /> Filter Data
            </GoldButton>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col min-h-[350px]">
           <div className="flex justify-between items-center mb-6">
             <h3 className="font-heading text-lg font-bold text-cream flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-400" /> Revenue Trend Visualizations
             </h3>
           </div>
           <div className="flex-1 flex flex-col items-center justify-center">
             <BarChart3 className="h-16 w-16 text-blue-400/20 mb-4" />
             <p className="text-sm text-ink/60 text-center max-w-xs">Interactive bar chart displaying MRR growth, quarterly targets, and Year-over-Year comparison.</p>
           </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col min-h-[350px]">
           <div className="flex justify-between items-center mb-6">
             <h3 className="font-heading text-lg font-bold text-cream flex items-center gap-2">
                <LineChart className="h-5 w-5 text-emerald-400" /> User Growth Charts
             </h3>
           </div>
           <div className="flex-1 flex flex-col items-center justify-center">
             <LineChart className="h-16 w-16 text-emerald-400/20 mb-4" />
             <p className="text-sm text-ink/60 text-center max-w-xs">Line graph overlaying Buyer, Owner, and Agent acquisition rates across a 12-month timeline.</p>
           </div>
        </div>
        
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col min-h-[400px]">
           <div className="flex justify-between items-center mb-6">
             <h3 className="font-heading text-lg font-bold text-cream flex items-center gap-2">
                <Map className="h-5 w-5 text-gold-400" /> Geographic Distribution Maps
             </h3>
             <GhostButton className="text-xs">Export Map Data</GhostButton>
           </div>
           <div className="flex-1 flex flex-col items-center justify-center">
             <MapPin className="h-16 w-16 text-gold-400/20 mb-4" />
             <p className="text-sm text-ink/60 text-center max-w-sm">An interactive heatmap of Nigeria showcasing property sales density, agency penetration, and regional revenue performance.</p>
           </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col min-h-[350px]">
           <div className="flex justify-between items-center mb-6">
             <h3 className="font-heading text-lg font-bold text-cream flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-400" /> Executive Performance Trends
             </h3>
           </div>
           <div className="flex-1 flex flex-col items-center justify-center">
             <Activity className="h-16 w-16 text-purple-400/20 mb-4" />
             <p className="text-sm text-ink/60 text-center max-w-xs">Radar chart analyzing leadership KPI attainment, compliance scores, and departmental velocity.</p>
           </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col min-h-[350px]">
           <div className="flex justify-between items-center mb-6">
             <h3 className="font-heading text-lg font-bold text-cream flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-rose-400" /> Agency Growth Analytics
             </h3>
           </div>
           <div className="flex-1 flex flex-col items-center justify-center">
             <PieChartIcon className="h-16 w-16 text-rose-400/20 mb-4" />
             <p className="text-sm text-ink/60 text-center max-w-xs">Donut chart breaking down Agency Tier distribution (Elite, Premium, Standard) and their respective revenue slices.</p>
           </div>
        </div>
      </div>
    </div>
  );
}

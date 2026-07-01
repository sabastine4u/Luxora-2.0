import { PieChart as PieChartIcon, BarChart3, LineChart } from 'lucide-react';

export default function Charts() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Visual Data Center</h2>
          <p className="text-sm text-ink/60">Platform metrics visualized.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col items-center justify-center min-h-[300px]">
           <BarChart3 className="h-16 w-16 text-blue-400/50 mb-4" />
           <p className="text-cream font-semibold">Revenue Growth by Quarter (Mock)</p>
           <p className="text-sm text-ink/60 mt-2 text-center max-w-xs">A bar chart showing steady 15% Q-o-Q growth over the last 4 quarters.</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col items-center justify-center min-h-[300px]">
           <PieChartIcon className="h-16 w-16 text-gold-400/50 mb-4" />
           <p className="text-cream font-semibold">User Demographics (Mock)</p>
           <p className="text-sm text-ink/60 mt-2 text-center max-w-xs">A pie chart showing 60% Buyers, 25% Owners, 10% Agents, 5% Agencies.</p>
        </div>
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col items-center justify-center min-h-[400px]">
           <LineChart className="h-16 w-16 text-emerald-400/50 mb-4" />
           <p className="text-cream font-semibold">Active Listings Over Time (Mock)</p>
           <p className="text-sm text-ink/60 mt-2 text-center max-w-sm">A line graph demonstrating the exponential growth of properties listed on the platform since January 2024.</p>
        </div>
      </div>
    </div>
  );
}

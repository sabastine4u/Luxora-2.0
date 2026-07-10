import { Download, TrendingUp, Eye, Heart, Calendar, FileText, Clock, MapPin, DollarSign, ArrowDown, Search } from 'lucide-react';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { EmptyState } from '../../../components/layout/EmptyState';

export default function Analytics() {
  // Mock Data
  const hasAnalytics = true; // Toggle for empty state

  const kpis = [
    { label: 'Total Property Views', value: '14.2k', delta: '+12%', icon: Eye, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Total Saves', value: '1,420', delta: '+8%', icon: Heart, color: 'text-rose-400', bg: 'bg-rose-400/10' },
    { label: 'Viewing Requests', value: '84', delta: '+22%', icon: Calendar, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Active Offers', value: '12', delta: '+2%', icon: FileText, color: 'text-gold-400', bg: 'bg-gold-400/10' },
    { label: 'Conversion Rate', value: '3.2%', delta: '+0.4%', icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'Avg. Time on Market', value: '24 Days', delta: '-3 Days', icon: Clock, color: 'text-orange-400', bg: 'bg-orange-400/10' },
  ];

  const viewsData = [40, 55, 45, 70, 60, 85, 95, 80, 110, 100, 130, 145, 120, 160];
  const maxViews = Math.max(...viewsData);

  const engagementData = [
    { day: 'Mon', views: 80, saves: 20, shares: 10, requests: 5 },
    { day: 'Tue', views: 95, saves: 25, shares: 15, requests: 8 },
    { day: 'Wed', views: 110, saves: 30, shares: 12, requests: 10 },
    { day: 'Thu', views: 90, saves: 22, shares: 8, requests: 4 },
    { day: 'Fri', views: 130, saves: 40, shares: 20, requests: 12 },
    { day: 'Sat', views: 160, saves: 50, shares: 25, requests: 15 },
    { day: 'Sun', views: 145, saves: 45, shares: 18, requests: 11 },
  ];
  const maxEng = Math.max(...engagementData.map(d => d.views));

  const topProperties = [
    { name: 'Skyline Penthouse Residence', views: '8.4k', saves: '942', offers: '7', requests: '42', conv: '5.2%' },
    { name: 'Garden Court Villa', views: '4.2k', saves: '318', offers: '3', requests: '28', conv: '3.1%' },
    { name: 'Banana Island Plot', views: '1.6k', saves: '160', offers: '2', requests: '14', conv: '2.8%' },
  ];

  const marketPerformance = [
    { label: 'Average Price', value: '₦450M', trend: '+5.2%', icon: DollarSign },
    { label: 'Market Trend', value: 'Bullish', trend: 'High', icon: TrendingUp },
    { label: 'Demand Level', value: 'Very High', trend: '+12%', icon: Search },
    { label: 'Popular Property Type', value: '4 Bed Villas', trend: 'Stable', icon: Heart },
    { label: 'Trending Locations', value: 'Ikoyi, VI', trend: 'Hot', icon: MapPin },
  ];

  const revenueInsights = [
    { label: 'Rental Revenue', value: '₦108.0M', color: 'text-emerald-400' },
    { label: 'Sales Revenue', value: '₦850.0M', color: 'text-gold-400' },
    { label: 'Expected Revenue', value: '₦45.5M', color: 'text-blue-400' },
    { label: 'Lost Revenue', value: '₦12.0M', color: 'text-rose-400' },
  ];

  const funnelStages = [
    { stage: 'Views', value: '14,200', dropoff: '100%' },
    { stage: 'Saves', value: '1,420', dropoff: '10%' },
    { stage: 'Viewing Requests', value: '84', dropoff: '5.9%' },
    { stage: 'Offers', value: '24', dropoff: '28.5%' },
    { stage: 'Accepted Offers', value: '6', dropoff: '25%' },
    { stage: 'Completed Sales', value: '2', dropoff: '33.3%' },
  ];

  const listingHealth = [
    { name: 'Skyline Penthouse Residence', vis: '98%', photo: 'High', desc: 'Detailed', seo: '95%', comp: '100%' },
    { name: 'Garden Court Villa', vis: '85%', photo: 'Medium', desc: 'Brief', seo: '72%', comp: '80%' },
    { name: 'Banana Island Plot', vis: '60%', photo: 'Low', desc: 'Missing info', seo: '45%', comp: '50%' },
  ];

  if (!hasAnalytics) {
    return (
      <div className="space-y-6">
        <EmptyState
          icon={<TrendingUp className="h-8 w-8 text-gold-400" />}
          title="No analytics available."
          description="You do not have any active properties generating data."
          actionLabel="View Listings"
          onAction={() => alert('Mock: View Listings')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Property Analytics</h2>
          <p className="text-sm text-ink/60">Track the performance of your listings, engagement, and business growth.</p>
        </div>
        <div className="flex gap-3">
          <GhostButton onClick={() => alert('Mock: Export Report')}><FileText className="h-4 w-4 mr-2" /> Export Report</GhostButton>
          <GoldButton onClick={() => alert('Mock: Download PDF')}><Download className="h-4 w-4 mr-2" /> Download PDF</GoldButton>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {kpis.map((stat, i) => (
          <KPICard 
            key={i}
            title={stat.label}
            value={stat.value}
            icon={stat.icon}
            trend={stat.delta}
            trendColor={stat.color}
            iconColor={stat.color}
            backgroundColor={stat.bg}
            hoverEffect="none"
            iconBorder={true}
            valueTypography="heading"
            labelTypography="uppercase-small"
            trendPosition="inline-label-top"
          />
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Performance Overview (Views) */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-heading text-lg font-semibold text-cream">Property Views</h3>
            <span className="text-xs text-ink/50 px-2 py-1 bg-navy-900 rounded-md border border-white/5">Last 30 Days</span>
          </div>
          <div className="flex h-48 items-end gap-1.5 border-b border-white/10 pb-2">
            {viewsData.map((h, i) => (
              <div key={i} className="group relative flex flex-1 flex-col items-center gap-2 h-full justify-end">
                <div
                  className="w-full rounded-t-sm bg-gradient-to-t from-blue-600/40 to-blue-400 transition-all duration-300 group-hover:from-blue-500/60 group-hover:to-blue-300"
                  style={{ height: `${(h / maxViews) * 100}%` }}
                />
                <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-navy-900 border border-white/10 rounded px-2 py-1 text-xs text-cream whitespace-nowrap z-10 pointer-events-none">
                  {h}00 views
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3 text-[10px] text-ink/50 uppercase">
            <span>Oct 1</span>
            <span>Oct 15</span>
            <span>Oct 30</span>
          </div>
        </div>

        {/* Engagement Chart */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-heading text-lg font-semibold text-cream">Daily Engagement</h3>
            <div className="flex gap-2 text-[10px] uppercase font-semibold text-ink/50">
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-400"/> Views</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rose-400"/> Saves</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-400"/> Reqs</span>
            </div>
          </div>
          <div className="flex h-48 items-end justify-between border-b border-white/10 pb-2">
            {engagementData.map((d, i) => (
              <div key={i} className="group relative flex flex-col items-center w-8 h-full justify-end">
                <div className="w-full flex flex-col justify-end gap-0.5 h-full relative">
                   {/* Stacked visually using flex-col, from top to bottom (views is largest base, saves next, etc) - wait, stacked means total height is sum. 
                       For simplicity we'll just layer them or make them side-by-side. Let's do side-by-side flex */}
                   <div className="w-full h-full flex items-end gap-[1px]">
                     <div className="flex-1 bg-blue-400 rounded-t-sm" style={{ height: `${(d.views/maxEng)*100}%` }}/>
                     <div className="flex-1 bg-rose-400 rounded-t-sm" style={{ height: `${(d.saves/maxEng)*100}%` }}/>
                     <div className="flex-1 bg-emerald-400 rounded-t-sm" style={{ height: `${(d.requests/maxEng)*100}%` }}/>
                   </div>
                </div>
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-navy-900 border border-white/10 rounded p-2 text-xs text-cream whitespace-nowrap z-10 pointer-events-none flex flex-col gap-1">
                  <span><span className="text-blue-400">Views:</span> {d.views}</span>
                  <span><span className="text-rose-400">Saves:</span> {d.saves}</span>
                  <span><span className="text-emerald-400">Reqs:</span> {d.requests}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3 text-[10px] text-ink/50 uppercase">
            {engagementData.map(d => <span key={d.day}>{d.day}</span>)}
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Top Properties & Market Perf */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Top Performing Properties */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h3 className="font-heading text-lg font-bold text-cream">Top Performing Properties</h3>
            </div>
            <div className="w-full">
              <DataTable
                data={topProperties}
                keyExtractor={(prop) => prop.name}
                columns={[
                  {
                    header: "Property",
                    render: (prop) => <span className="font-medium text-cream">{prop.name}</span>
                  },
                  {
                    header: "Views",
                    render: (prop) => <span className="text-ink/60">{prop.views}</span>
                  },
                  {
                    header: "Saves",
                    render: (prop) => <span className="text-ink/60">{prop.saves}</span>
                  },
                  {
                    header: "Viewing Reqs",
                    render: (prop) => <span className="text-ink/60">{prop.requests}</span>
                  },
                  {
                    header: "Offers",
                    render: (prop) => <span className="text-ink/60">{prop.offers}</span>
                  },
                  {
                    header: <div className="text-right">Conv %</div>,
                    className: "text-right",
                    render: (prop) => <span className="font-bold text-gold-400">{prop.conv}</span>
                  }
                ]}
              />
            </div>
          </div>

          {/* Listing Health */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h3 className="font-heading text-lg font-bold text-cream">Listing Health</h3>
            </div>
            <div className="w-full">
              <DataTable
                data={listingHealth}
                keyExtractor={(health) => health.name}
                columns={[
                  {
                    header: "Property",
                    render: (health) => <span className="font-medium text-cream truncate max-w-[150px]">{health.name}</span>
                  },
                  {
                    header: "Visibility",
                    render: (health) => (
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 bg-navy-900 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-400" style={{ width: health.vis }}/>
                        </div>
                        <span className="text-xs">{health.vis}</span>
                      </div>
                    )
                  },
                  {
                    header: "Photo Qual.",
                    render: (health) => <span className="text-ink/60">{health.photo}</span>
                  },
                  {
                    header: "Description",
                    render: (health) => <span className="text-ink/60">{health.desc}</span>
                  },
                  {
                    header: "SEO Score",
                    render: (health) => <span className="text-ink/60">{health.seo}</span>
                  },
                  {
                    header: <div className="text-right">Completion</div>,
                    className: "text-right",
                    render: (health) => <span className="font-bold text-emerald-400">{health.comp}</span>
                  }
                ]}
              />
            </div>
          </div>

          {/* Market Performance */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-lg font-bold text-cream mb-6">Market Performance</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
               {marketPerformance.map((perf, i) => (
                 <div key={i} className="p-4 rounded-xl bg-navy-900 border border-white/5 flex flex-col items-center justify-center text-center">
                   <perf.icon className="h-5 w-5 text-gold-400 mb-2" />
                   <div className="font-bold text-cream text-lg">{perf.value}</div>
                   <div className="text-[10px] text-ink/50 uppercase mt-1">{perf.label}</div>
                   <div className="text-[10px] text-emerald-400 mt-2 bg-emerald-500/10 px-2 py-0.5 rounded-full">{perf.trend}</div>
                 </div>
               ))}
            </div>
          </div>

        </div>

        {/* Right Column: Conversion Funnel & Revenue Insights */}
        <div className="space-y-8">
          
          {/* Conversion Funnel */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-lg font-bold text-cream mb-6">Conversion Funnel</h3>
            <div className="space-y-2 relative">
              {funnelStages.map((stage, i) => (
                <div key={i} className="relative z-10 flex flex-col items-center">
                  <div className="w-full flex items-center justify-between p-3 rounded-xl bg-navy-900 border border-white/5">
                    <span className="text-sm font-semibold text-cream">{stage.stage}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gold-400">{stage.value}</span>
                      <span className="text-[10px] text-ink/50 w-10 text-right">{stage.dropoff}</span>
                    </div>
                  </div>
                  {i < funnelStages.length - 1 && (
                    <div className="h-6 flex items-center justify-center text-ink/20">
                      <ArrowDown className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Insights */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-lg font-bold text-cream mb-6">Revenue Insights</h3>
            <div className="space-y-4">
              {revenueInsights.map((rev, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-navy-900 border border-white/5">
                  <span className="text-sm font-semibold text-cream">{rev.label}</span>
                  <span className={`font-bold text-lg ${rev.color}`}>{rev.value}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

import { TrendingUp, Target, Building2, Activity, Star, DollarSign, ArrowUpRight, ArrowDownRight, PieChart } from 'lucide-react';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { SegmentedProgressBar } from '../../../components/dashboard/shared/widgets/SegmentedProgressBar';
import { ActivityTimeline } from '../../../components/dashboard/shared/timelines/ActivityTimeline';
import { GhostButton } from '../../../components/ui/ui';

export default function Performance() {
  const closedDeals = [
    { title: 'The Continental Duplex', time: 'Yesterday', desc: '₦450M • Sarah James', icon: Building2, color: 'text-emerald-400' },
    { title: 'Ikoyi Penthouse', time: '3 days ago', desc: '₦850M • Emeka Uzo', icon: Building2, color: 'text-emerald-400' },
    { title: 'Victoria Island Office', time: '1 week ago', desc: '₦1.2B • Sarah James', icon: Building2, color: 'text-emerald-400' },
  ];

  const agentRankings = [
    { name: 'Sarah James', revenue: '₦1.6B', deals: 4, score: 98, trend: 'up' },
    { name: 'Emeka Uzo', revenue: '₦850M', deals: 1, score: 92, trend: 'up' },
    { name: 'Michael Eze', revenue: '₦450M', deals: 2, score: 85, trend: 'down' },
    { name: 'Daniel O.', revenue: '₦0', deals: 0, score: 70, trend: 'down' },
  ];

  return (
    <div className="space-y-6">
      <DashboardHeader
        name="Agency Performance"
        subtitle="Executive intelligence, market analysis, and agency productivity."
      />

      {/* Executive KPI Dashboard */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Revenue (YTD)"
          value="₦8.4B"
          trend="+18% YoY"
          trendColor="text-emerald-400"
          icon={DollarSign}
        />
        <KPICard
          title="Sales Volume"
          value="42"
          trend="Deals closed this year"
          trendColor="text-blue-400"
          icon={TrendingUp}
        />
        <KPICard
          title="Listing Conversion"
          value="14.2%"
          trend="+2.1% vs Q3"
          trendColor="text-emerald-400"
          icon={Target}
        />
        <KPICard
          title="Agency Growth Rate"
          value="24%"
          trend="Market Share: 12%"
          trendColor="text-gold-400"
          icon={Activity}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Main Analytics */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Revenue Distribution & Trends */}
            <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col justify-between">
              <div>
                <h3 className="font-heading text-lg font-semibold text-cream mb-6 flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-gold-400" /> Revenue Distribution
                </h3>
                <SegmentedProgressBar
                  segments={[
                    { label: 'Residential', value: 45, color: 'bg-blue-400' },
                    { label: 'Commercial', value: 35, color: 'bg-gold-400' },
                    { label: 'Luxury', value: 20, color: 'bg-indigo-400' }
                  ]}
                />
                <div className="mt-6 flex justify-between text-xs text-ink/80">
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-400"></div> Res: ₦3.7B</div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-gold-400"></div> Com: ₦2.9B</div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-400"></div> Lux: ₦1.6B</div>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-white/5">
                <div className="text-sm font-bold text-cream mb-3">Market Performance Summary</div>
                <div className="flex items-center gap-4 text-xs text-ink/80">
                  <span className="flex items-center gap-1 text-emerald-400"><ArrowUpRight className="h-3 w-3" /> +15% vs Market Avg</span>
                  <span className="flex items-center gap-1 text-blue-400"><TrendingUp className="h-3 w-3" /> Top 3 Agency in Region</span>
                </div>
              </div>
            </div>

            {/* Sales Funnel */}
            <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
              <h3 className="font-heading text-lg font-semibold text-cream mb-6 flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-400" /> Lead to Deal Funnel
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-ink/80">Total Inquiries</span>
                    <span className="font-bold text-cream">1,245</span>
                  </div>
                  <div className="h-3 w-full bg-slate-500 rounded"></div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-ink/80">Viewings</span>
                    <span className="font-bold text-cream">480</span>
                  </div>
                  <div className="h-3 w-[70%] mx-auto bg-blue-400 rounded"></div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-ink/80">Offers Made</span>
                    <span className="font-bold text-cream">112</span>
                  </div>
                  <div className="h-3 w-[45%] mx-auto bg-yellow-400 rounded"></div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-ink/80">Closed Deals</span>
                    <span className="font-bold text-cream">42</span>
                  </div>
                  <div className="h-3 w-[25%] mx-auto bg-emerald-400 rounded"></div>
                </div>
              </div>
              <div className="mt-6 text-center text-xs text-ink/60">
                Overall conversion rate: <span className="font-bold text-emerald-400">3.4%</span>
              </div>
            </div>

          </div>

          {/* Monthly Revenue Trends */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-lg font-semibold text-cream mb-6 flex items-center gap-2">
              <Activity className="h-5 w-5 text-emerald-400" /> Revenue & Productivity Trends
            </h3>
            <div className="h-64 flex items-end gap-3 mt-4 relative">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                <div className="border-t border-white/20 w-full"></div>
                <div className="border-t border-white/20 w-full"></div>
                <div className="border-t border-white/20 w-full"></div>
                <div className="border-t border-white/20 w-full"></div>
              </div>
              {[40, 60, 45, 80, 50, 95, 85, 70, 90, 65, 80, 100].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end gap-1 group relative h-full">
                  <div 
                    className="w-full bg-blue-400/40 rounded-t-sm transition-all group-hover:bg-blue-400/60" 
                    style={{ height: `${h}%` }}
                  ></div>
                  <div 
                    className="absolute bottom-0 w-full bg-emerald-400/60 rounded-t-sm transition-all group-hover:bg-emerald-400" 
                    style={{ height: `${h * 0.4}%` }}
                  ></div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-ink/60 mt-4">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
              <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
            </div>
            <div className="flex gap-4 mt-4 justify-center">
              <div className="flex items-center gap-2 text-xs text-ink/60"><div className="w-3 h-3 rounded-sm bg-blue-400/40"></div> Revenue Target</div>
              <div className="flex items-center gap-2 text-xs text-ink/60"><div className="w-3 h-3 rounded-sm bg-emerald-400/60"></div> Actual Revenue</div>
            </div>
          </div>

        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Agent Leaderboard */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-lg font-semibold text-cream flex items-center gap-2">
                <Star className="h-5 w-5 text-gold-400" /> Agent Leaderboard
              </h3>
            </div>
            <div className="space-y-4">
              {agentRankings.map((agent, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-navy-900/50">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      i === 0 ? 'bg-gold-400 text-navy-950' : 
                      i === 1 ? 'bg-zinc-300 text-navy-950' : 
                      i === 2 ? 'bg-amber-600 text-white' : 
                      'bg-navy-800 text-ink/60'
                    }`}>
                      {i + 1}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-cream">{agent.name}</div>
                      <div className="text-[10px] text-ink/60">{agent.deals} Deals</div>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <div className="font-bold text-sm text-emerald-400">{agent.revenue}</div>
                      <div className="text-[10px] text-ink/60">Score: {agent.score}</div>
                    </div>
                    {agent.trend === 'up' ? <ArrowUpRight className="h-4 w-4 text-emerald-400" /> : <ArrowDownRight className="h-4 w-4 text-rose-400" />}
                  </div>
                </div>
              ))}
            </div>
            <GhostButton className="w-full mt-4 text-xs">View Full Rankings</GhostButton>
          </div>

          {/* Department Productivity */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-lg font-semibold text-cream mb-4">Department ROI</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-cream">Residential</div>
                  <div className="text-xs text-ink/60">ROI: 320%</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-emerald-400">₦3.7B</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-cream">Commercial</div>
                  <div className="text-xs text-ink/60">ROI: 410%</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-emerald-400">₦2.9B</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-cream">Luxury</div>
                  <div className="text-xs text-ink/60">ROI: 550%</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-emerald-400">₦1.6B</div>
                </div>
              </div>
            </div>
          </div>

          {/* Closed Deals Analytics Summary */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <ActivityTimeline
              title="Recent Conversions"
              items={closedDeals}
            />
          </div>

        </div>

      </div>
    </div>
  );
}

import { Target, TrendingUp, Award, BarChart3, AlertTriangle, ArrowRight, Activity, FileText } from 'lucide-react';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { ActivityTimeline } from '../../../components/dashboard/shared/timelines/ActivityTimeline';
import { GhostButton, GoldButton } from '../../../components/ui/ui';

export default function Performance() {
  const departmentScores = [
    { name: 'Finance', score: 'A+', efficiency: 98, progress: 95, color: 'bg-emerald-400' },
    { name: 'Intelligence', score: 'A', efficiency: 92, progress: 88, color: 'bg-emerald-400' },
    { name: 'Procurement', score: 'B+', efficiency: 85, progress: 82, color: 'bg-blue-400' },
    { name: 'Property', score: 'B', efficiency: 78, progress: 75, color: 'bg-yellow-400' },
  ];

  const executiveHighlights = [
    { title: 'Q3 Goal Achieved: Cost Reduction', time: 'Oct 01, 2025', desc: '15% reduction in operating costs across all sectors', icon: Award, color: 'text-gold-400' },
    { title: 'New Performance Benchmark Set', time: 'Sep 28, 2025', desc: 'Intelligence dept exceeded processing KPIs by 22%', icon: Target, color: 'text-emerald-400' },
    { title: 'Efficiency Warning: Logistics', time: 'Sep 15, 2025', desc: 'Delivery SLAs dropped below 90% threshold', icon: AlertTriangle, color: 'text-rose-400' },
  ];

  const goalBreakdown = [
    { label: 'Revenue Targets', value: 95, status: 'On Track' },
    { label: 'Client Satisfaction', value: 88, status: 'On Track' },
    { label: 'Operational Scaling', value: 72, status: 'At Risk' },
    { label: 'Talent Acquisition', value: 65, status: 'Behind' },
  ];

  return (
    <div className="space-y-6">
      <DashboardHeader
        name="Enterprise Performance"
        subtitle="Quarterly scorecards, executive insights, and organizational productivity."
        actions={
          <div className="flex gap-3">
            <GhostButton className="flex items-center gap-2">
              <FileText className="h-4 w-4" /> View Full Report
            </GhostButton>
            <GoldButton className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" /> Custom Analytics
            </GoldButton>
          </div>
        }
      />

      {/* Quarterly Executive Dashboard (KPIs) */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Overall Efficiency"
          value="92.4%"
          trend="+1.2% this quarter"
          trendColor="text-emerald-400"
          icon={Activity}
          footer={<div className="text-xs text-ink/60">Across all departments</div>}
        />
        <KPICard
          title="Goal Achievement"
          value="88%"
          trend="4/5 targets met"
          trendColor="text-emerald-400"
          icon={Target}
          footer={<div className="text-xs text-ink/60">Q3 Enterprise Goals</div>}
        />
        <KPICard
          title="Productivity Index"
          value="A-"
          trend="Top quartile"
          trendColor="text-blue-400"
          icon={Award}
          footer={<div className="text-xs text-ink/60">Industry benchmark</div>}
        />
        <KPICard
          title="Performance Risks"
          value="3"
          trend="-2 from last month"
          trendColor="text-emerald-400"
          icon={AlertTriangle}
          footer={<div className="text-xs text-ink/60">Requiring executive attention</div>}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Executive Performance Insights (Monthly Summary) */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col md:flex-row gap-6 items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gold-400/10 text-gold-400 border border-gold-400/20 shrink-0">
              <TrendingUp className="h-10 w-10" />
            </div>
            <div className="flex-1">
              <h3 className="font-heading text-lg font-bold text-cream mb-2">Monthly Executive Summary</h3>
              <p className="text-sm text-ink/80 leading-relaxed mb-4">
                Enterprise productivity is operating at peak levels. Finance and Intelligence have achieved their Q3 targets early. Property Management requires additional resources to meet upcoming Q4 scaling goals. Overall trajectory remains highly positive.
              </p>
              <div className="flex gap-4">
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">Growth: +12%</span>
                <span className="text-xs font-semibold text-blue-400 bg-blue-400/10 px-2 py-1 rounded">Retention: 98%</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Department Efficiency Comparison & Organization Scorecards */}
            <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-lg font-semibold text-cream">Department Scorecards</h3>
              </div>
              <div className="space-y-4 flex-1">
                {departmentScores.map((dept, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-cream">{dept.name}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${dept.color}`}>{dept.score}</span>
                        <span className="text-xs text-ink/60 w-12 text-right">{dept.efficiency}%</span>
                      </div>
                    </div>
                    <div className="h-1.5 w-full bg-navy-950 rounded-full overflow-hidden border border-white/5">
                      <div className={`h-full ${dept.color}`} style={{ width: `${dept.efficiency}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
              <GhostButton className="w-full mt-4 flex items-center justify-center gap-2 text-xs">
                View Full Rankings <ArrowRight className="h-4 w-4" />
              </GhostButton>
            </div>

            {/* Goal Achievement Breakdown */}
            <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col h-full">
              <h3 className="font-heading text-lg font-semibold text-cream mb-4">Goal Achievement</h3>
              <div className="space-y-4 flex-1">
                {goalBreakdown.map((goal, i) => (
                  <div key={i} className="p-3 bg-navy-900/50 rounded-xl border border-white/5 flex flex-col gap-2 hover:bg-white/5 transition-colors cursor-pointer">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-cream">{goal.label}</span>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        goal.status === 'On Track' ? 'bg-emerald-400/10 text-emerald-400' :
                        goal.status === 'At Risk' ? 'bg-yellow-400/10 text-yellow-400' :
                        'bg-rose-400/10 text-rose-400'
                      }`}>
                        {goal.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 flex-1 bg-navy-950 rounded-full overflow-hidden">
                        <div className={`h-full ${
                          goal.status === 'On Track' ? 'bg-emerald-400' :
                          goal.status === 'At Risk' ? 'bg-yellow-400' :
                          'bg-rose-400'
                        }`} style={{ width: `${goal.value}%` }}></div>
                      </div>
                      <span className="text-xs font-bold text-cream w-8 text-right">{goal.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Productivity Distribution */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-lg font-semibold text-cream mb-4">Productivity Distribution</h3>
            <div className="flex items-center justify-center py-6">
              <div className="relative h-32 w-32 rounded-full border-[12px] border-navy-900 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-[12px] border-emerald-400/20 pointer-events-none"></div>
                <div className="absolute inset-0 rounded-full border-[12px] border-transparent border-t-emerald-400 border-r-emerald-400 pointer-events-none" style={{ transform: 'rotate(45deg)' }}></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cream">78%</div>
                  <div className="text-[10px] text-ink/60 uppercase">Optimal</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="text-center">
                <div className="text-xs text-ink/60 mb-1">Strained</div>
                <div className="text-sm font-semibold text-yellow-400">15%</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-ink/60 mb-1">Critical</div>
                <div className="text-sm font-semibold text-rose-400">7%</div>
              </div>
            </div>
          </div>

          {/* Performance Highlights Timeline */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <ActivityTimeline
              title="Executive Highlights"
              items={executiveHighlights}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Activity, Server, Users, ArrowUpRight, Brain, Target, Calendar, ShieldCheck, TrendingUp, AlertCircle, Clock, FileCheck } from 'lucide-react';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { ActivityTimeline } from '../../../components/dashboard/shared/timelines/ActivityTimeline';
import { GhostButton, GoldButton } from '../../../components/ui/ui';

export default function BusinessHealth() {
  const [activeGoal, setActiveGoal] = useState('Q4 Expansion');

  const briefing = [
    { text: 'Platform health is optimal at 99.99% uptime. 2 critical patches deployed overnight.', icon: ShieldCheck, color: 'text-emerald-400' },
    { text: 'User growth exceeded Q3 targets by 14%. Focus shifted to retention initiatives.', icon: TrendingUp, color: 'text-gold-400' },
    { text: '3 high-priority agency partnerships awaiting your final executive review.', icon: FileCheck, color: 'text-blue-400' }
  ];

  const goals = [
    { title: 'Q4 Expansion', progress: 78, status: 'On Track' },
    { title: 'Enterprise Compliance', progress: 95, status: 'Near Completion' },
    { title: 'AI Integration', progress: 42, status: 'At Risk' }
  ];

  const notifications = [
    { title: 'Server Load Alert', desc: 'Cluster A reached 85% capacity during peak hours.', time: '10m ago', icon: AlertCircle, color: 'text-orange-400' },
    { title: 'New Executive Report', desc: 'Weekly revenue forecast generated.', time: '1h ago', icon: FileCheck, color: 'text-blue-400' },
    { title: 'Audit Passed', desc: 'Q3 Security Audit completed successfully.', time: '3h ago', icon: ShieldCheck, color: 'text-emerald-400' }
  ];

  return (
    <div className="space-y-6 pb-12">
      <DashboardHeader 
        name="Executive Command Center" 
        subtitle="Global system status, organization health, and strategic intelligence."
        actions={
          <div className="flex gap-3">
            <GhostButton className="flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Schedule Briefing
            </GhostButton>
            <GoldButton className="flex items-center gap-2">
              <Activity className="h-4 w-4" /> Download Executive Summary
            </GoldButton>
          </div>
        }
      />

      {/* AI Business Assistant & Daily Briefing */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-gradient-to-br from-navy-800 to-navy-900 border border-white/10 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-32 bg-gold-400/5 blur-[100px] rounded-full pointer-events-none"></div>
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gold-400/20 rounded-xl">
                <Brain className="h-6 w-6 text-gold-400" />
              </div>
              <h3 className="font-heading text-xl font-bold text-cream">Executive AI Assistant</h3>
            </div>
            <div className="space-y-3 relative z-10">
              {briefing.map((item, idx) => (
                <div key={idx} className="flex gap-3 bg-white/[0.02] border border-white/5 p-4 rounded-xl">
                  <div className="pt-0.5"><item.icon className={`h-5 w-5 ${item.color}`} /></div>
                  <div className="text-sm text-cream/90 leading-relaxed">{item.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Global System Status */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col h-full justify-between">
          <div>
            <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
              <Server className="h-4 w-4 text-emerald-400" /> Global System Status
            </h3>
            <div className="space-y-4">
              <div className="bg-navy-900/50 p-4 rounded-xl border border-white/5 text-center">
                <div className="text-sm text-ink/60 mb-1">Platform Health Score</div>
                <div className="text-3xl font-bold text-emerald-400">99.9%</div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-ink/80">API Gateway</span>
                  <span className="text-emerald-400 font-medium">Operational</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-ink/80">Payment Processor</span>
                  <span className="text-emerald-400 font-medium">Operational</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-ink/80">Search Clusters</span>
                  <span className="text-orange-400 font-medium">Degraded</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Organization Health" value="A+" trend="Stable" trendColor="text-emerald-400" icon={Activity} />
        <KPICard title="Executive Productivity" value="94" trend="Top 1%" trendColor="text-emerald-400" icon={Target} />
        <KPICard title="Total Active Users" value="142.5K" trend="+12% MoM" trendColor="text-emerald-400" icon={Users} />
        <KPICard title="Platform Conversion" value="3.2%" trend="-0.1% MoM" trendColor="text-rose-400" icon={ArrowUpRight} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Organization Health Matrix */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-lg font-bold text-cream mb-4">Organization Health Matrix</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-navy-900/50 p-4 rounded-xl border border-white/5">
                <div className="text-sm text-ink/60 mb-2">Leadership Sentiment</div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 w-[85%] rounded-full"></div>
                  </div>
                  <span className="text-sm font-bold text-cream">85%</span>
                </div>
              </div>
              <div className="bg-navy-900/50 p-4 rounded-xl border border-white/5">
                <div className="text-sm text-ink/60 mb-2">Resource Utilization</div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-400 w-[92%] rounded-full"></div>
                  </div>
                  <span className="text-sm font-bold text-cream">92%</span>
                </div>
              </div>
              <div className="bg-navy-900/50 p-4 rounded-xl border border-white/5">
                <div className="text-sm text-ink/60 mb-2">Compliance Rating</div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gold-400 w-[98%] rounded-full"></div>
                  </div>
                  <span className="text-sm font-bold text-cream">98%</span>
                </div>
              </div>
              <div className="bg-navy-900/50 p-4 rounded-xl border border-white/5">
                <div className="text-sm text-ink/60 mb-2">Tech Debt Index</div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-400 w-[15%] rounded-full"></div>
                  </div>
                  <span className="text-sm font-bold text-cream">15%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Strategic Goals Tracker */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-lg font-bold text-cream mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-400" /> Strategic Goals Tracker
            </h3>
            <div className="space-y-4">
              {goals.map((goal, idx) => (
                <div key={idx} onClick={() => setActiveGoal(goal.title)} className={`p-4 rounded-xl border cursor-pointer transition-colors ${activeGoal === goal.title ? 'bg-white/10 border-white/20' : 'bg-navy-900/50 border-white/5 hover:bg-white/[0.03]'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-cream">{goal.title}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${goal.status === 'On Track' || goal.status === 'Near Completion' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-rose-400/10 text-rose-400'}`}>{goal.status}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 flex-1 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${goal.progress > 80 ? 'bg-emerald-400' : goal.progress > 50 ? 'bg-gold-400' : 'bg-rose-400'}`} style={{ width: `${goal.progress}%` }}></div>
                    </div>
                    <span className="text-xs font-bold text-ink/60">{goal.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Executive Notifications Summary */}
          <ActivityTimeline title="Executive Notifications" items={notifications} />
          
          {/* Executive Calendar Summary */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-400" /> Today's Calendar
            </h3>
            <div className="space-y-3">
              <div className="flex gap-3 items-center p-3 rounded-xl bg-navy-900/50 border border-white/5">
                <Clock className="h-4 w-4 text-ink/40" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-cream">Board Meeting Prep</div>
                  <div className="text-xs text-ink/60">10:00 AM - 11:30 AM</div>
                </div>
              </div>
              <div className="flex gap-3 items-center p-3 rounded-xl bg-navy-900/50 border border-white/5">
                <Clock className="h-4 w-4 text-ink/40" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-cream">Q4 Strategy Review</div>
                  <div className="text-xs text-ink/60">1:00 PM - 3:00 PM</div>
                </div>
              </div>
              <GhostButton className="w-full text-xs">View Full Calendar</GhostButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

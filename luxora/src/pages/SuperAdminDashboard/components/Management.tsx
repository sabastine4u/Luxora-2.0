import { useState } from 'react';
import { Briefcase, Building, Users, AlertCircle, Lightbulb, Target, Clock, TrendingUp, Award, MessageSquare } from 'lucide-react';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { GhostButton, GoldButton } from '../../../components/ui/ui';

export default function Management() {
  const [activeDept, setActiveDept] = useState('Sales');

  const decisions = [
    { title: 'Approve Q4 Marketing Budget', desc: 'Requested by CMO. ₦450M allocation.', time: 'Requires review today', icon: AlertCircle, color: 'text-orange-400' },
    { title: 'New VP of Engineering Hire', desc: 'Final candidate approval needed.', time: 'Due in 2 days', icon: Users, color: 'text-blue-400' },
    { title: 'Abuja Office Expansion', desc: 'Sign off on lease agreement.', time: 'Due in 5 days', icon: Building, color: 'text-emerald-400' }
  ];

  const recommendations = [
    { text: 'Sales department is nearing capacity. Consider opening 5 new requisitions.', icon: Lightbulb, color: 'text-gold-400' },
    { text: 'Customer Success resolution times improved by 15%. Reward top performers.', icon: Award, color: 'text-purple-400' }
  ];

  return (
    <div className="space-y-6 pb-12">
      <DashboardHeader 
        name="Executive Workforce Center" 
        subtitle="Global workforce intelligence, department performance, and strategic decisions."
        actions={
          <div className="flex gap-3">
            <GhostButton className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" /> Broadcast Message
            </GhostButton>
            <GoldButton className="flex items-center gap-2">
              <Target className="h-4 w-4" /> Strategic Planning
            </GoldButton>
          </div>
        }
      />

      {/* Executive Decision Queue & Action Center */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-heading text-lg font-bold text-cream flex items-center gap-2">
              <Clock className="h-5 w-5 text-rose-400" /> Executive Decision Queue
            </h3>
            <GhostButton className="text-xs h-8">View All Pending</GhostButton>
          </div>
          <div className="space-y-3">
            {decisions.map((decision, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-navy-900/50 border border-white/5 rounded-xl hover:bg-white/[0.02] transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg bg-white/5 ${decision.color}`}>
                    <decision.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-cream">{decision.title}</div>
                    <div className="text-xs text-ink/60">{decision.desc}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-orange-400 font-medium">{decision.time}</span>
                  <GoldButton className="h-8 text-xs px-3">Review</GoldButton>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-gold-400" /> Coaching Recommendations
          </h3>
          <div className="space-y-4">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="flex gap-3 bg-white/[0.02] border border-white/5 p-4 rounded-xl">
                <div className="pt-0.5"><rec.icon className={`h-4 w-4 ${rec.color}`} /></div>
                <div className="text-sm text-cream/90 leading-relaxed">{rec.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Internal Employees" value="245" trend="+12 This Quarter" trendColor="text-emerald-400" icon={Users} />
        <KPICard title="Global Offices" value="4" trend="Abuja Pending" trendColor="text-gold-400" icon={Building} />
        <KPICard title="Open Requisitions" value="12" trend="Sales & Eng" trendColor="text-blue-400" icon={Briefcase} />
        <KPICard title="Leadership Performance" value="A" trend="Score: 92/100" trendColor="text-emerald-400" icon={Award} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Department Performance Dashboard */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-heading text-lg font-bold text-cream flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-400" /> Department Performance
            </h3>
            <select 
              value={activeDept}
              onChange={(e) => setActiveDept(e.target.value)}
              className="bg-navy-900/50 border border-white/10 text-xs text-cream rounded-lg px-2 py-1"
            >
              <option>Sales</option>
              <option>Engineering</option>
              <option>Customer Success</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-navy-900/50 p-4 rounded-xl border border-white/5">
              <div className="text-sm text-ink/60 mb-1">Target Achievement</div>
              <div className="text-2xl font-bold text-emerald-400">112%</div>
            </div>
            <div className="bg-navy-900/50 p-4 rounded-xl border border-white/5">
              <div className="text-sm text-ink/60 mb-1">Employee Satisfaction</div>
              <div className="text-2xl font-bold text-blue-400">4.8/5</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-cream mb-2">Department Health Indicators</div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-ink/60">Retention Rate</span>
              <span className="text-emerald-400">96%</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-ink/60">Budget Utilization</span>
              <span className="text-gold-400">88%</span>
            </div>
          </div>
        </div>

        {/* Agent Productivity & Leaderboard */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <h3 className="font-heading text-lg font-bold text-cream mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-gold-400" /> National Sales Leaderboard
          </h3>
          <div className="space-y-3">
            {[
              { name: 'Adaeze Okonkwo', region: 'Lagos', volume: '₦680M' },
              { name: 'Tunde Bakare', region: 'Abuja', volume: '₦540M' },
              { name: 'Ngozi Eze', region: 'Port Harcourt', volume: '₦490M' }
            ].map((agent, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-navy-900/50 border border-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gold-400/20 flex items-center justify-center text-gold-400 font-bold text-xs">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-cream">{agent.name}</div>
                    <div className="text-xs text-ink/60">{agent.region}</div>
                  </div>
                </div>
                <div className="text-sm font-bold text-emerald-400">{agent.volume}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { Users, Building2, Calendar as CalendarIcon, FileCheck, Landmark, DollarSign, CalendarPlus, Briefcase, Sparkles, Megaphone, Activity, Award, Target, AlertCircle, Lightbulb, Mail, CheckCircle2, TrendingUp, Zap, ArrowRight, Heart } from 'lucide-react';
import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';

export default function Overview() {
  const kpiData = [
    { label: 'Assigned Leads', value: '45', trend: '+12% vs last month', icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Active Listings', value: '28', trend: '+3 this week', icon: Building2, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Appointments', value: '4 Today', trend: 'Next: 10:00 AM', icon: CalendarIcon, color: 'text-gold-400', bg: 'bg-gold-400/10' },
    { label: 'Pending Deals', value: '7', trend: '2 require action', icon: FileCheck, color: 'text-orange-400', bg: 'bg-orange-400/10' },
    { label: 'Closed Deals', value: '14', trend: 'This quarter', icon: Landmark, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
    { label: 'Monthly Revenue', value: '₦12.5M', trend: '+18% vs target', icon: DollarSign, color: 'text-rose-400', bg: 'bg-rose-400/10' },
  ];

  const priorityInbox = [
    { sender: 'Tony Elumelu', subject: 'Offer Accepted - Lekki Villa', time: '10 mins ago', unread: true, urgent: true },
    { sender: 'Compliance Dept', subject: 'Missing KYC for DL-5001', time: '1 hour ago', unread: true, urgent: false },
    { sender: 'Sarah Smith', subject: 'Viewing Reschedule Request', time: '2 hours ago', unread: false, urgent: false },
  ];

  const dailyChecklist = [
    { task: 'Review new leads (3)', completed: false, priority: 'High' },
    { task: 'Send weekly reports to VIPs', completed: false, priority: 'Medium' },
    { task: 'Follow up with Mike Adenuga', completed: true, priority: 'High' },
  ];

  const opportunities = [
    { title: 'Off-Market Match', desc: 'Folorunso Alakija is looking for commercial space in VI matching your pocket listing.', icon: Sparkles, color: 'text-gold-400' },
    { title: 'Price Reduction Strategy', desc: 'Skyline Penthouse has seen 40% drop in views. Suggest 5% reduction.', icon: TrendingUp, color: 'text-blue-400' },
  ];

  const renewals = [
    { client: 'Jim Ovia', property: 'Eko Atlantic Condo Lease', due: 'In 45 Days', status: 'Reach Out' },
    { client: 'Femi Otedola', property: 'Ikoyi Management Contract', due: 'In 60 Days', status: 'Preparing' },
  ];

  const aiRecommendedActions = [
    { action: 'Draft contract for Tony Elumelu', type: 'Automated', icon: FileCheck, color: 'text-emerald-400' },
    { action: 'Schedule 3-month check-in with Aliko Dangote', type: 'Relationship', icon: Heart, color: 'text-rose-400' },
    { action: 'Boost "Banana Island Plot" ad spend by ₦50k', type: 'Marketing', icon: Megaphone, color: 'text-blue-400' },
  ];

  const focusAreas = [
    { title: 'Close Pipeline Deals', progress: 75, target: '₦4.5B' },
    { title: 'Generate Buyer Leads', progress: 40, target: '20 Leads' },
  ];

  return (
    <div className="space-y-8 pb-12">
      <DashboardHeader 
        name="Michael Eze"
        avatarUrl="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=200&h=200&fit=crop"
        showVerifiedBadge={true}
        badges={['Top Producer', 'AI Assistant Active']}
        subtitle={<span>Senior Partner @ <span className="text-cream">Meridian Luxury Realty</span></span>}
        tags={[
          { label: 'Residential', icon: Building2 },
          { label: 'Commercial', icon: Briefcase },
          { label: 'Luxury', icon: Sparkles }
        ]}
        actions={
          <div className="flex gap-3 w-full">
            <GoldButton className="w-full text-sm"><Sparkles className="h-4 w-4 mr-2" /> Ask AI</GoldButton>
            <GhostButton className="w-full text-sm"><CalendarPlus className="h-4 w-4 mr-2" /> Plan Day</GhostButton>
          </div>
        }
      />

      {/* AI ASSISTANT ROW */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="md:col-span-2 bg-gradient-to-br from-navy-800 to-navy-900 border border-gold-500/30 shadow-[0_0_15px_rgba(212,175,55,0.1)] rounded-2xl p-6 flex flex-col justify-center h-full relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles className="h-24 w-24 text-gold-400" />
          </div>
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="p-2 bg-gold-400/20 rounded-xl animate-pulse">
              <Sparkles className="h-6 w-6 text-gold-400" />
            </div>
            <h4 className="font-bold text-cream text-lg">AI Business Assistant</h4>
          </div>
          <p className="text-sm text-ink/80 leading-relaxed relative z-10">
            Good morning Michael. I've analyzed your pipeline and schedule. 
            You have <strong className="text-rose-400">1 urgent compliance task</strong> and an accepted offer from Tony Elumelu in your inbox. 
            I recommend focusing on the <strong className="text-gold-400">Skyline Penthouse negotiation</strong> today to hit your Q4 targets. 
            Would you like me to draft the contract for the accepted offer?
          </p>
          <div className="mt-4 pt-4 border-t border-white/10 flex gap-3 relative z-10">
            <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-xs font-medium text-cream rounded-lg transition-colors border border-white/10">Yes, draft contract</button>
            <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-xs font-medium text-cream rounded-lg transition-colors border border-white/10">Show my schedule</button>
          </div>
        </div>
        
        <div className="md:col-span-1 rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col items-center justify-center text-center h-full">
          <div className="relative h-20 w-20 mb-3">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
              <path className="text-navy-950" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)] transition-all duration-1000 ease-out" strokeDasharray="96, 100" strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-cream">96</span>
            </div>
          </div>
          <h3 className="text-sm font-semibold text-ink/60 mb-1 flex items-center justify-center gap-1"><Activity className="h-3 w-3" /> Business Health Score</h3>
          <p className="text-xs text-emerald-400">Optimal Operating Levels</p>
        </div>

        <div className="md:col-span-1 rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col h-full">
          <h3 className="text-sm font-semibold text-ink/60 mb-4 text-center flex items-center justify-center gap-1"><Target className="h-3 w-3" /> Revenue Target Tracker</h3>
          <div className="flex-1 flex flex-col justify-center gap-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-cream font-medium">Monthly Goal</span>
                <span className="text-emerald-400">85%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 w-[85%] rounded-full"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-cream font-medium">Annual Quota</span>
                <span className="text-gold-400">112%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gold-400 w-full rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {kpiData.map((kpi, i) => (
          <KPICard 
            key={i}
            title={kpi.label}
            value={kpi.value}
            icon={kpi.icon}
            trend={kpi.trend}
            iconColor={kpi.color}
            backgroundColor={kpi.bg}
            hoverEffect="highlight"
            iconBorder={false}
          />
        ))}
      </div>

      {/* WORKFLOW ROW 1 */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* INBOX & CHECKLIST */}
        <div className="space-y-6 lg:col-span-1">
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 h-[250px] flex flex-col">
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
              <h3 className="font-heading text-base font-bold text-cream flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-400" /> Priority Inbox
              </h3>
              <span className="text-xs bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-full font-bold">2 New</span>
            </div>
            <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar">
              {priorityInbox.map((msg, i) => (
                <div key={i} className={`p-3 rounded-xl border transition-colors cursor-pointer hover:bg-white/[0.02] ${msg.unread ? 'bg-navy-900 border-white/10' : 'bg-navy-900/50 border-white/5'}`}>
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-xs font-bold ${msg.unread ? 'text-cream' : 'text-ink/60'}`}>{msg.sender}</span>
                    <span className="text-[10px] text-ink/40">{msg.time}</span>
                  </div>
                  <div className={`text-xs truncate ${msg.urgent ? 'text-rose-400' : msg.unread ? 'text-blue-300' : 'text-ink/50'}`}>
                    {msg.urgent && <AlertCircle className="inline h-3 w-3 mr-1" />}
                    {msg.subject}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 h-[250px] flex flex-col">
            <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2 pb-3 border-b border-white/10">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Daily Business Checklist
            </h3>
            <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar">
              {dailyChecklist.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-navy-900/50 p-3 rounded-xl border border-white/5">
                  <input type="checkbox" checked={item.completed} readOnly className="mt-0.5 accent-gold-400 bg-white/5 border-white/10" />
                  <div className="flex-1">
                    <div className={`text-sm ${item.completed ? 'text-ink/40 line-through' : 'text-cream'}`}>{item.task}</div>
                    {!item.completed && <div className={`text-[10px] mt-1 uppercase tracking-wider ${item.priority === 'High' ? 'text-orange-400' : 'text-blue-400'}`}>{item.priority} Priority</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PLANNING BOARD & FOCUS */}
        <div className="space-y-6 lg:col-span-1">
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 h-[250px] flex flex-col">
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
              <h3 className="font-heading text-base font-bold text-cream flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-gold-400" /> Weekly Planning Board
              </h3>
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/5">
                <span className="text-xs text-cream font-medium">Monday</span>
                <span className="text-xs text-ink/60">3 Viewings, 1 Contract</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-blue-500/10 border border-blue-500/20">
                <span className="text-xs text-blue-400 font-bold">Tuesday (Today)</span>
                <span className="text-xs text-blue-300">Strategy & Negotiation</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/5">
                <span className="text-xs text-cream font-medium">Wednesday</span>
                <span className="text-xs text-ink/60">Client Outreach</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/5">
                <span className="text-xs text-cream font-medium">Thursday</span>
                <span className="text-xs text-ink/60">Property Tours</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/5">
                <span className="text-xs text-cream font-medium">Friday</span>
                <span className="text-xs text-ink/60">Admin & Closings</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 h-[250px] flex flex-col">
            <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2 pb-3 border-b border-white/10">
              <Target className="h-4 w-4 text-rose-400" /> Weekly Focus Areas
            </h3>
            <div className="space-y-4 flex-1">
              {focusAreas.map((focus, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-cream">{focus.title}</span>
                    <span className="text-gold-400">{focus.progress}% / {focus.target}</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gold-400 rounded-full" style={{ width: `${focus.progress}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* OPPORTUNITIES & RENEWALS */}
        <div className="space-y-6 lg:col-span-1">
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 h-[250px] flex flex-col">
            <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2 pb-3 border-b border-white/10">
              <Zap className="h-4 w-4 text-yellow-400" /> Business Opportunities
            </h3>
            <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar">
              {opportunities.map((opp, idx) => (
                <div key={idx} className="flex gap-3 bg-navy-900/50 p-3 rounded-xl border border-white/5 hover:bg-white/[0.02] cursor-pointer transition-colors">
                  <div className="pt-0.5"><opp.icon className={`h-4 w-4 ${opp.color}`} /></div>
                  <div>
                    <div className="text-xs font-bold text-cream mb-1">{opp.title}</div>
                    <div className="text-[10px] text-ink/60 leading-relaxed">{opp.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 h-[250px] flex flex-col">
            <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2 pb-3 border-b border-white/10">
              <CalendarIcon className="h-4 w-4 text-indigo-400" /> Upcoming Renewals
            </h3>
            <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar">
              {renewals.map((ren, idx) => (
                <div key={idx} className="flex justify-between items-center bg-navy-900/50 p-3 rounded-xl border border-white/5">
                  <div>
                    <div className="text-xs font-bold text-cream">{ren.client}</div>
                    <div className="text-[10px] text-ink/60">{ren.property}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-medium text-orange-400">{ren.due}</div>
                    <div className="text-[10px] text-ink/40 mt-0.5 flex items-center gap-1 justify-end hover:text-gold-400 cursor-pointer transition-colors">{ren.status} <ArrowRight className="h-2 w-2" /></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* WORKFLOW ROW 2 */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-400" /> Personalized Productivity Insights
          </h3>
          <ul className="space-y-2 text-sm text-ink/80">
            <li className="flex items-start gap-2"><div className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0"/> You close 30% more deals when meetings are scheduled before noon.</li>
            <li className="flex items-start gap-2"><div className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0"/> Your email response time is averaging 12 mins (Top 1% of agency).</li>
            <li className="flex items-start gap-2"><div className="mt-1 h-1.5 w-1.5 rounded-full bg-orange-400 shrink-0"/> You have 3 leads that haven't been contacted in 14 days.</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-gold-400" /> Daily Recommended Actions
          </h3>
          <div className="space-y-3">
            {aiRecommendedActions.map((rec, idx) => (
              <div key={idx} className="flex justify-between items-center group cursor-pointer">
                <div className="flex gap-2 items-center">
                  <rec.icon className={`h-4 w-4 ${rec.color}`} />
                  <span className="text-sm text-cream group-hover:text-gold-400 transition-colors">{rec.action}</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 bg-white/5 rounded text-ink/50 group-hover:bg-gold-400/10 group-hover:text-gold-400 transition-colors">{rec.type}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-navy-800 to-navy-900 p-6 text-center flex flex-col justify-center items-center">
          <Award className="h-10 w-10 text-gold-400 mb-3" />
          <h3 className="font-heading text-lg font-bold text-cream mb-2">Personal Achievement</h3>
          <p className="text-sm text-ink/80 mb-4">You are currently the #1 Agent in Victoria Island for Q4. Keep pushing to secure the Annual Excellence Award!</p>
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Top Producer Status Active</div>
        </div>
      </div>

    </div>
  );
}

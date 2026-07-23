import { useState } from 'react';
import { 
  TrendingUp, CheckCircle2, Wallet, Users, 
  Target, Award, Download, FileText,
  Star, Clock, Building2, Phone, MessageSquare, Calendar as CalendarIcon,
  Eye, Heart, FileCheck, DollarSign
} from 'lucide-react';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { useToast } from '../../../contexts/ToastContext';
import { topPerformingProperties } from '../../../data/agentData';
import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';

export default function Performance() {
  const { showToast } = useToast();
  const [activeWorkflow, setActiveWorkflow] = useState<{ title: string, type: string, data?: Record<string, unknown> } | null>(null);

  const handleAction = (title: string, type: string, data?: Record<string, unknown>) => {
    setActiveWorkflow({ title, type, data });
  };

  const executeWorkflow = () => {
    showToast({ type: 'success', title: 'Action Initiated', description: `Executing: ${activeWorkflow?.title}. Integration pending.` });
    setActiveWorkflow(null);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* HEADER & EXPORT */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Performance Dashboard</h2>
          <p className="text-sm text-ink/60">Monitor your sales performance, commissions, goals and productivity.</p>
        </div>
        <div className="flex gap-3">
          <GhostButton size="sm" onClick={() => handleAction('Export Performance Report', 'export_performance_report')}><FileText className="h-4 w-4 mr-2"/> Export Performance Report</GhostButton>
          <GoldButton size="sm" onClick={() => handleAction('Download PDF', 'download_pdf')}><Download className="h-4 w-4 mr-2"/> Download PDF</GoldButton>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {[
          { label: 'Closed Deals', value: '14', delta: '+2', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { label: 'Active Deals', value: '8', delta: '+1', icon: Clock, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: 'Monthly Commission', value: '₦12.4M', delta: '+15%', icon: Wallet, color: 'text-gold-400', bg: 'bg-gold-400/10' },
          { label: 'Total Revenue', value: '₦485M', delta: '+22%', icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-400/10' },
          { label: 'Conversion Rate', value: '18.2%', delta: '+1.4%', icon: Users, color: 'text-rose-400', bg: 'bg-rose-400/10' },
          { label: 'CSAT Score', value: '4.8/5', delta: '+0.2', icon: Star, color: 'text-amber-400', bg: 'bg-amber-400/10' },
        ].map((stat, i) => (
          <KPICard 
            key={i}
            title={stat.label}
            value={stat.value}
            icon={stat.icon}
            trend={stat.delta}
            trendColor={stat.color}
            iconColor={stat.color}
            backgroundColor="bg-white/5"
            hoverEffect="highlight"
            iconBorder={true}
            valueTypography="heading-xl"
            labelTypography="small"
            trendPosition="inline"
            padding="p-4"
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* SALES TARGET (1 Col) */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading text-lg font-bold text-cream flex items-center gap-2"><Target className="h-5 w-5 text-gold-400" /> Sales Target</h3>
              <span className="text-xs font-bold text-gold-400 bg-gold-400/10 px-2 py-1 rounded-md">October 2026</span>
            </div>
            <div className="flex justify-between items-end mb-2">
              <div>
                <div className="text-sm text-ink/50 mb-1">Current Progress</div>
                <div className="font-heading text-3xl font-bold text-cream">₦485M</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-ink/50 mb-1">Monthly Target</div>
                <div className="font-heading text-xl font-bold text-ink/80">₦600M</div>
              </div>
            </div>
            <div className="w-full h-3 bg-navy-900 rounded-full overflow-hidden mt-4 border border-white/5">
              <div className="h-full bg-gold-gradient rounded-full" style={{ width: '80%' }}></div>
            </div>
            <div className="flex justify-between mt-2 text-xs font-bold">
              <span className="text-gold-400">80% Completed</span>
              <span className="text-ink/60">₦115M Remaining</span>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
             <div>
               <div className="text-xs text-ink/50 mb-1">Pending Deals</div>
               <div className="text-lg font-bold text-cream">₦140M</div>
             </div>
             <div>
               <div className="text-xs text-ink/50 mb-1">Projected</div>
               <div className="text-lg font-bold text-emerald-400">₦625M</div>
             </div>
          </div>
        </div>

        {/* MONTHLY TREND CHART (2 Col) */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading text-lg font-bold text-cream">Monthly Performance</h3>
            <select className="bg-navy-900 border border-white/10 rounded-lg text-xs text-cream px-3 py-1.5 focus:outline-none focus:border-gold-400/50">
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="flex h-56 items-end gap-2 relative">
             <div className="absolute left-0 top-0 bottom-0 w-full flex flex-col justify-between text-[10px] text-ink/30 pointer-events-none">
                <div className="border-b border-white/5 w-full h-0 flex items-center"><span className="bg-navy-800 pr-2 absolute -mt-2">₦1B</span></div>
                <div className="border-b border-white/5 w-full h-0 flex items-center"><span className="bg-navy-800 pr-2 absolute -mt-2">₦750M</span></div>
                <div className="border-b border-white/5 w-full h-0 flex items-center"><span className="bg-navy-800 pr-2 absolute -mt-2">₦500M</span></div>
                <div className="border-b border-white/5 w-full h-0 flex items-center"><span className="bg-navy-800 pr-2 absolute -mt-2">₦250M</span></div>
                <div className="w-full h-0"></div>
             </div>
             <div className="w-8 shrink-0"></div> {/* Spacer for y-axis labels */}
            {[
              { m: 'May', rev: 40, com: 20 },
              { m: 'Jun', rev: 55, com: 30 },
              { m: 'Jul', rev: 45, com: 25 },
              { m: 'Aug', rev: 70, com: 40 },
              { m: 'Sep', rev: 60, com: 35 },
              { m: 'Oct', rev: 85, com: 50 },
            ].map((d, i) => (
              <div key={i} className="group flex flex-1 flex-col items-center gap-2 h-full justify-end z-10">
                <div className="relative w-full flex items-end justify-center gap-1 h-full">
                  <div
                    className="w-1/3 max-w-[20px] rounded-t bg-purple-400/60 transition-all duration-300 group-hover:bg-purple-400"
                    style={{ height: `${d.rev}%` }}
                  />
                  <div
                    className="w-1/3 max-w-[20px] rounded-t bg-gold-400/80 transition-all duration-300 group-hover:bg-gold-400"
                    style={{ height: `${d.com}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-ink/40 uppercase">{d.m}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-white/5">
             <div className="flex items-center gap-2 text-xs text-ink/60"><div className="w-3 h-3 rounded-sm bg-purple-400/60"></div> Revenue Generated</div>
             <div className="flex items-center gap-2 text-xs text-ink/60"><div className="w-3 h-3 rounded-sm bg-gold-400/80"></div> Commission Earned</div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
         {/* COMMISSION OVERVIEW */}
         <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
           <h3 className="font-heading text-lg font-bold text-cream mb-6 flex items-center gap-2"><Wallet className="h-5 w-5 text-gold-400"/> Commission Overview</h3>
           <div className="grid grid-cols-2 gap-4 mb-6">
             <div className="bg-navy-900/50 border border-white/5 p-4 rounded-xl">
               <div className="text-xs text-ink/50 mb-1">Current Month</div>
               <div className="text-2xl font-bold text-gold-400">₦12.4M</div>
             </div>
             <div className="bg-navy-900/50 border border-white/5 p-4 rounded-xl">
               <div className="text-xs text-ink/50 mb-1">Previous Month</div>
               <div className="text-2xl font-bold text-cream">₦9.8M</div>
             </div>
           </div>
           <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <span className="text-ink/60">Year-to-Date (YTD)</span>
                <span className="font-bold text-cream">₦84.5M</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <span className="text-ink/60">Pending Commission</span>
                <span className="font-bold text-emerald-400">₦3.2M</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-ink/60">Expected (Pipeline)</span>
                <span className="font-bold text-blue-400">₦18.5M</span>
              </div>
           </div>
         </div>

         {/* LEAD CONVERSION FUNNEL */}
         <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
           <h3 className="font-heading text-lg font-bold text-cream mb-6 flex items-center gap-2"><TrendingUp className="h-5 w-5 text-gold-400"/> Conversion Funnel</h3>
           <div className="space-y-3">
             {[
               { label: 'New Leads', value: 145, pct: 100, color: 'bg-blue-400/20 text-blue-400' },
               { label: 'Qualified Leads', value: 82, pct: 56, color: 'bg-indigo-400/20 text-indigo-400' },
               { label: 'Viewings', value: 45, pct: 31, color: 'bg-purple-400/20 text-purple-400' },
               { label: 'Offers', value: 24, pct: 16, color: 'bg-emerald-400/20 text-emerald-400' },
               { label: 'Closed Deals', value: 14, pct: 9, color: 'bg-gold-400/20 text-gold-400' },
             ].map((stage, i) => (
               <div key={i} className="flex items-center gap-4">
                 <div className={`w-16 text-right text-xs font-bold ${stage.color.split(' ')[1]}`}>{stage.pct}%</div>
                 <div className="flex-1">
                   <div className="relative h-8 rounded-lg overflow-hidden bg-navy-900 border border-white/5 flex items-center">
                     <div className={`absolute left-0 top-0 bottom-0 ${stage.color.split(' ')[0]}`} style={{ width: `${stage.pct}%` }}></div>
                     <span className="relative z-10 text-xs font-bold text-cream px-3">{stage.label}</span>
                   </div>
                 </div>
                 <div className="w-12 text-right text-sm font-bold text-cream">{stage.value}</div>
               </div>
             ))}
           </div>
         </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* CLIENT SATISFACTION */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
           <h3 className="font-heading text-lg font-bold text-cream mb-6 flex items-center gap-2"><Star className="h-5 w-5 text-gold-400"/> Satisfaction</h3>
           <div className="flex items-center justify-center mb-6">
             <div className="text-center">
               <div className="text-5xl font-heading font-bold text-gold-400 mb-2">4.8</div>
               <div className="flex justify-center gap-1 text-gold-400 mb-1">
                 <Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current opacity-40" />
               </div>
               <div className="text-xs text-ink/50">Average Rating</div>
             </div>
           </div>
           <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/5">
             <div className="text-center border-r border-white/5">
               <div className="text-2xl font-bold text-cream mb-1">42</div>
               <div className="text-xs text-ink/50">Completed Reviews</div>
             </div>
             <div className="text-center">
               <div className="text-2xl font-bold text-emerald-400 mb-1">96%</div>
               <div className="text-xs text-ink/50">Positive Feedback</div>
             </div>
             <div className="text-center border-r border-white/5 pt-4 border-t border-white/5 col-span-2 mt-2">
               <div className="text-xl font-bold text-cream mb-1">12</div>
               <div className="text-xs text-ink/50">Repeat Clients (YTD)</div>
             </div>
           </div>
        </div>

        {/* PRODUCTIVITY */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
           <h3 className="font-heading text-lg font-bold text-cream mb-6 flex items-center gap-2"><Clock className="h-5 w-5 text-gold-400"/> Productivity</h3>
           <div className="space-y-4">
             {[
               { label: 'Appointments Completed', value: '38', icon: CalendarIcon },
               { label: 'Calls Made', value: '142', icon: Phone },
               { label: 'Messages Sent', value: '856', icon: MessageSquare },
               { label: 'Listings Added', value: '5', icon: Building2 },
             ].map((item, i) => (
               <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-navy-900/50 border border-white/5">
                 <div className="flex items-center gap-3 text-sm text-ink/80">
                   <item.icon className="h-4 w-4 text-ink/40" /> {item.label}
                 </div>
                 <div className="font-bold text-cream">{item.value}</div>
               </div>
             ))}
             <div className="p-4 rounded-xl bg-gold-400/10 border border-gold-400/20 text-center mt-4">
               <div className="text-xs text-gold-400/80 mb-1 font-semibold uppercase tracking-wider">Avg Response Time</div>
               <div className="text-xl font-bold text-gold-400">14 Minutes</div>
             </div>
           </div>
        </div>

        {/* LEADERBOARD */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
           <h3 className="font-heading text-lg font-bold text-cream mb-6 flex items-center gap-2"><Award className="h-5 w-5 text-gold-400"/> Leaderboard</h3>
           <div className="bg-gradient-to-br from-gold-400/20 to-transparent border border-gold-400/30 rounded-xl p-5 mb-6 text-center relative overflow-hidden">
             <Award className="absolute -right-4 -bottom-4 h-24 w-24 text-gold-400/10" />
             <div className="text-xs font-bold text-gold-400 uppercase tracking-widest mb-2 relative z-10">Your Rank</div>
             <div className="text-4xl font-heading font-bold text-cream mb-1 relative z-10">#2</div>
             <div className="text-xs text-cream/80 relative z-10">Top 5% of Agency</div>
           </div>
           <div className="space-y-3">
            <div className="text-xs font-bold text-ink/40 uppercase tracking-wider mb-2">Monthly Ranking</div>
             {[
               { name: 'Adaeze Okonkwo', deals: 42, rev: '₦1.2B' },
               { name: 'You', deals: 14, rev: '₦485M', active: true },
               { name: 'Chioma Obi', deals: 12, rev: '₦420M' },
               { name: 'David Smith', deals: 8, rev: '₦280M' },
             ].map((agent, i) => (
               <div key={i} className={`flex items-center justify-between rounded-xl p-3 text-sm ${agent.active ? 'bg-navy-900 border border-gold-400/30 shadow-lg' : 'border border-white/5'}`}>
                 <div className="flex items-center gap-3">
                   <div className={`w-6 text-center font-bold ${agent.active ? 'text-gold-400' : 'text-ink/40'}`}>{i + 1}</div>
                   <div className={`font-semibold ${agent.active ? 'text-gold-400' : 'text-cream'}`}>{agent.name}</div>
                 </div>
                 <div className="text-right">
                   <div className="font-bold text-cream">{agent.deals} <span className="text-[10px] text-ink/40 font-normal">Deals</span></div>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>

      {/* PROPERTY PERFORMANCE */}
      <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 overflow-hidden">
        <h3 className="font-heading text-lg font-bold text-cream mb-6 flex items-center gap-2"><Building2 className="h-5 w-5 text-gold-400"/> Top Performing Listings</h3>
        <DataTable
          data={topPerformingProperties}
          keyExtractor={(prop) => prop.name}
          columns={[
            {
              header: "Property",
              render: (prop) => <span className="font-semibold text-cream whitespace-nowrap">{prop.name}</span>
            },
            {
              header: <><Eye className="h-4 w-4 inline mr-1"/> Views</>,
              render: (prop) => <span className="text-ink/80">{prop.views}</span>
            },
            {
              header: <><Heart className="h-4 w-4 inline mr-1"/> Favorites</>,
              render: (prop) => <span className="text-ink/80">{prop.favs}</span>
            },
            {
              header: <><FileCheck className="h-4 w-4 inline mr-1"/> Offers</>,
              render: (prop) => <span className="text-ink/80">{prop.offers}</span>
            },
            {
              header: <><CheckCircle2 className="h-4 w-4 inline mr-1"/> Status</>,
              render: (prop) => (
                <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${
                  prop.status === 'Sold' ? 'text-emerald-400 border-emerald-400/20 bg-emerald-400/10' :
                  prop.status === 'Pending' ? 'text-gold-400 border-gold-400/20 bg-gold-400/10' :
                  'text-blue-400 border-blue-400/20 bg-blue-400/10'
                }`}>
                  {prop.status}
                </span>
              )
            },
            {
              header: <><DollarSign className="h-4 w-4 inline mr-1"/> Revenue</>,
              render: (prop) => <span className="font-bold text-gold-400">{prop.rev}</span>
            }
          ]}
        />
      </div>

      <EnterpriseDetailDrawer
        isOpen={!!activeWorkflow}
        onClose={() => setActiveWorkflow(null)}
        title={activeWorkflow?.title || 'Workflow'}
        footerActions={
          <GoldButton onClick={executeWorkflow} className="w-full justify-center">Confirm Action</GoldButton>
        }
      >
        <div className="space-y-6">
          <div className="p-4 rounded-xl border border-white/10 bg-navy-900">
            <h4 className="text-sm font-semibold text-cream mb-2">Workflow Details</h4>
            <p className="text-sm text-ink/60 leading-relaxed">
              You are about to execute the <strong>{activeWorkflow?.type}</strong> workflow. 
              Please review the action details below and confirm to integrate with the backend system.
            </p>
          </div>
          {activeWorkflow?.data && (
            <div className="p-4 rounded-xl border border-white/10 bg-navy-900/50">
              <h4 className="text-sm font-semibold text-cream mb-4">Context Data</h4>
              <div className="space-y-2 text-sm text-ink/80">
                {Object.entries(activeWorkflow.data).map(([key, value]) => {
                  if (typeof value === 'string' || typeof value === 'number') {
                    return (
                      <div key={key} className="flex justify-between border-b border-white/5 pb-2">
                        <span className="capitalize">{key}</span>
                        <span className="font-medium text-cream">{value}</span>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          )}
        </div>
      </EnterpriseDetailDrawer>
    </div>
  );
}

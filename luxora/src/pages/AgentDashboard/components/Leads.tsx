/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Users, UserPlus, Phone, Search, Download, Clock, TrendingUp, AlertCircle, Target, MessageSquare, Zap, Activity, CheckCircle2, Calendar } from 'lucide-react';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { StatusBadge } from '../../ManagementDashboard/components/shared/StatusBadge';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { SegmentedProgressBar } from '../../../components/dashboard/shared/widgets/SegmentedProgressBar';
import { ActivityTimeline } from '../../../components/dashboard/shared/timelines/ActivityTimeline';
import { LeadDetailModal } from './modals/LeadDetailModal';

export default function Leads() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<any | null>(null);

  const leads = [
    { id: 'LD-4001', name: 'Dr. Tunde Bakare', property: 'Skyline Penthouse', source: 'Website', status: 'Hot', date: 'Today, 09:30 AM', score: 95 },
    { id: 'LD-4002', name: 'Mrs. Folake Ojo', property: 'Victoria Island Duplex', source: 'Referral', status: 'Contacted', date: 'Yesterday', score: 75 },
    { id: 'LD-4003', name: 'Chinedu Eze', property: 'Lekki Phase 1 Villa', source: 'Social Media', status: 'New', date: 'Today, 08:15 AM', score: 85 },
    { id: 'LD-4004', name: 'Aisha Mohammed', property: 'Maitama Mansion', source: 'Direct', status: 'Qualified', date: 'Oct 2, 2026', score: 60 },
    { id: 'LD-4005', name: 'David Okafor', property: 'Eko Atlantic Condo', source: 'Website', status: 'Dormant', date: 'Sep 15, 2026', score: 30 },
  ];

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.property.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewLead = (lead: any) => {
    setSelectedLead(lead);
  };

  const followUpQueue = [
    { name: 'Dr. Tunde Bakare', action: 'Send detailed floor plans', time: 'Today, 2:00 PM', priority: 'High', icon: MessageSquare },
    { name: 'Chinedu Eze', action: 'Initial Discovery Call', time: 'Today, 4:00 PM', priority: 'High', icon: Phone },
  ];

  const nextBestActions = [
    { title: 'Re-engage David Okafor', desc: 'Dormant for 14 days. Send market update report.', icon: Zap, color: 'text-blue-400' },
    { title: 'Follow up Aisha Mohammed', desc: 'Pre-approval verified. Schedule property tour.', icon: Calendar, color: 'text-emerald-400' },
  ];

  const conversionOpportunities = [
    { label: 'High Intent (90+)', value: 5, color: 'bg-emerald-400' },
    { label: 'Medium Intent (60-89)', value: 12, color: 'bg-gold-400' },
    { label: 'Low Intent (<60)', value: 28, color: 'bg-rose-400' },
  ];

  const leadActivityCalendar = [
    { title: 'Initial Call', desc: 'Chinedu Eze - Discussed budget expectations.', time: '10:00 AM', icon: Phone, color: 'text-blue-400' },
    { title: 'Sent Portfolio', desc: 'Mrs. Folake Ojo - Sent 3 properties matching criteria.', time: 'Yesterday', icon: MessageSquare, color: 'text-emerald-400' },
  ];

  return (
    <div className="space-y-6 pb-12">
      <DashboardHeader
        name="Lead Workflow Intelligence"
        subtitle="Automate follow-ups, prioritize high-value prospects, and boost conversion rates."
        actions={
          <div className="flex gap-3">
            <GhostButton className="flex items-center gap-2">
              <Download className="h-4 w-4" /> Export CSV
            </GhostButton>
            <GoldButton className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" /> Add Lead
            </GoldButton>
          </div>
        }
      />

      {/* INTELLIGENCE HEADER: ACTION SUMMARY */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="md:col-span-2 bg-gradient-to-br from-navy-800 to-navy-900 border border-white/10 rounded-2xl p-6 flex flex-col justify-center h-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-rose-400/20 rounded-xl">
              <Zap className="h-6 w-6 text-rose-400" />
            </div>
            <h4 className="font-bold text-cream text-lg">Pipeline Action Summary</h4>
          </div>
          <p className="text-sm text-ink/80 leading-relaxed mb-4">
            You have <strong className="text-rose-400">2 hot leads</strong> requiring immediate attention today. 
            Your average response time is <strong className="text-emerald-400">12 minutes</strong>. 
            Automated reminders are active for 5 dormant leads. Focus on high-intent conversions to hit this week's quota.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
            <div>
              <div className="text-xs text-ink/60 mb-1">Response Time</div>
              <div className="text-lg font-bold text-emerald-400">12 mins</div>
            </div>
            <div>
              <div className="text-xs text-ink/60 mb-1">Conversion Forecast</div>
              <div className="text-lg font-bold text-blue-400">8%</div>
            </div>
            <div>
              <div className="text-xs text-ink/60 mb-1">Actions Due Today</div>
              <div className="text-lg font-bold text-rose-400">5</div>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-1 rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col h-full justify-between">
          <div>
            <h3 className="text-sm font-semibold text-ink/60 mb-4 flex items-center gap-2">
              <Target className="h-4 w-4 text-emerald-400" /> Lead Priority Matrix
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-cream font-medium">High Score (Urgent)</span>
                  <span className="text-rose-400">5</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-400 w-[15%] rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-cream font-medium">Medium Score (Nurture)</span>
                  <span className="text-gold-400">12</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gold-400 w-[35%] rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-cream font-medium">Low Score (Automated)</span>
                  <span className="text-blue-400">28</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400 w-[50%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-1 rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col h-full">
          <h3 className="text-sm font-semibold text-ink/60 mb-4 text-center">Follow-up Success Tracker</h3>
          <div className="flex-1 flex flex-col justify-center gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink/60">Contacted &lt; 1hr</span>
              <span className="text-sm font-medium text-emerald-400">85%</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1.5"><div className="bg-emerald-400 h-1.5 rounded-full w-[85%]"></div></div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink/60">Meeting Booked</span>
              <span className="text-sm font-medium text-blue-400">22%</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1.5"><div className="bg-blue-400 h-1.5 rounded-full w-[22%]"></div></div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Active Leads"
          value="45"
          trend="+12 this week"
          trendColor="text-emerald-400"
          icon={Users}
        />
        <KPICard
          title="New Leads (24h)"
          value="8"
          trend="Action required on 3"
          trendColor="text-rose-400"
          icon={AlertCircle}
        />
        <KPICard
          title="Avg. Lead Score"
          value="68/100"
          trend="+5 pts vs last week"
          trendColor="text-emerald-400"
          icon={TrendingUp}
        />
        <KPICard
          title="Avg Response Time"
          value="12m"
          trend="Top 1% Performance"
          trendColor="text-blue-400"
          icon={Clock}
        />
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Main Table Area */}
        <div className="lg:col-span-3 space-y-6">
          <DataTableToolbar
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search leads by name or property..."
          />

          <DataTable keyExtractor={(item: any, index: number) => item.id || String(index)}
            columns={[
              {
                header: 'Lead Name',
                render: (lead: any) => (
                  <div className="font-semibold text-cream">{lead.name}</div>
                )
              },
              {
                header: 'Interested In',
                render: (lead: any) => (
                  <div className="text-sm text-ink/80 flex items-center gap-1.5">
                    <Search className="h-3 w-3 text-gold-400" /> {lead.property}
                  </div>
                )
              },
              {
                header: 'Source / Date',
                render: (lead: any) => (
                  <div>
                    <div className="text-sm text-cream">{lead.source}</div>
                    <div className="text-[10px] text-ink/50 mt-0.5">{lead.date}</div>
                  </div>
                )
              },
              {
                header: 'Lead Score',
                render: (lead: any) => (
                  <div className="w-24">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-ink/60">Score</span>
                      <span className="text-cream">{lead.score}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div 
                        className={`h-full ${lead.score >= 80 ? 'bg-emerald-400' : lead.score >= 50 ? 'bg-gold-400' : 'bg-rose-400'}`}
                        style={{ width: `${lead.score}%` }}
                      />
                    </div>
                  </div>
                )
              },
              {
                header: 'Status',
                render: (lead: any) => <StatusBadge status={lead.status} />
              },
              {
                header: 'Actions',
                render: (lead: any) => (
                  <GhostButton 
                    onClick={() => handleViewLead(lead)}
                    className="h-8 px-3 text-xs"
                  >
                    View Details
                  </GhostButton>
                )
              }
            ]}
            data={filteredLeads}
            onRowClick={(lead) => handleViewLead(lead)}
          />

          <SegmentedProgressBar
            title="Conversion Opportunity Board"
            segments={conversionOpportunities}
          />
        </div>

        {/* Intelligence Side Panel */}
        <div className="space-y-6 lg:col-span-1">
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
              <Activity className="h-4 w-4 text-rose-400" /> Smart Follow-up Queue
            </h3>
            <div className="space-y-3">
              {followUpQueue.map((item, idx) => (
                <div key={idx} className="bg-navy-900/50 p-3 rounded-xl border border-white/5">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm font-bold text-cream">{item.name}</div>
                    <div className={`text-[10px] px-2 py-0.5 rounded uppercase tracking-wider ${item.priority === 'High' ? 'bg-rose-400/10 text-rose-400' : 'bg-blue-400/10 text-blue-400'}`}>{item.priority}</div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-ink/80 mb-2">
                    <item.icon className="h-3.5 w-3.5 text-gold-400" /> {item.action}
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-ink/50">Due: {item.time}</span>
                    <button className="text-emerald-400 hover:text-emerald-300 font-medium">Mark Done</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
              <Zap className="h-4 w-4 text-gold-400" /> Next Best Action
            </h3>
            <div className="space-y-3">
              {nextBestActions.map((action, idx) => (
                <div key={idx} className="flex gap-3 bg-navy-900/50 p-3 rounded-xl border border-white/5 cursor-pointer hover:bg-white/[0.02] transition-colors">
                  <div className="pt-0.5"><action.icon className={`h-4 w-4 ${action.color}`} /></div>
                  <div>
                    <div className="text-xs font-bold text-cream mb-1">{action.title}</div>
                    <div className="text-[10px] text-ink/60 leading-relaxed">{action.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Daily Contact Planner
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-ink/60">Calls Scheduled</span>
                <span className="text-cream font-medium">5/8 Completed</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-ink/60">Emails Sent</span>
                <span className="text-cream font-medium">12/15 Goal</span>
              </div>
            </div>
          </div>

          <ActivityTimeline
            title="Lead Activity Calendar"
            items={leadActivityCalendar}
          />
        </div>
      </div>

      <LeadDetailModal 
        isOpen={!!selectedLead} 
        onClose={() => setSelectedLead(null)} 
        lead={selectedLead} 
      />
    </div>
  );
}

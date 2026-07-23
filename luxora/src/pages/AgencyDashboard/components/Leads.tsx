import { useState } from 'react';
import { Target, Filter, Plus, Calendar, Clock, UserCircle, MessageSquare, Zap, Activity, Building2, CheckCircle2 } from 'lucide-react';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';
import { SegmentedProgressBar } from '../../../components/dashboard/shared/widgets/SegmentedProgressBar';
import { agencyLeads } from '../../../data/agencyData';
import type { AgencyLead } from '../../../types/agency';

export default function Leads() {
  const [searchQuery, setSearchQuery] = useState('');
  const [leadStatus, setLeadStatus] = useState<'All' | 'New' | 'Contacted' | 'Qualified' | 'Lost' | 'Converted'>('All');
  const [selectedLead, setSelectedLead] = useState<AgencyLead | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const leads = agencyLeads;

  const filteredLeads = leads.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase()) || l.interest.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = leadStatus === 'All' || l.status === leadStatus;
    return matchesSearch && matchesStatus;
  });

  const handleViewLead = (lead: AgencyLead) => {
    setSelectedLead(lead);
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        name="Lead Management"
        subtitle="Track incoming inquiries, assign agents, and monitor conversion pipelines."
        actions={
          <div className="flex gap-3">
            <GhostButton className="flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Follow-ups
            </GhostButton>
            <GoldButton className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Lead
            </GoldButton>
          </div>
        }
      />

      {/* Conversion Dashboard & KPIs */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="New Leads (7d)"
          value="45"
          trend="+12% vs last week"
          trendColor="text-emerald-400"
          icon={Zap}
        />
        <KPICard
          title="Qualified Leads"
          value="18"
          trend="40% qualification rate"
          trendColor="text-blue-400"
          icon={Target}
        />
        <KPICard
          title="Avg. Response Time"
          value="1.2 hrs"
          trend="-0.3 hrs vs last month"
          trendColor="text-emerald-400"
          icon={Clock}
        />
        <KPICard
          title="Conversion Rate"
          value="12.5%"
          trend="Above target (10%)"
          trendColor="text-gold-400"
          icon={CheckCircle2}
        />
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        
        {/* Main Lead Table */}
        <div className="lg:col-span-3 rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col h-[calc(100vh-280px)] min-h-[500px]">
          <DataTableToolbar
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search leads by name or interest..."
            actions={
              <div className="flex gap-2">
                <select 
                  className="bg-navy-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-cream focus:outline-none focus:border-gold-400"
                  value={leadStatus}
                  onChange={(e) => setLeadStatus(e.target.value as 'All' | 'New' | 'Contacted' | 'Qualified' | 'Lost' | 'Converted')}
                >
                  <option value="All">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Converted">Converted</option>
                  <option value="Lost">Lost</option>
                </select>
                <GhostButton className="px-3 flex items-center gap-2"><Filter className="h-4 w-4" /> Filter</GhostButton>
              </div>
            }
          />

          <div className="flex-1 mt-6">
            <DataTable
              data={filteredLeads}
              keyExtractor={(l) => String(l.id)}
              columns={[
                {
                  header: "Lead Info",
                  render: (l) => (
                    <div>
                      <div 
                        className="font-semibold text-cream hover:text-gold-400 cursor-pointer transition-colors"
                        onClick={() => handleViewLead(l)}
                      >
                        {String(l.name)}
                      </div>
                      <div className="text-xs text-ink/60 mt-0.5">{String(l.email)}</div>
                    </div>
                  )
                },
                {
                  header: "Interest",
                  render: (l) => (
                    <div>
                      <div className="text-sm text-cream flex items-center gap-1"><Building2 className="h-3 w-3" /> {String(l.interest)}</div>
                      <div className="text-xs text-ink/60 mt-0.5">{String(l.budget)}</div>
                    </div>
                  )
                },
                {
                  header: "Status",
                  render: (l) => <EnterpriseStatusBadge status={String(l.status)} />
                },
                {
                  header: "Agent",
                  render: (l) => (
                    <div className="flex items-center gap-2">
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold ${l.agent === 'Unassigned' ? 'bg-navy-900 text-ink/40 border border-white/5' : 'bg-navy-900 text-cream border border-gold-400/30'}`}>
                        {l.agent === 'Unassigned' ? '?' : String(l.agent).charAt(0)}
                      </div>
                      <span className={`text-sm ${l.agent === 'Unassigned' ? 'text-rose-400' : 'text-ink/80'}`}>{String(l.agent)}</span>
                    </div>
                  )
                },
                {
                  header: "Activity",
                  render: (l) => (
                    <div>
                      <div className="text-xs text-cream flex items-center gap-1"><Clock className="h-3 w-3" /> {String(l.lastContact)}</div>
                      <div className="text-[10px] text-ink/60 mt-0.5">Age: {l.age} days</div>
                    </div>
                  )
                },
                {
                  header: <div className="text-right">Actions</div>,
                  className: "text-right",
                  render: (l) => (
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 text-ink/60 hover:text-cream rounded hover:bg-white/5 transition-colors" title="Message">
                        <MessageSquare className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleViewLead(l)}
                        className="p-1.5 text-ink/60 hover:text-gold-400 rounded hover:bg-gold-400/10 transition-colors" 
                        title="View Full Profile"
                      >
                        <UserCircle className="h-4 w-4" />
                      </button>
                    </div>
                  )
                }
              ]}
            />
          </div>
        </div>

        {/* Sidebar: Pipeline & Intelligence */}
        <div className="space-y-6">
          
          {/* Lead Funnel */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-lg font-semibold text-cream mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-gold-400" /> Conversion Funnel
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-ink/80">New Inquiries</span>
                  <span className="font-bold text-cream">145</span>
                </div>
                <div className="h-6 w-full bg-navy-950 rounded border border-white/5 overflow-hidden">
                  <div className="h-full bg-slate-500" style={{ width: '100%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-ink/80">Contacted</span>
                  <span className="font-bold text-cream">112</span>
                </div>
                <div className="h-6 w-[80%] bg-navy-950 rounded border border-white/5 overflow-hidden mx-auto">
                  <div className="h-full bg-blue-400" style={{ width: '100%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-ink/80">Qualified</span>
                  <span className="font-bold text-cream">58</span>
                </div>
                <div className="h-6 w-[60%] bg-navy-950 rounded border border-white/5 overflow-hidden mx-auto">
                  <div className="h-full bg-yellow-400" style={{ width: '100%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-ink/80">Converted</span>
                  <span className="font-bold text-cream">18</span>
                </div>
                <div className="h-6 w-[40%] bg-navy-950 rounded border border-white/5 overflow-hidden mx-auto">
                  <div className="h-full bg-emerald-400" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Lead Source Analytics */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-lg font-semibold text-cream mb-6">Lead Sources</h3>
            <SegmentedProgressBar
              segments={[
                { label: 'Website', value: 45, color: 'bg-blue-400' },
                { label: 'Referral', value: 25, color: 'bg-emerald-400' },
                { label: 'Social', value: 20, color: 'bg-gold-400' },
                { label: 'Events', value: 10, color: 'bg-purple-400' }
              ]}
            />
            <div className="mt-6 flex flex-col gap-2 text-xs text-ink/80">
              <div className="flex justify-between items-center"><span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-400"></div> Website</span> <span className="font-bold">45%</span></div>
              <div className="flex justify-between items-center"><span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-400"></div> Referrals</span> <span className="font-bold text-emerald-400">25%</span></div>
            </div>
          </div>

        </div>

      </div>

      <EnterpriseDetailDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedLead ? `Lead: ${selectedLead.name}` : 'Lead Details'}
        footerActions={
          <div className="flex gap-3 w-full">
            <GhostButton className="flex-1">Message Lead</GhostButton>
            <GoldButton className="flex-1">Assign to Agent</GoldButton>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="p-4 rounded-xl border border-white/10 bg-navy-900/50">
            <h4 className="text-sm font-semibold text-cream mb-4">Lead Information</h4>
            <div className="space-y-3 text-sm text-ink/80">
              <div className="flex justify-between border-b border-white/5 pb-2"><span>Email</span><span className="font-medium text-cream">{selectedLead?.email}</span></div>
              <div className="flex justify-between border-b border-white/5 pb-2"><span>Phone</span><span className="font-medium text-cream">{selectedLead?.phone}</span></div>
              <div className="flex justify-between border-b border-white/5 pb-2"><span>Interest</span><span className="font-medium text-cream">{selectedLead?.interest}</span></div>
              <div className="flex justify-between border-b border-white/5 pb-2"><span>Budget</span><span className="font-medium text-cream">{selectedLead?.budget}</span></div>
              <div className="flex justify-between border-b border-white/5 pb-2"><span>Assigned Agent</span><span className="font-medium text-cream">{selectedLead?.agent}</span></div>
              <div className="flex justify-between border-b border-white/5 pb-2"><span>Lead Score</span><span className="font-medium text-cream">{selectedLead?.score}</span></div>
              <div className="flex justify-between border-b border-white/5 pb-2"><span>Source</span><span className="font-medium text-cream">{selectedLead?.source}</span></div>
              <div className="flex justify-between border-b border-white/5 pb-2"><span>Last Contact</span><span className="font-medium text-cream">{selectedLead?.lastContact}</span></div>
            </div>
          </div>
        </div>
      </EnterpriseDetailDrawer>
    </div>
  );
}

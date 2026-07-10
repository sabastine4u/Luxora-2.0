import { useState } from 'react';
import { Target, Filter, Plus, Calendar, Clock, UserCircle, MessageSquare, Zap, Activity, Building2, CheckCircle2 } from 'lucide-react';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { StatusBadge } from '../../ManagementDashboard/components/shared/StatusBadge';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { LeadDetailModal } from './modals/LeadDetailModal';
import { SegmentedProgressBar } from '../../../components/dashboard/shared/widgets/SegmentedProgressBar';

export default function Leads() {
  const [searchQuery, setSearchQuery] = useState('');
  const [leadStatus, setLeadStatus] = useState<'All' | 'New' | 'Contacted' | 'Qualified' | 'Lost' | 'Converted'>('All');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const leads = [
    { id: 'LD-1042', name: 'Aliko Dangote', email: 'aliko@dangote.com', phone: '+234 800 111 2222', interest: 'Ikoyi Penthouse', budget: '₦800M - ₦1B', status: 'Qualified', agent: 'Sarah James', score: 95, source: 'Website', age: 2, lastContact: '2 hours ago' },
    { id: 'LD-1041', name: 'Folorunso Alakija', email: 'f.alakija@faml.com', phone: '+234 800 333 4444', interest: 'Victoria Island Office', budget: '₦1.5B+', status: 'Contacted', agent: 'Sarah James', score: 88, source: 'Referral', age: 5, lastContact: 'Yesterday' },
    { id: 'LD-1040', name: 'Mike Adenuga', email: 'm.adenuga@globacom.com', phone: '+234 800 555 6666', interest: 'Banana Island Plot', budget: '₦500M - ₦700M', status: 'New', agent: 'Unassigned', score: 75, source: 'Social Media', age: 0, lastContact: 'Never' },
    { id: 'LD-1039', name: 'Tony Elumelu', email: 'tony@heirs.com', phone: '+234 800 777 8888', interest: 'Lekki Phase 1 Villa', budget: '₦300M - ₦500M', status: 'Converted', agent: 'Emeka Uzo', score: 100, source: 'Direct', age: 14, lastContact: '1 week ago' },
    { id: 'LD-1038', name: 'Jim Ovia', email: 'jim@zenith.com', phone: '+234 800 999 0000', interest: 'Eko Atlantic Condo', budget: '₦200M - ₦400M', status: 'Lost', agent: 'Michael Eze', score: 40, source: 'Event', age: 30, lastContact: '3 weeks ago' },
  ];

  const filteredLeads = leads.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase()) || l.interest.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = leadStatus === 'All' || l.status === leadStatus;
    return matchesSearch && matchesStatus;
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleViewLead = (lead: any) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
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
                  header: "Status & Score",
                  render: (l) => (
                    <div>
                      <StatusBadge status={String(l.status)} />
                      <div className="text-xs text-ink/60 mt-1 flex items-center gap-1">
                        Score: <span className={l.score >= 80 ? 'text-emerald-400 font-bold' : l.score >= 50 ? 'text-yellow-400' : 'text-rose-400'}>{l.score}</span>
                      </div>
                    </div>
                  )
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

      <LeadDetailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        lead={selectedLead}
      />
    </div>
  );
}

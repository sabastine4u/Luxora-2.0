import { useState } from 'react';
import { Users, UserPlus, Filter, ShieldCheck, Mail, MoreHorizontal, Activity, Star, Award, Briefcase, Clock, Calendar } from 'lucide-react';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { StatusBadge } from '../../ManagementDashboard/components/shared/StatusBadge';
import { AgencyAgentDetailModal } from './modals/AgencyAgentDetailModal';
import { SegmentedProgressBar } from '../../../components/dashboard/shared/widgets/SegmentedProgressBar';

export default function Agents() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedAgent, setSelectedAgent] = useState<{
    name: string; email: string; phone: string; status: string; verified: boolean; assigned: number; score: number; department: string; id: string;
    level: string; joinDate: string; activeLeads: number; clientSat: number;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const agents = [
    { id: 'AGT-001', name: 'Sarah James', email: 'sarah@meridian.com', phone: '+234 800 123 4567', status: 'Active', verified: true, assigned: 12, score: 95, department: 'Residential', level: 'Senior Broker', joinDate: '2022', activeLeads: 24, clientSat: 4.9 },
    { id: 'AGT-002', name: 'Emeka Uzo', email: 'emeka@meridian.com', phone: '+234 800 234 5678', status: 'Active', verified: true, assigned: 8, score: 88, department: 'Commercial', level: 'Broker', joinDate: '2023', activeLeads: 15, clientSat: 4.7 },
    { id: 'AGT-003', name: 'Daniel O.', email: 'daniel@meridian.com', phone: '+234 800 345 6789', status: 'Pending', verified: false, assigned: 0, score: 0, department: 'Residential', level: 'Junior Broker', joinDate: '2025', activeLeads: 2, clientSat: 0 },
    { id: 'AGT-004', name: 'Michael Eze', email: 'michael@meridian.com', phone: '+234 800 456 7890', status: 'On Leave', verified: true, assigned: 2, score: 92, department: 'Luxury', level: 'Partner', joinDate: '2021', activeLeads: 5, clientSat: 5.0 },
  ];

  const filteredAgents = agents.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) newSelection.delete(id);
    else newSelection.add(id);
    setSelectedIds(newSelection);
  };

  const toggleAll = () => {
    if (selectedIds.size === filteredAgents.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredAgents.map(a => String(a.id))));
    }
  };

  const handleViewAgent = (agent: {
    name: string; email: string; phone: string; status: string; verified: boolean; assigned: number; score: number; department: string; id: string;
    level: string; joinDate: string; activeLeads: number; clientSat: number;
  }) => {
    setSelectedAgent(agent);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        name="Workforce Management"
        subtitle="Manage agent assignments, performance analytics, and workforce capacity."
        actions={
          <div className="flex gap-3">
            <GhostButton className="flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Manage Roster
            </GhostButton>
            <GoldButton className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" /> Invite Agent
            </GoldButton>
          </div>
        }
      />

      {/* Workforce Capacity & KPIs */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Active Agents"
          value="42"
          trend="Available today"
          trendColor="text-blue-400"
          icon={Users}
        />
        <KPICard
          title="Avg Utilization"
          value="85%"
          trend="High capacity"
          trendColor="text-yellow-400"
          icon={Activity}
        />
        <KPICard
          title="Deals / Agent"
          value="4.2"
          trend="+1.1 this quarter"
          trendColor="text-emerald-400"
          icon={Briefcase}
        />
        <KPICard
          title="Top Performers"
          value="8"
          trend="Scoring > 90%"
          trendColor="text-gold-400"
          icon={Star}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Department Distribution & Agent Utilization */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Recognition Panel */}
            <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
              <h3 className="font-heading text-lg font-semibold text-cream mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-gold-400" /> Recognition Board
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-navy-900/50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gold-400/20 flex items-center justify-center font-bold text-gold-400 border border-gold-400/50">S</div>
                    <div>
                      <div className="font-bold text-sm text-cream">Sarah James</div>
                      <div className="text-[10px] text-ink/60">Top Seller (Oct)</div>
                    </div>
                  </div>
                  <div className="font-bold text-emerald-400">₦1.2B</div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-navy-900/50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-400/20 flex items-center justify-center font-bold text-blue-400 border border-blue-400/50">E</div>
                    <div>
                      <div className="font-bold text-sm text-cream">Emeka Uzo</div>
                      <div className="text-[10px] text-ink/60">Most Active</div>
                    </div>
                  </div>
                  <div className="font-bold text-blue-400">14 Deals</div>
                </div>
              </div>
            </div>

            {/* Department Distribution */}
            <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
              <h3 className="font-heading text-lg font-semibold text-cream mb-6">Department Distribution</h3>
              <SegmentedProgressBar
                segments={[
                  { label: 'Residential', value: 50, color: 'bg-blue-400' },
                  { label: 'Commercial', value: 30, color: 'bg-emerald-400' },
                  { label: 'Luxury', value: 20, color: 'bg-gold-400' }
                ]}
              />
              <div className="mt-6 flex justify-between text-xs text-ink/80">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-400"></div> Residential (21)</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-400"></div> Commercial (13)</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-gold-400"></div> Luxury (8)</div>
              </div>
            </div>

          </div>

          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col h-[500px]">
            <DataTableToolbar
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder="Search agents by name or email..."
              actions={
                <div className="flex gap-2 items-center">
                  {selectedIds.size > 0 && (
                    <div className="flex items-center gap-2 mr-4 border-r border-white/10 pr-4">
                      <span className="text-sm text-ink/60">{selectedIds.size} selected</span>
                      <GhostButton className="px-3 text-xs h-8">Bulk Assign Leads</GhostButton>
                      <GhostButton className="px-3 text-xs h-8">Bulk Message</GhostButton>
                    </div>
                  )}
                  <GhostButton className="px-3 flex items-center gap-2"><Filter className="h-4 w-4" /> Filters</GhostButton>
                </div>
              }
            />

            <div className="flex-1 mt-6">
              <DataTable
                data={filteredAgents}
                keyExtractor={(a) => String(a.id)}
                columns={[
                  {
                    header: (
                      <input 
                        type="checkbox" 
                        className="rounded border-white/20 bg-navy-900 text-gold-400 focus:ring-gold-400/20"
                        checked={selectedIds.size === filteredAgents.length && filteredAgents.length > 0}
                        onChange={toggleAll}
                      />
                    ),
                    render: (a) => (
                      <input 
                        type="checkbox" 
                        className="rounded border-white/20 bg-navy-900 text-gold-400 focus:ring-gold-400/20"
                        checked={selectedIds.has(String(a.id))}
                        onChange={() => toggleSelection(String(a.id))}
                      />
                    )
                  },
                  {
                    header: "Agent Profile",
                    render: (a) => (
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-navy-900 flex items-center justify-center font-bold text-cream border border-white/10">
                          {String(a.name).charAt(0)}
                        </div>
                        <div>
                          <div 
                            className="font-semibold text-cream hover:text-gold-400 cursor-pointer transition-colors flex items-center gap-2"
                            onClick={() => handleViewAgent(a)}
                          >
                            {String(a.name)}
                            {a.verified && <ShieldCheck className="h-3 w-3 text-blue-400" />}
                          </div>
                          <div className="text-[10px] text-ink/60 uppercase font-bold tracking-wide">{String(a.level)}</div>
                        </div>
                      </div>
                    )
                  },
                  {
                    header: "Department",
                    render: (a) => <span className="text-sm text-ink/80">{String(a.department)}</span>
                  },
                  {
                    header: "Workload",
                    render: (a) => (
                      <div>
                        <div className="text-xs text-cream">{a.assigned} Listings</div>
                        <div className="text-[10px] text-ink/60">{a.activeLeads} Leads</div>
                      </div>
                    )
                  },
                  {
                    header: "Performance",
                    render: (a) => (
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${Number(a.score) >= 90 ? 'text-emerald-400' : Number(a.score) > 0 ? 'text-yellow-400' : 'text-ink/40'}`}>
                          {Number(a.score) > 0 ? `${a.score}` : 'N/A'}
                        </span>
                        {a.clientSat > 0 && <span className="text-[10px] text-ink/60 border-l border-white/10 pl-2">★ {a.clientSat}</span>}
                      </div>
                    )
                  },
                  {
                    header: "Status",
                    render: (a) => <StatusBadge status={String(a.status)} />
                  },
                  {
                    header: <div className="text-right">Actions</div>,
                    className: "text-right",
                    render: (a) => (
                      <div className="flex justify-end gap-2">
                        <button className="p-1.5 text-ink/60 hover:text-cream rounded hover:bg-white/5 transition-colors" title="Contact via Email">
                          <Mail className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleViewAgent(a)}
                          className="p-1.5 text-ink/60 hover:text-gold-400 rounded hover:bg-gold-400/10 transition-colors" 
                          title="View Agent Dashboard"
                        >
                          <Activity className="h-4 w-4" />
                        </button>
                        <button className="p-1.5 text-ink/60 hover:text-cream rounded hover:bg-white/5 transition-colors">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    )
                  }
                ]}
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Attendance Summary */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-lg font-semibold text-cream mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-400" /> Availability Overview
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-ink/80">Available Now</span>
                <span className="font-bold text-emerald-400">32</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-ink/80">On Viewings</span>
                <span className="font-bold text-blue-400">5</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-ink/80">Out of Office</span>
                <span className="font-bold text-rose-400">3</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-ink/80">On Leave</span>
                <span className="font-bold text-yellow-400">2</span>
              </div>
            </div>
          </div>

          {/* Team Productivity */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-lg font-semibold text-cream mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-emerald-400" /> Team Productivity
            </h3>
            <div className="h-32 flex items-end gap-2 mt-4 relative">
              {[40, 60, 45, 80, 50, 95].map((h, i) => (
                <div key={i} className="flex-1 bg-navy-950 rounded-t-sm relative group">
                  <div 
                    className="absolute bottom-0 w-full bg-emerald-400/60 rounded-t-sm transition-all group-hover:bg-emerald-400" 
                    style={{ height: `${h}%` }}
                  ></div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-ink/60 mt-2">
              <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
            </div>
          </div>

        </div>
      </div>

      <AgencyAgentDetailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        agent={selectedAgent}
      />
    </div>
  );
}

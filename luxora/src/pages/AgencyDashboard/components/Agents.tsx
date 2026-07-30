import { useState } from 'react';
import { Users, UserPlus, Filter, ShieldCheck, Mail, MoreHorizontal, Activity, Star, Award, Briefcase, Clock, Calendar, FileText, Upload, Trash2, CheckCircle2, User, FileCheck, Search, ShieldAlert, PowerOff, RefreshCw, KeyRound, ArrowRightLeft, Building2 } from 'lucide-react';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { AgentOnboardingModal } from './modals/AgentOnboardingModal';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';
import { SegmentedProgressBar } from '../../../components/dashboard/shared/widgets/SegmentedProgressBar';
import { agencyAgents } from '../../../data/agencyData';
import type { AgencyAgent } from '../../../types/agency';

export default function Agents() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedAgent, setSelectedAgent] = useState<AgencyAgent | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);

  const agents = agencyAgents;

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

  const handleViewAgent = (agent: AgencyAgent) => {
    setSelectedAgent(agent);
    setIsDrawerOpen(true);
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
            <GoldButton className="flex items-center gap-2" onClick={() => setIsOnboardingModalOpen(true)}>
              <UserPlus className="h-4 w-4" /> Add Agent
            </GoldButton>
            {/* FUTURE-PROOFING: Reserve space for a future secondary action: "Invite Existing Agent" */}
            {/* <GhostButton className="...">Invite Existing Agent</GhostButton> */}
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
                    render: (a) => <EnterpriseStatusBadge status={String(a.status)} />
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
                        <div className="relative group">
                          <button className="p-1.5 text-ink/60 hover:text-cream rounded hover:bg-white/5 transition-colors">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                          <div className="absolute right-0 mt-2 w-48 bg-navy-900 border border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                            <div className="p-2 space-y-1">
                              {a.status === 'Pending' && <button className="w-full text-left px-3 py-2 text-xs text-emerald-400 hover:bg-white/5 rounded-lg flex items-center gap-2"><CheckCircle2 className="h-3 w-3"/> Approve Agent</button>}
                              <button className="w-full text-left px-3 py-2 text-xs text-cream hover:bg-white/5 rounded-lg flex items-center gap-2"><ArrowRightLeft className="h-3 w-3"/> Transfer Branch</button>
                              <button className="w-full text-left px-3 py-2 text-xs text-cream hover:bg-white/5 rounded-lg flex items-center gap-2"><KeyRound className="h-3 w-3"/> Reset Password</button>
                              {a.status === 'Active' ? (
                                <button className="w-full text-left px-3 py-2 text-xs text-yellow-400 hover:bg-white/5 rounded-lg flex items-center gap-2"><PowerOff className="h-3 w-3"/> Suspend Agent</button>
                              ) : (
                                <button className="w-full text-left px-3 py-2 text-xs text-blue-400 hover:bg-white/5 rounded-lg flex items-center gap-2"><RefreshCw className="h-3 w-3"/> Reactivate</button>
                              )}
                              <div className="h-px bg-white/10 my-1"></div>
                              <button className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-400/10 rounded-lg flex items-center gap-2"><Trash2 className="h-3 w-3"/> Remove Agent</button>
                            </div>
                          </div>
                        </div>
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

      <EnterpriseDetailDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedAgent ? `Agent: ${selectedAgent.name}` : 'Agent Details'}
        footerActions={
          <div className="flex gap-3 w-full">
            <GhostButton className="flex-1">Message Agent</GhostButton>
            <GoldButton className="flex-1">Assign Leads</GoldButton>
          </div>
        }
      >
        <div className="space-y-6 pb-20">
          {/* SECTION 1: Personal Information */}
          <div className="p-5 rounded-xl border border-white/10 bg-navy-900/50">
            <h4 className="text-sm font-bold text-cream mb-4 flex items-center gap-2"><User className="h-4 w-4 text-ink/50"/> Personal Information</h4>
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <div><div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">Full Name</div><div className="text-cream">{selectedAgent?.name}</div></div>
              <div><div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">Date of Birth</div><div className="text-cream">{selectedAgent?.dob || 'N/A'}</div></div>
              <div><div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">Gender</div><div className="text-cream">{selectedAgent?.gender || 'N/A'}</div></div>
              <div><div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">Nationality</div><div className="text-cream">{selectedAgent?.nationality || 'N/A'}</div></div>
              <div><div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">Phone Number</div><div className="text-cream">{selectedAgent?.phone}</div></div>
              <div><div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">Email</div><div className="text-cream break-all">{selectedAgent?.email}</div></div>
              <div className="col-span-2"><div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">Residential Address</div><div className="text-cream">{selectedAgent?.residentialAddress || 'N/A'}</div></div>
              <div><div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">Emergency Contact</div><div className="text-cream">{selectedAgent?.emergencyContact || 'N/A'}</div></div>
              <div><div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">Next of Kin</div><div className="text-cream">{selectedAgent?.nextOfKin || 'N/A'}</div></div>
            </div>
          </div>

          {/* SECTION 2: Professional Information */}
          <div className="p-5 rounded-xl border border-white/10 bg-navy-900/50">
            <h4 className="text-sm font-bold text-cream mb-4 flex items-center gap-2"><Briefcase className="h-4 w-4 text-ink/50"/> Professional Information</h4>
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <div><div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">Years of Experience</div><div className="text-cream">{selectedAgent?.yearsOfExperience || 0} Years</div></div>
              <div><div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">Languages</div><div className="text-cream">{selectedAgent?.languages?.join(', ') || 'N/A'}</div></div>
              <div className="col-span-2"><div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">Biography</div><div className="text-cream text-xs leading-relaxed">{selectedAgent?.biography || 'No biography provided.'}</div></div>
              <div className="col-span-2"><div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">Specializations</div><div className="flex flex-wrap gap-2 mt-1">{selectedAgent?.specializations?.map((s,i) => <span key={i} className="text-[10px] bg-white/5 px-2 py-1 rounded text-ink/80">{s}</span>) || 'N/A'}</div></div>
              <div className="col-span-2"><div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">Service Areas</div><div className="flex flex-wrap gap-2 mt-1">{selectedAgent?.serviceAreas?.map((s,i) => <span key={i} className="text-[10px] bg-white/5 px-2 py-1 rounded text-ink/80">{s}</span>) || 'N/A'}</div></div>
              <div><div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">Coverage Radius</div><div className="text-cream">{selectedAgent?.coverageRadius || 'N/A'}</div></div>
              <div><div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">License Number</div><div className="text-cream font-mono">{selectedAgent?.licenseNumber || 'N/A'}</div></div>
              <div className="col-span-2"><div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">Certifications</div><div className="text-cream text-xs">{selectedAgent?.certifications?.join(', ') || 'N/A'}</div></div>
            </div>
          </div>

          {/* SECTION 3: Agency Information */}
          <div className="p-5 rounded-xl border border-white/10 bg-navy-900/50">
            <h4 className="text-sm font-bold text-cream mb-4 flex items-center gap-2"><Building2 className="h-4 w-4 text-ink/50"/> Agency Information</h4>
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <div><div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">Agency</div><div className="text-cream font-medium">Meridian Luxury Properties</div></div>
              <div><div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">Branch</div><div className="text-cream">{selectedAgent?.branch || 'HQ'}</div></div>
              <div><div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">Managing Director</div><div className="text-cream">Marcus Sterling</div></div>
              <div><div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">Agency Verification Status</div><div className="text-emerald-400 font-medium">{selectedAgent?.agencyVerificationStatus || 'Verified'}</div></div>
              <div className="col-span-2"><div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">Agency Role</div><div className="text-cream">{selectedAgent?.level} • {selectedAgent?.department} Specialist</div></div>
            </div>
          </div>

          {/* SECTION 4: Employment Information */}
          <div className="p-5 rounded-xl border border-white/10 bg-navy-900/50">
            <h4 className="text-sm font-bold text-cream mb-4 flex items-center gap-2"><FileCheck className="h-4 w-4 text-ink/50"/> Employment Information</h4>
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <div><div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">Employee ID</div><div className="text-cream font-mono">{selectedAgent?.id}</div></div>
              <div><div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">Date Joined</div><div className="text-cream">{selectedAgent?.joinDate}</div></div>
              <div><div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">Employment Status</div><div className="text-emerald-400 font-medium">{selectedAgent?.employmentStatus || 'Active'}</div></div>
              <div><div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">Employment Type</div><div className="text-cream">{selectedAgent?.employmentType || 'Full-Time'}</div></div>
              <div><div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">Background Check</div><div className="text-emerald-400">{selectedAgent?.backgroundCheckStatus || 'Cleared'}</div></div>
              <div><div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">License Status</div><div className="text-emerald-400">{selectedAgent?.licenseStatus || 'Active'}</div></div>
              <div className="col-span-2"><div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">Employment Contract</div><div className="text-blue-400 underline cursor-pointer">{selectedAgent?.employmentContract || 'View Contract'}</div></div>
              <div className="col-span-2"><div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">Internal Notes</div><div className="text-ink/80 text-xs italic bg-navy-950 p-2 rounded">{selectedAgent?.internalNotes || 'No notes available.'}</div></div>
            </div>
          </div>

          {/* SECTION 5: Performance & Workload */}
          <div className="p-5 rounded-xl border border-white/10 bg-navy-900/50">
            <h4 className="text-sm font-bold text-cream mb-4 flex items-center gap-2"><Activity className="h-4 w-4 text-ink/50"/> Performance & Workload</h4>
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <div><div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">Revenue Generated</div><div className="text-emerald-400 font-bold">{selectedAgent?.revenueGenerated || '₦0'}</div></div>
              <div><div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">Commission Earned</div><div className="text-gold-400 font-bold">{selectedAgent?.commissionEarned || '₦0'}</div></div>
              <div><div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">Active Listings</div><div className="text-cream">{selectedAgent?.assigned}</div></div>
              <div><div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">Pending Assignments</div><div className="text-cream">{selectedAgent?.pendingAssignments || 0}</div></div>
              <div><div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">Open Deals</div><div className="text-cream">{selectedAgent?.openDeals || 0}</div></div>
              <div><div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">Appointments</div><div className="text-cream">{selectedAgent?.appointments || 0}</div></div>
              <div><div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">Current Leads</div><div className="text-cream">{selectedAgent?.activeLeads}</div></div>
              <div><div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">Avg Response Time</div><div className="text-cream">{selectedAgent?.avgResponseTime || 'N/A'}</div></div>
              <div><div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">Performance Score</div><div className="text-emerald-400">{selectedAgent?.score}%</div></div>
              <div><div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">Capacity</div><div className="text-yellow-400">{selectedAgent?.capacity || 0}%</div></div>
              <div><div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">Client Rating</div><div className="text-gold-400">★ {selectedAgent?.clientSat}</div></div>
            </div>
          </div>

          {/* SECTION 6: Verification & Documents */}
          <div className="p-5 rounded-xl border border-white/10 bg-navy-900/50">
            <h4 className="text-sm font-bold text-cream mb-4 flex items-center gap-2"><ShieldAlert className="h-4 w-4 text-ink/50"/> Verification & Documents</h4>
            <div className="space-y-3">
              {[
                { name: 'Government ID', status: 'Approved' },
                { name: 'Passport Photograph', status: 'Approved' },
                { name: 'Professional License', status: 'Approved' },
                { name: 'Employment Contract', status: 'Approved' },
                { name: 'Proof of Address', status: 'Approved' },
                { name: 'Bank Information', status: 'Pending' },
                { name: 'Tax Information', status: 'Pending' }
              ].map((doc, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-lg border border-white/5 bg-navy-950">
                  <div className="flex items-center gap-3">
                    <FileText className={`h-4 w-4 ${doc.status === 'Approved' ? 'text-emerald-400' : 'text-yellow-400'}`} />
                    <div>
                      <div className="text-sm font-medium text-cream">{doc.name}</div>
                      <div className={`text-[10px] font-bold tracking-wider uppercase ${doc.status === 'Approved' ? 'text-emerald-400' : 'text-yellow-400'}`}>{doc.status}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-ink/60 hover:text-gold-400 transition-colors p-1" title="View"><Search className="h-4 w-4" /></button>
                    <button className="text-ink/60 hover:text-gold-400 transition-colors p-1" title="Replace"><Upload className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </EnterpriseDetailDrawer>

      <AgentOnboardingModal 
        isOpen={isOnboardingModalOpen} 
        onClose={() => setIsOnboardingModalOpen(false)} 
      />
    </div>
  );
}

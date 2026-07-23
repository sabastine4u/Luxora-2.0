import { useState } from 'react';
import { Users, Filter, CheckCircle2, AlertTriangle, ArrowRightLeft, Clock, Award, Star, Activity } from 'lucide-react';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { GhostButton } from '../../../components/ui/ui';
import { StatusBadge } from './shared/StatusBadge';
import { ManagementTeamDetailModal } from './modals/ManagementTeamDetailModal';
import type { TeamMember } from '../../../types';

export default function TeamManagement() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const teamMembers: TeamMember[] = [
    { id: 'TM-101', name: 'Sarah Jacobs', department: 'Finance', role: 'Director', status: 'Active', performance: 'A+' },
    { id: 'TM-102', name: 'Chidi Okafor', department: 'Procurement', role: 'Manager', status: 'On Leave', performance: 'B+' },
    { id: 'TM-103', name: 'Aisha Lawal', department: 'Property Management', role: 'Director', status: 'Active', performance: 'A' },
    { id: 'TM-104', name: 'Musa Bello', department: 'Intelligence', role: 'Head of Intel', status: 'Active', performance: 'A+' },
    { id: 'TM-105', name: 'James Eze', department: 'Home Services', role: 'Service Coordinator', status: 'Warning', performance: 'C' },
  ];

  const recognitions = [
    { name: 'Sarah Jacobs', reason: 'Exceeded Q3 Cost Savings by 15%', award: 'Executive Excellence' },
    { name: 'Musa Bello', reason: 'Zero security breaches in 12 months', award: 'Security Champion' },
  ];

  const handleRowClick = (member: TeamMember) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        name="Team Management"
        subtitle="Manage cross-department personnel, workforce distribution, and enterprise capacity."
        actions={
          <div className="flex gap-3">
          </div>
        }
      />

      {/* Capacity & Productivity KPIs */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Team Utilization"
          value="88%"
          trend="+5% MoM"
          trendColor="text-emerald-400"
          icon={Activity}
          footer={<div className="text-xs text-ink/60">Cross-department capacity</div>}
        />
        <KPICard
          title="Workforce Availability"
          value="138/142"
          trend="4 on leave"
          trendColor="text-yellow-400"
          icon={Users}
          footer={<div className="text-xs text-ink/60">Currently active</div>}
        />
        <KPICard
          title="Team Productivity"
          value="A-"
          trend="Meeting goals"
          trendColor="text-emerald-400"
          icon={CheckCircle2}
          footer={<div className="text-xs text-ink/60">Avg. performance score</div>}
        />
        <KPICard
          title="Attendance Risk"
          value="2"
          trend="Review needed"
          trendColor="text-rose-400"
          icon={AlertTriangle}
          footer={<div className="text-xs text-ink/60">High absenteeism risk</div>}
        />
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Workforce Distribution Overview */}
            <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
              <h3 className="font-heading text-lg font-semibold text-cream mb-4">Workforce Distribution</h3>
              <div className="space-y-3">
                {[
                  { dept: 'Finance', count: 18, color: 'bg-gold-400' },
                  { dept: 'Intelligence', count: 45, color: 'bg-emerald-400' },
                  { dept: 'Procurement', count: 22, color: 'bg-blue-400' },
                  { dept: 'Property Mgt', count: 57, color: 'bg-yellow-400' }
                ].map((d, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-ink/60">{d.dept}</span>
                      <span className="text-cream font-medium">{d.count} Members</span>
                    </div>
                    <div className="h-1.5 w-full bg-navy-950 rounded-full overflow-hidden border border-white/5">
                      <div className={`h-full ${d.color}`} style={{ width: `${(d.count / 142) * 100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Department Staffing Heatmap Placeholder */}
            <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-lg font-semibold text-cream">Staffing Heatmap</h3>
                <span className="text-xs text-ink/60">Current Shift</span>
              </div>
              <div className="flex-1 grid grid-cols-4 gap-2">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className={`rounded-lg border border-white/5 ${i % 5 === 0 ? 'bg-rose-400/20' : i % 3 === 0 ? 'bg-yellow-400/20' : 'bg-emerald-400/20'} flex items-center justify-center`} title="Department Sector">
                    <span className={`h-2 w-2 rounded-full ${i % 5 === 0 ? 'bg-rose-400' : i % 3 === 0 ? 'bg-yellow-400' : 'bg-emerald-400'}`}></span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-4 text-[10px] text-ink/60">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-400"></span> Optimal</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-yellow-400"></span> Strained</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-400"></span> Critical</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h3 className="font-heading text-lg font-semibold text-cream">Personnel Directory</h3>
              <DataTableToolbar
                searchValue=""
                onSearchChange={() => {}}
                searchPlaceholder="Search personnel by name or ID..."
                actions={
                  <div className="flex gap-2">
                    <GhostButton className="px-3 flex items-center gap-2"><ArrowRightLeft className="h-4 w-4" /> Bulk Reassign</GhostButton>
                    <GhostButton className="px-3 flex items-center gap-2"><Filter className="h-4 w-4" /> Filter</GhostButton>
                  </div>
                }
              />
            </div>

            <DataTable
              data={teamMembers}
              keyExtractor={(member) => member.id}
              columns={[
                {
                  header: "Name",
                  render: (member) => (
                    <div className="font-semibold text-cream flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-700 text-gold-400 text-xs font-bold border border-white/5">
                        {member.name.charAt(0)}
                      </div>
                      {member.name}
                    </div>
                  )
                },
                {
                  header: "Role",
                  render: (member) => <span className="text-ink/60">{member.role}</span>
                },
                {
                  header: "Department",
                  render: (member) => (
                    <span className="inline-flex items-center rounded-full border border-white/10 bg-navy-900/50 px-2.5 py-0.5 text-xs text-ink/60">
                      {member.department}
                    </span>
                  )
                },
                {
                  header: "Performance",
                  render: (member) => (
                    <span className={`font-bold ${member.performance.startsWith('A') ? 'text-emerald-400' : member.performance.startsWith('B') ? 'text-blue-400' : 'text-yellow-400'}`}>
                      {member.performance}
                    </span>
                  )
                },
                {
                  header: "Status",
                  render: (member) => <StatusBadge status={member.status} />
                },
                {
                  header: <div className="text-right">Actions</div>,
                  className: "text-right",
                  render: (member) => (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleRowClick(member); }}
                      className="text-gold-400 hover:underline text-sm font-medium"
                    >
                      View Profile
                    </button>
                  )
                }
              ]}
            />
          </div>
        </div>

        {/* Right Sidebar widgets */}
        <div className="space-y-6">
          {/* Team Recognition Panel */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Award className="h-5 w-5 text-gold-400" />
              <h3 className="font-heading text-lg font-semibold text-cream">Top Performers</h3>
            </div>
            <div className="space-y-3">
              {recognitions.map((rec, i) => (
                <div key={i} className="p-3 rounded-xl border border-gold-400/20 bg-gold-400/5">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="h-4 w-4 text-gold-400 fill-gold-400" />
                    <span className="text-sm font-bold text-cream">{rec.name}</span>
                  </div>
                  <div className="text-[10px] uppercase font-bold text-gold-400/80 mb-1">{rec.award}</div>
                  <p className="text-xs text-ink/80">{rec.reason}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-blue-400" />
              <h3 className="font-heading text-lg font-semibold text-cream">Availability Summary</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 rounded-lg hover:bg-white/5">
                <span className="text-sm text-ink/80">On Leave (PTO)</span>
                <span className="text-sm font-medium text-yellow-400">3</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg hover:bg-white/5">
                <span className="text-sm text-ink/80">Sick Leave</span>
                <span className="text-sm font-medium text-rose-400">1</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg hover:bg-white/5">
                <span className="text-sm text-ink/80">Remote Access</span>
                <span className="text-sm font-medium text-blue-400">12</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ManagementTeamDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        member={selectedMember}
      />
    </div>
  );
}

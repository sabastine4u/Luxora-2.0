import { useState } from 'react';
import { ShieldAlert, MoreHorizontal, SearchX, UserCheck, Users, CheckCircle, Star, UserPlus, Activity } from 'lucide-react';
import { ActivityTimeline } from '../../../components/dashboard/shared/timelines/ActivityTimeline';

import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { UserDetailModal } from './UserDetailModal';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';

const mockAgents = [
  { id: 'AGT-001', name: 'Adaeze Okonkwo', agency: 'Meridian Luxury', deals: 42, joined: 'Jan 2024', status: 'Verified' },
  { id: 'AGT-002', name: 'Chioma Obi', agency: 'Meridian Luxury', deals: 12, joined: 'Mar 2024', status: 'Verified' },
  { id: 'AGT-003', name: 'Oluwaseun Adeyemi', agency: 'Independent', deals: 0, joined: 'Oct 2025', status: 'Pending KYC' },
];

export default function Agents() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<Record<string, unknown> | null>(null);

  return (
    <div className="space-y-6">
      <DashboardHeader 
        name="Agent Management"
        subtitle="Manage and monitor real estate agents on the platform."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Total Agents" value="1,205" icon={Users} trend="+45 this month" trendColor="text-emerald-400" iconColor="text-blue-400" />
        <KPICard title="New Registrations" value="38" icon={UserPlus} trend="User Growth" trendColor="text-emerald-400" iconColor="text-emerald-400" />
        <KPICard title="Verified Agents" value="980" icon={CheckCircle} trend="Verification Status" trendColor="text-emerald-400" iconColor="text-blue-400" />
        <KPICard title="Top Performers" value="12" icon={Star} trend="Elite Tier" trendColor="text-gold-400" iconColor="text-gold-400" backgroundColor="bg-gold-400/10" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <DataTableToolbar
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search agents..."
            showFilter
          />

          <DataTable
            data={mockAgents}
            keyExtractor={(agent) => agent.id}
            columns={[
              {
                header: "Agent ID",
                render: (agent) => <span className="font-medium text-cream">{agent.id}</span>
              },
              {
                header: "Name",
                render: (agent) => <span className="font-semibold text-cream">{agent.name}</span>
              },
              {
                header: "Agency Affiliation",
                render: (agent) => <span className="text-ink/60">{agent.agency}</span>
              },
              {
                header: "Total Deals",
                render: (agent) => <span className="font-semibold text-gold-400">{agent.deals}</span>
              },
              {
                header: "Joined Date",
                render: (agent) => <span className="text-ink/60">{agent.joined}</span>
              },
              {
                header: "KYC Status",
                render: (agent) => (
                  agent.status === 'Verified' ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 text-[10px] font-semibold text-emerald-400 uppercase">
                      <UserCheck className="h-3 w-3" /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-400/10 border border-blue-400/20 px-2.5 py-1 text-[10px] font-semibold text-blue-400 uppercase">
                      <ShieldAlert className="h-3 w-3" /> Pending
                    </span>
                  )
                )
              },
              {
                header: <div className="text-right">Actions</div>,
                className: "text-right",
                render: (agent) => (
                  <button 
                    className="rounded-lg p-2 text-ink/40 hover:bg-white/10 hover:text-cream transition-colors"
                    onClick={() => setSelectedUser(agent)}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                )
              }
            ]}
            emptyState={
              <div className="flex flex-col items-center justify-center py-12 text-center bg-navy-900/50 rounded-xl border border-white/5 border-dashed">
                <SearchX className="h-12 w-12 text-ink/20 mb-4" />
                <h3 className="text-lg font-bold text-cream">No agents found</h3>
                <p className="text-sm text-ink/50 mt-1">Try adjusting your search or filters.</p>
              </div>
            }
          />
        </div>

        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <ActivityTimeline 
            title="Recently Active Agents" 
            items={[
              { title: 'Adaeze Okonkwo', desc: 'Closed a Deal', time: '10 mins ago', color: 'text-emerald-400', icon: Activity },
              { title: 'Chioma Obi', desc: 'Updated Agency Profile', time: '1 hour ago', color: 'text-blue-400', icon: Activity },
              { title: 'Oluwaseun Adeyemi', desc: 'Submitted KYC Docs', time: '3 hours ago', color: 'text-gold-400', icon: Activity },
            ]} 
          />
        </div>
      </div>



      <UserDetailModal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        user={selectedUser}
      />
    </div>
  );
}

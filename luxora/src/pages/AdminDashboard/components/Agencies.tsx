import { useState } from 'react';
import { MoreHorizontal, SearchX, Building2, CheckCircle, Clock, UserPlus, Activity } from 'lucide-react';
import { ActivityTimeline } from '../../../components/dashboard/shared/timelines/ActivityTimeline';

import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import { adminAgencies } from '../../../data/adminData';
import type { AdminAgency } from '../../../types/admin';

export default function Agencies() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminAgency | null>(null);

  return (
    <div className="space-y-6">
      <DashboardHeader 
        name="Agency Management"
        subtitle="Manage corporate real estate agencies and their teams."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Total Agencies" value="342" icon={Building2} trend="+12 this month" trendColor="text-emerald-400" iconColor="text-purple-400" />
        <KPICard title="New Registrations" value="4" icon={UserPlus} trend="Agency Growth" trendColor="text-emerald-400" iconColor="text-emerald-400" />
        <KPICard title="Active Agencies" value="315" icon={CheckCircle} trend="Verification Status" trendColor="text-emerald-400" iconColor="text-blue-400" />
        <KPICard title="Pending Approval" value="8" icon={Clock} trend="Action Required" trendColor="text-yellow-400" iconColor="text-yellow-400" backgroundColor="bg-yellow-400/10" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <DataTableToolbar
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search agencies..."
            showFilter
          />

          <DataTable
            data={adminAgencies}
            keyExtractor={(agency) => agency.id}
            columns={[
              {
                header: "Agency ID",
                render: (agency) => <span className="font-medium text-cream">{agency.id}</span>
              },
              {
                header: "Name",
                render: (agency) => <span className="font-semibold text-cream">{agency.name}</span>
              },
              {
                header: "Total Agents",
                render: (agency) => <span className="text-ink/60">{agency.agents}</span>
              },
              {
                header: "Active Listings",
                render: (agency) => <span className="font-semibold text-gold-400">{agency.listings}</span>
              },
              {
                header: "Joined Date",
                render: (agency) => <span className="text-ink/60">{agency.joined}</span>
              },
              {
                header: "Status",
                render: (agency) => <EnterpriseStatusBadge status={agency.status} />
              },
              {
                header: <div className="text-right">Actions</div>,
                className: "text-right",
                render: (agency) => (
                  <button 
                    className="rounded-lg p-2 text-ink/40 hover:bg-white/10 hover:text-cream transition-colors"
                    onClick={() => setSelectedUser(agency)}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                )
              }
            ]}
            emptyState={
              <div className="flex flex-col items-center justify-center py-12 text-center bg-navy-900/50 rounded-xl border border-white/5 border-dashed">
                <SearchX className="h-12 w-12 text-ink/20 mb-4" />
                <h3 className="text-lg font-bold text-cream">No agencies found</h3>
                <p className="text-sm text-ink/50 mt-1">Try adjusting your search or filters.</p>
              </div>
            }
          />
        </div>

        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <ActivityTimeline 
            title="Recently Active Agencies" 
            items={[
              { title: 'Meridian Luxury', desc: 'Added 2 New Agents', time: '10 mins ago', color: 'text-emerald-400', icon: Activity },
              { title: 'Eko Estates', desc: 'Updated Business Profile', time: '1 hour ago', color: 'text-blue-400', icon: Activity },
              { title: 'Abuja Premier Properties', desc: 'Submitted KYC', time: '3 hours ago', color: 'text-gold-400', icon: Activity },
            ]} 
          />
        </div>
      </div>

      <EnterpriseDetailDrawer
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title="Agency Details"
        subtitle={selectedUser?.name}
        footerActions={
          <button className="w-full rounded-xl bg-gold-400 py-3 text-sm font-bold text-navy-900 transition-colors hover:bg-gold-300">
            Edit Agency
          </button>
        }
      >
        {selectedUser && (
          <div className="space-y-6">
            <div>
              <div className="text-xs text-ink/60 uppercase tracking-wider mb-1">Status</div>
              <EnterpriseStatusBadge status={selectedUser.status} />
            </div>
            <div>
              <div className="text-xs text-ink/60 uppercase tracking-wider mb-1">Total Agents</div>
              <div className="text-sm font-semibold text-cream">{selectedUser.agents}</div>
            </div>
            <div>
              <div className="text-xs text-ink/60 uppercase tracking-wider mb-1">Total Listings</div>
              <div className="text-sm font-semibold text-gold-400">{selectedUser.listings}</div>
            </div>
            <div>
              <div className="text-xs text-ink/60 uppercase tracking-wider mb-1">Joined Date</div>
              <div className="text-sm font-semibold text-cream">{selectedUser.joined}</div>
            </div>
          </div>
        )}
      </EnterpriseDetailDrawer>
    </div>
  );
}

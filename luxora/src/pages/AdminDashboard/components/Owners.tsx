import { useState } from 'react';
import { ShieldAlert, UserCheck, MoreHorizontal, SearchX, Users, CheckCircle, Clock, UserPlus, Activity } from 'lucide-react';
import { ActivityTimeline } from '../../../components/dashboard/shared/timelines/ActivityTimeline';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { UserDetailModal } from './UserDetailModal';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';

const mockOwners = [
  { id: 'OWN-901', name: 'Aliko Dangote', email: 'aliko@example.com', properties: 12, joined: 'Jan 2024', status: 'Active' },
  { id: 'OWN-902', name: 'Tony Elumelu', email: 'tony@example.com', properties: 8, joined: 'Mar 2024', status: 'Active' },
  { id: 'OWN-903', name: 'Folorunso Alakija', email: 'f.alakija@example.com', properties: 5, joined: 'Jun 2024', status: 'Suspended' },
  { id: 'OWN-904', name: 'Femi Otedola', email: 'femi@example.com', properties: 3, joined: 'Aug 2024', status: 'Active' },
];

export default function Owners() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<Record<string, unknown> | null>(null);

  return (
    <div className="space-y-6">
      <DashboardHeader 
        name="Owner Management"
        subtitle="Manage and monitor property owners on the platform."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Total Owners" value="2,145" icon={Users} trend="+32 this month" trendColor="text-emerald-400" iconColor="text-purple-400" />
        <KPICard title="New Registrations" value="84" icon={UserPlus} trend="User Growth" trendColor="text-emerald-400" iconColor="text-emerald-400" />
        <KPICard title="Verified Owners" value="1,850" icon={CheckCircle} trend="Verification Status" trendColor="text-emerald-400" iconColor="text-blue-400" />
        <KPICard title="Pending Verification" value="45" icon={Clock} trend="Action Required" trendColor="text-yellow-400" iconColor="text-yellow-400" backgroundColor="bg-yellow-400/10" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <DataTableToolbar
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search owners..."
            showFilter
          />

          <DataTable
            data={mockOwners}
            keyExtractor={(owner) => owner.id}
            columns={[
              {
                header: "Owner ID",
                render: (owner) => <span className="font-medium text-cream">{owner.id}</span>
              },
              {
                header: "Name / Email",
                render: (owner) => (
                  <>
                    <div className="font-semibold text-cream">{owner.name}</div>
                    <div className="text-xs text-ink/50">{owner.email}</div>
                  </>
                )
              },
              {
                header: "Properties",
                render: (owner) => <span className="font-semibold text-gold-400">{owner.properties}</span>
              },
              {
                header: "Joined Date",
                render: (owner) => <span className="text-ink/60">{owner.joined}</span>
              },
              {
                header: "Status",
                render: (owner) => (
                  owner.status === 'Active' ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 text-[10px] font-semibold text-emerald-400 uppercase">
                      <UserCheck className="h-3 w-3" /> Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-400/10 border border-rose-400/20 px-2.5 py-1 text-[10px] font-semibold text-rose-400 uppercase">
                      <ShieldAlert className="h-3 w-3" /> Suspended
                    </span>
                  )
                )
              },
              {
                header: <div className="text-right">Actions</div>,
                className: "text-right",
                render: (owner) => (
                  <button 
                    className="rounded-lg p-2 text-ink/40 hover:bg-white/10 hover:text-cream transition-colors"
                    onClick={() => setSelectedUser(owner)}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                )
              }
            ]}
            emptyState={
              <div className="flex flex-col items-center justify-center py-12 text-center bg-navy-900/50 rounded-xl border border-white/5 border-dashed">
                <SearchX className="h-12 w-12 text-ink/20 mb-4" />
                <h3 className="text-lg font-bold text-cream">No owners found</h3>
                <p className="text-sm text-ink/50 mt-1">Try adjusting your search or filters.</p>
              </div>
            }
          />
        </div>

        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <ActivityTimeline 
            title="Recently Active Owners" 
            items={[
              { title: 'Aliko Dangote', desc: 'Updated Listing Pricing', time: '10 mins ago', color: 'text-emerald-400', icon: Activity },
              { title: 'Femi Otedola', desc: 'Replied to Inquiry', time: '1 hour ago', color: 'text-blue-400', icon: Activity },
              { title: 'Tony Elumelu', desc: 'Uploaded New Photos', time: '3 hours ago', color: 'text-gold-400', icon: Activity },
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

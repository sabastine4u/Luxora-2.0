import { useState } from 'react';
import { MoreHorizontal, SearchX, UserCheck, Clock, Users, XCircle, UserPlus, Activity } from 'lucide-react';
import { ActivityTimeline } from '../../../components/dashboard/shared/timelines/ActivityTimeline';

import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { UserDetailModal } from './UserDetailModal';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';

const mockBuyers = [
  { id: 'BUY-401', name: 'Ngozi Eze', email: 'ngozi@example.com', saved: 24, joined: 'Oct 2025', lastActive: '2 hours ago', status: 'Active' },
  { id: 'BUY-402', name: 'Emeka Ike', email: 'emeka@example.com', saved: 12, joined: 'Sep 2025', lastActive: '1 day ago', status: 'Active' },
  { id: 'BUY-403', name: 'Aisha Bello', email: 'aisha@example.com', saved: 4, joined: 'Aug 2025', lastActive: '2 weeks ago', status: 'Inactive' },
];

export default function Buyers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<Record<string, unknown> | null>(null);

  return (
    <div className="space-y-6">
      <DashboardHeader 
        name="Buyer Management"
        subtitle="Manage and monitor property buyers on the platform."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Total Buyers" value="8,402" icon={Users} trend="+154 this month" trendColor="text-emerald-400" iconColor="text-blue-400" />
        <KPICard title="New Registrations" value="342" icon={UserPlus} trend="User Growth" trendColor="text-emerald-400" iconColor="text-purple-400" />
        <KPICard title="Active Buyers" value="6,120" icon={UserCheck} trend="Account Health" trendColor="text-emerald-400" iconColor="text-emerald-400" />
        <KPICard title="Suspended Buyers" value="24" icon={XCircle} trend="Requires Attention" trendColor="text-rose-400" iconColor="text-rose-400" backgroundColor="bg-rose-400/10" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <DataTableToolbar
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search buyers..."
            showFilter
          />

          <DataTable
            data={mockBuyers}
            keyExtractor={(buyer) => buyer.id}
            columns={[
              {
                header: "User ID",
                render: (buyer) => <span className="font-medium text-cream">{buyer.id}</span>
              },
              {
                header: "Name / Email",
                render: (buyer) => (
                  <>
                    <div className="font-semibold text-cream">{buyer.name}</div>
                    <div className="text-xs text-ink/50">{buyer.email}</div>
                  </>
                )
              },
              {
                header: "Saved Properties",
                render: (buyer) => <span className="font-semibold text-gold-400">{buyer.saved}</span>
              },
              {
                header: "Joined / Last Active",
                render: (buyer) => (
                  <>
                    <div className="text-ink/60">{buyer.joined}</div>
                    <div className="text-xs text-ink/40 mt-0.5">{buyer.lastActive}</div>
                  </>
                )
              },
              {
                header: "Status",
                render: (buyer) => (
                  buyer.status === 'Active' ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 text-[10px] font-semibold text-emerald-400 uppercase">
                      <UserCheck className="h-3 w-3" /> Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-400/10 border border-yellow-400/20 px-2.5 py-1 text-[10px] font-semibold text-yellow-400 uppercase">
                      <Clock className="h-3 w-3" /> Inactive
                    </span>
                  )
                )
              },
              {
                header: <div className="text-right">Actions</div>,
                className: "text-right",
                render: (buyer) => (
                  <button 
                    className="rounded-lg p-2 text-ink/40 hover:bg-white/10 hover:text-cream transition-colors"
                    onClick={() => setSelectedUser(buyer)}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                )
              }
            ]}
            emptyState={
              <div className="flex flex-col items-center justify-center py-12 text-center bg-navy-900/50 rounded-xl border border-white/5 border-dashed">
                <SearchX className="h-12 w-12 text-ink/20 mb-4" />
                <h3 className="text-lg font-bold text-cream">No buyers found</h3>
                <p className="text-sm text-ink/50 mt-1">Try adjusting your search or filters.</p>
              </div>
            }
          />
        </div>

        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <ActivityTimeline 
            title="Recently Active Buyers" 
            items={[
              { title: 'Ngozi Eze', desc: 'Saved Skyline Penthouse', time: '10 mins ago', color: 'text-emerald-400', icon: Activity },
              { title: 'Emeka Ike', desc: 'Requested Viewing', time: '1 hour ago', color: 'text-blue-400', icon: Activity },
              { title: 'Chidi Okafor', desc: 'Updated Profile', time: '3 hours ago', color: 'text-gold-400', icon: Activity },
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

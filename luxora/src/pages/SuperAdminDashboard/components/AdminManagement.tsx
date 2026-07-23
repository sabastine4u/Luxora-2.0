import { Users, Activity, ShieldCheck, ShieldAlert, FileCheck, Search, Filter, Trash2, UserPlus, Fingerprint, CheckCircle, XCircle } from 'lucide-react';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { SegmentedProgressBar } from '../../../components/dashboard/shared/widgets/SegmentedProgressBar';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal';
import { useState } from 'react';

export default function AdminManagement() {
  const [confirmModal, setConfirmModal] = useState<{isOpen: boolean; type: 'add' | 'suspend' | null}>({ isOpen: false, type: null });

  const userDistribution = [
    { label: 'Active Buyers', value: 45, color: 'bg-emerald-400' },
    { label: 'Active Owners', value: 25, color: 'bg-blue-400' },
    { label: 'Verified Agents', value: 15, color: 'bg-gold-400' },
    { label: 'Agencies', value: 5, color: 'bg-purple-400' },
    { label: 'Inactive', value: 10, color: 'bg-ink/20' }
  ];

  return (
    <div className="space-y-6 pb-12">
      <DashboardHeader 
        name="Platform Administration" 
        subtitle="Global user growth analytics, verification progress, and administrator activity."
        actions={
          <div className="flex gap-3">
            <GhostButton className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> Permission Audit
            </GhostButton>
            <GoldButton className="flex items-center gap-2">
              <Users className="h-4 w-4" /> Bulk Operations
            </GoldButton>
          </div>
        }
      />

      {/* User Growth Analytics & Health Indicators */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-gradient-to-br from-navy-800 to-navy-900 border border-white/10 rounded-2xl p-6 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-400/20 rounded-xl">
              <UserPlus className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="font-heading text-xl font-bold text-cream">User Growth Analytics</h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-navy-900/50 p-4 rounded-xl border border-white/5 text-center">
               <div className="text-3xl font-bold text-blue-400">142.5K</div>
               <div className="text-xs text-ink/60 mt-1">Total Registered Users</div>
            </div>
            <div className="bg-navy-900/50 p-4 rounded-xl border border-white/5 text-center">
               <div className="text-3xl font-bold text-emerald-400">84.2K</div>
               <div className="text-xs text-ink/60 mt-1">Monthly Active (MAU)</div>
            </div>
            <div className="bg-navy-900/50 p-4 rounded-xl border border-white/5 text-center">
               <div className="text-3xl font-bold text-gold-400">12.4K</div>
               <div className="text-xs text-ink/60 mt-1">New Users (Last 30d)</div>
            </div>
            <div className="bg-navy-900/50 p-4 rounded-xl border border-white/5 text-center">
               <div className="text-3xl font-bold text-emerald-400">4.8%</div>
               <div className="text-xs text-ink/60 mt-1">Churn Rate</div>
            </div>
          </div>
          <SegmentedProgressBar title="Global User Distribution" segments={userDistribution} />
        </div>

        {/* Verification Progress & High Risk Monitor */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
              <Fingerprint className="h-4 w-4 text-emerald-400" /> Identity & Verification
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-cream">Agent Verification Queue</span>
                  <span className="text-gold-400">42 Pending</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gold-400 w-[75%] rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-cream">Owner KYC Queue</span>
                  <span className="text-blue-400">18 Pending</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400 w-[35%] rounded-full"></div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex justify-between items-center text-sm p-3 bg-rose-400/10 border border-rose-400/20 rounded-xl">
                  <span className="text-rose-400 font-medium flex items-center gap-2"><ShieldAlert className="h-4 w-4" /> High Risk Accounts</span>
                  <span className="text-rose-400 font-bold">14</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Total Admins" value="24" trend="System Access" trendColor="text-blue-400" icon={ShieldCheck} />
        <KPICard title="Admin Actions" value="1,248" trend="Last 24 Hours" trendColor="text-emerald-400" icon={Activity} />
        <KPICard title="Pending KYC" value="60" trend="Awaiting Approval" trendColor="text-gold-400" icon={FileCheck} />
        <KPICard title="Suspended Users" value="214" trend="Platform Wide" trendColor="text-rose-400" icon={ShieldAlert} />
      </div>

      <div className="space-y-6">
        {/* Administrator Activity Dashboard */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 overflow-hidden">
          <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
            <h3 className="font-heading text-lg font-semibold text-cream">Administrator Activity & Directory</h3>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
                <input type="text" placeholder="Search administrators..." className="h-9 w-full sm:w-64 rounded-lg border border-white/10 bg-navy-900/50 pl-10 pr-4 text-sm text-cream focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400" />
              </div>
              <GhostButton className="h-9 w-9 p-0 flex items-center justify-center shrink-0"><Filter className="h-4 w-4" /></GhostButton>
            </div>
          </div>
          <DataTable
            data={[
              { id: 'ADM-001', name: 'John Doe', email: 'john.doe@luxora.com', role: 'Super Admin', status: 'Active', lastLogin: '2 mins ago', dept: 'Executive' },
              { id: 'ADM-002', name: 'Jane Smith', email: 'jane.smith@luxora.com', role: 'Compliance Admin', status: 'Active', lastLogin: '1 hour ago', dept: 'Legal' },
              { id: 'ADM-003', name: 'Chidi Okafor', email: 'chidi.o@luxora.com', role: 'Support Lead', status: 'Suspended', lastLogin: '2 months ago', dept: 'Support' },
            ]}
            keyExtractor={(admin) => admin.id}
            columns={[
              {
                header: "Admin Details",
                render: (admin) => (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-400/20 text-blue-400 flex items-center justify-center text-xs font-bold">
                      {admin.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-cream text-sm">{admin.name}</div>
                      <div className="text-xs text-ink/60">{admin.email}</div>
                    </div>
                  </div>
                )
              },
              {
                header: "Department",
                render: (admin) => <span className="text-cream text-sm">{admin.dept}</span>
              },
              {
                header: "Role Level",
                render: (admin) => (
                  <span className={`px-2 py-1 rounded-full text-[10px] font-semibold uppercase ${admin.role.includes('Super') ? 'bg-gold-400/10 text-gold-400 border border-gold-400/20' : 'bg-blue-400/10 text-blue-400 border border-blue-400/20'}`}>
                    {admin.role}
                  </span>
                )
              },
              {
                header: "Status",
                render: (admin) => (
                  <span className={`px-2 py-1 rounded-full text-[10px] font-semibold uppercase flex items-center gap-1 w-max ${admin.status === 'Active' ? 'text-emerald-400 bg-emerald-400/10' : 'text-rose-400 bg-rose-400/10'}`}>
                    {admin.status === 'Active' ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />} {admin.status}
                  </span>
                )
              },
              {
                header: "Last Login",
                render: (admin) => <span className="text-ink/60 text-xs">{admin.lastLogin}</span>
              },
              {
                header: <div className="text-right">Actions</div>,
                className: "text-right",
                render: (admin) => (
                  admin.role !== 'Super Admin' && (
                    <button className="text-rose-400 hover:bg-rose-400/10 p-2 rounded-lg transition-colors" title="Suspend Admin" onClick={() => setConfirmModal({ isOpen: true, type: 'suspend' })}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )
                )
              }
            ]}
          />
        </div>
      </div>

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: null })}
        onConfirm={() => setConfirmModal({ isOpen: false, type: null })}
        title="Suspend Administrator"
        message="Are you sure you want to suspend this Administrator? This will immediately revoke their access to the Luxora platform."
        confirmText="Suspend"
        isDestructive={true}
      />
    </div>
  );
}

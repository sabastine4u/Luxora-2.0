import { Activity, ShieldCheck, ShieldAlert, FileCheck, Search, Filter, UserPlus, Fingerprint, CheckCircle, XCircle, MoreVertical } from 'lucide-react';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { SegmentedProgressBar } from '../../../components/dashboard/shared/widgets/SegmentedProgressBar';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal';
import { ProvisionUserModal } from '../../AdminDashboard/components/modals/ProvisionUserModal';

import { useState } from 'react';
import { administrators } from '../../../data/superAdminData';
import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import { ActivityTimeline } from '../../../components/dashboard/shared/timelines/ActivityTimeline';

export default function AdminManagement() {
  const [confirmModal, setConfirmModal] = useState<{isOpen: boolean; type: string | null}>({ isOpen: false, type: null });
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<typeof administrators[0] | null>(null);

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
            <GoldButton onClick={() => setIsProvisionModalOpen(true)} className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" /> Add Administrator
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
        <KPICard title="Total Admins" value={administrators.length.toString()} trend="System Access" trendColor="text-blue-400" icon={ShieldCheck} />
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
            data={administrators}
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
                  <div className="flex justify-end items-center gap-2">
                    <GhostButton className="h-8 px-3 text-xs" onClick={() => setSelectedAdmin(admin)}>View Profile</GhostButton>
                    <div className="relative group cursor-pointer p-2 hover:bg-white/5 rounded-lg">
                      <MoreVertical className="h-4 w-4 text-ink/40" />
                      {/* Simple Dropdown for quick actions (simulated by hover/group) */}
                      <div className="absolute right-0 top-full mt-1 w-48 bg-navy-800 border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                        <button className="w-full text-left px-4 py-2 text-sm text-cream hover:bg-white/5" onClick={() => setSelectedAdmin(admin)}>Edit Profile</button>
                        {admin.role !== 'Super Admin' && (
                          <button className="w-full text-left px-4 py-2 text-sm text-rose-400 hover:bg-rose-400/10" onClick={() => setConfirmModal({ isOpen: true, type: 'suspend' })}>Suspend</button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              }
            ]}
          />
        </div>
      </div>

      {/* Enterprise Detail Drawer for Administrator Profile */}
      <EnterpriseDetailDrawer
        isOpen={selectedAdmin !== null}
        onClose={() => setSelectedAdmin(null)}
        title="Administrator Profile"
        subtitle={selectedAdmin?.id}
        footerActions={
          <div className="w-full space-y-3">
            <div className="flex gap-2">
              <GoldButton className="flex-1">Edit Admin</GoldButton>
              <GhostButton className="flex-1" onClick={() => setConfirmModal({ isOpen: true, type: 'transfer' })}>Transfer Queues</GhostButton>
            </div>
            <div className="flex gap-2">
              <GhostButton className="flex-1 text-orange-400 hover:bg-orange-400/10" onClick={() => setConfirmModal({ isOpen: true, type: 'lock' })}>Lock Account</GhostButton>
              <GhostButton className="flex-1 text-rose-400 hover:bg-rose-400/10" onClick={() => setConfirmModal({ isOpen: true, type: 'reset' })}>Force Reset</GhostButton>
            </div>
            <div className="border-t border-white/10 pt-3 flex gap-2">
              <GhostButton className="flex-1 border-rose-400/20 text-rose-400 hover:bg-rose-400/10" onClick={() => setConfirmModal({ isOpen: true, type: 'override' })}>Force Override</GhostButton>
            </div>
          </div>
        }
      >
        {selectedAdmin && (
          <div className="space-y-8 pb-6">
            {/* Identity & Organization */}
            <div className="flex gap-4 items-center">
              <div className="w-16 h-16 rounded-full bg-blue-400/20 text-blue-400 flex items-center justify-center text-2xl font-bold">
                {selectedAdmin.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-cream">{selectedAdmin.name}</h3>
                <p className="text-sm text-ink/60">{selectedAdmin.role}</p>
                <div className="mt-1 flex gap-2">
                  <EnterpriseStatusBadge status={selectedAdmin.status} />
                  <EnterpriseStatusBadge status={selectedAdmin.dept} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-cream border-b border-white/10 pb-2">Identity Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-ink/60">Email</div>
                  <div className="text-sm text-cream">{selectedAdmin.email}</div>
                </div>
                <div>
                  <div className="text-xs text-ink/60">Phone</div>
                  <div className="text-sm text-cream">{selectedAdmin.phone}</div>
                </div>
                <div>
                  <div className="text-xs text-ink/60">Employee ID</div>
                  <div className="text-sm text-cream">{selectedAdmin.employeeId}</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-cream border-b border-white/10 pb-2">Organization & Access</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-ink/60">Region</div>
                  <div className="text-sm text-cream">{selectedAdmin.region}</div>
                </div>
                <div>
                  <div className="text-xs text-ink/60">Business Unit</div>
                  <div className="text-sm text-cream">{selectedAdmin.businessUnit}</div>
                </div>
              </div>
              <div>
                <div className="text-xs text-ink/60 mb-1">Responsibilities</div>
                <div className="flex flex-wrap gap-2">
                  {selectedAdmin.responsibilities.map(r => (
                    <span key={r} className="px-2 py-1 bg-white/5 rounded-md text-xs text-cream">{r}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-cream border-b border-white/10 pb-2">Security Status</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-ink/60 mb-1">MFA Status</div>
                  <EnterpriseStatusBadge status={selectedAdmin.mfaStatus === 'Enabled' ? 'Optimal' : 'Critical'} />
                </div>
                <div>
                  <div className="text-xs text-ink/60 mb-1">Password Status</div>
                  <EnterpriseStatusBadge status={selectedAdmin.passwordStatus === 'Valid' ? 'Healthy' : 'Warning'} />
                </div>
                <div className="col-span-2">
                  <div className="text-xs text-ink/60 mb-1">Last Login</div>
                  <div className="text-sm text-cream">{selectedAdmin.lastLogin} from {selectedAdmin.loginHistory[0]?.location}</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-cream border-b border-white/10 pb-2">Performance & Queues</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-ink/60">SLA Performance</div>
                  <div className="text-sm font-bold text-emerald-400">{selectedAdmin.slaPerformance}</div>
                </div>
                <div>
                  <div className="text-xs text-ink/60">Complaints Resolved</div>
                  <div className="text-sm font-bold text-cream">{selectedAdmin.complaintsResolved}</div>
                </div>
                <div>
                  <div className="text-xs text-ink/60">Verification Queue</div>
                  <div className="text-sm font-bold text-gold-400">{selectedAdmin.verificationQueue} Pending</div>
                </div>
                <div>
                  <div className="text-xs text-ink/60">Agencies Managed</div>
                  <div className="text-sm font-bold text-blue-400">{selectedAdmin.agenciesManaged}</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-cream border-b border-white/10 pb-2">Administrator Timeline</h4>
              <ActivityTimeline items={selectedAdmin.timeline} />
            </div>
          </div>
        )}
      </EnterpriseDetailDrawer>

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: null })}
        onConfirm={() => setConfirmModal({ isOpen: false, type: null })}
        title={
          confirmModal.type === 'suspend' ? 'Suspend Administrator' : 
          confirmModal.type === 'transfer' ? 'Transfer Responsibilities' : 
          confirmModal.type === 'lock' ? 'Lock Account' : 
          confirmModal.type === 'reset' ? 'Force Password Reset' : 
          'Override Decision'
        }
        message={
          confirmModal.type === 'suspend' ? 'Are you sure you want to suspend this Administrator? This will immediately revoke their access.' : 
          confirmModal.type === 'transfer' ? 'Assign this administrator\'s active verification and assignment queues to an Acting Administrator.' : 
          confirmModal.type === 'lock' ? 'Lock this account to temporarily disable login without suspending.' : 
          confirmModal.type === 'reset' ? 'Invalidate the current password and force a reset upon next login.' : 
          'Force an override on an operational decision. This action will be heavily audited.'
        }
        confirmText={
          confirmModal.type === 'transfer' ? 'Initiate Transfer' : 
          confirmModal.type === 'override' ? 'Confirm Override' : 
          'Confirm Action'
        }
        isDestructive={['suspend', 'lock', 'reset', 'override'].includes(confirmModal.type || '')}
      />

      <ProvisionUserModal
        isOpen={isProvisionModalOpen}
        onClose={() => setIsProvisionModalOpen(false)}
        mode="super-admin"
      />
    </div>
  );
}

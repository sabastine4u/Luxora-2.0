import { useState } from 'react';
import { MoreHorizontal, SearchX, CheckCircle, Clock, UserPlus, ShieldCheck, Briefcase } from 'lucide-react';

import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import { ProvisionUserModal } from './modals/ProvisionUserModal';
import { GoldButton } from '../../../components/ui/ui';
import { ROLES } from '../../../constants/roles';


// Mock data for Internal Staff
const mockStaff = [
  { id: 'STF-001', name: 'James Carter', role: ROLES.MANAGER, department: 'Operations', status: 'Active', joined: '2023-01-15' },
  { id: 'STF-002', name: 'Sarah Lawson', role: ROLES.PROCUREMENT, department: 'Procurement', status: 'Active', joined: '2023-03-22' },
  { id: 'STF-003', name: 'Michael Obinna', role: ROLES.FINANCE, department: 'Finance', status: 'Active', joined: '2023-05-10' },
  { id: 'STF-004', name: 'Elena Rodriguez', role: ROLES.PROPERTY_MANAGER, department: 'Property Management', status: 'Active', joined: '2023-08-05' },
  { id: 'STF-005', name: 'David Chen', role: ROLES.ANALYST, department: 'Data Intelligence', status: 'Pending Verification', joined: '2024-01-12' },
];

export default function InternalStaff() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<typeof mockStaff[0] | null>(null);
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);

  const staff = mockStaff;
  
  const filteredStaff = staff.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <DashboardHeader 
        name="Internal Staff"
        subtitle="Manage Luxora operational employees and department access."
        actions={
          <GoldButton onClick={() => setIsProvisionModalOpen(true)} className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" /> Add Staff
          </GoldButton>
        }
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Total Staff" value="48" icon={Briefcase} trend="+3 this month" trendColor="text-emerald-400" iconColor="text-blue-400" />
        <KPICard title="Active Staff" value="45" icon={CheckCircle} trend="Operations Normal" trendColor="text-emerald-400" iconColor="text-emerald-400" />
        <KPICard title="Management" value="12" icon={ShieldCheck} trend="Leadership Team" trendColor="text-emerald-400" iconColor="text-gold-400" />
        <KPICard title="Pending Onboarding" value="3" icon={Clock} trend="Action Required" trendColor="text-yellow-400" iconColor="text-yellow-400" backgroundColor="bg-yellow-400/10" />
      </div>

      <div className="grid gap-6 lg:grid-cols-1">
        <div className="space-y-6">
          <DataTableToolbar
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search staff by name, role, or department..."
            showFilter
          />

          <DataTable
            data={filteredStaff}
            keyExtractor={(staff) => staff.id}
            columns={[
              {
                header: "Staff ID",
                render: (staff) => <span className="font-medium text-cream">{staff.id}</span>
              },
              {
                header: "Name",
                render: (staff) => <span className="font-semibold text-cream">{staff.name}</span>
              },
              {
                header: "Role",
                render: (staff) => <span className="text-ink/60">{staff.role}</span>
              },
              {
                header: "Department",
                render: (staff) => <span className="text-ink/60">{staff.department}</span>
              },
              {
                header: "Joined Date",
                render: (staff) => <span className="text-ink/60">{staff.joined}</span>
              },
              {
                header: "Status",
                render: (staff) => <EnterpriseStatusBadge status={staff.status} />
              },
              {
                header: <div className="text-right">Actions</div>,
                className: "text-right",
                render: (staff) => (
                  <button 
                    className="rounded-lg p-2 text-ink/40 hover:bg-white/10 hover:text-cream transition-colors"
                    onClick={() => setSelectedUser(staff)}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                )
              }
            ]}
            emptyState={
              <div className="flex flex-col items-center justify-center py-12 text-center bg-navy-900/50 rounded-xl border border-white/5 border-dashed">
                <SearchX className="h-12 w-12 text-ink/20 mb-4" />
                <h3 className="text-lg font-bold text-cream">No staff found</h3>
                <p className="text-sm text-ink/50 mt-1">Try adjusting your search or filters.</p>
              </div>
            }
          />
        </div>
      </div>

      <EnterpriseDetailDrawer
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title="Staff Details"
        subtitle={selectedUser?.name}
        footerActions={
          <button className="w-full rounded-xl bg-gold-400 py-3 text-sm font-bold text-navy-900 transition-colors hover:bg-gold-300">
            Edit Access
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
              <div className="text-xs text-ink/60 uppercase tracking-wider mb-1">Role</div>
              <div className="text-sm font-semibold text-cream">{selectedUser.role}</div>
            </div>
            <div>
              <div className="text-xs text-ink/60 uppercase tracking-wider mb-1">Department</div>
              <div className="text-sm font-semibold text-cream">{selectedUser.department}</div>
            </div>
            <div>
              <div className="text-xs text-ink/60 uppercase tracking-wider mb-1">Joined Date</div>
              <div className="text-sm font-semibold text-cream">{selectedUser.joined}</div>
            </div>
          </div>
        )}
      </EnterpriseDetailDrawer>

      <ProvisionUserModal
        isOpen={isProvisionModalOpen}
        onClose={() => setIsProvisionModalOpen(false)}
        mode="admin"
        fixedType="internal_staff"
      />
    </div>
  );
}

import { useState } from 'react';
import { Users, Plus, MessageSquare } from 'lucide-react';
import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';
import { TenantFormModal } from './modals/TenantFormModal';
import { LeaseActionModal } from './modals/LeaseActionModal';
import { useToast } from '../../../contexts/ToastContext';
import type { Tenant } from '../../../types';

interface TenantsProps {
  onNavigate?: (tab: string) => void;
}

export default function Tenants({ onNavigate }: TenantsProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const tenants: Tenant[] = [
    { id: 'TNT-001', name: 'Dr. Ayo Balogun', property: 'Victoria Island Villa', unit: 'Entire House', status: 'Active', leaseEnds: 'Dec 2026', phone: '+234 801 234 5678', email: 'ayo.balogun@example.com' },
    { id: 'TNT-002', name: 'Sarah Jenkins', property: 'Lekki Studio Apt', unit: 'Apt 4B', status: 'Moving Out', leaseEnds: 'Nov 2025', phone: '+234 802 345 6789', email: 's.jenkins@example.com' },
    { id: 'TNT-003', name: 'TechFlow Ltd', property: 'Abuja Central Office', unit: 'Floor 3', status: 'Active', leaseEnds: 'Jan 2028', phone: '+234 803 456 7890', email: 'admin@techflow.ng' },
  ];

  const { showToast } = useToast();
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [modalState, setModalState] = useState<'add' | 'edit' | 'renew' | null>(null);

  const handleAction = (action: string) => {
    showToast({
      title: 'Backend Integration',
      description: `Action "${action}" is ready for backend integration.`,
      type: 'info'
    });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Tenant Directory</h2>
          <p className="text-sm text-ink/60">Manage your active tenants, communications, and details.</p>
        </div>
        <GoldButton className="flex items-center gap-2" onClick={() => setModalState('add')}><Plus className="h-4 w-4" /> Add Tenant</GoldButton>
      </div>

      <DataTableToolbar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by name, property, or phone..."
        showExport
        onExport={() => handleAction('Export Tenants')}
      />

      <DataTable
        data={tenants}
        keyExtractor={(tnt) => tnt.id}
        columns={[
          {
            header: "Tenant Name",
            render: (tnt) => (
              <div className="font-semibold text-cream flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gold-400/10 flex items-center justify-center text-gold-400 shrink-0">
                  <Users className="h-4 w-4" />
                </div>
                {tnt.name}
              </div>
            )
          },
          {
            header: "Property & Unit",
            render: (tnt) => (
              <div>
                <div className="font-medium text-cream">{tnt.property}</div>
                <div className="text-xs text-ink/60">{tnt.unit}</div>
              </div>
            )
          },
          {
            header: "Contact",
            render: (tnt) => <span className="text-ink/60">{tnt.phone}</span>
          },
          {
            header: "Lease End",
            render: (tnt) => <span className="text-ink/60">{tnt.leaseEnds}</span>
          },
          {
            header: "Status",
            render: (tnt) => <EnterpriseStatusBadge status={tnt.status} />
          },
          {
            header: <div className="text-right">Actions</div>,
            className: "text-right",
            render: (tnt) => (
              <button 
                className="p-2 text-ink/40 hover:text-gold-400 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onNavigate) onNavigate('Messages');
                  else handleAction(`Message ${tnt.name}`);
                }}
              >
                <MessageSquare className="h-4 w-4" />
              </button>
            )
          }
        ]}
        onRowClick={(tenant) => setSelectedTenant(tenant)}
      />

      <EnterpriseDetailDrawer
        isOpen={!!selectedTenant}
        onClose={() => setSelectedTenant(null)}
        title="Tenant Details"
      >
        {selectedTenant && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-navy-800/50 border border-white/10 space-y-4">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gold-400/10 flex items-center justify-center text-gold-400">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-cream">{selectedTenant.name}</h3>
                    <div className="text-xs text-ink/60">{selectedTenant.id}</div>
                  </div>
                </div>
                <EnterpriseStatusBadge status={selectedTenant.status} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-ink/60 mb-1">Property & Unit</div>
                  <div className="font-medium text-cream">{selectedTenant.property}</div>
                  <div className="text-xs text-ink/40">{selectedTenant.unit}</div>
                </div>
                <div>
                  <div className="text-xs text-ink/60 mb-1">Lease Ends</div>
                  <div className="font-medium text-cream">{selectedTenant.leaseEnds}</div>
                </div>
                <div>
                  <div className="text-xs text-ink/60 mb-1">Email</div>
                  <div className="font-medium text-cream">{selectedTenant.email}</div>
                </div>
                <div>
                  <div className="text-xs text-ink/60 mb-1">Phone</div>
                  <div className="font-medium text-cream">{selectedTenant.phone}</div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4 border-t border-white/10">
              <GoldButton className="flex-1" onClick={() => { setModalState('edit'); }}>
                Edit Profile
              </GoldButton>
              <GhostButton onClick={() => { setModalState('renew'); }}>
                Renew Lease
              </GhostButton>
            </div>
          </div>
        )}
      </EnterpriseDetailDrawer>

      <TenantFormModal 
        isOpen={modalState === 'add' || modalState === 'edit'}
        onClose={() => { setModalState(null); setSelectedTenant(null); }}
        initialData={modalState === 'edit' ? selectedTenant : null}
        onSubmit={(data) => {
          handleAction(modalState === 'edit' ? `Update Tenant ${data.name}` : `Add Tenant ${data.name}`);
        }}
      />

      <LeaseActionModal 
        isOpen={modalState === 'renew'}
        onClose={() => setModalState(null)}
        action="Renew"
        tenantName={selectedTenant?.name}
        onSubmit={(data) => {
          handleAction(`Renew Lease for ${selectedTenant?.name} for ${data.duration}`);
          setSelectedTenant(null);
        }}
      />
    </div>
  );
}

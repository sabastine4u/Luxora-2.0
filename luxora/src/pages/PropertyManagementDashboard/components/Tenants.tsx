import { useState } from 'react';
import { Users, Plus, MessageSquare } from 'lucide-react';
import { GoldButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';

export default function Tenants() {
  const [searchQuery, setSearchQuery] = useState('');

  const tenants = [
    { id: 'TNT-001', name: 'Dr. Ayo Balogun', property: 'Victoria Island Villa', unit: 'Entire House', status: 'Active', leaseEnds: 'Dec 2026', phone: '+234 801 234 5678' },
    { id: 'TNT-002', name: 'Sarah Jenkins', property: 'Lekki Studio Apt', unit: 'Apt 4B', status: 'Moving Out', leaseEnds: 'Nov 2025', phone: '+234 802 345 6789' },
    { id: 'TNT-003', name: 'TechFlow Ltd', property: 'Abuja Central Office', unit: 'Floor 3', status: 'Active', leaseEnds: 'Jan 2028', phone: '+234 803 456 7890' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Tenant Directory</h2>
          <p className="text-sm text-ink/60">Manage your active tenants, communications, and details.</p>
        </div>
        <GoldButton className="flex items-center gap-2"><Plus className="h-4 w-4" /> Add Tenant</GoldButton>
      </div>

      <DataTableToolbar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by name, property, or phone..."
        showExport
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
            render: (tnt) => (
              <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${tnt.status === 'Active' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'}`}>
                {tnt.status}
              </span>
            )
          },
          {
            header: <div className="text-right">Actions</div>,
            className: "text-right",
            render: () => (
              <button className="p-2 text-ink/40 hover:text-gold-400 transition-colors">
                <MessageSquare className="h-4 w-4" />
              </button>
            )
          }
        ]}
      />
    </div>
  );
}

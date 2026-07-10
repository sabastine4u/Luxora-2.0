import { Mail, Phone, Users, Filter } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';

export default function VendorDirectory() {
  const vendors = [
    { id: 'VND-001', name: 'Global Tech Supplies', category: 'IT Hardware', status: 'Active', rating: 4.8 },
    { id: 'VND-002', name: 'Lagos Office Works', category: 'Office Supplies', status: 'Active', rating: 4.5 },
    { id: 'VND-003', name: 'SecureNet Solutions', category: 'Security Services', status: 'Pending Review', rating: 0 },
    { id: 'VND-004', name: 'Prime Cleaners Ltd', category: 'Maintenance', status: 'Inactive', rating: 3.2 },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Vendor Directory</h2>
          <p className="text-sm text-ink/60">Manage all registered suppliers and service providers.</p>
        </div>
        <DataTableToolbar
          searchValue=""
          onSearchChange={() => {}}
          searchPlaceholder="Search vendors..."
          actions={
            <GhostButton className="px-3"><Filter className="h-4 w-4" /></GhostButton>
          }
        />
      </div>

      <DataTable
        data={vendors}
        keyExtractor={(vendor) => vendor.id}
        columns={[
          {
            header: "Vendor ID",
            render: (vendor) => <span className="font-medium text-cream">{vendor.id}</span>
          },
          {
            header: "Name",
            render: (vendor) => (
              <div className="font-semibold text-cream flex items-center gap-2">
                <Users className="h-4 w-4 text-ink/40" /> {vendor.name}
              </div>
            )
          },
          {
            header: "Category",
            render: (vendor) => <span className="text-ink/60">{vendor.category}</span>
          },
          {
            header: "Status",
            render: (vendor) => (
              <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${vendor.status === 'Active' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : vendor.status === 'Pending Review' ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' : 'text-rose-400 bg-rose-400/10 border-rose-400/20'}`}>
                {vendor.status}
              </span>
            )
          },
          {
            header: "Rating",
            render: (vendor) => <span className="font-bold text-gold-400">{vendor.rating > 0 ? `${vendor.rating} ★` : '-'}</span>
          },
          {
            header: <div className="text-right">Contact</div>,
            className: "text-right",
            render: () => (
              <div className="flex justify-end gap-2">
                <button className="text-gold-400 hover:bg-gold-400/10 p-2 rounded-lg transition-colors"><Mail className="h-4 w-4" /></button>
                <button className="text-gold-400 hover:bg-gold-400/10 p-2 rounded-lg transition-colors"><Phone className="h-4 w-4" /></button>
              </div>
            )
          }
        ]}
      />
    </div>
  );
}

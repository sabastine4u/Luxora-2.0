import { Users, Search, Filter, Mail, Phone } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';

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
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
            <input 
              type="text" 
              placeholder="Search vendors..." 
              className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-2 pl-9 pr-4 text-sm text-cream placeholder:text-ink/40 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50"
            />
          </div>
          <GhostButton className="px-3"><Filter className="h-4 w-4" /></GhostButton>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-navy-800/50">
        <table className="w-full text-left text-sm">
          <thead className="bg-navy-900/50 text-xs uppercase text-ink/50 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-semibold">Vendor ID</th>
              <th className="px-6 py-4 font-semibold">Name</th>
              <th className="px-6 py-4 font-semibold">Category</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Rating</th>
              <th className="px-6 py-4 font-semibold text-right">Contact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {vendors.map((vendor) => (
              <tr key={vendor.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-medium text-cream">{vendor.id}</td>
                <td className="px-6 py-4 font-semibold text-cream flex items-center gap-2">
                  <Users className="h-4 w-4 text-ink/40" /> {vendor.name}
                </td>
                <td className="px-6 py-4 text-ink/60">{vendor.category}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${vendor.status === 'Active' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : vendor.status === 'Pending Review' ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' : 'text-rose-400 bg-rose-400/10 border-rose-400/20'}`}>
                    {vendor.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-gold-400">{vendor.rating > 0 ? `${vendor.rating} ★` : '-'}</td>
                <td className="px-6 py-4 text-right">
                   <div className="flex justify-end gap-2">
                     <button className="text-gold-400 hover:bg-gold-400/10 p-2 rounded-lg transition-colors"><Mail className="h-4 w-4" /></button>
                     <button className="text-gold-400 hover:bg-gold-400/10 p-2 rounded-lg transition-colors"><Phone className="h-4 w-4" /></button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

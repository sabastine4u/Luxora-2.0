import { Wrench, ShieldCheck, MoreHorizontal } from 'lucide-react';
import { GoldButton } from '../../../components/ui/ui';

export default function HomeServices() {
  const vendors = [
    { id: 'V-001', name: 'Sparkle Clean', category: 'Cleaning', rating: 4.8, jobs: 142, status: 'Active' },
    { id: 'V-002', name: 'Elite Movers', category: 'Moving', rating: 4.9, jobs: 89, status: 'Active' },
    { id: 'V-003', name: 'FixIt Pro Plumbers', category: 'Plumbing', rating: 4.2, jobs: 12, status: 'Pending Review' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Home Services Directory</h2>
          <p className="text-sm text-ink/60">Manage third-party service providers (cleaning, moving, plumbing).</p>
        </div>
        <GoldButton>Onboard Vendor</GoldButton>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
           <div className="flex items-center gap-2 mb-2">
             <Wrench className="h-5 w-5 text-blue-400" />
             <div className="text-sm text-ink/60">Total Providers</div>
           </div>
           <div className="text-3xl font-bold text-cream">128</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
           <div className="flex items-center gap-2 mb-2">
             <ShieldCheck className="h-5 w-5 text-emerald-400" />
             <div className="text-sm text-ink/60">Completed Jobs (YTD)</div>
           </div>
           <div className="text-3xl font-bold text-cream">4,521</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
           <div className="text-sm text-ink/60 mb-2">Lead Gen Revenue</div>
           <div className="text-3xl font-bold text-gold-400">₦1.8B</div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-navy-800/50">
        <table className="w-full text-left text-sm">
          <thead className="bg-navy-900/50 text-xs uppercase text-ink/50 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-semibold">Vendor ID</th>
              <th className="px-6 py-4 font-semibold">Business Name</th>
              <th className="px-6 py-4 font-semibold">Category</th>
              <th className="px-6 py-4 font-semibold">Avg Rating</th>
              <th className="px-6 py-4 font-semibold">Jobs Completed</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {vendors.map((vendor) => (
              <tr key={vendor.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-medium text-cream">{vendor.id}</td>
                <td className="px-6 py-4 font-semibold text-cream">{vendor.name}</td>
                <td className="px-6 py-4 text-ink/60">{vendor.category}</td>
                <td className="px-6 py-4 text-emerald-400 font-bold">{vendor.rating} ★</td>
                <td className="px-6 py-4 font-semibold text-gold-400">{vendor.jobs}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${vendor.status === 'Active' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'}`}>
                    {vendor.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                   <button className="text-ink/40 hover:text-cream hover:bg-white/10 p-2 rounded-lg transition-colors">
                     <MoreHorizontal className="h-4 w-4" />
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

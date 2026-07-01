import { Building2, Search, Filter, MoreHorizontal, CheckCircle, XCircle } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';

export default function PropertyManagement() {
  const properties = [
    { id: 'PRP-1001', title: 'Skyline Penthouse', location: 'Victoria Island, Lagos', price: '₦450,000,000', status: 'Live', type: 'Sale' },
    { id: 'PRP-1002', title: 'Oceanview Villa', location: 'Lekki Phase 1, Lagos', price: '₦8,000,000/yr', status: 'Pending Review', type: 'Rent' },
    { id: 'PRP-1003', title: 'Maitama Mansion', location: 'Maitama, Abuja', price: '₦1,200,000,000', status: 'Live', type: 'Sale' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Global Property Management</h2>
          <p className="text-sm text-ink/60">Overview and control of all listings across the Luxora platform.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
            <input 
              type="text" 
              placeholder="Search properties..." 
              className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-2 pl-9 pr-4 text-sm text-cream placeholder:text-ink/40 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50"
            />
          </div>
          <GhostButton className="px-3"><Filter className="h-4 w-4" /></GhostButton>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4 mb-6">
         <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
           <div className="text-3xl font-bold text-cream">12,418</div>
           <div className="text-sm text-ink/60 mt-1">Total Active Listings</div>
         </div>
         <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
           <div className="text-3xl font-bold text-emerald-400">8,204</div>
           <div className="text-sm text-ink/60 mt-1">For Sale</div>
         </div>
         <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
           <div className="text-3xl font-bold text-blue-400">4,214</div>
           <div className="text-sm text-ink/60 mt-1">For Rent</div>
         </div>
         <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
           <div className="text-3xl font-bold text-gold-400">42</div>
           <div className="text-sm text-ink/60 mt-1">Pending Review</div>
         </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-navy-800/50">
        <table className="w-full text-left text-sm">
          <thead className="bg-navy-900/50 text-xs uppercase text-ink/50 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-semibold">ID</th>
              <th className="px-6 py-4 font-semibold">Property</th>
              <th className="px-6 py-4 font-semibold">Type</th>
              <th className="px-6 py-4 font-semibold">Price</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {properties.map((prop) => (
              <tr key={prop.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-medium text-cream">{prop.id}</td>
                <td className="px-6 py-4">
                  <div className="font-semibold text-cream">{prop.title}</div>
                  <div className="text-xs text-ink/60 flex items-center gap-1 mt-0.5">
                    <Building2 className="h-3 w-3" /> {prop.location}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${prop.type === 'Sale' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : 'text-blue-400 bg-blue-400/10 border-blue-400/20'}`}>
                    {prop.type}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-gold-400">{prop.price}</td>
                <td className="px-6 py-4 text-ink/60">{prop.status}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    {prop.status === 'Pending Review' && (
                       <>
                         <button className="text-emerald-400 hover:bg-emerald-400/10 p-2 rounded-lg transition-colors"><CheckCircle className="h-4 w-4" /></button>
                         <button className="text-rose-400 hover:bg-rose-400/10 p-2 rounded-lg transition-colors"><XCircle className="h-4 w-4" /></button>
                       </>
                    )}
                    <button className="text-ink/40 hover:text-cream hover:bg-white/10 p-2 rounded-lg transition-colors">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
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

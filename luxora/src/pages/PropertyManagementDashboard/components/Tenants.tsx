import { Users, Search, Download, Plus, MessageSquare } from 'lucide-react';
import { GoldButton, GhostButton } from '../../../components/ui/ui';

export default function Tenants() {
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

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input 
            type="text" 
            placeholder="Search by name, property, or phone..." 
            className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-2 pl-9 pr-4 text-sm text-cream placeholder:text-ink/40 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50"
          />
        </div>
        <GhostButton className="px-4"><Download className="h-4 w-4 mr-2" /> Export</GhostButton>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-navy-800/50">
        <table className="w-full text-left text-sm">
          <thead className="bg-navy-900/50 text-xs uppercase text-ink/50 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-semibold">Tenant Name</th>
              <th className="px-6 py-4 font-semibold">Property & Unit</th>
              <th className="px-6 py-4 font-semibold">Contact</th>
              <th className="px-6 py-4 font-semibold">Lease End</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {tenants.map((tnt) => (
              <tr key={tnt.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-semibold text-cream flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gold-400/10 flex items-center justify-center text-gold-400 shrink-0">
                    <Users className="h-4 w-4" />
                  </div>
                  {tnt.name}
                </td>
                <td className="px-6 py-4 text-ink/60">
                  <div className="font-medium text-cream">{tnt.property}</div>
                  <div className="text-xs">{tnt.unit}</div>
                </td>
                <td className="px-6 py-4 text-ink/60">{tnt.phone}</td>
                <td className="px-6 py-4 text-ink/60">{tnt.leaseEnds}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${tnt.status === 'Active' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'}`}>
                    {tnt.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-ink/40 hover:text-gold-400 transition-colors">
                    <MessageSquare className="h-4 w-4" />
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

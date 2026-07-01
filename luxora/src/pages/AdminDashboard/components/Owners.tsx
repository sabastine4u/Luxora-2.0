import { Search, Filter, MoreHorizontal, UserCheck, ShieldAlert } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';

const mockOwners = [
  { id: 'OWN-901', name: 'Aliko Dangote', email: 'aliko@example.com', properties: 12, joined: 'Jan 2024', status: 'Active' },
  { id: 'OWN-902', name: 'Tony Elumelu', email: 'tony@example.com', properties: 8, joined: 'Mar 2024', status: 'Active' },
  { id: 'OWN-903', name: 'Folorunso Alakija', email: 'f.alakija@example.com', properties: 5, joined: 'Jun 2024', status: 'Suspended' },
  { id: 'OWN-904', name: 'Femi Otedola', email: 'femi@example.com', properties: 3, joined: 'Aug 2024', status: 'Active' },
];

export default function Owners() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Property Owners</h2>
          <p className="text-sm text-ink/60">Manage landlord and property owner accounts.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
            <input 
              type="text" 
              placeholder="Search owners..." 
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
              <th className="px-6 py-4 font-semibold">Owner ID</th>
              <th className="px-6 py-4 font-semibold">Name / Email</th>
              <th className="px-6 py-4 font-semibold">Properties</th>
              <th className="px-6 py-4 font-semibold">Joined Date</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {mockOwners.map((owner) => (
              <tr key={owner.id} className="transition-colors hover:bg-white/[0.02]">
                <td className="px-6 py-4 font-medium text-cream">{owner.id}</td>
                <td className="px-6 py-4">
                  <div className="font-semibold text-cream">{owner.name}</div>
                  <div className="text-xs text-ink/50">{owner.email}</div>
                </td>
                <td className="px-6 py-4 font-semibold text-gold-400">{owner.properties}</td>
                <td className="px-6 py-4 text-ink/60">{owner.joined}</td>
                <td className="px-6 py-4">
                  {owner.status === 'Active' ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 text-[10px] font-semibold text-emerald-400 uppercase">
                      <UserCheck className="h-3 w-3" /> Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-400/10 border border-rose-400/20 px-2.5 py-1 text-[10px] font-semibold text-rose-400 uppercase">
                      <ShieldAlert className="h-3 w-3" /> Suspended
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="rounded-lg p-2 text-ink/40 hover:bg-white/10 hover:text-cream transition-colors">
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

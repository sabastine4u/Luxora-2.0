import { FileText, Search, Clock, AlertTriangle } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';

export default function LeaseTracking() {
  const leases = [
    { id: 'LSE-001', tenant: 'Dr. Ayo Balogun', property: 'Victoria Island Villa', start: 'Jan 01, 2025', end: 'Dec 31, 2026', status: 'Active' },
    { id: 'LSE-002', tenant: 'Sarah Jenkins', property: 'Lekki Studio Apt', start: 'Dec 01, 2024', end: 'Nov 30, 2025', status: 'Expiring Soon' },
    { id: 'LSE-003', tenant: 'TechFlow Ltd', property: 'Abuja Central Office', start: 'Feb 01, 2023', end: 'Jan 31, 2028', status: 'Active' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Lease Renewals & Tracking</h2>
          <p className="text-sm text-ink/60">Monitor upcoming lease expirations to minimize vacancy periods.</p>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input 
            type="text" 
            placeholder="Search leases..." 
            className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-2 pl-9 pr-4 text-sm text-cream placeholder:text-ink/40 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50"
          />
        </div>
        <GhostButton className="px-4"><Clock className="h-4 w-4 mr-2" /> Send Renewal Offer</GhostButton>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-navy-800/50">
        <table className="w-full text-left text-sm">
          <thead className="bg-navy-900/50 text-xs uppercase text-ink/50 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-semibold">Lease ID</th>
              <th className="px-6 py-4 font-semibold">Tenant Name</th>
              <th className="px-6 py-4 font-semibold">Property</th>
              <th className="px-6 py-4 font-semibold">Start Date</th>
              <th className="px-6 py-4 font-semibold">End Date</th>
              <th className="px-6 py-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {leases.map((lease) => (
              <tr key={lease.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-medium text-cream">{lease.id}</td>
                <td className="px-6 py-4 font-semibold text-cream flex items-center gap-2">
                  <FileText className="h-4 w-4 text-ink/40" /> {lease.tenant}
                </td>
                <td className="px-6 py-4 text-ink/60">{lease.property}</td>
                <td className="px-6 py-4 text-ink/60">{lease.start}</td>
                <td className="px-6 py-4 text-ink/60 font-medium">{lease.end}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${lease.status === 'Active' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'}`}>
                    {lease.status === 'Expiring Soon' && <AlertTriangle className="h-3 w-3 mr-1" />}
                    {lease.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

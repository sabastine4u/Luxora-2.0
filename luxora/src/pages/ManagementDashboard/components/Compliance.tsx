import { ShieldCheck, Search, Filter, CheckCircle, XCircle } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';

export default function Compliance() {
  const kycRequests = [
    { id: 'KYC-501', user: 'James O.', type: 'Owner KYC', status: 'Pending Review', submitted: '2 hours ago' },
    { id: 'KYC-502', user: 'Atlas Realty', type: 'Agency Reg', status: 'Requires Info', submitted: '5 hours ago' },
    { id: 'KYC-503', user: 'Bisi W.', type: 'Agent KYC', status: 'Pending Review', submitted: '1 day ago' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Compliance & KYC</h2>
          <p className="text-sm text-ink/60">Review identity verification and regulatory compliance documents.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
            <input 
              type="text" 
              placeholder="Search ID..." 
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
              <th className="px-6 py-4 font-semibold">ID</th>
              <th className="px-6 py-4 font-semibold">User/Entity</th>
              <th className="px-6 py-4 font-semibold">Type</th>
              <th className="px-6 py-4 font-semibold">Submitted</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {kycRequests.map((req) => (
              <tr key={req.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-medium text-cream">{req.id}</td>
                <td className="px-6 py-4 font-semibold text-cream flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-ink/40" /> {req.user}
                </td>
                <td className="px-6 py-4 text-ink/60">{req.type}</td>
                <td className="px-6 py-4 text-ink/60">{req.submitted}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${req.status === 'Pending Review' ? 'text-gold-400 bg-gold-400/10 border-gold-400/20' : 'text-blue-400 bg-blue-400/10 border-blue-400/20'}`}>
                    {req.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                   <div className="flex justify-end gap-2">
                     <button className="text-emerald-400 hover:bg-emerald-400/10 p-2 rounded-lg transition-colors"><CheckCircle className="h-4 w-4" /></button>
                     <button className="text-rose-400 hover:bg-rose-400/10 p-2 rounded-lg transition-colors"><XCircle className="h-4 w-4" /></button>
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

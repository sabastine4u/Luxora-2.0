import { CheckCircle, XCircle, Search, Filter, ShieldCheck, Eye } from 'lucide-react';
import { GoldButton, GhostButton } from '../../../components/ui/ui';

const mockQueue = [
  { id: 'VQ-104', type: 'Property', title: 'Skyline Penthouse', submitter: 'Bisi Williams (Owner)', date: '2 hours ago', status: 'Pending Review' },
  { id: 'VQ-103', type: 'Agent KYC', title: 'Identity Verification', submitter: 'Chidi Okafor (Agent)', date: '5 hours ago', status: 'Pending Review' },
  { id: 'VQ-102', type: 'Agency', title: 'Business Registration', submitter: 'Meridian Luxury', date: '1 day ago', status: 'Requires Info' },
  { id: 'VQ-101', type: 'Property', title: 'Banana Island Plot', submitter: 'Anonymous', date: '2 days ago', status: 'Pending Review' },
];

export default function VerificationQueue() {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Property': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'Agent KYC': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'Agency': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      default: return 'text-ink/60 bg-white/5 border-white/10';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Verification Queue</h2>
          <p className="text-sm text-ink/60">Review and moderate pending listings and KYC submissions.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
            <input 
              type="text" 
              placeholder="Search queue..." 
              className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-2 pl-9 pr-4 text-sm text-cream placeholder:text-ink/40 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50"
            />
          </div>
          <GhostButton className="px-3"><Filter className="h-4 w-4" /></GhostButton>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
          <div className="flex items-center gap-2 text-rose-400">
            <ShieldCheck className="h-5 w-5" />
            <div className="text-3xl font-bold">42</div>
          </div>
          <div className="text-sm text-ink/60 mt-1">Pending Properties</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
          <div className="text-3xl font-bold text-blue-400">18</div>
          <div className="text-sm text-ink/60 mt-1">Pending KYC</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
          <div className="text-3xl font-bold text-purple-400">5</div>
          <div className="text-sm text-ink/60 mt-1">Pending Agencies</div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-navy-800/50">
        <table className="w-full text-left text-sm">
          <thead className="bg-navy-900/50 text-xs uppercase text-ink/50 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-semibold">ID</th>
              <th className="px-6 py-4 font-semibold">Type</th>
              <th className="px-6 py-4 font-semibold">Submission</th>
              <th className="px-6 py-4 font-semibold">Submitted By</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {mockQueue.map((item) => (
              <tr key={item.id} className="transition-colors hover:bg-white/[0.02]">
                <td className="px-6 py-4 font-medium text-cream">{item.id}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${getTypeColor(item.type)}`}>
                    {item.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="font-semibold text-cream">{item.title}</div>
                  <div className="text-xs text-ink/50">{item.date}</div>
                </td>
                <td className="px-6 py-4 text-ink/60">{item.submitter}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="rounded-lg p-2 text-ink/40 hover:bg-emerald-400/10 hover:text-emerald-400 transition-colors" title="Approve">
                      <CheckCircle className="h-5 w-5" />
                    </button>
                    <button className="rounded-lg p-2 text-ink/40 hover:bg-rose-400/10 hover:text-rose-400 transition-colors" title="Reject">
                      <XCircle className="h-5 w-5" />
                    </button>
                    <GoldButton size="sm" className="ml-2 flex items-center gap-2">
                      <Eye className="h-4 w-4" /> Review
                    </GoldButton>
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

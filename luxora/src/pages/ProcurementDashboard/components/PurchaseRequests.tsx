import { FileCheck, Search, Filter, CheckCircle, XCircle } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';

export default function PurchaseRequests() {
  const requests = [
    { id: 'PR-1023', department: 'IT Operations', item: 'MacBook Pro M3 (x3)', amount: '₦5,400,000', status: 'Pending Approval', date: 'Oct 02, 2025' },
    { id: 'PR-1024', department: 'Marketing', item: 'Event Booth Setup', amount: '₦1,200,000', status: 'Approved', date: 'Oct 01, 2025' },
    { id: 'PR-1025', department: 'HR', item: 'Ergonomic Chairs (x10)', amount: '₦850,000', status: 'Rejected', date: 'Sep 28, 2025' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Purchase Requests (PR)</h2>
          <p className="text-sm text-ink/60">Review and approve internal departmental requests.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
            <input 
              type="text" 
              placeholder="Search PRs..." 
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
              <th className="px-6 py-4 font-semibold">PR ID</th>
              <th className="px-6 py-4 font-semibold">Department</th>
              <th className="px-6 py-4 font-semibold">Requested Item</th>
              <th className="px-6 py-4 font-semibold">Est. Amount</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {requests.map((pr) => (
              <tr key={pr.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-medium text-cream">{pr.id}</td>
                <td className="px-6 py-4 text-ink/60">{pr.department}</td>
                <td className="px-6 py-4 font-semibold text-cream flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-ink/40" /> {pr.item}
                </td>
                <td className="px-6 py-4 font-bold text-gold-400">{pr.amount}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${pr.status === 'Approved' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : pr.status === 'Pending Approval' ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' : 'text-rose-400 bg-rose-400/10 border-rose-400/20'}`}>
                    {pr.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                   {pr.status === 'Pending Approval' ? (
                     <div className="flex justify-end gap-2">
                       <button className="text-emerald-400 hover:bg-emerald-400/10 p-2 rounded-lg transition-colors"><CheckCircle className="h-4 w-4" /></button>
                       <button className="text-rose-400 hover:bg-rose-400/10 p-2 rounded-lg transition-colors"><XCircle className="h-4 w-4" /></button>
                     </div>
                   ) : (
                     <button className="text-gold-400 hover:text-gold-300 font-medium text-xs transition-colors">View</button>
                   )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { MessageSquare, Plus, Clock } from 'lucide-react';
import { GoldButton } from '../../../components/ui/ui';

export default function RFQs() {
  const rfqs = [
    { id: 'RFQ-24-001', title: 'Office Furniture (Abuja)', deadline: 'Oct 20, 2025', quotes: 3, status: 'Open' },
    { id: 'RFQ-24-002', title: 'Cloud Hosting Services', deadline: 'Oct 15, 2025', quotes: 5, status: 'Evaluating' },
    { id: 'RFQ-24-003', title: 'Janitorial Services (HQ)', deadline: 'Sep 30, 2025', quotes: 2, status: 'Awarded' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Request for Quotes (RFQs)</h2>
          <p className="text-sm text-ink/60">Manage bidding processes and evaluate supplier quotes.</p>
        </div>
        <GoldButton className="flex items-center gap-2"><Plus className="h-4 w-4" /> Create RFQ</GoldButton>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-navy-800/50">
        <table className="w-full text-left text-sm">
          <thead className="bg-navy-900/50 text-xs uppercase text-ink/50 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-semibold">RFQ ID</th>
              <th className="px-6 py-4 font-semibold">Title</th>
              <th className="px-6 py-4 font-semibold">Deadline</th>
              <th className="px-6 py-4 font-semibold">Quotes Received</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rfqs.map((rfq) => (
              <tr key={rfq.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-medium text-cream">{rfq.id}</td>
                <td className="px-6 py-4 font-semibold text-cream flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-ink/40" /> {rfq.title}
                </td>
                <td className="px-6 py-4 text-ink/60 flex items-center gap-1"><Clock className="h-3 w-3" /> {rfq.deadline}</td>
                <td className="px-6 py-4 font-bold text-blue-400">{rfq.quotes}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${rfq.status === 'Open' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : rfq.status === 'Evaluating' ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' : 'text-blue-400 bg-blue-400/10 border-blue-400/20'}`}>
                    {rfq.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                   <button className="text-gold-400 hover:text-gold-300 font-medium text-xs transition-colors">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

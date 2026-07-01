import { Banknote, Search, Download } from 'lucide-react';
import { GhostButton, GoldButton } from '../../../components/ui/ui';

export default function RentCollection() {
  const rents = [
    { id: 'RC-001', tenant: 'Dr. Ayo Balogun', property: 'Victoria Island Villa', amount: '₦12,500,000', due: 'Oct 01, 2025', status: 'Paid', date: 'Sep 28, 2025' },
    { id: 'RC-002', tenant: 'Sarah Jenkins', property: 'Lekki Studio Apt', amount: '₦3,500,000', due: 'Oct 01, 2025', status: 'Overdue', date: '-' },
    { id: 'RC-003', tenant: 'TechFlow Ltd', property: 'Abuja Central Office', amount: '₦45,000,000', due: 'Nov 01, 2025', status: 'Pending', date: '-' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Rent Collection</h2>
          <p className="text-sm text-ink/60">Track payments, overdue rent, and upcoming dues.</p>
        </div>
        <GoldButton>Send Reminders</GoldButton>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
           <div className="text-sm text-ink/60 mb-1">Total Collected (This Month)</div>
           <div className="font-heading text-3xl font-bold text-emerald-400">₦62.4M</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
           <div className="text-sm text-ink/60 mb-1">Outstanding / Overdue</div>
           <div className="font-heading text-3xl font-bold text-rose-400">₦8.5M</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
           <div className="text-sm text-ink/60 mb-1">Upcoming (Next 30 Days)</div>
           <div className="font-heading text-3xl font-bold text-cream">₦145.0M</div>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input 
            type="text" 
            placeholder="Search by tenant or property..." 
            className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-2 pl-9 pr-4 text-sm text-cream placeholder:text-ink/40 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50"
          />
        </div>
        <GhostButton className="px-4"><Download className="h-4 w-4 mr-2" /> Export Report</GhostButton>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-navy-800/50">
        <table className="w-full text-left text-sm">
          <thead className="bg-navy-900/50 text-xs uppercase text-ink/50 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-semibold">Tenant Name</th>
              <th className="px-6 py-4 font-semibold">Property</th>
              <th className="px-6 py-4 font-semibold">Amount Due</th>
              <th className="px-6 py-4 font-semibold">Due Date</th>
              <th className="px-6 py-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rents.map((rent) => (
              <tr key={rent.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-semibold text-cream flex items-center gap-2">
                  <Banknote className="h-4 w-4 text-ink/40" /> {rent.tenant}
                </td>
                <td className="px-6 py-4 text-ink/60">{rent.property}</td>
                <td className="px-6 py-4 font-bold text-gold-400">{rent.amount}</td>
                <td className="px-6 py-4 text-ink/60">{rent.due}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${rent.status === 'Paid' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : rent.status === 'Overdue' ? 'text-rose-400 bg-rose-400/10 border-rose-400/20' : 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'}`}>
                    {rent.status}
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

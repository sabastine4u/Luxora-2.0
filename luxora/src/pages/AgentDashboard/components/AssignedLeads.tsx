import { Phone, Mail, MoreHorizontal, UserCheck, Clock } from 'lucide-react';

const mockLeads = [
  { id: 'L-241', name: 'Bisi Williams', type: 'Buyer', property: 'Skyline Penthouse Residence', status: 'Hot', date: 'Today' },
  { id: 'L-240', name: 'Chidi Okafor', type: 'Renter', property: 'Marina View Apartment', status: 'Warm', date: 'Yesterday' },
  { id: 'L-239', name: 'Anonymous', type: 'Investor', property: 'Banana Island Plot', status: 'Cold', date: 'Oct 24' },
];

export default function AssignedLeads() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hot': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      case 'Warm': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Cold': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      default: return 'text-ink/60 bg-white/5 border-white/10';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Assigned Leads</h2>
          <p className="text-sm text-ink/60">Manage and follow up with your prospective clients.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-400/10 text-gold-400 mb-4">
            <UserCheck className="h-5 w-5" />
          </div>
          <div className="text-3xl font-bold text-cream">24</div>
          <div className="text-sm text-ink/60 mt-1">Active Leads</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-400/10 text-rose-400 mb-4">
            <Clock className="h-5 w-5" />
          </div>
          <div className="text-3xl font-bold text-cream">8</div>
          <div className="text-sm text-ink/60 mt-1">Require Follow-up</div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-navy-800/50">
        <table className="w-full text-left text-sm">
          <thead className="bg-navy-900/50 text-xs uppercase text-ink/50 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-semibold">Lead ID</th>
              <th className="px-6 py-4 font-semibold">Name / Type</th>
              <th className="px-6 py-4 font-semibold">Interested In</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Assigned</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {mockLeads.map((lead) => (
              <tr key={lead.id} className="transition-colors hover:bg-white/[0.02]">
                <td className="px-6 py-4 font-medium text-cream">{lead.id}</td>
                <td className="px-6 py-4">
                  <div className="font-semibold text-cream">{lead.name}</div>
                  <div className="text-[10px] text-ink/50">{lead.type}</div>
                </td>
                <td className="px-6 py-4 text-ink/60">{lead.property}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-ink/60">{lead.date}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="rounded-lg p-2 text-ink/40 hover:bg-gold-400/10 hover:text-gold-400 transition-colors"><Phone className="h-4 w-4" /></button>
                    <button className="rounded-lg p-2 text-ink/40 hover:bg-gold-400/10 hover:text-gold-400 transition-colors"><Mail className="h-4 w-4" /></button>
                    <button className="rounded-lg p-2 text-ink/40 hover:bg-white/10 hover:text-cream transition-colors"><MoreHorizontal className="h-4 w-4" /></button>
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

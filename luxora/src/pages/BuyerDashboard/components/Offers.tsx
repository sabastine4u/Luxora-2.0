import { FileCheck, CheckCircle2, Clock3, XCircle } from 'lucide-react';
import { GoldButton, GhostButton } from '../../../components/ui/ui';

const mockOffers = [
  { id: 'OFF-104', property: 'Marina View Apartment', amount: '₦180,000,000', listedPrice: '₦185,000,000', status: 'Accepted', date: 'Oct 24, 2025' },
  { id: 'OFF-103', property: 'Garden Court Villa', amount: '₦620,000,000', listedPrice: '₦680,000,000', status: 'Pending', date: 'Oct 22, 2025' },
  { id: 'OFF-102', property: 'Aurora Smart Studio', amount: '₦55,000,000', listedPrice: '₦62,000,000', status: 'Rejected', date: 'Oct 15, 2025' },
];

export default function Offers() {
  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'Accepted': return { color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20', icon: CheckCircle2 };
      case 'Pending': return { color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20', icon: Clock3 };
      case 'Rejected': return { color: 'text-rose-400', bg: 'bg-rose-400/10 border-rose-400/20', icon: XCircle };
      default: return { color: 'text-ink/60', bg: 'bg-white/5 border-white/10', icon: FileCheck };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">My Offers</h2>
          <p className="text-sm text-ink/60">Track the status of your property offers.</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-navy-800/50 text-xs uppercase text-ink/50">
            <tr>
              <th className="rounded-tl-2xl px-6 py-4 font-semibold">Offer ID</th>
              <th className="px-6 py-4 font-semibold">Property</th>
              <th className="px-6 py-4 font-semibold">Offer Amount</th>
              <th className="px-6 py-4 font-semibold">Listed Price</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="rounded-tr-2xl px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 bg-navy-800/30">
            {mockOffers.map((offer) => {
              const cfg = getStatusConfig(offer.status);
              return (
                <tr key={offer.id} className="transition-colors hover:bg-navy-800/50">
                  <td className="px-6 py-4 font-medium text-cream">{offer.id}</td>
                  <td className="px-6 py-4 font-medium text-cream">{offer.property}</td>
                  <td className="px-6 py-4 font-bold text-gold-400">{offer.amount}</td>
                  <td className="px-6 py-4 text-ink/60">{offer.listedPrice}</td>
                  <td className="px-6 py-4 text-ink/60">{offer.date}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
                      <cfg.icon className="h-3 w-3" /> {offer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {offer.status === 'Accepted' ? (
                      <GoldButton size="sm">Proceed</GoldButton>
                    ) : offer.status === 'Pending' ? (
                      <GhostButton size="sm">Edit</GhostButton>
                    ) : (
                      <GhostButton size="sm">View Reason</GhostButton>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

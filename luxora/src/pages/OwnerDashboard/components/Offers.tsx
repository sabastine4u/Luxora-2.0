import { FileCheck, CheckCircle2, Clock3, XCircle } from 'lucide-react';
import { GoldButton, GhostButton } from '../../../components/ui/ui';

const mockIncomingOffers = [
  { id: 'OFF-105', property: 'Skyline Penthouse Residence', buyer: 'Bisi Williams', amount: '₦410,000,000', listedPrice: '₦420,000,000', status: 'Pending Review', date: 'Today' },
  { id: 'OFF-104', property: 'Garden Court Villa', buyer: 'Chidi Okafor', amount: '₦680,000,000', listedPrice: '₦680,000,000', status: 'Accepted', date: 'Oct 24, 2025' },
  { id: 'OFF-102', property: 'Banana Island Plot', buyer: 'Anonymous', amount: '₦200,000,000', listedPrice: '₦250,000,000', status: 'Rejected', date: 'Oct 15, 2025' },
];

export default function Offers() {
  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'Accepted': return { color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20', icon: CheckCircle2 };
      case 'Pending Review': return { color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20', icon: Clock3 };
      case 'Rejected': return { color: 'text-rose-400', bg: 'bg-rose-400/10 border-rose-400/20', icon: XCircle };
      default: return { color: 'text-ink/60', bg: 'bg-white/5 border-white/10', icon: FileCheck };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Incoming Offers</h2>
          <p className="text-sm text-ink/60">Review offers made on your listed properties.</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-navy-800/50">
        <table className="w-full text-left text-sm">
          <thead className="bg-navy-900/50 text-xs uppercase text-ink/50 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-semibold">Offer ID</th>
              <th className="px-6 py-4 font-semibold">Property</th>
              <th className="px-6 py-4 font-semibold">Buyer</th>
              <th className="px-6 py-4 font-semibold">Offer Amount</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {mockIncomingOffers.map((offer) => {
              const cfg = getStatusConfig(offer.status);
              return (
                <tr key={offer.id} className="transition-colors hover:bg-white/[0.02]">
                  <td className="px-6 py-4 font-medium text-cream">{offer.id}</td>
                  <td className="px-6 py-4 font-medium text-cream">{offer.property}</td>
                  <td className="px-6 py-4 text-ink/60">{offer.buyer}</td>
                  <td className="px-6 py-4 font-bold text-gold-400">
                    {offer.amount}
                    <div className="text-[10px] text-ink/40 font-normal">Listed: {offer.listedPrice}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
                      <cfg.icon className="h-3 w-3" /> {offer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {offer.status === 'Pending Review' ? (
                      <>
                        <GhostButton size="sm" className="text-emerald-400 hover:text-emerald-300 hover:border-emerald-400/50">Accept</GhostButton>
                        <GhostButton size="sm" className="text-rose-400 hover:text-rose-300 hover:border-rose-400/50">Reject</GhostButton>
                      </>
                    ) : offer.status === 'Accepted' ? (
                      <GoldButton size="sm">View Contract</GoldButton>
                    ) : (
                      <span className="text-xs text-ink/40">Archived</span>
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

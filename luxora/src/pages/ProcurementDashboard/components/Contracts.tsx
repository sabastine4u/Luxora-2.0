import { Handshake, Calendar, FileText } from 'lucide-react';
import { GoldButton } from '../../../components/ui/ui';

export default function Contracts() {
  const contracts = [
    { id: 'CTR-001', vendor: 'Amazon Web Services', type: 'Software Subscription', value: '$12,000/yr', expiry: 'Jan 15, 2026', status: 'Active' },
    { id: 'CTR-002', vendor: 'Paystack', type: 'Payment Gateway SLA', value: '1.5% per tx', expiry: 'Auto-Renew', status: 'Active' },
    { id: 'CTR-003', vendor: 'Prime Cleaners Ltd', type: 'Facility Management', value: '₦400,000/mo', expiry: 'Nov 01, 2025', status: 'Expiring Soon' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Vendor Contracts & SLAs</h2>
          <p className="text-sm text-ink/60">Manage legal agreements, expirations, and renewals.</p>
        </div>
        <GoldButton>Upload Contract</GoldButton>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        {contracts.map((ctr) => (
          <div key={ctr.id} className={`rounded-2xl border ${ctr.status === 'Expiring Soon' ? 'border-rose-400/30 bg-rose-400/5' : 'border-white/10 bg-navy-800/50'} p-6`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-400/10 text-blue-400">
                <Handshake className="h-5 w-5" />
              </div>
              <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${ctr.status === 'Active' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : 'text-rose-400 bg-rose-400/10 border-rose-400/20'}`}>
                {ctr.status}
              </span>
            </div>
            <h3 className="font-heading text-lg font-semibold text-cream truncate">{ctr.vendor}</h3>
            <p className="text-sm text-ink/60 mb-4">{ctr.type}</p>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-ink/60">Contract Value</span>
                <span className="font-bold text-gold-400">{ctr.value}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-ink/60 flex items-center gap-1"><Calendar className="h-3 w-3" /> Expiry</span>
                <span className={ctr.status === 'Expiring Soon' ? 'text-rose-400 font-bold' : 'text-cream'}>{ctr.expiry}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
               <button className="text-xs font-semibold text-gold-400 hover:text-gold-300 flex items-center gap-1">
                 <FileText className="h-3.5 w-3.5" /> View Document
               </button>
               {ctr.status === 'Expiring Soon' && (
                 <button className="text-xs font-semibold text-cream bg-rose-500 hover:bg-rose-600 px-3 py-1.5 rounded-lg transition-colors">
                   Renew Now
                 </button>
               )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

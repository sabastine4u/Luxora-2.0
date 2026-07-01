import { Landmark, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';

export default function Finance() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Treasury & Finance</h2>
          <p className="text-sm text-ink/60">Manage corporate treasury, cash flow, and banking relationships.</p>
        </div>
        <GhostButton>Download General Ledger</GhostButton>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gold-400/10 text-gold-400">
            <Landmark className="h-6 w-6" />
          </div>
          <div className="text-sm text-ink/60 mb-1">Total Operating Capital</div>
          <div className="font-heading text-3xl font-bold text-cream">₦4.2B</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
            <ArrowUpRight className="h-6 w-6" />
          </div>
          <div className="text-sm text-ink/60 mb-1">Accounts Receivable (30 days)</div>
          <div className="font-heading text-3xl font-bold text-cream">₦850M</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-rose-400/10 text-rose-400">
            <ArrowDownRight className="h-6 w-6" />
          </div>
          <div className="text-sm text-ink/60 mb-1">Accounts Payable (30 days)</div>
          <div className="font-heading text-3xl font-bold text-cream">₦210M</div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-navy-800/50 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h3 className="font-heading text-lg font-semibold text-cream">Connected Bank Accounts</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 border border-white/10 rounded-xl bg-white/[0.02]">
            <div>
              <div className="font-semibold text-cream">Zenith Bank (Corporate Main)</div>
              <div className="text-sm text-ink/60">**** **** 1234</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-cream">₦3.8B</div>
              <div className="text-xs text-emerald-400">Primary Operating</div>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 border border-white/10 rounded-xl bg-white/[0.02]">
            <div>
              <div className="font-semibold text-cream">GTBank (Escrow)</div>
              <div className="text-sm text-ink/60">**** **** 5678</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-cream">₦400M</div>
              <div className="text-xs text-blue-400">Client Funds</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

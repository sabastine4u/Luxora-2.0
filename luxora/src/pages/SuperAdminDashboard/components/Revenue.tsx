import { Banknote, ArrowUpRight } from 'lucide-react';

export default function Revenue() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Platform Revenue</h2>
          <p className="text-sm text-ink/60">Detailed breakdown of income streams and subscription tiers.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 col-span-3 lg:col-span-1">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gold-400/10 text-gold-400">
            <Banknote className="h-6 w-6" />
          </div>
          <div className="text-sm text-ink/60 mb-1">Total Net Revenue (YTD)</div>
          <div className="font-heading text-4xl font-bold text-cream">₦12.4B</div>
          <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1"><ArrowUpRight className="h-3 w-3" /> +24% Year over Year</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 col-span-3 lg:col-span-2 space-y-4">
          <h3 className="font-heading text-lg font-semibold text-cream border-b border-white/10 pb-2">Revenue Streams</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-ink/60">Commission Fees (Property Sales & Rentals)</span>
                <span className="font-semibold text-cream">₦8.5B</span>
              </div>
              <div className="w-full bg-navy-900/50 rounded-full h-2">
                <div className="bg-gold-400 h-2 rounded-full" style={{ width: '68%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-ink/60">Agency Subscriptions (Premium/Enterprise)</span>
                <span className="font-semibold text-cream">₦2.1B</span>
              </div>
              <div className="w-full bg-navy-900/50 rounded-full h-2">
                <div className="bg-blue-400 h-2 rounded-full" style={{ width: '17%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-ink/60">Home Services Lead Generation</span>
                <span className="font-semibold text-cream">₦1.8B</span>
              </div>
              <div className="w-full bg-navy-900/50 rounded-full h-2">
                <div className="bg-purple-400 h-2 rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Wallet, CheckCircle2, ChevronRight, Percent } from 'lucide-react';
import { GoldButton } from '../../../components/ui/ui';
import MortgageSnapshot from './MortgageSnapshot';

export default function MortgageTracker() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-cream">Mortgage Tracker</h2>
        <p className="text-sm text-ink/60">Manage your financing and track application status.</p>
      </div>

      <MortgageSnapshot />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Active Application */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-heading text-lg font-semibold text-cream">Active Application</h3>
            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
              Approved
            </span>
          </div>

          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <div className="text-sm text-ink/60">Loan Amount</div>
              <div className="mt-1 font-heading text-xl font-bold text-cream">₦120,000,000</div>
            </div>
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <div className="text-sm text-ink/60">Interest Rate</div>
              <div className="mt-1 font-heading text-xl font-bold text-cream">14.5%</div>
            </div>
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <div className="text-sm text-ink/60">Duration</div>
              <div className="mt-1 font-heading text-xl font-bold text-cream">15 Years</div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/10" />
            <div className="space-y-6 relative">
              {[
                { label: 'Application Submitted', date: 'Oct 12, 2025', active: true },
                { label: 'Document Verification', date: 'Oct 15, 2025', active: true },
                { label: 'Credit Assessment', date: 'Oct 20, 2025', active: true },
                { label: 'Approval & Offer', date: 'Oct 25, 2025', active: true },
                { label: 'Disbursement', date: 'Pending', active: false },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-4 border-navy-800 ${step.active ? 'bg-gold-400' : 'bg-white/10'}`}>
                    {step.active && <CheckCircle2 className="h-4 w-4 text-navy-900" />}
                  </div>
                  <div>
                    <div className={`font-semibold ${step.active ? 'text-cream' : 'text-ink/40'}`}>{step.label}</div>
                    <div className="text-xs text-ink/50">{step.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tools & Resources */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <div className="mb-4 flex items-center gap-2">
              <Wallet className="h-5 w-5 text-gold-400" />
              <h3 className="font-heading text-base font-semibold text-cream">Quick Affordability</h3>
            </div>
            <p className="mb-4 text-sm text-ink/60">Calculate your estimated monthly payments based on current rates.</p>
            <GoldButton className="w-full justify-between">
              Calculator <ChevronRight className="h-4 w-4" />
            </GoldButton>
          </div>

          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <div className="mb-4 flex items-center gap-2">
              <Percent className="h-5 w-5 text-gold-400" />
              <h3 className="font-heading text-base font-semibold text-cream">Current Rates</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <span className="text-sm text-ink/60">Federal Mortgage</span>
                <span className="font-semibold text-emerald-400">9.5%</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <span className="text-sm text-ink/60">Commercial (Avg)</span>
                <span className="font-semibold text-emerald-400">14.5%</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

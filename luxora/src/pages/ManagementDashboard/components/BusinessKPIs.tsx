import { Activity, Server, Users, ArrowUpRight } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';

export default function BusinessKPIs() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Business KPIs</h2>
          <p className="text-sm text-ink/60">Top-level platform metrics and financial health.</p>
        </div>
        <GhostButton>Refresh Data</GhostButton>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gold-400/10 text-gold-400">
            <Activity className="h-6 w-6" />
          </div>
          <div className="text-sm text-ink/60 mb-1">Total Revenue</div>
          <div className="font-heading text-3xl font-bold text-cream">₦12.4B</div>
          <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1"><ArrowUpRight className="h-3 w-3" /> +24% YoY</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-400/10 text-blue-400">
            <Users className="h-6 w-6" />
          </div>
          <div className="text-sm text-ink/60 mb-1">Active Users</div>
          <div className="font-heading text-3xl font-bold text-cream">142.5K</div>
          <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1"><ArrowUpRight className="h-3 w-3" /> +12% MoM</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-400/10 text-purple-400">
            <Server className="h-6 w-6" />
          </div>
          <div className="text-sm text-ink/60 mb-1">System Uptime</div>
          <div className="font-heading text-3xl font-bold text-cream">99.99%</div>
          <div className="text-xs text-emerald-400 mt-2">All systems operational</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
            <ArrowUpRight className="h-6 w-6" />
          </div>
          <div className="text-sm text-ink/60 mb-1">Conversion Rate</div>
          <div className="font-heading text-3xl font-bold text-cream">3.2%</div>
          <div className="text-xs text-rose-400 mt-2 flex items-center gap-1">-0.1% MoM</div>
        </div>
      </div>
    </div>
  );
}

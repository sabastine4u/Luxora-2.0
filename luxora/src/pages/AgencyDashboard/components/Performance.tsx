import { TrendingUp, Target, Users, CheckCircle2 } from 'lucide-react';

export default function Performance() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-cream">Agency Performance</h2>
        <p className="text-sm text-ink/60">Firm-wide analytics and conversion metrics.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Firm Deals Closed', value: '312', delta: '+12%', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { label: 'Active Leads', value: '1,420', delta: '+8%', icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: 'Conversion Rate', value: '22.4%', delta: '+2.1%', icon: Target, color: 'text-gold-400', bg: 'bg-gold-400/10' },
          { label: 'Market Share', value: '14.2%', delta: '+0.5%', icon: TrendingUp, color: 'text-rose-400', bg: 'bg-rose-400/10' },
        ].map((stat, i) => (
          <div key={i} className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/5 bg-white/5">
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div className="flex items-end justify-between">
              <div className="font-heading text-2xl font-bold text-cream">{stat.value}</div>
              <span className={`text-xs font-semibold ${stat.color}`}>{stat.delta}</span>
            </div>
            <div className="mt-1 text-xs text-ink/50">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <h3 className="font-heading text-lg font-semibold text-cream mb-6">Deals Closed Over Time</h3>
          <div className="flex h-48 items-end gap-2">
            {[30, 45, 40, 60, 55, 75, 80, 70, 90, 85, 95, 100].map((h, i) => (
              <div key={i} className="group flex flex-1 flex-col items-center gap-2">
                <div className="relative w-full flex-1 flex items-end">
                  <div
                    className="w-full rounded-t bg-gradient-to-t from-emerald-600/40 to-emerald-400 transition-all duration-300 group-hover:from-emerald-500/60 group-hover:to-emerald-300"
                    style={{ height: `${h}%` }}
                  />
                </div>
                <span className="text-[10px] text-ink/40">M{i+1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <h3 className="font-heading text-lg font-semibold text-cream mb-6">Pipeline Breakdown</h3>
          <div className="space-y-6 mt-8">
            {[
              { stage: 'Leads', count: 1420, percent: 100 },
              { stage: 'Viewings', count: 850, percent: 60 },
              { stage: 'Offers', count: 410, percent: 29 },
              { stage: 'Closed', count: 312, percent: 22 },
            ].map((stage, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-cream">{stage.stage}</span>
                  <span className="text-ink/60">{stage.count} ({stage.percent}%)</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-navy-900/50">
                  <div 
                    className="h-full rounded-full bg-gold-400" 
                    style={{ width: `${stage.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

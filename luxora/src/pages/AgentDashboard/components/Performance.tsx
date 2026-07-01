import { TrendingUp, CheckCircle2, Wallet, Users } from 'lucide-react';

export default function Performance() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-cream">Performance Analytics</h2>
        <p className="text-sm text-ink/60">Track your deals, conversions, and commissions.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Deals Closed', value: '14', delta: '+2', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { label: 'Commission Earned', value: '₦12.4M', delta: '+15%', icon: Wallet, color: 'text-gold-400', bg: 'bg-gold-400/10' },
          { label: 'Active Leads', value: '24', delta: '-3', icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: 'Conversion Rate', value: '18.2%', delta: '+1.4%', icon: TrendingUp, color: 'text-rose-400', bg: 'bg-rose-400/10' },
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
          <h3 className="font-heading text-lg font-semibold text-cream mb-6">Commission Over Time</h3>
          <div className="flex h-48 items-end gap-2">
            {[40, 55, 45, 70, 60, 85, 95].map((h, i) => (
              <div key={i} className="group flex flex-1 flex-col items-center gap-2">
                <div className="relative w-full flex-1 flex items-end">
                  <div
                    className="w-full rounded-t bg-gradient-to-t from-gold-600/40 to-gold-400 transition-all duration-300 group-hover:from-gold-500/60 group-hover:to-gold-300"
                    style={{ height: `${h}%` }}
                  />
                </div>
                <span className="text-[10px] text-ink/40">M{i+1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <h3 className="font-heading text-lg font-semibold text-cream mb-6">Agency Leaderboard</h3>
          <div className="space-y-4">
            {[
              { name: 'Adaeze Okonkwo', deals: 42, score: '98%' },
              { name: 'You', deals: 14, score: '82%' },
              { name: 'Chioma Obi', deals: 12, score: '78%' },
            ].map((agent, i) => (
              <div key={i} className={`flex items-center justify-between rounded-xl border p-4 ${agent.name === 'You' ? 'border-gold-400/20 bg-gold-400/5' : 'border-white/5 bg-white/[0.02]'}`}>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-semibold text-sm truncate ${agent.name === 'You' ? 'text-gold-400' : 'text-cream'}`}>
                    {i + 1}. {agent.name}
                  </h4>
                  <div className="flex gap-4 mt-1 text-xs text-ink/60">
                    <span className="flex items-center gap-1">{agent.deals} Deals</span>
                    <span className="flex items-center gap-1">{agent.score} Score</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

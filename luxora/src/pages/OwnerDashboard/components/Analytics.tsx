import { Eye, Heart, MousePointerClick, TrendingUp } from 'lucide-react';

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-cream">Property Analytics</h2>
        <p className="text-sm text-ink/60">Insights into how your listings are performing.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Views', value: '14.2k', delta: '+12%', icon: Eye, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: 'Saves/Favorites', value: '1,420', delta: '+8%', icon: Heart, color: 'text-rose-400', bg: 'bg-rose-400/10' },
          { label: 'Inquiries', value: '84', delta: '+22%', icon: MousePointerClick, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { label: 'Conversion Rate', value: '3.2%', delta: '+0.4%', icon: TrendingUp, color: 'text-gold-400', bg: 'bg-gold-400/10' },
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
          <h3 className="font-heading text-lg font-semibold text-cream mb-6">Views Over Time</h3>
          <div className="flex h-48 items-end gap-2">
            {[40, 55, 45, 70, 60, 85, 95].map((h, i) => (
              <div key={i} className="group flex flex-1 flex-col items-center gap-2">
                <div className="relative w-full flex-1 flex items-end">
                  <div
                    className="w-full rounded-t bg-gradient-to-t from-blue-600/40 to-blue-400 transition-all duration-300 group-hover:from-blue-500/60 group-hover:to-blue-300"
                    style={{ height: `${h}%` }}
                  />
                </div>
                <span className="text-[10px] text-ink/40">Day {i+1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <h3 className="font-heading text-lg font-semibold text-cream mb-6">Top Performing Properties</h3>
          <div className="space-y-4">
            {[
              { name: 'Skyline Penthouse Residence', views: '8.4k', saves: '942' },
              { name: 'Garden Court Villa', views: '4.2k', saves: '318' },
              { name: 'Banana Island Plot', views: '1.6k', saves: '160' },
            ].map((prop, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-cream text-sm truncate">{prop.name}</h4>
                  <div className="flex gap-4 mt-1 text-xs text-ink/60">
                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {prop.views}</span>
                    <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> {prop.saves}</span>
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

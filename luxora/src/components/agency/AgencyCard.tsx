import { Star, TrendingUp } from 'lucide-react';
import type { Agency } from '../../data/luxoraData';

export interface AgencyCardProps {
  agency: Agency;
  index?: number;
}

export function AgencyCard({ agency: a, index: i }: AgencyCardProps) {
  return (
    <div className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-4 transition-all hover:border-gold-400/20 hover:bg-white/[0.06]">
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${a.color} text-xl font-bold text-white`}>
        {a.logo}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-heading text-sm font-semibold text-cream">{a.name}</span>
          {i === 0 && (
            <span className="rounded-full bg-gold-400/15 px-2 py-0.5 text-[10px] font-semibold text-gold-300">#1</span>
          )}
        </div>
        <div className="mt-0.5 flex items-center gap-3 text-xs text-ink/50">
          <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-gold-400 text-gold-400" /> {a.rating}</span>
          <span>{a.listings} listings</span>
          <span>{a.deals} deals</span>
        </div>
      </div>
      <TrendingUp className="h-4 w-4 text-emerald-400" />
    </div>
  );
}

import { Crown, Trophy, TrendingUp } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';

export default function AgencyRankings() {
  const rankings = [
    { rank: 1, name: 'Meridian Luxury', gmv: '₦8.4B', propertiesSold: 142, rating: 4.9 },
    { rank: 2, name: 'Eko Estates', gmv: '₦6.1B', propertiesSold: 98, rating: 4.8 },
    { rank: 3, name: 'Abuja Premier Properties', gmv: '₦4.2B', propertiesSold: 64, rating: 4.6 },
    { rank: 4, name: 'Victoria Island Realty', gmv: '₦3.8B', propertiesSold: 51, rating: 4.7 },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Agency Leaderboard</h2>
          <p className="text-sm text-ink/60">Top performing real estate agencies ranked by Gross Merchandise Value (YTD).</p>
        </div>
        <GhostButton>Download Rankings</GhostButton>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 overflow-x-auto rounded-2xl border border-white/10 bg-navy-800/50">
          <table className="w-full text-left text-sm">
            <thead className="bg-navy-900/50 text-xs uppercase text-ink/50 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-semibold">Rank</th>
                <th className="px-6 py-4 font-semibold">Agency</th>
                <th className="px-6 py-4 font-semibold">Total GMV (YTD)</th>
                <th className="px-6 py-4 font-semibold">Properties Sold</th>
                <th className="px-6 py-4 font-semibold">Avg Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rankings.map((agency) => (
                <tr key={agency.rank} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-medium text-cream">
                    {agency.rank === 1 ? <Crown className="h-5 w-5 text-gold-400" /> : 
                     agency.rank === 2 ? <Trophy className="h-5 w-5 text-gray-300" /> : 
                     agency.rank === 3 ? <Trophy className="h-5 w-5 text-amber-700" /> : 
                     `#${agency.rank}`}
                  </td>
                  <td className="px-6 py-4 font-semibold text-cream">{agency.name}</td>
                  <td className="px-6 py-4 font-bold text-gold-400">{agency.gmv}</td>
                  <td className="px-6 py-4 text-ink/60">{agency.propertiesSold}</td>
                  <td className="px-6 py-4 text-emerald-400 font-bold">{agency.rating} ★</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-gold-400/20 bg-gold-400/5 p-6 flex flex-col items-center justify-center text-center">
            <Crown className="h-12 w-12 text-gold-400 mb-4" />
            <div className="text-sm text-gold-400 font-semibold mb-1">Agency of the Year (Projected)</div>
            <div className="font-heading text-2xl font-bold text-cream">Meridian Luxury</div>
            <div className="text-sm text-ink/60 mt-2">Currently holding 34% market share among premium listings.</div>
          </div>
          
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-lg font-semibold text-cream mb-4 flex items-center gap-2"><TrendingUp className="h-5 w-5 text-emerald-400" /> Fastest Growing</h3>
            <div className="space-y-4">
              <div>
                <div className="font-semibold text-cream">Lekki Phase 1 Specialists</div>
                <div className="text-sm text-emerald-400">+124% GMV Growth (Q3)</div>
              </div>
              <div>
                <div className="font-semibold text-cream">Abuja Premier Properties</div>
                <div className="text-sm text-emerald-400">+88% GMV Growth (Q3)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

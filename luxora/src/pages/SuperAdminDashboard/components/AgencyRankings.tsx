import { useState } from 'react';
import { Crown, Trophy, TrendingUp, Search, Filter, ShieldCheck, MapPin, Target, AlertTriangle, Building2 } from 'lucide-react';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { SegmentedProgressBar } from '../../../components/dashboard/shared/widgets/SegmentedProgressBar';
import { GhostButton, GoldButton } from '../../../components/ui/ui';

export default function AgencyRankings() {
  const [activeRegion, setActiveRegion] = useState('National');

  const agencyDistribution = [
    { label: 'Lagos', value: 45, color: 'bg-emerald-400' },
    { label: 'Abuja', value: 30, color: 'bg-gold-400' },
    { label: 'Port Harcourt', value: 15, color: 'bg-blue-400' },
    { label: 'Other', value: 10, color: 'bg-purple-400' }
  ];

  const rankings = [
    { rank: 1, name: 'Meridian Luxury', region: 'Lagos', gmv: '₦8.4B', agents: 45, score: 98, status: 'Elite' },
    { rank: 2, name: 'Eko Estates', region: 'Lagos', gmv: '₦6.1B', agents: 32, score: 95, status: 'Elite' },
    { rank: 3, name: 'Abuja Premier', region: 'Abuja', gmv: '₦4.2B', agents: 28, score: 92, status: 'Premium' },
    { rank: 4, name: 'VI Realty', region: 'Lagos', gmv: '₦3.8B', agents: 18, score: 88, status: 'Premium' },
  ];

  return (
    <div className="space-y-6 pb-12">
      <DashboardHeader 
        name="Agency Intelligence" 
        subtitle="National agency rankings, revenue contribution, and partnership opportunities."
        actions={
          <div className="flex gap-3">
            <GhostButton className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> Compliance
            </GhostButton>
            <GoldButton className="flex items-center gap-2">
              <Target className="h-4 w-4" /> Opportunities
            </GoldButton>
          </div>
        }
      />

      <div className="grid md:grid-cols-3 gap-6">
        {/* Regional Agency Distribution / Revenue Contribution */}
        <div className="md:col-span-2 bg-gradient-to-br from-navy-800 to-navy-900 border border-white/10 rounded-2xl p-6 flex flex-col justify-center">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gold-400/20 rounded-xl">
                <Crown className="h-6 w-6 text-gold-400" />
              </div>
              <h3 className="font-heading text-xl font-bold text-cream">Agency Revenue Contribution</h3>
            </div>
            <select 
              value={activeRegion}
              onChange={(e) => setActiveRegion(e.target.value)}
              className="bg-navy-900/50 border border-white/10 text-xs text-cream rounded-lg px-2 py-1"
            >
              <option>National</option>
              <option>Lagos Region</option>
              <option>Abuja FCT</option>
            </select>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-navy-900/50 p-4 rounded-xl border border-white/5">
              <div className="text-sm text-ink/60 mb-1">Total Agencies</div>
              <div className="text-xl font-bold text-cream">412</div>
              <div className="text-xs text-emerald-400 mt-1">+12 This Month</div>
            </div>
            <div className="bg-navy-900/50 p-4 rounded-xl border border-white/5">
              <div className="text-sm text-ink/60 mb-1">Agency GMV</div>
              <div className="text-xl font-bold text-gold-400">₦28.5B</div>
              <div className="text-xs text-emerald-400 mt-1">YTD Contribution</div>
            </div>
            <div className="bg-navy-900/50 p-4 rounded-xl border border-white/5">
              <div className="text-sm text-ink/60 mb-1">Elite Tier</div>
              <div className="text-xl font-bold text-cream">14</div>
              <div className="text-xs text-gold-400 mt-1">Generate 45% of GMV</div>
            </div>
            <div className="bg-navy-900/50 p-4 rounded-xl border border-white/5">
              <div className="text-sm text-ink/60 mb-1">Avg Health Score</div>
              <div className="text-xl font-bold text-emerald-400">88/100</div>
              <div className="text-xs text-emerald-400 mt-1">Platform Average</div>
            </div>
          </div>
          <SegmentedProgressBar title="Regional Agency Distribution" segments={agencyDistribution} />
        </div>

        {/* Agency Growth Forecast / Alerts */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" /> Agency Growth & Alerts
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-emerald-400/10 border border-emerald-400/20 rounded-xl">
                <div className="text-sm font-semibold text-emerald-400 mb-1 flex items-center gap-2"><Trophy className="h-4 w-4" /> Growth Forecast</div>
                <div className="text-xs text-cream/90">Agency network projected to expand by 15% in Q4. Focus recruitment on Port Harcourt.</div>
              </div>
              <div className="p-4 bg-navy-900/50 border border-white/5 rounded-xl">
                <div className="text-sm font-semibold text-cream mb-2 flex items-center gap-2"><Target className="h-4 w-4 text-blue-400" /> Partnership Opportunity</div>
                <div className="text-xs text-ink/60 mb-2">3 premium agencies in Abuja are approaching Elite tier criteria.</div>
                <GhostButton className="w-full text-xs h-7">Review Profiles</GhostButton>
              </div>
              <div className="p-4 bg-rose-400/10 border border-rose-400/20 rounded-xl">
                <div className="text-sm font-semibold text-rose-400 mb-1 flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Underperforming Alerts</div>
                <div className="text-xs text-cream/90">2 agencies fell below the minimum compliance threshold this week.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* National Agency Rankings */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 overflow-hidden">
          <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
            <h3 className="font-heading text-lg font-semibold text-cream">National Agency Rankings</h3>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
                <input type="text" placeholder="Search agencies..." className="h-9 w-full sm:w-64 rounded-lg border border-white/10 bg-navy-900/50 pl-10 pr-4 text-sm text-cream focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400" />
              </div>
              <GhostButton className="h-9 w-9 p-0 flex items-center justify-center shrink-0"><Filter className="h-4 w-4" /></GhostButton>
            </div>
          </div>
          <DataTable
            data={rankings}
            keyExtractor={(agency) => agency.name}
            columns={[
              {
                header: "Rank",
                render: (agency) => (
                  <span className="font-medium text-cream flex items-center justify-center w-8">
                    {agency.rank === 1 ? <Crown className="h-5 w-5 text-gold-400" /> : 
                     agency.rank === 2 ? <Trophy className="h-5 w-5 text-gray-300" /> : 
                     agency.rank === 3 ? <Trophy className="h-5 w-5 text-amber-700" /> : 
                     `#${agency.rank}`}
                  </span>
                )
              },
              {
                header: "Agency Details",
                render: (agency) => (
                  <div>
                    <div className="font-semibold text-cream text-sm">{agency.name}</div>
                    <div className="text-xs text-ink/60 flex items-center gap-1 mt-0.5"><MapPin className="h-3 w-3" /> {agency.region}</div>
                  </div>
                )
              },
              {
                header: "Total GMV (YTD)",
                render: (agency) => <span className="font-bold text-gold-400 text-sm">{agency.gmv}</span>
              },
              {
                header: "Workforce",
                render: (agency) => <span className="text-cream text-sm flex items-center gap-1"><Building2 className="h-3 w-3 text-ink/40" /> {agency.agents} Agents</span>
              },
              {
                header: "Health Score",
                render: (agency) => (
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-400 text-sm">{agency.score}</span>
                    <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden hidden sm:block">
                      <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${agency.score}%` }}></div>
                    </div>
                  </div>
                )
              },
              {
                header: <div className="text-right">Status</div>,
                className: "text-right",
                render: (agency) => (
                  <span className={`px-2 py-1 rounded-full text-[10px] font-semibold uppercase ${agency.status === 'Elite' ? 'bg-gold-400/10 text-gold-400 border border-gold-400/20' : 'bg-blue-400/10 text-blue-400 border border-blue-400/20'}`}>
                    {agency.status}
                  </span>
                )
              }
            ]}
          />
        </div>
      </div>
    </div>
  );
}

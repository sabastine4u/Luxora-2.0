import { Heart, FileCheck, Eye, ArrowRight, Wallet } from 'lucide-react';
import { properties } from '../../../data/luxoraData';

export default function Overview({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const recentSaved = properties.slice(0, 2);

  return (
    <div className="space-y-6">
      
      {/* Welcome & Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Saved Properties', value: '3', icon: Heart, color: 'text-rose-400', bg: 'bg-rose-400/10' },
          { label: 'Pending Offers', value: '1', icon: FileCheck, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { label: 'Viewing Requests', value: '2', icon: Eye, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: 'Mortgage Status', value: 'Approved', icon: Wallet, color: 'text-gold-400', bg: 'bg-gold-400/10' },
        ].map((stat, i) => (
          <div key={i} className="rounded-2xl border border-white/10 bg-navy-800/50 p-5 transition-transform hover:-translate-y-1">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/5 bg-white/5">
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div className="font-heading text-2xl font-bold text-cream">{stat.value}</div>
            <div className="text-xs text-ink/50">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5 lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-heading text-base font-semibold text-cream">Recent Activity</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-400">
                <FileCheck className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-cream">Offer Accepted</div>
                <div className="text-xs text-ink/60">Your offer of ₦180M for Marina View Apartment was accepted.</div>
              </div>
              <div className="text-[10px] text-ink/40">2 hrs ago</div>
            </div>
            
            <div className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-400/10 text-blue-400">
                <Eye className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-cream">Viewing Confirmed</div>
                <div className="text-xs text-ink/60">Skyline Penthouse tour scheduled for Tomorrow, 10:00 AM.</div>
              </div>
              <div className="text-[10px] text-ink/40">5 hrs ago</div>
            </div>
          </div>
        </div>

        {/* Quick Saved Properties */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-heading text-base font-semibold text-cream">Saved Items</h3>
            <button 
              onClick={() => onNavigate('Saved Properties')}
              className="text-xs font-semibold text-gold-400 hover:text-gold-300"
            >
              View all
            </button>
          </div>
          <div className="space-y-3">
            {recentSaved.map((prop) => (
              <div key={prop.id} className="group flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-2 transition-colors hover:border-gold-400/30">
                <img src={prop.image} alt={prop.title} className="h-14 w-14 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-cream group-hover:text-gold-400 transition-colors">{prop.title}</div>
                  <div className="text-xs font-medium text-gold-300">{prop.price}</div>
                </div>
                <button className="pr-2 text-ink/40 transition-colors group-hover:text-cream">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

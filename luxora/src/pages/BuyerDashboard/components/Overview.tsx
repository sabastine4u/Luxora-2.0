import { Heart, FileCheck, Eye, MessageSquare, TrendingUp, MapPin, Calculator, Activity, Search } from 'lucide-react';
import { properties } from '../../../data/luxoraData';
import { useSession } from '../../../contexts/SessionContext';
import { useFavorites } from '../../../contexts/FavoriteContext';
import { PropertyCard } from '../../../components/property/PropertyCard';
import { EmptyState } from '../../../components/layout';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { calculateMortgage } from '../../../utils';

export default function Overview({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const { user, recentlyViewed } = useSession();
  const { favoriteProperties: savedProperties } = useFavorites();

  // 1. Greeting based on time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  // 3. Recently Viewed
  const recentProps = recentlyViewed
    .map(id => properties.find(p => p.id === id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined)
    .slice(0, 3); // Display up to 3 for better layout

  // 4. Recommended Properties
  const recommendedProps = properties.slice(0, 4);

  // 6. Mortgage Snapshot Mock
  const mockPrice = 150; // 150M
  const mockDown = 20;
  const mockMonths = 36;
  const { monthly } = calculateMortgage(mockPrice, mockDown, mockMonths);

  return (
    <div className="space-y-8 pb-12">
      
      {/* 1. Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-6 rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-8 backdrop-blur-md">
        {user?.avatar ? (
          <img src={user.avatar} alt={user.name} className="h-16 w-16 rounded-full border-2 border-gold-400/30 object-cover" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold-400/30 bg-navy-900 text-2xl font-bold text-gold-400">
            {user?.name?.charAt(0) || 'B'}
          </div>
        )}
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream sm:text-3xl">
            {greeting}, {user?.name || 'Buyer'}!
          </h2>
          <p className="mt-1 text-ink/70">
            Here's what's happening with your property search and applications today.
          </p>
        </div>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Saved Properties', value: savedProperties.length.toString(), icon: Heart, color: 'text-rose-400', bg: 'bg-rose-400/10' },
          { label: 'Active Viewing Requests', value: '2', icon: Eye, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: 'Pending Offers', value: '1', icon: FileCheck, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { label: 'Unread Messages', value: '3', icon: MessageSquare, color: 'text-gold-400', bg: 'bg-gold-400/10' },
        ].map((stat, i) => (
          <KPICard 
            key={i}
            title={stat.label}
            value={stat.value}
            icon={stat.icon}
            iconColor={stat.color}
            backgroundColor={stat.bg}
            hoverEffect="lift"
            iconBorder={true}
            valueTypography="heading"
            labelTypography="small"
          />
        ))}
      </div>

      {/* 3. Recently Viewed */}
      <div>
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-heading text-xl font-bold text-cream">Recently Viewed</h3>
          <button 
            onClick={() => onNavigate('Saved Properties')}
            className="text-xs font-semibold text-gold-400 hover:text-gold-300"
          >
            View all
          </button>
        </div>
        {recentProps.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recentProps.map(p => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-8">
            <EmptyState
              icon={<Search className="h-8 w-8 text-gold-400" />}
              title="No recent views"
              description="Properties you view will appear here for quick access."
              actionLabel="Explore Properties"
              onAction={() => window.location.href = '/properties'}
            />
          </div>
        )}
      </div>

      {/* 4. Recommended Properties */}
      <div>
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-heading text-xl font-bold text-cream">Recommended For You</h3>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {recommendedProps.map(p => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* 5. Market Insights */}
        <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 lg:col-span-2">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-400/10 text-purple-400">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h3 className="font-heading text-lg font-bold text-cream">Market Insights</h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-center">
              <div className="text-xs text-ink/50 mb-1">Avg Property Price</div>
              <div className="font-heading text-xl font-bold text-cream">₦145M</div>
              <div className="text-[10px] text-emerald-400 mt-1">+2.4% this month</div>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-center">
              <div className="text-xs text-ink/50 mb-1">Trending Location</div>
              <div className="font-heading text-xl font-bold text-cream flex items-center justify-center gap-1">
                <MapPin className="h-4 w-4 text-gold-400" /> Ikoyi
              </div>
              <div className="text-[10px] text-ink/40 mt-1">High demand</div>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-center">
              <div className="text-xs text-ink/50 mb-1">Market Trend</div>
              <div className="font-heading text-xl font-bold text-emerald-400">Buyer's Market</div>
              <div className="text-[10px] text-ink/40 mt-1">Favorable negotiation</div>
            </div>
          </div>
        </div>

        {/* 6. Mortgage Snapshot */}
        <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-400/10 text-gold-400">
              <Calculator className="h-5 w-5" />
            </div>
            <h3 className="font-heading text-lg font-bold text-cream">Mortgage Snapshot</h3>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 flex justify-between items-center">
              <span className="text-sm text-ink/60">Target Budget</span>
              <span className="font-semibold text-cream">₦150M</span>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 flex justify-between items-center">
              <span className="text-sm text-ink/60">Down Payment (20%)</span>
              <span className="font-semibold text-cream">₦30M</span>
            </div>
            <div className="rounded-2xl border border-gold-400/20 bg-gold-400/5 p-4 flex justify-between items-center">
              <span className="text-sm font-medium text-gold-200">Est. Monthly</span>
              <span className="font-bold text-gold-400">₦{(monthly / 1_000_000).toFixed(2)}M</span>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Recent Activity Timeline */}
      <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
            <Activity className="h-5 w-5" />
          </div>
          <h3 className="font-heading text-lg font-bold text-cream">Recent Activity</h3>
        </div>
        <div className="space-y-6 pl-4 border-l-2 border-white/10 ml-4">
          
          <div className="relative">
            <div className="absolute -left-[25px] flex h-6 w-6 items-center justify-center rounded-full bg-navy-800 border-2 border-rose-400">
              <Heart className="h-3 w-3 text-rose-400" />
            </div>
            <div className="pl-4">
              <div className="text-sm font-semibold text-cream">Saved a property</div>
              <div className="text-xs text-ink/60 mt-1">You saved "Luxury Victoria Island Villa" to your favorites.</div>
              <div className="text-[10px] text-ink/40 mt-1">2 hours ago</div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-[25px] flex h-6 w-6 items-center justify-center rounded-full bg-navy-800 border-2 border-blue-400">
              <Eye className="h-3 w-3 text-blue-400" />
            </div>
            <div className="pl-4">
              <div className="text-sm font-semibold text-cream">Submitted viewing request</div>
              <div className="text-xs text-ink/60 mt-1">Viewing requested for "Lekki Phase 1 Modern Duplex" on Saturday at 2:00 PM.</div>
              <div className="text-[10px] text-ink/40 mt-1">Yesterday</div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-[25px] flex h-6 w-6 items-center justify-center rounded-full bg-navy-800 border-2 border-emerald-400">
              <FileCheck className="h-3 w-3 text-emerald-400" />
            </div>
            <div className="pl-4">
              <div className="text-sm font-semibold text-cream">Received offer update</div>
              <div className="text-xs text-ink/60 mt-1">The seller for "Ikoyi Waterfront Penthouse" responded to your offer.</div>
              <div className="text-[10px] text-ink/40 mt-1">2 days ago</div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-[25px] flex h-6 w-6 items-center justify-center rounded-full bg-navy-800 border-2 border-ink/40">
              <Search className="h-3 w-3 text-ink/40" />
            </div>
            <div className="pl-4">
              <div className="text-sm font-semibold text-cream">Viewed a property</div>
              <div className="text-xs text-ink/60 mt-1">You checked out "Banana Island Mansion".</div>
              <div className="text-[10px] text-ink/40 mt-1">3 days ago</div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

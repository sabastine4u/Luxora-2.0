import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Download, Home, Building2, Eye, Heart, TrendingUp, Filter, AlertCircle, Sparkles, CheckCircle2, Clock, Award, Share2, Megaphone, Target, Video } from 'lucide-react';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { StatusBadge } from '../../ManagementDashboard/components/shared/StatusBadge';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { ActivityTimeline } from '../../../components/dashboard/shared/timelines/ActivityTimeline';
import { ListingDetailModal } from './modals/ListingDetailModal';

import { ROUTES } from '../../../constants/routes';

export default function MyListings() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedListing, setSelectedListing] = useState<Record<string, unknown> | null>(null);
  const navigate = useNavigate();

  const listings = [
    { id: 'L-1001', property: 'Skyline Penthouse', location: 'Victoria Island', price: '₦850,000,000', status: 'Active', views: 1240, inquiries: 15, daysOnMarket: 12, qualityScore: 98 },
    { id: 'L-1002', property: 'Lekki Phase 1 Villa', location: 'Lekki', price: '₦450,000,000', status: 'Active', views: 850, inquiries: 8, daysOnMarket: 45, qualityScore: 75 },
    { id: 'L-1003', property: 'Banana Island Plot', location: 'Ikoyi', price: '₦1,200,000,000', status: 'Under Contract', views: 2100, inquiries: 42, daysOnMarket: 5, qualityScore: 100 },
    { id: 'L-1004', property: 'Maitama Mansion', location: 'Abuja', price: '₦950,000,000', status: 'Pending', views: 620, inquiries: 4, daysOnMarket: 85, qualityScore: 60 },
    { id: 'L-1005', property: 'Eko Atlantic Condo', location: 'Victoria Island', price: '₦250,000,000', status: 'Active', views: 340, inquiries: 2, daysOnMarket: 120, qualityScore: 45 },
  ];

  const filteredListings = listings.filter(l => 
    l.property.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewListing = (listing: Record<string, unknown>) => {
    setSelectedListing(listing);
  };

  const marketingSuggestions = [
    { text: 'Add Video Tour to Eko Atlantic Condo', icon: Video, color: 'text-rose-400', impact: 'High' },
    { text: 'Boost Maitama Mansion on Social Media', icon: Share2, color: 'text-blue-400', impact: 'Medium' },
    { text: 'Refresh photos for Lekki Phase 1 Villa', icon: Sparkles, color: 'text-gold-400', impact: 'High' },
  ];

  const optimizationChecklist = [
    { task: 'Professional Photography (15+)', completed: true },
    { task: 'Virtual Tour / 3D Walkthrough', completed: false },
    { task: 'Floor Plans Uploaded', completed: true },
    { task: 'SEO Optimized Description', completed: false },
  ];

  const expiringAlerts = [
    { property: 'Eko Atlantic Condo', reason: 'Listing Agreement expires in 14 days', urgency: 'High' },
    { property: 'Maitama Mansion', reason: 'Price reduction recommended (90+ DOM)', urgency: 'Medium' },
  ];

  const promotionCalendar = [
    { title: 'Instagram Reel Campaign', desc: 'Skyline Penthouse', time: 'Tomorrow', icon: Share2, color: 'text-rose-400' },
    { title: 'Email Newsletter Feature', desc: 'Banana Island Plot', time: 'Friday', icon: Megaphone, color: 'text-blue-400' },
  ];

  return (
    <div className="space-y-6 pb-12">
      <DashboardHeader
        name="Listing Workflow Intelligence"
        subtitle="Optimize your portfolio, track marketing performance, and automate listing workflows."
        actions={
          <div className="flex gap-3">
            <GhostButton className="flex items-center gap-2">
              <Download className="h-4 w-4" /> Export Report
            </GhostButton>
            <GoldButton onClick={() => navigate(ROUTES.CREATE_LISTING)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Listing
            </GoldButton>
          </div>
        }
      />

      {/* INTELLIGENCE HEADER */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="md:col-span-2 bg-gradient-to-br from-navy-800 to-navy-900 border border-white/10 rounded-2xl p-6 flex flex-col justify-center h-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-400/20 rounded-xl">
              <Megaphone className="h-6 w-6 text-blue-400" />
            </div>
            <h4 className="font-bold text-cream text-lg">Marketing Campaign Summary</h4>
          </div>
          <p className="text-sm text-ink/80 leading-relaxed mb-4">
            Your portfolio has generated <strong className="text-emerald-400">12,450 total views</strong> this week across all channels. 
            Overall content quality score is <strong className="text-gold-400">82/100</strong>. We recommend optimizing the Eko Atlantic listing to improve visibility.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
            <div>
              <div className="text-xs text-ink/60 mb-1">Total Reach</div>
              <div className="text-lg font-bold text-blue-400">24.5k</div>
            </div>
            <div>
              <div className="text-xs text-ink/60 mb-1">Inquiry Rate</div>
              <div className="text-lg font-bold text-emerald-400">3.8%</div>
            </div>
            <div>
              <div className="text-xs text-ink/60 mb-1">Avg Content Score</div>
              <div className="text-lg font-bold text-gold-400">82</div>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-1 rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col h-full justify-between">
          <div>
            <h3 className="text-sm font-semibold text-ink/60 mb-4 flex items-center gap-2">
              <Target className="h-4 w-4 text-emerald-400" /> Listing Workflow Status
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-cream font-medium">Ready to Publish</span>
                  <span className="text-blue-400">1</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400 w-[20%] rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-cream font-medium">Active Marketing</span>
                  <span className="text-emerald-400">3</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 w-[60%] rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-cream font-medium">Needs Optimization</span>
                  <span className="text-rose-400">1</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-400 w-[20%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-1 rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col h-full">
          <h3 className="text-sm font-semibold text-ink/60 mb-4 text-center">Listing Renewal Tracker</h3>
          <div className="flex-1 flex flex-col justify-center gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink/60">Auto-Renewing</span>
              <span className="text-sm font-medium text-emerald-400">60%</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1.5"><div className="bg-emerald-400 h-1.5 rounded-full w-[60%]"></div></div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink/60">Action Required</span>
              <span className="text-sm font-medium text-rose-400">20%</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1.5"><div className="bg-rose-400 h-1.5 rounded-full w-[20%]"></div></div>
          </div>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Properties"
          value="24"
          trend="+2 this month"
          trendColor="text-emerald-400"
          icon={Building2}
        />
        <KPICard
          title="Portfolio Value"
          value="₦8.4B"
          trend="Top 10% Agent"
          trendColor="text-gold-400"
          icon={TrendingUp}
        />
        <KPICard
          title="Avg Days on Market"
          value="42"
          trend="-5 days vs avg"
          trendColor="text-emerald-400"
          icon={Clock}
        />
        <KPICard
          title="Content Quality"
          value="82/100"
          trend="High Visibility"
          trendColor="text-blue-400"
          icon={Award}
        />
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Main Table Area */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <DataTableToolbar
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder="Search listings..."
            />
            <GhostButton className="hidden sm:flex items-center gap-2"><Filter className="h-4 w-4" /> Filter</GhostButton>
          </div>

          <DataTable keyExtractor={(item: Record<string, unknown>, index: number) => (item.id as string) || String(index)}
            columns={[
              {
                header: 'Property',
                render: (listing: Record<string, unknown>) => (
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-cream">
                      <Home className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-cream">{listing.property as string}</div>
                      <div className="text-xs text-ink/60">{listing.location as string}</div>
                    </div>
                  </div>
                )
              },
              {
                header: 'Price',
                render: (listing: Record<string, unknown>) => (
                  <div className="font-bold text-emerald-400">{listing.price as string}</div>
                )
              },
              {
                header: 'Visibility',
                render: (listing: Record<string, unknown>) => (
                  <div>
                    <div className="flex items-center gap-1.5 mb-1 text-sm text-cream">
                      <Eye className="h-3.5 w-3.5 text-blue-400" /> {listing.views as number}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-cream">
                      <Heart className="h-3.5 w-3.5 text-rose-400" /> {listing.inquiries as number}
                    </div>
                  </div>
                )
              },
              {
                header: 'Quality',
                render: (listing: Record<string, unknown>) => (
                  <div className="w-24">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-ink/60">Score</span>
                      <span className="text-cream">{listing.qualityScore as number}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div 
                        className={`h-full ${(listing.qualityScore as number) >= 90 ? 'bg-emerald-400' : (listing.qualityScore as number) >= 70 ? 'bg-gold-400' : 'bg-rose-400'}`}
                        style={{ width: `${listing.qualityScore}%` }}
                      />
                    </div>
                  </div>
                )
              },
              {
                header: 'Status / DOM',
                render: (listing: Record<string, unknown>) => (
                  <div>
                    <StatusBadge status={listing.status as string} />
                    <div className="text-xs text-ink/50 mt-1">{listing.daysOnMarket as number} DOM</div>
                  </div>
                )
              },
              {
                header: 'Actions',
                render: (listing: Record<string, unknown>) => (
                  <GhostButton 
                    onClick={() => handleViewListing(listing)}
                    className="h-8 px-3 text-xs"
                  >
                    View Details
                  </GhostButton>
                )
              }
            ]}
            data={filteredListings}
            onRowClick={(listing) => handleViewListing(listing)}
          />
        </div>

        {/* Intelligence Side Panel */}
        <div className="space-y-6 lg:col-span-1">
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-gold-400" /> Automated Marketing
            </h3>
            <div className="space-y-3">
              {marketingSuggestions.map((rec, idx) => (
                <div key={idx} className="flex gap-3 bg-navy-900/50 p-3 rounded-xl border border-white/5 cursor-pointer hover:bg-white/[0.02] transition-colors">
                  <div className="pt-0.5"><rec.icon className={`h-4 w-4 ${rec.color}`} /></div>
                  <div>
                    <div className="text-xs text-cream leading-relaxed">{rec.text}</div>
                    <div className={`text-[10px] mt-1 ${rec.impact === 'High' ? 'text-emerald-400' : 'text-blue-400'}`}>{rec.impact} Impact</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-rose-400" /> Expiring Alerts
            </h3>
            <div className="space-y-3">
              {expiringAlerts.map((alert, idx) => (
                <div key={idx} className={`p-3 rounded-xl border ${alert.urgency === 'High' ? 'bg-rose-500/10 border-rose-500/30' : 'bg-navy-900/50 border-white/5'}`}>
                  <div className="text-xs font-bold text-cream mb-1">{alert.property}</div>
                  <div className="text-[10px] text-ink/80">{alert.reason}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Optimization Checklist
            </h3>
            <div className="space-y-3">
              {optimizationChecklist.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <input type="checkbox" checked={item.completed} readOnly className="mt-0.5 accent-gold-400 bg-white/5 border-white/10" />
                  <span className={`text-xs ${item.completed ? 'text-ink/40 line-through' : 'text-cream'}`}>{item.task}</span>
                </div>
              ))}
            </div>
          </div>

          <ActivityTimeline
            title="Property Promotion Calendar"
            items={promotionCalendar}
          />
        </div>
      </div>

      <ListingDetailModal 
        isOpen={!!selectedListing} 
        onClose={() => setSelectedListing(null)} 
        listing={selectedListing} 
      />
    </div>
  );
}

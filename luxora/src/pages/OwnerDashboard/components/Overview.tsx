import { useState } from 'react';
import { Home, ShieldCheck, FileCheck, Wallet, TrendingUp, Eye, Heart, MessageSquare, Plus, CheckCircle2, ChevronRight, Calendar, Zap, FileText } from 'lucide-react';
import { useSession } from '../../../contexts/SessionContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../contexts/ToastContext';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { GoldButton, GhostButton, VerifyBadge } from '../../../components/ui/ui';
import PropertySubmissionModal from './modals/PropertySubmissionModal';

export default function Overview({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const { user } = useSession();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);

  // 1. Welcome Header
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-8 backdrop-blur-md">
        <div className="flex items-center gap-6">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="h-16 w-16 rounded-full border-2 border-gold-400/30 object-cover" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold-400/30 bg-navy-900 text-2xl font-bold text-gold-400">
              {user?.name?.charAt(0) || 'O'}
            </div>
          )}
          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-heading text-2xl font-bold text-cream sm:text-3xl">
                {greeting}, {user?.name || 'Owner'}!
              </h2>
              <VerifyBadge icon={<ShieldCheck className="h-3 w-3" />} label="Verified Owner" />
            </div>
            <p className="mt-1 text-ink/70">
              Here's a snapshot of your property portfolio and current listing requests.
            </p>
          </div>
        </div>
        
        {/* Quick Actions (part of header) */}
        <div className="flex gap-3 flex-wrap">
          <GoldButton size="sm" onClick={() => setIsSubmissionModalOpen(true)}><Plus className="h-4 w-4 mr-2"/> Submit Property</GoldButton>
          <GhostButton size="sm" onClick={() => onNavigate?.('Messages')}><MessageSquare className="h-4 w-4 mr-2"/> Messages</GhostButton>
        </div>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Active Listings', value: '4', icon: Home, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { label: 'Pending Verification', value: '1', icon: ShieldCheck, color: 'text-rose-400', bg: 'bg-rose-400/10' },
          { label: 'Active Offers', value: '3', icon: FileCheck, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: 'Monthly Rental Income', value: '₦4.2M', icon: Wallet, color: 'text-gold-400', bg: 'bg-gold-400/10' },
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

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 3. Property Performance */}
          <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-8 backdrop-blur-md">
            <h3 className="font-heading text-xl font-bold text-cream mb-6">Property Performance</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {[
                { label: 'Total Views', value: '12.4k', icon: Eye },
                { label: 'Saves', value: '342', icon: Heart },
                { label: 'Viewing Req.', value: '28', icon: Calendar },
                { label: 'Offers', value: '7', icon: FileText },
                { label: 'Conversion', value: '4.2%', icon: TrendingUp },
              ].map((perf, i) => (
                <div key={i} className="p-4 rounded-2xl bg-navy-900 border border-white/5 text-center flex flex-col items-center justify-center">
                  <perf.icon className="h-5 w-5 text-gold-400 mb-2" />
                  <div className="font-heading font-bold text-lg text-cream">{perf.value}</div>
                  <div className="text-[10px] uppercase tracking-wider text-ink/50 mt-1">{perf.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Recent Property Requests */}
          <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-8 backdrop-blur-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-heading text-xl font-bold text-cream">Recent Property Requests</h3>
              <GhostButton size="sm" onClick={() => onNavigate?.('My Property Requests')}>View All</GhostButton>
            </div>
            <div className="w-full">
              <DataTable
                data={[
                  { property: 'The Sapphire Residences', status: 'Under Review', statusBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20', date: 'Oct 12, 2025', agentName: 'James Okoro', agentImg: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop' },
                  { property: 'Oceanview Villa #4', status: 'Published', statusBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', date: 'Sep 28, 2025', agentName: 'Sarah Adeyemi', agentImg: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop' },
                ]}
                keyExtractor={(req) => req.property}
                columns={[
                  {
                    header: "Property Name",
                    render: (req) => <span className="font-medium text-cream">{req.property}</span>
                  },
                  {
                    header: "Status",
                    render: (req) => <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold border ${req.statusBg}`}>{req.status}</span>
                  },
                  {
                    header: "Date Submitted",
                    render: (req) => <span className="text-ink/70">{req.date}</span>
                  },
                  {
                    header: "Assigned Agent",
                    render: (req) => (
                      <div className="flex items-center gap-2">
                        <img src={req.agentImg} alt="Agent" className="h-6 w-6 rounded-full object-cover" />
                        <span className="text-ink/80">{req.agentName}</span>
                      </div>
                    )
                  }
                ]}
              />
            </div>
          </div>

          {/* 5. Listing Journey Snapshot */}
          <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-8 backdrop-blur-md">
            <h3 className="font-heading text-xl font-bold text-cream mb-6">Listing Journey Snapshot (Sapphire Residences)</h3>
            <div className="relative">
              <div className="absolute left-[15px] top-6 h-[80%] w-[2px] bg-white/5" />
              <div className="space-y-6">
                {[
                  { stage: 'Submitted', date: 'Oct 12, 2025', completed: true },
                  { stage: 'Documents Verified', date: 'Oct 14, 2025', completed: true },
                  { stage: 'Inspection Scheduled', date: 'Oct 16, 2025', completed: true },
                  { stage: 'Inspection Complete', date: 'Oct 17, 2025', completed: false, current: true },
                  { stage: 'Approved', date: 'Pending', completed: false },
                  { stage: 'Published', date: 'Pending', completed: false },
                ].map((s, i) => (
                  <div key={i} className="relative flex items-center gap-4">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 z-10 ${s.completed ? 'bg-emerald-500 border-emerald-500 text-white' : s.current ? 'bg-navy-800 border-gold-400 text-gold-400' : 'bg-navy-800 border-white/20 text-ink/30'}`}>
                      {s.completed ? <CheckCircle2 className="h-4 w-4" /> : <div className={`h-2 w-2 rounded-full ${s.current ? 'bg-gold-400' : 'bg-ink/30'}`} />}
                    </div>
                    <div>
                      <div className={`font-semibold ${s.completed || s.current ? 'text-cream' : 'text-ink/50'}`}>{s.stage}</div>
                      <div className="text-xs text-ink/50">{s.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-8 flex items-center gap-4 border-t border-white/5 pt-6">
              <div className="flex-1 h-2 bg-navy-900 rounded-full overflow-hidden">
                <div className="h-full bg-gold-400 w-[50%] rounded-full" />
              </div>
              <span className="text-sm font-bold text-gold-400">50% Complete</span>
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          
          {/* 6. Rental Income Snapshot */}
          <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 backdrop-blur-md">
            <h3 className="font-heading text-xl font-bold text-cream mb-6">Rental Income Snapshot</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-navy-900 border border-white/5">
                <div className="text-xs text-ink/50 mb-1">Monthly Earnings (Oct)</div>
                <div className="font-heading text-2xl font-bold text-emerald-400">₦4,250,000</div>
              </div>
              <div className="p-4 rounded-xl bg-navy-900 border border-white/5">
                <div className="text-xs text-ink/50 mb-1">Outstanding Rent</div>
                <div className="font-heading text-xl font-bold text-rose-400">₦850,000</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-navy-900 border border-white/5">
                  <div className="text-xs text-ink/50 mb-1">Occupancy</div>
                  <div className="font-heading text-lg font-bold text-cream">92%</div>
                </div>
                <div className="p-4 rounded-xl bg-navy-900 border border-white/5">
                  <div className="text-xs text-ink/50 mb-1">Proj. (Nov)</div>
                  <div className="font-heading text-lg font-bold text-cream">₦4.5M</div>
                </div>
              </div>
              <GhostButton size="sm" className="w-full mt-2" onClick={() => onNavigate?.('Rental Income')}>View Full Analytics</GhostButton>
            </div>
          </div>

          {/* 7. Recent Activity Timeline */}
          <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 backdrop-blur-md">
            <h3 className="font-heading text-xl font-bold text-cream mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { title: 'Listing Published', desc: 'Oceanview Villa #4', time: '2h ago', icon: Zap, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                { title: 'Viewing Scheduled', desc: 'James Okoro for Sapphire', time: '5h ago', icon: Calendar, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                { title: 'Offer Received', desc: '₦420M for Ikoyi Apartment', time: '1d ago', icon: FileCheck, color: 'text-gold-400', bg: 'bg-gold-400/10' },
                { title: 'Verification Updated', desc: 'Title deed approved', time: '2d ago', icon: ShieldCheck, color: 'text-cream', bg: 'bg-white/10' },
                { title: 'Property Submitted', desc: 'The Sapphire Residences', time: '3d ago', icon: Home, color: 'text-cream', bg: 'bg-white/10' },
              ].map((act, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className={`p-2 rounded-full border border-white/5 shrink-0 ${act.bg}`}>
                    <act.icon className={`h-4 w-4 ${act.color}`} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-cream">{act.title}</div>
                    <div className="text-xs text-ink/60">{act.desc}</div>
                  </div>
                  <div className="ml-auto text-[10px] text-ink/40 whitespace-nowrap">{act.time}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* 8. Quick Links Sidebar */}
          <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 backdrop-blur-md">
            <h3 className="font-heading text-xl font-bold text-cream mb-4">Quick Links</h3>
            <div className="space-y-2">
              <GhostButton className="w-full justify-between" onClick={() => onNavigate?.('My Property Requests')}>View Listings <ChevronRight className="h-4 w-4"/></GhostButton>
              <GhostButton className="w-full justify-between" onClick={() => onNavigate?.('Verification Progress')}>Track Verification <ChevronRight className="h-4 w-4"/></GhostButton>
              <GhostButton className="w-full justify-between" onClick={() => onNavigate?.('Offers')}>Manage Offers <ChevronRight className="h-4 w-4"/></GhostButton>
            </div>
          </div>
        </div>

      </div>

      <PropertySubmissionModal
        isOpen={isSubmissionModalOpen}
        onClose={() => setIsSubmissionModalOpen(false)}
        onSubmit={() => {
          setIsSubmissionModalOpen(false);
          showToast({ type: 'success', title: 'Property Submitted', description: 'Your property has been submitted for review.' });
          navigate('/owner-dashboard?tab=Listing+Journey');
        }}
      />
    </div>
  );
}

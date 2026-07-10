import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { ActivityTimeline } from '../../../components/dashboard/shared/timelines/ActivityTimeline';
import { SegmentedProgressBar } from '../../../components/dashboard/shared/widgets/SegmentedProgressBar';
import { AlertTriangle, FileText, UserCheck, CheckCircle, Activity, ShieldAlert, ChevronRight, Bell, Calendar as CalendarIcon, Key, Zap, TrendingUp } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';

export default function Overview() {
  const mockReports = [
    { title: 'Listing Dispute', desc: 'Skyline Penthouse', time: '1 hour ago', color: 'text-rose-400', icon: ShieldAlert },
    { title: 'Agent Conduct', desc: 'Reported by Anonymous', time: '1 day ago', color: 'text-yellow-400', icon: AlertTriangle },
    { title: 'Payment Issue', desc: 'Failed escrow transaction', time: '2 days ago', color: 'text-rose-400', icon: FileText },
  ];

  const pendingVerifications = [
    { id: 'VQ-104', title: 'Bisi Williams', type: 'Owner KYC', time: '2h ago' },
    { id: 'VQ-103', title: 'Meridian Luxury', type: 'Agency', time: '5h ago' },
    { id: 'VQ-102', title: 'Chidi Okafor', type: 'Agent KYC', time: '1d ago' },
  ];

  const pendingModerations = [
    { id: 'LST-801', title: 'Skyline Penthouse', location: 'Ikoyi, Lagos', time: '3h ago' },
    { id: 'LST-804', title: 'Lekki Phase 1 Duplex', location: 'Lekki', time: '4h ago' },
    { id: 'LST-805', title: 'Abuja Mansion', location: 'Maitama', time: '1d ago' },
  ];

  const announcements = [
    { id: 1, title: 'System Maintenance', desc: 'Scheduled downtime for db upgrade.', time: 'Tomorrow, 2:00 AM' },
    { id: 2, title: 'New Moderation Policy', desc: 'Update on property photo guidelines.', time: '2 days ago' },
  ];

  const upcomingTasks = [
    { id: 1, title: 'Review Flagged Listings', type: 'Moderation', due: 'Today' },
    { id: 2, title: 'Audit Agent KYC', type: 'Compliance', due: 'Tomorrow' },
  ];

  const recentLogins = [
    { id: 1, name: 'Admin Chidi', role: 'Super Admin', time: '10 mins ago', ip: '192.168.1.1' },
    { id: 2, name: 'Moderator Bisi', role: 'Moderator', time: '1 hour ago', ip: '10.0.0.5' },
  ];

  const operationalAlerts = [
    { id: 1, title: 'High Verification Queue', level: 'Warning', desc: '45 items pending review.', color: 'text-yellow-400' },
    { id: 2, title: 'API Latency', level: 'Critical', desc: 'Payment gateway response > 2s.', color: 'text-rose-400' },
  ];

  return (
    <div className="space-y-8 pb-12">
      <DashboardHeader 
        name="Admin Overview"
        subtitle="Manage users, listings, and platform health."
        actions={
          <>
            <button className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-cream hover:bg-white/10">Add Administrator</button>
            <button className="rounded-xl bg-gold-400 px-4 py-2 text-sm font-semibold text-navy-900 hover:bg-gold-300">Platform Settings</button>
          </>
        }
      />

      <div className="mb-2">
        <h2 className="text-sm font-semibold text-ink/50 uppercase tracking-wider">Today's Platform Snapshot</h2>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Listings Reviewed" value="142" icon={FileText} trend="+12% today" trendColor="text-emerald-400" iconColor="text-blue-400" />
        <KPICard title="Users Verified" value="89" icon={UserCheck} trend="+5% today" trendColor="text-emerald-400" iconColor="text-emerald-400" />
        <KPICard title="Reports Resolved" value="24" icon={CheckCircle} trend="-3% today" trendColor="text-rose-400" iconColor="text-purple-400" />
        <KPICard title="Platform Uptime" value="99.9%" icon={Activity} trend="Healthy" trendColor="text-emerald-400" iconColor="text-emerald-400" backgroundColor="bg-emerald-400/10" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col justify-center space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-gold-400" />
            <h3 className="font-heading text-lg font-bold text-cream">Weekly Moderation Trends</h3>
          </div>
          <SegmentedProgressBar
            segments={[
              { label: 'Approved', value: 450, color: 'bg-emerald-400' },
              { label: 'Rejected', value: 120, color: 'bg-rose-400' },
              { label: 'Pending Review', value: 85, color: 'bg-yellow-400' },
            ]}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <KPICard title="Queue Summary" value="42" icon={FileText} trend="Verification" trendColor="text-yellow-400" iconColor="text-yellow-400" />
          <KPICard title="Open Complaints" value="17" icon={ShieldAlert} trend="High Priority" trendColor="text-rose-400" iconColor="text-rose-400" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Pending Verification Widget */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
            <h3 className="font-heading text-lg font-bold text-cream">Pending Verification</h3>
            <GhostButton size="sm" className="px-2 py-1 text-xs text-gold-400">View All</GhostButton>
          </div>
          <div className="space-y-4 flex-1">
            {pendingVerifications.map((item) => (
              <div key={item.id} className="flex items-center justify-between group">
                <div>
                  <div className="text-sm font-semibold text-cream">{item.title}</div>
                  <div className="text-xs text-ink/50 mt-0.5">{item.type} • {item.time}</div>
                </div>
                <button className="h-6 w-6 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10">
                  <ChevronRight className="h-4 w-4 text-ink/40" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Moderation Widget */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
            <h3 className="font-heading text-lg font-bold text-cream">Pending Moderation</h3>
            <GhostButton size="sm" className="px-2 py-1 text-xs text-gold-400">View All</GhostButton>
          </div>
          <div className="space-y-4 flex-1">
            {pendingModerations.map((item) => (
              <div key={item.id} className="flex items-center justify-between group">
                <div>
                  <div className="text-sm font-semibold text-cream">{item.title}</div>
                  <div className="text-xs text-ink/50 mt-0.5">{item.location} • {item.time}</div>
                </div>
                <button className="h-6 w-6 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10">
                  <ChevronRight className="h-4 w-4 text-ink/40" />
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Recent Reports Widget */}
        <div className="space-y-6">
          <ActivityTimeline 
            title="Recent Reports" 
            items={mockReports} 
            showViewAll
          />

          {/* Quick Links */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-lg font-bold text-cream mb-4 border-b border-white/10 pb-4">Administrator Quick Links</h3>
            <div className="space-y-2">
              <GhostButton className="w-full justify-start">Add Administrator</GhostButton>
              <GhostButton className="w-full justify-start">Platform Settings</GhostButton>
              <GhostButton className="w-full justify-start">Verification Queue</GhostButton>
              <GhostButton className="w-full justify-start">Moderation Queue</GhostButton>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Platform Announcements */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-400" />
              <h3 className="font-heading text-lg font-bold text-cream">Announcements</h3>
            </div>
          </div>
          <div className="space-y-4">
            {announcements.map(item => (
              <div key={item.id}>
                <div className="text-sm font-semibold text-cream">{item.title}</div>
                <div className="text-xs text-ink/60 mt-1">{item.desc}</div>
                <div className="text-[10px] text-ink/40 mt-1">{item.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-emerald-400" />
              <h3 className="font-heading text-lg font-bold text-cream">Upcoming Tasks</h3>
            </div>
          </div>
          <div className="space-y-4">
            {upcomingTasks.map(item => (
              <div key={item.id} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-cream">{item.title}</div>
                  <div className="text-xs text-ink/50 mt-1">{item.type}</div>
                </div>
                <div className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">{item.due}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Logins */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-gold-400" />
              <h3 className="font-heading text-lg font-bold text-cream">Recent Logins</h3>
            </div>
          </div>
          <div className="space-y-4">
            {recentLogins.map(item => (
              <div key={item.id}>
                <div className="text-sm font-semibold text-cream flex justify-between">
                  {item.name} <span className="text-xs text-ink/40">{item.time}</span>
                </div>
                <div className="text-xs text-ink/60 mt-1">{item.role} • {item.ip}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Alerts */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-rose-400" />
              <h3 className="font-heading text-lg font-bold text-cream">Alerts</h3>
            </div>
          </div>
          <div className="space-y-4">
            {operationalAlerts.map(item => (
              <div key={item.id} className="flex gap-3">
                <div className={`mt-0.5 h-2 w-2 rounded-full ${item.color} shrink-0`} />
                <div>
                  <div className="text-sm font-semibold text-cream">{item.title}</div>
                  <div className="text-xs text-ink/60 mt-1">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

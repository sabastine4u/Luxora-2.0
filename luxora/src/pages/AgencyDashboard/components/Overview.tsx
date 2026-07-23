import { 
  Building2, Users, Target, UserCircle, 
  TrendingUp, CheckCircle2, AlertTriangle, FileText,
  Calendar, Star, DollarSign, Clock, Zap
} from 'lucide-react';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { ActivityTimeline } from '../../../components/dashboard/shared/timelines/ActivityTimeline';
import { GhostButton } from '../../../components/ui/ui';
import { SegmentedProgressBar } from '../../../components/dashboard/shared/widgets/SegmentedProgressBar';

import { useSession } from '../../../contexts/SessionContext';

export default function Overview({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const { user } = useSession();
  const upcomingMeetings = [
    { title: 'Client Meeting - Aliko Dangote', time: '10:00 AM', desc: 'Discussing Banana Island Plot', icon: Users, color: 'text-blue-400' },
    { title: 'Property Inspection', time: '1:00 PM', desc: 'The Continental Duplex with Inspector', icon: Building2, color: 'text-emerald-400' },
    { title: 'Agent Weekly Sync', time: '3:30 PM', desc: 'All Residential Agents', icon: Calendar, color: 'text-gold-400' },
  ];

  const recentActivity = [
    { title: 'Listing Approved', time: '1 hour ago', desc: 'The Continental Duplex is now live', icon: Building2, color: 'text-emerald-400' },
    { title: 'Offer Received', time: '3 hours ago', desc: '₦180M offer on Marina View Apartment', icon: DollarSign, color: 'text-gold-400' },
    { title: 'Viewing Completed', time: '5 hours ago', desc: 'Sarah James completed viewing for Lead #4022', icon: CheckCircle2, color: 'text-blue-400' },
  ];

  return (
    <div className="space-y-6">
      <DashboardHeader
        name={`Welcome back, ${user?.name || 'Marcus Sterling'}`}
        subtitle="Executive dashboard, daily briefing, and agency performance."
        actions={
          <div className="flex gap-3">
            <GhostButton className="flex items-center gap-2" onClick={() => onNavigate?.('Agents')}>
              <Users className="h-4 w-4" /> Manage Roster
            </GhostButton>
          </div>
        }
      />

      {/* Quick Action Center */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button onClick={() => onNavigate?.('Clients')} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-navy-800/50 hover:bg-gold-400/10 hover:border-gold-400/30 transition-all text-ink/80 hover:text-gold-400 text-sm font-medium">
          <UserCircle className="h-4 w-4" /> Add Client
        </button>
        <button onClick={() => onNavigate?.('Leads')} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-navy-800/50 hover:bg-gold-400/10 hover:border-gold-400/30 transition-all text-ink/80 hover:text-gold-400 text-sm font-medium">
          <Target className="h-4 w-4" /> Register Lead
        </button>
        <button onClick={() => onNavigate?.('Agents')} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-navy-800/50 hover:bg-gold-400/10 hover:border-gold-400/30 transition-all text-ink/80 hover:text-gold-400 text-sm font-medium">
          <Users className="h-4 w-4" /> Invite Agent
        </button>
        <button onClick={() => onNavigate?.('Performance')} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-navy-800/50 hover:bg-gold-400/10 hover:border-gold-400/30 transition-all text-ink/80 hover:text-gold-400 text-sm font-medium">
          <FileText className="h-4 w-4" /> Create Report
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          
          {/* Agency Daily Briefing & Business Health */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Daily Briefing */}
            <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col justify-between">
              <h3 className="font-heading text-lg font-semibold text-cream mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-gold-400" /> Daily Briefing
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-navy-900/50">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-4 w-4 text-rose-400" />
                    <span className="text-sm text-ink/80">Urgent Follow-ups</span>
                  </div>
                  <span className="text-sm font-bold text-rose-400">12</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-navy-900/50">
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm text-ink/80">Pending Approvals</span>
                  </div>
                  <span className="text-sm font-bold text-yellow-400">5</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-navy-900/50">
                  <div className="flex items-center gap-3">
                    <Target className="h-4 w-4 text-blue-400" />
                    <span className="text-sm text-ink/80">New Inquiries</span>
                  </div>
                  <span className="text-sm font-bold text-blue-400">24</span>
                </div>
              </div>
            </div>

            {/* Business Health Center */}
            <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
              <h3 className="font-heading text-lg font-semibold text-cream mb-4">Business Health</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-ink/60">Listing Health</span>
                    <span className="font-bold text-emerald-400">Excellent</span>
                  </div>
                  <div className="h-1.5 w-full bg-navy-950 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-emerald-400" style={{ width: '92%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-ink/60">Agent Capacity</span>
                    <span className="font-bold text-yellow-400">High Load</span>
                  </div>
                  <div className="h-1.5 w-full bg-navy-950 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-yellow-400" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-ink/60">Lead Conversion</span>
                    <span className="font-bold text-blue-400">Stable</span>
                  </div>
                  <div className="h-1.5 w-full bg-navy-950 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-blue-400" style={{ width: '65%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-ink/60">Revenue Target</span>
                    <span className="font-bold text-emerald-400">On Track</span>
                  </div>
                  <div className="h-1.5 w-full bg-navy-950 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-emerald-400" style={{ width: '78%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Business Highlights & Weekly Snapshot */}
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Business Highlights */}
            <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col justify-between">
              <h3 className="font-heading text-lg font-semibold text-cream mb-4 flex items-center gap-2">
                <Star className="h-5 w-5 text-gold-400" /> Highlights
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-navy-900/50 rounded-xl border border-white/5">
                  <div className="text-[10px] text-ink/60 uppercase font-bold mb-1">Top Agent</div>
                  <div className="text-sm font-bold text-cream truncate">Sarah James</div>
                </div>
                <div className="p-3 bg-navy-900/50 rounded-xl border border-white/5">
                  <div className="text-[10px] text-ink/60 uppercase font-bold mb-1">Top Deal</div>
                  <div className="text-sm font-bold text-emerald-400 truncate">₦1.2B</div>
                </div>
                <div className="p-3 bg-navy-900/50 rounded-xl border border-white/5">
                  <div className="text-[10px] text-ink/60 uppercase font-bold mb-1">Fastest Sale</div>
                  <div className="text-sm font-bold text-cream truncate">12 Days</div>
                </div>
                <div className="p-3 bg-navy-900/50 rounded-xl border border-white/5">
                  <div className="text-[10px] text-ink/60 uppercase font-bold mb-1">Client Sat.</div>
                  <div className="text-sm font-bold text-gold-400 truncate">4.9/5.0</div>
                </div>
              </div>
            </div>

            {/* Weekly Business Snapshot */}
            <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
              <h3 className="font-heading text-lg font-semibold text-cream mb-4">Weekly Snapshot</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-ink/80 flex items-center gap-2"><Building2 className="h-4 w-4" /> Listings Added</span>
                  <span className="font-bold text-cream">+5</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-ink/80 flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Deals Closed</span>
                  <span className="font-bold text-cream">3</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-ink/80 flex items-center gap-2"><DollarSign className="h-4 w-4" /> Revenue</span>
                  <span className="font-bold text-emerald-400">₦850M</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-ink/80 flex items-center gap-2"><UserCircle className="h-4 w-4" /> New Clients</span>
                  <span className="font-bold text-cream">+12</span>
                </div>
              </div>
            </div>
            
          </div>

        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          
          {/* Agency Goal Tracker */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-lg font-semibold text-cream mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-gold-400" /> Goal Tracker
            </h3>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-ink/60">Monthly Revenue (₦4B)</span>
                  <span className="font-bold text-emerald-400">72%</span>
                </div>
                <SegmentedProgressBar
                  segments={[{ label: 'Progress', value: 72, color: 'bg-emerald-400' }]}
                />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-ink/60">New Listings (20)</span>
                  <span className="font-bold text-blue-400">85%</span>
                </div>
                <SegmentedProgressBar
                  segments={[{ label: 'Progress', value: 85, color: 'bg-blue-400' }]}
                />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-ink/60">Client Acquisition (50)</span>
                  <span className="font-bold text-gold-400">45%</span>
                </div>
                <SegmentedProgressBar
                  segments={[{ label: 'Progress', value: 45, color: 'bg-gold-400' }]}
                />
              </div>
            </div>
          </div>

          {/* Upcoming Meetings Timeline */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <ActivityTimeline
              title="Today's Schedule"
              items={upcomingMeetings}
            />
          </div>

          {/* Recent Activity */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <ActivityTimeline
              title="Recent Activity"
              items={recentActivity}
            />
          </div>

        </div>
      </div>
    </div>
  );
}

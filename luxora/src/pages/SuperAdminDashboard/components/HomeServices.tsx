import { Bell, Wrench, ShieldCheck, CheckCircle2, AlertTriangle, MessageSquare, Lightbulb, TrendingUp, Activity } from 'lucide-react';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { GhostButton, GoldButton } from '../../../components/ui/ui';

export default function HomeServices() {

  const alerts = [
    { title: 'Payment Processing Delay', desc: 'Investigating high latency in payout pipeline.', time: '10m ago', icon: AlertTriangle, color: 'text-orange-400' },
    { title: 'New Executive Report', desc: 'Board meeting pack has been generated.', time: '1h ago', icon: ShieldCheck, color: 'text-blue-400' },
    { title: 'Service Disruption Resolved', desc: 'Image upload service restored to optimal performance.', time: '3h ago', icon: CheckCircle2, color: 'text-emerald-400' }
  ];

  return (
    <div className="space-y-6 pb-12">
      <DashboardHeader 
        name="Executive Services & Alerts" 
        subtitle="Executive notifications, platform service health, and cross-department dependencies."
        actions={
          <div className="flex gap-3">
            <GhostButton className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" /> Message Directors
            </GhostButton>
            <GoldButton className="flex items-center gap-2">
              <Bell className="h-4 w-4" /> Manage Alerts
            </GoldButton>
          </div>
        }
      />

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-gradient-to-br from-navy-800 to-navy-900 border border-white/10 rounded-2xl p-6 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-400/20 rounded-xl">
              <Bell className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="font-heading text-xl font-bold text-cream">Enterprise Alerts Center</h3>
          </div>
          <div className="space-y-3">
            {alerts.map((alert, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.05] transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`pt-0.5`}><alert.icon className={`h-5 w-5 ${alert.color}`} /></div>
                  <div>
                    <div className="text-sm font-medium text-cream">{alert.title}</div>
                    <div className="text-xs text-ink/60">{alert.desc}</div>
                  </div>
                </div>
                <span className="text-xs font-medium text-ink/40">{alert.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Operational Recommendations */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-gold-400" /> Operational Intelligence
            </h3>
            <div className="space-y-4">
              <div className="p-3 bg-navy-900/50 border border-white/5 rounded-xl">
                <div className="text-sm font-semibold text-cream mb-1">Cross-Department Dependency</div>
                <div className="text-xs text-ink/60">Legal review is currently blocking 3 major agency partnerships. Advise accelerating SLA.</div>
              </div>
              <div className="p-3 bg-navy-900/50 border border-white/5 rounded-xl">
                <div className="text-sm font-semibold text-cream mb-1">Business Opportunity</div>
                <div className="text-xs text-ink/60">Home Services integration in Abuja is seeing 40% MoM growth. Allocate marketing budget.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Customer Experience" value="4.8/5" trend="Platform Average" trendColor="text-emerald-400" icon={ShieldCheck} />
        <KPICard title="Service Partners" value="128" trend="Verified Providers" trendColor="text-blue-400" icon={Wrench} />
        <KPICard title="Pending Alerts" value="4" trend="Requires Review" trendColor="text-orange-400" icon={AlertTriangle} />
        <KPICard title="Service Health" value="Optimal" trend="All systems normal" trendColor="text-emerald-400" icon={Activity} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Service Performance Dashboard */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 overflow-hidden">
          <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <h3 className="font-heading text-lg font-semibold text-cream">Service Performance Dashboard</h3>
          </div>
          <DataTable
            data={[
              { id: 'SVC-1', name: 'Cleaning Services', rev: '₦1.2B', rating: 4.8 },
              { id: 'SVC-2', name: 'Moving & Logistics', rev: '₦450M', rating: 4.9 },
              { id: 'SVC-3', name: 'Plumbing & Repairs', rev: '₦150M', rating: 4.2 }
            ]}
            keyExtractor={(svc) => svc.id}
            columns={[
              {
                header: "Service Category",
                render: (svc) => <span className="font-semibold text-cream text-sm">{svc.name}</span>
              },
              {
                header: "Revenue Generated",
                render: (svc) => <span className="font-bold text-gold-400 text-sm">{svc.rev}</span>
              },
              {
                header: "CX Rating",
                render: (svc) => <span className="text-emerald-400 font-bold text-sm">{svc.rating} ★</span>
              }
            ]}
          />
        </div>

        {/* Customer Experience Summary */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <h3 className="font-heading text-lg font-bold text-cream mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-400" /> Customer Experience Summary
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-navy-900/50 border border-white/5 rounded-xl flex justify-between items-center">
               <div>
                 <div className="font-medium text-cream text-sm">Net Promoter Score (NPS)</div>
                 <div className="text-xs text-ink/60 mt-1">Based on 14k survey responses</div>
               </div>
               <div className="text-2xl font-bold text-emerald-400">72</div>
            </div>
            <div className="p-4 bg-navy-900/50 border border-white/5 rounded-xl flex justify-between items-center">
               <div>
                 <div className="font-medium text-cream text-sm">Customer Support Resolution</div>
                 <div className="text-xs text-ink/60 mt-1">Avg Time to Resolution</div>
               </div>
               <div className="text-2xl font-bold text-emerald-400">14m</div>
            </div>
            <div className="p-4 bg-navy-900/50 border border-white/5 rounded-xl flex justify-between items-center">
               <div>
                 <div className="font-medium text-cream text-sm">Trust & Safety Rating</div>
                 <div className="text-xs text-ink/60 mt-1">Dispute resolution outcome satisfaction</div>
               </div>
               <div className="text-2xl font-bold text-gold-400">96%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

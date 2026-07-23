import { useState } from 'react';
import { Users, UserPlus, Heart, Download, Star, Award, MessageSquare, TrendingUp, Calendar, Gift, Zap, CheckCircle2, Clock } from 'lucide-react';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { SegmentedProgressBar } from '../../../components/dashboard/shared/widgets/SegmentedProgressBar';
import { ActivityTimeline } from '../../../components/dashboard/shared/timelines/ActivityTimeline';
import { ClientDetailModal } from './modals/ClientDetailModal';
import { useToast } from '../../../contexts/ToastContext';
import { clients as MOCK_CLIENTS } from '../../../data/agentData';
import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';

export default function Clients() {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<Record<string, unknown> | null>(null);
  const [activeWorkflow, setActiveWorkflow] = useState<{ title: string, type: string, data?: Record<string, unknown> } | null>(null);

  const handleAction = (title: string, type: string, data?: Record<string, unknown>) => {
    setActiveWorkflow({ title, type, data });
  };

  const executeWorkflow = () => {
    showToast({ type: 'success', title: 'Action Initiated', description: `Executing: ${activeWorkflow?.title}. Integration pending.` });
    setActiveWorkflow(null);
  };

  const filteredClients = MOCK_CLIENTS.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewClient = (client: Record<string, unknown>) => {
    setSelectedClient(client);
  };

  const relationshipRecommendations = [
    { text: 'Send Q3 Luxury Market Report to Mike Adenuga to re-engage.', icon: Zap, color: 'text-blue-400', type: 'Nurture' },
    { text: 'Follow up on Folorunso Alakija\'s portfolio review.', icon: Calendar, color: 'text-emerald-400', type: 'Action' },
  ];

  const milestones = [
    { name: 'Aliko Dangote', event: '2-Year Anniversary', date: 'Tomorrow', icon: Award, color: 'text-gold-400' },
    { name: 'Tony Elumelu', event: 'Birthday', date: 'Oct 15', icon: Gift, color: 'text-rose-400' },
  ];

  const upcomingActivities = [
    { title: 'Annual Review', desc: 'Jim Ovia - Portfolio assessment', time: 'Friday, 2:00 PM', icon: Star, color: 'text-gold-400' },
    { title: 'Lease Renewal', desc: 'Mike Adenuga - Commercial property', time: 'Next Week', icon: CheckCircle2, color: 'text-blue-400' },
  ];

  const loyaltyDistribution = [
    { label: 'VIP (Multiple Deals)', value: 15, color: 'bg-gold-400' },
    { label: 'Active (Current Deal)', value: 35, color: 'bg-emerald-400' },
    { label: 'Past Client (Nurture)', value: 50, color: 'bg-blue-400' },
  ];

  return (
    <div className="space-y-6 pb-12">
      <DashboardHeader
        name="Relationship Intelligence"
        subtitle="Nurture high-value relationships, track client milestones, and automate engagement."
        actions={
          <div className="flex gap-3">
            <GhostButton className="flex items-center gap-2" onClick={() => handleAction('Export CRM', 'export')}>
              <Download className="h-4 w-4" /> Export CRM
            </GhostButton>
            <GoldButton className="flex items-center gap-2" onClick={() => handleAction('New Client', 'new_client')}>
              <UserPlus className="h-4 w-4" /> New Client
            </GoldButton>
          </div>
        }
      />

      {/* INTELLIGENCE HEADER: HEALTH & LOYALTY */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="md:col-span-2 bg-gradient-to-br from-navy-800 to-navy-900 border border-white/10 rounded-2xl p-6 flex flex-col justify-center h-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-400/20 rounded-xl">
              <Heart className="h-6 w-6 text-emerald-400" />
            </div>
            <h4 className="font-bold text-cream text-lg">Relationship Health Dashboard</h4>
          </div>
          <p className="text-sm text-ink/80 leading-relaxed mb-4">
            Your client retention rate is <strong className="text-emerald-400">92%</strong>. 
            Total portfolio lifetime value is <strong className="text-gold-400">₦10.4B</strong>. 
            You have <strong className="text-rose-400">2 upcoming milestones</strong> this week. Send personalized messages to strengthen loyalty.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
            <div>
              <div className="text-xs text-ink/60 mb-1">Retention Rate</div>
              <div className="text-lg font-bold text-emerald-400">92%</div>
            </div>
            <div>
              <div className="text-xs text-ink/60 mb-1">Portfolio LTV</div>
              <div className="text-lg font-bold text-gold-400">₦10.4B</div>
            </div>
            <div>
              <div className="text-xs text-ink/60 mb-1">Avg Engagement Score</div>
              <div className="text-lg font-bold text-blue-400">85/100</div>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-1 rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col h-full justify-between">
          <div>
            <h3 className="text-sm font-semibold text-ink/60 mb-4 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-blue-400" /> Communication Planner
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-cream font-medium">Contacted &lt; 30 Days</span>
                  <span className="text-emerald-400">65%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 w-[65%] rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-cream font-medium">Contacted 30-90 Days</span>
                  <span className="text-gold-400">25%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gold-400 w-[25%] rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-cream font-medium">Needs Attention (&gt;90 Days)</span>
                  <span className="text-rose-400">10%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-400 w-[10%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-1 rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col h-full">
          <h3 className="text-sm font-semibold text-ink/60 mb-4 text-center">Renewal Opportunity Tracker</h3>
          <div className="flex-1 flex flex-col justify-center gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink/60">Lease Renewals (Q4)</span>
              <span className="text-sm font-medium text-gold-400">3</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1.5"><div className="bg-gold-400 h-1.5 rounded-full w-[30%]"></div></div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink/60">Management Contracts</span>
              <span className="text-sm font-medium text-blue-400">2</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1.5"><div className="bg-blue-400 h-1.5 rounded-full w-[20%]"></div></div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Clients"
          value="120"
          trend="+5 this month"
          trendColor="text-emerald-400"
          icon={Users}
        />
        <KPICard
          title="VIP Clients"
          value="15"
          trend="₦8B Portfolio"
          trendColor="text-gold-400"
          icon={Star}
        />
        <KPICard
          title="Avg Client Tenure"
          value="4.2 yrs"
          trend="High Loyalty"
          trendColor="text-emerald-400"
          icon={Clock}
        />
        <KPICard
          title="Engagement Score"
          value="85/100"
          trend="Top 5% Performer"
          trendColor="text-blue-400"
          icon={TrendingUp}
        />
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Main Table Area */}
        <div className="lg:col-span-3 space-y-6">
          <DataTableToolbar
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search clients by name or type..."
          />

          <DataTable keyExtractor={(item: Record<string, unknown>, index: number) => (item.id as string) || String(index)}
            columns={[
              {
                header: 'Client Name',
                render: (client: Record<string, unknown>) => (
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-cream">
                      <Users className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-cream flex items-center gap-1">
                        {client.name as string} {client.status === 'VIP' && <Star className="h-3 w-3 text-gold-400 fill-gold-400" />}
                      </div>
                      <div className="text-xs text-ink/60">{client.type as string}</div>
                    </div>
                  </div>
                )
              },
              {
                header: 'Total Value',
                render: (client: Record<string, unknown>) => (
                  <div className="font-bold text-gold-400">{client.totalValue as string}</div>
                )
              },
              {
                header: 'Last Contact',
                render: (client: Record<string, unknown>) => (
                  <div className="text-sm text-cream flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-ink/40" /> {client.lastContact as string}
                  </div>
                )
              },
              {
                header: 'Engagement Score',
                render: (client: Record<string, unknown>) => (
                  <div className="w-24">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-ink/60">Score</span>
                      <span className="text-cream">{client.engagementScore as number}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div 
                        className={`h-full ${(client.engagementScore as number) >= 90 ? 'bg-emerald-400' : (client.engagementScore as number) >= 60 ? 'bg-gold-400' : 'bg-rose-400'}`}
                        style={{ width: `${client.engagementScore}%` }}
                      />
                    </div>
                  </div>
                )
              },
              {
                header: 'Status',
                render: (client: Record<string, unknown>) => <EnterpriseStatusBadge status={client.status as string} />
              },
              {
                header: 'Actions',
                render: (client: Record<string, unknown>) => (
                  <GhostButton 
                    onClick={() => handleViewClient(client)}
                    className="h-8 px-3 text-xs"
                  >
                    View Details
                  </GhostButton>
                )
              }
            ]}
            data={filteredClients}
            onRowClick={(client) => handleViewClient(client)}
          />

          <SegmentedProgressBar
            title="Client Loyalty Overview"
            segments={loyaltyDistribution}
          />
        </div>

        {/* Intelligence Side Panel */}
        <div className="space-y-6 lg:col-span-1">
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
              <Gift className="h-4 w-4 text-rose-400" /> Milestones & Birthdays
            </h3>
            <div className="space-y-3">
              {milestones.map((m, idx) => (
                <div key={idx} className="bg-navy-900/50 p-3 rounded-xl border border-white/5 flex gap-3">
                  <div className="pt-0.5"><m.icon className={`h-4 w-4 ${m.color}`} /></div>
                  <div>
                    <div className="text-xs font-bold text-cream mb-0.5">{m.name}</div>
                    <div className="text-[10px] text-ink/60">{m.event}</div>
                    <div className={`text-[10px] mt-1 font-medium ${m.color}`}>{m.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
              <Zap className="h-4 w-4 text-gold-400" /> Relationship Actions
            </h3>
            <div className="space-y-3">
              {relationshipRecommendations.map((rec, idx) => (
                <div key={idx} className="flex gap-3 bg-navy-900/50 p-3 rounded-xl border border-white/5 cursor-pointer hover:bg-white/[0.02] transition-colors">
                  <div className="pt-0.5"><rec.icon className={`h-4 w-4 ${rec.color}`} /></div>
                  <div>
                    <div className="text-xs text-cream leading-relaxed mb-1">{rec.text}</div>
                    <span className="text-[9px] px-2 py-0.5 bg-white/5 rounded text-ink/50 uppercase tracking-wider">{rec.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
              <Star className="h-4 w-4 text-gold-400 fill-gold-400" /> VIP Follow-up Center
            </h3>
            <div className="text-sm text-ink/80 mb-3">
              You have 2 VIP clients who haven't received a portfolio review this quarter.
            </div>
            <GoldButton className="w-full text-xs py-2" onClick={() => handleAction('Schedule Reviews', 'schedule_reviews')}>Schedule Reviews</GoldButton>
          </div>

          <ActivityTimeline
            title="Client Engagement Calendar"
            items={upcomingActivities}
          />
        </div>
      </div>

      <ClientDetailModal 
        isOpen={!!selectedClient} 
        onClose={() => setSelectedClient(null)} 
        client={selectedClient} 
      />

      <EnterpriseDetailDrawer
        isOpen={!!activeWorkflow}
        onClose={() => setActiveWorkflow(null)}
        title={activeWorkflow?.title || 'Workflow'}
        footerActions={
          <GoldButton onClick={executeWorkflow} className="w-full justify-center">Confirm Action</GoldButton>
        }
      >
        <div className="space-y-6">
          <div className="p-4 rounded-xl border border-white/10 bg-navy-900">
            <h4 className="text-sm font-semibold text-cream mb-2">Workflow Details</h4>
            <p className="text-sm text-ink/60 leading-relaxed">
              You are about to execute the <strong>{activeWorkflow?.type}</strong> workflow. 
              Please review the action details below and confirm to integrate with the backend system.
            </p>
          </div>
          {activeWorkflow?.data && (
            <div className="p-4 rounded-xl border border-white/10 bg-navy-900/50">
              <h4 className="text-sm font-semibold text-cream mb-4">Context Data</h4>
              <div className="space-y-2 text-sm text-ink/80">
                {Object.entries(activeWorkflow.data).map(([key, value]) => {
                  if (typeof value === 'string' || typeof value === 'number') {
                    return (
                      <div key={key} className="flex justify-between border-b border-white/5 pb-2">
                        <span className="capitalize">{key}</span>
                        <span className="font-medium text-cream">{value}</span>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          )}
        </div>
      </EnterpriseDetailDrawer>
    </div>
  );
}

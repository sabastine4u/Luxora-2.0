/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Briefcase, Plus, TrendingUp, CheckCircle2, Download, AlertTriangle, Target, CheckSquare, FileText, FileCheck, BrainCircuit, ShieldAlert, Sparkles } from 'lucide-react';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { StatusBadge } from '../../ManagementDashboard/components/shared/StatusBadge';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { ActivityTimeline } from '../../../components/dashboard/shared/timelines/ActivityTimeline';
import { SegmentedProgressBar } from '../../../components/dashboard/shared/widgets/SegmentedProgressBar';
import { DealDetailModal } from './modals/DealDetailModal';

export default function Deals() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeal, setSelectedDeal] = useState<any | null>(null);

  const deals = [
    { id: 'DL-5001', property: 'Skyline Penthouse', client: 'Aliko Dangote', value: '₦850,000,000', expectedClose: 'Nov 15, 2026', stage: 'Negotiation', status: 'Active', probability: 80, readiness: 75 },
    { id: 'DL-5002', property: 'Victoria Island Office', client: 'Folorunso Alakija', value: '₦1,200,000,000', expectedClose: 'Dec 1, 2026', stage: 'Under Contract', status: 'Pending', probability: 95, readiness: 98 },
    { id: 'DL-5003', property: 'Lekki Phase 1 Villa', client: 'Tony Elumelu', value: '₦450,000,000', expectedClose: 'Oct 5, 2026', stage: 'Closed Won', status: 'Closed', probability: 100, readiness: 100 },
    { id: 'DL-5004', property: 'Banana Island Plot', client: 'Mike Adenuga', value: '₦600,000,000', expectedClose: 'Oct 12, 2026', stage: 'Proposal', status: 'Active', probability: 40, readiness: 30 },
  ];

  const filteredDeals = deals.filter(d => 
    d.property.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDeal = (deal: any) => {
    setSelectedDeal(deal);
  };

  const actionCenter = [
    { title: 'Counter-Offer Needed', desc: 'Banana Island Plot: Client countered at ₦580M.', icon: AlertTriangle, color: 'text-orange-400', urgency: 'High' },
    { title: 'Final Signature Required', desc: 'Victoria Island Office: All contingencies cleared.', icon: FileCheck, color: 'text-emerald-400', urgency: 'Medium' },
  ];

  const aiInsights = [
    { title: 'Negotiation Risk', desc: 'Skyline Penthouse: Similar units closed 5% lower last month.', icon: ShieldAlert, color: 'text-rose-400' },
    { title: 'Favorable Terms', desc: 'Folorunso Alakija historically accepts 30-day closing.', icon: BrainCircuit, color: 'text-blue-400' },
  ];

  const closingChecklist = [
    { task: 'Title Search Cleared (VI Office)', completed: true },
    { task: 'Final Walkthrough (Skyline Penthouse)', completed: false },
    { task: 'Wire Transfer Confirmation', completed: false },
  ];

  const requiredDocuments = [
    { doc: 'Proof of Funds', deal: 'Skyline Penthouse', status: 'Missing' },
    { doc: 'Purchase Agreement', deal: 'VI Office', status: 'Approved' },
  ];

  const closingTimeline = [
    { title: 'Appraisal Completed', desc: 'Victoria Island Office appraised at value.', time: '2 days ago', icon: CheckCircle2, color: 'text-emerald-400' },
    { title: 'Offer Submitted', desc: 'Banana Island Plot - ₦580M', time: 'Yesterday', icon: FileText, color: 'text-blue-400' },
  ];

  const negotiationBoard = [
    { label: 'Initial Offer', value: 20, color: 'bg-blue-400' },
    { label: 'Counter Offer', value: 50, color: 'bg-orange-400' },
    { label: 'Final Review', value: 30, color: 'bg-emerald-400' },
  ];

  return (
    <div className="space-y-6 pb-12">
      <DashboardHeader
        name="Deal Operations & Workflow"
        subtitle="Manage deal progress, monitor risks, and streamline closing procedures."
        actions={
          <div className="flex gap-3">
            <GhostButton className="flex items-center gap-2">
              <Download className="h-4 w-4" /> Export Pipeline
            </GhostButton>
            <GoldButton className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> New Deal
            </GoldButton>
          </div>
        }
      />

      {/* INTELLIGENCE HEADER: DEAL ACTION CENTER */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="md:col-span-2 bg-gradient-to-br from-navy-800 to-navy-900 border border-white/10 rounded-2xl p-6 flex flex-col justify-center h-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-400/20 rounded-xl">
              <CheckSquare className="h-6 w-6 text-orange-400" />
            </div>
            <h4 className="font-bold text-cream text-lg">Deal Action Center</h4>
          </div>
          <p className="text-sm text-ink/80 leading-relaxed mb-4">
            You have <strong className="text-orange-400">2 pending actions</strong> required to advance active deals. 
            The VI Office deal is at <strong className="text-emerald-400">98% closing readiness</strong>. 
            Ensure all required compliance documents are uploaded before EOD Friday.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
            <div>
              <div className="text-xs text-ink/60 mb-1">Actions Required</div>
              <div className="text-lg font-bold text-orange-400">2</div>
            </div>
            <div>
              <div className="text-xs text-ink/60 mb-1">Missing Docs</div>
              <div className="text-lg font-bold text-rose-400">1</div>
            </div>
            <div>
              <div className="text-xs text-ink/60 mb-1">Clear to Close</div>
              <div className="text-lg font-bold text-emerald-400">1 Deal</div>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-1 rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col h-full justify-between">
          <div>
            <h3 className="text-sm font-semibold text-ink/60 mb-4 flex items-center gap-2">
              <BrainCircuit className="h-4 w-4 text-blue-400" /> AI Deal Insights
            </h3>
            <div className="space-y-4">
              {aiInsights.map((insight, idx) => (
                <div key={idx} className="flex gap-3">
                  <insight.icon className={`h-4 w-4 shrink-0 ${insight.color}`} />
                  <div>
                    <div className="text-xs font-bold text-cream mb-0.5">{insight.title}</div>
                    <div className="text-[10px] text-ink/60 leading-tight">{insight.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-1 rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col h-full">
          <h3 className="text-sm font-semibold text-ink/60 mb-4 text-center">Closing Readiness Score</h3>
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="relative h-24 w-24 mb-2">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                <path className="text-navy-950" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" strokeDasharray="85, 100" strokeWidth="4" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-cream">85%</span>
              </div>
            </div>
            <p className="text-xs text-ink/60 text-center">Portfolio Avg Readiness</p>
          </div>
        </div>
      </div>

      {/* Sales Pipeline KPIs */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Active Deals"
          value="4"
          trend="₦3.35B Total"
          trendColor="text-blue-400"
          icon={Briefcase}
        />
        <KPICard
          title="Avg Closing Time"
          value="45d"
          trend="-5d vs agency avg"
          trendColor="text-emerald-400"
          icon={TrendingUp}
        />
        <KPICard
          title="Docs Pending"
          value="3"
          trend="Compliance queue"
          trendColor="text-rose-400"
          icon={FileText}
        />
        <KPICard
          title="Negotiation Win Rate"
          value="72%"
          trend="Top 10% Negotiator"
          trendColor="text-gold-400"
          icon={Target}
        />
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Main Deals Table */}
        <div className="lg:col-span-3 space-y-6">
          <DataTableToolbar
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search deals..."
          />

          <DataTable keyExtractor={(item: any, index: number) => item.id || String(index)}
            columns={[
              {
                header: 'Property / Client',
                render: (deal: any) => (
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-cream">
                      <Briefcase className="h-5 w-5 text-gold-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-cream">{deal.property}</div>
                      <div className="text-xs text-ink/60">{deal.client}</div>
                    </div>
                  </div>
                )
              },
              {
                header: 'Value',
                render: (deal: any) => (
                  <div className="font-bold text-cream">{deal.value}</div>
                )
              },
              {
                header: 'Readiness Score',
                render: (deal: any) => (
                  <div className="w-24">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-ink/60">Ready</span>
                      <span className="text-cream">{deal.readiness}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div 
                        className={`h-full ${deal.readiness >= 90 ? 'bg-emerald-400' : deal.readiness >= 50 ? 'bg-gold-400' : 'bg-rose-400'}`}
                        style={{ width: `${deal.readiness}%` }}
                      />
                    </div>
                  </div>
                )
              },
              {
                header: 'Stage',
                render: (deal: any) => (
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-white/5 text-ink/80 border border-white/10">
                    {deal.stage}
                  </span>
                )
              },
              {
                header: 'Status',
                render: (deal: any) => <StatusBadge status={deal.status} />
              },
              {
                header: 'Actions',
                render: (deal: any) => (
                  <GhostButton 
                    onClick={() => handleViewDeal(deal)}
                    className="h-8 px-3 text-xs"
                  >
                    Workflow Details
                  </GhostButton>
                )
              }
            ]}
            data={filteredDeals}
            onRowClick={(deal) => handleViewDeal(deal)}
          />

          <SegmentedProgressBar
            title="Negotiation Progress Board"
            segments={negotiationBoard}
          />
        </div>

        {/* Analytics & Workflow Panel */}
        <div className="space-y-6 lg:col-span-1">
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-gold-400" /> Deal Priority Queue
            </h3>
            <div className="space-y-3">
              {actionCenter.map((action, idx) => (
                <div key={idx} className={`bg-navy-900/50 p-3 rounded-xl border ${action.urgency === 'High' ? 'border-orange-500/30' : 'border-white/5'}`}>
                  <div className="flex justify-between items-start mb-1">
                    <div className="text-sm font-bold text-cream flex items-center gap-1.5">
                      <action.icon className={`h-3 w-3 ${action.color}`} /> {action.title}
                    </div>
                  </div>
                  <div className="text-[10px] text-ink/80">{action.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Closing Checklist
            </h3>
            <div className="space-y-3">
              {closingChecklist.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <input type="checkbox" checked={item.completed} readOnly className="mt-0.5 accent-gold-400 bg-white/5 border-white/10" />
                  <span className={`text-xs ${item.completed ? 'text-ink/40 line-through' : 'text-cream'}`}>{item.task}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-400" /> Document Tracker
            </h3>
            <div className="space-y-3">
              {requiredDocuments.map((doc, idx) => (
                <div key={idx} className="flex justify-between items-center bg-navy-900/50 p-3 rounded-xl border border-white/5">
                  <div>
                    <div className="text-xs font-bold text-cream mb-0.5">{doc.doc}</div>
                    <div className="text-[10px] text-ink/60">{doc.deal}</div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded ${doc.status === 'Approved' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-rose-400/10 text-rose-400'}`}>
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <ActivityTimeline
            title="Closing Timeline"
            items={closingTimeline}
          />
        </div>
      </div>

      <DealDetailModal 
        isOpen={!!selectedDeal} 
        onClose={() => setSelectedDeal(null)} 
        deal={selectedDeal} 
      />
    </div>
  );
}

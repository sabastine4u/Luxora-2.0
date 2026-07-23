import { useState } from 'react';
import { DollarSign, Download, TrendingUp, CheckCircle2, Calculator, ArrowUpRight, Activity, Target, AlertCircle, ShieldCheck, Wallet, Lightbulb } from 'lucide-react';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { ActivityTimeline } from '../../../components/dashboard/shared/timelines/ActivityTimeline';
import { SegmentedProgressBar } from '../../../components/dashboard/shared/widgets/SegmentedProgressBar';
import { CommissionDetailModal } from './modals/CommissionDetailModal';
import { useToast } from '../../../contexts/ToastContext';
import { commissions as MOCK_COMMISSIONS } from '../../../data/agentData';
import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';

export default function Commissions() {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComm, setSelectedComm] = useState<Record<string, unknown> | null>(null);
  const [activeWorkflow, setActiveWorkflow] = useState<{ title: string, type: string, data?: Record<string, unknown> } | null>(null);

  const handleAction = (title: string, type: string, data?: Record<string, unknown>) => {
    setActiveWorkflow({ title, type, data });
  };

  const executeWorkflow = () => {
    showToast({ type: 'success', title: 'Action Initiated', description: `Executing: ${activeWorkflow?.title}. Integration pending.` });
    setActiveWorkflow(null);
  };

  const filteredComms = MOCK_COMMISSIONS.filter(c => 
    c.property.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (c.client && c.client.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleViewComm = (comm: Record<string, unknown>) => {
    setSelectedComm(comm);
  };

  const cashFlowSummary = [
    { label: 'Cleared Income', value: 45, color: 'bg-emerald-400' },
    { label: 'Pending Payouts', value: 20, color: 'bg-gold-400' },
    { label: 'Projected (Q4)', value: 35, color: 'bg-blue-400' },
  ];

  const upcomingPayouts = [
    { title: 'Victoria Island Office', desc: 'Expected processing next week', time: 'Oct 28', icon: DollarSign, color: 'text-gold-400' },
    { title: 'Skyline Penthouse', desc: 'Pending closing clearance', time: 'Nov 15', icon: AlertCircle, color: 'text-orange-400' },
  ];

  const financialRecommendations = [
    { text: 'Allocate ₦3.5M from next payout to Q4 tax reserve.', icon: Lightbulb, color: 'text-blue-400' },
    { text: 'Your income stability is high. Consider increasing your marketing budget by 10%.', icon: TrendingUp, color: 'text-emerald-400' },
  ];

  const taxTimeline = [
    { title: 'Q3 Estimated Tax Due', desc: 'Ensure reserves are fully funded', time: 'Oct 15, 2026', icon: Calculator, color: 'text-rose-400' },
    { title: 'End of Year Review', desc: 'Consult with tax advisor', time: 'Dec 1, 2026', icon: Activity, color: 'text-gold-400' },
  ];

  return (
    <div className="space-y-6 pb-12">
      <DashboardHeader
        name="Financial Planning Dashboard"
        subtitle="Forecast earnings, track savings goals, and manage your business finances."
        actions={
          <div className="flex gap-3">
            <GhostButton className="flex items-center gap-2" onClick={() => handleAction('Tax Estimator', 'tax_estimator')}>
              <Calculator className="h-4 w-4" /> Tax Estimator
            </GhostButton>
            <GoldButton className="flex items-center gap-2" onClick={() => handleAction('Export Report', 'export_report')}>
              <Download className="h-4 w-4" /> Export Report
            </GoldButton>
          </div>
        }
      />

      {/* INTELLIGENCE HEADER: FINANCIAL PLANNING */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="md:col-span-2 bg-gradient-to-br from-navy-800 to-navy-900 border border-white/10 rounded-2xl p-6 flex flex-col justify-center h-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-400/20 rounded-xl">
              <Wallet className="h-6 w-6 text-emerald-400" />
            </div>
            <h4 className="font-bold text-cream text-lg">Quarterly Earnings Forecast</h4>
          </div>
          <p className="text-sm text-ink/80 leading-relaxed mb-4">
            Your income stability indicator is <strong className="text-emerald-400">Strong (A+)</strong>. 
            You are projected to earn <strong className="text-cream">₦32.5M in Q4</strong>, which covers your monthly operating budget for the next 14 months.
            You have <strong className="text-gold-400">₦20.9M</strong> in pending payouts.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
            <div>
              <div className="text-xs text-ink/60 mb-1">Q4 Forecast</div>
              <div className="text-lg font-bold text-emerald-400">₦32.5M</div>
            </div>
            <div>
              <div className="text-xs text-ink/60 mb-1">Monthly Run Rate</div>
              <div className="text-lg font-bold text-blue-400">₦7.5M</div>
            </div>
            <div>
              <div className="text-xs text-ink/60 mb-1">Operating Runway</div>
              <div className="text-lg font-bold text-cream">14 Months</div>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-1 rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col h-full justify-between">
          <div>
            <h3 className="text-sm font-semibold text-ink/60 mb-4 flex items-center gap-2">
              <Target className="h-4 w-4 text-gold-400" /> Earnings Goal Tracker
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-cream font-medium">Annual Target (₦75M)</span>
                  <span className="text-emerald-400">₦45.2M</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 w-[60%] rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-cream font-medium">Pending Pipeline</span>
                  <span className="text-gold-400">₦20.9M</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gold-400 w-[28%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-1 rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col h-full">
          <h3 className="text-sm font-semibold text-ink/60 mb-4 text-center">Savings & Tax Goals</h3>
          <div className="flex-1 flex flex-col justify-center gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink/60">Tax Reserve</span>
              <span className="text-sm font-medium text-emerald-400">Fully Funded</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1.5"><div className="bg-emerald-400 h-1.5 rounded-full w-full"></div></div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink/60">Investment Fund</span>
              <span className="text-sm font-medium text-blue-400">80%</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1.5"><div className="bg-blue-400 h-1.5 rounded-full w-[80%]"></div></div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Paid (YTD)"
          value="₦45.2M"
          trend="+15% vs last year"
          trendColor="text-emerald-400"
          icon={CheckCircle2}
        />
        <KPICard
          title="Pending Approval"
          value="₦20.9M"
          trend="2 Deals Pending"
          trendColor="text-gold-400"
          icon={DollarSign}
        />
        <KPICard
          title="Income Stability"
          value="Strong"
          trend="A+ Rating"
          trendColor="text-emerald-400"
          icon={ShieldCheck}
        />
        <KPICard
          title="Avg Comm Rate"
          value="4.5%"
          trend="Top 10% of Agency"
          trendColor="text-emerald-400"
          icon={ArrowUpRight}
        />
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Main Commissions Table */}
        <div className="lg:col-span-3 space-y-6">
          <DataTableToolbar
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search by property or client..."
          />

          <DataTable keyExtractor={(item: Record<string, unknown>, index: number) => (item.id as string) || String(index)}
            columns={[
              {
                header: 'Property / Client',
                render: (comm: Record<string, unknown>) => (
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gold-400/20 flex items-center justify-center text-gold-400">
                      <DollarSign className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-cream">{comm.property as string}</div>
                      <div className="text-xs text-ink/60">{comm.client as string}</div>
                    </div>
                  </div>
                )
              },
              {
                header: 'Commission Amount',
                render: (comm: Record<string, unknown>) => (
                  <div className="font-bold text-emerald-400 text-base">{comm.amount as string}</div>
                )
              },
              {
                header: 'Type / Split',
                render: (comm: Record<string, unknown>) => (
                  <div>
                    <div className="font-medium text-cream text-sm">{comm.type as string}</div>
                    <div className="text-xs text-ink/60 mt-0.5">Split: {comm.split as string}</div>
                  </div>
                )
              },
              {
                header: 'Expected / Paid Date',
                render: (comm: Record<string, unknown>) => (
                  <div className="text-sm text-cream">{comm.date as string}</div>
                )
              },
              {
                header: 'Status',
                render: (comm: Record<string, unknown>) => <EnterpriseStatusBadge status={comm.status as string} />
              },
              {
                header: 'Actions',
                render: (comm: Record<string, unknown>) => (
                  <GhostButton 
                    onClick={() => handleViewComm(comm)}
                    className="h-8 px-3 text-xs"
                  >
                    View Breakdown
                  </GhostButton>
                )
              }
            ]}
            data={filteredComms}
            onRowClick={(comm) => handleViewComm(comm)}
          />

          <SegmentedProgressBar
            title="Cash Flow Summary (YTD & Projected)"
            segments={cashFlowSummary}
          />
        </div>

        {/* Analytics & Side Widgets */}
        <div className="space-y-6 lg:col-span-1">
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-gold-400" /> Financial Recommendations
            </h3>
            <div className="space-y-3">
              {financialRecommendations.map((rec, idx) => (
                <div key={idx} className="flex gap-3 bg-navy-900/50 p-3 rounded-xl border border-white/5 cursor-pointer hover:bg-white/[0.02] transition-colors">
                  <div className="pt-0.5"><rec.icon className={`h-4 w-4 ${rec.color}`} /></div>
                  <div className="text-xs text-cream leading-relaxed">{rec.text}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
              <Calculator className="h-4 w-4 text-purple-400" /> Monthly Budget Overview
            </h3>
            <div className="bg-navy-900/50 p-4 rounded-xl border border-white/5 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-ink/80">Operating Expenses</span>
                <span className="text-rose-400 font-bold">₦1.2M</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-ink/80">Marketing Budget</span>
                <span className="text-blue-400 font-bold">₦800k</span>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between items-center text-sm">
                <span className="text-cream font-medium">Total Monthly Overhead</span>
                <span className="text-cream font-bold">₦2.0M</span>
              </div>
            </div>
          </div>

          <ActivityTimeline
            title="Upcoming Payouts"
            items={upcomingPayouts}
          />
          
          <ActivityTimeline
            title="Tax Planning Timeline"
            items={taxTimeline}
          />
        </div>
      </div>

      <CommissionDetailModal 
        isOpen={!!selectedComm} 
        onClose={() => setSelectedComm(null)} 
        commission={selectedComm} 
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

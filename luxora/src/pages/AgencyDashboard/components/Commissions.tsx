import { useState } from 'react';
import { Download, Filter, CheckCircle2, Clock, AlertTriangle, ArrowRight, PieChart, TrendingUp, RefreshCcw } from 'lucide-react';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';
import { SegmentedProgressBar } from '../../../components/dashboard/shared/widgets/SegmentedProgressBar';
import { agencyCommissions } from '../../../data/agencyData';
import type { AgencyCommission } from '../../../types/agency';

export default function Commissions() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCommission, setSelectedCommission] = useState<AgencyCommission | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const commissions = agencyCommissions;

  const filteredCommissions = commissions.filter(c => 
    c.agent.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewCommission = (commission: AgencyCommission) => {
    setSelectedCommission(commission);
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        name="Finance & Commissions"
        subtitle="Manage agent payouts, revenue distribution, and financial operations."
        actions={
          <div className="flex gap-3">
            <GhostButton className="flex items-center gap-2">
              <Download className="h-4 w-4" /> Export Report
            </GhostButton>
            <GoldButton className="flex items-center gap-2">
              <RefreshCcw className="h-4 w-4" /> Run Payroll
            </GoldButton>
          </div>
        }
      />

      {/* Commission Dashboard KPIs */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Paid (YTD)"
          value="₦85.5M"
          trend="82% of all commissions"
          trendColor="text-emerald-400"
          icon={CheckCircle2}
        />
        <KPICard
          title="Pending Payments"
          value="₦13.5M"
          trend="Requires approval"
          trendColor="text-yellow-400"
          icon={Clock}
        />
        <KPICard
          title="Processing"
          value="₦8.5M"
          trend="Clearing this week"
          trendColor="text-blue-400"
          icon={RefreshCcw}
        />
        <KPICard
          title="Overdue"
          value="₦15.0M"
          trend="Action required"
          trendColor="text-rose-400"
          icon={AlertTriangle}
        />
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        
        {/* Main Ledger Table */}
        <div className="lg:col-span-3 rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col h-[calc(100vh-280px)] min-h-[500px]">
          <DataTableToolbar
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search by ID, Agent, or Property..."
            actions={
              <div className="flex gap-2">
                <GhostButton className="px-3 flex items-center gap-2"><Filter className="h-4 w-4" /> Filter Status</GhostButton>
              </div>
            }
          />

          <div className="flex-1 mt-6">
            <DataTable
              data={filteredCommissions}
              keyExtractor={(c) => String(c.id)}
              columns={[
                {
                  header: "ID & Date",
                  render: (c) => (
                    <div>
                      <div 
                        className="font-mono font-semibold text-gold-400 cursor-pointer hover:underline"
                        onClick={() => handleViewCommission(c)}
                      >
                        {String(c.id)}
                      </div>
                      <div className="text-xs text-ink/60">{String(c.date)}</div>
                    </div>
                  )
                },
                {
                  header: "Agent",
                  render: (c) => <span className="font-medium text-cream">{String(c.agent)}</span>
                },
                {
                  header: "Property & Deal Value",
                  render: (c) => (
                    <div>
                      <div className="text-sm text-cream">{String(c.property)}</div>
                      <div className="text-xs text-ink/60 mt-0.5">Deal: {String(c.dealValue)}</div>
                    </div>
                  )
                },
                {
                  header: "Commission",
                  render: (c) => <span className="font-bold text-emerald-400">{String(c.amount)}</span>
                },
                {
                  header: "Status",
                  render: (c) => <EnterpriseStatusBadge status={String(c.status)} />
                },
                {
                  header: <div className="text-right">Actions</div>,
                  className: "text-right",
                  render: (c) => (
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleViewCommission(c)}
                        className="p-1.5 text-ink/60 hover:text-gold-400 rounded hover:bg-gold-400/10 transition-colors" 
                        title="View Details"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  )
                }
              ]}
            />
          </div>
        </div>

        {/* Sidebar: Financial Insights */}
        <div className="space-y-6">
          
          {/* Revenue Distribution */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-lg font-semibold text-cream mb-6 flex items-center gap-2">
              <PieChart className="h-5 w-5 text-gold-400" /> Commission Pool
            </h3>
            <SegmentedProgressBar
              segments={[
                { label: 'Paid', value: 70, color: 'bg-emerald-400' },
                { label: 'Pending', value: 15, color: 'bg-yellow-400' },
                { label: 'Processing', value: 10, color: 'bg-blue-400' },
                { label: 'Overdue', value: 5, color: 'bg-rose-400' }
              ]}
            />
            <div className="mt-6 space-y-2 text-xs text-ink/80">
              <div className="flex justify-between items-center"><span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-400"></div> Paid</span> <span className="font-bold text-emerald-400">₦85.5M</span></div>
              <div className="flex justify-between items-center"><span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-400"></div> Pending</span> <span className="font-bold text-yellow-400">₦13.5M</span></div>
              <div className="flex justify-between items-center"><span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-400"></div> Processing</span> <span className="font-bold text-blue-400">₦8.5M</span></div>
              <div className="flex justify-between items-center"><span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-rose-400"></div> Overdue</span> <span className="font-bold text-rose-400">₦15.0M</span></div>
            </div>
          </div>

          {/* Monthly Earnings Trend */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-lg font-semibold text-cream mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-400" /> Earnings Trend
            </h3>
            <div className="h-32 flex items-end gap-2 mt-4 relative">
              {[40, 60, 45, 80, 50, 95].map((h, i) => (
                <div key={i} className="flex-1 bg-navy-950 rounded-t-sm relative group">
                  <div 
                    className="absolute bottom-0 w-full bg-emerald-400/60 rounded-t-sm transition-all group-hover:bg-emerald-400" 
                    style={{ height: `${h}%` }}
                  ></div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-ink/60 mt-2">
              <span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span>
            </div>
          </div>

          {/* Approval Queue */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-lg font-semibold text-cream mb-4">Approval Queue</h3>
            <div className="space-y-3">
              <div className="p-3 bg-navy-900/50 rounded-xl border border-white/5">
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="font-bold text-cream">COM-2025-104</span>
                  <span className="text-yellow-400 text-xs">Pending Review</span>
                </div>
                <div className="text-xs text-ink/60">₦13.5M • Sarah James</div>
                <GhostButton className="w-full mt-2 text-xs h-7">Review</GhostButton>
              </div>
            </div>
          </div>

        </div>

      </div>

      <EnterpriseDetailDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedCommission ? `Commission: ${selectedCommission.id}` : 'Commission Details'}
        footerActions={
          <div className="flex gap-3 w-full">
            <GhostButton className="flex-1">View Deal</GhostButton>
            <GoldButton className="flex-1">Approve Payout</GoldButton>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="p-4 rounded-xl border border-white/10 bg-navy-900/50">
            <h4 className="text-sm font-semibold text-cream mb-4">Commission Details</h4>
            <div className="space-y-3 text-sm text-ink/80">
              <div className="flex justify-between border-b border-white/5 pb-2"><span>Commission ID</span><span className="font-medium text-cream">{selectedCommission?.id}</span></div>
              <div className="flex justify-between border-b border-white/5 pb-2"><span>Assigned Agent</span><span className="font-medium text-cream">{selectedCommission?.agent}</span></div>
              <div className="flex justify-between border-b border-white/5 pb-2"><span>Property</span><span className="font-medium text-cream">{selectedCommission?.property}</span></div>
              <div className="flex justify-between border-b border-white/5 pb-2"><span>Deal Value</span><span className="font-medium text-cream">{selectedCommission?.dealValue}</span></div>
              <div className="flex justify-between border-b border-white/5 pb-2"><span>Commission Amount</span><span className="font-medium text-cream">{selectedCommission?.amount}</span></div>
              <div className="flex justify-between border-b border-white/5 pb-2"><span>Date</span><span className="font-medium text-cream">{selectedCommission?.date}</span></div>
            </div>
          </div>
        </div>
      </EnterpriseDetailDrawer>
    </div>
  );
}

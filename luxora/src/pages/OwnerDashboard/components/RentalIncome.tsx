import { useState } from 'react';
import { Wallet, ArrowUpRight, FileText, Download, Eye, MessageSquare, TrendingUp, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { EmptyState } from '../../../components/layout/EmptyState';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';
import { useToast } from '../../../contexts/ToastContext';
import { mockPerformance, mockHistory, mockUpcoming, mockChartData } from '../../../data/ownerData';
import type { UpcomingPayment, PaymentHistory } from '../../../types/owner';
import ExportModal from './modals/ExportModal';

export default function RentalIncome() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const formatMoney = (val: number) => `₦${(val / 1000000).toFixed(1)}M`;

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<UpcomingPayment | PaymentHistory | null>(null);

  const handleExport = (format: string) => {
    showToast({ type: 'success', title: 'Export Started', description: `Your rental statement is being exported as ${format.toUpperCase()}.` });
    setIsExportModalOpen(false);
  };

  if (mockPerformance.length === 0) {
    return (
      <div className="space-y-6">
        <EmptyState
          icon={<Wallet className="h-8 w-8 text-gold-400" />}
          title="No rental income available."
          description="You do not have any rented properties generating income yet."
          actionLabel="View Listings"
          onAction={() => navigate('/owner-dashboard?tab=Listing+Journey')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Rental Income</h2>
          <p className="text-sm text-ink/60">Monitor rental performance, income, occupancy, and payment history.</p>
        </div>
        <div className="flex gap-3">
          <GhostButton onClick={() => setIsExportModalOpen(true)}>
            <FileText className="h-4 w-4 mr-2" /> Export Statement
          </GhostButton>
          <GoldButton onClick={() => setIsExportModalOpen(true)}>
            <Download className="h-4 w-4 mr-2" /> Download Report
          </GoldButton>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Monthly Income', value: '₦14.5M', icon: Wallet, color: 'text-cream', bg: 'bg-white/5' },
          { label: 'Total Rental (YTD)', value: '₦108.0M', icon: ArrowUpRight, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { label: 'Occupancy Rate', value: '85%', icon: Home, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: 'Outstanding Rent', value: '₦2.5M', icon: TrendingUp, color: 'text-rose-400', bg: 'bg-rose-400/10' },
          { label: 'Net Income', value: '₦98.2M', icon: TrendingUp, color: 'text-gold-400', bg: 'bg-gold-400/10' },
        ].map((kpi, idx) => (
          <KPICard 
            key={idx}
            title={kpi.label}
            value={kpi.value}
            icon={kpi.icon}
            iconColor={kpi.color}
            backgroundColor={kpi.bg}
            hoverEffect="none"
            iconBorder={false}
            valueTypography="heading"
            labelTypography="uppercase-small"
            trendPosition="inline-label-top"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Col: Chart & Property Perf */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* Chart */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-lg font-bold text-cream mb-6">Monthly Rental Income (Last 12 Months)</h3>
            <div className="h-[250px] flex items-end gap-2 border-b border-white/10 pb-2">
              {mockChartData.map((d, i) => {
                const heightPercent = (d.income / 15) * 100;
                return (
                  <div key={i} className="group relative flex w-full flex-col justify-end items-center h-full">
                    <div 
                      className="w-full bg-gold-400 rounded-t-sm transition-all duration-300 group-hover:bg-gold-300" 
                      style={{ height: `${heightPercent}%`, minHeight: d.income > 0 ? '4px' : '0' }}
                    />
                    <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-navy-900 border border-white/10 rounded px-2 py-1 text-xs text-cream whitespace-nowrap z-10 pointer-events-none">
                      ₦{d.income.toFixed(1)}M
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-3 text-xs text-ink/50">
              {mockChartData.map((d, i) => <div key={i} className="w-full text-center">{d.month}</div>)}
            </div>
          </div>

          {/* Property Performance Table */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h3 className="font-heading text-lg font-bold text-cream">Property Performance</h3>
            </div>
            
            {/* Desktop Table */}
            <div className="hidden md:block w-full">
              <DataTable
                data={mockPerformance}
                keyExtractor={(perf) => perf.id}
                columns={[
                  {
                    header: "Property",
                    render: (perf) => <span className="font-medium text-cream truncate max-w-[150px]">{perf.property}</span>
                  },
                  {
                    header: "Tenant",
                    render: (perf) => <span className="text-ink/60">{perf.tenant}</span>
                  },
                  {
                    header: "Monthly Rent",
                    render: (perf) => <span className="font-bold text-gold-400">{perf.rent > 0 ? formatMoney(perf.rent) : '₦0'}</span>
                  },
                  {
                    header: "Occupancy",
                    render: (perf) => <span className="text-ink/60">{perf.occupancy}</span>
                  },
                  {
                    header: "Next Due",
                    render: (perf) => <span className="text-ink/60">{perf.nextDueDate}</span>
                  },
                  {
                    header: <div className="text-right">Status</div>,
                    className: "text-right",
                    render: (perf) => (
                      <EnterpriseStatusBadge status={perf.status} />
                    )
                  }
                ]}
              />
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-white/5">
              {mockPerformance.map(perf => (
                <div key={perf.id} className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-cream">{perf.property}</div>
                      <div className="text-xs text-ink/50 mt-1">Tenant: {perf.tenant}</div>
                    </div>
                    <EnterpriseStatusBadge status={perf.status} />
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-xs text-ink/50 mb-1">Monthly Rent</div>
                      <div className="font-bold text-gold-400">{perf.rent > 0 ? formatMoney(perf.rent) : '₦0'}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-ink/50 mb-1">Next Due</div>
                      <div className="text-sm text-cream">{perf.nextDueDate}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment History */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h3 className="font-heading text-lg font-bold text-cream">Payment History</h3>
            </div>
            
            <div className="hidden md:block w-full">
              <DataTable
                data={mockHistory}
                keyExtractor={(hist) => hist.id}
                columns={[
                  {
                    header: "Date",
                    render: (hist) => <span className="text-ink/60 whitespace-nowrap">{hist.date}</span>
                  },
                  {
                    header: "Tenant",
                    render: (hist) => <span className="text-cream font-medium">{hist.tenant}</span>
                  },
                  {
                    header: "Property",
                    render: (hist) => <span className="text-ink/60 truncate max-w-[150px]">{hist.property}</span>
                  },
                  {
                    header: "Method",
                    render: (hist) => <span className="text-ink/60">{hist.method}</span>
                  },
                  {
                    header: "Amount",
                    render: (hist) => <span className="font-bold text-emerald-400">+{formatMoney(hist.amount)}</span>
                  },
                  {
                    header: <div className="text-right">Status</div>,
                    className: "text-right",
                    render: (hist) => (
                      <EnterpriseStatusBadge status={hist.status} />
                    )
                  },
                  {
                    header: <div className="text-right">Action</div>,
                    className: "text-right",
                    render: (hist) => (
                      <GhostButton size="sm" onClick={() => setSelectedPayment(hist)}>View</GhostButton>
                    )
                  }
                ]}
              />
            </div>

            <div className="md:hidden divide-y divide-white/5">
              {mockHistory.map(hist => (
                <div key={hist.id} className="p-4 space-y-3 cursor-pointer" onClick={() => setSelectedPayment(hist)}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-cream">{hist.tenant}</div>
                      <div className="text-xs text-ink/50 mt-1">{hist.date} &bull; {hist.method}</div>
                    </div>
                    <EnterpriseStatusBadge status={hist.status} />
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="text-xs text-ink/50 truncate max-w-[150px]">{hist.property}</div>
                    <div className="font-bold text-emerald-400 text-lg">+{formatMoney(hist.amount)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Profit & Upcoming */}
        <div className="space-y-8">
          
          {/* Net Profit & Expenses */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-lg font-bold text-cream mb-6">Financial Summary (YTD)</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-sm font-semibold text-emerald-400">Total Income</span>
                <span className="font-bold text-emerald-400">₦108.0M</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <span className="text-sm font-semibold text-rose-400">Total Expenses</span>
                <span className="font-bold text-rose-400">-₦9.8M</span>
              </div>
              <div className="flex justify-between items-center p-4 rounded-xl bg-navy-900 border border-gold-400/30 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                <div>
                  <span className="text-xs text-ink/50 uppercase font-semibold block mb-1">Net Profit</span>
                  <span className="font-bold text-gold-400 text-2xl">₦98.2M</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-ink/50 uppercase font-semibold block mb-1">Margin</span>
                  <span className="font-bold text-emerald-400 text-xl">90.9%</span>
                </div>
              </div>
            </div>

            <h4 className="text-sm font-semibold text-ink/60 uppercase tracking-wider mb-4">Expense Breakdown</h4>
            <div className="space-y-3">
              {[
                { label: 'Maintenance', amount: '₦4.2M' },
                { label: 'Taxes', amount: '₦2.5M' },
                { label: 'Agency Fees', amount: '₦1.8M' },
                { label: 'Utilities', amount: '₦0.8M' },
                { label: 'Insurance', amount: '₦0.5M' }
              ].map((exp, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <span className="text-cream">{exp.label}</span>
                  <span className="text-rose-400 font-medium">{exp.amount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Payments */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-lg font-bold text-cream mb-6">Upcoming Payments</h3>
            <div className="space-y-4">
              {mockUpcoming.map(up => (
                <div key={up.id} className="p-4 rounded-xl bg-navy-900/50 border border-white/5 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-semibold text-cream">{up.tenant}</div>
                    <div className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">Due: {up.dueDate}</div>
                  </div>
                  <div className="text-xs text-ink/50 mb-3 truncate">{up.property}</div>
                  <div className="flex justify-between items-center pt-3 border-t border-white/5">
                    <div className="font-bold text-cream">{formatMoney(up.amount)}</div>
                    <div className="flex gap-2">
                      <GhostButton size="sm" className="px-2" onClick={() => setSelectedPayment(up)}><Eye className="h-4 w-4" /></GhostButton>
                      <GhostButton size="sm" className="px-2" onClick={() => navigate('/owner-dashboard?tab=Messages')}><MessageSquare className="h-4 w-4" /></GhostButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>

      <ExportModal 
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
        title="Export Statement"
      />

      <EnterpriseDetailDrawer
        isOpen={!!selectedPayment}
        onClose={() => setSelectedPayment(null)}
        title="Payment Details"
        footerActions={
          <>
            <GhostButton className="flex-1 justify-center" onClick={() => navigate('/owner-dashboard?tab=Messages')}>
              <MessageSquare className="h-4 w-4 mr-2" /> Contact Tenant
            </GhostButton>
            <GoldButton className="flex-1 justify-center" onClick={() => showToast({ type: 'success', title: 'Payment Receipt', description: 'Receipt has been generated and sent.' })}>
              Download Receipt
            </GoldButton>
          </>
        }
      >
        {selectedPayment && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-4 items-center justify-between p-4 rounded-xl bg-navy-900 border border-white/5">
              <div>
                <div className="font-semibold text-cream text-lg">{selectedPayment.tenant}</div>
                <div className="text-xs text-ink/60">{selectedPayment.property}</div>
              </div>
              {'status' in selectedPayment && (
                <EnterpriseStatusBadge status={(selectedPayment as PaymentHistory).status} />
              )}
            </div>

            <div className="p-4 rounded-xl bg-navy-900 border border-white/5">
              <div className="text-[10px] text-ink/50 uppercase font-semibold mb-1">Amount</div>
              <div className="font-bold text-gold-400 text-2xl mb-1">{formatMoney(selectedPayment.amount)}</div>
              
              <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] text-ink/50 uppercase font-semibold mb-1">Date</div>
                  <div className="text-sm text-cream font-medium">{'date' in selectedPayment ? (selectedPayment as PaymentHistory).date : (selectedPayment as UpcomingPayment).dueDate}</div>
                </div>
                {'method' in selectedPayment && (
                  <div>
                    <div className="text-[10px] text-ink/50 uppercase font-semibold mb-1">Method</div>
                    <div className="text-sm text-cream font-medium">{(selectedPayment as PaymentHistory).method}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </EnterpriseDetailDrawer>
    </div>
  );
}

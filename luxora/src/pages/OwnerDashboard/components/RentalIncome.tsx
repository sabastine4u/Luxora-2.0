import { Wallet, ArrowUpRight, Clock, Receipt, CheckCircle2, AlertCircle, XCircle, FileText, Download, Eye, MessageSquare, TrendingUp, Home } from 'lucide-react';
import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { EmptyState } from '../../../components/layout/EmptyState';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { useToast } from '../../../contexts/ToastContext';

type PaymentStatus = 'Paid' | 'Pending' | 'Late' | 'Overdue' | 'Partial';

interface PropertyPerformance {
  id: string;
  property: string;
  tenant: string;
  rent: number;
  status: PaymentStatus;
  nextDueDate: string;
  occupancy: string;
}

interface PaymentHistory {
  id: string;
  date: string;
  tenant: string;
  property: string;
  amount: number;
  method: string;
  status: PaymentStatus;
}

interface UpcomingPayment {
  id: string;
  tenant: string;
  property: string;
  dueDate: string;
  amount: number;
}

// Mock Data
const mockPerformance: PropertyPerformance[] = [
  { id: '1', property: 'Garden Court Villa', tenant: 'Chidi Okafor', rent: 4700000, status: 'Paid', nextDueDate: 'Nov 01, 2025', occupancy: '100%' },
  { id: '2', property: 'Marina View Apartment', tenant: 'Bisi Williams', rent: 1300000, status: 'Pending', nextDueDate: 'Oct 05, 2025', occupancy: '100%' },
  { id: '3', property: 'Banana Island Plot', tenant: 'N/A', rent: 0, status: 'Overdue', nextDueDate: 'N/A', occupancy: '0% (Vacant)' }
];

const mockHistory: PaymentHistory[] = [
  { id: 'PH-001', date: 'Oct 01, 2025', tenant: 'Chidi Okafor', property: 'Garden Court Villa', amount: 4700000, method: 'Bank Transfer', status: 'Paid' },
  { id: 'PH-002', date: 'Sep 28, 2025', tenant: 'Bisi Williams', property: 'Marina View Apartment', amount: 650000, method: 'Card', status: 'Partial' },
  { id: 'PH-003', date: 'Sep 01, 2025', tenant: 'Chidi Okafor', property: 'Garden Court Villa', amount: 4700000, method: 'Bank Transfer', status: 'Paid' },
  { id: 'PH-004', date: 'Aug 15, 2025', tenant: 'Nnamdi Eze', property: 'Victoria Island Duplex', amount: 2500000, method: 'Cash', status: 'Late' }
];

const mockUpcoming: UpcomingPayment[] = [
  { id: 'UP-001', tenant: 'Bisi Williams', property: 'Marina View Apartment', dueDate: 'Oct 05, 2025', amount: 1300000 },
  { id: 'UP-002', tenant: 'Chidi Okafor', property: 'Garden Court Villa', dueDate: 'Nov 01, 2025', amount: 4700000 }
];

const chartData = [
  { month: 'Jan', income: 8.5 },
  { month: 'Feb', income: 8.5 },
  { month: 'Mar', income: 9.0 },
  { month: 'Apr', income: 9.0 },
  { month: 'May', income: 10.5 },
  { month: 'Jun', income: 10.5 },
  { month: 'Jul', income: 12.0 },
  { month: 'Aug', income: 12.0 },
  { month: 'Sep', income: 14.5 },
  { month: 'Oct', income: 14.5 },
  { month: 'Nov', income: 0 },
  { month: 'Dec', income: 0 },
];

export default function RentalIncome() {
  const { showToast } = useToast();
  const formatMoney = (val: number) => `₦${(val / 1000000).toFixed(1)}M`;

  const getStatusConfig = (status: PaymentStatus) => {
    switch (status) {
      case 'Paid': return { bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400', icon: CheckCircle2 };
      case 'Pending': return { bg: 'bg-blue-500/10 border-blue-500/20 text-blue-400', icon: Clock };
      case 'Late': return { bg: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400', icon: AlertCircle };
      case 'Overdue': return { bg: 'bg-rose-500/10 border-rose-500/20 text-rose-400', icon: XCircle };
      case 'Partial': return { bg: 'bg-purple-500/10 border-purple-500/20 text-purple-400', icon: Receipt };
    }
  };

  if (mockPerformance.length === 0) {
    return (
      <div className="space-y-6">
        <EmptyState
          icon={<Wallet className="h-8 w-8 text-gold-400" />}
          title="No rental income available."
          description="You do not have any rented properties generating income yet."
          actionLabel="View Listings"
          onAction={() => showToast({ type: 'info', title: 'View Listings', description: 'Listing navigation will be available during backend integration.' })}
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
          <GhostButton onClick={() => showToast({ type: 'info', title: 'Export Statement', description: 'Export features will be available during backend integration.' })}><FileText className="h-4 w-4 mr-2" /> Export Statement</GhostButton>
          <GoldButton onClick={() => showToast({ type: 'info', title: 'Download PDF', description: 'PDF downloads will be available during backend integration.' })}><Download className="h-4 w-4 mr-2" /> Download PDF</GoldButton>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Monthly Income', value: '₦14.5M', icon: Wallet, color: 'text-cream', bg: 'bg-white/5' },
          { label: 'Total Rental (YTD)', value: '₦108.0M', icon: ArrowUpRight, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { label: 'Occupancy Rate', value: '85%', icon: Home, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: 'Outstanding Rent', value: '₦2.5M', icon: AlertCircle, color: 'text-rose-400', bg: 'bg-rose-400/10' },
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
              {chartData.map((d, i) => {
                const heightPercent = (d.income / 15) * 100; // max income is 14.5, so 15 is a good ceiling
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
              {chartData.map((d, i) => <div key={i} className="w-full text-center">{d.month}</div>)}
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
                    render: (perf) => {
                      const cfg = getStatusConfig(perf.status);
                      return (
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${cfg.bg}`}>
                          {perf.status}
                        </span>
                      );
                    }
                  }
                ]}
              />
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-white/5">
              {mockPerformance.map(perf => {
                const cfg = getStatusConfig(perf.status);
                return (
                  <div key={perf.id} className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-cream">{perf.property}</div>
                        <div className="text-xs text-ink/50 mt-1">Tenant: {perf.tenant}</div>
                      </div>
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${cfg.bg}`}>
                        {perf.status}
                      </span>
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
                );
              })}
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
                    render: (hist) => {
                      const cfg = getStatusConfig(hist.status);
                      return (
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${cfg.bg}`}>
                          {hist.status}
                        </span>
                      );
                    }
                  }
                ]}
              />
            </div>

            <div className="md:hidden divide-y divide-white/5">
              {mockHistory.map(hist => {
                const cfg = getStatusConfig(hist.status);
                return (
                  <div key={hist.id} className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-cream">{hist.tenant}</div>
                        <div className="text-xs text-ink/50 mt-1">{hist.date} &bull; {hist.method}</div>
                      </div>
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${cfg.bg}`}>
                        {hist.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="text-xs text-ink/50 truncate max-w-[150px]">{hist.property}</div>
                      <div className="font-bold text-emerald-400 text-lg">+{formatMoney(hist.amount)}</div>
                    </div>
                  </div>
                );
              })}
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
                      <GhostButton size="sm" className="px-2" onClick={() => showToast({ type: 'info', title: 'View Details', description: 'Payment details will be available during backend integration.' })}><Eye className="h-4 w-4" /></GhostButton>
                      <GhostButton size="sm" className="px-2" onClick={() => showToast({ type: 'info', title: 'Contact Tenant', description: 'Messaging will be available during backend integration.' })}><MessageSquare className="h-4 w-4" /></GhostButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

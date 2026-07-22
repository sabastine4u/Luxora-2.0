import { useState } from 'react';
import { TrendingUp, Activity, Banknote, Building2 } from 'lucide-react';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { EnterpriseExportMenu, EnterpriseStatusBadge, EnterpriseDetailDrawer } from '../../../components/enterprise';
import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { useToast } from '../../../contexts/ToastContext';

interface RevenueItem {
  id: string;
  date: string;
  source: string;
  type: string;
  amount: string;
  status: string;
}

export default function Revenue() {
  const { showToast } = useToast();
  const [selectedItem, setSelectedItem] = useState<RevenueItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [search, setSearch] = useState('');

  const handleAction = (action: string) => {
    showToast({ type: 'success', title: 'Backend Integration', description: `This feature (${action}) is ready and will become fully functional during backend integration.` });
  };

  const handleExport = (format: string) => {
    handleAction(`Export as ${format.toUpperCase()}`);
  };

  const handleRowClick = (item: RevenueItem) => {
    setSelectedItem(item);
    setIsDrawerOpen(true);
  };

  const metrics = [
    { title: 'Total Gross Revenue', value: '₦4.82B', icon: TrendingUp, trend: '+18.2%', up: true },
    { title: 'Net Profit', value: '₦1.25B', icon: Activity, trend: '+12.4%', up: true },
    { title: 'Platform Fees', value: '₦482M', icon: Building2, trend: '+8.1%', up: true },
    { title: 'Outstanding Receivables', value: '₦120M', icon: Banknote, trend: '-5.2%', up: false, trendColor: 'text-emerald-400' },
  ];

  const mockData = [
    { id: 'REV-001', date: 'Oct 15, 2026', source: 'Property Sale - Ikoyi', type: 'Commission', amount: '₦15,000,000', status: 'Completed' },
    { id: 'REV-002', date: 'Oct 14, 2026', source: 'Property Management Fee', type: 'Service Fee', amount: '₦2,500,000', status: 'Completed' },
    { id: 'REV-003', date: 'Oct 12, 2026', source: 'Premium Listing Subscription', type: 'Subscription', amount: '₦150,000', status: 'Completed' },
    { id: 'REV-004', date: 'Oct 10, 2026', source: 'Property Sale - Lekki', type: 'Commission', amount: '₦8,200,000', status: 'Pending' },
    { id: 'REV-005', date: 'Oct 08, 2026', source: 'Legal Consulting Fee', type: 'Service Fee', amount: '₦500,000', status: 'Processing' },
  ];

  const columns = [
    { header: 'ID', accessorKey: 'id' },
    { header: 'Date', accessorKey: 'date' },
    { header: 'Source', accessorKey: 'source' },
    { header: 'Type', accessorKey: 'type' },
    { header: 'Amount', accessorKey: 'amount' },
    { 
      header: 'Status', 
      accessorKey: 'status',
      render: (item: RevenueItem) => <EnterpriseStatusBadge status={item.status} />
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Revenue Analytics</h2>
          <p className="text-sm text-ink/60">Comprehensive revenue tracking and analysis.</p>
        </div>
        <div className="flex gap-3">
          <EnterpriseExportMenu onExport={handleExport} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <KPICard 
            key={m.title}
            title={m.title}
            value={m.value}
            icon={m.icon}
            trend={m.trend}
            trendColor={m.trendColor || (m.up ? 'text-emerald-400' : 'text-rose-400')}
            iconColor="text-gold-400"
            backgroundColor="bg-gold-400/10"
            trendPosition="bottom-right"
          />
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col">
        <h3 className="font-heading text-lg font-semibold text-cream mb-6 flex items-center gap-2">
          <Activity className="h-5 w-5 text-gold-400" /> Revenue vs. Projections
        </h3>
        <div className="flex-1 h-[300px] border-b border-l border-white/10 relative flex items-end justify-between px-4 pt-10 pb-4">
           {/* Mock Chart Bars */}
           {[40, 60, 45, 80, 55, 90, 75, 100, 85, 95, 70, 85].map((h, i) => (
             <div key={i} className="w-8 md:w-12 flex items-end gap-1 group">
               <div className="w-3 md:w-5 bg-gold-400/20 rounded-t-sm transition-all group-hover:bg-gold-400/40" style={{ height: `${h * 0.8}%` }}></div>
               <div className="w-3 md:w-5 bg-gold-400 rounded-t-sm transition-all group-hover:bg-gold-300 shadow-[0_0_15px_rgba(212,175,55,0.2)]" style={{ height: `${h}%` }}></div>
             </div>
           ))}
        </div>
        <div className="flex justify-between px-4 mt-4 text-[10px] md:text-xs text-ink/40 font-medium">
          <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-heading text-lg font-semibold text-cream">Recent Revenue</h3>
        <DataTableToolbar 
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search revenue..."
          showFilter
          onFilter={() => handleAction('Open Filters')}
        />
        <DataTable 
          data={mockData.filter(d => d.source.toLowerCase().includes(search.toLowerCase()) || d.id.toLowerCase().includes(search.toLowerCase()))}
          columns={columns}
          keyExtractor={(item) => item.id}
          onRowClick={handleRowClick}
        />
      </div>

      <EnterpriseDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Revenue Details"
        subtitle={selectedItem?.id}
        footerActions={
          <>
            <GhostButton onClick={() => handleExport('pdf')}>Download Receipt</GhostButton>
            {selectedItem?.status === 'Pending' && (
              <GoldButton onClick={() => handleAction('Process Payment')}>Process Payment</GoldButton>
            )}
          </>
        }
      >
        {selectedItem && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink/60">Status</span>
              <EnterpriseStatusBadge status={selectedItem.status} />
            </div>
            
            <div className="space-y-4 rounded-xl border border-white/10 bg-navy-900/50 p-4">
              <div className="flex justify-between">
                <span className="text-sm text-ink/60">Date</span>
                <span className="text-sm font-medium text-cream">{selectedItem.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-ink/60">Source</span>
                <span className="text-sm font-medium text-cream text-right ml-4">{selectedItem.source}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-ink/60">Type</span>
                <span className="text-sm font-medium text-cream">{selectedItem.type}</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-4 mt-4">
                <span className="text-sm font-bold text-cream">Total Amount</span>
                <span className="text-lg font-bold text-gold-400">{selectedItem.amount}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-cream">Notes</h4>
              <p className="text-sm text-ink/60">
                This revenue entry is associated with the successful closure of the property deal in Ikoyi. All platform fees and agent commissions have been deducted.
              </p>
            </div>
          </div>
        )}
      </EnterpriseDetailDrawer>
    </div>
  );
}

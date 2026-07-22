import { useState } from 'react';
import { Building2 } from 'lucide-react';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { EnterpriseStatusBadge, EnterpriseExportMenu, EnterpriseDetailDrawer } from '../../../components/enterprise';
import { useToast } from '../../../contexts/ToastContext';

interface AgencyEarningItem {
  id: string;
  agency: string;
  deals: number;
  commission: string;
  period: string;
  status: string;
}

export default function AgencyEarnings() {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [selectedEarn, setSelectedEarn] = useState<AgencyEarningItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleAction = (action: string) => {
    showToast({ type: 'success', title: 'Backend Integration', description: `This feature (${action}) is ready and will become fully functional during backend integration.` });
  };

  const earnings = [
    { id: 'AG-EARN-01', agency: 'Prime Real Estate', deals: 14, commission: '₦4,200,000', period: 'Sep 2026', status: 'Paid' },
    { id: 'AG-EARN-02', agency: 'Lagos Homes Ltd', deals: 8, commission: '₦1,850,000', period: 'Sep 2026', status: 'Paid' },
    { id: 'AG-EARN-03', agency: 'Abuja Elite Properties', deals: 5, commission: '₦950,000', period: 'Sep 2026', status: 'Pending' },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Agency Earnings</h2>
          <p className="text-sm text-ink/60">Track and disburse agency-level commissions and platform earnings.</p>
        </div>
        <EnterpriseExportMenu onExport={(f) => handleAction(`Export as ${f.toUpperCase()}`)} />
      </div>

      <div className="space-y-4">
        <DataTableToolbar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by agency..."
          showFilter
          onFilter={() => handleAction('Filter Earnings')}
        />

        <DataTable
          data={earnings.filter(e => e.agency.toLowerCase().includes(search.toLowerCase()))}
          keyExtractor={(earn) => earn.id}
          onRowClick={(earn) => { setSelectedEarn(earn); setIsDrawerOpen(true); }}
          columns={[
            {
              header: "Ref ID",
              render: (earn) => <span className="font-medium text-cream">{earn.id}</span>
            },
            {
              header: "Agency Name",
              render: (earn) => (
                <div className="font-semibold text-cream flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-ink/40" /> {earn.agency}
                </div>
              )
            },
            {
              header: "Deals Closed",
              render: (earn) => <span className="text-ink/60">{earn.deals}</span>
            },
            {
              header: "Period",
              render: (earn) => <span className="text-ink/60">{earn.period}</span>
            },
            {
              header: "Status",
              render: (earn) => <EnterpriseStatusBadge status={earn.status} />
            },
            {
              header: <div className="text-right">Total Commission</div>,
              className: "text-right font-bold text-gold-400",
              render: (earn) => earn.commission
            }
          ]}
        />
      </div>

      <EnterpriseDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Agency Earning Details"
        subtitle={selectedEarn?.id}
        footerActions={
          <>
            <GhostButton onClick={() => handleAction('Download Statement')}>Download Statement</GhostButton>
            {selectedEarn?.status === 'Pending' && (
              <GoldButton onClick={() => handleAction('Process Payment')}>Process Payment</GoldButton>
            )}
          </>
        }
      >
        {selectedEarn && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink/60">Status</span>
              <EnterpriseStatusBadge status={selectedEarn.status} />
            </div>
            
            <div className="space-y-4 rounded-xl border border-white/10 bg-navy-900/50 p-4">
              <div className="flex justify-between">
                <span className="text-sm text-ink/60">Agency</span>
                <span className="text-sm font-medium text-cream">{selectedEarn.agency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-ink/60">Period</span>
                <span className="text-sm font-medium text-cream">{selectedEarn.period}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-ink/60">Deals Closed</span>
                <span className="text-sm font-medium text-cream">{selectedEarn.deals}</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-4 mt-4">
                <span className="text-sm font-bold text-cream">Total Commission</span>
                <span className="text-lg font-bold text-gold-400">{selectedEarn.commission}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-cream">Commission Breakdown</h4>
              <p className="text-xs text-ink/60">
                Includes all performance bonuses and standard commission splits for the specified period.
              </p>
            </div>
          </div>
        )}
      </EnterpriseDetailDrawer>
    </div>
  );
}

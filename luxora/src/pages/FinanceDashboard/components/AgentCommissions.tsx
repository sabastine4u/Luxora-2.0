import { useState } from 'react';
import { Users } from 'lucide-react';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { EnterpriseStatusBadge, EnterpriseExportMenu, EnterpriseDetailDrawer } from '../../../components/enterprise';
import { useToast } from '../../../contexts/ToastContext';

interface AgentCommissionItem {
  id: string;
  agent: string;
  property: string;
  amount: string;
  status: string;
  date: string;
}

export default function AgentCommissions() {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [selectedCom, setSelectedCom] = useState<AgentCommissionItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleAction = (action: string) => {
    showToast({ type: 'success', title: 'Backend Integration', description: `This feature (${action}) is ready and will become fully functional during backend integration.` });
  };

  const commissions = [
    { id: 'AGT-COM-01', agent: 'Samuel Ojo', property: 'Lekki Phase 1 Apt', amount: '₦240,000', status: 'Paid', date: 'Oct 05, 2026' },
    { id: 'AGT-COM-02', agent: 'Chioma Eze', property: 'Victoria Island Villa', amount: '₦450,000', status: 'Pending', date: 'Oct 06, 2026' },
    { id: 'AGT-COM-03', agent: 'Tunde Bakare', property: 'Maitama Duplex', amount: '₦180,000', status: 'Paid', date: 'Oct 02, 2026' },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Independent Agent Commissions</h2>
          <p className="text-sm text-ink/60">Disburse commissions to individual verified agents on the platform.</p>
        </div>
        <EnterpriseExportMenu onExport={(f) => handleAction(`Export as ${f.toUpperCase()}`)} />
      </div>

      <div className="space-y-4">
        <DataTableToolbar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by agent or property..."
          showFilter
          onFilter={() => handleAction('Filter Commissions')}
        />

        <DataTable
          data={commissions.filter(c => c.agent.toLowerCase().includes(search.toLowerCase()) || c.property.toLowerCase().includes(search.toLowerCase()))}
          keyExtractor={(com) => com.id}
          onRowClick={(com) => { setSelectedCom(com); setIsDrawerOpen(true); }}
          columns={[
            {
              header: "Ref ID",
              render: (com) => <span className="font-medium text-cream">{com.id}</span>
            },
            {
              header: "Agent Name",
              render: (com) => (
                <div className="font-semibold text-cream flex items-center gap-2">
                  <Users className="h-4 w-4 text-ink/40" /> {com.agent}
                </div>
              )
            },
            {
              header: "Property Sold/Rented",
              render: (com) => <span className="text-ink/60">{com.property}</span>
            },
            {
              header: "Date",
              render: (com) => <span className="text-ink/60">{com.date}</span>
            },
            {
              header: "Status",
              render: (com) => <EnterpriseStatusBadge status={com.status} />
            },
            {
              header: <div className="text-right">Commission</div>,
              className: "text-right font-bold text-gold-400",
              render: (com) => com.amount
            }
          ]}
        />
      </div>

      <EnterpriseDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Agent Commission Details"
        subtitle={selectedCom?.id}
        footerActions={
          <>
            <GhostButton onClick={() => handleAction('Print Statement')}>Print Statement</GhostButton>
            {selectedCom?.status === 'Pending' && (
              <GoldButton onClick={() => handleAction('Disburse Commission')}>Disburse Commission</GoldButton>
            )}
          </>
        }
      >
        {selectedCom && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink/60">Status</span>
              <EnterpriseStatusBadge status={selectedCom.status} />
            </div>
            
            <div className="space-y-4 rounded-xl border border-white/10 bg-navy-900/50 p-4">
              <div className="flex justify-between">
                <span className="text-sm text-ink/60">Date</span>
                <span className="text-sm font-medium text-cream">{selectedCom.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-ink/60">Agent</span>
                <span className="text-sm font-medium text-cream">{selectedCom.agent}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-ink/60">Property</span>
                <span className="text-sm font-medium text-cream">{selectedCom.property}</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-4 mt-4">
                <span className="text-sm font-bold text-cream">Commission Amount</span>
                <span className="text-lg font-bold text-gold-400">{selectedCom.amount}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-cream">Bonus History</h4>
              <p className="text-xs text-ink/60">
                Agent has met the monthly target. An additional performance bonus of 2% has been applied to this commission.
              </p>
            </div>
          </div>
        )}
      </EnterpriseDetailDrawer>
    </div>
  );
}

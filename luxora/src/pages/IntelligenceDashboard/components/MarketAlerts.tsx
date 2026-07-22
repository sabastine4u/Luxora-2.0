import { useState } from 'react';
import { Plus, Bell, Trash2 } from 'lucide-react';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { EnterpriseStatusBadge, EnterpriseDetailDrawer } from '../../../components/enterprise';
import { useToast } from '../../../contexts/ToastContext';
import type { MarketAlert } from '../types';

export default function MarketAlerts() {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<MarketAlert | null>(null);

  const handleAction = (action: string) => {
    showToast({ type: 'success', title: 'Backend Integration', description: `This feature (${action}) is ready and will become fully functional during backend integration.` });
  };

  const alerts: MarketAlert[] = [
    { id: 'AL-1', title: 'Lekki Price Drop', description: 'Triggered when Lekki avg price drops by >5%', threshold: '-5%', type: 'Price Drop', status: 'Active', date: 'Oct 01, 2025' },
    { id: 'AL-2', title: 'Victoria Island Demand', description: 'Triggered when VI demand index exceeds 85', threshold: '>85', type: 'Demand Spike', status: 'Triggered', date: 'Oct 15, 2025' },
    { id: 'AL-3', title: 'Abuja Inventory Shortage', description: 'Triggered when Abuja inventory level falls below Normal', threshold: 'Low', type: 'Inventory Alert', status: 'Resolved', date: 'Sep 20, 2025' },
  ];

  const filteredAlerts = alerts.filter(a => a.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Market Alerts</h2>
          <p className="text-sm text-ink/60">Manage threshold-based notifications for market events.</p>
        </div>
        <div className="flex gap-3">
          <GoldButton onClick={() => handleAction('Create New Alert')}>
            <Plus className="h-4 w-4 mr-2" /> New Alert
          </GoldButton>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col">
        <DataTableToolbar 
          searchPlaceholder="Search alerts..."
          searchValue={search}
          onSearchChange={setSearch}
          showFilter={true}
          onFilter={() => handleAction('Open Filters')}
        />
        
        <DataTable
          data={filteredAlerts}
          keyExtractor={(a) => a.id}
          onRowClick={(a) => { setSelectedAlert(a); setIsDrawerOpen(true); }}
          columns={[
            {
              header: "Alert Title",
              render: (a) => (
                <div className="font-medium text-cream flex items-center gap-2">
                  <Bell className="h-4 w-4 text-gold-400" /> {a.title}
                </div>
              )
            },
            {
              header: "Type",
              render: (a) => <span className="text-ink/60">{a.type}</span>
            },
            {
              header: "Threshold",
              render: (a) => <span className="text-cream font-medium">{a.threshold}</span>
            },
            {
              header: "Created",
              render: (a) => <span className="text-ink/60">{a.date}</span>
            },
            {
              header: "Status",
              render: (a) => (
                <EnterpriseStatusBadge 
                  status={a.status} 
                />
              )
            },
            {
              header: "Actions",
              className: "text-right",
              render: () => (
                <div className="flex justify-end gap-2">
                  <GhostButton size="sm" className="text-ink/60 hover:text-rose-400" onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleAction('Delete Alert'); }}><Trash2 className="h-4 w-4" /></GhostButton>
                </div>
              )
            }
          ]}
        />
      </div>

      <EnterpriseDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Alert Details"
        subtitle={selectedAlert?.title}
      >
        {selectedAlert && (
          <div className="space-y-6">
            <div className="rounded-xl border border-white/10 bg-navy-900/50 p-4">
               <h4 className="text-sm font-semibold text-cream mb-2">Configuration</h4>
               <p className="text-sm text-ink/80 mb-4">{selectedAlert.description}</p>
               
               <div className="flex items-center justify-between py-2 border-b border-white/10">
                  <span className="text-xs text-ink/60">Current Status</span>
                  <EnterpriseStatusBadge status={selectedAlert.status} />
               </div>
               <div className="flex items-center justify-between py-2 border-b border-white/10">
                  <span className="text-xs text-ink/60">Threshold Condition</span>
                  <span className="text-sm text-cream font-medium">{selectedAlert.threshold}</span>
               </div>
               <div className="flex items-center justify-between py-2 border-b border-white/10">
                  <span className="text-xs text-ink/60">Alert Type</span>
                  <span className="text-sm text-cream">{selectedAlert.type}</span>
               </div>
            </div>

            <div className="pt-4 flex flex-col gap-3">
               {selectedAlert.status === 'Triggered' && (
                 <GoldButton className="w-full" onClick={() => { handleAction('Resolve Alert'); setIsDrawerOpen(false); }}>
                   Mark as Resolved
                 </GoldButton>
               )}
               <GhostButton className="w-full text-rose-400 hover:text-rose-300" onClick={() => { handleAction('Delete Alert'); setIsDrawerOpen(false); }}>
                 <Trash2 className="h-4 w-4 mr-2" /> Delete Alert
               </GhostButton>
            </div>
          </div>
        )}
      </EnterpriseDetailDrawer>
    </div>
  );
}

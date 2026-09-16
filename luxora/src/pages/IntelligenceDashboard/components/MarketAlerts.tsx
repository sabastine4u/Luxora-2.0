import { useState } from 'react';
import { Plus, Bell, Trash2 } from 'lucide-react';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { EnterpriseStatusBadge, EnterpriseDetailDrawer } from '../../../components/enterprise';
import { useToast } from '../../../contexts/ToastContext';
import type { MarketAlert } from '../types';
import { intelligenceApi } from '../../../api/intelligence.api';
import { useIntelligenceQuery } from '../useIntelligenceQuery';

export default function MarketAlerts() {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<MarketAlert | null>(null);
  const { data, loading, error, retry } = useIntelligenceQuery(() => intelligenceApi.getAlerts(), []);

  const handleAction = (action: string) => {
    showToast({ type: 'success', title: 'Backend Integration', description: `This feature (${action}) is ready and will become fully functional during backend integration.` });
  };

  const alerts: MarketAlert[] = (data?.alerts || []).map((item: any) => ({ id:String(item.propertyId),title:item.rule,description:(item.details || []).join(', '),threshold:item.threshold,type:item.source,status:'Triggered',date:item.evaluatedPeriod }));

  const filteredAlerts = alerts.filter(a => a.title.toLowerCase().includes(search.toLowerCase()));
  if (loading) return <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-10 text-center text-ink/60">Loading deterministic alerts…</div>;
  if (error) return <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-10 text-center text-ink/60">{error}<button onClick={retry} className="block mx-auto mt-4 text-gold-400">Retry</button></div>;
  if (!alerts.length) return <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-10 text-center text-ink/60">No deterministic data-quality alerts are currently triggered.<button onClick={retry} className="block mx-auto mt-4 text-gold-400">Retry</button></div>;

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Market Alerts</h2>
          <p className="text-sm text-ink/60">Manage threshold-based notifications for market events.</p>
        </div>
        <div className="flex gap-3">
          <GoldButton disabled title="Read-only deterministic alerts">
            <Plus className="h-4 w-4 mr-2" /> Read-only
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
                  <GhostButton size="sm" disabled title="Read-only deterministic alert"><Trash2 className="h-4 w-4" /></GhostButton>
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
               <GoldButton className="w-full" disabled>
                 Read-only Alert
               </GoldButton>
               <GhostButton className="w-full text-ink/40" disabled>
                 <Trash2 className="h-4 w-4 mr-2" /> Delete Alert
               </GhostButton>
            </div>
          </div>
        )}
      </EnterpriseDetailDrawer>
    </div>
  );
}

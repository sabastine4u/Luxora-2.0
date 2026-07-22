import { useState } from 'react';
import { Home } from 'lucide-react';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { EnterpriseExportMenu, EnterpriseDetailDrawer } from '../../../components/enterprise';
import { useToast } from '../../../contexts/ToastContext';
import type { ComparableProperty } from '../types';

export default function ComparableProperties() {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<ComparableProperty | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleAction = (action: string) => {
    showToast({ type: 'success', title: 'Backend Integration', description: `This feature (${action}) is ready and will become fully functional during backend integration.` });
  };

  const comps: ComparableProperty[] = [
    { id: 'C-1', address: '14 Admiralty Way', bedsBaths: '4 / 4.5', size: '450', date: 'Sep 15, 2025', price: '₦205,000,000', type: 'Villa', yearBuilt: 2020, condition: 'Excellent', distance: '0.2 km' },
    { id: 'C-2', address: '8 Fola Osibo St', bedsBaths: '4 / 5', size: '480', date: 'Aug 22, 2025', price: '₦215,000,000', type: 'Villa', yearBuilt: 2019, condition: 'Good', distance: '0.5 km' },
    { id: 'C-3', address: '22 Freedom Way', bedsBaths: '4 / 4', size: '420', date: 'Jul 10, 2025', price: '₦198,000,000', type: 'Villa', yearBuilt: 2022, condition: 'Excellent', distance: '0.8 km' }
  ];

  const filteredComps = comps.filter(c => c.address.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream flex items-center gap-2">
             <Home className="h-6 w-6 text-gold-400" /> Comparable Properties
          </h2>
          <p className="text-sm text-ink/60">CMA (Comparative Market Analysis) for accurate pricing.</p>
        </div>
        <div className="flex gap-3">
          <EnterpriseExportMenu onExport={(f) => handleAction(`Export CMA Report as ${f.toUpperCase()}`)} />
          <GoldButton onClick={() => handleAction('Add Subject Property')}>
            Add Subject Property
          </GoldButton>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
         <div className="bg-navy-800/50 rounded-2xl border border-gold-400/30 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gold-400 text-navy-900 text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase">Estimated Value</div>
            <div className="text-sm text-ink/60 mb-1">Subject Property</div>
            <div className="font-heading text-3xl font-bold text-gold-400 mb-2">₦210,000,000</div>
            <div className="text-xs text-ink/40">Confidence Score: High (94%)</div>
         </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
           <h3 className="font-heading text-lg font-bold text-cream">Recent Comparable Sales</h3>
           <GhostButton size="sm" onClick={() => handleAction('Adjust Criteria')}>Adjust Criteria</GhostButton>
        </div>

        <DataTableToolbar 
          searchPlaceholder="Search properties..."
          searchValue={search}
          onSearchChange={setSearch}
          showFilter={true}
          onFilter={() => handleAction('Open Filters')}
        />
        
        <DataTable
          data={filteredComps}
          keyExtractor={(c) => c.id}
          onRowClick={(c) => { setSelectedProperty(c); setIsDrawerOpen(true); }}
          columns={[
            {
              header: "Address",
              render: (c) => (
                <div className="font-semibold text-cream flex items-center gap-2">
                  <Home className="h-4 w-4 text-ink/40" /> {c.address}
                </div>
              )
            },
            {
              header: "Beds/Baths",
              render: (c) => <span className="text-ink/60">{c.bedsBaths}</span>
            },
            {
              header: "Size (SQM)",
              render: (c) => <span className="text-ink/60">{c.size}</span>
            },
            {
              header: "Sale Date",
              render: (c) => <span className="text-ink/60">{c.date}</span>
            },
            {
              header: <div className="text-right">Sold Price</div>,
              className: "text-right font-bold text-emerald-400",
              render: (c) => c.price
            }
          ]}
        />
      </div>

      <EnterpriseDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Property Details"
        subtitle={selectedProperty?.address}
      >
        {selectedProperty && (
          <div className="space-y-6">
             <div className="h-48 w-full rounded-xl overflow-hidden relative bg-navy-900 border border-white/10">
                {/* Mock image placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                   <Home className="h-12 w-12 text-ink/20" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-navy-950 to-transparent">
                   <div className="font-heading text-2xl font-bold text-cream">{selectedProperty.price}</div>
                   <div className="text-xs text-ink/60">Sold on {selectedProperty.date}</div>
                </div>
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                   <div className="text-xs text-ink/60 mb-1">Property Type</div>
                   <div className="font-semibold text-cream">{selectedProperty.type}</div>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                   <div className="text-xs text-ink/60 mb-1">Distance</div>
                   <div className="font-semibold text-cream">{selectedProperty.distance}</div>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                   <div className="text-xs text-ink/60 mb-1">Year Built</div>
                   <div className="font-semibold text-cream">{selectedProperty.yearBuilt}</div>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                   <div className="text-xs text-ink/60 mb-1">Condition</div>
                   <div className="font-semibold text-cream">{selectedProperty.condition}</div>
                </div>
             </div>

             <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                <GoldButton className="w-full" onClick={() => { handleAction('Include in Final Report'); setIsDrawerOpen(false); }}>
                   Include in Report
                </GoldButton>
                <GhostButton className="w-full text-rose-400 hover:text-rose-300" onClick={() => { handleAction('Exclude from CMA'); setIsDrawerOpen(false); }}>
                   Exclude Subject
                </GhostButton>
             </div>
          </div>
        )}
      </EnterpriseDetailDrawer>
    </div>
  );
}

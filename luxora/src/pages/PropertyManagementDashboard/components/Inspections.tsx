import { useState } from 'react';
import { CalendarIcon, Eye, Upload } from 'lucide-react';
import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';
import { InspectionFormModal } from './modals/InspectionFormModal';
import { UploadModal } from './modals/UploadModal';
import { useToast } from '../../../contexts/ToastContext';
import type { Inspection } from '../../../types';



export default function Inspections() {
  const inspections: Inspection[] = [
    { id: 'INSP-301', propertyId: 'Lekki Studio Apt', type: 'Move-out', date: 'Nov 28, 2025', inspector: 'John Davis', status: 'Scheduled', score: undefined, unit: 'Apt 4B' },
    { id: 'INSP-302', propertyId: 'Victoria Island Villa', type: 'Routine', date: 'Sep 15, 2025', inspector: 'Mike Tyson', status: 'Completed', score: 95, unit: 'Entire House' },
    { id: 'INSP-303', propertyId: 'Abuja Central Office', type: 'Routine', date: 'Aug 10, 2025', inspector: 'Sarah Jenkins', status: 'Completed', score: 88, unit: 'Floor 3' },
  ];

  const { showToast } = useToast();
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);
  const [modalState, setModalState] = useState<'schedule' | 'upload' | null>(null);

  const handleAction = (action: string) => {
    showToast({
      title: 'Backend Integration',
      description: `Action "${action}" is ready for backend integration.`,
      type: 'info'
    });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Property Inspections</h2>
          <p className="text-sm text-ink/60">Schedule and review property condition reports.</p>
        </div>
        <GoldButton className="flex items-center gap-2" onClick={() => setModalState('schedule')}><CalendarIcon className="h-4 w-4" /> Schedule Inspection</GoldButton>
      </div>

      <DataTable
        data={inspections}
        keyExtractor={(insp) => insp.id}
        columns={[
          {
            header: "Property",
            render: (insp) => (
              <div className="font-semibold text-cream flex items-center gap-2">
                <Eye className="h-4 w-4 text-ink/40" /> {insp.propertyId}
              </div>
            )
          },
          {
            header: "Inspection Type",
            render: (insp) => <span className="text-ink/60">{insp.type}</span>
          },
          {
            header: "Date",
            render: (insp) => <span className="text-ink/60">{insp.date}</span>
          },
          {
            header: "Inspector",
            render: (insp) => <span className="text-ink/60">{insp.inspector}</span>
          },
          {
            header: "Status",
            render: (insp) => <EnterpriseStatusBadge status={insp.status} />
          },
          {
            header: <div className="text-right">Score</div>,
            className: "text-right font-bold text-cream",
            render: (insp) => insp.score ? `${insp.score}%` : '-'
          }
        ]}
        onRowClick={(insp) => setSelectedInspection(insp)}
      />

      <EnterpriseDetailDrawer
        isOpen={!!selectedInspection}
        onClose={() => setSelectedInspection(null)}
        title="Inspection Details"
      >
        {selectedInspection && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-navy-800/50 border border-white/10 space-y-4">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gold-400/10 flex items-center justify-center text-gold-400">
                    <Eye className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-cream">{selectedInspection.propertyId}</h3>
                    <div className="text-xs text-ink/60">{selectedInspection.id}</div>
                  </div>
                </div>
                <EnterpriseStatusBadge status={selectedInspection.status} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-ink/60 mb-1">Type</div>
                  <div className="font-medium text-cream">{selectedInspection.type}</div>
                </div>
                <div>
                  <div className="text-xs text-ink/60 mb-1">Date</div>
                  <div className="font-medium text-cream">{selectedInspection.date}</div>
                </div>
                <div>
                  <div className="text-xs text-ink/60 mb-1">Inspector</div>
                  <div className="font-medium text-cream">{selectedInspection.inspector}</div>
                </div>
                <div>
                  <div className="text-xs text-ink/60 mb-1">Score</div>
                  <div className="font-medium text-cream">{selectedInspection.score ? `${selectedInspection.score}%` : 'N/A'}</div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4 border-t border-white/10">
              <GoldButton className="flex-1" onClick={() => { handleAction(`Download Report for ${selectedInspection.id}`); setSelectedInspection(null); }}>
                Download Report
              </GoldButton>
              <GhostButton onClick={() => { setModalState('upload'); }}>
                <Upload className="h-4 w-4 mr-2" /> Upload Report
              </GhostButton>
            </div>
          </div>
        )}
      </EnterpriseDetailDrawer>

      <InspectionFormModal 
        isOpen={modalState === 'schedule'}
        onClose={() => setModalState(null)}
        onSubmit={(data: { propertyId: string }) => handleAction(`Schedule Inspection for ${data.propertyId}`)}
      />

      <UploadModal 
        isOpen={modalState === 'upload'}
        onClose={() => setModalState(null)}
        title="Upload Inspection Report"
        onSubmit={(data: { name: string }) => {
          handleAction(`Upload Report: ${data.name}`);
          setSelectedInspection(null);
        }}
      />
    </div>
  );
}

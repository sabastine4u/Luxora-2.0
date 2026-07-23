import { MessageSquare, Plus, Clock } from 'lucide-react';
import { useState } from 'react';
import { GoldButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal';
import { useWorkflowToast } from '../utils/workflowUtils';

export default function RFQs() {
  const { showWorkflowToast } = useWorkflowToast();
  
  const [confirmationState, setConfirmationState] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmText: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    confirmText: 'Confirm',
    onConfirm: () => {}
  });

  const handleAction = (action: string, rfqId?: string) => {
    setConfirmationState({
      isOpen: true,
      title: action,
      description: rfqId ? `Are you sure you want to ${action.toLowerCase()} for RFQ ${rfqId}?` : `Are you sure you want to ${action.toLowerCase()}?`,
      confirmText: action.split(' ')[0],
      onConfirm: () => showWorkflowToast(action)
    });
  };
  const rfqs = [
    { id: 'RFQ-24-001', title: 'Office Furniture (Abuja)', deadline: 'Oct 20, 2025', quotes: 3, status: 'Open' },
    { id: 'RFQ-24-002', title: 'Cloud Hosting Services', deadline: 'Oct 15, 2025', quotes: 5, status: 'Evaluating' },
    { id: 'RFQ-24-003', title: 'Janitorial Services (HQ)', deadline: 'Sep 30, 2025', quotes: 2, status: 'Awarded' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Request for Quotes (RFQs)</h2>
          <p className="text-sm text-ink/60">Manage bidding processes and evaluate supplier quotes.</p>
        </div>
        <GoldButton className="flex items-center gap-2" onClick={() => handleAction('Create RFQ')}><Plus className="h-4 w-4" /> Create RFQ</GoldButton>
      </div>

      <DataTable
        data={rfqs}
        keyExtractor={(rfq) => rfq.id}
        columns={[
          {
            header: "RFQ ID",
            render: (rfq) => <span className="font-medium text-cream">{rfq.id}</span>
          },
          {
            header: "Title",
            render: (rfq) => (
              <div className="font-semibold text-cream flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-ink/40" /> {rfq.title}
              </div>
            )
          },
          {
            header: "Deadline",
            render: (rfq) => <div className="text-ink/60 flex items-center gap-1"><Clock className="h-3 w-3" /> {rfq.deadline}</div>
          },
          {
            header: "Quotes Received",
            render: (rfq) => <span className="font-bold text-blue-400">{rfq.quotes}</span>
          },
          {
            header: "Status",
            render: (rfq) => (
              <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${rfq.status === 'Open' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : rfq.status === 'Evaluating' ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' : 'text-blue-400 bg-blue-400/10 border-blue-400/20'}`}>
                {rfq.status}
              </span>
            )
          },
          {
            header: <div className="text-right">Actions</div>,
            className: "text-right",
            render: (rfq) => (
              <button 
                className="text-gold-400 hover:text-gold-300 font-medium text-xs transition-colors"
                onClick={() => handleAction('View RFQ Details', rfq.id)}
              >View Details</button>
            )
          }
        ]}
      />
      <ConfirmationModal
        isOpen={confirmationState.isOpen}
        onClose={() => setConfirmationState(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmationState.onConfirm}
        title={confirmationState.title}
        description={confirmationState.description}
        confirmText={confirmationState.confirmText}
      />
    </div>
  );
}

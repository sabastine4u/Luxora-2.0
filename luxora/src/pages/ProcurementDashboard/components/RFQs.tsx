import { MessageSquare, Plus, Clock } from 'lucide-react';
import { GoldButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { useWorkflowToast } from '../utils/workflowUtils';

export default function RFQs() {
  const { showWorkflowToast } = useWorkflowToast();
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
        <GoldButton className="flex items-center gap-2" onClick={() => showWorkflowToast('Create RFQ')}><Plus className="h-4 w-4" /> Create RFQ</GoldButton>
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
            render: () => (
              <button 
                className="text-gold-400 hover:text-gold-300 font-medium text-xs transition-colors"
                onClick={() => showWorkflowToast('View RFQ Details')}
              >View Details</button>
            )
          }
        ]}
      />
    </div>
  );
}

import { CalendarIcon, Eye, CheckCircle2 } from 'lucide-react';
import { GoldButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';

export default function Inspections() {
  const inspections = [
    { id: 'INSP-301', property: 'Lekki Studio Apt', type: 'Move-out', date: 'Nov 28, 2025', inspector: 'John Davis', status: 'Scheduled' },
    { id: 'INSP-302', property: 'Victoria Island Villa', type: 'Annual Maintenance', date: 'Sep 15, 2025', inspector: 'Mike Tyson', status: 'Completed', score: '95%' },
    { id: 'INSP-303', property: 'Abuja Central Office', type: 'Safety Check', date: 'Aug 10, 2025', inspector: 'Sarah Jenkins', status: 'Completed', score: '88%' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Property Inspections</h2>
          <p className="text-sm text-ink/60">Schedule and review property condition reports.</p>
        </div>
        <GoldButton className="flex items-center gap-2"><CalendarIcon className="h-4 w-4" /> Schedule Inspection</GoldButton>
      </div>

      <DataTable
        data={inspections}
        keyExtractor={(insp) => insp.id}
        columns={[
          {
            header: "Property",
            render: (insp) => (
              <div className="font-semibold text-cream flex items-center gap-2">
                <Eye className="h-4 w-4 text-ink/40" /> {insp.property}
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
            render: (insp) => (
              <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${insp.status === 'Completed' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : 'text-blue-400 bg-blue-400/10 border-blue-400/20'}`}>
                {insp.status === 'Completed' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                {insp.status}
              </span>
            )
          },
          {
            header: <div className="text-right">Score</div>,
            className: "text-right font-bold text-cream",
            render: (insp) => insp.score ? insp.score : '-'
          }
        ]}
      />
    </div>
  );
}

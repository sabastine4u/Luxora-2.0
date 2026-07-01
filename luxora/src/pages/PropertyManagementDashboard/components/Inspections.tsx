import { Eye, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';
import { GoldButton } from '../../../components/ui/ui';

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

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-navy-800/50">
        <table className="w-full text-left text-sm">
          <thead className="bg-navy-900/50 text-xs uppercase text-ink/50 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-semibold">Property</th>
              <th className="px-6 py-4 font-semibold">Inspection Type</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">Inspector</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {inspections.map((insp) => (
              <tr key={insp.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-semibold text-cream flex items-center gap-2">
                  <Eye className="h-4 w-4 text-ink/40" /> {insp.property}
                </td>
                <td className="px-6 py-4 text-ink/60">{insp.type}</td>
                <td className="px-6 py-4 text-ink/60">{insp.date}</td>
                <td className="px-6 py-4 text-ink/60">{insp.inspector}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${insp.status === 'Completed' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : 'text-blue-400 bg-blue-400/10 border-blue-400/20'}`}>
                    {insp.status === 'Completed' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                    {insp.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-bold text-cream">
                  {insp.score ? insp.score : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

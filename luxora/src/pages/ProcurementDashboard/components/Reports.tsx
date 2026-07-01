import { FileBarChart, Download } from 'lucide-react';
import { GoldButton } from '../../../components/ui/ui';

export default function Reports() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Procurement Reports</h2>
          <p className="text-sm text-ink/60">Generate and download procurement data and vendor scorecards.</p>
        </div>
        <GoldButton>Generate Custom Report</GoldButton>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-400/10 text-gold-400 shrink-0">
            <FileBarChart className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-heading text-lg font-semibold text-cream mb-1">Quarterly Spend Analysis</h3>
            <p className="text-sm text-ink/60 mb-4">Breakdown of total procurement spend vs allocated budget by department.</p>
            <button className="flex items-center gap-2 text-sm font-medium text-gold-400 hover:text-gold-300 transition-colors">
              <Download className="h-4 w-4" /> Download PDF
            </button>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-400/10 text-blue-400 shrink-0">
            <FileBarChart className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-heading text-lg font-semibold text-cream mb-1">Vendor Scorecards</h3>
            <p className="text-sm text-ink/60 mb-4">Comparative data across top 50 vendors by quality, SLA compliance, and spend.</p>
            <button className="flex items-center gap-2 text-sm font-medium text-gold-400 hover:text-gold-300 transition-colors">
              <Download className="h-4 w-4" /> Download CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

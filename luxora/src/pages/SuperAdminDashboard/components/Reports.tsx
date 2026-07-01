import { FileBarChart, Download } from 'lucide-react';
import { GoldButton } from '../../../components/ui/ui';

export default function Reports() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Executive Reports</h2>
          <p className="text-sm text-ink/60">High-level PDF/CSV exports for board meetings and investors.</p>
        </div>
        <GoldButton>Generate Custom Report</GoldButton>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-400/10 text-gold-400 shrink-0">
            <FileBarChart className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-heading text-lg font-semibold text-cream mb-1">Quarterly Financial Review</h3>
            <p className="text-sm text-ink/60 mb-4">Comprehensive breakdown of Q3 2025 revenue, GMV, and OPEX.</p>
            <button className="flex items-center gap-2 text-sm font-medium text-gold-400 hover:text-gold-300 transition-colors">
              <Download className="h-4 w-4" /> Download PDF (12MB)
            </button>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-400/10 text-blue-400 shrink-0">
            <FileBarChart className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-heading text-lg font-semibold text-cream mb-1">Investor Relations Deck</h3>
            <p className="text-sm text-ink/60 mb-4">User growth metrics, active listings, and market share.</p>
            <button className="flex items-center gap-2 text-sm font-medium text-gold-400 hover:text-gold-300 transition-colors">
              <Download className="h-4 w-4" /> Download PDF (8MB)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

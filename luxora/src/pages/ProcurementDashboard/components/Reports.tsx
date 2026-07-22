import { FileBarChart, Download, PieChart, Activity } from 'lucide-react';
import { GoldButton } from '../../../components/ui/ui';
import { useWorkflowToast } from '../utils/workflowUtils';

export default function Reports() {
  const { showWorkflowToast } = useWorkflowToast();

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Procurement Reports</h2>
          <p className="text-sm text-ink/60">Generate and download procurement data and vendor scorecards.</p>
        </div>
        <GoldButton onClick={() => showWorkflowToast('Generate Custom Report')}>Generate Custom Report</GoldButton>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-400/10 text-gold-400 shrink-0">
              <PieChart className="h-5 w-5" />
            </div>
            <h3 className="font-heading text-lg font-semibold text-cream">Spend Analysis</h3>
          </div>
          <p className="text-sm text-ink/60 flex-1">Breakdown of total procurement spend vs allocated budget by department.</p>
          <button 
            className="flex items-center gap-2 text-sm font-medium text-gold-400 hover:text-gold-300 transition-colors w-max"
            onClick={() => showWorkflowToast('Download Spend Analysis PDF')}
          >
            <Download className="h-4 w-4" /> Download PDF
          </button>
        </div>

        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-400/10 text-blue-400 shrink-0">
              <Activity className="h-5 w-5" />
            </div>
            <h3 className="font-heading text-lg font-semibold text-cream">Vendor Performance</h3>
          </div>
          <p className="text-sm text-ink/60 flex-1">Comparative data across top 50 vendors by quality, SLA compliance, and spend.</p>
          <button 
            className="flex items-center gap-2 text-sm font-medium text-gold-400 hover:text-gold-300 transition-colors w-max"
            onClick={() => showWorkflowToast('Download Vendor Performance CSV')}
          >
            <Download className="h-4 w-4" /> Download CSV
          </button>
        </div>

        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400 shrink-0">
              <FileBarChart className="h-5 w-5" />
            </div>
            <h3 className="font-heading text-lg font-semibold text-cream">Budget Reports</h3>
          </div>
          <p className="text-sm text-ink/60 flex-1">Detailed breakdown of departmental budget utilization and variance.</p>
          <button 
            className="flex items-center gap-2 text-sm font-medium text-gold-400 hover:text-gold-300 transition-colors w-max"
            onClick={() => showWorkflowToast('Download Budget Reports Excel')}
          >
            <Download className="h-4 w-4" /> Download Excel
          </button>
        </div>
      </div>
    </div>
  );
}

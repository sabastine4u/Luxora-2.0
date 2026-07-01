import { FileText, Download, Calendar } from 'lucide-react';
import { GhostButton, GoldButton } from '../../../components/ui/ui';

export default function Reports() {
  const reports = [
    { name: 'Platform GMV & Revenue Q3 2025', date: 'Oct 1, 2025', size: '5.2 MB' },
    { name: 'User Growth & Acquisition Matrix', date: 'Oct 1, 2025', size: '3.4 MB' },
    { name: 'System Audit Log (September)', date: 'Oct 1, 2025', size: '12.1 MB' },
    { name: 'Platform GMV & Revenue Q2 2025', date: 'Jul 1, 2025', size: '4.8 MB' },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">System Reports</h2>
          <p className="text-sm text-ink/60">Generate and export platform-wide analytics and audit logs.</p>
        </div>
        <GoldButton>Generate New Report</GoldButton>
      </div>

      <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 space-y-6">
        
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink/70">Report Category</label>
            <select className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-2.5 px-4 text-cream focus:border-gold-400/50 focus:outline-none appearance-none">
              <option>Financial (GMV & Revenue)</option>
              <option>User Growth</option>
              <option>System Audit Logs</option>
              <option>Listing Performance</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink/70">Date Range</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
              <input 
                type="text" 
                defaultValue="Q3 2025"
                className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-2.5 pl-10 pr-4 text-cream focus:border-gold-400/50 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <GhostButton className="w-1/2">Export CSV</GhostButton>
            <GoldButton className="w-1/2">Export PDF</GoldButton>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10">
          <h3 className="font-heading text-lg font-semibold text-cream mb-4">Past Reports</h3>
          <div className="space-y-3">
            {reports.map((report, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-900/50 text-gold-400">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-cream text-sm">{report.name}</h4>
                    <p className="text-xs text-ink/50">Generated on {report.date} • {report.size}</p>
                  </div>
                </div>
                <button className="flex items-center gap-2 text-sm font-medium text-gold-400 hover:text-gold-300 transition-colors">
                  <Download className="h-4 w-4" /> Download PDF
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

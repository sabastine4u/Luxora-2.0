import { FileBarChart, Download, FileText } from 'lucide-react';
import { GhostButton, GoldButton } from '../../../components/ui/ui';

export const FinancialReports = () => {
  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-gray-50 dark:bg-ink-dark">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <FileBarChart className="w-6 h-6 mr-3 text-gold-500" />
            Financial Reports
          </h2>
          <p className="text-gray-500 mt-1">Generate comprehensive enterprise financial statements.</p>
        </div>
        <GoldButton>Generate New Report</GoldButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: 'Income Statement', desc: 'Comprehensive P&L for Q3 2026.', date: 'Generated Today' },
          { title: 'Balance Sheet', desc: 'Asset and Liability overview as of July 2026.', date: 'Generated Yesterday' },
          { title: 'Cash Flow Statement', desc: 'Detailed breakdown of operating, investing, and financing cash flows.', date: 'Generated July 1' },
          { title: 'Agency Commission Report', desc: 'YTD commission payouts across all partner agencies.', date: 'Generated June 30' },
          { title: 'Property Revenue Analysis', desc: 'Yield and ROI analysis across the residential portfolio.', date: 'Generated June 15' },
        ].map((report, idx) => (
          <div key={idx} className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6 hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">{report.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{report.desc}</p>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-ink-light">
              <span className="text-xs text-gray-400">{report.date}</span>
              <GhostButton size="sm" className="h-8 px-2"><Download className="w-4 h-4 mr-1.5" /> PDF</GhostButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

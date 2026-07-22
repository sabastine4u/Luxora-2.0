import { useState } from 'react';
import { FileBarChart, Download, Plus, Clock } from 'lucide-react';
import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { Modal } from '../../../components/ui/Modal';
import { useToast } from '../../../contexts/ToastContext';

export default function Reports() {
  const { showToast } = useToast();
  const [isBuilderModalOpen, setIsBuilderModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  const handleAction = (action: string) => {
    showToast({ type: 'success', title: 'Backend Integration', description: `This feature (${action}) is ready and will become fully functional during backend integration.` });
  };

  const reports = [
    { title: 'Profit & Loss Statement', desc: 'Detailed P&L statement for the current fiscal year.', color: 'gold' },
    { title: 'Tax Remittance Log', desc: 'Record of all VAT and WHT remitted to tax authorities.', color: 'blue' },
    { title: 'Revenue by State', desc: 'Geographic breakdown of platform revenue and fees.', color: 'emerald' },
    { title: 'Agent Commission Summary', desc: 'Total commissions paid to agents across all regions.', color: 'purple' },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Financial Reports</h2>
          <p className="text-sm text-ink/60">Generate, schedule, and download comprehensive financial statements.</p>
        </div>
        <div className="flex gap-3">
          <GhostButton className="flex items-center gap-2" onClick={() => setIsScheduleModalOpen(true)}>
            <Clock className="h-4 w-4" /> Scheduled Reports
          </GhostButton>
          <GoldButton className="flex items-center gap-2" onClick={() => setIsBuilderModalOpen(true)}>
            <Plus className="h-4 w-4" /> Build Custom Report
          </GoldButton>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((r, i) => (
          <div key={i} className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col h-full">
            <div className="flex items-start gap-4 flex-1">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-${r.color}-400/10 text-${r.color}-400 shrink-0`}>
                <FileBarChart className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-semibold text-cream mb-1">{r.title}</h3>
                <p className="text-sm text-ink/60 mb-4">{r.desc}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/10">
              <button 
                onClick={() => handleAction(`Download PDF: ${r.title}`)}
                className="flex items-center gap-2 text-sm font-medium text-cream hover:text-gold-300 transition-colors"
              >
                <Download className="h-4 w-4 text-ink/40" /> PDF
              </button>
              <button 
                onClick={() => handleAction(`Download CSV: ${r.title}`)}
                className="flex items-center gap-2 text-sm font-medium text-cream hover:text-gold-300 transition-colors"
              >
                <Download className="h-4 w-4 text-ink/40" /> CSV
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isBuilderModalOpen}
        onClose={() => setIsBuilderModalOpen(false)}
        title="Report Builder"
        size="2xl"
        actionButton={
          <GoldButton onClick={() => { handleAction('Generate Report'); setIsBuilderModalOpen(false); }}>
            Generate Report
          </GoldButton>
        }
      >
        <div className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Report Name</label>
            <input 
              type="text" 
              placeholder="e.g. Q3 Sales Performance"
              className="w-full rounded-xl border border-white/10 bg-navy-900/80 px-4 py-2 text-sm text-cream placeholder:text-ink/40 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50"
            />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Data Source</label>
              <select className="w-full rounded-xl border border-white/10 bg-navy-900/80 px-4 py-2 text-sm text-cream focus:border-gold-400/50 focus:outline-none appearance-none">
                <option>Transactions</option>
                <option>Invoices</option>
                <option>Commissions</option>
                <option>Owner Payouts</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Date Range</label>
              <select className="w-full rounded-xl border border-white/10 bg-navy-900/80 px-4 py-2 text-sm text-cream focus:border-gold-400/50 focus:outline-none appearance-none">
                <option>Last 30 Days</option>
                <option>This Quarter</option>
                <option>Last Quarter</option>
                <option>Year to Date</option>
                <option>Custom Range</option>
              </select>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-white/10">
            <label className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Include Columns</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
               {['Date', 'Amount', 'Status', 'Client/Agent', 'Property', 'Reference ID', 'Tax Amount', 'Net Income'].map(col => (
                 <label key={col} className="flex items-center gap-2 text-sm text-cream cursor-pointer">
                   <input type="checkbox" defaultChecked className="rounded border-white/10 bg-navy-900 text-gold-400 focus:ring-gold-400/50" />
                   {col}
                 </label>
               ))}
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        title="Schedule Report"
        actionButton={
          <GoldButton onClick={() => { handleAction('Save Schedule'); setIsScheduleModalOpen(false); }}>
            Save Schedule
          </GoldButton>
        }
      >
        <div className="space-y-6">
          <p className="text-sm text-ink/60">
            Automatically generate and email reports on a recurring basis.
          </p>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Select Report</label>
            <select className="w-full rounded-xl border border-white/10 bg-navy-900/80 px-4 py-2 text-sm text-cream focus:border-gold-400/50 focus:outline-none appearance-none">
              <option>Profit & Loss Statement</option>
              <option>Tax Remittance Log</option>
              <option>Revenue by State</option>
            </select>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Frequency</label>
              <select className="w-full rounded-xl border border-white/10 bg-navy-900/80 px-4 py-2 text-sm text-cream focus:border-gold-400/50 focus:outline-none appearance-none">
                <option>Weekly (Monday)</option>
                <option>Monthly (1st of Month)</option>
                <option>Quarterly</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Recipients</label>
              <input 
                type="text" 
                placeholder="finance@luxora.com"
                className="w-full rounded-xl border border-white/10 bg-navy-900/80 px-4 py-2 text-sm text-cream placeholder:text-ink/40 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50"
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

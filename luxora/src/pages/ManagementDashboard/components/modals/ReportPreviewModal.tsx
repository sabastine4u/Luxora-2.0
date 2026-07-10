import { FileText, Download, Share2, Printer, Clock, FileCheck, Search } from 'lucide-react';
import { Modal } from '../../../../components/ui/Modal';
import { GoldButton, GhostButton } from '../../../../components/ui/ui';
import { StatusBadge } from '../shared/StatusBadge';
import { ActivityTimeline } from '../../../../components/dashboard/shared/timelines/ActivityTimeline';

interface ReportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: Record<string, unknown> | null;
}

export function ReportPreviewModal({ isOpen, onClose, report }: ReportPreviewModalProps) {
  if (!report) return null;

  const versionHistory = [
    { title: 'Version 2.0 (Final)', time: 'Oct 05, 2025', desc: 'Approved by Executive Board', icon: FileCheck, color: 'text-emerald-400' },
    { title: 'Version 1.1 (Revision)', time: 'Oct 04, 2025', desc: 'Updated financial forecasts', icon: Clock, color: 'text-yellow-400' },
    { title: 'Version 1.0 (Draft)', time: 'Oct 01, 2025', desc: 'Initial automated generation', icon: FileText, color: 'text-blue-400' },
  ];

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Report Details & Executive Summary"
      size="xl"
      actionButton={
        <GoldButton className="flex items-center gap-2">
          <Download className="h-4 w-4" /> Download PDF
        </GoldButton>
      }
    >
      <div className="space-y-8 pb-4">
        {/* Document Header */}
        <div className="flex flex-col md:flex-row gap-6 items-start border-b border-white/5 pb-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-navy-800 border border-white/10 text-gold-400 shrink-0">
            <FileText className="h-10 w-10" />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-cream">{String(report.name)}</h2>
              <p className="text-ink/60 text-lg">Report ID: <span className="font-mono text-cream">{String(report.id)}</span></p>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={String(report.status)} />
              <span className="inline-flex items-center rounded-full border border-white/10 bg-navy-800/50 px-2.5 py-0.5 text-xs font-semibold text-ink/70">
                Type: {String(report.type)}
              </span>
              <span className="inline-flex items-center rounded-full border border-white/10 bg-navy-800/50 px-2.5 py-0.5 text-xs font-semibold text-ink/70">
                Generated: {String(report.date)}
              </span>
            </div>
            <div className="flex gap-4 pt-2">
              <GhostButton className="flex items-center gap-2 px-3 py-1.5 text-sm">
                <Share2 className="h-4 w-4" /> Share
              </GhostButton>
              <GhostButton className="flex items-center gap-2 px-3 py-1.5 text-sm">
                <Printer className="h-4 w-4" /> Print
              </GhostButton>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Executive Summary & Details */}
          <div className="space-y-6">
            <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
              <h3 className="font-heading text-sm font-semibold text-cream mb-3">Executive Summary</h3>
              <p className="text-sm text-ink/80 leading-relaxed">
                This comprehensive document outlines the Q3 enterprise performance metrics, highlighting a 15% reduction in overall operating costs and a significant enhancement in cross-department productivity. Core objectives were met successfully, though minor resource constraints were noted in the Property Management sector requiring executive attention for Q4 scaling.
              </p>
            </div>

            <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
              <h3 className="font-heading text-sm font-semibold text-cream mb-3">Metadata & Properties</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-ink/60">Primary Author</span>
                  <span className="text-cream font-medium">{String(report.author)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ink/60">Data Sources</span>
                  <span className="text-cream font-medium">Finance, Ops DB</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ink/60">File Size</span>
                  <span className="text-cream font-medium">4.2 MB</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ink/60">Classification</span>
                  <span className="text-rose-400 font-bold uppercase text-[10px] px-2 py-0.5 rounded bg-rose-400/10">Internal Confidential</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
              <h3 className="font-heading text-sm font-semibold text-cream mb-3">Internal Notes</h3>
              <p className="text-xs text-ink/80 leading-relaxed p-3 bg-navy-800 rounded-lg border border-white/5">
                Ensure this report is distributed to the Board of Directors prior to the Tuesday morning sync. Do not forward outside the Executive network.
              </p>
            </div>
          </div>

          {/* Timeline & Related Reports */}
          <div className="space-y-6">
            <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
              <ActivityTimeline
                title="Version History & Audit Log"
                items={versionHistory}
              />
            </div>

            <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
              <h3 className="font-heading text-sm font-semibold text-cream mb-3 flex items-center gap-2">
                <Search className="h-4 w-4 text-ink/60" /> Related Reports
              </h3>
              <div className="space-y-2">
                <div className="p-2 bg-navy-800 rounded border border-white/5 flex justify-between items-center hover:bg-white/5 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <FileText className="h-3 w-3 text-gold-400" />
                    <span className="text-xs text-cream">Q2 Enterprise Financials</span>
                  </div>
                  <span className="text-[10px] text-ink/40">Jul 2025</span>
                </div>
                <div className="p-2 bg-navy-800 rounded border border-white/5 flex justify-between items-center hover:bg-white/5 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <FileText className="h-3 w-3 text-gold-400" />
                    <span className="text-xs text-cream">Annual Operations Review 2024</span>
                  </div>
                  <span className="text-[10px] text-ink/40">Dec 2024</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

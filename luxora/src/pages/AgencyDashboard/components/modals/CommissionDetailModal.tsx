import { X, Calendar, Clock, DollarSign, Building2, UserCircle, CheckCircle2, ShieldCheck, FileText, Download, MessageSquare } from 'lucide-react';
import { GoldButton, GhostButton } from '../../../../components/ui/ui';
import { StatusBadge } from '../../../ManagementDashboard/components/shared/StatusBadge';
import { ActivityTimeline } from '../../../../components/dashboard/shared/timelines/ActivityTimeline';

interface CommissionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  commission: {
    id: string; agent: string; property: string; date: string; amount: string; status: string; dealValue: string;
  } | null;
}

export function CommissionDetailModal({ isOpen, onClose, commission }: CommissionDetailModalProps) {
  if (!isOpen || !commission) return null;

  const paymentTimeline = [
    { title: 'Payment Scheduled', time: 'Pending', desc: 'Awaiting final bank clearance', icon: Clock, color: 'text-yellow-400' },
    { title: 'Manager Approved', time: 'Yesterday, 2:00 PM', desc: 'Approved by Agency Admin', icon: ShieldCheck, color: 'text-emerald-400' },
    { title: 'Deal Closed', time: 'Oct 05, 2025', desc: 'Contract signed and initial deposit made', icon: CheckCircle2, color: 'text-blue-400' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm">
      <div className="bg-navy-900 border border-white/10 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-navy-900 sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-xs font-mono text-gold-400">{commission.id}</span>
              <StatusBadge status={commission.status} />
            </div>
            <h2 className="text-2xl font-heading font-bold text-cream">Commission Details</h2>
            <div className="flex items-center gap-4 mt-2 text-sm text-ink/60">
              <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Created: {commission.date}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <GhostButton className="text-xs"><Download className="h-3 w-3 mr-2" /> Download PDF</GhostButton>
            <button onClick={onClose} className="p-2 text-ink/60 hover:text-cream rounded-lg hover:bg-white/5 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Top Row: Financial Summary */}
          <div className="grid grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-white/5 bg-navy-800/50">
              <div className="text-xs text-ink/60 uppercase tracking-widest font-bold mb-1">Net Commission Amount</div>
              <div className="text-3xl font-bold text-emerald-400">{commission.amount}</div>
              <div className="mt-2 text-xs text-ink/60">3% of Total Deal Value</div>
            </div>
            <div className="p-6 rounded-xl border border-white/5 bg-navy-800/50">
              <div className="text-xs text-ink/60 uppercase tracking-widest font-bold mb-1">Total Deal Value</div>
              <div className="text-3xl font-bold text-cream">{commission.dealValue}</div>
              <div className="mt-2 text-xs text-ink/60">Sale Price</div>
            </div>
            <div className="p-6 rounded-xl border border-white/5 bg-navy-800/50">
              <div className="text-xs text-ink/60 uppercase tracking-widest font-bold mb-1">Agency Split</div>
              <div className="text-3xl font-bold text-gold-400">60/40</div>
              <div className="mt-2 text-xs text-ink/60">Agent (60%) / Agency (40%)</div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Left Col: Workflow & Details */}
            <div className="md:col-span-2 space-y-6">
              
              {/* Related Transaction & Property */}
              <div className="p-6 rounded-xl border border-white/5 bg-navy-800/50">
                <h4 className="font-bold text-sm text-cream mb-4 flex items-center gap-2"><Building2 className="h-4 w-4 text-gold-400" /> Transaction Summary</h4>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-xs text-ink/60 mb-1">Property Name</div>
                    <div className="font-bold text-cream text-sm">{commission.property}</div>
                  </div>
                  <div>
                    <div className="text-xs text-ink/60 mb-1">Transaction ID</div>
                    <div className="font-bold text-cream text-sm font-mono">TXN-2025-089</div>
                  </div>
                  <div>
                    <div className="text-xs text-ink/60 mb-1">Closing Date</div>
                    <div className="font-bold text-cream text-sm">Oct 05, 2025</div>
                  </div>
                  <div>
                    <div className="text-xs text-ink/60 mb-1">Sale Type</div>
                    <div className="font-bold text-cream text-sm">Residential Sale</div>
                  </div>
                </div>
              </div>

              {/* Payment Schedule & Breakdown */}
              <div className="p-6 rounded-xl border border-white/5 bg-navy-800/50">
                <h4 className="font-bold text-sm text-cream mb-4 flex items-center gap-2"><DollarSign className="h-4 w-4 text-emerald-400" /> Revenue Breakdown</h4>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-sm text-ink/80">Total Deal Commission (3%)</span>
                    <span className="text-sm font-bold text-cream">₦13,500,000</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-sm text-ink/80">Agency Share (40%)</span>
                    <span className="text-sm font-bold text-cream">-₦5,400,000</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-sm text-ink/80">Tax Withholding (5%)</span>
                    <span className="text-sm font-bold text-rose-400">-₦405,000</span>
                  </div>
                  <div className="flex justify-between py-2 pt-4">
                    <span className="text-sm font-bold text-cream">Final Agent Payout</span>
                    <span className="text-lg font-bold text-emerald-400">₦7,695,000</span>
                  </div>
                </div>
              </div>

              {/* Approval Workflow Timeline */}
              <div className="p-6 rounded-xl border border-white/5 bg-navy-800/50">
                 <h4 className="font-bold text-sm text-cream mb-4 flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-blue-400" /> Audit Trail & Timeline</h4>
                 <ActivityTimeline items={paymentTimeline} />
              </div>

            </div>

            {/* Right Col: Agent & Documents */}
            <div className="space-y-6">
              
              {/* Agent Performance Context */}
              <div className="p-5 rounded-xl border border-white/5 bg-navy-800/50">
                <h4 className="font-bold text-sm text-cream mb-4 flex items-center gap-2">
                  <UserCircle className="h-4 w-4 text-gold-400" /> Agent Details
                </h4>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-navy-900 flex items-center justify-center font-bold text-cream border border-gold-400/30">
                    {commission.agent?.charAt(0) || 'A'}
                  </div>
                  <div>
                    <div className="font-bold text-cream text-sm">{commission.agent}</div>
                    <div className="text-xs text-ink/60">Senior Broker</div>
                  </div>
                </div>
                <div className="space-y-2 pt-4 border-t border-white/5">
                  <div className="flex justify-between text-xs">
                    <span className="text-ink/60">YTD Earnings</span>
                    <span className="font-bold text-cream">₦45.2M</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-ink/60">YTD Deals</span>
                    <span className="font-bold text-cream">8 Deals</span>
                  </div>
                </div>
              </div>

              {/* Attachments Placeholder */}
              <div className="p-5 rounded-xl border border-white/5 bg-navy-800/50">
                <h4 className="font-bold text-sm text-cream mb-4 flex items-center gap-2"><FileText className="h-4 w-4 text-blue-400" /> Related Documents</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm p-2 bg-navy-950 rounded border border-white/5 hover:border-gold-400/30 cursor-pointer transition-colors">
                    <span className="text-cream text-xs">Signed Contract.pdf</span>
                    <Download className="h-3 w-3 text-ink/60" />
                  </div>
                  <div className="flex items-center justify-between text-sm p-2 bg-navy-950 rounded border border-white/5 hover:border-gold-400/30 cursor-pointer transition-colors">
                    <span className="text-cream text-xs">Bank Transfer Receipt.pdf</span>
                    <Download className="h-3 w-3 text-ink/60" />
                  </div>
                </div>
              </div>

              {/* Internal Notes */}
              <div className="p-5 rounded-xl border border-white/5 bg-navy-800/50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-sm text-cream">Finance Notes</h4>
                  </div>
                  <div className="p-3 rounded-lg border border-white/5 bg-navy-950 text-sm text-ink/80 flex gap-3">
                    <MessageSquare className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                    <p>Tax withholding adjusted according to new 2025 agency policy guidelines.</p>
                  </div>
              </div>

            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex justify-between gap-3 bg-navy-900 sticky bottom-0 z-10">
           <GhostButton className="text-rose-400 hover:text-rose-300 hover:bg-rose-400/10">Reject Payment</GhostButton>
           <div className="flex gap-3">
            <GhostButton onClick={onClose}>Close</GhostButton>
            {commission.status === 'Pending' && <GoldButton>Approve Payment</GoldButton>}
          </div>
        </div>

      </div>
    </div>
  );
}

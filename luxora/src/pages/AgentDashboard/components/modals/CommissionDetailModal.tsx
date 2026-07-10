import { useState } from 'react';
import { Wallet, Briefcase, FileText, ShieldCheck, Banknote, AlertCircle, RefreshCcw } from 'lucide-react';
import { Modal } from '../../../../components/ui/Modal';
import { GoldButton, GhostButton } from '../../../../components/ui/ui';
import { StatusBadge } from '../../../ManagementDashboard/components/shared/StatusBadge';
import { ActivityTimeline } from '../../../../components/dashboard/shared/timelines/ActivityTimeline';

interface CommissionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  commission: Record<string, unknown> | null;
}

export function CommissionDetailModal({ isOpen, onClose, commission }: CommissionDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');

  if (!commission) return null;

  const paymentTimeline = [
    { title: 'Payment Processing', time: 'Today', desc: 'Transfer initiated to primary account', icon: RefreshCcw, color: 'text-gold-400' },
    { title: 'Brokerage Approval', time: 'Yesterday', desc: 'Approved by Branch Manager', icon: ShieldCheck, color: 'text-emerald-400' },
    { title: 'Deal Closed', time: '3 days ago', desc: 'Final closing documents signed', icon: Briefcase, color: 'text-blue-400' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Commission Details"
      size="xl"
      actionButton={<GoldButton>Download Statement</GoldButton>}
    >
      <div className="space-y-8 pb-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-6 items-start border-b border-white/5 pb-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-navy-900 border border-white/10 shrink-0">
            <Wallet className="h-10 w-10 text-emerald-400" />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-emerald-400">
                {String(commission.amount || '₦0')}
              </h2>
              <div className="text-cream text-lg font-medium mt-1">
                {String(commission.deal || 'Unknown Deal')}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={String(commission.status || 'Pending')} />
              <span className="inline-flex items-center rounded-full border border-white/10 bg-navy-800/50 px-2.5 py-0.5 text-xs font-semibold text-ink/70">
                Type: {String(commission.type || 'Standard')}
              </span>
              <span className="inline-flex items-center rounded-full border border-white/10 bg-navy-800/50 px-2.5 py-0.5 text-xs font-semibold text-gold-400">
                Date: {String(commission.date || 'Processing')}
              </span>
            </div>
            <div className="flex gap-4 pt-2">
              <GhostButton className="flex items-center gap-2 px-3 py-1.5 text-sm text-ink/60 hover:text-cream">
                <AlertCircle className="h-4 w-4" /> Report Issue
              </GhostButton>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex border-b border-white/10">
          {[
            { id: 'overview', label: 'Commission Breakdown' },
            { id: 'history', label: 'Audit Trail & Timeline' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as never)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id 
                  ? 'border-gold-400 text-gold-400' 
                  : 'border-transparent text-ink/60 hover:text-cream hover:border-white/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                <h3 className="font-heading text-sm font-semibold text-cream mb-4 flex items-center gap-2">
                  <Banknote className="h-4 w-4 text-ink/60" /> Payment Breakdown
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-ink/60">Gross Commission</span>
                    <span className="text-cream">₦12,500,000</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-ink/60">Brokerage Split (30%)</span>
                    <span className="text-red-400">-₦3,750,000</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-ink/60">Marketing Deduction</span>
                    <span className="text-red-400">-₦250,000</span>
                  </div>
                  <div className="flex justify-between pt-2 font-bold text-base">
                    <span className="text-cream">Net Payout</span>
                    <span className="text-emerald-400">{String(commission.amount || '₦8,500,000')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                <h3 className="font-heading text-sm font-semibold text-cream mb-4 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-ink/60" /> Related Deal Info
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="block text-ink/60 text-xs mb-1">Property Sold</span>
                    <span className="text-cream">{String(commission.deal || 'Ikoyi Penthouse')}</span>
                  </div>
                  <div>
                    <span className="block text-ink/60 text-xs mb-1">Deal Value</span>
                    <span className="text-gold-400 font-medium">₦250,000,000</span>
                  </div>
                  <GhostButton className="w-full justify-center text-xs py-1 mt-2">View Full Deal</GhostButton>
                </div>
              </div>

              <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                <h3 className="font-heading text-sm font-semibold text-cream mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-ink/60" /> Notes
                </h3>
                <p className="text-xs text-ink/80 leading-relaxed p-3 bg-navy-800 rounded-lg border border-white/5">
                  Standard split applied. Extra deduction for premium marketing package requested on Feb 10th.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="rounded-xl border border-white/5 bg-navy-900/50 p-6">
            <ActivityTimeline
              title="Payment Audit Trail"
              items={paymentTimeline}
            />
          </div>
        )}

      </div>
    </Modal>
  );
}

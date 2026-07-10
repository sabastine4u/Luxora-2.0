import { useState } from 'react';
import { Briefcase, MapPin, User, CheckCircle2, FileText, CreditCard, Target, Milestone, AlertCircle, FileSignature } from 'lucide-react';
import { Modal } from '../../../../components/ui/Modal';
import { GoldButton, GhostButton } from '../../../../components/ui/ui';
import { StatusBadge } from '../../../ManagementDashboard/components/shared/StatusBadge';
import { ActivityTimeline } from '../../../../components/dashboard/shared/timelines/ActivityTimeline';

interface DealDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  deal: Record<string, unknown> | null;
}

export function DealDetailModal({ isOpen, onClose, deal }: DealDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'timeline'>('overview');

  if (!deal) return null;

  const activityTimeline = [
    { title: 'Offer Accepted', time: '2 days ago', desc: 'Seller accepted ₦850M counter-offer', icon: CheckCircle2, color: 'text-emerald-400' },
    { title: 'Counter Offer Submitted', time: '4 days ago', desc: 'Submitted ₦850M on behalf of buyer', icon: FileSignature, color: 'text-gold-400' },
    { title: 'Initial Offer', time: '1 week ago', desc: 'Buyer offered ₦800M', icon: Target, color: 'text-blue-400' },
  ];

  const documentChecklist = [
    { name: 'Initial Offer Letter', status: 'completed' },
    { name: 'Proof of Funds', status: 'completed' },
    { name: 'Purchase Agreement', status: 'pending' },
    { name: 'Title Transfer Documents', status: 'pending' },
  ];

  const paymentProgress = 10; // 10% deposit paid

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Deal Overview"
      size="2xl"
      actionButton={<GoldButton>Advance Stage</GoldButton>}
    >
      <div className="space-y-8 pb-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-6 items-start border-b border-white/5 pb-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-navy-900 border border-white/10 shrink-0">
            <Briefcase className="h-10 w-10 text-emerald-400" />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-cream">
                {String(deal.property || 'Luxury Property Deal')}
              </h2>
              <div className="text-ink/60 flex flex-wrap items-center gap-4 mt-1">
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> Ikoyi, Lagos</span>
                <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" /> Client: {String(deal.client || 'N/A')}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={String(deal.stage || 'Under Offer')} />
              <span className="inline-flex items-center rounded-full border border-white/10 bg-navy-800/50 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                Value: {String(deal.value || '₦0')}
              </span>
              <span className="inline-flex items-center rounded-full border border-white/10 bg-navy-800/50 px-2.5 py-0.5 text-xs font-semibold text-gold-400">
                Est. Close: {String(deal.closingDate || 'Next Month')}
              </span>
            </div>
            <div className="flex gap-4 pt-2">
              <GhostButton className="flex items-center gap-2 px-3 py-1.5 text-sm text-gold-400 hover:text-gold-300">
                <FileSignature className="h-4 w-4" /> Request Signature
              </GhostButton>
              <GhostButton className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-400 hover:text-red-300">
                <AlertCircle className="h-4 w-4" /> Flag Issue
              </GhostButton>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex border-b border-white/10">
          {[
            { id: 'overview', label: 'Deal Overview' },
            { id: 'documents', label: 'Documents & Checklist' },
            { id: 'timeline', label: 'Activity Timeline' }
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
                  <CreditCard className="h-4 w-4 text-ink/60" /> Financial Summary
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-ink/60">Agreed Price</span>
                    <span className="text-cream font-bold">{String(deal.value || '₦0')}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-ink/60">Estimated Commission (5%)</span>
                    <span className="text-gold-400 font-bold">{String(deal.commission || '₦0')}</span>
                  </div>
                  <div className="pt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-ink/60">Payment Progress (Deposit)</span>
                      <span className="text-emerald-400">{paymentProgress}% Paid</span>
                    </div>
                    <div className="h-1.5 w-full bg-navy-950 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400" style={{ width: `${paymentProgress}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                <h3 className="font-heading text-sm font-semibold text-cream mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-ink/60" /> Internal Notes
                </h3>
                <p className="text-xs text-ink/80 leading-relaxed p-3 bg-navy-800 rounded-lg border border-white/5">
                  Buyer is awaiting final mortgage approval. Expected by Friday. All inspections have cleared without major issues.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                <h3 className="font-heading text-sm font-semibold text-cream mb-4 flex items-center gap-2">
                  <Milestone className="h-4 w-4 text-ink/60" /> Deal Parties
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-navy-800 p-2.5 rounded-lg border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-navy-950 flex items-center justify-center text-xs font-bold text-cream">B</div>
                      <div>
                        <span className="block text-xs font-semibold text-cream">Buyer</span>
                        <span className="block text-[10px] text-ink/60">{String(deal.client || 'N/A')}</span>
                      </div>
                    </div>
                    <GhostButton className="px-2 py-1 text-[10px]">View</GhostButton>
                  </div>
                  
                  <div className="flex justify-between items-center bg-navy-800 p-2.5 rounded-lg border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-navy-950 flex items-center justify-center text-xs font-bold text-cream">S</div>
                      <div>
                        <span className="block text-xs font-semibold text-cream">Seller</span>
                        <span className="block text-[10px] text-ink/60">Luxora Exclusive Listing</span>
                      </div>
                    </div>
                    <GhostButton className="px-2 py-1 text-[10px]">View</GhostButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
            <h3 className="font-heading text-sm font-semibold text-cream mb-4 flex items-center gap-2">
              <FileSignature className="h-4 w-4 text-ink/60" /> Required Documents
            </h3>
            <div className="space-y-3">
              {documentChecklist.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center bg-navy-800 p-3 rounded-lg border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${item.status === 'completed' ? 'bg-emerald-400 border-emerald-400' : 'border-ink/40'}`}>
                      {item.status === 'completed' && <CheckCircle2 className="h-3 w-3 text-navy-900" />}
                    </div>
                    <span className={`text-sm ${item.status === 'completed' ? 'text-cream opacity-80' : 'text-cream'}`}>{item.name}</span>
                  </div>
                  <GhostButton className="px-3 py-1 text-xs border border-white/10">
                    {item.status === 'completed' ? 'View' : 'Upload'}
                  </GhostButton>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="rounded-xl border border-white/5 bg-navy-900/50 p-6">
            <ActivityTimeline
              title="Negotiation & Activity Timeline"
              items={activityTimeline}
            />
          </div>
        )}

      </div>
    </Modal>
  );
}

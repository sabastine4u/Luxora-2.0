import { useState } from 'react';
import { User, Phone, Mail, Calendar, Clock, Target, CheckCircle2, FileText, Activity, MessageSquare, Star } from 'lucide-react';
import { Modal } from '../../../../components/ui/Modal';
import { GoldButton, GhostButton } from '../../../../components/ui/ui';
import { StatusBadge } from '../../../ManagementDashboard/components/shared/StatusBadge';
import { ActivityTimeline } from '../../../../components/dashboard/shared/timelines/ActivityTimeline';

interface LeadDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Record<string, unknown> | null;
}

export function LeadDetailModal({ isOpen, onClose, lead }: LeadDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'timeline' | 'notes'>('profile');

  if (!lead) return null;

  const communicationTimeline = [
    { title: 'Phone Call', time: '2 hours ago', desc: 'Discussed requirements for Lekki Phase 1', icon: Phone, color: 'text-blue-400' },
    { title: 'Email Sent', time: 'Yesterday', desc: 'Sent property brochure and pricing', icon: Mail, color: 'text-gold-400' },
    { title: 'Lead Generated', time: '3 days ago', desc: 'Captured via Website Contact Form', icon: Target, color: 'text-emerald-400' },
  ];

  const tasks = [
    { task: 'Schedule Property Viewing', due: 'Today, 4:00 PM', status: 'pending' },
    { task: 'Send pre-approval documents', due: 'Tomorrow', status: 'pending' },
    { task: 'Initial outreach call', due: 'Completed', status: 'completed' },
  ];

  const qualificationChecklist = [
    { item: 'Budget Confirmed', status: 'completed' },
    { item: 'Timeline Established', status: 'completed' },
    { item: 'Property Requirements Set', status: 'completed' },
    { item: 'Financing Verified', status: 'pending' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Lead Profile"
      size="2xl"
      actionButton={<GoldButton>Update Status</GoldButton>}
    >
      <div className="space-y-8 pb-4">
        {/* Header Profile Section */}
        <div className="flex flex-col md:flex-row gap-6 items-start border-b border-white/5 pb-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gold-gradient text-4xl font-bold text-navy-900 shrink-0">
            {String(lead.name || 'L').charAt(0)}
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-cream flex items-center gap-2">
                {String(lead.name || 'Unknown Lead')}
                {Number(lead.score || 0) >= 90 && <Star className="h-5 w-5 text-gold-400 fill-current" />}
              </h2>
              <div className="text-ink/60 flex items-center gap-4 mt-1">
                <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {String(lead.email || 'N/A')}</span>
                <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {String(lead.phone || 'N/A')}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={String(lead.status || 'New')} />
              <span className="inline-flex items-center rounded-full border border-white/10 bg-navy-800/50 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                Score: {String(lead.score || 'N/A')}
              </span>
              <span className="inline-flex items-center rounded-full border border-white/10 bg-navy-800/50 px-2.5 py-0.5 text-xs font-semibold text-ink/70">
                Source: {String(lead.source || 'Website')}
              </span>
            </div>
            <div className="flex gap-4 pt-2">
              <GhostButton className="flex items-center gap-2 px-3 py-1.5 text-sm">
                <MessageSquare className="h-4 w-4" /> Message
              </GhostButton>
              <GhostButton className="flex items-center gap-2 px-3 py-1.5 text-sm">
                <Calendar className="h-4 w-4" /> Book Meeting
              </GhostButton>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex border-b border-white/10">
          {[
            { id: 'profile', label: 'Lead Profile & Tasks' },
            { id: 'timeline', label: 'Communication Timeline' },
            { id: 'notes', label: 'Internal Notes' }
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
        {activeTab === 'profile' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                <h3 className="font-heading text-sm font-semibold text-cream mb-4 flex items-center gap-2">
                  <Target className="h-4 w-4 text-ink/60" /> Requirements & Budget
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="block text-ink/60 text-xs mb-1">Interest</span>
                    <span className="text-cream">{String(lead.interest || 'Not Specified')}</span>
                  </div>
                  <div>
                    <span className="block text-ink/60 text-xs mb-1">Budget</span>
                    <span className="text-cream">{String(lead.budget || 'Not Specified')}</span>
                  </div>
                  <div>
                    <span className="block text-ink/60 text-xs mb-1">Conversion Probability</span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 bg-navy-950 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-400" style={{ width: `${Number(lead.score || 50)}%` }}></div>
                      </div>
                      <span className="text-emerald-400 font-bold text-xs">{String(lead.score || 50)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                <h3 className="font-heading text-sm font-semibold text-cream mb-4 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-ink/60" /> Qualification Checklist
                </h3>
                <div className="space-y-3">
                  {qualificationChecklist.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${item.status === 'completed' ? 'bg-gold-400 border-gold-400' : 'border-ink/40'}`}>
                        {item.status === 'completed' && <CheckCircle2 className="h-3 w-3 text-navy-900" />}
                      </div>
                      <span className={`text-sm ${item.status === 'completed' ? 'text-cream' : 'text-ink/60'}`}>{item.item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                <h3 className="font-heading text-sm font-semibold text-cream mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-ink/60" /> Follow-up Tasks
                </h3>
                <div className="space-y-4">
                  {tasks.map((task, idx) => (
                    <div key={idx} className="flex items-start gap-3 border-b border-white/5 pb-3 last:border-0 last:pb-0">
                      <div className={`mt-0.5 h-4 w-4 rounded border ${task.status === 'completed' ? 'bg-emerald-400 border-emerald-400' : 'border-ink/40'}`}>
                        {task.status === 'completed' && <CheckCircle2 className="h-4 w-4 text-navy-900 absolute -mt-[1px] -ml-[1px]" />}
                      </div>
                      <div>
                        <span className={`block text-sm ${task.status === 'completed' ? 'text-ink/60 line-through' : 'text-cream'}`}>{task.task}</span>
                        <span className="block text-xs text-gold-400 flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3" /> {task.due}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                <h3 className="font-heading text-sm font-semibold text-cream mb-2 flex items-center gap-2">
                  <User className="h-4 w-4 text-ink/60" /> Related Entities
                </h3>
                <div className="text-sm">
                  <span className="block text-ink/60 text-xs mb-1">Assigned Agent</span>
                  <span className="text-cream">Adeyemi (Current User)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="rounded-xl border border-white/5 bg-navy-900/50 p-6">
            <ActivityTimeline
              title="Communication History"
              items={communicationTimeline}
            />
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-4">
            <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
              <h3 className="font-heading text-sm font-semibold text-cream mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-ink/60" /> Lead Notes
              </h3>
              <p className="text-sm text-ink/80 leading-relaxed p-4 bg-navy-800 rounded-lg border border-white/5 min-h-[150px]">
                Highly interested in premium penthouses. Ready to close within 30 days if the right property is found. Requires 24-hour notice before any viewing due to tight schedule. Prefer WhatsApp for quick updates.
              </p>
            </div>
          </div>
        )}

      </div>
    </Modal>
  );
}

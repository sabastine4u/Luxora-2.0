import { useState } from 'react';
import { Calendar, Clock, MapPin, User, Video, Building2, CheckCircle2, FileText, Briefcase, Activity, AlertCircle } from 'lucide-react';
import { Modal } from '../../../../components/ui/Modal';
import { GoldButton, GhostButton } from '../../../../components/ui/ui';
import { StatusBadge } from '../../../ManagementDashboard/components/shared/StatusBadge';
import { ActivityTimeline } from '../../../../components/dashboard/shared/timelines/ActivityTimeline';

interface AppointmentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Record<string, unknown> | null;
}

export function AppointmentDetailModal({ isOpen, onClose, appointment }: AppointmentDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'history'>('overview');

  if (!appointment) return null;

  const scheduleTimeline = [
    { title: 'Appointment Confirmed', time: 'Yesterday, 2:00 PM', desc: 'Client confirmed via SMS', icon: CheckCircle2, color: 'text-emerald-400' },
    { title: 'Reminder Sent', time: 'Today, 8:00 AM', desc: 'Automated email and SMS sent', icon: Activity, color: 'text-gold-400' },
    { title: 'Meeting Scheduled', time: 'Today, 10:00 AM', desc: 'Meeting taking place', icon: Calendar, color: 'text-blue-400' },
  ];

  const followUpTasks = [
    { task: 'Send property comparison report', status: 'pending' },
    { task: 'Schedule secondary viewing', status: 'pending' },
    { task: 'Prepare offer documentation', status: 'completed' },
  ];

  const relatedDeals = [
    { name: 'Ikoyi Penthouse Negotiation', stage: 'Under Offer', value: '₦850M' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Appointment Details"
      size="2xl"
      actionButton={<GoldButton>Reschedule</GoldButton>}
    >
      <div className="space-y-8 pb-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-6 items-start border-b border-white/5 pb-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-navy-900 border border-white/10 shrink-0">
            <Calendar className="h-10 w-10 text-gold-400" />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-cream">
                {String(appointment.type || 'Property Viewing')}
              </h2>
              <div className="text-ink/60 flex flex-wrap items-center gap-4 mt-1">
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {String(appointment.time || '10:00 AM - 11:00 AM')}</span>
                <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {String(appointment.date || 'Today')}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={String(appointment.status || 'Upcoming')} />
              <span className="inline-flex items-center rounded-full border border-white/10 bg-navy-800/50 px-2.5 py-0.5 text-xs font-semibold text-ink/70">
                Priority: {String(appointment.priority || 'High')}
              </span>
            </div>
            <div className="flex gap-4 pt-2">
              <GhostButton className="flex items-center gap-2 px-3 py-1.5 text-sm text-emerald-400 hover:text-emerald-300">
                <CheckCircle2 className="h-4 w-4" /> Mark Completed
              </GhostButton>
              <GhostButton className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-400 hover:text-red-300">
                <AlertCircle className="h-4 w-4" /> Cancel
              </GhostButton>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex border-b border-white/10">
          {[
            { id: 'overview', label: 'Overview & Info' },
            { id: 'notes', label: 'Notes & Tasks' },
            { id: 'history', label: 'Timeline & History' }
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
                  <User className="h-4 w-4 text-ink/60" /> Client Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="block text-ink/60 text-xs mb-1">Name</span>
                    <span className="text-cream">{String(appointment.client || 'John Doe')}</span>
                  </div>
                  <div>
                    <span className="block text-ink/60 text-xs mb-1">Contact</span>
                    <span className="text-cream">+234 800 123 4567</span>
                  </div>
                  <GhostButton className="w-full justify-center text-xs py-1 mt-2">View Client Profile</GhostButton>
                </div>
              </div>

              <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                <h3 className="font-heading text-sm font-semibold text-cream mb-4 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-ink/60" /> Related Deal
                </h3>
                {relatedDeals.map((deal, idx) => (
                  <div key={idx} className="bg-navy-800 p-3 rounded-lg border border-white/5">
                    <span className="block text-sm text-cream mb-1">{deal.name}</span>
                    <div className="flex justify-between text-xs">
                      <span className="text-ink/60">{deal.stage}</span>
                      <span className="text-gold-400 font-medium">{deal.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                <h3 className="font-heading text-sm font-semibold text-cream mb-4 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-ink/60" /> Property Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="block text-ink/60 text-xs mb-1">Property</span>
                    <span className="text-cream">{String(appointment.location || 'Luxury Villa, Ikoyi')}</span>
                  </div>
                  <div>
                    <span className="block text-ink/60 text-xs mb-1">Location / Link</span>
                    {String(appointment.location || '').includes('Zoom') ? (
                      <span className="text-blue-400 flex items-center gap-1">
                        <Video className="h-3.5 w-3.5" /> Join Meeting
                      </span>
                    ) : (
                      <span className="text-cream flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-ink/40" /> {String(appointment.location || '14 Bourdillon Rd')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="grid md:grid-cols-2 gap-6">
             <div className="space-y-4">
              <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4 h-full">
                <h3 className="font-heading text-sm font-semibold text-cream mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-ink/60" /> Meeting Notes
                </h3>
                <textarea 
                  className="w-full h-[200px] text-sm text-cream bg-navy-800 rounded-lg border border-white/5 p-3 focus:outline-none focus:border-gold-400/50 resize-none"
                  placeholder="Enter meeting notes here..."
                  defaultValue="Client is particularly interested in the security features and smart home integration. Prepare detailed spec sheet for the next interaction."
                ></textarea>
                <div className="mt-3 flex justify-end">
                  <GhostButton className="text-xs py-1 px-3">Save Notes</GhostButton>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
              <h3 className="font-heading text-sm font-semibold text-cream mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-ink/60" /> Follow-up Tasks
              </h3>
              <div className="space-y-3">
                {followUpTasks.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${item.status === 'completed' ? 'bg-emerald-400 border-emerald-400' : 'border-ink/40'}`}>
                      {item.status === 'completed' && <CheckCircle2 className="h-3 w-3 text-navy-900" />}
                    </div>
                    <span className={`text-sm ${item.status === 'completed' ? 'text-cream line-through opacity-50' : 'text-cream'}`}>{item.task}</span>
                  </div>
                ))}
              </div>
              <GhostButton className="w-full justify-center text-xs py-1 mt-4 border border-dashed border-white/10">+ Add Task</GhostButton>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="rounded-xl border border-white/5 bg-navy-900/50 p-6">
            <ActivityTimeline
              title="Schedule Timeline"
              items={scheduleTimeline}
            />
          </div>
        )}

      </div>
    </Modal>
  );
}

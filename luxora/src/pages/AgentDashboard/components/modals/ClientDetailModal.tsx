import { useState } from 'react';
import { User, Phone, Mail, Calendar, MapPin, Building2, Heart, MessageSquare, Briefcase, FileText, Activity, CreditCard } from 'lucide-react';
import { Modal } from '../../../../components/ui/Modal';
import { GoldButton, GhostButton } from '../../../../components/ui/ui';
import { StatusBadge } from '../../../ManagementDashboard/components/shared/StatusBadge';
import { ActivityTimeline } from '../../../../components/dashboard/shared/timelines/ActivityTimeline';

interface ClientDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Record<string, unknown> | null;
}

export function ClientDetailModal({ isOpen, onClose, client }: ClientDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'transactions' | 'communication'>('profile');

  if (!client) return null;

  const transactionHistory = [
    { title: 'Purchased Villa in Ikoyi', time: 'Oct 2024', desc: '₦850,000,000', icon: Building2, color: 'text-gold-400' },
    { title: 'Sold Apartment in VI', time: 'Jan 2024', desc: '₦320,000,000', icon: CreditCard, color: 'text-blue-400' },
    { title: 'Leased Office Space', time: 'Aug 2023', desc: '₦45,000,000/yr', icon: Briefcase, color: 'text-emerald-400' },
  ];

  const supportHistory = [
    { title: 'Maintenance Request Completed', time: '2 weeks ago', desc: 'HVAC repair at Ikoyi property', icon: Activity, color: 'text-emerald-400' },
    { title: 'General Inquiry Resolved', time: '1 month ago', desc: 'Requested property tax documents', icon: MessageSquare, color: 'text-gold-400' },
  ];

  const savedProperties = [
    { name: 'Banana Island Mansion', price: '₦1.2B', status: 'Available' },
    { name: 'Lekki Phase 1 Duplex', price: '₦450M', status: 'Under Offer' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Client Details"
      size="2xl"
      actionButton={<GoldButton>Edit Client</GoldButton>}
    >
      <div className="space-y-8 pb-4">
        {/* Header Profile Section */}
        <div className="flex flex-col md:flex-row gap-6 items-start border-b border-white/5 pb-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-navy-900 border border-white/10 shrink-0">
            <User className="h-10 w-10 text-ink/40" />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-cream">
                {String(client.name || 'Unknown Client')}
              </h2>
              <div className="text-ink/60 flex items-center gap-4 mt-1">
                <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {String(client.email || 'N/A')}</span>
                <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {String(client.phone || 'N/A')}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={String(client.status || 'Active')} />
              <span className="inline-flex items-center rounded-full border border-white/10 bg-navy-800/50 px-2.5 py-0.5 text-xs font-semibold text-gold-400">
                VIP Client
              </span>
              <span className="inline-flex items-center rounded-full border border-white/10 bg-navy-800/50 px-2.5 py-0.5 text-xs font-semibold text-ink/70">
                LTV: {String(client.ltv || '₦1.2B')}
              </span>
            </div>
            <div className="flex gap-4 pt-2">
              <GhostButton className="flex items-center gap-2 px-3 py-1.5 text-sm">
                <MessageSquare className="h-4 w-4" /> Message
              </GhostButton>
              <GhostButton className="flex items-center gap-2 px-3 py-1.5 text-sm">
                <Calendar className="h-4 w-4" /> Schedule Call
              </GhostButton>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex border-b border-white/10">
          {[
            { id: 'profile', label: 'Client Overview' },
            { id: 'transactions', label: 'Transactions & Activity' },
            { id: 'communication', label: 'Communication & Support' }
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
                  <User className="h-4 w-4 text-ink/60" /> Profile Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="block text-ink/60 text-xs mb-1">Client Since</span>
                    <span className="text-cream">{String(client.joinDate || 'Jan 2023')}</span>
                  </div>
                  <div>
                    <span className="block text-ink/60 text-xs mb-1">Primary Interest</span>
                    <span className="text-cream">Luxury Residential</span>
                  </div>
                  <div>
                    <span className="block text-ink/60 text-xs mb-1">Preferred Contact</span>
                    <span className="text-cream">Email / WhatsApp</span>
                  </div>
                  <div>
                    <span className="block text-ink/60 text-xs mb-1">Primary Address</span>
                    <span className="text-cream flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-ink/40" /> 14 Bourdillon Rd, Ikoyi
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                <h3 className="font-heading text-sm font-semibold text-cream mb-4 flex items-center gap-2">
                  <Heart className="h-4 w-4 text-ink/60" /> Saved Properties
                </h3>
                <div className="space-y-3">
                  {savedProperties.map((prop, idx) => (
                    <div key={idx} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0 last:pb-0">
                      <div>
                        <span className="block text-sm text-cream">{prop.name}</span>
                        <span className="block text-xs text-ink/60">{prop.price}</span>
                      </div>
                      <StatusBadge status={prop.status} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                <h3 className="font-heading text-sm font-semibold text-cream mb-4 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-ink/60" /> Assigned Listings
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="border-b border-white/5 pb-2">
                    <span className="block text-cream mb-1">Victoria Island Penthouse</span>
                    <div className="flex justify-between text-xs text-ink/60">
                      <span>Listing ID: LX-9482</span>
                      <span className="text-gold-400">Active</span>
                    </div>
                  </div>
                  <GhostButton className="w-full justify-center text-xs py-1">View All Client Listings</GhostButton>
                </div>
              </div>

              <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                <h3 className="font-heading text-sm font-semibold text-cream mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-ink/60" /> Internal Notes
                </h3>
                <p className="text-xs text-ink/80 leading-relaxed p-3 bg-navy-800 rounded-lg border border-white/5">
                  High net worth individual looking to expand property portfolio in Lagos and Abuja. Prefers modern architecture. Fast decision maker once due diligence is passed.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="rounded-xl border border-white/5 bg-navy-900/50 p-6">
            <ActivityTimeline
              title="Transaction History"
              items={transactionHistory}
            />
          </div>
        )}

        {activeTab === 'communication' && (
          <div className="space-y-6">
            <div className="rounded-xl border border-white/5 bg-navy-900/50 p-6">
              <ActivityTimeline
                title="Support & Inquiry History"
                items={supportHistory}
              />
            </div>
          </div>
        )}

      </div>
    </Modal>
  );
}

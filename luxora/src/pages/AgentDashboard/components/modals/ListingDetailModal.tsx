import { useState } from 'react';
import { Home, MapPin, Tag, Users, Eye, Heart, MessageSquare, CheckCircle2, FileText, Image as ImageIcon, BarChart3, Activity } from 'lucide-react';
import { Modal } from '../../../../components/ui/Modal';
import { GoldButton, GhostButton } from '../../../../components/ui/ui';
import { StatusBadge } from '../../../ManagementDashboard/components/shared/StatusBadge';
import { ActivityTimeline } from '../../../../components/dashboard/shared/timelines/ActivityTimeline';

interface ListingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: Record<string, unknown> | null;
}

export function ListingDetailModal({ isOpen, onClose, listing }: ListingDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'history'>('overview');

  if (!listing) return null;

  const marketingTimeline = [
    { title: 'Listed on Premium Portals', time: '2 days ago', desc: 'Added to PropertyPro and Luxora Exclusive', icon: Activity, color: 'text-emerald-400' },
    { title: 'Professional Photoshoot', time: '1 week ago', desc: 'Completed by Visuals Inc.', icon: ImageIcon, color: 'text-gold-400' },
    { title: 'Listing Agreement Signed', time: '2 weeks ago', desc: 'Exclusive mandate secured', icon: CheckCircle2, color: 'text-blue-400' },
  ];

  const inquiries = [
    { name: 'Michael O.', time: '2 hours ago', type: 'Viewing Request' },
    { name: 'Sarah T.', time: 'Yesterday', type: 'General Inquiry' },
    { name: 'David B.', time: '3 days ago', type: 'Offer Submitted' },
  ];

  const checklist = [
    { task: 'Upload Virtual Tour', status: 'pending' },
    { task: 'Social Media Blast', status: 'completed' },
    { task: 'Open House Planning', status: 'pending' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Listing Details"
      size="2xl"
      actionButton={<GoldButton>Edit Listing</GoldButton>}
    >
      <div className="space-y-8 pb-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-6 items-start border-b border-white/5 pb-6">
          <div className="flex h-32 w-48 items-center justify-center rounded-2xl bg-navy-900 border border-white/10 shrink-0 overflow-hidden">
            <ImageIcon className="h-8 w-8 text-ink/40" />
            <span className="ml-2 text-sm text-ink/40">Gallery</span>
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-cream flex items-center gap-2">
                {String(listing.address || listing.property || 'Luxury Property')}
              </h2>
              <p className="text-ink/60 text-lg flex items-center gap-1 mt-1">
                <MapPin className="h-4 w-4" /> {String(listing.location || 'Premium Location')}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={String(listing.status || 'Active')} />
              <span className="inline-flex items-center rounded-full border border-white/10 bg-navy-800/50 px-2.5 py-0.5 text-xs font-semibold text-ink/70">
                <Tag className="h-3 w-3 mr-1 inline" /> {String(listing.price || 'Price on Request')}
              </span>
            </div>
            <div className="flex gap-4 pt-2">
              <GhostButton className="flex items-center gap-2 px-3 py-1.5 text-sm">
                <Share className="h-4 w-4" /> Share
              </GhostButton>
              <GhostButton className="flex items-center gap-2 px-3 py-1.5 text-sm">
                <Eye className="h-4 w-4" /> View as Public
              </GhostButton>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex border-b border-white/10">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'analytics', label: 'Analytics' },
            { id: 'history', label: 'History & Timeline' }
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
                  <Home className="h-4 w-4 text-ink/60" /> Property Overview
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="block text-ink/60 text-xs mb-1">Type</span>
                    <span className="text-cream">{String(listing.type || 'Villa')}</span>
                  </div>
                  <div>
                    <span className="block text-ink/60 text-xs mb-1">Beds/Baths</span>
                    <span className="text-cream">5 Beds / 6 Baths</span>
                  </div>
                  <div>
                    <span className="block text-ink/60 text-xs mb-1">Square Footage</span>
                    <span className="text-cream">4,500 sqft</span>
                  </div>
                  <div>
                    <span className="block text-ink/60 text-xs mb-1">Year Built</span>
                    <span className="text-cream">2023</span>
                  </div>
                </div>
              </div>
              
              <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                <h3 className="font-heading text-sm font-semibold text-cream mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-ink/60" /> Listing Checklist
                </h3>
                <div className="space-y-3">
                  {checklist.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className={`h-4 w-4 rounded-full border ${item.status === 'completed' ? 'bg-gold-400 border-gold-400' : 'border-ink/40'}`}></div>
                      <span className={`text-sm ${item.status === 'completed' ? 'text-cream line-through opacity-50' : 'text-cream'}`}>{item.task}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                <h3 className="font-heading text-sm font-semibold text-cream mb-4 flex items-center gap-2">
                  <Users className="h-4 w-4 text-ink/60" /> Recent Inquiries
                </h3>
                <div className="space-y-4">
                  {inquiries.map((inq, idx) => (
                    <div key={idx} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0 last:pb-0">
                      <div>
                        <span className="block text-sm text-cream">{inq.name}</span>
                        <span className="block text-xs text-ink/60">{inq.type}</span>
                      </div>
                      <span className="text-xs text-ink/40">{inq.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                <h3 className="font-heading text-sm font-semibold text-cream mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-ink/60" /> Internal Notes
                </h3>
                <p className="text-xs text-ink/80 leading-relaxed p-3 bg-navy-800 rounded-lg border border-white/5">
                  Owner is motivated to sell before year-end. Open to reasonable offers. Access is restricted to weekends only.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Views', value: '1,245', icon: Eye, trend: '+12%' },
                { label: 'Saves', value: '84', icon: Heart, trend: '+5%' },
                { label: 'Inquiries', value: '12', icon: MessageSquare, trend: '+2%' },
                { label: 'Showings', value: '4', icon: Users, trend: 'Stable' }
              ].map((stat, idx) => (
                <div key={idx} className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <stat.icon className="h-5 w-5 text-gold-400" />
                    <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">{stat.trend}</span>
                  </div>
                  <div className="text-2xl font-bold text-cream">{stat.value}</div>
                  <div className="text-xs text-ink/60 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
            
            <div className="rounded-xl border border-white/5 bg-navy-900/50 p-6 flex flex-col items-center justify-center min-h-[200px]">
              <BarChart3 className="h-12 w-12 text-ink/20 mb-3" />
              <p className="text-ink/60 text-sm">Detailed performance chart will render here.</p>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="rounded-xl border border-white/5 bg-navy-900/50 p-6">
            <ActivityTimeline
              title="Marketing & Listing Timeline"
              items={marketingTimeline}
            />
          </div>
        )}

      </div>
    </Modal>
  );
}

// Simple Share icon component since it might not be imported above
function Share(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" x2="12" y1="2" y2="15" />
    </svg>
  );
}

import { Modal } from '../../../ui/Modal';
import { EnterpriseStatusBadge } from '../../../../components/enterprise/EnterpriseStatusBadge';
import { ActivityTimeline } from '../../shared/timelines/ActivityTimeline';
import type { AdminListing } from '../../../../types/admin';
import { Building2, MapPin, Bed, Bath, Square, User, KeyRound, Clock } from 'lucide-react';

export interface ListingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: AdminListing | null;
}

export function ListingDetailsModal({ isOpen, onClose, listing }: ListingDetailsModalProps) {
  if (!listing) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Listing Details"
      size="4xl"
    >
      <div className="space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-full md:w-1/3 aspect-[4/3] rounded-xl bg-navy-900/50 border border-white/10 flex items-center justify-center overflow-hidden relative">
            <Building2 className="h-16 w-16 text-gold-400/20" />
            <div className="absolute inset-0 bg-gradient-to-tr from-gold-400/5 to-transparent" />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <EnterpriseStatusBadge status={listing.status} />
                {listing.priority === 'High' && (
                  <span className="inline-flex items-center rounded-full bg-gold-400/10 border border-gold-400/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold-400">
                    Featured
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-heading font-bold text-cream">{listing.title}</h2>
              <div className="flex items-center gap-2 text-ink/60 text-sm mt-1">
                <span className="font-mono text-xs">{listing.id}</span>
                <span>•</span>
                <span className="flex items-center"><MapPin className="h-3 w-3 mr-1" /> {listing.location}</span>
              </div>
            </div>
            
            <div className="text-3xl font-heading font-bold text-gold-400">
              {listing.price}
            </div>
          </div>
        </div>

        {/* Overview & Dimensions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="text-xs text-ink/50 uppercase tracking-wider mb-1">Property Type</div>
            <div className="font-semibold text-cream">Luxury Residence</div>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 text-xs text-ink/50 uppercase tracking-wider mb-1">
              <Bed className="h-3.5 w-3.5" /> Bedrooms
            </div>
            <div className="font-semibold text-cream">4</div>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 text-xs text-ink/50 uppercase tracking-wider mb-1">
              <Bath className="h-3.5 w-3.5" /> Bathrooms
            </div>
            <div className="font-semibold text-cream">3.5</div>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 text-xs text-ink/50 uppercase tracking-wider mb-1">
              <Square className="h-3.5 w-3.5" /> Area
            </div>
            <div className="font-semibold text-cream">4,200 sqft</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Ownership & Assignment */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-ink/50 uppercase tracking-wider">Ownership & Assignment</h3>
            <div className="rounded-xl border border-white/10 bg-navy-800/50 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gold-400/10 border border-gold-400/20 flex items-center justify-center">
                    <User className="h-5 w-5 text-gold-400" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-cream">{listing.owner}</div>
                    <div className="text-xs text-ink/60">Property Owner</div>
                  </div>
                </div>
              </div>
              <div className="h-px w-full bg-white/10" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center">
                    <KeyRound className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-cream">
                      {listing.assignment?.agencyName || 'Meridian Luxury'}
                    </div>
                    <div className="text-xs text-ink/60">Managing Agency</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-ink/50 uppercase tracking-wider">Recent Activity</h3>
            <div className="rounded-xl border border-white/10 bg-navy-800/50 p-6">
              <ActivityTimeline 
                title="" 
                items={[
                  { title: 'Listing Published', desc: 'Approved by Super Admin', time: '2 hours ago', color: 'text-emerald-400', icon: CheckCircle },
                  { title: 'Assigned to Agency', desc: 'Meridian Luxury', time: '1 day ago', color: 'text-gold-400', icon: KeyRound },
                  { title: 'Listing Submitted', desc: 'Awaiting verification', time: '2 days ago', color: 'text-blue-400', icon: Clock },
                ]} 
              />
            </div>
          </div>
        </div>

      </div>
    </Modal>
  );
}

// Dummy CheckCircle icon as it was missing from lucide-react imports above
import { CheckCircle } from 'lucide-react';

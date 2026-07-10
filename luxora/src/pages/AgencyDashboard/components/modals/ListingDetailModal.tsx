import { Share2, Image as ImageIcon, BarChart3, MessageSquare, CheckSquare, UserCircle, X, MapPin, CheckCircle2, Clock, Eye } from 'lucide-react';
import { GoldButton, GhostButton } from '../../../../components/ui/ui';
import { StatusBadge } from '../../../ManagementDashboard/components/shared/StatusBadge';
import { ActivityTimeline } from '../../../../components/dashboard/shared/timelines/ActivityTimeline';
import { SegmentedProgressBar } from '../../../../components/dashboard/shared/widgets/SegmentedProgressBar';

interface ListingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: {
    title: string;
    location: string;
    price: string;
    type: string;
    beds: number;
    baths: number;
    sqft: number;
    status: string;
    isFeatured: boolean;
    priority: string;
    assignedAgent: string;
    image: string;
    views: number;
    saves: number;
    enquiries: number;
    marketingStatus: string;
  } | null;
}

export function ListingDetailModal({ isOpen, onClose, listing }: ListingDetailModalProps) {
  if (!isOpen || !listing) return null;

  const marketingTimeline = [
    { title: 'Boost Campaign Started', time: 'Yesterday', desc: 'Featured on Homepage', icon: BarChart3, color: 'text-gold-400' },
    { title: 'Social Media Post', time: '3 days ago', desc: 'Instagram & LinkedIn', icon: Share2, color: 'text-blue-400' },
    { title: 'Listing Published', time: '1 week ago', desc: 'Approved by Admin', icon: CheckCircle2, color: 'text-emerald-400' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm">
      <div className="bg-navy-900 border border-white/10 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        
        {/* Sticky Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-navy-900 sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-heading font-bold text-cream flex items-center gap-3">
              {listing.title}
              {listing.isFeatured && <span className="text-[10px] bg-gold-400/20 text-gold-400 px-2 py-0.5 rounded font-bold uppercase">Featured</span>}
              <StatusBadge status={listing.status} />
            </h2>
            <div className="flex items-center gap-2 mt-1 text-sm text-ink/60">
              <MapPin className="h-4 w-4" /> {listing.location}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <GhostButton className="text-xs"><Eye className="h-3 w-3 mr-2" /> Public Preview</GhostButton>
            <button onClick={onClose} className="p-2 text-ink/60 hover:text-cream rounded-lg hover:bg-white/5 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Top Row: Gallery & KPIs */}
          <div className="grid lg:grid-cols-3 gap-6">
            
            {/* Image Gallery Placeholder */}
            <div className="lg:col-span-2 grid grid-cols-3 gap-3 h-[300px]">
              <div className="col-span-2 h-full rounded-xl bg-navy-950 border border-white/5 overflow-hidden relative group">
                <img src={listing.image} alt={listing.title} className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 text-2xl font-bold text-cream">{listing.price}</div>
              </div>
              <div className="space-y-3 flex flex-col">
                <div className="flex-1 rounded-xl bg-navy-950 border border-white/5 overflow-hidden">
                  <img src={listing.image} alt="Interior 1" className="w-full h-full object-cover opacity-60" />
                </div>
                <div className="flex-1 rounded-xl bg-navy-950 border border-white/5 flex items-center justify-center cursor-pointer hover:bg-white/5 transition-colors">
                  <div className="text-center">
                    <ImageIcon className="h-6 w-6 text-ink/40 mx-auto mb-1" />
                    <span className="text-xs font-medium text-ink/60">+12 Photos</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Statistics */}
            <div className="space-y-4">
              <div className="p-5 rounded-xl border border-white/10 bg-navy-800/50">
                <h3 className="text-sm font-bold text-cream mb-4 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-gold-400" /> Analytics Summary
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-ink/80">Total Views</span>
                    <span className="font-bold text-cream">{listing.views}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-ink/80">Saves/Favorites</span>
                    <span className="font-bold text-cream">{listing.saves}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-ink/80">Active Enquiries</span>
                    <span className="font-bold text-blue-400">{listing.enquiries}</span>
                  </div>
                  <div className="pt-3 border-t border-white/5">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-ink/60">Conversion Rate</span>
                      <span className="font-bold text-emerald-400">4.2%</span>
                    </div>
                    <SegmentedProgressBar segments={[{label: 'Conv', value: 4.2, color: 'bg-emerald-400'}]} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Details Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              
              {/* Property Details */}
              <div className="p-6 rounded-xl border border-white/10 bg-navy-800/50">
                <h3 className="text-lg font-heading font-bold text-cream mb-4">Complete Property Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-xs text-ink/60 mb-1">Property Type</div>
                    <div className="font-bold text-cream text-sm">{listing.type}</div>
                  </div>
                  <div>
                    <div className="text-xs text-ink/60 mb-1">Bedrooms</div>
                    <div className="font-bold text-cream text-sm">{listing.beds}</div>
                  </div>
                  <div>
                    <div className="text-xs text-ink/60 mb-1">Bathrooms</div>
                    <div className="font-bold text-cream text-sm">{listing.baths}</div>
                  </div>
                  <div>
                    <div className="text-xs text-ink/60 mb-1">Square Area</div>
                    <div className="font-bold text-cream text-sm">{listing.sqft} sqft</div>
                  </div>
                  <div>
                    <div className="text-xs text-ink/60 mb-1">Build Year</div>
                    <div className="font-bold text-cream text-sm">2023</div>
                  </div>
                  <div>
                    <div className="text-xs text-ink/60 mb-1">Parking Spaces</div>
                    <div className="font-bold text-cream text-sm">3</div>
                  </div>
                </div>
              </div>

              {/* Internal Notes & Checklist */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-5 rounded-xl border border-white/10 bg-navy-800/50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-cream">Internal Notes</h3>
                    <GhostButton className="text-[10px] px-2 py-1 h-auto">Add Note</GhostButton>
                  </div>
                  <div className="p-3 rounded-lg border border-white/5 bg-navy-950 text-sm text-ink/80 flex gap-3">
                    <MessageSquare className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                    <p>Owner requested to emphasize the smart home features in the description. Also, no viewings on Sunday mornings.</p>
                  </div>
                </div>

                <div className="p-5 rounded-xl border border-white/10 bg-navy-800/50">
                  <h3 className="text-sm font-bold text-cream mb-4">Listing Checklist</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-cream"><CheckSquare className="h-4 w-4 text-emerald-400" /> High-res Photos</div>
                    <div className="flex items-center gap-2 text-sm text-cream"><CheckSquare className="h-4 w-4 text-emerald-400" /> Floor Plan Uploaded</div>
                    <div className="flex items-center gap-2 text-sm text-ink/60"><CheckSquare className="h-4 w-4 opacity-30" /> Virtual Tour Link</div>
                    <div className="flex items-center gap-2 text-sm text-ink/60"><CheckSquare className="h-4 w-4 opacity-30" /> Energy Certificate</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Agents & Timelines */}
            <div className="space-y-6">
              
              {/* Assigned Agent */}
              <div className="p-5 rounded-xl border border-white/10 bg-navy-800/50">
                <h3 className="text-sm font-bold text-cream mb-4 flex items-center gap-2">
                  <UserCircle className="h-4 w-4 text-gold-400" /> Primary Agent
                </h3>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-navy-950 flex items-center justify-center font-bold text-cream border border-gold-400/30">
                    {listing.assignedAgent?.charAt(0) || 'A'}
                  </div>
                  <div>
                    <div className="font-bold text-cream text-sm">{listing.assignedAgent}</div>
                    <div className="text-xs text-ink/60 flex items-center gap-1"><Clock className="h-3 w-3" /> Last active 2h ago</div>
                  </div>
                </div>
                <GhostButton className="w-full mt-4 text-xs">Reassign Property</GhostButton>
              </div>

              {/* Marketing Timeline */}
              <div className="p-5 rounded-xl border border-white/10 bg-navy-800/50">
                <ActivityTimeline title="Marketing & Visibility" items={marketingTimeline} />
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="p-4 border-t border-white/10 flex justify-between gap-3 bg-navy-900 sticky bottom-0 z-10">
          <GhostButton className="text-rose-400 hover:text-rose-300 hover:bg-rose-400/10">Unpublish Listing</GhostButton>
          <div className="flex gap-3">
            <GhostButton onClick={onClose}>Close Preview</GhostButton>
            <GoldButton>Edit Details</GoldButton>
          </div>
        </div>

      </div>
    </div>
  );
}

// Removed dummy share icon

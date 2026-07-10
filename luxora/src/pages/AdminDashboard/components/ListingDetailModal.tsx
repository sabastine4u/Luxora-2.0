import { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { MapPin, Home, Bed, Bath, Square, CheckCircle, XCircle, AlertTriangle, Clock, Image as ImageIcon } from 'lucide-react';

export interface ListingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: Record<string, unknown> | null;
}

export function ListingDetailModal({ isOpen, onClose, listing }: ListingDetailModalProps) {
  const [notes, setNotes] = useState('');
  
  if (!listing) return null;

  const features = [
    { icon: Bed, label: '4 Beds' },
    { icon: Bath, label: '3.5 Baths' },
    { icon: Square, label: '4,200 sqft' },
  ];

  const checklist = [
    { id: 1, text: 'Title Deed Verified', checked: true },
    { id: 2, text: 'Owner KYC Match', checked: true },
    { id: 3, text: 'Photos meet guidelines', checked: false },
    { id: 4, text: 'Pricing is within market range', checked: true },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setNotes('');
        onClose();
      }}
      title={`Listing Review: ${listing.title}`}
      size="4xl"
      actionButton={
        <div className="flex gap-2">
          <GhostButton size="sm" className="text-rose-400 hover:text-rose-300 hover:bg-rose-400/10">
            <AlertTriangle className="h-4 w-4 mr-2" /> Flag Listing
          </GhostButton>
          <GhostButton size="sm" className="text-ink/60 hover:text-cream hover:bg-white/10" onClick={onClose}>
            <XCircle className="h-4 w-4 mr-2" /> Reject
          </GhostButton>
          <GoldButton size="sm" className="bg-emerald-500 hover:bg-emerald-400 text-white" onClick={onClose}>
            <CheckCircle className="h-4 w-4 mr-2" /> Approve
          </GoldButton>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Details & Images */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-cream">{String(listing.title)}</h3>
                <div className="flex items-center gap-1 text-sm text-ink/60 mt-1">
                  <MapPin className="h-4 w-4" /> {String(listing.location || 'Unknown Location')}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gold-400">₦{String(listing.price || '0')}</div>
                <div className="text-xs text-ink/50 uppercase tracking-wider">Asking Price</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              {features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5 text-sm text-cream">
                  <feat.icon className="h-4 w-4 text-ink/40" />
                  {feat.label}
                </div>
              ))}
              <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5 text-sm text-cream">
                <Home className="h-4 w-4 text-ink/40" />
                {String(listing.type || 'Property')}
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-cream mb-3">Property Gallery</h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 row-span-2 flex items-center justify-center rounded-xl bg-navy-900/50 border border-white/10 aspect-video">
                <ImageIcon className="h-12 w-12 text-ink/20" />
              </div>
              <div className="flex items-center justify-center rounded-xl bg-navy-900/50 border border-white/10 aspect-video">
                <ImageIcon className="h-6 w-6 text-ink/20" />
              </div>
              <div className="flex items-center justify-center rounded-xl bg-navy-900/50 border border-white/10 aspect-video">
                <ImageIcon className="h-6 w-6 text-ink/20" />
              </div>
              <div className="flex items-center justify-center rounded-xl bg-navy-900/50 border border-white/10 aspect-video">
                <ImageIcon className="h-6 w-6 text-ink/20" />
              </div>
              <div className="flex items-center justify-center rounded-xl bg-navy-900/50 border border-white/10 aspect-video">
                <ImageIcon className="h-6 w-6 text-ink/20" />
              </div>
              <div className="flex items-center justify-center rounded-xl bg-navy-900/50 border border-white/10 aspect-video relative group cursor-pointer">
                <ImageIcon className="h-6 w-6 text-ink/20" />
                <div className="absolute inset-0 bg-navy-900/80 flex items-center justify-center rounded-xl font-semibold text-cream text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  View All
                </div>
                <div className="absolute inset-0 bg-navy-900/40 flex items-center justify-center rounded-xl font-semibold text-cream text-sm group-hover:opacity-0 transition-opacity">
                  +8 more
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-cream mb-3">Moderation Notes</h4>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add internal notes regarding this listing's approval/rejection..."
              className="w-full h-24 rounded-xl border border-white/10 bg-navy-900/50 p-4 text-sm text-cream placeholder:text-ink/40 focus:border-gold-400/50 focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* Right Column: History & Checklist */}
        <div className="space-y-6 lg:border-l lg:border-white/10 lg:pl-8">
          <div>
            <h4 className="text-sm font-semibold text-cream mb-3">Review Checklist</h4>
            <div className="space-y-3">
              {checklist.map((item) => (
                <label key={item.id} className="flex items-start gap-3 cursor-pointer group">
                  <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-white/20 bg-navy-900 group-hover:border-gold-400/50 transition-colors">
                    {item.checked && <CheckCircle className="h-3 w-3 text-gold-400" />}
                  </div>
                  <span className="text-sm text-ink/60 group-hover:text-cream transition-colors">{item.text}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-white/10">
            <h4 className="text-sm font-semibold text-cream mb-4">Listing History</h4>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="h-2 w-2 rounded-full bg-gold-400" />
                  <div className="h-full w-px bg-white/10 mt-1" />
                </div>
                <div className="pb-2 text-sm">
                  <div className="text-cream font-medium">Submitted for Review</div>
                  <div className="text-ink/50 text-xs flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3" /> 2 hours ago
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="h-2 w-2 rounded-full bg-blue-400" />
                  <div className="h-full w-px bg-transparent mt-1" />
                </div>
                <div className="pb-2 text-sm">
                  <div className="text-cream font-medium">Draft Created</div>
                  <div className="text-ink/50 text-xs flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3" /> 1 day ago
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </Modal>
  );
}

import { Modal } from '../../../ui/Modal';
import { ActivityTimeline } from '../../shared/timelines/ActivityTimeline';
import type { AdminListing } from '../../../../types/admin';
import { CheckCircle, Clock, KeyRound, Edit } from 'lucide-react';

export interface ListingHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: AdminListing | null;
}

export function ListingHistoryModal({ isOpen, onClose, listing }: ListingHistoryModalProps) {
  if (!listing) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Listing History"
      size="2xl"
    >
      <div className="space-y-6">
        <div className="p-4 rounded-xl bg-navy-800/50 border border-white/10 mb-6">
          <h4 className="text-cream font-semibold">{listing.title}</h4>
          <p className="text-ink/60 text-sm">ID: {listing.id}</p>
        </div>
        
        <ActivityTimeline 
          title="Full Lifecycle History"
          items={[
            { title: 'Listing Edited', desc: 'Updated pricing and descriptions', time: '1 hour ago', color: 'text-blue-400', icon: Edit },
            { title: 'Listing Published', desc: 'Approved by Super Admin', time: '1 day ago', color: 'text-emerald-400', icon: CheckCircle },
            { title: 'Assigned to Agency', desc: 'Meridian Luxury', time: '1 day ago', color: 'text-gold-400', icon: KeyRound },
            { title: 'Listing Submitted', desc: 'Awaiting verification', time: '2 days ago', color: 'text-ink/60', icon: Clock },
          ]} 
        />
      </div>
    </Modal>
  );
}

import { useState, useEffect } from 'react';
import { GhostButton, GoldButton } from '../../../../components/ui/ui';
import { Modal } from '../../../../components/ui/Modal';
import type { OwnerOffer } from '../../../../types/owner';

interface OfferResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (amount: number, notes: string) => void;
  offer: OwnerOffer | null;
}

export default function OfferResponseModal({ isOpen, onClose, onSubmit, offer }: OfferResponseModalProps) {
  const [amount, setAmount] = useState(0);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (offer) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAmount(offer.amount);
    }
  }, [offer]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Counter Offer">
      {offer && (
        <div className="space-y-4">
          <div className="bg-navy-800/50 p-4 rounded-xl border border-white/5">
            <p className="text-sm text-ink/60 mb-1">Current Offer</p>
            <p className="text-xl font-heading text-cream font-bold">₦{offer.amount.toLocaleString()}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink/70 mb-2">Counter Amount (₦)</label>
            <input 
              type="number" 
              value={amount} 
              onChange={e => setAmount(Number(e.target.value))}
              className="w-full bg-navy-800 border border-white/10 rounded-xl px-4 py-3 text-cream focus:outline-none focus:border-gold-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink/70 mb-2">Message to Buyer</label>
            <textarea 
              value={notes} 
              onChange={e => setNotes(e.target.value)}
              rows={4} 
              className="w-full bg-navy-800 border border-white/10 rounded-xl px-4 py-3 text-cream focus:outline-none focus:border-gold-400 resize-none" 
              placeholder="Explain your counter offer..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <GhostButton onClick={onClose}>Cancel</GhostButton>
            <GoldButton onClick={() => onSubmit(amount, notes)}>Send Counter Offer</GoldButton>
          </div>
        </div>
      )}
    </Modal>
  );
}

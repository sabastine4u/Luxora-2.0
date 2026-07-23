import { useState } from 'react';
import { GoldButton, GhostButton } from '../../../../components/ui/ui';
import { Modal } from '../../../../components/ui/Modal';
import type { ViewingRequest } from '../../../../types';

interface RescheduleViewingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (date: string, time: string, notes: string) => void;
  viewing: ViewingRequest | null;
}

export function RescheduleViewingModal({
  isOpen,
  onClose,
  onSubmit,
  viewing
}: RescheduleViewingModalProps) {
  const [date, setDate] = useState(viewing?.date || '');
  const [time, setTime] = useState(viewing?.time || '');
  const [notes, setNotes] = useState('');

  if (!viewing) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(date, time, notes);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reschedule Viewing Request">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-navy-900/50 border border-white/5 space-y-2">
            <div className="text-xs text-ink/60 uppercase tracking-wider font-semibold">Property</div>
            <div className="text-cream font-medium">{viewing.propertyTitle}</div>
            <div className="text-xs text-ink/50">Current Schedule: {viewing.date} at {viewing.time}</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-cream">New Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-3 text-cream focus:border-gold-400/50 focus:outline-none transition-colors [color-scheme:dark]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-cream">New Time</label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-3 text-cream focus:border-gold-400/50 focus:outline-none transition-colors [color-scheme:dark]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-cream">Notes to Agent (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-3 text-cream focus:border-gold-400/50 focus:outline-none transition-colors min-h-[100px] resize-none"
              placeholder="Reason for rescheduling or special requests..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
          <GhostButton type="button" onClick={onClose}>Cancel</GhostButton>
          <GoldButton type="submit">Reschedule</GoldButton>
        </div>
      </form>
    </Modal>
  );
}

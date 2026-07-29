import { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { GoldButton, GhostButton } from '../../../../components/ui/ui';

interface DeclineAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export default function DeclineAssignmentModal({ isOpen, onClose, onConfirm }: DeclineAssignmentModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>('');
  
  if (!isOpen) return null;

  const reasons = [
    'Too many active listings',
    'Outside service area',
    'Conflict of interest',
    'Wrong specialization',
    'Personal schedule',
    'Other'
  ];

  const handleConfirm = () => {
    if (selectedReason) {
      onConfirm(selectedReason);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-navy-900 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-ink/50 hover:text-cream transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10">
            <AlertCircle className="h-6 w-6 text-rose-400" />
          </div>
          <h2 className="font-heading text-xl font-bold text-cream">Decline Assignment</h2>
          <p className="mt-1 text-sm text-ink/60">
            Please provide a reason for declining this property assignment.
          </p>
        </div>

        <div className="space-y-3 mb-8">
          {reasons.map((reason) => (
            <label key={reason} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
              selectedReason === reason 
                ? 'bg-rose-500/10 border-rose-500/30' 
                : 'bg-navy-950/50 border-white/5 hover:border-white/10'
            }`}>
              <input 
                type="radio" 
                name="decline-reason" 
                value={reason}
                checked={selectedReason === reason}
                onChange={() => setSelectedReason(reason)}
                className="hidden"
              />
              <div className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                selectedReason === reason ? 'border-rose-400' : 'border-white/20'
              }`}>
                {selectedReason === reason && <div className="h-2 w-2 rounded-full bg-rose-400" />}
              </div>
              <span className={`text-sm ${selectedReason === reason ? 'text-cream font-medium' : 'text-ink/80'}`}>
                {reason}
              </span>
            </label>
          ))}
        </div>

        <div className="flex gap-3">
          <GhostButton className="flex-1" onClick={onClose}>
            Cancel
          </GhostButton>
          <GoldButton 
            className="flex-1 !bg-rose-500/20 !text-rose-400 hover:!bg-rose-500/30 border border-rose-500/30" 
            onClick={handleConfirm}
            disabled={!selectedReason}
          >
            Decline Assignment
          </GoldButton>
        </div>
      </div>
    </div>
  );
}

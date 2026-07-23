import { AlertTriangle, Info } from 'lucide-react';
import { GhostButton } from '../../../../components/ui/ui';
import { Modal } from '../../../../components/ui/Modal';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export default function ConfirmationModal({
  isOpen, onClose, onConfirm, title, description, confirmText = 'Confirm', cancelText = 'Cancel', isDestructive = false
}: ConfirmationModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-6">
        <div className={`flex items-start gap-4 p-4 rounded-xl border ${isDestructive ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-gold-500/10 border-gold-500/20 text-gold-400'}`}>
          {isDestructive ? <AlertTriangle className="h-5 w-5 shrink-0" /> : <Info className="h-5 w-5 shrink-0" />}
          <p className="text-sm font-medium leading-relaxed">{description}</p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
          <GhostButton onClick={onClose}>{cancelText}</GhostButton>
          <button 
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isDestructive 
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20' 
                : 'bg-gold-400 hover:bg-gold-500 text-navy-900 shadow-lg shadow-gold-400/20'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}

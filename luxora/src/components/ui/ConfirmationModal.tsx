import { AlertTriangle, Info } from 'lucide-react';
import { GhostButton } from './ui';
import { Modal } from './Modal';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  isDestructive?: boolean;
  danger?: boolean;
  description?: string;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning',
  isDestructive,
  danger,
  description
}: ConfirmationModalProps) {
  const actualType = isDestructive || danger ? 'danger' : type;
  const actualMessage = description || message;
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className={`shrink-0 rounded-full p-3 ${
            actualType === 'danger' ? 'bg-rose-400/10 text-rose-400' : 
            actualType === 'warning' ? 'bg-yellow-400/10 text-yellow-400' : 
            'bg-blue-400/10 text-blue-400'
          }`}>
            {actualType === 'info' ? <Info className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6" />}
          </div>
          <div>
            <p className="text-sm text-cream/80 leading-relaxed">{actualMessage}</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
          <GhostButton onClick={onClose}>{cancelText}</GhostButton>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              actualType === 'danger' 
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20' 
                : 'bg-gold-400 hover:bg-gold-300 text-navy-900 shadow-lg shadow-gold-400/20'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}

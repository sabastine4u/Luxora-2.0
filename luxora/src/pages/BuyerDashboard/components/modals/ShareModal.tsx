import { Mail, MessageCircle, Link } from 'lucide-react';
import { GhostButton } from '../../../../components/ui/ui';
import { Modal } from '../../../../components/ui/Modal';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyTitle: string;
  onShare: (method: string) => void;
}

export function ShareModal({
  isOpen,
  onClose,
  propertyTitle,
  onShare
}: ShareModalProps) {
  
  const handleShare = (method: string) => {
    onShare(method);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Property">
      <div className="space-y-6">
        <p className="text-sm text-cream/80">
          How would you like to share <strong>{propertyTitle}</strong>?
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleShare('Copy Link')}
            className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border border-white/10 bg-navy-900/50 hover:bg-white/5 hover:border-gold-400/50 transition-all text-cream"
          >
            <Link className="h-6 w-6 text-gold-400" />
            <span className="text-sm font-medium">Copy Link</span>
          </button>
          <button
            onClick={() => handleShare('Email')}
            className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border border-white/10 bg-navy-900/50 hover:bg-white/5 hover:border-gold-400/50 transition-all text-cream"
          >
            <Mail className="h-6 w-6 text-gold-400" />
            <span className="text-sm font-medium">Email</span>
          </button>
          <button
            onClick={() => handleShare('WhatsApp')}
            className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border border-white/10 bg-navy-900/50 hover:bg-white/5 hover:border-gold-400/50 transition-all text-cream col-span-2"
          >
            <MessageCircle className="h-6 w-6 text-emerald-400" />
            <span className="text-sm font-medium">WhatsApp</span>
          </button>
        </div>

        <div className="flex justify-end pt-4 border-t border-white/10">
          <GhostButton onClick={onClose}>Cancel</GhostButton>
        </div>
      </div>
    </Modal>
  );
}

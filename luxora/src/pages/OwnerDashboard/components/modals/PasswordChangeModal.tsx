import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { GhostButton, GoldButton } from '../../../../components/ui/ui';
import { Modal } from '../../../../components/ui/Modal';

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;

  // Return the entered passwords to the Owner Settings page.
  onSave: (
    currentPassword: string,
    newPassword: string,
  ) => void;
}

export default function PasswordChangeModal({ isOpen, onClose, onSave }: PasswordChangeModalProps) {
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  // Track visibility independently for each password field.
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Change Password">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink/70 mb-2">
            Current Password
          </label>

          <div className="relative">
            <input
              type={showCurrent ? 'text' : 'password'}
              value={current}
              onChange={(event) => setCurrent(event.target.value)}
              className="w-full bg-navy-800 border border-white/10 rounded-xl px-4 py-3 pr-12 text-cream focus:outline-none focus:border-gold-400"
            />

            <button
              type="button"
              onClick={() => setShowCurrent((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 hover:text-cream transition-colors"
              aria-label={
                showCurrent
                  ? 'Hide current password'
                  : 'Show current password'
              }
            >
              {showCurrent ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
        <div>
  <label className="block text-sm font-medium text-ink/70 mb-2">
    New Password
  </label>

  <div className="relative">
    <input
      type={showNew ? 'text' : 'password'}
      value={newPass}
      onChange={(event) => setNewPass(event.target.value)}
      className="w-full bg-navy-800 border border-white/10 rounded-xl px-4 py-3 pr-12 text-cream focus:outline-none focus:border-gold-400"
    />

    <button
      type="button"
      onClick={() => setShowNew((prev) => !prev)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 hover:text-cream transition-colors"
      aria-label={
        showNew
          ? 'Hide new password'
          : 'Show new password'
      }
    >
      {showNew ? (
        <EyeOff className="h-5 w-5" />
      ) : (
        <Eye className="h-5 w-5" />
      )}
    </button>
  </div>
</div>
       <div>
  <label className="block text-sm font-medium text-ink/70 mb-2">
    Confirm New Password
  </label>

  <div className="relative">
    <input
      type={showConfirm ? 'text' : 'password'}
      value={confirm}
      onChange={(event) => setConfirm(event.target.value)}
      className="w-full bg-navy-800 border border-white/10 rounded-xl px-4 py-3 pr-12 text-cream focus:outline-none focus:border-gold-400"
    />

    <button
      type="button"
      onClick={() => setShowConfirm((prev) => !prev)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 hover:text-cream transition-colors"
      aria-label={
        showConfirm
          ? 'Hide password confirmation'
          : 'Show password confirmation'
      }
    >
      {showConfirm ? (
        <EyeOff className="h-5 w-5" />
      ) : (
        <Eye className="h-5 w-5" />
      )}
    </button>
  </div>
</div>

        <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
          <GhostButton onClick={onClose}>Cancel</GhostButton>
          <GoldButton
            onClick={() => onSave(current, newPass)}
            disabled={!current || !newPass || newPass !== confirm}
          >
            Save Password
          </GoldButton>
        </div>
      </div>
    </Modal>
  );
}

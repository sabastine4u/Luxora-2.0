import { useState } from 'react';
import { GhostButton, GoldButton } from '../../../../components/ui/ui';
import { Modal } from '../../../../components/ui/Modal';

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function PasswordChangeModal({ isOpen, onClose, onSave }: PasswordChangeModalProps) {
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Change Password">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink/70 mb-2">Current Password</label>
          <input 
            type="password" 
            value={current} 
            onChange={e => setCurrent(e.target.value)}
            className="w-full bg-navy-800 border border-white/10 rounded-xl px-4 py-3 text-cream focus:outline-none focus:border-gold-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink/70 mb-2">New Password</label>
          <input 
            type="password" 
            value={newPass} 
            onChange={e => setNewPass(e.target.value)}
            className="w-full bg-navy-800 border border-white/10 rounded-xl px-4 py-3 text-cream focus:outline-none focus:border-gold-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink/70 mb-2">Confirm New Password</label>
          <input 
            type="password" 
            value={confirm} 
            onChange={e => setConfirm(e.target.value)}
            className="w-full bg-navy-800 border border-white/10 rounded-xl px-4 py-3 text-cream focus:outline-none focus:border-gold-400"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
          <GhostButton onClick={onClose}>Cancel</GhostButton>
          <GoldButton onClick={onSave} disabled={!current || !newPass || newPass !== confirm}>Save Password</GoldButton>
        </div>
      </div>
    </Modal>
  );
}

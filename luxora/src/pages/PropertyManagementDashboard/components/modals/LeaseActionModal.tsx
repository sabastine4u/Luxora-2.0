import { useState } from 'react';
import { Modal } from '../../../../components/ui/Modal';
import { GoldButton } from '../../../../components/ui/ui';
import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';
import { AlertTriangle } from 'lucide-react';

interface LeaseActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { action: 'Renew' | 'Terminate'; duration: string; reason: string }) => void;
  action: 'Renew' | 'Terminate';
  tenantName?: string;
}

export function LeaseActionModal({ isOpen, onClose, onSubmit, action, tenantName = 'Tenant' }: LeaseActionModalProps) {
  const [duration, setDuration] = useState('1 Year');
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    if (action === 'Terminate' && !reason) return;
    onSubmit({ action, duration, reason });
    setDuration('1 Year');
    setReason('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${action} Lease - ${tenantName}`}
      size="md"
      actionButton={
        <GoldButton 
          onClick={handleSubmit} 
          disabled={action === 'Terminate' && !reason}
          className={action === 'Terminate' ? 'bg-rose-500 hover:bg-rose-600 text-white' : ''}
        >
          {action === 'Renew' ? 'Renew Lease' : 'Terminate Lease'}
        </GoldButton>
      }
    >
      <div className="space-y-4">
        {action === 'Renew' ? (
          <>
            <Select 
              label="Renewal Duration" 
              options={[
                { value: '6 Months', label: '6 Months' },
                { value: '1 Year', label: '1 Year' },
                { value: '2 Years', label: '2 Years' },
              ]}
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
            <Input 
              label="New Rent Amount (Optional)" 
              placeholder="Leave blank to keep current rent" 
            />
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <p className="text-sm font-medium">This will initiate the lease termination process.</p>
            </div>
            <Select 
              label="Reason for Termination" 
              options={[
                { value: 'Tenant Request', label: 'Tenant Request' },
                { value: 'Eviction', label: 'Eviction' },
                { value: 'End of Term', label: 'End of Term' },
                { value: 'Property Sale', label: 'Property Sale' },
              ]}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </>
        )}
      </div>
    </Modal>
  );
}

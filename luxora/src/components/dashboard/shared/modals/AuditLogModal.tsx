import { Modal } from '../../../ui/Modal';
import type { AdminListing } from '../../../../types/admin';

export interface AuditLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: AdminListing | null;
}

export function AuditLogModal({ isOpen, onClose, listing }: AuditLogModalProps) {
  if (!listing) return null;

  const logs = [
    { id: 'AL-902', action: 'STATUS_CHANGED', user: 'admin@luxora.com', timestamp: '2026-08-05T10:23:45Z', details: 'Status changed from Draft to Published' },
    { id: 'AL-845', action: 'ASSIGNMENT_UPDATED', user: 'system_auto', timestamp: '2026-08-04T15:12:10Z', details: 'Agency assignment completed: Meridian Luxury' },
    { id: 'AL-801', action: 'RECORD_CREATED', user: 'agent@meridian.com', timestamp: '2026-08-03T09:00:00Z', details: 'Initial record creation' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Security Audit Log"
      size="3xl"
    >
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-navy-800/50 border border-white/10 mb-4">
          <h4 className="text-cream font-semibold">{listing.title}</h4>
          <p className="text-ink/60 text-sm">Target ID: {listing.id}</p>
        </div>

        <div className="overflow-hidden rounded-xl border border-white/10 bg-navy-900/50">
          <table className="w-full text-left text-sm">
            <thead className="bg-navy-800 border-b border-white/10 text-ink/60 font-semibold">
              <tr>
                <th className="px-4 py-3">Event ID</th>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Actor</th>
                <th className="px-4 py-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-white/5">
                  <td className="px-4 py-3 font-mono text-xs text-ink/40">{log.id}</td>
                  <td className="px-4 py-3 text-ink/60">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="px-4 py-3 text-gold-400 text-xs font-semibold">{log.action}</td>
                  <td className="px-4 py-3 text-cream">{log.user}</td>
                  <td className="px-4 py-3 text-ink/60">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
}

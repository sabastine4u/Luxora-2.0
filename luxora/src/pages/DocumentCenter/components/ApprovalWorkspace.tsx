import { useDocumentCenter } from '../hooks/useDocumentCenter';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { MOCK_USERS } from '../data/mockData';
import { formatMessageTime } from '../../CommunicationCenter/utils/formatter';
import { GoldButton, GhostButton } from '../../../components/ui/ui';

export const ApprovalWorkspace = () => {
  const { approvals, documents } = useDocumentCenter();

  return (
    <div className="p-8 max-w-5xl mx-auto h-full flex flex-col">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Approval Center</h2>
        <p className="text-gray-500">Review, approve, or reject documents pending your authorization.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 shrink-0">
        <div className="bg-white dark:bg-ink border border-gray-200 dark:border-ink-light rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500 uppercase font-bold mb-1">Pending Review</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{approvals.filter(a => a.status === 'Pending').length}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600"><Clock className="w-5 h-5" /></div>
        </div>
        <div className="bg-white dark:bg-ink border border-gray-200 dark:border-ink-light rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500 uppercase font-bold mb-1">Approved (30d)</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{approvals.filter(a => a.status === 'Approved').length}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600"><CheckCircle className="w-5 h-5" /></div>
        </div>
        <div className="bg-white dark:bg-ink border border-gray-200 dark:border-ink-light rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500 uppercase font-bold mb-1">Rejected</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{approvals.filter(a => a.status === 'Rejected').length}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600"><XCircle className="w-5 h-5" /></div>
        </div>
        <div className="bg-white dark:bg-ink border border-gray-200 dark:border-ink-light rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500 uppercase font-bold mb-1">Needs Changes</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{approvals.filter(a => a.status === 'Requires Changes').length}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600"><AlertCircle className="w-5 h-5" /></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-ink-light bg-gray-50 dark:bg-ink-light/20">
              <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Document</th>
              <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Requested By</th>
              <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {approvals.map(approval => {
              const doc = documents.find(d => d.id === approval.documentId);
              const user = doc ? MOCK_USERS[doc.metadata.ownerId as keyof typeof MOCK_USERS] : null;

              if (!doc) return null;

              return (
                <tr key={approval.id} className="border-b border-gray-100 dark:border-ink-light hover:bg-gray-50 dark:hover:bg-ink-light/20 transition-colors">
                  <td className="py-4 px-4">
                    <div className="font-semibold text-sm text-gray-900 dark:text-white">{doc.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{doc.category} • v{doc.currentVersion}.0</div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                    {user?.name || 'Unknown'}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                    {formatMessageTime(approval.timestamp)}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${
                      approval.status === 'Pending' ? 'bg-yellow-50 text-yellow-700' :
                      approval.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' :
                      approval.status === 'Rejected' ? 'bg-red-50 text-red-700' :
                      'bg-orange-50 text-orange-700'
                    }`}>
                      {approval.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    {approval.status === 'Pending' ? (
                      <div className="flex items-center justify-end space-x-2">
                        <GhostButton size="sm" className="text-red-600 hover:bg-red-50">Reject</GhostButton>
                        <GoldButton size="sm">Approve</GoldButton>
                      </div>
                    ) : (
                      <GhostButton size="sm">View Log</GhostButton>
                    )}
                  </td>
                </tr>
              );
            })}
            {approvals.length === 0 && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-gray-500">No approvals found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

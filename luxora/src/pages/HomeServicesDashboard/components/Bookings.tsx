import { useState } from 'react';
import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';
import { bookings } from '../../../data/homeServicesData';
import type { Booking } from '../../../types';
import { ConfirmationModal } from './modals/ConfirmationModal';
import { useToast } from '../../../contexts/ToastContext';

export default function Bookings() {
  const { showToast } = useToast();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [modalState, setModalState] = useState<'none' | 'update' | 'cancel'>('none');

  const handleStatusUpdate = () => {
    showToast({ title: 'Success', description: 'Booking status updated successfully', type: 'success' });
    setModalState('none');
    setSelectedBooking(null);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <DataTableToolbar searchPlaceholder="Search bookings..." onFilter={() => {}} />
      </div>

      <div className="bg-navy-800/50 rounded-2xl border border-white/10 p-6">
        <DataTable
          columns={[
            { header: 'Customer', render: (b) => b.customerName },
            { header: 'Provider', render: (b) => b.providerName },
            { header: 'Category', render: (b) => b.category },
            { header: 'Date', render: (b) => b.date },
            { header: 'Time', render: (b) => b.time },
            { header: 'Status', render: (b) => <EnterpriseStatusBadge status={b.status} /> },
            { header: 'Actions', render: (b) => (
              <GhostButton size="sm" onClick={() => setSelectedBooking(b)}>View</GhostButton>
            )}
          ]}
          keyExtractor={(b) => b.id}
          data={bookings}
        />
      </div>

      <EnterpriseDetailDrawer
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        title="Booking Details"
      >
        {selectedBooking && (
          <div className="space-y-6 text-cream">
            <div>
              <p className="text-sm text-ink/60">Booking ID</p>
              <p className="font-medium">{selectedBooking.id}</p>
            </div>
            <div>
              <p className="text-sm text-ink/60">Customer</p>
              <p className="font-medium">{selectedBooking.customerName}</p>
            </div>
            <div>
              <p className="text-sm text-ink/60">Provider</p>
              <p className="font-medium">{selectedBooking.providerName}</p>
            </div>
            <div>
              <p className="text-sm text-ink/60">Schedule</p>
              <p className="font-medium">{selectedBooking.date} at {selectedBooking.time}</p>
            </div>
            <div>
              <p className="text-sm text-ink/60">Amount</p>
              <p className="font-medium">₦{selectedBooking.amount.toLocaleString()}</p>
            </div>

            <div className="flex gap-3 pt-6 border-t border-white/10">
              <GoldButton onClick={() => setModalState('update')} className="flex-1">Mark Completed</GoldButton>
              <GhostButton onClick={() => setModalState('cancel')} className="flex-1 text-red-400 hover:text-red-300">Cancel Booking</GhostButton>
            </div>
          </div>
        )}
      </EnterpriseDetailDrawer>

      <ConfirmationModal
        isOpen={modalState === 'update'}
        onClose={() => setModalState('none')}
        onConfirm={handleStatusUpdate}
        title="Update Booking Status"
        message="Mark this booking as Completed?"
        confirmText="Confirm"
      />
      
      <ConfirmationModal
        isOpen={modalState === 'cancel'}
        onClose={() => setModalState('none')}
        onConfirm={handleStatusUpdate}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking?"
        confirmText="Cancel Booking"
        isDestructive={true}
      />
    </div>
  );
}

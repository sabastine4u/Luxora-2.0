import { useEffect, useState } from 'react';
import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';
import type { Booking } from '../../../types';
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal';
import { useToast } from '../../../contexts/ToastContext';
import { homeServicesApi } from '../../../api/home-services.api';

export default function Bookings() {
  const { showToast } = useToast();

  const [bookings, setBookings] =
    useState<Booking[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [selectedBooking, setSelectedBooking] =
    useState<Booking | null>(null);

  const [modalState, setModalState] = useState<
    'none' | 'update' | 'cancel'
  >('none');

  const loadBookings = async () => {
    try {
      setIsLoading(true);

      const response =
        await homeServicesApi.getServiceBookings();

      setBookings(response.bookings || []);
    } catch (error) {
      console.error(
        'Failed to load service bookings:',
        error,
      );

      showToast({
        title: 'Error',
        description:
          'Failed to load service bookings.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleStatusUpdate = async (
    status: 'Completed' | 'Cancelled',
  ) => {
    if (!selectedBooking) return;

    try {
      const response =
        await homeServicesApi.updateServiceBookingStatus(
          selectedBooking.id,
          status,
        );

      const updatedBooking =
        response.booking;

      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          booking.id === updatedBooking.id
            ? updatedBooking
            : booking,
        ),
      );

      setSelectedBooking(updatedBooking);

      showToast({
        title: 'Success',
        description:
          status === 'Completed'
            ? 'Booking marked as completed successfully.'
            : 'Booking cancelled successfully.',
        type: 'success',
      });

      setModalState('none');
    } catch (error) {
      console.error(
        'Failed to update booking status:',
        error,
      );

      showToast({
        title: 'Error',
        description:
          'Failed to update booking status.',
        type: 'error',
      });
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <DataTableToolbar
          searchPlaceholder="Search bookings..."
          onFilter={() => {}}
        />
      </div>

      <div className="bg-navy-800/50 rounded-2xl border border-white/10 p-6">
        {isLoading ? (
          <div className="py-12 text-center text-sm text-ink/50">
            Loading bookings...
          </div>
        ) : (
          <DataTable
            columns={[
              {
                header: 'Customer',
                render: (b: Booking) =>
                  b.customerName,
              },
              {
                header: 'Provider',
                render: (b: Booking) =>
                  b.providerName,
              },
              {
                header: 'Category',
                render: (b: Booking) =>
                  b.category,
              },
              {
                header: 'Date',
                render: (b: Booking) =>
                  b.date,
              },
              {
                header: 'Time',
                render: (b: Booking) =>
                  b.time,
              },
              {
                header: 'Status',
                render: (b: Booking) => (
                  <EnterpriseStatusBadge
                    status={b.status}
                  />
                ),
              },
              {
                header: 'Actions',
                render: (b: Booking) => (
                  <GhostButton
                    size="sm"
                    onClick={() =>
                      setSelectedBooking(b)
                    }
                  >
                    View
                  </GhostButton>
                ),
              },
            ]}
            keyExtractor={(b: Booking) =>
              b.id
            }
            data={bookings}
          />
        )}
      </div>

      <EnterpriseDetailDrawer
        isOpen={!!selectedBooking}
        onClose={() =>
          setSelectedBooking(null)
        }
        title="Booking Details"
      >
        {selectedBooking && (
          <div className="space-y-6 text-cream">
            <div>
              <p className="text-sm text-ink/60">
                Booking ID
              </p>
              <p className="font-medium">
                {selectedBooking.id}
              </p>
            </div>

            <div>
              <p className="text-sm text-ink/60">
                Customer
              </p>
              <p className="font-medium">
                {selectedBooking.customerName}
              </p>
            </div>

            <div>
              <p className="text-sm text-ink/60">
                Provider
              </p>
              <p className="font-medium">
                {selectedBooking.providerName}
              </p>
            </div>

            <div>
              <p className="text-sm text-ink/60">
                Schedule
              </p>
              <p className="font-medium">
                {selectedBooking.date} at{' '}
                {selectedBooking.time}
              </p>
            </div>

            <div>
              <p className="text-sm text-ink/60">
                Amount
              </p>
              <p className="font-medium">
                ₦
                {selectedBooking.amount.toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-ink/60">
                Status
              </p>

              <EnterpriseStatusBadge
                status={selectedBooking.status}
              />
            </div>

            <div className="flex gap-3 pt-6 border-t border-white/10">
              <GoldButton
                onClick={() =>
                  setModalState('update')
                }
                className="flex-1"
                disabled={
                  selectedBooking.status ===
                    'Completed' ||
                  selectedBooking.status ===
                    'Cancelled'
                }
              >
                Mark Completed
              </GoldButton>

              <GhostButton
                onClick={() =>
                  setModalState('cancel')
                }
                className="flex-1 text-red-400 hover:text-red-300"
                disabled={
                  selectedBooking.status ===
                    'Completed' ||
                  selectedBooking.status ===
                    'Cancelled'
                }
              >
                Cancel Booking
              </GhostButton>
            </div>
          </div>
        )}
      </EnterpriseDetailDrawer>

      <ConfirmationModal
        isOpen={
          modalState === 'update'
        }
        onClose={() =>
          setModalState('none')
        }
        onConfirm={() =>
          handleStatusUpdate('Completed')
        }
        title="Update Booking Status"
        message="Mark this booking as Completed?"
        confirmText="Confirm"
      />

      <ConfirmationModal
        isOpen={
          modalState === 'cancel'
        }
        onClose={() =>
          setModalState('none')
        }
        onConfirm={() =>
          handleStatusUpdate('Cancelled')
        }
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking?"
        confirmText="Cancel Booking"
        isDestructive={true}
      />
    </div>
  );
}
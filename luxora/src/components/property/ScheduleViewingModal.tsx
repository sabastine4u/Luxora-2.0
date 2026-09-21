import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../../contexts/SessionContext';
import { propertyApi } from '../../api/property.api';
import { bookingApi } from '../../api/booking.api';
import { mapApiPropertyToProperty } from '../../api/property.mapper';
import type { Property } from '../../types';
import { Modal } from '../ui/Modal';
import { GoldButton, GhostButton } from '../ui/ui';
import {
  Calendar,
  Clock,
  CheckCircle2,
  MapPin,
} from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import { publishEvent } from '../../modules/enterprise/events/publishEvent';
import { ENTERPRISE_EVENTS } from '../../modules/enterprise/events/registry';

export function ScheduleViewingModal() {
  const navigate = useNavigate();

  const {
    scheduleViewingModalPropertyId,
    closeScheduleViewingModal,
    isAuthenticated,
  } = useSession();

  const [property, setProperty] = useState<Property | null>(null);
  const [isLoadingProperty, setIsLoadingProperty] = useState(false);
  const [propertyError, setPropertyError] = useState<string | null>(null);

  const [step, setStep] = useState<'form' | 'success'>('form');

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    requests: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [lastCreatedId, setLastCreatedId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  /*
   * Load the actual published property from the backend.
   *
   * This replaces the old luxoraData lookup so the viewing
   * request always uses the real MongoDB property.
   */
  useEffect(() => {
    if (!scheduleViewingModalPropertyId) {
      setProperty(null);
      return;
    }

    let isActive = true;

    const loadProperty = async () => {
      try {
        setIsLoadingProperty(true);
        setPropertyError(null);

        setStep('form');
        setErrors({});
        setLastCreatedId('');
        setFormData({
          date: '',
          time: '',
          requests: '',
        });

        const response = await propertyApi.getPropertyById(
          scheduleViewingModalPropertyId,
        );

        const backendProperty = response?.property;

        if (!backendProperty) {
          throw new Error('Property could not be found.');
        }

        const mappedProperty = mapApiPropertyToProperty(
          backendProperty,
        ) as Property;

        if (isActive) {
          setProperty(mappedProperty);
        }
      } catch (error) {
        if (isActive) {
          setPropertyError(
            error instanceof Error
              ? error.message
              : 'Unable to load property details.',
          );

          setProperty(null);
        }
      } finally {
        if (isActive) {
          setIsLoadingProperty(false);
        }
      }
    };

    loadProperty();

    return () => {
      isActive = false;
    };
  }, [scheduleViewingModalPropertyId]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) {
      newErrors.date = 'Preferred date is required';
    }

    if (!formData.time) {
      newErrors.time = 'Preferred time is required';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e?: FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!validate()) {
      return;
    }

    if (!isAuthenticated) {
      closeScheduleViewingModal();
      navigate(ROUTES.LOGIN);
      return;
    }

    if (!scheduleViewingModalPropertyId) {
      setErrors({
        submit: 'Property information is missing.',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors({});

      /*
       * Create the real viewing request in MongoDB.
       *
       * The authenticated Buyer comes from the Bearer token,
       * so we only send the booking fields required by the API.
       */
      const response = await bookingApi.createBooking({
        propertyId: scheduleViewingModalPropertyId,
        viewingDate: formData.date,
        viewingTime: formData.time,
        message: formData.requests.trim(),
      });

      const booking = response?.data?.booking;

      if (!booking?._id) {
        throw new Error(
          'The viewing request was not returned by the server.',
        );
      }

      setLastCreatedId(booking._id);

      /*
       * Publish the enterprise event only after the real
       * backend booking has been successfully created.
       */
      publishEvent(
        ENTERPRISE_EVENTS.BUYER_INSPECTION_REQUESTED,
        {
          propertyId: scheduleViewingModalPropertyId,
          buyerId: booking.buyer,
          viewingId: booking._id,
          timestamp: new Date().toISOString(),
        },
      );

      setStep('success');
    } catch (error) {
      setErrors({
        submit:
          error instanceof Error
            ? error.message
            : 'Unable to create the viewing request.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep('form');

    setFormData({
      date: '',
      time: '',
      requests: '',
    });

    setErrors({});
    setLastCreatedId('');
    setIsSubmitting(false);

    closeScheduleViewingModal();
  };

  const inputClass =
    'w-full rounded-xl border border-white/10 bg-navy-900/50 p-3 text-sm text-cream focus:border-gold-400/50 focus:outline-none transition-colors';

  if (!scheduleViewingModalPropertyId) {
    return null;
  }

  if (isLoadingProperty) {
    return (
      <Modal
        isOpen={true}
        onClose={handleClose}
        title="Schedule a Viewing"
        size="lg"
      >
        <div className="py-12 text-center">
          <p className="text-sm text-ink/60">
            Loading property details...
          </p>
        </div>
      </Modal>
    );
  }

  if (propertyError || !property) {
    return (
      <Modal
        isOpen={true}
        onClose={handleClose}
        title="Schedule a Viewing"
        size="lg"
      >
        <div className="py-12 text-center space-y-4">
          <p className="text-sm text-rose-400">
            {propertyError ||
              'Property details are unavailable.'}
          </p>

          <GhostButton onClick={handleClose}>
            Close
          </GhostButton>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={!!scheduleViewingModalPropertyId}
      onClose={handleClose}
      title={
        step === 'success'
          ? 'Booking Successful'
          : 'Schedule a Viewing'
      }
      size="lg"
      actionButton={
        step === 'form' ? (
          <GoldButton
            onClick={handleSubmit}
            size="sm"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Submitting...'
              : 'Confirm Booking'}
          </GoldButton>
        ) : null
      }
    >
      {step === 'form' && (
        <div className="space-y-6">
          {/* Property Summary */}
          <div className="flex gap-4 p-4 bg-navy-900/50 rounded-xl border border-white/5">
            <img
              src={property.image}
              alt={property.title}
              className="h-20 w-24 object-cover rounded-lg border border-white/10"
            />

            <div className="flex flex-col justify-center min-w-0">
              <h4 className="font-heading font-bold text-cream line-clamp-1">
                {property.title}
              </h4>

              <p className="text-xs text-ink/60 flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3" />
                {property.location}
              </p>

              <p className="text-sm font-bold text-gold-400 mt-2">
                {property.price}
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {errors.submit && (
              <p className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-400">
                {errors.submit}
              </p>
            )}

            {/* Date + Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ink/70">
                  Preferred Date *
                </label>

                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />

                  <input
                    type="date"
                    className={`${inputClass} pl-10 ${
                      errors.date
                        ? 'border-rose-500'
                        : ''
                    }`}
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        date: e.target.value,
                      })
                    }
                  />
                </div>

                {errors.date && (
                  <p className="text-[10px] text-rose-500">
                    {errors.date}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ink/70">
                  Preferred Time *
                </label>

                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />

                  <input
                    type="time"
                    className={`${inputClass} pl-10 ${
                      errors.time
                        ? 'border-rose-500'
                        : ''
                    }`}
                    value={formData.time}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        time: e.target.value,
                      })
                    }
                  />
                </div>

                {errors.time && (
                  <p className="text-[10px] text-rose-500">
                    {errors.time}
                  </p>
                )}
              </div>
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink/70">
                Message (Optional)
              </label>

              <textarea
                placeholder="Any specific requirements for your visit?"
                className={`${inputClass} resize-none h-24`}
                value={formData.requests}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    requests: e.target.value,
                  })
                }
              />
            </div>

            <div className="rounded-xl border border-white/5 bg-navy-900/30 px-4 py-3">
              <p className="text-xs text-ink/50">
                Your viewing request will be sent to the
                assigned agent for confirmation.
              </p>
            </div>
          </form>
        </div>
      )}

      {step === 'success' && (
        <div className="space-y-6 text-center py-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 mb-2">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <h4 className="font-heading text-2xl font-bold text-cream">
            Request Sent!
          </h4>

          <p className="text-sm text-ink/70 max-w-sm mx-auto">
            Your viewing request for{' '}
            <strong className="text-cream">
              {property.title}
            </strong>{' '}
            has been received. The assigned agent will
            confirm the schedule shortly.
          </p>

          <div className="bg-navy-900/50 rounded-xl p-4 border border-white/5 text-left max-w-sm mx-auto space-y-3 mt-6">
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-xs text-ink/50">
                Viewing ID
              </span>

              <span className="text-xs font-bold text-gold-400">
                {lastCreatedId}
              </span>
            </div>

            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-xs text-ink/50">
                Scheduled
              </span>

              <span className="text-xs font-medium text-cream">
                {formData.date} at {formData.time}
              </span>
            </div>

            <div className="flex justify-between items-center pt-1">
              <span className="text-xs text-ink/50">
                Agent
              </span>

              <div className="flex items-center gap-2">
                {property.agent.avatar ? (
                  <img
                    src={property.agent.avatar}
                    alt={property.agent.name}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-6 w-6 rounded-full bg-gold-400/20 flex items-center justify-center">
                    <span className="text-[9px] font-bold text-gold-400">
                      {property.agent.name
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  </div>
                )}

                <span className="text-xs font-medium text-cream">
                  {property.agent.name}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-1">
              <span className="text-xs text-ink/50">
                Status
              </span>

              <span className="text-xs font-semibold text-amber-400">
                Pending
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <GhostButton onClick={handleClose}>
              Continue Browsing
            </GhostButton>

            <GoldButton
              onClick={() => {
                handleClose();
                navigate(ROUTES.BUYER_DASHBOARD);
              }}
            >
              View My Requests
            </GoldButton>
          </div>
        </div>
      )}
    </Modal>
  );
}
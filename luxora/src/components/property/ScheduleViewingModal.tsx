import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../../contexts/SessionContext';
import { properties } from '../../data/luxoraData';
import { Modal } from '../ui/Modal';
import { GoldButton, GhostButton } from '../ui/ui';
import { Calendar, Clock, Users, Phone, Mail, MessageCircle, CheckCircle2, MapPin } from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import { publishEvent } from '../../modules/enterprise/events/publishEvent';
import { ENTERPRISE_EVENTS } from '../../modules/enterprise/events/registry';

export function ScheduleViewingModal() {
  const navigate = useNavigate();
  const { scheduleViewingModalPropertyId, closeScheduleViewingModal, addViewingRequest, isAuthenticated } = useSession();
  
  const property = properties.find(p => p.id === scheduleViewingModalPropertyId);
  
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    guests: '1',
    phone: '',
    email: '',
    requests: '',
    contactMethod: 'email'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [lastCreatedId, setLastCreatedId] = useState<string>('');

  if (!scheduleViewingModalPropertyId || !property) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.date) newErrors.date = 'Preferred date is required';
    if (!formData.time) newErrors.time = 'Preferred time is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.email) newErrors.email = 'Email address is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email address';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validate()) return;

    if (!isAuthenticated) {
      closeScheduleViewingModal();
      navigate(ROUTES.LOGIN);
      return;
    }

    const viewingId = `VR-${Math.floor(1000 + Math.random() * 9000)}`;
    setLastCreatedId(viewingId);
    
    // 1. Simulate Backend Action
    console.log('[Backend Simulation] Booking property inspection...');
    
    setTimeout(() => {
      // 2. Original Frontend State Update
      addViewingRequest({
        id: viewingId,
        propertyId: property.id,
        propertyName: property.title,
        date: formData.date,
        time: formData.time,
        status: 'Pending',
        agent: property.agent,
        createdAt: new Date().toISOString()
      });

      // 3. Publish Enterprise Event on success
      publishEvent(ENTERPRISE_EVENTS.BUYER_INSPECTION_REQUESTED, {
        propertyId: property.id,
        buyerId: 'current-user-buyer',
        viewingId: viewingId,
        timestamp: new Date().toISOString()
      });

      setStep('success');
    }, 500);
  };

  const handleClose = () => {
    setStep('form');
    setFormData({ date: '', time: '', guests: '1', phone: '', email: '', requests: '', contactMethod: 'email' });
    setErrors({});
    closeScheduleViewingModal();
  };

  const inputClass = "w-full rounded-xl border border-white/10 bg-navy-900/50 p-3 text-sm text-cream focus:border-gold-400/50 focus:outline-none transition-colors";

  return (
    <Modal
      isOpen={!!scheduleViewingModalPropertyId}
      onClose={handleClose}
      title={step === 'success' ? 'Booking Successful' : 'Schedule a Viewing'}
      size="lg"
      actionButton={
        step === 'form' ? (
          <GoldButton onClick={handleSubmit} size="sm">Confirm Booking</GoldButton>
        ) : null
      }
    >
      {step === 'form' && (
        <div className="space-y-6">
          {/* Property Summary */}
          <div className="flex gap-4 p-4 bg-navy-900/50 rounded-xl border border-white/5">
            <img src={property.image} alt={property.title} className="h-20 w-24 object-cover rounded-lg border border-white/10" />
            <div className="flex flex-col justify-center">
              <h4 className="font-heading font-bold text-cream line-clamp-1">{property.title}</h4>
              <p className="text-xs text-ink/60 flex items-center gap-1 mt-1"><MapPin className="h-3 w-3"/> {property.location}</p>
              <p className="text-sm font-bold text-gold-400 mt-2">{property.price}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ink/70">Preferred Date *</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
                  <input type="date" className={`${inputClass} pl-10 ${errors.date ? 'border-rose-500' : ''}`} value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
                {errors.date && <p className="text-[10px] text-rose-500">{errors.date}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ink/70">Preferred Time *</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
                  <input type="time" className={`${inputClass} pl-10 ${errors.time ? 'border-rose-500' : ''}`} value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
                </div>
                {errors.time && <p className="text-[10px] text-rose-500">{errors.time}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ink/70">Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
                  <input type="tel" placeholder="+234..." className={`${inputClass} pl-10 ${errors.phone ? 'border-rose-500' : ''}`} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                {errors.phone && <p className="text-[10px] text-rose-500">{errors.phone}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ink/70">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
                  <input type="email" placeholder="you@example.com" className={`${inputClass} pl-10 ${errors.email ? 'border-rose-500' : ''}`} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                {errors.email && <p className="text-[10px] text-rose-500">{errors.email}</p>}
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink/70">Number of Guests</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
                <input type="number" min="1" max="10" className={`${inputClass} pl-10`} value={formData.guests} onChange={e => setFormData({...formData, guests: e.target.value})} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink/70">Special Requests (Optional)</label>
              <textarea placeholder="Any specific requirements for your visit?" className={`${inputClass} resize-none h-20`} value={formData.requests} onChange={e => setFormData({...formData, requests: e.target.value})} />
            </div>

            <div className="space-y-2 pt-2 border-t border-white/5">
              <label className="text-xs font-semibold text-ink/70">Preferred Contact Method</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="contact" checked={formData.contactMethod === 'phone'} onChange={() => setFormData({...formData, contactMethod: 'phone'})} className="accent-gold-400" />
                  <span className="text-sm text-cream flex items-center gap-1.5"><Phone className="h-3 w-3"/> Phone</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="contact" checked={formData.contactMethod === 'email'} onChange={() => setFormData({...formData, contactMethod: 'email'})} className="accent-gold-400" />
                  <span className="text-sm text-cream flex items-center gap-1.5"><Mail className="h-3 w-3"/> Email</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="contact" checked={formData.contactMethod === 'whatsapp'} onChange={() => setFormData({...formData, contactMethod: 'whatsapp'})} className="accent-gold-400" />
                  <span className="text-sm text-cream flex items-center gap-1.5"><MessageCircle className="h-3 w-3"/> WhatsApp</span>
                </label>
              </div>
            </div>
          </form>
        </div>
      )}

      {step === 'success' && (
        <div className="space-y-6 text-center py-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 mb-2">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h4 className="font-heading text-2xl font-bold text-cream">Request Sent!</h4>
          <p className="text-sm text-ink/70 max-w-sm mx-auto">
            Your viewing request for <strong className="text-cream">{property.title}</strong> has been received. The assigned agent will confirm the schedule shortly.
          </p>

          <div className="bg-navy-900/50 rounded-xl p-4 border border-white/5 text-left max-w-sm mx-auto space-y-3 mt-6">
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-xs text-ink/50">Viewing ID</span>
              <span className="text-xs font-bold text-gold-400">{lastCreatedId}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-xs text-ink/50">Scheduled</span>
              <span className="text-xs font-medium text-cream">{formData.date} at {formData.time}</span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-xs text-ink/50">Agent</span>
              <div className="flex items-center gap-2">
                <img src={property.agent.avatar} alt={property.agent.name} className="h-6 w-6 rounded-full object-cover" />
                <span className="text-xs font-medium text-cream">{property.agent.name}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <GhostButton onClick={handleClose}>Continue Browsing</GhostButton>
            <GoldButton onClick={() => {
              handleClose();
              navigate(ROUTES.BUYER_DASHBOARD);
            }}>View My Requests</GoldButton>
          </div>
        </div>
      )}
    </Modal>
  );
}

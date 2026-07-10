import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../../contexts/SessionContext';
import { properties } from '../../data/luxoraData';
import { Modal } from '../ui/Modal';
import { GoldButton, GhostButton } from '../ui/ui';
import { AlertTriangle, Upload, FileText, X, CheckCircle2, MapPin } from 'lucide-react';
import { ROUTES } from '../../constants/routes';

const REPORT_REASONS = [
  'Fake Listing',
  'Incorrect Information',
  'Spam',
  'Duplicate Listing',
  'Fraudulent Activity',
  'Offensive Content',
  'Already Sold/Rented',
  'Other'
];

export function ReportListingModal() {
  const navigate = useNavigate();
  const { reportListingModalPropertyId, closeReportListingModal, addReportListing, isAuthenticated } = useSession();
  
  const property = properties.find(p => p.id === reportListingModalPropertyId);
  
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [formData, setFormData] = useState({
    reason: '',
    description: '',
  });
  const [attachments, setAttachments] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [lastCreatedId, setLastCreatedId] = useState<string>('');

  if (!reportListingModalPropertyId || !property) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...newFiles].slice(0, 3));
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.reason) newErrors.reason = 'Please select a reason';
    if (!formData.description) newErrors.description = 'Please describe the issue';
    else if (formData.description.length > 500) newErrors.description = 'Description cannot exceed 500 characters';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validate()) return;

    if (!isAuthenticated) {
      closeReportListingModal();
      navigate(ROUTES.LOGIN);
      return;
    }

    const reportId = `REP-${Math.floor(10000 + Math.random() * 90000)}`;
    setLastCreatedId(reportId);
    
    addReportListing({
      id: reportId,
      propertyId: property.id,
      propertyName: property.title,
      reason: formData.reason,
      description: formData.description,
      attachments: attachments.map(f => f.name),
      status: 'Submitted',
      submittedAt: new Date().toISOString()
    });

    setStep('success');
  };

  const handleClose = () => {
    setStep('form');
    setFormData({ reason: '', description: '' });
    setAttachments([]);
    setErrors({});
    closeReportListingModal();
  };

  return (
    <Modal
      isOpen={!!reportListingModalPropertyId}
      onClose={handleClose}
      title={step === 'success' ? 'Report Submitted' : 'Report Listing'}
      size="lg"
      actionButton={
        step === 'form' ? (
          <GoldButton onClick={handleSubmit} size="sm" className="bg-rose-500 hover:bg-rose-600 text-white shadow-none">Submit Report</GoldButton>
        ) : null
      }
    >
      {step === 'form' && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 bg-rose-500/10 text-rose-400 p-4 rounded-xl border border-rose-500/20 text-sm">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <p>Your report will be reviewed by our trust and safety team. False reports may result in account suspension.</p>
          </div>

          {/* Property Summary */}
          <div className="flex gap-4 p-4 bg-navy-900/50 rounded-xl border border-white/5">
            <img src={property.image} alt={property.title} className="h-16 w-20 object-cover rounded-lg border border-white/10" />
            <div className="flex flex-col justify-center">
              <h4 className="font-heading font-bold text-cream line-clamp-1">{property.title}</h4>
              <p className="text-xs text-ink/60 flex items-center gap-1 mt-1"><MapPin className="h-3 w-3"/> {property.location}</p>
              <p className="text-xs text-ink/40 mt-1">Listed by: {property.agent.name}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-cream">Reason for reporting *</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {REPORT_REASONS.map(reason => (
                  <label key={reason} className="flex items-center gap-2 cursor-pointer p-3 rounded-xl border border-white/5 bg-navy-900/30 hover:bg-navy-900/80 transition-colors">
                    <input 
                      type="radio" 
                      name="reason" 
                      value={reason}
                      checked={formData.reason === reason} 
                      onChange={(e) => setFormData({...formData, reason: e.target.value})} 
                      className="accent-rose-500 h-4 w-4" 
                    />
                    <span className="text-sm text-ink/80">{reason}</span>
                  </label>
                ))}
              </div>
              {errors.reason && <p className="text-[10px] text-rose-500">{errors.reason}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <label className="text-sm font-semibold text-cream">Description *</label>
                <span className={`text-xs ${formData.description.length > 500 ? 'text-rose-500' : 'text-ink/50'}`}>
                  {formData.description.length} / 500
                </span>
              </div>
              <textarea 
                placeholder="Please provide specific details about the issue..." 
                className={`w-full rounded-xl border bg-navy-900/50 p-3 text-sm text-cream focus:outline-none transition-colors resize-none h-32 ${errors.description ? 'border-rose-500 focus:border-rose-500' : 'border-white/10 focus:border-rose-500/50'}`}
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
              />
              {errors.description && <p className="text-[10px] text-rose-500">{errors.description}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-cream">Attachments (Optional)</label>
              <p className="text-xs text-ink/50 mb-2">Upload images or PDFs as proof (Max 3 files).</p>
              
              <div className="flex flex-wrap gap-3">
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 bg-navy-900 rounded-lg p-2 pr-3 border border-white/10 text-xs text-cream max-w-[200px]">
                    <FileText className="h-4 w-4 text-ink/50 shrink-0" />
                    <span className="truncate flex-1">{file.name}</span>
                    <button type="button" onClick={() => removeAttachment(index)} className="text-ink/50 hover:text-rose-400 shrink-0">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                
                {attachments.length < 3 && (
                  <label className="flex items-center justify-center gap-2 cursor-pointer p-3 rounded-xl border border-dashed border-white/20 bg-navy-900/30 hover:bg-navy-900/80 transition-colors text-xs text-ink/70">
                    <Upload className="h-4 w-4" /> Upload File
                    <input type="file" className="hidden" accept="image/*,.pdf" multiple onChange={handleFileChange} />
                  </label>
                )}
              </div>
            </div>
          </form>
        </div>
      )}

      {step === 'success' && (
        <div className="space-y-6 text-center py-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 mb-2">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h4 className="font-heading text-2xl font-bold text-cream">Report Submitted Successfully</h4>
          <p className="text-sm text-ink/70 max-w-sm mx-auto">
            Thank you for helping us keep Luxora safe. Our trust and safety team will review your report.
          </p>

          <div className="bg-navy-900/50 rounded-xl p-4 border border-white/5 text-left max-w-sm mx-auto space-y-3 mt-6">
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-xs text-ink/50">Reference Number</span>
              <span className="text-xs font-bold text-gold-400">{lastCreatedId}</span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-xs text-ink/50">Expected Review Time</span>
              <span className="text-xs font-medium text-cream">24 - 48 Hours</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <GhostButton onClick={handleClose}>Return to Property</GhostButton>
            <GoldButton onClick={() => {
              handleClose();
              navigate(ROUTES.PROPERTIES);
            }}>Browse More Properties</GoldButton>
          </div>
        </div>
      )}
    </Modal>
  );
}

import { useState } from 'react';
import { Upload, CheckCircle2 } from 'lucide-react';
import { Modal } from '../../../../components/ui/Modal';
import { GoldButton, GhostButton } from '../../../../components/ui/ui';

interface PropertySubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: unknown) => void;
}

export default function PropertySubmissionModal({ isOpen, onClose, onSubmit }: PropertySubmissionModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Apartment',
    location: '',
    description: '',
    documents: [] as File[]
  });

  const handleNext = () => setStep(s => Math.min(s + 1, 3));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));
  
  const handleSubmit = () => {
    onSubmit?.(formData);
    // Reset state after submission
    setTimeout(() => {
      setStep(1);
      setFormData({ name: '', type: 'Apartment', location: '', description: '', documents: [] });
    }, 500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Submit New Property">
      <div className="space-y-6">
        
        {/* Stepper */}
        <div className="flex items-center justify-between px-8 mb-8 relative">
          <div className="absolute left-12 right-12 top-1/2 h-0.5 bg-navy-800 -z-10" />
          <div className="absolute left-12 right-12 top-1/2 h-0.5 bg-gold-400 transition-all duration-300 -z-10" style={{ width: `${((step - 1) / 2) * 100}%` }} />
          
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
              step >= s ? 'bg-gold-400 border-gold-400 text-navy-900' : 'bg-navy-900 border-navy-700 text-ink/50'
            }`}>
              {s}
            </div>
          ))}
        </div>

        {/* Step 1: Property Details */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <div>
              <label className="block text-sm font-medium text-ink/70 mb-2">Property Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-navy-800 border border-white/10 rounded-xl px-4 py-3 text-cream focus:outline-none focus:border-gold-400"
                placeholder="e.g. The Sapphire Residences"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">Property Type</label>
                <select 
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-navy-800 border border-white/10 rounded-xl px-4 py-3 text-cream focus:outline-none focus:border-gold-400"
                >
                  <option>Apartment</option>
                  <option>Villa</option>
                  <option>Penthouse</option>
                  <option>Commercial</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">Location</label>
                <input 
                  type="text" 
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-navy-800 border border-white/10 rounded-xl px-4 py-3 text-cream focus:outline-none focus:border-gold-400"
                  placeholder="e.g. Ikoyi, Lagos"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink/70 mb-2">Description</label>
              <textarea 
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                rows={3} 
                className="w-full bg-navy-800 border border-white/10 rounded-xl px-4 py-3 text-cream focus:outline-none focus:border-gold-400 resize-none" 
                placeholder="Brief description of the property..."
              />
            </div>
          </div>
        )}

        {/* Step 2: Documents */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <div className="rounded-xl border border-dashed border-white/20 bg-navy-900/50 p-8 text-center flex flex-col items-center justify-center">
              <Upload className="h-8 w-8 text-ink/40 mb-3" />
              <div className="text-sm font-medium text-cream mb-1">Upload Required Documents</div>
              <div className="text-xs text-ink/50 mb-4">Please upload Title Deed, Survey Plan, and Tax Clearance.</div>
              <GoldButton size="sm" onClick={() => {
                // Simulate document upload
                setFormData(prev => ({
                  ...prev,
                  documents: [...prev.documents, new File([], 'document.pdf')]
                }));
              }}>
                Browse Files
              </GoldButton>
            </div>
            
            {formData.documents.length > 0 && (
              <div className="space-y-2">
                {formData.documents.map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-navy-800 border border-white/5">
                    <span className="text-sm text-cream">Uploaded_Document_{i + 1}.pdf</span>
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <div className="p-4 rounded-xl bg-navy-800 border border-white/5 space-y-3">
              <div>
                <div className="text-xs text-ink/50 uppercase tracking-wider mb-1">Property Name</div>
                <div className="font-semibold text-cream">{formData.name || 'Not provided'}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-ink/50 uppercase tracking-wider mb-1">Type</div>
                  <div className="font-semibold text-cream">{formData.type}</div>
                </div>
                <div>
                  <div className="text-xs text-ink/50 uppercase tracking-wider mb-1">Location</div>
                  <div className="font-semibold text-cream">{formData.location || 'Not provided'}</div>
                </div>
              </div>
              <div>
                <div className="text-xs text-ink/50 uppercase tracking-wider mb-1">Documents</div>
                <div className="font-semibold text-cream">{formData.documents.length} files attached</div>
              </div>
            </div>
            <p className="text-xs text-ink/50 text-center">
              By submitting, you confirm that all information provided is accurate and you authorize Luxora to begin the verification process.
            </p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex justify-between pt-4 border-t border-white/5">
          <GhostButton onClick={step === 1 ? onClose : handleBack}>
            {step === 1 ? 'Cancel' : 'Back'}
          </GhostButton>
          <GoldButton 
            onClick={step === 3 ? handleSubmit : handleNext}
            disabled={step === 1 && (!formData.name || !formData.location)}
          >
            {step === 3 ? 'Submit Property' : 'Continue'}
          </GoldButton>
        </div>
        
      </div>
    </Modal>
  );
}

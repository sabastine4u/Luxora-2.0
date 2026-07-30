import { useState } from 'react';
import { Modal } from '../../../../components/ui/Modal';
import { GhostButton, GoldButton } from '../../../../components/ui/ui';
import { User, Briefcase, Map, Star, ShieldCheck, FileText, CheckCircle2, DollarSign, Building2, Upload } from 'lucide-react';
import { useToast } from '../../../../contexts/ToastContext';

interface AgentOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AgentOnboardingModal({ isOpen, onClose }: AgentOnboardingModalProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  
  const steps = [
    { id: 1, title: 'Personal Details', icon: User },
    { id: 2, title: 'Employment', icon: Briefcase },
    { id: 3, title: 'Assignment', icon: Building2 },
    { id: 4, title: 'Coverage', icon: Map },
    { id: 5, title: 'Specialties', icon: Star },
    { id: 6, title: 'Commission', icon: DollarSign },
    { id: 7, title: 'Documents', icon: FileText },
    { id: 8, title: 'Review & Activate', icon: CheckCircle2 }
  ];

  const handleNext = () => setStep(s => Math.min(8, s + 1));
  const handlePrev = () => setStep(s => Math.max(1, s - 1));

  const handleActivate = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showToast({ type: 'success', title: 'Agent Onboarding Complete', description: 'Agent account created. Pending verification.' });
      onClose();
      setStep(1);
    }, 1500);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Agent Onboarding" 
      size="3xl"
      actionButton={
        <div className="flex gap-3">
          {step > 1 && <GhostButton onClick={handlePrev}>Back</GhostButton>}
          {step < 8 ? (
            <GoldButton onClick={handleNext}>Next Step</GoldButton>
          ) : (
            <GoldButton onClick={handleActivate} disabled={isSubmitting}>
              {isSubmitting ? 'Activating...' : 'Submit & Activate'}
            </GoldButton>
          )}
        </div>
      }
    >
      <div className="flex gap-6 min-h-[500px]">
        {/* Sidebar Steps */}
        <div className="w-48 shrink-0 border-r border-white/10 pr-4 space-y-2">
          {steps.map((s) => (
            <div 
              key={s.id} 
              className={`flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors ${
                step === s.id ? 'bg-gold-400/10 text-gold-400 border border-gold-400/20' : 
                step > s.id ? 'text-emerald-400' : 'text-ink/50'
              }`}
            >
              {step > s.id ? <CheckCircle2 className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
              {s.title}
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 py-4">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h3 className="text-lg font-bold text-cream mb-4">Personal Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-ink/70">First Name</label>
                  <input type="text" className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-sm text-cream" placeholder="Enter first name" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-ink/70">Last Name</label>
                  <input type="text" className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-sm text-cream" placeholder="Enter last name" />
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-xs font-medium text-ink/70">Email Address</label>
                  <input type="email" className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-sm text-cream" placeholder="agent@meridian.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-ink/70">Phone Number</label>
                  <input type="tel" className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-sm text-cream" placeholder="+234..." />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-ink/70">Date of Birth</label>
                  <input type="date" className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-sm text-cream" />
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-xs font-medium text-ink/70">Residential Address</label>
                  <textarea className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-sm text-cream h-20" placeholder="Full address" />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h3 className="text-lg font-bold text-cream mb-4">Employment Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-ink/70">Employment Type</label>
                  <select className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-sm text-cream">
                    <option>Full-Time Broker</option>
                    <option>Independent Contractor</option>
                    <option>Part-Time Agent</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-ink/70">Years of Experience</label>
                  <input type="number" className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-sm text-cream" placeholder="e.g. 5" />
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-xs font-medium text-ink/70">Professional License Number</label>
                  <input type="text" className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-sm text-cream" placeholder="REB-XXXX-XXX" />
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-xs font-medium text-ink/70">Background Check Status</label>
                  <select className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-sm text-cream">
                    <option>Pending</option>
                    <option>Initiated</option>
                    <option>Cleared</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h3 className="text-lg font-bold text-cream mb-4">Agency Assignment</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <label className="text-xs font-medium text-ink/70">Assign Branch</label>
                  <select className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-sm text-cream">
                    <option>Victoria Island HQ</option>
                    <option>Lekki Branch</option>
                    <option>Abuja Regional Office</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-ink/70">Assign Department</label>
                  <select className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-sm text-cream">
                    <option>Residential Sales</option>
                    <option>Commercial Sales</option>
                    <option>Luxury & Estates</option>
                    <option>Property Management</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-ink/70">Assign Level</label>
                  <select className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-sm text-cream">
                    <option>Junior Broker</option>
                    <option>Broker</option>
                    <option>Senior Broker</option>
                    <option>Partner</option>
                  </select>
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-xs font-medium text-ink/70">Reporting Manager</label>
                  <select className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-sm text-cream">
                    <option>Marcus Sterling (MD)</option>
                    <option>Sarah James (Team Lead)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h3 className="text-lg font-bold text-cream mb-4">Coverage Areas</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-ink/70">Primary Service States</label>
                  <input type="text" className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-sm text-cream" placeholder="e.g. Lagos, Abuja" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-ink/70">Target Neighborhoods</label>
                  <input type="text" className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-sm text-cream" placeholder="e.g. Ikoyi, Victoria Island" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-ink/70">Coverage Radius</label>
                  <select className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-sm text-cream">
                    <option>10km Radius</option>
                    <option>25km Radius</option>
                    <option>50km Radius</option>
                    <option>State-wide</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h3 className="text-lg font-bold text-cream mb-4">Specializations</h3>
              <div className="space-y-4">
                <p className="text-sm text-ink/60 mb-2">Select the property types this agent is authorized to handle.</p>
                <div className="grid grid-cols-2 gap-3">
                  {['Luxury Villas', 'Penthouses', 'Commercial Offices', 'Retail Spaces', 'Off-Plan Projects', 'Land & Plots', 'Short Lets', 'Waterfront Properties'].map((spec, i) => (
                    <label key={i} className="flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-navy-900/50 cursor-pointer hover:bg-navy-900 transition-colors">
                      <input type="checkbox" className="rounded border-white/20 text-gold-400 bg-transparent" />
                      <span className="text-sm text-cream">{spec}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h3 className="text-lg font-bold text-cream mb-4">Commission Structure</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-ink/70">Commission Model</label>
                  <select className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-sm text-cream">
                    <option>Standard Split (60/40)</option>
                    <option>Senior Split (70/30)</option>
                    <option>Partner Split (80/20)</option>
                    <option>Salary + Bonus</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-ink/70">Agent Share (%)</label>
                    <input type="number" defaultValue={60} className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-sm text-cream" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-ink/70">Agency Share (%)</label>
                    <input type="number" defaultValue={40} className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-sm text-cream" disabled />
                  </div>
                </div>
                <div className="space-y-2 pt-4">
                  <label className="text-xs font-medium text-ink/70">Sign-on Bonus / Advance (Optional)</label>
                  <input type="text" className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-sm text-cream" placeholder="₦0.00" />
                </div>
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h3 className="text-lg font-bold text-cream mb-4">Verification Documents</h3>
              <p className="text-sm text-ink/60 mb-4">Upload required documents to complete verification. (Can be uploaded later by agent).</p>
              
              <div className="space-y-3">
                {[
                  { name: 'Government ID', req: true },
                  { name: 'Passport Photograph', req: true },
                  { name: 'Professional License', req: true },
                  { name: 'Employment Contract', req: true },
                  { name: 'Proof of Address', req: false },
                ].map((doc, i) => (
                  <div key={i} className="flex justify-between items-center p-3 rounded-lg border border-white/10 bg-navy-900">
                    <div>
                      <div className="text-sm font-medium text-cream">{doc.name} {doc.req && <span className="text-rose-400">*</span>}</div>
                      <div className="text-xs text-yellow-400">Pending Upload</div>
                    </div>
                    <GhostButton size="sm" className="h-8 text-xs flex items-center gap-2"><Upload className="h-3 w-3"/> Upload</GhostButton>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 8 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="text-center py-6 border-b border-white/10 mb-6">
                <ShieldCheck className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-cream">Ready to Activate</h3>
                <p className="text-sm text-ink/60 mt-2">Please review the details before creating this agent profile.</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-ink/60 block text-xs">Role</span><span className="font-bold text-cream">Senior Broker</span></div>
                <div><span className="text-ink/60 block text-xs">Department</span><span className="font-bold text-cream">Residential</span></div>
                <div><span className="text-ink/60 block text-xs">Branch</span><span className="font-bold text-cream">Victoria Island HQ</span></div>
                <div><span className="text-ink/60 block text-xs">Commission</span><span className="font-bold text-cream">60/40 Split</span></div>
              </div>

              <div className="bg-yellow-400/10 border border-yellow-400/20 p-4 rounded-xl mt-6">
                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-yellow-400 shrink-0" />
                  <p className="text-sm text-yellow-100">
                    <strong>Note:</strong> The Agent account remains in "Pending Verification" until all required documents are approved by the Agency.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </Modal>
  );
}

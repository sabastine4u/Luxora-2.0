import { useState } from 'react';
import { Modal } from '../../../../components/ui/Modal';
import { GoldButton, GhostButton } from '../../../../components/ui/ui';
import { Mail, User, Building, Briefcase, Hash, Phone, Key, ShieldCheck } from 'lucide-react';
import { 
  regions, 
  businessUnits, 
  departments, 
  agencyCategories, 
  internalRoles,
  administrators
} from '../../../../data/superAdminData';
import type { EnterpriseProvisioningPayload, ProvisioningEntityType } from '../../../../types/admin';

export interface ProvisionUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Kept for backward compatibility but overridden by enterprise mode
  allowedRoles?: string[];
  defaultRole?: string;
  onProvision?: (payload: EnterpriseProvisioningPayload) => void;
  mode?: 'super-admin' | 'admin' | 'agency';
  fixedType?: ProvisioningEntityType;
}

export function ProvisionUserModal({ isOpen, onClose, onProvision, mode, fixedType }: ProvisionUserModalProps) {
  const [selectedType, setSelectedType] = useState<ProvisioningEntityType>('administrator');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const provisionType = mode === 'admin' ? (fixedType || 'agency') : selectedType;

  const getIcon = () => {
    if (provisionType === 'agency') return <Building className="h-5 w-5 text-gold-400" />;
    if (provisionType === 'administrator') return <ShieldCheck className="h-5 w-5 text-gold-400" />;
    return <Briefcase className="h-5 w-5 text-gold-400" />;
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      
      if (onProvision) {
        onProvision({
          type: provisionType,
          payload: formData as unknown
        } as EnterpriseProvisioningPayload);
      }
      
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({});
        setSelectedType('administrator');
        onClose();
      }, 1500);
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title="Enterprise Provisioning">
      <div className="p-6 sm:p-8 overflow-y-auto max-h-[85vh] no-scrollbar">
        
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-300">
            <div className="h-16 w-16 rounded-full bg-emerald-400/20 flex items-center justify-center text-emerald-400 mb-6">
              <CheckIcon className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold text-cream mb-2">Entity Provisioned</h3>
            <p className="text-ink/60">
              The <span className="font-semibold text-cream capitalize">{provisionType.replace('_', ' ')}</span> account has been successfully generated.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-400/10 border border-gold-400/20">
                  {getIcon()}
                </div>
                <h2 className="text-2xl font-bold text-cream">Enterprise Provisioning</h2>
              </div>
              <p className="text-sm text-ink/60">Provision a new enterprise entity into the Luxora network. The recipient will receive secure setup instructions.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {(!mode || mode === 'super-admin') && (
                <div className="space-y-1 group border-b border-white/10 pb-6">
                  <label className="text-sm font-bold text-cream block mb-3">What would you like to provision?</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['administrator', 'agency', 'internal_staff'] as const).map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => { setSelectedType(type); setFormData({}); }}
                        className={`py-3 px-2 rounded-xl text-xs font-semibold capitalize border transition-all ${
                          provisionType === type 
                            ? 'bg-gold-400/10 border-gold-400 text-gold-400 shadow-[0_0_15px_rgba(250,204,21,0.1)]' 
                            : 'bg-navy-900/50 border-white/10 text-ink/60 hover:bg-white/5 hover:text-cream'
                        }`}
                      >
                        {type.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="space-y-4 pt-2">
                
                {/* Administrator Fields */}
                {provisionType === 'administrator' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <InputField icon={<User />} label="Full Name" value={formData.fullName} onChange={(v) => handleChange('fullName', v)} />
                      <InputField icon={<Mail />} type="email" label="Email Address" value={formData.email} onChange={(v) => handleChange('email', v)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <InputField icon={<Phone />} label="Phone Number" value={formData.phone} onChange={(v) => handleChange('phone', v)} />
                      <SelectField label="Region" value={formData.region} options={regions} onChange={(v) => handleChange('region', v)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <SelectField label="Business Unit" value={formData.businessUnit} options={businessUnits} onChange={(v) => handleChange('businessUnit', v)} />
                      <SelectField label="Department" value={formData.department} options={departments} onChange={(v) => handleChange('department', v)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <SelectField label="Role" value={formData.role} options={['Super Admin', 'Compliance Admin', 'Support Lead', 'Finance Director']} onChange={(v) => handleChange('role', v)} />
                      <InputField icon={<Key />} type="password" label="Temporary Password" value={formData.tempPassword} onChange={(v) => handleChange('tempPassword', v)} />
                    </div>
                  </>
                )}

                {/* Agency Fields */}
                {provisionType === 'agency' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <InputField icon={<Building />} label="Agency Name" value={formData.agencyName} onChange={(v) => handleChange('agencyName', v)} />
                      <InputField icon={<Hash />} label="Registration Number" value={formData.registrationNumber} onChange={(v) => handleChange('registrationNumber', v)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <SelectField label="Agency Category" value={formData.agencyCategory} options={agencyCategories} onChange={(v) => handleChange('agencyCategory', v)} />
                      <InputField icon={<User />} label="Contact Person" value={formData.contactPerson} onChange={(v) => handleChange('contactPerson', v)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <InputField icon={<Mail />} type="email" label="Email Address" value={formData.email} onChange={(v) => handleChange('email', v)} />
                      <InputField icon={<Phone />} label="Phone Number" value={formData.phone} onChange={(v) => handleChange('phone', v)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <SelectField label="Primary Region" value={formData.primaryRegion} options={regions} onChange={(v) => handleChange('primaryRegion', v)} />
                      <SelectField label="Assigned Administrator" value={formData.assignedAdministrator} options={administrators.map(a => a.name)} onChange={(v) => handleChange('assignedAdministrator', v)} />
                    </div>
                  </>
                )}

                {/* Internal Staff Fields */}
                {provisionType === 'internal_staff' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <InputField icon={<User />} label="Full Name" value={formData.fullName} onChange={(v) => handleChange('fullName', v)} />
                      <InputField icon={<Mail />} type="email" label="Email Address" value={formData.email} onChange={(v) => handleChange('email', v)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <InputField icon={<Phone />} label="Phone Number" value={formData.phone} onChange={(v) => handleChange('phone', v)} />
                      <SelectField label="Department" value={formData.department} options={departments} onChange={(v) => handleChange('department', v)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <SelectField label="Job Title" value={formData.jobTitle} options={internalRoles} onChange={(v) => handleChange('jobTitle', v)} />
                      <SelectField label="Reporting Administrator" value={formData.reportingAdministrator} options={administrators.map(a => a.name)} onChange={(v) => handleChange('reportingAdministrator', v)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <SelectField label="Business Unit" value={formData.businessUnit} options={businessUnits} onChange={(v) => handleChange('businessUnit', v)} />
                      <InputField icon={<Key />} type="password" label="Temporary Password" value={formData.tempPassword} onChange={(v) => handleChange('tempPassword', v)} />
                    </div>
                  </>
                )}

              </div>

              <div className="flex gap-3 pt-6 border-t border-white/10 mt-6">
                <GhostButton type="button" onClick={onClose} className="flex-1 justify-center">
                  Cancel
                </GhostButton>
                <GoldButton type="submit" disabled={isLoading} className="flex-1 justify-center">
                  {isLoading ? 'Processing...' : `Provision ${provisionType.replace('_', ' ')}`}
                </GoldButton>
              </div>
            </form>
          </>
        )}
      </div>
    </Modal>
  );
}

// Helpers
const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const InputField = ({ icon, label, type = 'text', value = '', onChange }: { icon: React.ReactNode, label: string, type?: string, value?: string, onChange: (v: string) => void }) => (
  <div className="space-y-1 group">
    <label className="text-xs font-medium text-ink/70 group-focus-within:text-gold-400 transition-colors">{label}</label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50 group-focus-within:text-gold-400 transition-colors [&>svg]:w-full [&>svg]:h-full">
        {icon}
      </div>
      <input 
        type={type} 
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Enter ${label.toLowerCase()}`}
        className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-2.5 pl-10 pr-4 text-sm text-cream placeholder-ink/50 focus:border-gold-400/50 focus:bg-navy-900 focus:outline-none focus:ring-1 focus:ring-gold-400/50 transition-all shadow-inner"
      />
    </div>
  </div>
);

const SelectField = ({ label, options, value = '', onChange }: { label: string, options: string[], value?: string, onChange: (v: string) => void }) => (
  <div className="space-y-1 group">
    <label className="text-xs font-medium text-ink/70 group-focus-within:text-gold-400 transition-colors">{label}</label>
    <select
      required
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-2.5 px-4 text-sm text-cream focus:border-gold-400/50 focus:bg-navy-900 focus:outline-none focus:ring-1 focus:ring-gold-400/50 transition-all appearance-none cursor-pointer shadow-inner"
    >
      <option value="" disabled>Select {label.toLowerCase()}</option>
      {options.map(opt => (
        <option key={opt} value={opt} className="bg-navy-900">{opt}</option>
      ))}
    </select>
  </div>
);

import { useState } from 'react';
import { Modal } from '../../../../components/ui/Modal';
import { GoldButton, GhostButton } from '../../../../components/ui/ui';
import { UserPlus, Mail, User, Building, Briefcase } from 'lucide-react';
import { ROLES } from '../../../../constants/roles';

export interface ProvisionUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  allowedRoles: string[];
  defaultRole?: string;
  onProvision?: (userData: { name: string; email: string; role: string; notes?: string }) => void;
}

export function ProvisionUserModal({ isOpen, onClose, allowedRoles, defaultRole, onProvision }: ProvisionUserModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState(defaultRole || allowedRoles[0] || '');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Determine icon based on role context
  const getIcon = () => {
    if (selectedRole === ROLES.AGENCY) return <Building className="h-5 w-5 text-gold-400" />;
    if (selectedRole === ROLES.ADMIN || selectedRole === ROLES.SUPER_ADMIN) return <UserPlus className="h-5 w-5 text-gold-400" />;
    return <Briefcase className="h-5 w-5 text-gold-400" />;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call for enterprise provisioning
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      
      if (onProvision) {
        onProvision({
          name,
          email,
          role: selectedRole,
          notes
        });
      }
      
      setTimeout(() => {
        setIsSuccess(false);
        setName('');
        setEmail('');
        setNotes('');
        onClose();
      }, 1500);
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title="Provision Account">
      <div className="p-6 sm:p-8">
        
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-300">
            <div className="h-16 w-16 rounded-full bg-emerald-400/20 flex items-center justify-center text-emerald-400 mb-6">
              <UserPlus className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold text-cream mb-2">Account Provisioned</h3>
            <p className="text-ink/60">
              The {selectedRole} account for <span className="font-semibold text-cream">{name}</span> has been successfully created.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-400/10 border border-gold-400/20">
                  {getIcon()}
                </div>
                <h2 className="text-2xl font-bold text-cream">Provision Account</h2>
              </div>
              <p className="text-sm text-ink/60">Create a new enterprise account. The user will receive an invitation to securely set up their credentials.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="space-y-4">
                {allowedRoles.length > 1 && (
                  <div className="space-y-1 group">
                    <label className="text-xs font-medium text-ink/70">Account Role</label>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-2.5 px-4 text-sm text-cream focus:border-gold-400/50 focus:bg-navy-900 focus:outline-none focus:ring-1 focus:ring-gold-400/50 transition-all appearance-none cursor-pointer"
                    >
                      {allowedRoles.map(role => (
                        <option key={role} value={role} className="bg-navy-900">{role}</option>
                      ))}
                    </select>
                  </div>
                )}
                
                <div className="space-y-1 group">
                  <label className="text-xs font-medium text-ink/70 group-focus-within:text-gold-400 transition-colors">
                    {selectedRole === ROLES.AGENCY ? 'Agency Name' : 'Full Name'}
                  </label>
                  <div className="relative">
                    {selectedRole === ROLES.AGENCY ? (
                      <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50 group-focus-within:text-gold-400 transition-colors" />
                    ) : (
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50 group-focus-within:text-gold-400 transition-colors" />
                    )}
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={`Enter ${selectedRole === ROLES.AGENCY ? 'agency' : 'user'} name`}
                      className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-2.5 pl-10 pr-4 text-sm text-cream placeholder-ink/50 focus:border-gold-400/50 focus:bg-navy-900 focus:outline-none focus:ring-1 focus:ring-gold-400/50 transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div className="space-y-1 group">
                  <label className="text-xs font-medium text-ink/70 group-focus-within:text-gold-400 transition-colors">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50 group-focus-within:text-gold-400 transition-colors" />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter primary email"
                      className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-2.5 pl-10 pr-4 text-sm text-cream placeholder-ink/50 focus:border-gold-400/50 focus:bg-navy-900 focus:outline-none focus:ring-1 focus:ring-gold-400/50 transition-all shadow-inner"
                    />
                  </div>
                </div>
                
                <div className="space-y-1 group">
                  <label className="text-xs font-medium text-ink/70 group-focus-within:text-gold-400 transition-colors">Internal Notes (Optional)</label>
                  <textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add operational context, department assignments, etc."
                    className="w-full h-24 rounded-xl border border-white/10 bg-navy-900/50 py-2.5 px-4 text-sm text-cream placeholder-ink/50 focus:border-gold-400/50 focus:bg-navy-900 focus:outline-none focus:ring-1 focus:ring-gold-400/50 transition-all shadow-inner resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/10">
                <GhostButton type="button" onClick={onClose} className="flex-1 justify-center">
                  Cancel
                </GhostButton>
                <GoldButton type="submit" disabled={isLoading} className="flex-1 justify-center">
                  {isLoading ? 'Creating...' : `Create ${selectedRole}`}
                </GoldButton>
              </div>
            </form>
          </>
        )}
      </div>
    </Modal>
  );
}

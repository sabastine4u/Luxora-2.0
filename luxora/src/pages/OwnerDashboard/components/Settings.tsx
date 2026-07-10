import { useState } from 'react';
import { User, Mail, Shield, KeyRound, Smartphone, Camera, MapPin, AlertTriangle, Monitor, Edit3, Landmark, FileText, Building, Link as LinkIcon, Power } from 'lucide-react';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { useSession } from '../../../contexts/SessionContext';
import { Modal } from '../../../components/ui/Modal';
import { SettingsLayout } from '../../../components/dashboard/shared/layouts/SettingsLayout';
import { SettingsSection } from '../../../components/dashboard/shared/settings/SettingsSection';
import { SettingsToggle } from '../../../components/dashboard/shared/settings/SettingsToggle';

export default function Settings() {
  const { user } = useSession();
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);
  
  const [notifs, setNotifs] = useState({
    email: true, sms: true, push: true, offers: true, viewingRequests: true, messages: true
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const toggleNotif = (key: keyof typeof notifs) => {
    setNotifs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleMockSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  return (
    <SettingsLayout
      title="Owner Account Center"
      subtitle="Manage your business profile, payment preferences, security, and account settings."
      saveSuccess={saveSuccess}
      successMessage="Settings saved successfully!"
      headerAction={
        <GoldButton onClick={handleMockSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save All Changes'}
        </GoldButton>
      }
    >

      {/* SECTION 1: PERSONAL INFORMATION */}
      <SettingsSection
        title="Personal Information"
        headerAction={<GhostButton size="sm"><Edit3 className="h-4 w-4 mr-2"/> Edit Profile</GhostButton>}
      >
        
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex flex-col items-center gap-3 shrink-0">
            <div className="relative">
              <img src={user?.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=200&h=200&fit=crop'} alt="Profile" className="h-28 w-28 rounded-full object-cover border-4 border-navy-900 shadow-xl bg-navy-800" />
              <button className="absolute bottom-0 right-0 p-2 bg-gold-400 rounded-full text-navy-900 hover:bg-gold-300 transition-colors shadow-lg">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <GhostButton size="sm">Update Photo</GhostButton>
          </div>
          
          <div className="flex-1 grid gap-6 sm:grid-cols-2 w-full">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
                <input type="text" defaultValue={user?.name || 'Owner Name'} className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
                <input type="email" defaultValue={user?.email || 'owner@luxora.com'} className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none" />
              </div>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Phone Number</label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
                <input type="tel" defaultValue="+234 800 123 4567" className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none" />
              </div>
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* SECTION 2: BUSINESS INFORMATION */}
      <SettingsSection
        title="Business Information"
      >
        
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Business Name</label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
              <input type="text" defaultValue="Luxora Properties Ltd." className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Business Type</label>
            <select className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-3 text-sm text-cream focus:border-gold-400/50 focus:outline-none">
              <option>Individual Owner</option>
              <option>Real Estate Agency</option>
              <option>Property Developer</option>
              <option>Corporate Entity</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Registration Number</label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
              <input type="text" defaultValue="RC-1234567" className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Website</label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
              <input type="url" defaultValue="https://luxoraproperties.com" className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none" />
            </div>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Office Address</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
              <input type="text" defaultValue="14 Admiralty Way, Lekki Phase 1, Lagos" className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none" />
            </div>
          </div>
        </div>
      </SettingsSection>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* SECTION 3: PAYMENT PREFERENCES */}
        <SettingsSection
          title="Payment Preferences"
        >
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Preferred Payment Method</label>
              <select className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-3 text-sm text-cream focus:border-gold-400/50 focus:outline-none">
                <option>Bank Transfer (Direct Deposit)</option>
                <option>Wire Transfer (International)</option>
                <option>Cheque</option>
              </select>
            </div>
            
            <div className="pt-2">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider block mb-3">Bank Information</label>
              <div className="flex items-center justify-between rounded-xl border border-white/5 bg-navy-900 p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-400">
                    <Landmark className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-cream">Guaranty Trust Bank</div>
                    <div className="text-xs text-ink/50">Acct ending in ****4210</div>
                  </div>
                </div>
                <GhostButton size="sm">Update</GhostButton>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Payout Frequency</label>
              <select className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-3 text-sm text-cream focus:border-gold-400/50 focus:outline-none">
                <option>Monthly (1st of Month)</option>
                <option>Bi-weekly</option>
                <option>Immediate (Upon Clearing)</option>
              </select>
            </div>
          </div>
        </SettingsSection>

        {/* SECTION 4: TAX INFORMATION */}
        <SettingsSection
          title="Tax Information"
        >
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Tax ID Number (TIN)</label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
                <input type="text" defaultValue="234-5678-9012" className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Tax Status</label>
              <select className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-3 text-sm text-cream focus:border-gold-400/50 focus:outline-none">
                <option>Registered Corporate Entity</option>
                <option>Sole Proprietor</option>
                <option>Non-resident</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Country of Tax Residence</label>
              <select className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-3 text-sm text-cream focus:border-gold-400/50 focus:outline-none">
                <option>Nigeria</option>
                <option>United Kingdom</option>
                <option>United States</option>
                <option>United Arab Emirates</option>
              </select>
            </div>
          </div>
        </SettingsSection>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* SECTION 5: NOTIFICATIONS */}
        <SettingsSection
          title="Notifications"
        >
          <div className="space-y-4">
            {[
              { id: 'email', label: 'Email Notifications', desc: 'Receive daily digests and important updates' },
              { id: 'sms', label: 'SMS Notifications', desc: 'Urgent alerts for offers and payments' },
              { id: 'push', label: 'Push Notifications', desc: 'In-app and browser notifications' },
              { id: 'offers', label: 'New Offers', desc: 'Alert me instantly when a bid is placed' },
              { id: 'viewingRequests', label: 'Viewing Requests', desc: 'When buyers request property tours' },
              { id: 'messages', label: 'Messages', desc: 'When you receive a new direct message' },
            ].map(item => (
              <SettingsToggle
                key={item.id}
                label={item.label}
                description={item.desc}
                checked={notifs[item.id as keyof typeof notifs]}
                onChange={() => toggleNotif(item.id as keyof typeof notifs)}
              />
            ))}
          </div>
        </SettingsSection>

        {/* SECTION 6: SECURITY & SECTION 7: PRIVACY */}
        <div className="space-y-6">
          <SettingsSection
            title="Security"
          >
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-navy-900 rounded-lg"><KeyRound className="h-5 w-5 text-gold-400"/></div>
                  <div>
                    <p className="text-sm font-semibold text-cream">Password</p>
                    <p className="text-xs text-ink/50">Last changed 2 months ago</p>
                  </div>
                </div>
                <GhostButton size="sm" onClick={() => alert('Mock: Change Password')}>Change</GhostButton>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-navy-900 rounded-lg"><Shield className="h-5 w-5 text-emerald-400"/></div>
                  <div>
                    <p className="text-sm font-semibold text-cream">Two-Factor Auth</p>
                    <p className="text-xs text-ink/50">Enabled via Authenticator App</p>
                  </div>
                </div>
                <GhostButton size="sm" onClick={() => alert('Mock: Setup 2FA')}>Manage</GhostButton>
              </div>
              
              <div className="border-t border-white/10 pt-4 space-y-4">
                <h4 className="text-sm font-semibold text-cream flex justify-between items-center">
                  Recent Login Activity
                  <GhostButton size="sm" onClick={() => alert('Mock: View All Sessions')}>View All</GhostButton>
                </h4>
                <div className="flex items-center justify-between bg-navy-900/50 p-3 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <Monitor className="h-5 w-5 text-ink/50" />
                    <div>
                      <p className="text-sm font-medium text-cream">MacBook Pro - Chrome</p>
                      <p className="text-[10px] text-emerald-400 uppercase tracking-wider font-semibold">Active Session • Lagos</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SettingsSection>

          <SettingsSection
            title="Privacy"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Profile Visibility</label>
                <select className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-3 text-sm text-cream focus:border-gold-400/50 focus:outline-none">
                  <option>Public (Visible to all buyers)</option>
                  <option>Private (Only visible on requested listings)</option>
                  <option>Hidden (Operate anonymously)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Data Sharing Preferences</label>
                <select className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-3 text-sm text-cream focus:border-gold-400/50 focus:outline-none">
                  <option>Share anonymized data for market insights</option>
                  <option>Do not share my data</option>
                </select>
              </div>
            </div>
          </SettingsSection>
        </div>
      </div>

      {/* SECTION 8: ACCOUNT MANAGEMENT */}
      <SettingsSection
        title="Danger Zone"
        icon={<AlertTriangle className="h-5 w-5" />}
        isDanger
      >
        
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-center">
          <GhostButton onClick={() => setDeactivateModalOpen(true)} className="w-full sm:w-auto text-orange-400 border-orange-400/30 hover:bg-orange-400/10">
            <Power className="h-4 w-4 mr-2"/> Deactivate Account
          </GhostButton>
          <GhostButton onClick={() => setDeleteModalOpen(true)} className="w-full sm:w-auto text-rose-400 border-rose-400/30 hover:bg-rose-400/10">
            Delete Account
          </GhostButton>
        </div>
      </SettingsSection>

      {/* Modals */}
      <Modal 
        isOpen={deleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Account"
        actionButton={<GhostButton onClick={() => alert('Mock: Account Deleted')} className="bg-rose-500/20 text-rose-400 border-rose-500/30 hover:bg-rose-500 hover:text-white" size="sm">Confirm Deletion</GhostButton>}
      >
        <div className="space-y-4">
          <p className="text-sm text-ink/80">
            Are you sure you want to delete your Luxora Owner account? This action is <strong className="text-rose-400">permanent and cannot be undone</strong>.
          </p>
          <p className="text-sm text-ink/80">
            All your listings, financial history, analytics, and tenant data will be permanently erased. Active rentals must be resolved before deletion.
          </p>
        </div>
      </Modal>

      <Modal 
        isOpen={deactivateModalOpen} 
        onClose={() => setDeactivateModalOpen(false)}
        title="Deactivate Account"
        actionButton={<GoldButton onClick={() => alert('Mock: Account Deactivated')} size="sm">Deactivate Now</GoldButton>}
      >
        <div className="space-y-4">
          <p className="text-sm text-ink/80">
            Deactivating your account will temporarily hide your profile and pause all active listings.
          </p>
          <p className="text-sm text-ink/80">
            You will not lose any data, and you can reactivate your account at any time by logging back in.
          </p>
        </div>
      </Modal>
    </SettingsLayout>
  );
}

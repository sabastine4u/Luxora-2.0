 
import { useState } from 'react';
import { 
  User, Mail, Smartphone, MapPin, Calendar, Briefcase, Award, FileText, 
  Globe, Percent, Landmark, Shield, KeyRound, Monitor, 
  AlertTriangle, Power, CheckCircle2, Edit3, Camera 
} from 'lucide-react';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { useSession } from '../../../contexts/SessionContext';
import { Modal } from '../../../components/ui/Modal';
import { SettingsLayout } from '../../../components/dashboard/shared/layouts/SettingsLayout';
import { SettingsSection } from '../../../components/dashboard/shared/settings/SettingsSection';
import { SettingsToggle } from '../../../components/dashboard/shared/settings/SettingsToggle';
import { useToast } from '../../../contexts/ToastContext';
import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';

export default function Settings() {
  const { user } = useSession();
  const { showToast } = useToast();
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);
  
  const [notifs, setNotifs] = useState({
    email: true, sms: true, push: true, newLeads: true, viewingRequests: true, offers: true, messages: true, commissionUpdates: true
  });

  const [specs, setSpecs] = useState({
    residential: true, commercial: false, luxury: true, land: false, studentHousing: false, shortLet: true, industrial: false, mixedUse: false
  });
  
  const [activeWorkflow, setActiveWorkflow] = useState<{ title: string, type: string, data?: Record<string, unknown> } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleAction = (title: string, type: string, data?: Record<string, unknown>) => {
    setActiveWorkflow({ title, type, data });
  };

  const executeWorkflow = () => {
    showToast({ type: 'success', title: 'Action Initiated', description: `Executing: ${activeWorkflow?.title}. Integration pending.` });
    setActiveWorkflow(null);
  };

  const toggleNotif = (key: keyof typeof notifs) => {
    setNotifs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleSpec = (key: keyof typeof specs) => {
    setSpecs(prev => ({ ...prev, [key]: !prev[key] }));
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
      title="Agent Settings"
      subtitle="Manage your agent profile, specializations, coverage areas, and preferences."
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
                <input type="text" defaultValue={user?.name || 'Agent Name'} className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
                <input type="email" defaultValue={user?.email || 'agent@luxora.com'} className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Phone Number</label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
                <input type="tel" defaultValue="+234 800 123 4567" className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Date of Birth</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
                <input type="date" defaultValue="1990-01-01" className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none [color-scheme:dark]" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Gender</label>
              <select className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-3 text-sm text-cream focus:border-gold-400/50 focus:outline-none">
                <option>Male</option>
                <option>Female</option>
                <option>Prefer not to say</option>
              </select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Home Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
                <input type="text" defaultValue="10 Marina Road, Lagos Island, Lagos" className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none" />
              </div>
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* SECTION 2: PROFESSIONAL PROFILE */}
      <SettingsSection
        title="Professional Profile"
      >
        
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Agency Name</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
              <input type="text" defaultValue="Meridian Luxury Homes" className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">License Number</label>
            <div className="relative">
              <Award className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
              <input type="text" defaultValue="LA-RE-2025-983" className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Years of Experience</label>
            <select className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-3 text-sm text-cream focus:border-gold-400/50 focus:outline-none">
              <option>1-3 Years</option>
              <option selected>4-7 Years</option>
              <option>8-15 Years</option>
              <option>15+ Years</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Languages Spoken</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
              <input type="text" defaultValue="English, Yoruba, Pidgin" className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none" />
            </div>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Professional Bio</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-ink/50" />
              <textarea rows={4} defaultValue="Experienced luxury real estate agent specializing in high-end residential properties across Victoria Island and Ikoyi. Dedicated to matching clients with their dream homes while ensuring seamless transactions." className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none"></textarea>
            </div>
          </div>
        </div>
      </SettingsSection>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* SECTION 3: AREAS OF SPECIALIZATION */}
        <SettingsSection
          title="Areas of Specialization"
        >
          <div className="grid grid-cols-2 gap-4">
            {[
              { id: 'residential', label: 'Residential' },
              { id: 'commercial', label: 'Commercial' },
              { id: 'luxury', label: 'Luxury' },
              { id: 'land', label: 'Land' },
              { id: 'studentHousing', label: 'Student Housing' },
              { id: 'shortLet', label: 'Short-let' },
              { id: 'industrial', label: 'Industrial' },
              { id: 'mixedUse', label: 'Mixed Use' },
            ].map(item => (
              <label key={item.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${specs[item.id as keyof typeof specs] ? 'bg-gold-400/10 border-gold-400/30' : 'bg-navy-900/50 border-white/5 hover:border-white/10'}`}>
                <div className={`flex h-5 w-5 items-center justify-center rounded-md border ${specs[item.id as keyof typeof specs] ? 'border-gold-400 bg-gold-400' : 'border-white/20 bg-transparent'}`}>
                  {specs[item.id as keyof typeof specs] && <CheckCircle2 className="h-3.5 w-3.5 text-navy-900" />}
                </div>
                <span className={`text-sm font-medium ${specs[item.id as keyof typeof specs] ? 'text-gold-400' : 'text-cream'}`}>{item.label}</span>
                <input type="checkbox" className="hidden" checked={specs[item.id as keyof typeof specs]} onChange={() => toggleSpec(item.id as keyof typeof specs)} />
              </label>
            ))}
          </div>
        </SettingsSection>

        {/* SECTION 4: SERVICE AREAS */}
        <SettingsSection
          title="Service Areas"
        >
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">States</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
                <input type="text" defaultValue="Lagos, Abuja" className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Cities & Neighborhoods</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
                <input type="text" defaultValue="Victoria Island, Ikoyi, Lekki Phase 1, Banana Island" className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Coverage Radius</label>
              <select className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-3 text-sm text-cream focus:border-gold-400/50 focus:outline-none">
                <option>Within 10 km</option>
                <option selected>Within 25 km</option>
                <option>Within 50 km</option>
                <option>Statewide</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Preferred Locations</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
                <input type="text" defaultValue="Ikoyi, Banana Island" className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none" />
              </div>
            </div>
          </div>
        </SettingsSection>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* SECTION 5: AVAILABILITY */}
        <SettingsSection
          title="Availability"
        >
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Working Days</label>
              <select className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-3 text-sm text-cream focus:border-gold-400/50 focus:outline-none">
                <option>Monday - Friday</option>
                <option selected>Monday - Saturday</option>
                <option>Everyday</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Start Time</label>
                 <select className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-3 text-sm text-cream focus:border-gold-400/50 focus:outline-none">
                   <option>08:00 AM</option>
                   <option selected>09:00 AM</option>
                   <option>10:00 AM</option>
                 </select>
               </div>
               <div className="space-y-2">
                 <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">End Time</label>
                 <select className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-3 text-sm text-cream focus:border-gold-400/50 focus:outline-none">
                   <option>04:00 PM</option>
                   <option>05:00 PM</option>
                   <option selected>06:00 PM</option>
                 </select>
               </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-navy-900/50 rounded-xl border border-white/5">
              <div>
                <p className="text-sm font-semibold text-cream">Appointment Availability</p>
                <p className="text-xs text-ink/50">Allow buyers to book meetings</p>
              </div>
              <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors bg-gold-400">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-navy-900/50 rounded-xl border border-white/5">
              <div>
                <p className="text-sm font-semibold text-cream">Vacation Mode</p>
                <p className="text-xs text-ink/50">Pause all incoming requests</p>
              </div>
              <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors bg-white/10">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* SECTION 6: COMMISSION PREFERENCES */}
        <SettingsSection
          title="Commission Preferences"
        >
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Default Commission %</label>
              <div className="relative">
                <Percent className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
                <input type="number" defaultValue="5" className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Bonus Structure (Optional)</label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
                <input type="text" defaultValue="+1% for deals > ₦100M" className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none" />
              </div>
            </div>

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
          </div>
        </SettingsSection>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* SECTION 7: NOTIFICATIONS */}
        <SettingsSection
          title="Notification Preferences"
        >
          <div className="space-y-4">
            {[
              { id: 'email', label: 'Email Notifications', desc: 'Receive daily digests and reports' },
              { id: 'sms', label: 'SMS Notifications', desc: 'Urgent alerts for showings and offers' },
              { id: 'push', label: 'Push Notifications', desc: 'In-app and browser notifications' },
              { id: 'newLeads', label: 'New Leads', desc: 'When a new lead is assigned to you' },
              { id: 'viewingRequests', label: 'Viewing Requests', desc: 'When buyers request property tours' },
              { id: 'offers', label: 'Offers', desc: 'When a bid is placed on your listings' },
              { id: 'messages', label: 'Messages', desc: 'When you receive a direct message' },
              { id: 'commissionUpdates', label: 'Commission Updates', desc: 'Payouts and milestone alerts' },
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

        {/* SECTION 8: SECURITY & SECTION 9: PRIVACY */}
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
                <GhostButton size="sm" onClick={() => handleAction('Change Password', 'change_password')}>Change</GhostButton>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-navy-900 rounded-lg"><Shield className="h-5 w-5 text-emerald-400"/></div>
                  <div>
                    <p className="text-sm font-semibold text-cream">Two-Factor Auth</p>
                    <p className="text-xs text-ink/50">Enabled via Authenticator App</p>
                  </div>
                </div>
                <GhostButton size="sm" onClick={() => handleAction('Manage 2FA', 'manage_2fa')}>Manage</GhostButton>
              </div>
              
              <div className="border-t border-white/10 pt-4 space-y-4">
                <h4 className="text-sm font-semibold text-cream flex justify-between items-center">
                  Recent Login Activity
                  <GhostButton size="sm" onClick={() => handleAction('Session History', 'session_history')}>View All</GhostButton>
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
                <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Contact Visibility</label>
                <select className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-3 text-sm text-cream focus:border-gold-400/50 focus:outline-none">
                  <option>Display Email & Phone Number</option>
                  <option>Display Email Only</option>
                  <option>Hide All Contact Details (In-app messaging only)</option>
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

      {/* SECTION 10: ACCOUNT MANAGEMENT */}
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
        actionButton={<GhostButton onClick={() => { showToast({ type: 'error', title: 'Account Deleted', description: 'Your account has been successfully deleted.' }); setDeleteModalOpen(false); }} className="bg-rose-500/20 text-rose-400 border-rose-500/30 hover:bg-rose-500 hover:text-white" size="sm">Confirm Deletion</GhostButton>}
      >
        <div className="space-y-4">
          <p className="text-sm text-ink/80">
            Are you sure you want to delete your Luxora Agent account? This action is <strong className="text-rose-400">permanent and cannot be undone</strong>.
          </p>
          <p className="text-sm text-ink/80">
            All your leads, sales history, analytics, and contact data will be permanently erased.
          </p>
        </div>
      </Modal>

      <Modal 
        isOpen={deactivateModalOpen} 
        onClose={() => setDeactivateModalOpen(false)}
        title="Deactivate Account"
        actionButton={<GoldButton onClick={() => { showToast({ type: 'warning', title: 'Account Deactivated', description: 'Your account has been deactivated.' }); setDeactivateModalOpen(false); }} size="sm">Deactivate Now</GoldButton>}
      >
        <div className="space-y-4">
          <p className="text-sm text-ink/80">
            Deactivating your account will temporarily hide your profile and pause all active leads.
          </p>
          <p className="text-sm text-ink/80">
            You will not lose any data, and you can reactivate your account at any time by logging back in.
          </p>
        </div>
      </Modal>

      <EnterpriseDetailDrawer
        isOpen={!!activeWorkflow}
        onClose={() => setActiveWorkflow(null)}
        title={activeWorkflow?.title || 'Workflow'}
        footerActions={
          <GoldButton onClick={executeWorkflow} className="w-full justify-center">Confirm Action</GoldButton>
        }
      >
        <div className="space-y-6">
          <div className="p-4 rounded-xl border border-white/10 bg-navy-900">
            <h4 className="text-sm font-semibold text-cream mb-2">Workflow Details</h4>
            <p className="text-sm text-ink/60 leading-relaxed">
              You are about to execute the <strong>{activeWorkflow?.type}</strong> workflow. 
              Please review the action details below and confirm to integrate with the backend system.
            </p>
          </div>
          {activeWorkflow?.data && (
            <div className="p-4 rounded-xl border border-white/10 bg-navy-900/50">
              <h4 className="text-sm font-semibold text-cream mb-4">Context Data</h4>
              <div className="space-y-2 text-sm text-ink/80">
                {Object.entries(activeWorkflow.data).map(([key, value]) => {
                  if (typeof value === 'string' || typeof value === 'number') {
                    return (
                      <div key={key} className="flex justify-between border-b border-white/5 pb-2">
                        <span className="capitalize">{key}</span>
                        <span className="font-medium text-cream">{value}</span>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          )}
        </div>
      </EnterpriseDetailDrawer>
    </SettingsLayout>
  );
}

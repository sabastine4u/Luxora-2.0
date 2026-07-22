import { useState } from 'react';
import { 
  Building2, Mail, Smartphone, MapPin, Briefcase, 
  Globe, Shield, KeyRound, Monitor, Camera, Edit3 
} from 'lucide-react';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { useSession } from '../../../contexts/SessionContext';
import { SettingsLayout } from '../../../components/dashboard/shared/layouts/SettingsLayout';
import { SettingsSection } from '../../../components/dashboard/shared/settings/SettingsSection';
import { SettingsToggle } from '../../../components/dashboard/shared/settings/SettingsToggle';
import { useToast } from '../../../contexts/ToastContext';

export default function Settings() {
  const { user } = useSession();
  const { showToast } = useToast();
  
  const [notifs, setNotifs] = useState({
    email: true, sms: true, push: true, newLeads: true, viewingRequests: true, offers: true, messages: true, complianceAlerts: true
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
      showToast({ type: 'success', title: 'Settings Saved', description: 'Your agency settings have been successfully updated.' });
    }, 1000);
  };

  return (
    <SettingsLayout
      title="Agency Settings"
      subtitle="Manage your agency profile, business information, and communication preferences."
      saveSuccess={saveSuccess}
      successMessage="Settings saved successfully!"
      headerAction={
        <GoldButton onClick={handleMockSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save All Changes'}
        </GoldButton>
      }
    >

      {/* SECTION 1: AGENCY PROFILE */}
      <SettingsSection
        title="Agency Profile"
        headerAction={<GhostButton size="sm"><Edit3 className="h-4 w-4 mr-2"/> Edit Profile</GhostButton>}
      >
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex flex-col items-center gap-3 shrink-0">
            <div className="relative">
              <div className="h-28 w-28 rounded-xl border-4 border-navy-900 shadow-xl bg-navy-800 flex items-center justify-center overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Agency Logo" className="h-full w-full object-cover" />
                ) : (
                  <Building2 className="h-12 w-12 text-ink/20" />
                )}
              </div>
              <button className="absolute bottom-[-10px] right-[-10px] p-2 bg-gold-400 rounded-full text-navy-900 hover:bg-gold-300 transition-colors shadow-lg border-2 border-navy-900">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <GhostButton size="sm">Update Logo</GhostButton>
          </div>
          
          <div className="flex-1 grid gap-6 sm:grid-cols-2 w-full">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Agency Name</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
                <input type="text" defaultValue={user?.name || 'Meridian Luxury Real Estate'} className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Registration Number</label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
                <input type="text" defaultValue="RC-1234567" disabled className="w-full rounded-xl border border-white/5 bg-navy-950 py-3 pl-10 pr-4 text-sm text-ink/50 cursor-not-allowed" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Primary Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
                <input type="email" defaultValue={user?.email || 'contact@meridian.com'} className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Contact Number</label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
                <input type="tel" defaultValue="+234 800 123 4567" className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 space-y-2">
          <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Agency Bio / Description</label>
          <textarea 
            rows={4} 
            defaultValue="Premium luxury real estate agency specializing in high-end residential and commercial properties across top-tier locations."
            className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none resize-none"
          />
        </div>
      </SettingsSection>

      {/* SECTION 2: BUSINESS INFORMATION */}
      <SettingsSection title="Business Information">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Headquarters Address</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-ink/50" />
              <textarea rows={2} defaultValue="12 Luxury Lane, Victoria Island, Lagos" className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none resize-none" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Website</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
              <input type="url" defaultValue="https://www.meridianluxury.com" className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none" />
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* SECTION 3: NOTIFICATION PREFERENCES */}
      <SettingsSection title="Notification Preferences">
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-cream mb-4 flex items-center gap-2"><Smartphone className="h-4 w-4 text-ink/50"/> Delivery Methods</h4>
            <div className="grid sm:grid-cols-3 gap-4">
              <SettingsToggle label="Email Notifications" checked={notifs.email} onChange={() => toggleNotif('email')} />
              <SettingsToggle label="SMS Alerts" checked={notifs.sms} onChange={() => toggleNotif('sms')} />
              <SettingsToggle label="Push Notifications" checked={notifs.push} onChange={() => toggleNotif('push')} />
            </div>
          </div>

          <div className="h-px bg-white/5 w-full"></div>

          <div>
            <h4 className="text-sm font-medium text-cream mb-4 flex items-center gap-2"><Briefcase className="h-4 w-4 text-ink/50"/> Alert Types</h4>
            <div className="grid sm:grid-cols-2 gap-4">
              <SettingsToggle label="New Leads" description="Alert when new leads are captured." checked={notifs.newLeads} onChange={() => toggleNotif('newLeads')} />
              <SettingsToggle label="Viewing Requests" description="Alert when buyers request viewings." checked={notifs.viewingRequests} onChange={() => toggleNotif('viewingRequests')} />
              <SettingsToggle label="Offers & Deals" description="Alert for offers made on agency listings." checked={notifs.offers} onChange={() => toggleNotif('offers')} />
              <SettingsToggle label="Platform Messages" description="Alert for direct messages from the platform." checked={notifs.messages} onChange={() => toggleNotif('messages')} />
              <SettingsToggle label="Compliance Alerts" description="Alert for document verifications and compliance." checked={notifs.complianceAlerts} onChange={() => toggleNotif('complianceAlerts')} />
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* SECTION 4: SECURITY & ACCESS */}
      <SettingsSection title="Security Settings">
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="p-5 rounded-xl border border-white/5 bg-navy-900/30 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-emerald-400/10"><Shield className="h-5 w-5 text-emerald-400" /></div>
              <div>
                <h4 className="text-sm font-bold text-cream">Two-Factor Authentication</h4>
                <p className="text-xs text-ink/60">Secure your agency account.</p>
              </div>
            </div>
            <div className="flex justify-between items-center bg-navy-950 p-3 rounded-lg border border-white/5">
              <span className="text-sm text-emerald-400 font-medium flex items-center gap-2">Status: Active</span>
              <GhostButton size="sm">Manage</GhostButton>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-white/5 bg-navy-900/30 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-gold-400/10"><KeyRound className="h-5 w-5 text-gold-400" /></div>
              <div>
                <h4 className="text-sm font-bold text-cream">Password Management</h4>
                <p className="text-xs text-ink/60">Last changed 45 days ago</p>
              </div>
            </div>
            <GoldButton size="sm" className="w-full">Update Password</GoldButton>
          </div>
          
          <div className="p-5 rounded-xl border border-white/5 bg-navy-900/30 space-y-4 sm:col-span-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-400/10"><Monitor className="h-5 w-5 text-blue-400" /></div>
              <div>
                <h4 className="text-sm font-bold text-cream">Active Sessions</h4>
                <p className="text-xs text-ink/60">Manage devices logged into your account.</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-navy-950 p-3 rounded-lg border border-white/5">
                <div className="flex items-center gap-3">
                  <Monitor className="h-4 w-4 text-ink/40" />
                  <div>
                    <div className="text-sm text-cream">MacBook Pro • Chrome</div>
                    <div className="text-xs text-ink/60">Lagos, NG • Current Session</div>
                  </div>
                </div>
                <span className="text-xs text-emerald-400 font-medium px-2 py-1 rounded-full bg-emerald-400/10">Active</span>
              </div>
              <div className="flex justify-between items-center bg-navy-950 p-3 rounded-lg border border-white/5">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-4 w-4 text-ink/40" />
                  <div>
                    <div className="text-sm text-cream">iPhone 14 Pro • Safari</div>
                    <div className="text-xs text-ink/60">Lagos, NG • 2 hours ago</div>
                  </div>
                </div>
                <button className="text-xs text-rose-400 hover:text-rose-300 transition-colors">Revoke</button>
              </div>
            </div>
          </div>
        </div>
      </SettingsSection>
    </SettingsLayout>
  );
}

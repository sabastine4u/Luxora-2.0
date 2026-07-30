import { useState } from 'react';
import { 
  Building2, Mail, Smartphone, MapPin, Briefcase, 
  Globe, Shield, KeyRound, Monitor, Camera, Edit3,
  FileText, CheckCircle2, Clock, Map, Star, Plus, Download, Upload, Trash2
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
    email: true, sms: true, push: true, newLeads: true, viewingRequests: true, offers: true, messages: true, complianceAlerts: true,
    ownerSubmitted: true, adminApproved: true, agentAccepted: true, agentDeclined: true, assignmentReturned: true, commissionGenerated: true, complianceExpiring: true, agentVerified: true, propertyPublished: true
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
      subtitle="Manage your agency profile, business information, branches, documents, and communication preferences."
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
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">CAC Status</label>
              <div className="relative">
                <CheckCircle2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400" />
                <input type="text" defaultValue="Verified Active" disabled className="w-full rounded-xl border border-white/5 bg-navy-950 py-3 pl-10 pr-4 text-sm text-emerald-400 font-medium cursor-not-allowed" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Years In Business</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
                <input type="text" defaultValue="15 Years" className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Business Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
                <input type="email" defaultValue="contact@meridian.com" className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Support Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
                <input type="email" defaultValue="support@meridian.com" className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Business Phone</label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
                <input type="tel" defaultValue="+234 800 123 4567" className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Website</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
                <input type="url" defaultValue="https://www.meridianluxury.com" className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Agency Rating</label>
              <div className="relative">
                <Star className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-400" />
                <input type="text" defaultValue="4.8/5.0 (2,450 Reviews)" disabled className="w-full rounded-xl border border-white/5 bg-navy-950 py-3 pl-10 pr-4 text-sm text-gold-400 font-medium cursor-not-allowed" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Business Verification</label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400" />
                <input type="text" defaultValue="Fully Verified Agency" disabled className="w-full rounded-xl border border-white/5 bg-navy-950 py-3 pl-10 pr-4 text-sm text-emerald-400 font-medium cursor-not-allowed" />
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

      {/* SECTION 2: OPERATIONS */}
      <SettingsSection title="Operations">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Operating Hours</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
              <input type="text" defaultValue="Mon-Fri, 9:00 AM - 6:00 PM" className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Coverage Radius</label>
            <div className="relative">
              <Map className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
              <input type="text" defaultValue="National (All 36 States)" className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Primary Service States</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
              <input type="text" defaultValue="Lagos, Abuja, Rivers, Oyo" className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Primary Service Cities</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
              <input type="text" defaultValue="Ikoyi, Victoria Island, Maitama, Asokoro" className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none" />
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* SECTION 3: BRANCH MANAGEMENT */}
      <SettingsSection 
        title="Branch Management"
        headerAction={<GoldButton size="sm"><Plus className="h-4 w-4 mr-2"/> Add Branch</GoldButton>}
      >
        <div className="space-y-4">
          {[
            { name: 'Victoria Island HQ', manager: 'Marcus Sterling', phone: '+234 800 111 2222', email: 'hq@meridian.com', address: '12 Luxury Lane', city: 'Victoria Island', state: 'Lagos', status: 'Active' },
            { name: 'Abuja Regional Office', manager: 'Sarah James', phone: '+234 800 333 4444', email: 'abuja@meridian.com', address: 'Plot 45 Maitama Crescent', city: 'Maitama', state: 'Abuja', status: 'Active' },
            { name: 'Port Harcourt Branch', manager: 'Emeka Uzo', phone: '+234 800 555 6666', email: 'ph@meridian.com', address: '78 Trans Amadi Ind. Layout', city: 'Port Harcourt', state: 'Rivers', status: 'Inactive' },
          ].map((branch, i) => (
            <div key={i} className="flex flex-col md:flex-row justify-between items-start md:items-center bg-navy-900/50 p-5 rounded-xl border border-white/10 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h4 className="text-base font-bold text-cream">{branch.name}</h4>
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${branch.status === 'Active' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-ink/10 text-ink/60'}`}>{branch.status}</span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-ink/70">
                  <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" /> {branch.manager}</span>
                  <span className="flex items-center gap-1"><Smartphone className="h-3 w-3" /> {branch.phone}</span>
                  <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {branch.email}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-ink/70">
                  <MapPin className="h-3 w-3" /> {branch.address}, {branch.city}, {branch.state}
                </div>
              </div>
              <div className="flex gap-2">
                <GhostButton size="sm"><Edit3 className="h-4 w-4" /></GhostButton>
                <GhostButton size="sm" className="text-rose-400 hover:text-rose-300"><Trash2 className="h-4 w-4" /></GhostButton>
              </div>
            </div>
          ))}
        </div>
      </SettingsSection>

      {/* SECTION 4: COMPANY DOCUMENTS */}
      <SettingsSection title="Company Documents">
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { title: 'CAC Certificate', status: 'Approved', expiry: 'Never' },
            { title: 'Tax Clearance Certificate', status: 'Approved', expiry: 'Dec 2026' },
            { title: 'Business License', status: 'Pending', expiry: 'Mar 2027' },
            { title: 'Professional Indemnity Insurance', status: 'Expired', expiry: 'Jan 2026' },
            { title: 'Real Estate Developer Association (REDAN)', status: 'Rejected', expiry: 'N/A' },
          ].map((doc, i) => (
            <div key={i} className="flex justify-between items-center bg-navy-900/50 p-4 rounded-xl border border-white/10">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  doc.status === 'Approved' ? 'bg-emerald-400/10' :
                  doc.status === 'Pending' ? 'bg-yellow-400/10' :
                  doc.status === 'Expired' ? 'bg-rose-400/10' : 'bg-rose-400/10'
                }`}>
                  <FileText className={`h-5 w-5 ${
                    doc.status === 'Approved' ? 'text-emerald-400' :
                    doc.status === 'Pending' ? 'text-yellow-400' :
                    'text-rose-400'
                  }`} />
                </div>
                <div>
                  <div className="text-sm font-bold text-cream mb-0.5">{doc.title}</div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className={`font-medium ${
                      doc.status === 'Approved' ? 'text-emerald-400' :
                      doc.status === 'Pending' ? 'text-yellow-400' :
                      'text-rose-400'
                    }`}>{doc.status}</span>
                    <span className="text-ink/60">• Exp: {doc.expiry}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="text-ink/60 hover:text-gold-400 transition-colors p-1" title="View"><Download className="h-4 w-4" /></button>
                <button className="text-ink/60 hover:text-gold-400 transition-colors p-1" title="Replace"><Upload className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </SettingsSection>

      {/* SECTION 5: NOTIFICATION PREFERENCES */}
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
            <h4 className="text-sm font-medium text-cream mb-4 flex items-center gap-2"><Briefcase className="h-4 w-4 text-ink/50"/> Enterprise Event Alerts</h4>
            <div className="grid sm:grid-cols-2 gap-4">
              <SettingsToggle label="Owner Submitted Property" description="Alert when a new property is submitted." checked={notifs.ownerSubmitted} onChange={() => toggleNotif('ownerSubmitted')} />
              <SettingsToggle label="Admin Approved Property" description="Alert when Admin routes a property." checked={notifs.adminApproved} onChange={() => toggleNotif('adminApproved')} />
              <SettingsToggle label="Agent Accepted Assignment" description="Alert when an agent accepts a property." checked={notifs.agentAccepted} onChange={() => toggleNotif('agentAccepted')} />
              <SettingsToggle label="Agent Declined Assignment" description="Alert when an agent declines a property." checked={notifs.agentDeclined} onChange={() => toggleNotif('agentDeclined')} />
              <SettingsToggle label="Assignment Returned" description="Alert when a property is returned." checked={notifs.assignmentReturned} onChange={() => toggleNotif('assignmentReturned')} />
              <SettingsToggle label="Commission Generated" description="Alert when a commission payment is processed." checked={notifs.commissionGenerated} onChange={() => toggleNotif('commissionGenerated')} />
              <SettingsToggle label="Compliance Expiring" description="Alert 30 days before document expiration." checked={notifs.complianceExpiring} onChange={() => toggleNotif('complianceExpiring')} />
              <SettingsToggle label="Agent Verification Completed" description="Alert when agent submits docs." checked={notifs.agentVerified} onChange={() => toggleNotif('agentVerified')} />
              <SettingsToggle label="Property Published" description="Alert when a listing goes live." checked={notifs.propertyPublished} onChange={() => toggleNotif('propertyPublished')} />
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* SECTION 6: SECURITY & ACCESS */}
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

import { useState } from 'react';
import { User, Mail, Shield, KeyRound, Smartphone, Camera, MapPin, Briefcase, Calendar, Home, DollarSign, Bed, Bath, LogOut, Download, AlertTriangle, Monitor, Globe, Moon, Clock, Edit3 } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';
import { useSession } from '../../../contexts/SessionContext';
import { Modal } from '../../../components/ui/Modal';
import { SettingsLayout } from '../../../components/dashboard/shared/layouts/SettingsLayout';
import { SettingsSection } from '../../../components/dashboard/shared/settings/SettingsSection';
import { SettingsToggle } from '../../../components/dashboard/shared/settings/SettingsToggle';

export default function Settings() {
  const { user, logout } = useSession();
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [notifs, setNotifs] = useState({
    email: true, sms: false, push: true, property: true, priceDrop: true, mortgage: false, marketing: false
  });
  
  const toggleNotif = (key: keyof typeof notifs) => {
    setNotifs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <SettingsLayout
      title="Buyer Account Center"
      subtitle="Manage your profile, preferences, security, and account settings."
    >

      {/* SECTION 1: PROFILE */}
      <SettingsSection
        title="Profile Information"
        headerAction={<GhostButton size="sm"><Edit3 className="h-4 w-4 mr-2"/> Edit Profile</GhostButton>}
      >
        
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex flex-col items-center gap-3 shrink-0">
            <div className="relative">
              <img src={user?.avatar || 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=200&fit=crop'} alt="Profile" className="h-28 w-28 rounded-full object-cover border-4 border-navy-900 shadow-xl bg-navy-800" />
              <button className="absolute bottom-0 right-0 p-2 bg-gold-400 rounded-full text-navy-900 hover:bg-gold-300 transition-colors shadow-lg">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <GhostButton size="sm">Upload Photo</GhostButton>
          </div>
          
          <div className="flex-1 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Full Name</label>
              <div className="flex items-center gap-2 text-cream"><User className="h-4 w-4 text-gold-400"/> {user?.name || 'Guest User'}</div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Email Address</label>
              <div className="flex items-center gap-2 text-cream"><Mail className="h-4 w-4 text-gold-400"/> {user?.email || 'guest@luxora.com'}</div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Phone Number</label>
              <div className="flex items-center gap-2 text-cream"><Smartphone className="h-4 w-4 text-gold-400"/> +234 800 123 4567</div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Address</label>
              <div className="flex items-center gap-2 text-cream"><MapPin className="h-4 w-4 text-gold-400"/> 14 Admiralty Way, Lekki</div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Occupation</label>
              <div className="flex items-center gap-2 text-cream"><Briefcase className="h-4 w-4 text-gold-400"/> Investment Banker</div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Date Joined</label>
              <div className="flex items-center gap-2 text-cream"><Calendar className="h-4 w-4 text-gold-400"/> January 15, 2025</div>
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* SECTION 2: PROPERTY PREFERENCES */}
      <SettingsSection
        title="Property Preferences"
      >
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Purpose</label>
            <select className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-3 text-sm text-cream focus:border-gold-400/50 focus:outline-none">
              <option>Buy</option>
              <option>Rent</option>
              <option>Short-let</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Preferred Property Types</label>
            <div className="relative">
              <Home className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
              <input type="text" defaultValue="Apartment, Villa" className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Preferred Locations</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
              <input type="text" defaultValue="Ikoyi, Victoria Island, Lekki" className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Budget Range (₦)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
              <input type="text" defaultValue="150M - 500M" className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Minimum Bedrooms</label>
            <div className="relative">
              <Bed className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
              <select className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none">
                <option>3+ Bedrooms</option>
                <option>4+ Bedrooms</option>
                <option>5+ Bedrooms</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Minimum Bathrooms</label>
            <div className="relative">
              <Bath className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
              <select className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none">
                <option>3+ Bathrooms</option>
                <option>4+ Bathrooms</option>
              </select>
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* SECTION 3 & 4: NOTIFICATIONS and SECURITY (Two column layout) */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* SECTION 3: NOTIFICATIONS */}
        <SettingsSection
          title="Notifications"
        >
          <div className="space-y-4">
            {[
              { id: 'email', label: 'Email Notifications', desc: 'Receive important updates via email' },
              { id: 'sms', label: 'SMS Notifications', desc: 'Get text alerts for urgent items' },
              { id: 'push', label: 'Push Notifications', desc: 'In-app alerts and web push' },
              { id: 'property', label: 'Property Alerts', desc: 'When new matches are found' },
              { id: 'priceDrop', label: 'Price Drop Alerts', desc: 'When saved properties drop in price' },
              { id: 'mortgage', label: 'Mortgage Updates', desc: 'Status updates on applications' },
              { id: 'marketing', label: 'Marketing Emails', desc: 'Newsletters and promotions' },
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

        {/* SECTION 4: SECURITY */}
        <SettingsSection
          title="Security"
        >
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-navy-900 rounded-lg"><KeyRound className="h-5 w-5 text-gold-400"/></div>
                <div>
                  <p className="text-sm font-semibold text-cream">Password</p>
                  <p className="text-xs text-ink/50">Last changed 3 months ago</p>
                </div>
              </div>
              <GhostButton size="sm">Change Password</GhostButton>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-navy-900 rounded-lg"><Shield className="h-5 w-5 text-emerald-400"/></div>
                <div>
                  <p className="text-sm font-semibold text-cream">Two-Factor Auth</p>
                  <p className="text-xs text-ink/50">Enabled via SMS</p>
                </div>
              </div>
              <GhostButton size="sm">Manage 2FA</GhostButton>
            </div>
            
            <div className="border-t border-white/10 pt-4 space-y-4">
              <h4 className="text-sm font-semibold text-cream">Recent Login Activity</h4>
              
              <div className="flex items-center justify-between bg-navy-900/50 p-3 rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                  <Monitor className="h-5 w-5 text-ink/50" />
                  <div>
                    <p className="text-sm font-medium text-cream">Windows PC - Chrome</p>
                    <p className="text-[10px] text-emerald-400 uppercase tracking-wider font-semibold">Active Session • Lagos</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between bg-navy-900/50 p-3 rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-ink/50" />
                  <div>
                    <p className="text-sm font-medium text-cream">iPhone 14 Pro - Safari</p>
                    <p className="text-[10px] text-ink/50 uppercase tracking-wider font-semibold">2 days ago • Abuja</p>
                  </div>
                </div>
                <button className="text-xs font-semibold text-rose-400 hover:text-rose-300">Revoke</button>
              </div>
            </div>
          </div>
        </SettingsSection>
      </div>

      {/* SECTION 5: APPEARANCE */}
      <SettingsSection
        title="Appearance & Regional"
      >
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider flex items-center gap-2"><Moon className="h-4 w-4"/> Theme</label>
            <select className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-3 text-sm text-cream focus:border-gold-400/50 focus:outline-none">
              <option>Dark Mode (Default)</option>
              <option>Light Mode</option>
              <option>System Default</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider flex items-center gap-2"><Globe className="h-4 w-4"/> Language</label>
            <select className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-3 text-sm text-cream focus:border-gold-400/50 focus:outline-none">
              <option>English (UK)</option>
              <option>English (US)</option>
              <option>French</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider flex items-center gap-2"><Clock className="h-4 w-4"/> Time Zone</label>
            <select className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-3 text-sm text-cream focus:border-gold-400/50 focus:outline-none">
              <option>WAT (UTC+1)</option>
              <option>GMT (UTC+0)</option>
              <option>EST (UTC-5)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider flex items-center gap-2"><DollarSign className="h-4 w-4"/> Currency</label>
            <select className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-3 text-sm text-cream focus:border-gold-400/50 focus:outline-none">
              <option>NGN (₦)</option>
              <option>USD ($)</option>
              <option>GBP (£)</option>
              <option>EUR (€)</option>
            </select>
          </div>
        </div>
      </SettingsSection>

      {/* SECTION 6: ACCOUNT */}
      <SettingsSection
        title="Account Actions"
        icon={<AlertTriangle className="h-5 w-5" />}
        isDanger
      >
        
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-center">
          <GhostButton className="w-full sm:w-auto"><Download className="h-4 w-4 mr-2"/> Export My Data</GhostButton>
          <GhostButton onClick={() => setDeleteModalOpen(true)} className="w-full sm:w-auto text-rose-400 border-rose-400/30 hover:bg-rose-400/10">Delete Account</GhostButton>
          <div className="w-full sm:w-auto sm:ml-auto">
            <GhostButton onClick={logout} className="w-full sm:w-auto"><LogOut className="h-4 w-4 mr-2"/> Logout</GhostButton>
          </div>
        </div>
      </SettingsSection>

      {/* Delete Account Modal */}
      <Modal 
        isOpen={deleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Account"
        actionButton={<GhostButton className="bg-rose-500/20 text-rose-400 border-rose-500/30 hover:bg-rose-500 hover:text-white" size="sm">Confirm Deletion</GhostButton>}
      >
        <div className="space-y-4">
          <p className="text-sm text-ink/80">
            Are you sure you want to delete your Luxora account? This action is <strong className="text-rose-400">permanent and cannot be undone</strong>.
          </p>
          <p className="text-sm text-ink/80">
            All your saved properties, offers, messages, and viewing requests will be permanently erased.
          </p>
        </div>
      </Modal>
    </SettingsLayout>
  );
}

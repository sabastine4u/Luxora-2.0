import { Modal } from '../../../components/ui/Modal';
import { UserCircle, Mail, Phone, Calendar, ShieldCheck, Clock, Key, Power, Ban, FileText, MessageSquare, Building2, TrendingUp, CheckCircle } from 'lucide-react';
import { GhostButton, GoldButton } from '../../../components/ui/ui';

export interface UserDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: Record<string, unknown> | null;
}

export function UserDetailModal({ isOpen, onClose, user }: UserDetailModalProps) {
  if (!user) return null;

  const mockListings = [
    { id: 1, title: 'Skyline Penthouse', status: 'Active' },
    { id: 2, title: 'Banana Island Plot', status: 'Pending Review' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="User Details"
      size="4xl"
      actionButton={
        <div className="flex gap-2">
          <GhostButton size="sm" className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10">
            <Power className="h-4 w-4 mr-2" /> Activate
          </GhostButton>
          <GhostButton size="sm" className="text-amber-400 hover:text-amber-300 hover:bg-amber-400/10">
            <Key className="h-4 w-4 mr-2" /> Reset Password
          </GhostButton>
          <GoldButton size="sm" className="bg-rose-500 hover:bg-rose-400 text-white">
            <Ban className="h-4 w-4 mr-2" /> Suspend
          </GoldButton>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Profile & Stats */}
        <div className="space-y-6">
          <div className="flex flex-col items-center text-center p-6 bg-navy-900/50 rounded-2xl border border-white/10 relative">
            <div className="h-20 w-20 rounded-full bg-navy-800 border border-white/5 flex items-center justify-center mb-4 relative">
              <UserCircle className="h-10 w-10 text-ink/40" />
              <div className="absolute -bottom-1 -right-1 bg-gold-400 text-navy-900 rounded-full p-1 shadow-lg" title="Verified User">
                <ShieldCheck className="h-3 w-3" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-cream">{String(user.name || 'Unknown')}</h3>
            <span className="bg-gold-400/20 text-gold-400 text-[10px] px-2 py-0.5 rounded-full font-semibold tracking-wide uppercase mt-2 border border-gold-400/30">
              {String(user.role || 'User')}
            </span>
            <div className="flex flex-col gap-2 mt-4 text-sm text-ink/60 w-full text-left bg-white/5 p-3 rounded-xl border border-white/5">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" /> {String(user.email || 'No email provided')}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" /> {String(user.phone || '+234 800 000 0000')}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 shrink-0" /> Joined {String(user.joined || 'Unknown')}
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-cream mb-3">Verification Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between bg-white/5 p-2 rounded-lg border border-white/5">
                <span className="text-ink/60">Phone Verification</span>
                <CheckCircle className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="flex items-center justify-between bg-white/5 p-2 rounded-lg border border-white/5">
                <span className="text-ink/60">Email Verification</span>
                <CheckCircle className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="flex items-center justify-between bg-white/5 p-2 rounded-lg border border-white/5">
                <span className="text-ink/60">Government ID</span>
                <CheckCircle className="h-4 w-4 text-emerald-400" />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-cream mb-3">Activity Statistics</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-navy-900/50 p-4 rounded-xl border border-white/10 text-center">
                <div className="text-2xl font-bold text-cream">12</div>
                <div className="text-[10px] text-ink/50 uppercase tracking-wider mt-1">Properties</div>
              </div>
              <div className="bg-navy-900/50 p-4 rounded-xl border border-white/10 text-center">
                <div className="text-2xl font-bold text-gold-400">4</div>
                <div className="text-[10px] text-ink/50 uppercase tracking-wider mt-1">Active Listings</div>
              </div>
              <div className="col-span-2 bg-navy-900/50 p-4 rounded-xl border border-white/10 text-center flex items-center justify-between">
                <div className="text-left">
                  <div className="text-[10px] text-ink/50 uppercase tracking-wider">Account Status</div>
                  <div className="font-semibold text-emerald-400">{String(user.status || 'Active')}</div>
                </div>
                <TrendingUp className="h-6 w-6 text-emerald-400/50" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Timelines & Listings */}
        <div className="lg:col-span-2 space-y-6 lg:border-l lg:border-white/10 lg:pl-8">
          
          <div>
            <h4 className="text-sm font-semibold text-cream mb-3 flex items-center justify-between">
              Assigned Properties & Listings
              <GhostButton size="sm" className="text-xs px-2 py-1">View All</GhostButton>
            </h4>
            <div className="space-y-3">
              {mockListings.map(listing => (
                <div key={listing.id} className="flex items-center justify-between bg-navy-900/50 p-3 rounded-xl border border-white/10">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-8 w-8 text-gold-400/50 bg-gold-400/10 p-1.5 rounded-lg" />
                    <div>
                      <div className="text-sm font-semibold text-cream">{listing.title}</div>
                      <div className="text-xs text-ink/50 mt-0.5">Lagos, Nigeria</div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-1 rounded-full border ${
                    listing.status === 'Active' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
                  }`}>
                    {listing.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-white/10">
            <h4 className="text-sm font-semibold text-cream mb-4">Account Timeline</h4>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="h-2 w-2 rounded-full bg-emerald-400" />
                  <div className="h-full w-px bg-white/10 mt-1" />
                </div>
                <div className="pb-3 text-sm">
                  <div className="text-cream font-medium">Logged in from new device</div>
                  <div className="text-ink/60 mt-0.5">IP: 192.168.1.5 (Lagos, NG)</div>
                  <div className="text-ink/50 text-xs flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3" /> 2 hours ago
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="h-2 w-2 rounded-full bg-gold-400" />
                  <div className="h-full w-px bg-transparent mt-1" />
                </div>
                <div className="pb-3 text-sm">
                  <div className="text-cream font-medium">Completed ID Verification</div>
                  <div className="text-ink/50 text-xs flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3" /> 1 day ago
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10">
            <h4 className="text-sm font-semibold text-cream mb-4 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-blue-400" />
              Communication History
            </h4>
            <div className="flex flex-col items-center justify-center p-8 bg-navy-900/50 rounded-2xl border border-white/10 text-center">
              <FileText className="h-8 w-8 text-ink/20 mb-3" />
              <div className="text-sm font-semibold text-cream">No recent messages</div>
              <div className="text-xs text-ink/50 mt-1">Platform notifications and support tickets will appear here.</div>
            </div>
          </div>

        </div>
      </div>
    </Modal>
  );
}

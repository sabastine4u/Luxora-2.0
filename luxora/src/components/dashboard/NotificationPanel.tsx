import { X, Bell, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

export interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockNotifications = [
  {
    id: 1,
    title: 'New Property Verification',
    message: 'A new luxury villa in Eko Atlantic is pending verification.',
    time: '5 mins ago',
    icon: <CheckCircle2 className="h-5 w-5 text-emerald-400" />,
    read: false,
  },
  {
    id: 2,
    title: 'Subscription Expiring',
    message: 'Agency Prime Properties subscription expires in 3 days.',
    time: '2 hours ago',
    icon: <AlertTriangle className="h-5 w-5 text-amber-400" />,
    read: false,
  },
  {
    id: 3,
    title: 'System Update',
    message: 'Platform maintenance scheduled for tomorrow 2 AM UTC.',
    time: '1 day ago',
    icon: <Clock className="h-5 w-5 text-blue-400" />,
    read: true,
  },
];

export default function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-40 bg-navy-950/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm transform overflow-y-auto bg-navy-900 border-l border-white/10 shadow-2xl transition-transform duration-300">
        
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-6">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-gold-400" />
            <h2 className="font-heading text-lg font-bold text-cream">Notifications</h2>
          </div>
          <button 
            onClick={onClose}
            className="rounded-full p-2 text-ink/60 transition-colors hover:bg-white/5 hover:text-cream"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-2">
          {mockNotifications.map((notif) => (
            <div 
              key={notif.id}
              className={`flex items-start gap-4 rounded-xl p-4 transition-colors ${
                notif.read ? 'bg-transparent hover:bg-white/5' : 'bg-white/5 border border-white/10'
              }`}
            >
              <div className="mt-1 shrink-0">
                {notif.icon}
              </div>
              <div className="flex-1 space-y-1">
                <p className={`text-sm font-semibold ${notif.read ? 'text-cream/70' : 'text-cream'}`}>
                  {notif.title}
                </p>
                <p className="text-xs text-ink/70 leading-relaxed">
                  {notif.message}
                </p>
                <p className="text-[10px] font-medium text-ink/40">
                  {notif.time}
                </p>
              </div>
              {!notif.read && (
                <span className="mt-2 h-2 w-2 rounded-full bg-gold-400 shrink-0" />
              )}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-white/10">
          <button className="w-full rounded-lg py-2 text-sm font-medium text-gold-400 transition-colors hover:bg-gold-400/10">
            Mark all as read
          </button>
        </div>

      </div>
    </>
  );
}

import { Archive, Bell, Briefcase, Check, CheckCircle2, MessageSquare, X } from 'lucide-react';
import { useSession } from '../../contexts/SessionContext';
import type { Notification } from '../../types';

export interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const getNotificationIcon = (notification: Notification) => {
  if (notification.category === 'communication' || notification.type === 'message_received') return <MessageSquare className="h-5 w-5 text-blue-400" />;
  if (notification.category === 'workflow') return <Briefcase className="h-5 w-5 text-gold-400" />;
  if (notification.category === 'property') return <CheckCircle2 className="h-5 w-5 text-emerald-400" />;
  return <Bell className="h-5 w-5 text-ink/60" />;
};

const formatNotificationTime = (createdAt: string) => new Intl.DateTimeFormat('en-NG', {
  dateStyle: 'medium',
  timeStyle: 'short',
}).format(new Date(createdAt));

export default function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const { notifications, isNotificationsLoading, notificationError, markNotificationRead, markAllNotificationsRead, archiveNotification } = useSession();
  const activeNotifications = notifications.filter((notification) => notification.archivedAt === null);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-navy-950/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm transform overflow-y-auto border-l border-white/10 bg-navy-900 shadow-2xl transition-transform duration-300">
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-6">
          <div className="flex items-center gap-2"><Bell className="h-5 w-5 text-gold-400" /><h2 className="font-heading text-lg font-bold text-cream">Notifications</h2></div>
          <button onClick={onClose} className="rounded-full p-2 text-ink/60 transition-colors hover:bg-white/5 hover:text-cream"><X className="h-5 w-5" /></button>
        </div>

        <div className="space-y-2 p-4">
          {isNotificationsLoading && <p className="py-8 text-center text-sm text-ink/60">Loading notifications...</p>}
          {notificationError && <p role="alert" className="rounded-xl border border-rose-400/30 bg-rose-400/10 p-3 text-sm text-rose-200">{notificationError}</p>}
          {!isNotificationsLoading && !notificationError && activeNotifications.length === 0 && (
            <div className="py-10 text-center text-sm text-ink/60"><CheckCircle2 className="mx-auto mb-3 h-8 w-8 text-gold-400" />You're all caught up.</div>
          )}
          {activeNotifications.map((notification) => {
            const unread = notification.readAt === null;
            return (
              <div key={notification.id} className={`group flex items-start gap-4 rounded-xl p-4 transition-colors ${unread ? 'border border-white/10 bg-white/5' : 'bg-transparent hover:bg-white/5'}`}>
                <div className="mt-1 shrink-0">{getNotificationIcon(notification)}</div>
                <div className="flex-1 space-y-1"><p className={`text-sm font-semibold ${unread ? 'text-cream' : 'text-cream/70'}`}>{notification.title}</p><p className="text-xs leading-relaxed text-ink/70">{notification.body}</p><p className="text-[10px] font-medium text-ink/40">{formatNotificationTime(notification.createdAt)}</p></div>
                <div className="flex shrink-0 items-center gap-1">
                  {unread && <button onClick={() => void markNotificationRead(notification.id)} className="rounded p-1 text-gold-400 hover:bg-white/10" title="Mark as read"><Check className="h-4 w-4" /></button>}
                  <button onClick={() => void archiveNotification(notification.id)} className="rounded p-1 text-ink/50 hover:bg-white/10 hover:text-gold-400" title="Archive notification"><Archive className="h-4 w-4" /></button>
                  {unread && <span className="h-2 w-2 rounded-full bg-gold-400" />}
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-white/10 p-4"><button onClick={() => void markAllNotificationsRead()} className="w-full rounded-lg py-2 text-sm font-medium text-gold-400 transition-colors hover:bg-gold-400/10">Mark all as read</button></div>
      </div>
    </>
  );
}

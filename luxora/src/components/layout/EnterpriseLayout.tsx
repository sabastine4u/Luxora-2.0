import { useState, type ReactNode } from 'react';
import Topbar from '../dashboard/Topbar';
import NotificationPanel from '../dashboard/NotificationPanel';

export interface EnterpriseLayoutProps {
  children: ReactNode;
  activeTab: string;
}

export function EnterpriseLayout({ children, activeTab }: EnterpriseLayoutProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-navy-900 font-sans text-ink selection:bg-gold-400/30 selection:text-gold-100">
      
      <div className="flex min-h-screen flex-col">
        <Topbar
          title={activeTab}
          onMenu={() => {}} // No sidebar in Enterprise Layout
          onToggleNotifications={() => setNotificationsOpen(true)}
        />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>

      <NotificationPanel 
        isOpen={notificationsOpen} 
        onClose={() => setNotificationsOpen(false)} 
      />
    </div>
  );
}

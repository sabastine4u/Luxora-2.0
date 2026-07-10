import { useState, type ReactNode } from 'react';
import Sidebar from '../dashboard/Sidebar';
import Topbar from '../dashboard/Topbar';
import NotificationPanel from '../dashboard/NotificationPanel';
import { FloatingCompareBar } from '../property/FloatingCompareBar';

export interface DashboardLayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange?: (tab: string) => void;
}

export function DashboardLayout({ children, activeTab, onTabChange }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-navy-900 font-sans text-ink selection:bg-gold-400/30 selection:text-gold-100">
      
      <Sidebar
        active={activeTab}
        onSelect={(label) => { 
          if (onTabChange) onTabChange(label);
          setSidebarOpen(false); 
        }}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-h-screen flex-col lg:pl-72">
        <Topbar
          title={activeTab}
          onMenu={() => setSidebarOpen(true)}
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
      <FloatingCompareBar />
    </div>
  );
}

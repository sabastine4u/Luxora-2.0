import type { ReactNode } from 'react';
import { DashboardLayout } from './DashboardLayout';
import { EnterpriseUIProvider } from '../../contexts/EnterpriseUIContext';

export interface EnterpriseLayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange?: (tab: string) => void;
}

export function EnterpriseLayout({ children, activeTab, onTabChange }: EnterpriseLayoutProps) {
  return (
    <EnterpriseUIProvider>
      <DashboardLayout activeTab={activeTab} onTabChange={onTabChange}>
        <div className="enterprise-page-container flex-1 rounded-tl-2xl border-t border-l border-white/5 shadow-2xl overflow-hidden">
          {children}
        </div>
      </DashboardLayout>
    </EnterpriseUIProvider>
  );
}

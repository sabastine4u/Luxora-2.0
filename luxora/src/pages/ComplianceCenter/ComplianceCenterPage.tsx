import { DashboardHeader } from '../../components/dashboard/shared/headers/DashboardHeader';
import { LeftNavigation } from './components/LeftNavigation';
import { useComplianceCenter } from './hooks/useComplianceCenter';
import { ComplianceDashboard } from './components/ComplianceDashboard';
import { ComplianceCenter } from './components/ComplianceCenter';
import { RiskManagementCenter } from './components/RiskManagementCenter';
import { AuditCenter } from './components/AuditCenter';
import { InspectionCenter } from './components/InspectionCenter';
import { LicenseCenter } from './components/LicenseCenter';
import { KYCCenter } from './components/KYCCenter';
import { IncidentCenter } from './components/IncidentCenter';
import { ComplianceAnalytics } from './components/ComplianceAnalytics';
import { ExecutiveInsights } from './components/ExecutiveInsights';

export default function ComplianceCenterPage() {
  const { activeWorkspace } = useComplianceCenter();

  const renderWorkspace = () => {
    switch (activeWorkspace) {
      case 'dashboard': return <ComplianceDashboard />;
      case 'compliance': return <ComplianceCenter />;
      case 'risk': return <RiskManagementCenter />;
      case 'audits': return <AuditCenter />;
      case 'inspections': return <InspectionCenter />;
      case 'licenses': return <LicenseCenter />;
      case 'kyc': return <KYCCenter />;
      case 'incidents': return <IncidentCenter />;
      case 'analytics': return <ComplianceAnalytics />;
      case 'executive': return <ExecutiveInsights />;
      default: return <ComplianceDashboard />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-ink-dark overflow-hidden">
      <div className="p-6 pb-2 shrink-0 border-b border-gray-200 dark:border-ink-light bg-white dark:bg-ink">
        <DashboardHeader 
          name="Enterprise Compliance & Risk Management" 
          subtitle="Centralized governance, audit, legal, and risk intelligence engine." 
        />
      </div>

      <div className="flex-1 flex overflow-hidden">
        <LeftNavigation />
        
        <main className="flex-1 relative overflow-hidden flex flex-col">
          {renderWorkspace()}
        </main>
      </div>
    </div>
  );
}

import { DashboardHeader } from '../../components/dashboard/shared/headers/DashboardHeader';
import { LeftNavigation } from './components/LeftNavigation';
import { useHRCenter } from './hooks/useHRCenter';
import { HRDashboard } from './components/HRDashboard';
import { EmployeeDirectory } from './components/EmployeeDirectory';
import { RecruitmentCenter } from './components/RecruitmentCenter';
import { AttendanceCenter } from './components/AttendanceCenter';
import { LeaveManagement } from './components/LeaveManagement';
import { PerformanceCenter } from './components/PerformanceCenter';
import { PayrollCenter } from './components/PayrollCenter';
import { TrainingCenter } from './components/TrainingCenter';
import { OrganizationChart } from './components/OrganizationChart';
import { AssetAssignmentCenter } from './components/AssetAssignmentCenter';
import { RecognitionCenter } from './components/RecognitionCenter';
import { WorkforceAnalytics } from './components/WorkforceAnalytics';
import { ExecutiveInsights } from './components/ExecutiveInsights';

export default function HRCenterPage() {
  const { activeWorkspace } = useHRCenter();

  const renderWorkspace = () => {
    switch (activeWorkspace) {
      case 'dashboard': return <HRDashboard />;
      case 'directory': return <EmployeeDirectory />;
      case 'recruitment': return <RecruitmentCenter />;
      case 'attendance': return <AttendanceCenter />;
      case 'leave': return <LeaveManagement />;
      case 'performance': return <PerformanceCenter />;
      case 'payroll': return <PayrollCenter />;
      case 'training': return <TrainingCenter />;
      case 'orgchart': return <OrganizationChart />;
      case 'assets': return <AssetAssignmentCenter />;
      case 'recognition': return <RecognitionCenter />;
      case 'analytics': return <WorkforceAnalytics />;
      case 'executive': return <ExecutiveInsights />;
      default: return <HRDashboard />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-ink-dark overflow-hidden">
      <div className="p-6 pb-2 shrink-0 border-b border-gray-200 dark:border-ink-light bg-white dark:bg-ink">
        <DashboardHeader 
          name="Enterprise Human Resources" 
          subtitle="Workforce management, recruitment, attendance, performance, and organizational intelligence." 
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

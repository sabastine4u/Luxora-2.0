import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { HRDashboard } from './components/HRDashboard';

export default function HRCenterPage() {
  return (
    <DashboardLayout activeTab="HR Center">
      <HRDashboard />
    </DashboardLayout>
  );
}

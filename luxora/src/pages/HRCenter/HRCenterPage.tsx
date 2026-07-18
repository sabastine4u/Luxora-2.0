import { EnterpriseLayout } from '../../components/layout/EnterpriseLayout';
import { HRDashboard } from './components/HRDashboard';

export default function HRCenterPage() {
  return (
    <EnterpriseLayout activeTab="HR Center">
      <HRDashboard />
    </EnterpriseLayout>
  );
}

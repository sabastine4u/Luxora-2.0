import { useState } from 'react';
import { ArrowLeft, Handshake, ShoppingCart, FileText, CreditCard, FileBox, Activity, Clock } from 'lucide-react';
import { GoldButton, GhostButton } from '../../../../components/ui/ui';
import { useWorkflowToast } from '../../utils/workflowUtils';
import { ProfileTab } from './tabs/ProfileTab';

interface VendorDetailsProps {
  vendorId?: string | null;
  onBack?: () => void;
}

export default function VendorDetails({ vendorId, onBack }: VendorDetailsProps) {
  const { showWorkflowToast } = useWorkflowToast();
  const [activeTab, setActiveTab] = useState('Profile');
  const displayId = vendorId || 'VND-001';
  
  const tabs = [
    { id: 'Profile', label: 'Profile', icon: <UserIcon /> },
    { id: 'Contracts', label: 'Contracts', icon: <Handshake className="h-4 w-4" /> },
    { id: 'PurchaseOrders', label: 'Purchase Orders', icon: <ShoppingCart className="h-4 w-4" /> },
    { id: 'Invoices', label: 'Invoices', icon: <FileText className="h-4 w-4" /> },
    { id: 'Payments', label: 'Payments', icon: <CreditCard className="h-4 w-4" /> },
    { id: 'Documents', label: 'Documents', icon: <FileBox className="h-4 w-4" /> },
    { id: 'Performance', label: 'Performance', icon: <Activity className="h-4 w-4" /> },
    { id: 'Activity', label: 'Activity Timeline', icon: <Clock className="h-4 w-4" /> },
  ];

  const handleAction = (actionName: string) => {
    showWorkflowToast(actionName);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Profile':
        return <ProfileTab vendorId={displayId} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center p-12 border border-white/10 rounded-2xl bg-navy-800/30 text-center">
            <h3 className="font-heading text-xl text-cream mb-2">{tabs.find(t => t.id === activeTab)?.label}</h3>
            <p className="text-ink/60 mb-6">This section will be populated with data during backend integration.</p>
            <GoldButton onClick={() => handleAction('Sync Data')}>Refresh Data</GoldButton>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button 
            onClick={onBack}
            className="mb-2 flex items-center text-sm text-ink/60 transition-colors hover:text-cream"
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Directory
          </button>
          <h2 className="font-heading text-2xl font-bold text-cream">Vendor Details: <span className="text-gold-400">Vendor {displayId}</span></h2>
          <p className="text-sm text-ink/60">ID: {displayId} • Category: IT Hardware</p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <GhostButton onClick={() => handleAction('Suspend Vendor')}>Suspend Vendor</GhostButton>
          <GoldButton onClick={() => handleAction('Edit Profile')}>Edit Profile</GoldButton>
        </div>
      </div>

      <div className="flex overflow-x-auto gap-2 pb-2 border-b border-white/10 hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
              activeTab === tab.id 
                ? 'border-gold-400 text-gold-400 bg-gold-400/10' 
                : 'border-transparent text-ink/60 hover:text-cream hover:bg-white/5'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="pt-2">
        {renderTabContent()}
      </div>
    </div>
  );
}

function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
  );
}

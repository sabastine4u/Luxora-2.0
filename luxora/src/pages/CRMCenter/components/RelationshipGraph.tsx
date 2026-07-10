import { Network, ArrowDown, UserCircle2, Building2, Wallet, FileText, Bell } from 'lucide-react';
import { useCRMCenter } from '../hooks/useCRMCenter';

export const RelationshipGraph = () => {
  const { selectedContact } = useCRMCenter();

  if (!selectedContact) return null;

  return (
    <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6">
      <div className="flex items-center mb-8">
        <Network className="w-5 h-5 mr-3 text-gold-500" />
        <h3 className="font-bold text-gray-900 dark:text-white">Enterprise Relationship Graph</h3>
      </div>
      
      <div className="flex flex-col items-center justify-center space-y-4 py-4">
        {/* Buyer Node */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-blue-50 border-4 border-blue-200 flex items-center justify-center text-blue-600 shadow-sm relative z-10">
            {selectedContact.avatar ? (
              <img src={selectedContact.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
            ) : (
              <UserCircle2 className="w-8 h-8" />
            )}
          </div>
          <div className="text-sm font-bold mt-2 text-gray-900 dark:text-white">{selectedContact.firstName} {selectedContact.lastName}</div>
          <div className="text-xs text-blue-600 font-medium px-2 py-0.5 bg-blue-50 rounded mt-1">{selectedContact.type}</div>
        </div>

        <ArrowDown className="w-5 h-5 text-gray-300" />

        {/* Organization / Agent Node */}
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-emerald-50 border-4 border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm relative z-10">
            <Building2 className="w-6 h-6" />
          </div>
          <div className="text-sm font-bold mt-2 text-gray-900 dark:text-white">Prime Estate Partners</div>
          <div className="text-xs text-emerald-600 font-medium px-2 py-0.5 bg-emerald-50 rounded mt-1">Assigned Agency</div>
        </div>

        <ArrowDown className="w-5 h-5 text-gray-300" />

        {/* Opportunity / Deal Node */}
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-gold-50 border-4 border-gold-200 flex items-center justify-center text-gold-600 shadow-sm relative z-10">
            <Wallet className="w-6 h-6" />
          </div>
          <div className="text-sm font-bold mt-2 text-gray-900 dark:text-white">Azure Penthouse Purchase</div>
          <div className="text-xs text-gold-600 font-medium px-2 py-0.5 bg-gold-50 rounded mt-1">Active Deal</div>
        </div>

        <div className="flex space-x-12 mt-4 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gray-300 -mt-6" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-px bg-gray-300 -mt-6" />
          <div className="absolute top-0 left-[calc(50%-6rem)] h-6 w-px bg-gray-300 -mt-6" />
          <div className="absolute top-0 left-[calc(50%+6rem)] h-6 w-px bg-gray-300 -mt-6" />

          {/* Document Branch */}
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center text-red-600 shadow-sm relative z-10">
              <FileText className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold mt-2 text-gray-900 dark:text-white">Contract V2</div>
          </div>

          {/* Workflow Branch */}
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-indigo-50 border-2 border-indigo-200 flex items-center justify-center text-indigo-600 shadow-sm relative z-10">
              <Network className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold mt-2 text-gray-900 dark:text-white">KYC Approval</div>
          </div>

          {/* Notification Branch */}
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-orange-50 border-2 border-orange-200 flex items-center justify-center text-orange-600 shadow-sm relative z-10">
              <Bell className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold mt-2 text-gray-900 dark:text-white">Alerts Sent</div>
          </div>
        </div>
      </div>
    </div>
  );
};

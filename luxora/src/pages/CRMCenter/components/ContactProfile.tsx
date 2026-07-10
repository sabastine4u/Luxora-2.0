import { useCRMCenter } from '../hooks/useCRMCenter';
import { Phone, MapPin, Building2, Tag, ShieldAlert, FileText, ChevronLeft, Briefcase, Activity } from 'lucide-react';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { formatMessageTime } from '../../CommunicationCenter/utils/formatter';
import { clsx } from 'clsx';
import { MOCK_ORGANIZATIONS, MOCK_CRM_TAGS } from '../data/mockData';

export const ContactProfile = () => {
  const { selectedContact, setActiveWorkspace } = useCRMCenter();

  if (!selectedContact) return null;

  const getInitials = () => `${selectedContact.firstName[0]}${selectedContact.lastName[0]}`;
  const organization = MOCK_ORGANIZATIONS.find(org => org.id === selectedContact.companyId);

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-gray-50 dark:bg-ink-dark">
      {/* Profile Header */}
      <div className="bg-white dark:bg-ink border-b border-gray-200 dark:border-ink-light pt-6 px-8 pb-0 shrink-0">
        <GhostButton 
          className="mb-4 text-xs font-semibold" 
          onClick={() => setActiveWorkspace('directory')}
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Directory
        </GhostButton>

        <div className="flex items-start justify-between pb-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              {selectedContact.avatar ? (
                <img src={selectedContact.avatar} alt={selectedContact.firstName} className="w-24 h-24 rounded-full object-cover shadow-sm border-4 border-white dark:border-ink" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-3xl shadow-sm border-4 border-white dark:border-ink">
                  {getInitials()}
                </div>
              )}
            </div>
            
            <div>
              <div className="flex items-center space-x-3 mb-1">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {selectedContact.firstName} {selectedContact.lastName}
                </h2>
                <span className="text-xs font-bold uppercase px-2 py-1 rounded border bg-emerald-50 text-emerald-700 border-emerald-200">
                  {selectedContact.status}
                </span>
                <span className="text-xs font-bold uppercase px-2 py-1 rounded bg-gray-100 dark:bg-ink-light text-gray-600 dark:text-gray-400">
                  {selectedContact.segment}
                </span>
              </div>
              
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 space-x-4 mt-2">
                <div className="flex items-center">
                  <Briefcase className="w-4 h-4 mr-1.5" />
                  {selectedContact.title || selectedContact.type}
                  {organization && <span className="ml-1 text-gold-600 dark:text-gold-400 font-medium">@ {organization.name}</span>}
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1.5" />
                  {selectedContact.address?.city || 'Lagos'}, {selectedContact.address?.country || 'Nigeria'}
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <GhostButton>Message</GhostButton>
            <GhostButton>Schedule Call</GhostButton>
            <GoldButton>Create Deal</GoldButton>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className="flex space-x-6 -mb-px">
          {['Overview', 'Activities', 'Deals', 'Documents', 'Notes'].map((tab, idx) => (
            <button
              key={tab}
              className={clsx(
                "pb-3 text-sm font-semibold transition-colors border-b-2",
                idx === 0 ? "border-gold-500 text-gold-600 dark:text-gold-400" : "border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 custom-scrollbar">
        {/* Left Column: Details & Contact Info */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <Phone className="w-4 h-4 mr-2 text-gold-500" /> Contact Information
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Email</span>
                <a href={`mailto:${selectedContact.email}`} className="font-medium text-blue-600 dark:text-blue-400 hover:underline">{selectedContact.email}</a>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Phone</span>
                <a href={`tel:${selectedContact.phone}`} className="font-medium text-gray-900 dark:text-white">{selectedContact.phone}</a>
              </div>
              {organization && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Company</span>
                  <span className="font-medium text-gray-900 dark:text-white flex items-center">
                    <Building2 className="w-3.5 h-3.5 mr-1 text-gray-400" /> {organization.name}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <ShieldAlert className="w-4 h-4 mr-2 text-gold-500" /> CRM Intelligence
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Relationship Stage</span>
                <span className="font-medium text-gray-900 dark:text-white px-2 py-0.5 bg-gray-100 dark:bg-ink-light rounded">{selectedContact.stage}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Relationship Health</span>
                <div className="flex items-center space-x-2">
                  <div className={clsx("w-2 h-2 rounded-full", selectedContact.health === 'Healthy' ? 'bg-emerald-500' : 'bg-yellow-500')} />
                  <span className="font-medium text-gray-900 dark:text-white">{selectedContact.health}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Priority Level</span>
                <span className={clsx("font-medium", selectedContact.priority === 'High' ? 'text-red-500' : 'text-gray-900 dark:text-white')}>
                  {selectedContact.priority}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Last Active</span>
                <span className="font-medium text-gray-900 dark:text-white flex items-center">
                  <Activity className="w-3 h-3 mr-1" /> {formatMessageTime(selectedContact.lastActivityAt)}
                </span>
              </div>
            </div>
          </div>

          {selectedContact.tags.length > 0 && (
            <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Tag className="w-4 h-4 mr-2 text-gold-500" /> Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedContact.tags.map(tagId => {
                  const tagInfo = MOCK_CRM_TAGS.find(t => t.id === tagId);
                  return tagInfo ? (
                    <span key={tagId} className={clsx("text-xs font-bold px-2.5 py-1 rounded-full", tagInfo.color)}>
                      {tagInfo.name}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Timeline & Widgets */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6 h-96 flex flex-col items-center justify-center">
            <FileText className="w-12 h-12 text-gray-300 mb-4" />
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Detailed Enterprise Summary</h3>
            <p className="text-gray-500 text-sm max-w-md text-center">
              Customer 360 overview, related properties, active deals, and recent documents will render here.
            </p>
            <GoldButton className="mt-6" onClick={() => setActiveWorkspace('customer360')}>View Customer 360 Workspace</GoldButton>
          </div>
        </div>
      </div>
    </div>
  );
};

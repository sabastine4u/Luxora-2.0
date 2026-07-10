import { useCRMCenter } from '../hooks/useCRMCenter';
import { ContactCard } from './ContactCard';
import type { Contact } from '../types/crmTypes';
import { Users, Filter } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';

export const ContactDirectory = () => {
  const { filteredContacts, viewMode, setSelectedContactId, setActiveWorkspace } = useCRMCenter();

  const handleContactClick = (contact: Contact) => {
    setSelectedContactId(contact.id);
    setActiveWorkspace('profile');
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-ink-dark">
      <div className="p-6 pb-4 shrink-0 flex items-center justify-between bg-white dark:bg-ink border-b border-gray-200 dark:border-ink-light">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <Users className="w-5 h-5 mr-3 text-gold-500" />
            Contact Directory
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {filteredContacts.length} {filteredContacts.length === 1 ? 'contact' : 'contacts'} found.
          </p>
        </div>
        <GhostButton size="sm">
          <Filter className="w-4 h-4 mr-2" /> Sort & Group
        </GhostButton>
      </div>

      <div className={`flex-1 overflow-y-auto p-6 custom-scrollbar ${viewMode === 'grid' ? '' : 'bg-white dark:bg-ink'}`}>
        {filteredContacts.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-ink-light rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No Contacts Found</h3>
            <p className="text-sm text-gray-500 max-w-sm">Try adjusting your search query or filters to find the contact you're looking for.</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'flex flex-col'}>
            {filteredContacts.map(contact => (
              <ContactCard key={contact.id} contact={contact} onClick={handleContactClick} viewMode={viewMode} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

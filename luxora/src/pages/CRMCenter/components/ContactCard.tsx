import { Mail, Phone, Building2, MoreVertical } from 'lucide-react';
import type { Contact } from '../types/crmTypes';
import { clsx } from 'clsx';
import { GhostButton } from '../../../components/ui/ui';

interface ContactCardProps {
  contact: Contact;
  onClick: (contact: Contact) => void;
  viewMode: 'grid' | 'list';
}

export const ContactCard = ({ contact, onClick, viewMode }: ContactCardProps) => {
  const getInitials = () => `${contact.firstName[0]}${contact.lastName[0]}`;

  const getStatusColor = () => {
    switch (contact.status) {
      case 'Active': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Inactive': return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'Pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Archived': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Blocked': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getHealthColor = () => {
    switch (contact.health) {
      case 'Healthy': return 'bg-emerald-500';
      case 'Needs Follow-up': return 'bg-yellow-500';
      case 'High Risk': return 'bg-red-500';
      case 'Dormant': return 'bg-gray-400';
      case 'Lost Contact': return 'bg-black';
      default: return 'bg-gray-300';
    }
  };

  if (viewMode === 'list') {
    return (
      <div 
        onClick={() => onClick(contact)}
        className="flex items-center justify-between p-4 bg-white dark:bg-ink border-b border-gray-100 dark:border-ink-light hover:bg-gray-50 dark:hover:bg-ink-light/50 cursor-pointer transition-colors group"
      >
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <div className="relative">
            {contact.avatar ? (
              <img src={contact.avatar} alt={contact.firstName} className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                {getInitials()}
              </div>
            )}
            <div className={clsx("absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-ink", getHealthColor())} title={`Health: ${contact.health}`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm text-gray-900 dark:text-white truncate">
              {contact.firstName} {contact.lastName}
            </h4>
            <div className="flex items-center text-xs text-gray-500 space-x-2 mt-0.5">
              <span className="font-medium text-gold-600 dark:text-gold-400">{contact.type}</span>
              {contact.title && (
                <>
                  <span>•</span>
                  <span className="truncate">{contact.title}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-6 flex-1 min-w-0 justify-end pr-4 text-xs text-gray-500">
          <div className="flex items-center space-x-1.5 truncate">
            <Mail className="w-3.5 h-3.5" />
            <span className="truncate">{contact.email}</span>
          </div>
          <div className="flex items-center space-x-1.5 whitespace-nowrap">
            <Phone className="w-3.5 h-3.5" />
            <span>{contact.phone}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 shrink-0">
          <span className={clsx("text-[10px] font-bold uppercase px-2 py-0.5 rounded border", getStatusColor())}>
            {contact.status}
          </span>
          <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div 
      onClick={() => onClick(contact)}
      className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-5 hover:shadow-md hover:border-gold-500/50 transition-all cursor-pointer group flex flex-col h-full relative"
    >
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <GhostButton size="sm" className="bg-white/90 dark:bg-ink/90 backdrop-blur-sm shadow-sm h-8 w-8 p-0 flex items-center justify-center rounded-full">
          <MoreVertical className="w-4 h-4" />
        </GhostButton>
      </div>

      <div className="flex flex-col items-center mb-4 text-center">
        <div className="relative mb-3">
          {contact.avatar ? (
            <img src={contact.avatar} alt={contact.firstName} className="w-16 h-16 rounded-full object-cover shadow-sm border-2 border-white dark:border-ink" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl shadow-sm border-2 border-white dark:border-ink">
              {getInitials()}
            </div>
          )}
          <div className={clsx("absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white dark:border-ink", getHealthColor())} title={`Health: ${contact.health}`} />
        </div>
        <h4 className="font-bold text-gray-900 dark:text-white">
          {contact.firstName} {contact.lastName}
        </h4>
        <div className="text-xs text-gold-600 dark:text-gold-400 font-semibold mt-1">
          {contact.type}
        </div>
        {contact.title && (
          <div className="text-xs text-gray-500 mt-1 flex items-center justify-center">
            <Building2 className="w-3 h-3 mr-1" /> {contact.title}
          </div>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
          <Mail className="w-3.5 h-3.5 mr-2 text-gray-400" />
          <span className="truncate">{contact.email}</span>
        </div>
        <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
          <Phone className="w-3.5 h-3.5 mr-2 text-gray-400" />
          <span>{contact.phone}</span>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-ink-light flex items-center justify-between">
        <span className={clsx("text-[10px] font-bold uppercase px-2 py-0.5 rounded border", getStatusColor())}>
          {contact.status}
        </span>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-gray-100 dark:bg-ink-light text-gray-600 dark:text-gray-400">
          {contact.segment}
        </span>
      </div>
    </div>
  );
};

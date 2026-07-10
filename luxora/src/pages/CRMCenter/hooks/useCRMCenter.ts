import { useState, useMemo } from 'react';
import type { Contact, Organization, CRMActivity, Note, FollowUp, Opportunity } from '../types/crmTypes';
import type { CRMWorkspace } from '../constants/crmConstants';
import { MOCK_CONTACTS, MOCK_ORGANIZATIONS, MOCK_CRM_ACTIVITIES, MOCK_CRM_NOTES, MOCK_CRM_OPPORTUNITIES, MOCK_CRM_FOLLOWUPS } from '../data/mockData';

export const useCRMCenter = () => {
  const [activeWorkspace, setActiveWorkspace] = useState<CRMWorkspace>('dashboard');
  const [contacts] = useState<Contact[]>(MOCK_CONTACTS);
  const [organizations] = useState<Organization[]>(MOCK_ORGANIZATIONS);
  const [activities] = useState<CRMActivity[]>(MOCK_CRM_ACTIVITIES);
  const [notes] = useState<Note[]>(MOCK_CRM_NOTES);
  const [opportunities] = useState<Opportunity[]>(MOCK_CRM_OPPORTUNITIES);
  const [followUps] = useState<FollowUp[]>(MOCK_CRM_FOLLOWUPS);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const selectedContact = useMemo(() => 
    contacts.find(c => c.id === selectedContactId) || null
  , [contacts, selectedContactId]);

  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          contact.firstName.toLowerCase().includes(query) ||
          contact.lastName.toLowerCase().includes(query) ||
          contact.email.toLowerCase().includes(query) ||
          contact.companyId?.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [contacts, searchQuery]);

  // Derived Metrics
  const metrics = useMemo(() => {
    return {
      totalContacts: contacts.length,
      activeBuyers: contacts.filter(c => c.type === 'Buyer' && c.status === 'Active').length,
      activeOwners: contacts.filter(c => c.type === 'Owner' && c.status === 'Active').length,
      organizations: organizations.length,
      openLeads: contacts.filter(c => c.type === 'Lead' && c.status !== 'Archived').length,
      opportunities: opportunities.length,
      todaysFollowUps: followUps.filter(f => f.status === 'Pending').length, // Simplification
      pipelineValue: opportunities.reduce((acc, curr) => acc + curr.value, 0)
    };
  }, [contacts, organizations, opportunities, followUps]);

  return {
    activeWorkspace,
    setActiveWorkspace,
    contacts,
    organizations,
    activities,
    notes,
    opportunities,
    followUps,
    searchQuery,
    setSearchQuery,
    selectedContact,
    selectedContactId,
    setSelectedContactId,
    viewMode,
    setViewMode,
    filteredContacts,
    metrics
  };
};

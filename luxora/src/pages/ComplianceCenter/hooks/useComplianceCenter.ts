import { useState, useMemo } from 'react';
import type { ComplianceWorkspace } from '../constants/complianceConstants';
import { 
  mockComplianceRecords, 
  mockRisks, 
  mockAudits, 
  mockInspections, 
  mockLicenses, 
  mockKYCRecords, 
  mockIncidents 
} from '../data/mockData';

export const useComplianceCenter = () => {
  const [activeWorkspace, setActiveWorkspace] = useState<ComplianceWorkspace>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering Logic
  const filteredComplianceRecords = useMemo(() => {
    if (!searchQuery) return mockComplianceRecords;
    return mockComplianceRecords.filter(r => 
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      r.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const filteredRisks = useMemo(() => {
    if (!searchQuery) return mockRisks;
    return mockRisks.filter(r => 
      r.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const filteredAudits = useMemo(() => {
    if (!searchQuery) return mockAudits;
    return mockAudits.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  const filteredInspections = useMemo(() => {
    if (!searchQuery) return mockInspections;
    return mockInspections.filter(i => i.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  const filteredLicenses = useMemo(() => {
    if (!searchQuery) return mockLicenses;
    return mockLicenses.filter(l => l.title.toLowerCase().includes(searchQuery.toLowerCase()) || l.holderName.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  const filteredKYC = useMemo(() => {
    if (!searchQuery) return mockKYCRecords;
    return mockKYCRecords.filter(k => k.entityName.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  const filteredIncidents = useMemo(() => {
    if (!searchQuery) return mockIncidents;
    return mockIncidents.filter(i => i.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  // Analytics KPIs
  const complianceScore = 88; // Derived metric
  const openRisksCount = mockRisks.filter(r => r.status !== 'Mitigated' && r.status !== 'Accepted').length;
  const pendingAuditsCount = mockAudits.filter(a => a.status === 'Scheduled' || a.status === 'In Progress').length;
  const expiredLicensesCount = mockLicenses.filter(l => l.status === 'Expired').length;
  const highRiskCount = mockRisks.filter(r => r.level === 'High' || r.level === 'Critical').length;
  
  return {
    activeWorkspace,
    setActiveWorkspace,
    searchQuery,
    setSearchQuery,
    
    // Data
    complianceRecords: filteredComplianceRecords,
    risks: filteredRisks,
    audits: filteredAudits,
    inspections: filteredInspections,
    licenses: filteredLicenses,
    kycRecords: filteredKYC,
    incidents: filteredIncidents,

    // KPIs
    complianceScore,
    openRisksCount,
    pendingAuditsCount,
    expiredLicensesCount,
    highRiskCount
  };
};

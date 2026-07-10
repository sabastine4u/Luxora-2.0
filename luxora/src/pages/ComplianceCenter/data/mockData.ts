import type { 
  ComplianceRecord, 
  RiskAssessment, 
  Audit, 
  Inspection, 
  License, 
  KYCRecord, 
  Incident 
} from '../types/complianceTypes';

export const mockComplianceRecords: ComplianceRecord[] = [
  { id: 'CR-1001', type: 'Property', title: 'Fire Safety Certificate - Eko Tower', status: 'Compliant', deadline: '2027-01-15', ownerId: 'U-01', department: 'Facilities', priority: 'High', description: 'Annual fire safety check.', lastUpdated: '2026-06-10' },
  { id: 'CR-1002', type: 'Agent', title: 'Real Estate License Renewal - John Doe', status: 'Pending Review', deadline: '2026-08-01', ownerId: 'U-02', department: 'HR', priority: 'Medium', description: 'License expiration approaching.', lastUpdated: '2026-07-01' },
  { id: 'CR-1003', type: 'Financial', title: 'Q2 2026 Tax Filing', status: 'Non-Compliant', deadline: '2026-07-05', ownerId: 'U-03', department: 'Finance', priority: 'Urgent', description: 'Filing missed, penalty warning.', lastUpdated: '2026-07-06' },
  { id: 'CR-1004', type: 'Vendor', title: 'Data Privacy Agreement - TechCorp', status: 'At Risk', deadline: '2026-07-15', ownerId: 'U-04', department: 'Legal', priority: 'High', description: 'DPA unsigned.', lastUpdated: '2026-07-08' },
];

export const mockRisks: RiskAssessment[] = [
  { id: 'RSK-201', category: 'Operational', level: 'High', score: 85, title: 'Uninsured Property Risk', description: '3 properties in Lekki Phase 1 have expired insurance.', mitigationPlan: 'Renew insurance policies immediately.', ownerId: 'U-05', status: 'Escalated' },
  { id: 'RSK-202', category: 'Financial', level: 'Medium', score: 55, title: 'Currency Fluctuation', description: 'Exposure to NGN depreciation for foreign vendors.', mitigationPlan: 'Hedge foreign payments.', ownerId: 'U-03', status: 'Identified' },
  { id: 'RSK-203', category: 'Compliance', level: 'Low', score: 20, title: 'Minor HSE Infractions', description: 'Missing safety signage in Abuja office.', mitigationPlan: 'Order and install signs.', ownerId: 'U-01', status: 'Mitigated' },
];

export const mockAudits: Audit[] = [
  { id: 'AUD-301', title: 'Q2 Financial Compliance Audit', type: 'Internal', status: 'Completed', auditor: 'Jane Smith', department: 'Finance', dateStarted: '2026-06-01', dateCompleted: '2026-06-15', findingsCount: 2 },
  { id: 'AUD-302', title: 'Annual ISO 27001 Audit', type: 'External', status: 'Findings Open', auditor: 'Bureau Veritas', department: 'IT', dateStarted: '2026-06-10', findingsCount: 4 },
  { id: 'AUD-303', title: 'Vendor Due Diligence Review', type: 'Internal', status: 'Scheduled', auditor: 'Mike Johnson', department: 'Procurement', dateStarted: '2026-08-01', findingsCount: 0 },
];

export const mockInspections: Inspection[] = [
  { id: 'INS-401', title: 'Structural Integrity Check - Banana Island Villa', type: 'Safety', status: 'Passed with Conditions', inspector: 'Engr. Obi', date: '2026-07-02', score: 88 },
  { id: 'INS-402', title: 'Elevator Maintenance Inspection', type: 'Property', status: 'Upcoming', inspector: 'Otis Elevators', date: '2026-07-20' },
  { id: 'INS-403', title: 'Environmental Health Assessment', type: 'Environmental', status: 'Failed', inspector: 'Lagos State EPA', date: '2026-07-05', score: 45 },
];

export const mockLicenses: License[] = [
  { id: 'LIC-501', title: 'Corporate Real Estate Brokerage License', type: 'License', holderName: 'Luxora Enterprises Ltd', issueDate: '2024-01-01', expiryDate: '2027-01-01', status: 'Active', issuingAuthority: 'Lagos State Real Estate Regulatory Authority' },
  { id: 'LIC-502', title: 'Facility Management Certification', type: 'Certification', holderName: 'Luxora Property Management', issueDate: '2025-05-15', expiryDate: '2026-05-15', status: 'Expired', issuingAuthority: 'IFMA' },
];

export const mockKYCRecords: KYCRecord[] = [
  { id: 'KYC-601', entityName: 'Aliko Dangote', entityType: 'Buyer', verificationLevel: 'Level 3 - Enhanced', amlStatus: 'Clear', status: 'Verified', lastChecked: '2026-07-08' },
  { id: 'KYC-602', entityName: 'Global Construction Ltd', entityType: 'Vendor', verificationLevel: 'Level 2 - Standard', amlStatus: 'Flagged', status: 'Pending', lastChecked: '2026-07-09' },
];

export const mockIncidents: Incident[] = [
  { id: 'INC-701', title: 'Data Breach Allegation', type: 'Security', status: 'Under Investigation', severity: 'Critical', dateReported: '2026-07-08', description: 'Unauthorized access to CRM database suspected.', assignedTo: 'Security Team' },
  { id: 'INC-702', title: 'Tenant Dispute - Breach of Contract', type: 'Legal', status: 'Escalated', severity: 'High', dateReported: '2026-07-01', description: 'Tenant withholding rent due to maintenance delays.', assignedTo: 'Legal Dept' },
];

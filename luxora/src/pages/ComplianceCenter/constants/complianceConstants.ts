export const COMPLIANCE_WORKSPACES = [
  'dashboard',
  'compliance',
  'risk',
  'audits',
  'inspections',
  'licenses',
  'kyc',
  'incidents',
  'analytics',
  'executive'
] as const;

export type ComplianceWorkspace = typeof COMPLIANCE_WORKSPACES[number];

export const NAVIGATION_CATEGORIES = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { id: 'compliance', label: 'Compliance Records', icon: 'ClipboardCheck' },
  { id: 'risk', label: 'Risk Management', icon: 'AlertTriangle' },
  { id: 'audits', label: 'Audits', icon: 'FileSearch' },
  { id: 'inspections', label: 'Inspections', icon: 'CheckSquare' },
  { id: 'licenses', label: 'Licenses & Permits', icon: 'Award' },
  { id: 'kyc', label: 'KYC / AML', icon: 'UserCheck' },
  { id: 'incidents', label: 'Incidents & Legal', icon: 'Scale' },
  { id: 'analytics', label: 'Compliance Analytics', icon: 'PieChart' },
  { id: 'executive', label: 'Executive Insights', icon: 'Sparkles' },
];

export const STATUS_COLORS: Record<string, string> = {
  // Compliance
  'Compliant': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Non-Compliant': 'bg-red-50 text-red-700 border-red-200',
  'Pending Review': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  'At Risk': 'bg-orange-50 text-orange-700 border-orange-200',
  'Expired': 'bg-gray-100 text-gray-500 border-gray-300',

  // Risks & Incidents
  'Low': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Medium': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  'High': 'bg-orange-50 text-orange-700 border-orange-200',
  'Critical': 'bg-red-50 text-red-700 border-red-200',
  
  // Audits
  'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
  'Findings Open': 'bg-orange-50 text-orange-700 border-orange-200',
  'Scheduled': 'bg-gray-50 text-gray-700 border-gray-200',
  
  // KYC / General
  'Verified': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Clear': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Flagged': 'bg-red-50 text-red-700 border-red-200',
  'Active': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Renewing': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  'Suspended': 'bg-red-50 text-red-700 border-red-200',
};

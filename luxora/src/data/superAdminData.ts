import { Users, Building2, Heart, Server, ShieldCheck, Activity, CheckCircle2, ShieldAlert, Database, Mail, Banknote, FileCheck, Shield } from 'lucide-react';

export const executiveSummary = "Platform Status: Operational. All core services are online. Verification and assignment pipelines are within SLA. Two fraud investigations require attention. One Agency Assignment has exceeded acknowledgement time.";

export const platformKPIs = {
  row1: [
    { title: "Total Platform Users", value: "142.5K", trend: "+4.8% MTD", trendColor: "text-emerald-400", icon: Users },
    { title: "Active Agencies", value: "482", trend: "+12 New", trendColor: "text-emerald-400", icon: Building2 },
    { title: "Active Properties", value: "12,418", trend: "+142 This Week", trendColor: "text-emerald-400", icon: Heart },
    { title: "Platform Uptime", value: "99.99%", trend: "All Services Operational", trendColor: "text-emerald-400", icon: Server },
  ],
  row2: [
    { title: "Pending Verification", value: "249", trend: "Within SLA", trendColor: "text-emerald-400", icon: ShieldCheck },
    { title: "Pending Assignment", value: "70", trend: "15 Warnings", trendColor: "text-orange-400", icon: Activity },
    { title: "Active Assignments", value: "1,248", trend: "Steady", trendColor: "text-ink/60", icon: CheckCircle2 },
    { title: "Active Fraud Alerts", value: "3", trend: "Requires Review", trendColor: "text-rose-400", icon: ShieldAlert },
  ]
};

export const verificationPipeline = [
  { label: 'Submitted', value: 145, color: 'bg-ink/30' },
  { label: 'Under Review', value: 84, color: 'bg-gold-400' },
  { label: 'Returned', value: 12, color: 'bg-rose-400' },
  { label: 'On Hold', value: 8, color: 'bg-orange-400' },
  { label: 'Ready', value: 42, color: 'bg-emerald-400' },
];

export const assignmentPipeline = [
  { label: 'Ready', value: 42, color: 'bg-ink/30' },
  { label: 'Assigned', value: 28, color: 'bg-blue-400' },
  { label: 'Acknowledged', value: 65, color: 'bg-emerald-400' },
  { label: 'SLA Warning', value: 15, color: 'bg-orange-400' },
  { label: 'Escalated', value: 6, color: 'bg-rose-400' },
];

export const platformHealth = [
  { label: 'API Health', status: '100%', badgeStatus: 'Optimal', icon: Server, color: 'text-emerald-400', border: 'border-emerald-400/10' },
  { label: 'Database Health', status: 'Optimal', badgeStatus: 'Optimal', icon: Database, color: 'text-emerald-400', border: 'border-emerald-400/10' },
  { label: 'Email Service', status: 'Online', badgeStatus: 'Online', icon: Mail, color: 'text-ink/60', border: 'border-white/5' },
  { label: 'Payment Gateway', status: 'Online', badgeStatus: 'Online', icon: Banknote, color: 'text-ink/60', border: 'border-white/5' },
  { label: 'Security Status', status: '3 Alerts', badgeStatus: 'Warning', icon: ShieldAlert, color: 'text-rose-400', border: 'border-rose-400/10' },
];

export const governanceActions = [
  { id: 'broadcast', label: 'Global Broadcast', icon: Activity, color: 'text-blue-400' },
  { id: 'maintenance', label: 'Schedule Maintenance', icon: Database, color: 'text-rose-400' }
];

export const administrators = [
  {
    id: 'ADM-001',
    name: 'John Doe',
    email: 'john.doe@luxora.com',
    phone: '+1 (555) 123-4567',
    employeeId: 'EMP-9021',
    profilePhoto: '',
    role: 'Super Admin',
    status: 'Active',
    
    dept: 'Executive',
    region: 'Global',
    businessUnit: 'Core Platform',
    responsibilities: ['Platform Governance', 'Enterprise Strategy', 'Audit Oversight'],

    mfaStatus: 'Enabled',
    passwordStatus: 'Valid',
    lastLogin: '2 mins ago',
    loginHistory: [
      { date: '2026-07-30 08:00 AM', ip: '192.168.1.1', location: 'New York, USA', status: 'Success' },
      { date: '2026-07-29 09:15 AM', ip: '192.168.1.1', location: 'New York, USA', status: 'Success' }
    ],

    agenciesManaged: 0,
    internalStaffManaged: 24,
    verificationQueue: 0,
    assignmentQueue: 0,

    propertiesVerified: 0,
    slaPerformance: '100%',
    complaintsResolved: 45,
    escalations: 2,

    timeline: [
      { title: 'Account Created', desc: 'System administrator provisioned.', time: '2024-01-15', icon: ShieldCheck, color: 'text-emerald-400' },
      { title: 'MFA Enabled', desc: 'Multi-factor authentication configured.', time: '2024-01-15', icon: Shield, color: 'text-blue-400' },
      { title: 'Platform Audit', desc: 'Initiated global platform security audit.', time: '2 hours ago', icon: Activity, color: 'text-gold-400' }
    ]
  },
  {
    id: 'ADM-002',
    name: 'Jane Smith',
    email: 'jane.smith@luxora.com',
    phone: '+1 (555) 987-6543',
    employeeId: 'EMP-8044',
    profilePhoto: '',
    role: 'Compliance Admin',
    status: 'Active',
    
    dept: 'Legal',
    region: 'North America',
    businessUnit: 'Compliance',
    responsibilities: ['Agent Verification', 'Owner KYC', 'Dispute Resolution'],

    mfaStatus: 'Enabled',
    passwordStatus: 'Valid',
    lastLogin: '1 hour ago',
    loginHistory: [
      { date: '2026-07-30 07:45 AM', ip: '10.0.0.5', location: 'Chicago, USA', status: 'Success' }
    ],

    agenciesManaged: 12,
    internalStaffManaged: 8,
    verificationQueue: 42,
    assignmentQueue: 15,

    propertiesVerified: 1250,
    slaPerformance: '98.5%',
    complaintsResolved: 128,
    escalations: 14,

    timeline: [
      { title: 'Account Created', desc: 'Administrator provisioned.', time: '2024-03-10', icon: ShieldCheck, color: 'text-emerald-400' },
      { title: 'Permissions Assigned', desc: 'Assigned to Verification Queue.', time: '2024-03-12', icon: Shield, color: 'text-blue-400' },
      { title: 'Bulk Verification', desc: 'Processed 50 agent KYC approvals.', time: '1 day ago', icon: FileCheck, color: 'text-gold-400' }
    ]
  },
  {
    id: 'ADM-003',
    name: 'Chidi Okafor',
    email: 'chidi.o@luxora.com',
    phone: '+234 800 123 4567',
    employeeId: 'EMP-7012',
    profilePhoto: '',
    role: 'Support Lead',
    status: 'Suspended',
    
    dept: 'Support',
    region: 'Africa',
    businessUnit: 'Customer Success',
    responsibilities: ['Tier 3 Support', 'Escalation Management'],

    mfaStatus: 'Disabled',
    passwordStatus: 'Expired',
    lastLogin: '2 months ago',
    loginHistory: [
      { date: '2026-05-15 02:30 PM', ip: '102.89.1.5', location: 'Lagos, Nigeria', status: 'Success' }
    ],

    agenciesManaged: 45,
    internalStaffManaged: 12,
    verificationQueue: 0,
    assignmentQueue: 28,

    propertiesVerified: 0,
    slaPerformance: '92.4%',
    complaintsResolved: 450,
    escalations: 56,

    timeline: [
      { title: 'Account Created', desc: 'Support lead provisioned.', time: '2023-11-05', icon: ShieldCheck, color: 'text-emerald-400' },
      { title: 'Suspension', desc: 'Account suspended pending security review.', time: '2 months ago', icon: ShieldAlert, color: 'text-rose-400' }
    ]
  }
];

// Phase 3: Enterprise Provisioning Configuration
export const regions = [
  'Global', 'North America', 'EMEA', 'APAC', 'LATAM', 'Africa'
];

export const businessUnits = [
  'Core Platform', 'Compliance', 'Customer Success', 'Finance', 'Risk Management', 'Operations'
];

export const departments = [
  'Executive', 'Legal', 'Support', 'HR', 'Operations', 'Engineering', 'Security'
];

export const agencyCategories = [
  'Residential', 'Commercial', 'Luxury', 'Property Management', 'Multi-family', 'Development'
];

export const internalRoles = [
  'Tier 1 Support', 'Tier 2 Support', 'Tier 3 Support', 'Compliance Analyst', 'Financial Officer', 'Operations Specialist', 'Auditor'
];

export const permissionTemplates = [
  'Full Admin Access', 'View Only', 'Verification Manager', 'Finance Manager', 'Security Auditor', 'Support Lead'
];


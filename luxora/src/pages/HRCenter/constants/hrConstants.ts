export const HR_WORKSPACES = [
  'dashboard',
  'directory',
  'recruitment',
  'attendance',
  'leave',
  'performance',
  'payroll',
  'training',
  'orgchart',
  'assets',
  'recognition',
  'analytics',
  'executive'
] as const;

export type HRWorkspace = typeof HR_WORKSPACES[number];

export const HR_NAVIGATION = [
  { id: 'dashboard', label: 'HR Dashboard', icon: 'LayoutDashboard' },
  { id: 'directory', label: 'Employee Directory', icon: 'Users' },
  { id: 'recruitment', label: 'Recruitment (ATS)', icon: 'UserPlus' },
  { id: 'attendance', label: 'Attendance & Time', icon: 'Clock' },
  { id: 'leave', label: 'Leave Management', icon: 'CalendarDays' },
  { id: 'performance', label: 'Performance Reviews', icon: 'Target' },
  { id: 'payroll', label: 'Payroll Summaries', icon: 'Banknote' },
  { id: 'training', label: 'Training & Certs', icon: 'GraduationCap' },
  { id: 'orgchart', label: 'Organization Chart', icon: 'Network' },
  { id: 'assets', label: 'Asset Assignments', icon: 'Laptop' },
  { id: 'recognition', label: 'Recognition & Awards', icon: 'Award' },
  { id: 'analytics', label: 'Workforce Analytics', icon: 'PieChart' },
  { id: 'executive', label: 'Executive Insights', icon: 'Sparkles' },
];

export const DEPARTMENTS = [
  'Executive',
  'Human Resources',
  'Finance',
  'Legal',
  'Compliance',
  'Procurement',
  'Sales',
  'Marketing',
  'Property Management',
  'Facilities',
  'Customer Support',
  'IT'
];

export const HR_STATUS_COLORS: Record<string, string> = {
  // Employment & General
  'Active': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'On Leave': 'bg-blue-50 text-blue-700 border-blue-200',
  'Suspended': 'bg-red-50 text-red-700 border-red-200',
  'Terminated': 'bg-gray-100 text-gray-500 border-gray-300',
  'Probation': 'bg-yellow-50 text-yellow-700 border-yellow-200',

  // Attendance
  'Present': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Absent': 'bg-red-50 text-red-700 border-red-200',
  'Late': 'bg-orange-50 text-orange-700 border-orange-200',
  'Half-Day': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  'Remote': 'bg-indigo-50 text-indigo-700 border-indigo-200',

  // Leave & Requests
  'Approved': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Pending': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  'Rejected': 'bg-red-50 text-red-700 border-red-200',
  'Taken': 'bg-gray-100 text-gray-600 border-gray-200',
  
  // Recruitment
  'Applied': 'bg-gray-50 text-gray-700 border-gray-200',
  'Screening': 'bg-blue-50 text-blue-700 border-blue-200',
  'Interviewing': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Offered': 'bg-purple-50 text-purple-700 border-purple-200',
  'Hired': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  
  // Training
  'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
  'Not Started': 'bg-gray-100 text-gray-600 border-gray-200',
  'Expired': 'bg-red-50 text-red-700 border-red-200',
};

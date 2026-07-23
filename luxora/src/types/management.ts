export interface TeamMember {
  id: string;
  name: string;
  department: string;
  role: string;
  status: 'Active' | 'On Leave' | 'Warning' | string;
  performance: string;
}

export interface Department {
  id: string;
  name: string;
  head: string;
  budgetStatus: 'Optimal' | 'Warning' | 'Critical' | string;
  headcount: number;
  riskLevel: 'Low' | 'Medium' | 'High' | string;
  status: 'Active' | 'Warning' | string;
}

export interface ManagementReport {
  id: string;
  name: string;
  type: string;
  author: string;
  date: string;
  status: 'Generated' | 'Review' | string;
}

export interface PendingApproval {
  id: number;
  title: string;
  requestedBy: string;
  type: string;
  priority: 'High' | 'Medium' | 'Low' | string;
  date: string;
}

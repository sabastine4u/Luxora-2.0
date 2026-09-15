export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  department: string | null;
  role: string;
  status: string;
  isActive: boolean;
  isVerified: boolean;
  avatar: string | null;
  createdAt: string;
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

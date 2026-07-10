export type EmploymentType = 'Full-Time' | 'Part-Time' | 'Contract' | 'Freelance' | 'Intern';
export type EmployeeStatus = 'Active' | 'On Leave' | 'Suspended' | 'Terminated' | 'Probation';
export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Half-Day' | 'Remote';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected' | 'Taken';
export type LeaveType = 'Annual' | 'Sick' | 'Emergency' | 'Maternity' | 'Paternity' | 'Unpaid';
export type RecruitmentStatus = 'Applied' | 'Screening' | 'Interviewing' | 'Offered' | 'Hired' | 'Rejected';
export type InterviewStage = 'Phone Screen' | 'Technical' | 'Cultural' | 'Final' | 'Executive';
export type PerformanceRating = 'Outstanding' | 'Exceeds Expectations' | 'Meets Expectations' | 'Needs Improvement' | 'Unsatisfactory';
export type TrainingStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Expired';

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  team: string;
  position: string;
  managerId?: string;
  employmentType: EmploymentType;
  status: EmployeeStatus;
  hireDate: string;
  avatar?: string;
  location: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  clockIn?: string;
  clockOut?: string;
  status: AttendanceStatus;
  notes?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  status: LeaveStatus;
  reason: string;
  approvedBy?: string;
}

export interface LeaveBalance {
  employeeId: string;
  annualTotal: number;
  annualUsed: number;
  sickTotal: number;
  sickUsed: number;
}

export interface Applicant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  positionApplied: string;
  department: string;
  status: RecruitmentStatus;
  appliedDate: string;
  resumeUrl?: string;
}

export interface Interview {
  id: string;
  applicantId: string;
  stage: InterviewStage;
  scheduledDate: string;
  interviewerId: string;
  feedback?: string;
  passed?: boolean;
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  reviewerId: string;
  period: string; // e.g., "Q2 2026"
  rating: PerformanceRating;
  feedback: string;
  dateCompleted: string;
}

export interface Goal {
  id: string;
  employeeId: string;
  title: string;
  description: string;
  deadline: string;
  progress: number; // 0-100
  status: 'Not Started' | 'In Progress' | 'Completed' | 'At Risk';
}

export interface TrainingCourse {
  id: string;
  title: string;
  category: 'Compliance' | 'Technical' | 'Soft Skills' | 'Onboarding';
  durationHours: number;
  mandatory: boolean;
}

export interface Certification {
  id: string;
  employeeId: string;
  courseId: string;
  status: TrainingStatus;
  dateCompleted?: string;
  expiryDate?: string;
}

export interface PayrollSummary {
  id: string;
  employeeId: string;
  month: string;
  baseSalary: number;
  bonus: number;
  deductions: number;
  netPay: number;
  status: 'Draft' | 'Approved' | 'Paid';
}

export interface AssetAssignment {
  id: string;
  employeeId: string;
  type: 'Laptop' | 'Phone' | 'Vehicle' | 'Access Card' | 'Equipment';
  description: string;
  dateAssigned: string;
  status: 'Active' | 'Returned' | 'Lost/Stolen';
}

export interface RecognitionAward {
  id: string;
  employeeId: string;
  title: string;
  date: string;
  awardedBy: string;
  description: string;
}

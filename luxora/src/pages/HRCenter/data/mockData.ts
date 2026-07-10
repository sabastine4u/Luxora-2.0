import type { 
  Employee, 
  AttendanceRecord, 
  LeaveRequest, 
  Applicant, 
  PerformanceReview, 
  TrainingCourse, 
  PayrollSummary 
} from '../types/hrTypes';

export const mockEmployees: Employee[] = [
  { id: 'EMP-001', firstName: 'Alexander', lastName: 'Sterling', email: 'a.sterling@luxora.com', phone: '+234 800 111 0001', department: 'Executive', team: 'C-Suite', position: 'Chief Executive Officer', employmentType: 'Full-Time', status: 'Active', hireDate: '2020-01-15', location: 'Lagos HQ' },
  { id: 'EMP-002', firstName: 'Sarah', lastName: 'Okafor', email: 's.okafor@luxora.com', phone: '+234 800 111 0002', department: 'Finance', team: 'Corporate Finance', position: 'Chief Financial Officer', managerId: 'EMP-001', employmentType: 'Full-Time', status: 'Active', hireDate: '2020-03-01', location: 'Lagos HQ' },
  { id: 'EMP-003', firstName: 'David', lastName: 'Chen', email: 'd.chen@luxora.com', phone: '+234 800 111 0003', department: 'IT', team: 'Engineering', position: 'Chief Technology Officer', managerId: 'EMP-001', employmentType: 'Full-Time', status: 'Active', hireDate: '2021-06-10', location: 'Remote - US' },
  { id: 'EMP-004', firstName: 'Aisha', lastName: 'Bello', email: 'a.bello@luxora.com', phone: '+234 800 111 0004', department: 'Sales', team: 'Luxury Residential', position: 'Sales Director', managerId: 'EMP-001', employmentType: 'Full-Time', status: 'Active', hireDate: '2022-02-15', location: 'Abuja Office' },
  { id: 'EMP-005', firstName: 'John', lastName: 'Doe', email: 'j.doe@luxora.com', phone: '+234 800 111 0005', department: 'Sales', team: 'Luxury Residential', position: 'Senior Real Estate Agent', managerId: 'EMP-004', employmentType: 'Contract', status: 'Active', hireDate: '2023-01-10', location: 'Lagos HQ' },
  { id: 'EMP-006', firstName: 'Elena', lastName: 'Rostova', email: 'e.rostova@luxora.com', phone: '+234 800 111 0006', department: 'Human Resources', team: 'Talent Acquisition', position: 'HR Manager', managerId: 'EMP-001', employmentType: 'Full-Time', status: 'Active', hireDate: '2023-08-01', location: 'Lagos HQ' },
  { id: 'EMP-007', firstName: 'Michael', lastName: 'Ojo', email: 'm.ojo@luxora.com', phone: '+234 800 111 0007', department: 'Property Management', team: 'Commercial Facilities', position: 'Facility Manager', managerId: 'EMP-001', employmentType: 'Full-Time', status: 'On Leave', hireDate: '2021-11-20', location: 'Lekki Phase 1' },
  { id: 'EMP-008', firstName: 'Chioma', lastName: 'Eze', email: 'c.eze@luxora.com', phone: '+234 800 111 0008', department: 'Compliance', team: 'Risk & Audit', position: 'Compliance Officer', managerId: 'EMP-001', employmentType: 'Full-Time', status: 'Probation', hireDate: '2026-06-01', location: 'Abuja Office' },
];

export const mockAttendance: AttendanceRecord[] = [
  { id: 'ATT-101', employeeId: 'EMP-005', date: '2026-07-09', clockIn: '08:45 AM', clockOut: '05:30 PM', status: 'Present' },
  { id: 'ATT-102', employeeId: 'EMP-006', date: '2026-07-09', clockIn: '09:15 AM', clockOut: '06:00 PM', status: 'Late', notes: 'Traffic on 3rd Mainland Bridge' },
  { id: 'ATT-103', employeeId: 'EMP-007', date: '2026-07-09', status: 'Absent', notes: 'Approved Annual Leave' },
  { id: 'ATT-104', employeeId: 'EMP-003', date: '2026-07-09', clockIn: '09:00 AM', clockOut: '05:00 PM', status: 'Remote' },
];

export const mockLeaveRequests: LeaveRequest[] = [
  { id: 'LR-201', employeeId: 'EMP-007', type: 'Annual', startDate: '2026-07-01', endDate: '2026-07-14', days: 10, status: 'Approved', reason: 'Family vacation', approvedBy: 'EMP-001' },
  { id: 'LR-202', employeeId: 'EMP-005', type: 'Sick', startDate: '2026-07-15', endDate: '2026-07-16', days: 2, status: 'Pending', reason: 'Medical appointment' },
];

export const mockApplicants: Applicant[] = [
  { id: 'APP-301', firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@email.com', positionApplied: 'Property Inspector', department: 'Compliance', status: 'Interviewing', appliedDate: '2026-06-25' },
  { id: 'APP-302', firstName: 'Emeka', lastName: 'Udo', email: 'e.udo@email.com', positionApplied: 'Junior Accountant', department: 'Finance', status: 'Screening', appliedDate: '2026-07-02' },
  { id: 'APP-303', firstName: 'Sophia', lastName: 'Loren', email: 's.loren@email.com', positionApplied: 'Marketing Executive', department: 'Marketing', status: 'Offered', appliedDate: '2026-06-10' },
];

export const mockReviews: PerformanceReview[] = [
  { id: 'PR-401', employeeId: 'EMP-005', reviewerId: 'EMP-004', period: 'H1 2026', rating: 'Exceeds Expectations', feedback: 'John exceeded his sales targets for Q1 and Q2. Excellent client relationship management.', dateCompleted: '2026-06-28' },
  { id: 'PR-402', employeeId: 'EMP-006', reviewerId: 'EMP-001', period: 'H1 2026', rating: 'Meets Expectations', feedback: 'Elena has successfully streamlined our onboarding process. Need focus on time-to-hire metrics.', dateCompleted: '2026-06-30' },
];

export const mockTrainingCourses: TrainingCourse[] = [
  { id: 'TRN-501', title: 'AML & KYC Compliance 2026', category: 'Compliance', durationHours: 4, mandatory: true },
  { id: 'TRN-502', title: 'Advanced Negotiation Tactics', category: 'Soft Skills', durationHours: 8, mandatory: false },
  { id: 'TRN-503', title: 'Data Privacy Policy', category: 'Compliance', durationHours: 2, mandatory: true },
];

export const mockPayroll: PayrollSummary[] = [
  { id: 'PAY-601', employeeId: 'EMP-005', month: 'June 2026', baseSalary: 1200000, bonus: 450000, deductions: 180000, netPay: 1470000, status: 'Paid' },
  { id: 'PAY-602', employeeId: 'EMP-006', month: 'June 2026', baseSalary: 1500000, bonus: 0, deductions: 220000, netPay: 1280000, status: 'Paid' },
];

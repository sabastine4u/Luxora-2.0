import { useState, useMemo } from 'react';
import type { HRWorkspace } from '../constants/hrConstants';
import { 
  mockEmployees, 
  mockAttendance, 
  mockLeaveRequests, 
  mockApplicants, 
  mockReviews, 
  mockTrainingCourses, 
  mockPayroll 
} from '../data/mockData';
import type { Employee } from '../types/hrTypes';

export const useHRCenter = () => {
  const [activeWorkspace, setActiveWorkspace] = useState<HRWorkspace>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Derived / Filtered Data
  const filteredEmployees = useMemo(() => {
    let result = mockEmployees;
    if (selectedDepartment !== 'All') {
      result = result.filter(e => e.department === selectedDepartment);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(e => 
        e.firstName.toLowerCase().includes(q) || 
        e.lastName.toLowerCase().includes(q) ||
        e.position.toLowerCase().includes(q)
      );
    }
    return result;
  }, [searchQuery, selectedDepartment]);

  const activeEmployeeCount = mockEmployees.filter(e => e.status === 'Active').length;
  const onLeaveCount = mockEmployees.filter(e => e.status === 'On Leave').length;
  const openPositionsCount = 12; // Mock KPI

  // Helper for drill-down
  const viewEmployeeProfile = (employee: Employee) => {
    setSelectedEmployee(employee);
    // You could also switch workspace if desired, but we'll probably render it within directory or as a modal/separate view
  };

  const closeEmployeeProfile = () => {
    setSelectedEmployee(null);
  };

  return {
    // State
    activeWorkspace,
    setActiveWorkspace,
    searchQuery,
    setSearchQuery,
    selectedDepartment,
    setSelectedDepartment,
    selectedEmployee,
    
    // Actions
    viewEmployeeProfile,
    closeEmployeeProfile,

    // Data
    employees: filteredEmployees,
    allEmployees: mockEmployees,
    attendance: mockAttendance,
    leaveRequests: mockLeaveRequests,
    applicants: mockApplicants,
    reviews: mockReviews,
    training: mockTrainingCourses,
    payroll: mockPayroll,

    // KPIs
    totalEmployees: mockEmployees.length,
    activeEmployeeCount,
    onLeaveCount,
    openPositionsCount
  };
};

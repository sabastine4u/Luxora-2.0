export const DEPARTMENTS = {
  MANAGEMENT: 'Management',
  PROCUREMENT: 'Procurement',
  FINANCE: 'Finance',
  PROPERTY_MANAGEMENT: 'Property Management',
  PROPERTY_INTELLIGENCE: 'Property Intelligence',
  HOME_SERVICES: 'Home Services',
} as const;

export type DepartmentKey = keyof typeof DEPARTMENTS;
export type Department = typeof DEPARTMENTS[DepartmentKey];
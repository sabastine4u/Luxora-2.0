import { ROLES } from '../constants/roles';
import { DEPARTMENTS, type Department } from '../constants/departments';
import type { UserRole } from '../contexts/SessionContext';

export interface MockUser {
  name: string;
  email: string;
  password?: string;
  avatar: string;
  role: UserRole;
  department?: Department;
}

export const mockUsers: MockUser[] = [
  {
    name: 'Eleanor Vance',
    email: 'buyer@luxora.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    role: ROLES.BUYER,
  },
  {
    name: 'Arthur Pendelton',
    email: 'owner@luxora.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
    role: ROLES.OWNER,
  },
  {
    name: 'Sarah Jenkins',
    email: 'agent@luxora.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
    role: ROLES.AGENT,
  },
  {
    name: 'Marcus Sterling',
    email: 'agency@luxora.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150',
    role: ROLES.AGENCY,
  },
  {
    name: 'Isabella Rossi',
    email: 'admin@luxora.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150',
    role: ROLES.ADMIN,
  },
  {
    name: 'Julian Vance',
    email: 'superadmin@luxora.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    role: ROLES.SUPER_ADMIN,
  },
  {
    name: 'Olivia Chen',
    email: 'manager@luxora.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    role: ROLES.MANAGER,
    department: DEPARTMENTS.MANAGEMENT,
  },
  {
    name: 'David Kim',
    email: 'procurement@luxora.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    role: ROLES.PROCUREMENT,
    department: DEPARTMENTS.PROCUREMENT,
  },
  {
    name: 'Sophia Williams',
    email: 'finance@luxora.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&q=80&w=150',
    role: ROLES.FINANCE,
    department: DEPARTMENTS.FINANCE,
  },
  {
    name: 'James Rodriguez',
    email: 'analyst@luxora.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150',
    role: ROLES.ANALYST,
    department: DEPARTMENTS.PROPERTY_INTELLIGENCE,
  },
  {
    name: 'Emily Davis',
    email: 'propertymanager@luxora.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
    role: ROLES.PROPERTY_MANAGER,
    department: DEPARTMENTS.PROPERTY_MANAGEMENT,
  },
  {
    name: 'Michael Brown',
    email: 'serviceadmin@luxora.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=150',
    role: ROLES.SERVICE_ADMIN,
    department: DEPARTMENTS.HOME_SERVICES,
  }
];

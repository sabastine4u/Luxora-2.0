export const ROUTES = {
  HOME: '/',
  PROPERTIES: '/properties',
  PROPERTY_DETAILS: '/properties/:id',
  AGENCIES: '/agencies',
  AGENCY_DETAILS: '/agencies/:slug',
  AGENT_DETAILS: '/agents/:slug',
  SEARCH: '/search',
  ABOUT: '/about',
  COMMUNICATION: '/communication',
  NOTIFICATIONS: '/notifications',
  WORKFLOW_CENTER: '/workflow-center',
  DOCUMENT_CENTER: '/document-center',
  CRM_CENTER: '/crm-center',
  FINANCE_CENTER: '/finance-center',
  COMPLIANCE_CENTER: '/compliance-center',
  HR_CENTER: '/hr-center',

  // Error Pages
  UNAUTHORIZED: '/unauthorized',
  TERMS: '/terms',
  CONTACT: '/contact',
  FAQ: '/faq',
  PRIVACY: '/privacy',
  LOGIN: '/login',
  REGISTER: '/register',
  
  // Services Experience Platform
  SERVICE_PROPERTY_MANAGEMENT: '/services/property-management',
  SERVICE_PROCUREMENT: '/services/procurement',
  SERVICE_MORTGAGE: '/services/mortgage',
  SERVICE_HOME_SERVICES: '/services/home-services',
  SERVICE_PROPERTY_INTELLIGENCE: '/services/property-intelligence',

  BUYER_DASHBOARD: '/buyer-dashboard',
  OWNER_DASHBOARD: '/owner-dashboard',
  AGENT_DASHBOARD: '/agent-dashboard',
  AGENCY_DASHBOARD: '/agency-dashboard',
  ADMIN_DASHBOARD: '/dashboard',
  SUPER_ADMIN_DASHBOARD: '/admin-dashboard',
  MANAGEMENT_DASHBOARD: '/management-dashboard',
  PROCUREMENT_DASHBOARD: '/procurement-dashboard',
  FINANCE_DASHBOARD: '/finance-dashboard',
  INTELLIGENCE_DASHBOARD: '/intelligence-dashboard',
  PROPERTY_MANAGEMENT_DASHBOARD: '/property-management-dashboard',
  HOME_SERVICES_DASHBOARD: '/home-services-dashboard',
  COMMUNICATION_CENTER: '/communication-center',
  NOTIFICATION_CENTER: '/notification-center',
  CREATE_LISTING: '/dashboard/create-listing',
} as const;

import { ROLES } from './roles';

export const ROLE_DASHBOARD_MAP: Record<string, string> = {
  [ROLES.BUYER]: ROUTES.BUYER_DASHBOARD,
  [ROLES.OWNER]: ROUTES.OWNER_DASHBOARD,
  [ROLES.AGENT]: ROUTES.AGENT_DASHBOARD,
  [ROLES.AGENCY]: ROUTES.AGENCY_DASHBOARD,
  [ROLES.ADMIN]: ROUTES.ADMIN_DASHBOARD,
  [ROLES.SUPER_ADMIN]: ROUTES.SUPER_ADMIN_DASHBOARD,
  [ROLES.MANAGER]: ROUTES.MANAGEMENT_DASHBOARD,
  [ROLES.PROCUREMENT]: ROUTES.PROCUREMENT_DASHBOARD,
  [ROLES.FINANCE]: ROUTES.FINANCE_DASHBOARD,
  [ROLES.ANALYST]: ROUTES.INTELLIGENCE_DASHBOARD,
  [ROLES.PROPERTY_MANAGER]: ROUTES.PROPERTY_MANAGEMENT_DASHBOARD,
  [ROLES.SERVICE_ADMIN]: ROUTES.HOME_SERVICES_DASHBOARD,
};

export const getDashboardRoute = (role?: string | null): string => {
  if (!role) return ROUTES.HOME;
  return ROLE_DASHBOARD_MAP[role] || ROUTES.HOME;
};


export const isDashboardRoute = (pathname: string): boolean => {
  return pathname === ROUTES.ADMIN_DASHBOARD || pathname.includes('-dashboard') || pathname.includes('-center');
};

import type { ServiceData } from '../types';
import { ROLES } from '../../../constants/roles';
import { ROUTES } from '../../../constants/routes';

export const homeServicesData: ServiceData = {
  id: 'home-services',
  name: 'Home Services',
  tagline: 'Your home is a masterpiece. Maintain it with masters.',
  heroImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80',
  overview: {
    title: 'The Luxora Guarantee',
    description: 'Finding trustworthy, elite service providers is risky and time-consuming. We provide a concierge-level, heavily vetted network of premium service providers. One point of billing, backed by the Luxora Guarantee.',
    audience: ['Luxury homeowners', 'New buyers outfitting their properties', 'Estate managers'],
  },
  features: [
    {
      title: 'Smart Home Integrators',
      description: 'Bespoke automation and premium security detail installations.',
      icon: 'Cpu',
    },
    {
      title: 'Interior & Landscape',
      description: 'Access the world\'s top interior designers and landscape architects.',
      icon: 'Layout',
    },
    {
      title: 'Vetted Quality',
      description: 'Comprehensive background checks and mandatory premium insurance overlays.',
      icon: 'Award',
    },
  ],
  benefits: [],
  statistics: [],
  journey: [],
  dashboardPreview: {
    imageUrl: 'https://images.unsplash.com/photo-1507208773393-40d9fc670acf?auto=format&fit=crop&q=80',
    imageAlt: 'Home Services Dashboard',
    features: ['Automated Dispatch', 'Escrow Invoicing', 'Unified Chat'],
  },
  testimonials: [],
  faqs: [],
  ctaConfig: {
    allowedRoles: [ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.SERVICE_ADMIN, ROLES.MANAGER, ROLES.OWNER, ROLES.BUYER],
    guest: {
      primaryText: 'Commission a Specialist',
      primaryAction: ROUTES.REGISTER,
    },
    authorized: {
      primaryText: 'Access Concierge Services',
      primaryAction: ROUTES.OWNER_DASHBOARD,
    },
    unauthorized: {
      primaryText: 'Request Concierge Access',
      primaryAction: ROUTES.CONTACT,
    },
  },
};

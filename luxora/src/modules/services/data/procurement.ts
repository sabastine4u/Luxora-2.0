import type { ServiceData } from '../types';
import { ROLES } from '../../../constants/roles';
import { ROUTES } from '../../../constants/routes';

export const procurementData: ServiceData = {
  id: 'procurement',
  name: 'Procurement',
  tagline: 'Source the extraordinary from our vetted global network.',
  heroImage: 'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&q=80',
  overview: {
    title: 'The Global Sourcing Hub',
    description: 'Exceptional properties demand exceptional materials. Access a vetted, closed-network marketplace of the world\'s finest artisans and manufacturers, offering wholesale pricing and guaranteed provenance.',
    audience: ['Luxury developers', 'Elite interior designers', 'Agencies outfitting premium properties'],
  },
  features: [
    {
      title: 'Global Network',
      description: 'Sourcing hubs in Milan, Paris, Kyoto, and more.',
      icon: 'Globe',
    },
    {
      title: 'Provenance Tracking',
      description: 'Guaranteed authenticity with full origin transparency.',
      icon: 'CheckCircle',
    },
    {
      title: 'White-Glove Shipping',
      description: 'Escrow payments and secure, insured international freight.',
      icon: 'Truck',
    },
  ],
  benefits: [],
  statistics: [],
  journey: [],
  dashboardPreview: {
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80',
    imageAlt: 'Procurement Dashboard',
    features: ['RFQs', 'Escrow Management', 'Order Tracking'],
  },
  testimonials: [],
  faqs: [],
  ctaConfig: {
    allowedRoles: [ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.PROCUREMENT, ROLES.MANAGER],
    guest: {
      primaryText: 'Request Network Access',
      primaryAction: ROUTES.REGISTER,
    },
    authorized: {
      primaryText: 'Open Procurement Marketplace',
      primaryAction: ROUTES.PROCUREMENT_DASHBOARD,
    },
    unauthorized: {
      primaryText: 'Apply for B2B Access',
      primaryAction: ROUTES.CONTACT,
    },
  },
};

import type { ServiceData } from '../types';
import { ROLES } from '../../../constants/roles';
import { ROUTES } from '../../../constants/routes';

export const mortgageData: ServiceData = {
  id: 'mortgage',
  name: 'Mortgage Assistance',
  tagline: 'Complex wealth requires sophisticated financing.',
  heroImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80',
  overview: {
    title: 'Private Banking Network',
    description: 'Traditional banks struggle with complex wealth profiles, international income, and jumbo luxury loans. Access our private banking networks, portfolio lenders, and customized financing structures designed specifically for luxury acquisitions.',
    audience: ['High-net-worth buyers', 'International expats', 'Real estate investors'],
  },
  features: [
    {
      title: 'Jumbo & Super Jumbo',
      description: 'Access to high-limit lending without the friction of retail banks.',
      icon: 'Building',
    },
    {
      title: 'Expat Financing',
      description: 'Structures tailored for international income and foreign nationals.',
      icon: 'Globe',
    },
    {
      title: 'Portfolio Lending',
      description: 'Borrowing against fractionalized token equity or existing assets.',
      icon: 'PieChart',
    },
  ],
  benefits: [],
  statistics: [],
  journey: [],
  dashboardPreview: {
    imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80',
    imageAlt: 'Mortgage Dashboard',
    features: ['Encrypted Vault', 'Live Amortization', 'Approval Status'],
  },
  testimonials: [],
  faqs: [],
  ctaConfig: {
    allowedRoles: [ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.FINANCE, ROLES.MANAGER, ROLES.BUYER],
    guest: {
      primaryText: 'Explore Private Financing',
      primaryAction: ROUTES.REGISTER,
    },
    authorized: {
      primaryText: 'Open Finance Module',
      primaryAction: ROUTES.BUYER_DASHBOARD,
    },
    unauthorized: {
      primaryText: 'Speak to a Private Advisor',
      primaryAction: ROUTES.CONTACT,
    },
  },
};

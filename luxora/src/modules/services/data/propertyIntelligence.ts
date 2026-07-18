import type { ServiceData } from '../types';
import { ROLES } from '../../../constants/roles';
import { ROUTES } from '../../../constants/routes';

export const propertyIntelligenceData: ServiceData = {
  id: 'property-intelligence',
  name: 'Property Intelligence',
  tagline: 'In luxury real estate, opacity is the enemy of alpha.',
  heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80',
  overview: {
    title: 'The Data Advantage',
    description: 'Luxury real estate data is notoriously opaque. Off-market transactions and subjective valuations make ROI forecasting incredibly difficult. Gain access to proprietary algorithms, exclusive off-market data pooling, and macro-economic overlays providing Wall Street-level analytics for real estate.',
    audience: ['Institutional investors', 'Agencies & Brokers', 'Data-driven luxury buyers'],
  },
  features: [
    {
      title: 'Predictive Modeling',
      description: 'Cap rate forecasting and appreciation heatmaps built on AI-driven data.',
      icon: 'TrendingUp',
    },
    {
      title: 'Off-Market Tracking',
      description: 'Visibility into high-value private transactions unavailable on public MLS.',
      icon: 'Eye',
    },
    {
      title: 'White-Labeled Reports',
      description: 'Generate stunning PDF intelligence reports instantly for your top clients.',
      icon: 'FileText',
    },
  ],
  benefits: [],
  statistics: [],
  journey: [],
  dashboardPreview: {
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80',
    imageAlt: 'Intelligence Dashboard',
    features: ['Scrubbable Timelines', 'Generative AI Forecasting', 'Macro Alerts'],
  },
  testimonials: [],
  faqs: [],
  ctaConfig: {
    allowedRoles: [ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.ANALYST, ROLES.MANAGER, ROLES.AGENCY],
    guest: {
      primaryText: 'Unlock Market Intelligence',
      primaryAction: ROUTES.REGISTER,
    },
    authorized: {
      primaryText: 'Open Intelligence Dashboard',
      primaryAction: ROUTES.INTELLIGENCE_DASHBOARD,
    },
    unauthorized: {
      primaryText: 'Request Platform Access',
      primaryAction: ROUTES.CONTACT,
    },
  },
};

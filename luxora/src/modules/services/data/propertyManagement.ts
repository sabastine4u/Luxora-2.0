import type { ServiceData } from '../types';
import { ROLES } from '../../../constants/roles';
import { ROUTES } from '../../../constants/routes';

export const propertyManagementData: ServiceData = {
  id: 'property-management',
  name: 'Property Management',
  tagline: 'Delegate your portfolio to Luxora\'s elite management network.',
  heroImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80',
  overview: {
    title: 'The White-Glove Standard',
    description: 'Your time is your ultimate luxury. Don\'t spend it managing tenants. We preserve asset value through elite tenant screening and predictive maintenance, backed by transparent enterprise-grade reporting.',
    audience: ['High-net-worth individuals', 'Institutional investors', 'Absentee owners holding luxury real estate'],
  },
  features: [
    {
      title: 'Elite Tenant Screening',
      description: 'Rigorous vetting processes ensuring only the most qualified individuals occupy your luxury properties.',
      icon: 'Shield',
    },
    {
      title: 'Predictive Maintenance',
      description: '24/7 concierge maintenance backed by IoT sensors detecting issues before they occur.',
      icon: 'Settings',
    },
    {
      title: 'Enterprise Reporting',
      description: 'Live rent ledgers, occupancy rates, and transparent financial reporting in real-time.',
      icon: 'BarChart',
    },
  ],
  benefits: [
    'Preserve asset value',
    'Passive income without the operational headache',
    'White-glove concierge support',
  ],
  statistics: [
    { value: '98%', label: 'Average Occupancy' },
    { value: '15%', label: 'Rent Premium Achieved' },
  ],
  journey: [
    { title: 'Onboarding', description: 'Listing your property securely in the Luxora network.', icon: 'Home' },
    { title: 'Tenant Placement', description: 'Matching with pre-vetted, high-net-worth tenants.', icon: 'Users' },
    { title: 'Passive Income', description: 'Automated rent collection and transparent distributions.', icon: 'DollarSign' },
  ],
  dashboardPreview: {
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80', // Placeholder dashboard image
    imageAlt: 'Property Management Dashboard',
    features: ['Live Rent Ledgers', 'Maintenance Ticketing', 'Occupancy Metrics'],
  },
  testimonials: [],
  faqs: [],
  ctaConfig: {
    allowedRoles: [ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.PROPERTY_MANAGER, ROLES.MANAGER, ROLES.OWNER],
    guest: {
      primaryText: 'Delegate Your Portfolio',
      primaryAction: ROUTES.REGISTER,
    },
    authorized: {
      primaryText: 'Open Property Management',
      primaryAction: ROUTES.OWNER_DASHBOARD, // Default to owner dashboard for this service demo
    },
    unauthorized: {
      primaryText: 'Request Enterprise Access',
      primaryAction: ROUTES.CONTACT,
    },
  },
};

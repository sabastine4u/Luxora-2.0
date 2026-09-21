import type { ServiceData } from '../types';
import { ROLES } from '../../../constants/roles';
import { ROUTES } from '../../../constants/routes';

export const homeServicesData: ServiceData = {
  id: 'home-services',

  name: 'Home Services',

  tagline:
    'Your home is a masterpiece. Maintain it with masters.',

  heroImage:
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80',

  overview: {
    title: 'The Luxora Guarantee',

    description:
      'Finding trustworthy, elite service providers is risky and time-consuming. We provide a concierge-level, heavily vetted network of premium service providers. One point of billing, backed by the Luxora Guarantee.',

    audience: [
      'Luxury homeowners',
      'New buyers outfitting their properties',
      'Estate managers',
    ],
  },

  features: [
    {
      title: 'Smart Home Integrators',
      description:
        'Bespoke automation, intelligent lighting, climate control, audiovisual systems, and premium security installations.',
      icon: 'Cpu',
    },

    {
      title: 'Interior & Landscape',
      description:
        "Access the world's top interior designers, decorators, horticultural specialists, and landscape architects.",
      icon: 'Layout',
    },

    {
      title: 'Vetted Quality',
      description:
        'Comprehensive provider screening, professional verification, and mandatory premium insurance requirements.',
      icon: 'Award',
    },

    {
      title: 'Estate Maintenance',
      description:
        'Coordinate ongoing repairs, preventive maintenance, inspections, and specialist services through one trusted network.',
      icon: 'Wrench',
    },

    {
      title: 'Concierge Coordination',
      description:
        'Luxora coordinates the right specialist, tracks the engagement, and keeps the homeowner informed from request to completion.',
      icon: 'Headphones',
    },

    {
      title: 'Unified Service Experience',
      description:
        'Keep service requests, communications, appointments, invoices, and provider activity organized in one place.',
      icon: 'Layers',
    },
  ],

  benefits: [
    'One trusted network for premium home specialists',

    'Professionally screened service providers',

    'Transparent service coordination and billing',

    'Dedicated concierge support for high-value requests',

    'Centralized service requests and communication',

    'Preventive maintenance support for long-term property care',
  ],

  statistics: [
    {
      value: '24/7',
      label: 'Concierge Access',
    },

    {
      value: '360°',
      label: 'Home Care Coverage',
    },

    {
      value: '1',
      label: 'Unified Service Network',
    },

    {
      value: '100%',
      label: 'Luxora-Coordinated Experience',
    },
  ],

  journey: [
    {
      title: 'Tell Us What You Need',
      description:
        'Submit a service request and describe the property, requirement, preferred timing, and any specialist considerations.',
      icon: 'MessageSquare',
    },

    {
      title: 'Specialist Matching',
      description:
        'Luxora reviews the requirement and identifies a suitable verified provider from the premium service network.',
      icon: 'Users',
    },

    {
      title: 'Coordinate the Appointment',
      description:
        'The service engagement is organized around your preferred schedule with the relevant provider and property details.',
      icon: 'Calendar',
    },

    {
      title: 'Service Delivery',
      description:
        'The selected specialist carries out the requested work while the engagement remains coordinated through Luxora.',
      icon: 'Wrench',
    },

    {
      title: 'Review & Close',
      description:
        'Completion is recorded, the service experience is reviewed, and any follow-up requirements can be coordinated.',
      icon: 'CheckCircle2',
    },
  ],

  dashboardPreview: {
    imageUrl:
      'https://images.unsplash.com/photo-1507208773393-40d9fc670acf?auto=format&fit=crop&q=80',

    imageAlt:
      'Luxora Home Services Enterprise Workspace',

    caption:
      'A unified workspace for coordinating premium property services.',

    features: [
      'Automated Dispatch',
      'Escrow Invoicing',
      'Unified Chat',
      'Service Requests',
      'Provider Tracking',
      'Maintenance History',
    ],
  },

  testimonials: [
    {
      quote:
        'Luxora gives us one place to coordinate the specialists required to keep a high-value residence operating at the standard our clients expect.',

      author: 'Estate Management Client',

      role: 'Private Estate Manager',

      company: 'Luxora Network',
    },

    {
      quote:
        'The value is not simply finding a service provider. It is having the entire engagement coordinated with one trusted point of contact.',

      author: 'Luxury Homeowner',

      role: 'Residential Client',

      company: 'Luxora Home Services',
    },
  ],

  faqs: [
    {
      question:
        'What type of home services can Luxora coordinate?',

      answer:
        'Luxora Home Services is designed for premium residential requirements including smart-home integration, maintenance, security, interiors, landscaping, specialist repairs, and other property-related services.',
    },

    {
      question:
        'Are service providers vetted before being introduced?',

      answer:
        'Yes. Luxora is designed around a curated provider network with professional verification and service-quality requirements before providers are introduced to clients.',
    },

    {
      question:
        'Can Luxora coordinate recurring property maintenance?',

      answer:
        'Yes. Recurring maintenance requirements can be coordinated as part of an ongoing home-services relationship so that important property-care activities remain organized over time.',
    },

    {
      question:
        'How does the concierge process work?',

      answer:
        'You submit your requirement, Luxora identifies an appropriate specialist, coordinates the engagement, and keeps the request organized through completion and follow-up.',
    },

    {
      question:
        'Can estate managers use Home Services?',

      answer:
        'Yes. Estate managers are one of the intended audiences for the Home Services experience and can use the network to coordinate specialist requirements across managed residences.',
    },

    {
      question:
        'Can I request a service before becoming a Luxora client?',

      answer:
        'Guests can begin through the public service request flow. Access to authenticated concierge and service-management capabilities depends on the applicable Luxora account and role.',
    },
  ],

  ctaConfig: {
    allowedRoles: [
      ROLES.ADMIN,
      ROLES.SUPER_ADMIN,
      ROLES.SERVICE_ADMIN,
      ROLES.MANAGER,
      ROLES.OWNER,
      ROLES.BUYER,
    ],

    guest: {
      primaryText:
        'Commission a Specialist',

      primaryAction:
        ROUTES.REGISTER,
    },

    authorized: {
      primaryText:
        'Access Concierge Services',

      primaryAction:
        ROUTES.OWNER_DASHBOARD,
    },

    unauthorized: {
      primaryText:
        'Request Concierge Access',

      primaryAction:
        ROUTES.CONTACT,
    },
  },
};
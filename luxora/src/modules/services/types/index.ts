export interface ServiceFeature {
  title: string;
  description: string;
  icon: string; // The lucide-react icon name as a string, e.g. 'Shield'
}

export interface ServiceStatistic {
  value: string;
  label: string;
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServiceTestimonial {
  quote: string;
  author: string;
  role: string;
  company?: string;
  avatarUrl?: string;
}

export interface ServiceJourneyStep {
  title: string;
  description: string;
  icon: string;
}

export interface ServiceDashboardPreview {
  imageUrl: string;
  imageAlt: string;
  caption?: string;
  features: string[];
}

export interface CTAConfig {
  allowedRoles: string[];
  guest: {
    primaryText: string;
    primaryAction: string; // usually '/register'
  };
  authorized: {
    primaryText: string;
    primaryAction: string; // dynamic based on role, usually dashboard route
  };
  unauthorized: {
    primaryText: string;
    primaryAction: string; // usually contact or upgrade access
  };
}

export interface ServiceData {
  id: string;
  name: string;
  tagline: string;
  heroImage: string;
  overview: {
    title: string;
    description: string;
    audience: string[]; // "Who This Solution Is For"
  };
  features: ServiceFeature[];
  benefits: string[];
  statistics: ServiceStatistic[];
  journey: ServiceJourneyStep[];
  dashboardPreview: ServiceDashboardPreview;
  testimonials: ServiceTestimonial[];
  faqs: ServiceFAQ[];
  ctaConfig: CTAConfig;
}

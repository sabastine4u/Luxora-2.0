// src/modules/enterprise/events/registry.ts

export const ENTERPRISE_EVENTS = {
  // Domain Events (Module Generated)
  PROCUREMENT_PURCHASE_REQUEST_CREATED: 'procurement.purchase-request.created',
  PROCUREMENT_PURCHASE_REQUEST_APPROVED: 'procurement.purchase-request.approved',
  PROCUREMENT_PURCHASE_REQUEST_REJECTED: 'procurement.purchase-request.rejected',
  PROCUREMENT_VENDOR_ASSIGNED: 'procurement.vendor.assigned',

  FINANCE_PAYMENT_COMPLETED: 'finance.payment.completed',
  FINANCE_REFUND_REQUESTED: 'finance.refund.requested',
  FINANCE_REFUND_APPROVED: 'finance.refund.approved',
  FINANCE_INVOICE_GENERATED: 'finance.invoice.generated',

  MANAGEMENT_PROPERTY_VERIFIED: 'management.property.verified',

  SERVICES_SERVICE_REQUESTED: 'services.service.requested',
  SERVICES_PROVIDER_ASSIGNED: 'services.provider.assigned',
  SERVICES_SERVICE_STARTED: 'services.service.started',
  SERVICES_JOB_CREATED: 'services.job.created',
  SERVICES_JOB_COMPLETED: 'services.job.completed',

  INTELLIGENCE_ANALYSIS_COMPLETED: 'intelligence.analysis.completed',
  INTELLIGENCE_RISK_DETECTED: 'intelligence.risk.detected',
  INTELLIGENCE_RECOMMENDATION_GENERATED: 'intelligence.recommendation.generated',
  
  PROPERTY_MAINTENANCE_CREATED: 'property-management.maintenance.created',
  MANAGEMENT_MAINTENANCE_ASSIGNED: 'property-management.maintenance.assigned',
  MANAGEMENT_MAINTENANCE_COMPLETED: 'property-management.maintenance.completed',

  // Buyer Events
  BUYER_PROPERTY_SAVED: 'buyer.property.saved',
  BUYER_INSPECTION_REQUESTED: 'buyer.inspection.requested',
  BUYER_OFFER_CREATED: 'buyer.offer.created',
  BUYER_PURCHASE_COMPLETED: 'buyer.purchase.completed',

  // Agent Events
  AGENT_REVIEW_STARTED: 'agent.review.started',
  AGENT_REVIEW_COMPLETED: 'agent.review.completed',
  AGENT_DOCUMENTS_UPLOADED: 'agent.documents.uploaded',

  // Property Lifecycle Events
  PROPERTY_SUBMITTED: 'property.submitted',
  AGENCY_PROPERTY_RECEIVED: 'agency.property.received',
  AGENCY_AGENT_ASSIGNED: 'agency.agent.assigned',
  PROPERTY_REVIEW_STARTED: 'property.review.started',
  PROPERTY_REVIEW_COMPLETED: 'property.review.completed',
  PROPERTY_READY_FOR_LISTING: 'property.ready.for.listing',
  PROPERTY_LISTING_PUBLISHED: 'property.listing.published',
  PROPERTY_LISTING_REJECTED: 'property.listing.rejected',
  
  // System Events (Center Generated)
  WORKFLOW_STARTED: 'workflow.started',
  WORKFLOW_PENDING: 'workflow.pending',
  WORKFLOW_APPROVAL_GRANTED: 'workflow.approval.granted',
  WORKFLOW_APPROVAL_REJECTED: 'workflow.approval.rejected',
  WORKFLOW_ASSIGNED: 'workflow.assigned',
  WORKFLOW_COMPLETED: 'workflow.completed',
  WORKFLOW_FAILED: 'workflow.failed',
  NOTIFICATION_SENT: 'notification.sent',
  COMMUNICATION_THREAD_CREATED: 'communication.thread.created',
  REPORT_GENERATED: 'reporting.report.generated',
  AUDIT_LOGGED: 'audit.event.logged',
  SLA_ESCALATED: 'workflow.sla.escalated'
} as const;

export type EnterpriseEventType = typeof ENTERPRISE_EVENTS[keyof typeof ENTERPRISE_EVENTS] | string;

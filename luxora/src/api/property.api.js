// Import the shared HTTP client used for all Luxora API requests.
import http from "./http";

// Define the API methods related to property listings.
export const propertyApi = {
  // Fetch published properties with optional search and filter parameters.
  getProperties: (params = {}) =>
    http.get("/properties", {
      params,
    }),

  // Fetch all Properties belonging to the authenticated Owner.
  getOwnerProperties: () =>
    http.get("/owner/properties"),

  // Fetch a single published Property by its MongoDB ID.
  getPropertyById: (propertyId) =>
    http.get(`/properties/${propertyId}`),

  // Create a new property listing for an authenticated Agent, Admin, or Super Admin.
  createProperty: (payload) =>
    http.post("/properties", payload),

  // Submit a draft Property for the backend review workflow.
  submitPropertyForReview: (propertyId) =>
    http.post(
      `/properties/${propertyId}/submit-review`,
    ),

  // Approve or reject a Property through the administrative approval workflow.
  approveProperty: (
    propertyId,
    payload = {},
  ) =>
    http.patch(
      `/properties/${propertyId}/approval`,
      payload,
    ),

  // Publish an approved Property so it becomes publicly visible.
  publishProperty: (propertyId) =>
    http.patch(
      `/properties/${propertyId}/publish`,
    ),

  // Assign a Property to an Agency through the Admin/Super Admin workflow.
  assignPropertyToAgency: (
    propertyId,
    agencyId,
  ) =>
    http.patch(
      `/properties/${propertyId}/assign-agency`,
      {
        agencyId,
      },
    ),

  // Record a public Property detail-page view for Owner analytics.
  recordPropertyView: (
    propertyId,
    visitorId,
  ) =>
    http.post(
      `/properties/${propertyId}/view`,
      {
        visitorId,
      },
    ),

  // Fetch Properties assigned to the authenticated Agency.
  getAgencyProperties: () =>
    http.get("/agency/properties"),

  // Fetch real PropertyView analytics for Properties belonging to the authenticated Agency.
  getAgencyPropertyAnalytics: () =>
    http.get(
      "/agency/property-analytics",
    ),

  // Fetch the real Inquiry records belonging to the authenticated Agency.
  getAgencyInquiries: () =>
    http.get(
      "/inquiries/agency",
    ),

  // Fetch all commission records belonging to the authenticated Agency.
  getAgencyCommissions: () =>
    http.get(
      "/agency/commissions",
    ),

  // Fetch commission summary totals for the authenticated Agency.
  getAgencyCommissionSummary: () =>
    http.get(
      "/agency/commission-summary",
    ),

  // Move one Agency commission through its payment lifecycle.
  updateAgencyCommissionStatus: (
    commissionId,
    status,
  ) =>
    http.patch(
      `/agency/commissions/${commissionId}/status`,
      {
        status,
      },
    ),

  // Run payroll for Agency commissions currently in Processing.
  runAgencyCommissionPayroll: () =>
    http.post(
      "/agency/commissions/run-payroll",
    ),

  // Assign or reassign a Property to an Agent through the Agency workflow.
  assignPropertyToAgent: (
    propertyId,
    agentId,
  ) =>
    http.patch(
      `/properties/${propertyId}/assign-agent`,
      {
        agentId,
      },
    ),

  // Update editable Property fields from the authenticated Agency workflow.
  updateAgencyProperty: (
    propertyId,
    payload,
  ) =>
    http.patch(
      `/properties/${propertyId}`,
      payload,
    ),

  // Fetch real Performance analytics belonging to the authenticated Agency.
  getAgencyPerformance: () =>
    http.get(
      "/agency/performance",
    ),
};
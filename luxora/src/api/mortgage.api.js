// Import the shared HTTP client so the authenticated token is attached automatically.
import http from "./http";

// Mortgage API methods shared by the Buyer tracker and Finance operations workflow.
export const mortgageApi = {
  // GET /mortgages/my -> { applications }
  getMyMortgageApplications: () =>
    http.get("/mortgages/my"),

  // POST /mortgages -> { message, application }
  createMortgageApplication: (applicationData) =>
    http.post("/mortgages", applicationData),

  // GET /mortgages/operations -> { applications, pagination }
  getFinanceMortgageApplications: (params = {}) =>
    http.get("/mortgages/operations", { params }),

  // PATCH /mortgages/:mortgageId/workflow -> { message, application }
  processMortgageApplication: (
    mortgageId,
    workflowData,
  ) =>
    http.patch(
      `/mortgages/${mortgageId}/workflow`,
      workflowData,
    ),
};
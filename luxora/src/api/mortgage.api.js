// Import the shared HTTP client so the authenticated Buyer token is attached automatically.
import http from "./http";

// Define the API methods used by the Buyer Mortgage Tracker.
export const mortgageApi = {
  // GET /mortgages/my -> { success, applications }
  getMyMortgageApplications: () =>
    http.get("/mortgages/my"),

  // POST /mortgages -> { success, message, application }
  createMortgageApplication: (applicationData) =>
    http.post("/mortgages", applicationData),
};
// Import the shared HTTP client so the authenticated Manager token
// is attached automatically.

import http from "./http";

export const managementApi = {
  // GET /management/team
  getTeam: (params = {}) =>
    http.get("/management/team", {
      params,
    }),

  // GET /management/performance
  getPerformance: () =>
    http.get("/management/performance"),

  getOverview: () =>
  http.get("/management/overview"),
};
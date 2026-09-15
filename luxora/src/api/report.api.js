import http from "./http";

export const reportApi = {
  // Keep your existing Admin report methods here

  getManagerReport: (params = {}) =>
    http.get("/management/reports", {
      params,
    }),
};
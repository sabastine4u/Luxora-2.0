import http from "./http";

export const financeApi = {
  getAdminFinanceSummary: () =>
    http.get("/admin/finance/summary"),
};
import http from "./http";

export const financeApi = {
  getOverview: () => http.get("/finance/overview"),
  getCounts: () => http.get("/finance/counts"),
  getRevenue: (params = {}) => http.get("/finance/revenue", { params }),
  getTransactions: (params = {}) => http.get("/finance/transactions", { params }),
  getOwnerPayments: (params = {}) => http.get("/finance/owner-payments", { params }),
  getAgencyEarnings: (params = {}) => http.get("/finance/agency-earnings", { params }),
  getAgentCommissions: (params = {}) => http.get("/finance/agent-commissions", { params }),
  getMortgageStatistics: (params = {}) => http.get("/finance/mortgage-statistics", { params }),
  getProcurementBudget: (params = {}) => http.get("/finance/procurement-budget", { params }),
  getReports: (params = {}) => http.get("/finance/reports", { params }),
  getAuditLogs: (params = {}) => http.get("/finance/audit-logs", { params }),
  getForecasting: (params = {}) => http.get("/finance/forecasting", { params }),
  getAdminFinanceSummary: () =>
    http.get("/admin/finance/summary"),
};

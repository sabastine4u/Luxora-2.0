import http from "./http";

export const marketplaceApi = {
    getPublicMarketplaceSummary: () =>
        http.get("/marketplace/summary"),

    getPublicInvestmentIntelligence: () =>
        http.get("/marketplace/investment-intelligence"),
};
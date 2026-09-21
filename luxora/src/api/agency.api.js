import http from './http';

export const agencyApi = {
    // ==========================================
    // PUBLIC MARKETPLACE
    // ==========================================

    // GET /agencies/public
    // Public Agency directory.
    getPublicAgencies: (params = {}) =>
        http.get('/agencies/public', {
            params,
        }),

    // GET /agencies/public/:slug
    // Public Agency profile.
    getPublicAgency: (slug) =>
        http.get(`/agencies/public/${slug}`),

    // ==========================================
    // AUTHENTICATED AGENCY
    // ==========================================

    // GET /agencies/me
    // Retrieves the Agency business profile for the
    // currently logged-in Agency account.
    getMyAgency: () =>
        http.get('/agencies/me'),

    // PATCH /agencies/me
    // Saves the Agency business profile changes.
    updateMyAgency: (payload) =>
        http.patch('/agencies/me', payload),
};
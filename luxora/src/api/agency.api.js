// Import the shared HTTP client so the Agency JWT
// is automatically attached to authenticated requests.
import http from './http';

// Keep Agency-specific API calls centralized in one file.
export const agencyApi = {
    // GET /agencies/me
    // Retrieves the Agency business profile for the logged-in Agency account.
    getMyAgency: () =>
        http.get('/agencies/me'),

    // PATCH /agencies/me
    // Saves the Agency business profile changes.
    updateMyAgency: (payload) =>
        http.patch('/agencies/me', payload),
};
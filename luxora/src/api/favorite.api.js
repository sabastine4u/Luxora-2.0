// Import the shared HTTP client so Bearer authentication is added automatically.
import http from './http';

// Define the API methods used by the frontend Favorites feature.
export const favoriteApi = {
  // GET /favorites -> { favorites }
  getFavorites: () =>
    http.get('/favorites'),

  // GET /favorites/:propertyId/check -> { isFavorite }
  checkFavorite: (propertyId) =>
    http.get(`/favorites/${propertyId}/check`),

  // POST /favorites/:propertyId -> { favorite }
  addFavorite: (propertyId) =>
    http.post(`/favorites/${propertyId}`),

  // DELETE /favorites/:propertyId -> { }
  removeFavorite: (propertyId) =>
    http.delete(`/favorites/${propertyId}`),
};
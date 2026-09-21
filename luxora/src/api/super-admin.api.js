import http from './http';

// Only endpoints verified for the Super Admin dashboard belong here.
export const superAdminApi = {
  getOverview: () => http.get('/super-admin/overview'),
  getCounts: () => http.get('/super-admin/counts'),
};

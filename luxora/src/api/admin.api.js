import http from './http';

// Export the Admin dashboard API methods used by Admin and Super Admin.
export const adminApi = {
  // Fetch every Agent across the platform for Admin/Super Admin management.
  getAgents: () =>
    http.get('/admin/agents'),

  // Fetch every Agency across the platform for Admin/Super Admin management.
  getAgencies: () =>
    http.get('/admin/agencies'),

  // Fetch all six approved Internal Staff roles.
  getInternalStaff: () =>
    http.get('/admin/internal-staff'),

  // Verify or unverify an Internal Staff account from the Admin dashboard.
updateInternalStaffVerification: (staffId, isVerified) =>
  http.patch(
    `/admin/internal-staff/${staffId}/verification`,
    { isVerified }
  ),

   // GET /admin/buyers -> { buyers }
    getBuyers: () =>
        http.get('/admin/buyers'),

    // GET /admin/owners -> { owners }
    getOwners: () =>
        http.get('/admin/owners'),

   // Fetch all Admin accounts for Super Admin management.
getAdmins: () =>
  http.get('/admin/admins'),
};


import http from './http';

// Export the Admin dashboard API methods used by Admin and Super Admin.
export const adminApi = {
  // Fetch every Agent across the platform for Admin/Super Admin management.
  getAgents: () =>
    http.get('/admin/agents'),

  // Fetch every Agency across the platform for Admin/Super Admin management.
  getAgencies: () =>
    http.get('/admin/agencies'),

  // Update an existing Agency from Admin/Super Admin management.
  updateAgency: (
    agencyId,
    agencyData,
  ) =>
    http.patch(
      `/admin/agencies/${agencyId}`,
      agencyData,
    ),

  // Fetch every Property for Admin/Super Admin listing management.
  getProperties: () =>
    http.get('/admin/properties'),

  // Fetch Verification Center records for the selected status tab.
  getVerificationQueue: (
    status = 'Pending',
  ) =>
    http.get(
      '/admin/verification-center',
      {
        params: {
          status,
        },
      },
    ),

  // Fetch the real number of pending Agent verification requests.
  getVerificationCenterCount: () =>
    http.get(
      '/admin/verification-center/count',
    ),

  // Fetch real aggregate totals for the Verification Center dashboard.
  getVerificationCenterSummary: () =>
    http.get(
      '/admin/verification-center/summary',
    ),

  // Fetch complete verification details for one Agent.
  getAgentVerification: (
    agentId,
  ) =>
    http.get(
      `/admin/verification-center/${agentId}`,
    ),

  // Approve or reject one Agent verification request.
  reviewAgentVerification: (
    agentId,
    decision,
    reviewNotes = '',
  ) =>
    http.patch(
      `/admin/verification-center/${agentId}/review`,
      {
        decision,
        reviewNotes,
      },
    ),

  // Fetch all six approved Internal Staff roles.
  getInternalStaff: () =>
    http.get('/admin/internal-staff'),

  // Update an existing Internal Staff account.
  updateInternalStaff: (
    staffId,
    data,
  ) =>
    http.patch(
      `/admin/internal-staff/${staffId}`,
      data,
    ),

  // Verify or unverify an Internal Staff account.
  updateInternalStaffVerification: (
    staffId,
    isVerified,
  ) =>
    http.patch(
      `/admin/internal-staff/${staffId}/verification`,
      {
        isVerified,
      },
    ),

  // Fetch all Buyers for Admin/Super Admin management.
  getBuyers: () =>
    http.get('/admin/buyers'),

  // Update editable Buyer profile fields from Admin/Super Admin.
  updateBuyer: (
    buyerId,
    buyerData,
  ) =>
    http.patch(
      `/admin/buyers/${buyerId}`,
      buyerData,
    ),

  // Suspend or reactivate a Buyer account without changing verification.
  updateBuyerStatus: (
    buyerId,
    isActive,
  ) =>
    http.patch(
      `/admin/buyers/${buyerId}/status`,
      {
        isActive,
      },
    ),

  // Fetch all Owners for Admin/Super Admin management.
  getOwners: () =>
    http.get('/admin/owners'),

  // Fetch all Admin accounts for Super Admin management.
  getAdmins: () =>
    http.get('/admin/admins'),

  // Update the operational status of an Agent.
  updateAgentStatus: (
    agentId,
    status,
  ) =>
    http.patch(
      `/admin/agents/${agentId}/status`,
      {
        status,
      },
    ),

  // Update an Agent's profile information.
  updateAgent: (
    agentId,
    data,
  ) =>
    http.patch(
      `/admin/agents/${agentId}`,
      data,
    ),

  // Fetch the global Luxora platform settings.
  getSystemSettings: () =>
    http.get('/admin/system-settings'),

  // Update the global Luxora platform settings.
  updateSystemSettings: (
    data,
  ) =>
    http.patch(
      '/admin/system-settings',
      data,
    ),

  // Fetch Admin complaints.
  getComplaints: () =>
    http.get('/admin/complaints'),

  // Update the status of an Admin complaint.
  updateComplaintStatus: (
    complaintId,
    status,
  ) =>
    http.patch(
      `/admin/complaints/${complaintId}/status`,
      {
        status,
      },
    ),

  // Generate a real Admin report.
  //
  // Supported categories:
  // financial
  // user-growth
  // listing-performance
  getReport: (
    category,
    startDate,
    endDate,
  ) => {
    const params = {
      category,
    };

    if (startDate) {
      params.startDate =
        startDate;
    }

    if (endDate) {
      params.endDate =
        endDate;
    }

    return http.get(
      '/admin/reports',
      {
        params,
      },
    );
  },

  // Fetch real System Audit Log records.
  getAuditLogs: ({
    category,
    action,
    actor,
    startDate,
    endDate,
    page = 1,
    limit = 25,
  } = {}) => {
    const params = {
      page,
      limit,
    };

    if (category) {
      params.category =
        category;
    }

    if (action) {
      params.action =
        action;
    }

    if (actor) {
      params.actor =
        actor;
    }

    if (startDate) {
      params.startDate =
        startDate;
    }

    if (endDate) {
      params.endDate =
        endDate;
    }

    return http.get(
      '/admin/audit-logs',
      {
        params,
      },
    );
  },
};
import http from "./http";

// Define the Agent API methods used by the Agency and Agent dashboards.
export const agentApi = {
    // Create an Agent and send the complete onboarding form to the backend.
    createAgent: (agentData) =>
        http.post("/agents", agentData),

    // Fetch every Agent belonging to the currently logged-in Agency.
    // The backend determines the Agency from the authenticated User token.
    getAgents: () =>
        http.get("/agents"),

    // Change an Agent's status.
    // The backend determines whether the authenticated user has permission to perform this action.
    updateAgentStatus: (agentId, status) =>
        http.patch(`/agents/${agentId}/status`, { status }),

    // Fetch Property assignments currently waiting for the logged-in Agent's response.
    // The backend determines the Agent from the authenticated User token.
    getMyAssignments: () =>
        http.get("/agent/properties"),

    // Fetch Properties that the logged-in Agent has accepted for active management.
    getMyListings: () =>
        http.get("/agent/listings"),

    // Fetch all real Leads assigned to the logged-in Agent.
    getMyLeads: () =>
        http.get("/inquiries/agent"),

    // Fetch the real CRM-style clients derived from the logged-in Agent's inquiries.
    getMyClients: () =>
        http.get("/inquiries/agent/clients"),

    // Fetch scheduled viewing appointments belonging to the logged-in Agent.
    getMyAppointments: () =>
        http.get("/inquiries/agent/appointments"),

    // Fetch Offers assigned to the authenticated Agent.
getMyDeals: () =>
    http.get("/offers/agent"),

getMyCommissions: () =>
  http.get("/agent/commissions"),

getMyCommissionSummary: () =>
  http.get("/agent/commission-summary"),

getMyPerformance: () =>
  http.get("/agent/performance"),

    // Update the status of a Lead assigned to the logged-in Agent.
    updateLeadStatus: (
        inquiryId,
        status,
        note = "",
    ) =>
        http.patch(
            `/inquiries/agent/${inquiryId}/status`,
            {
                status,
                note,
            },
        ),

    // Add an internal note to a Lead assigned to the logged-in Agent.
    addLeadNote: (
        inquiryId,
        note,
    ) =>
        http.post(
            `/inquiries/agent/${inquiryId}/notes`,
            {
                note,
            },
        ),

    // Schedule or reschedule a viewing for a Lead assigned to the logged-in Agent.
    scheduleLeadViewing: (
        inquiryId,
        scheduledDate,
        scheduledTime,
        note = "",
    ) =>
        http.patch(
            `/inquiries/agent/${inquiryId}/schedule-viewing`,
            {
                scheduledDate,
                scheduledTime,
                note,
            },
        ),

    // Update the lifecycle status of an appointment.
    // This is separate from Lead status so completing/cancelling
    // a viewing does not accidentally change the Lead pipeline.
    updateAppointmentStatus: (
        inquiryId,
        appointmentStatus,
    ) =>
        http.patch(
            `/inquiries/agent/appointments/${inquiryId}/status`,
            {
                appointmentStatus,
            },
        ),

    // Accept a Property assignment belonging to the logged-in Agent.
    acceptAssignment: (propertyId) =>
        http.patch(
            `/agent/properties/${propertyId}/accept`,
        ),

    // Decline a Property assignment and send the Agent's reason to the backend.
    declineAssignment: (
        propertyId,
        reason,
    ) =>
        http.patch(
            `/agent/properties/${propertyId}/decline`,
            {
                reason,
            },
        ),
};
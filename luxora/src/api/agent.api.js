import http from './http';

// Export the Agent API methods used by the Agency dashboard.
export const agentApi = {
    // Create an Agent and send the complete onboarding form to the backend.
    createAgent: (agentData) =>
        http.post('/agents', agentData),

    // Fetch every Agent belonging to the currently logged-in Agency.
    // No parameters needed - the backend figures out "which agency" from the token.
    getAgents: () =>
        http.get('/agents'),

    // Change an Agent's status - used for Approve/Suspend/Reactivate.
    // agentId identifies WHICH agent; status is the new value to set.
    updateAgentStatus: (agentId, status) =>
        http.patch(`/agents/${agentId}/status`, { status }),
};
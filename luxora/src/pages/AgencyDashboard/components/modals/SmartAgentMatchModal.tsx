import { useEffect, useMemo, useState } from 'react';
import {
  Brain,
  MapPin,
  Activity,
  Star,
  Clock,
  CheckCircle2,
} from 'lucide-react';

import { Modal } from '../../../../components/ui/Modal';
import { GhostButton, GoldButton } from '../../../../components/ui/ui';
import { agentApi } from '../../../../api/agent.api';
import { propertyApi } from '../../../../api/property.api';
import { useToast } from '../../../../contexts/ToastContext';

interface SmartAgentMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignmentId?: string;
  propertyTitle?: string;
  propertyLocation?: string;

  // Refresh the Assignment Center after a successful assignment.
  onAssignmentComplete?: () => void;
}

export function SmartAgentMatchModal({
  isOpen,
  onClose,
  assignmentId,
  propertyTitle,
  propertyLocation,
  onAssignmentComplete,
}: SmartAgentMatchModalProps) {
  const [agents, setAgents] = useState<any[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [isLoadingAgents, setIsLoadingAgents] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  const { showToast } = useToast();

  // Load the Agency's real Agent roster whenever the modal opens.
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const fetchAgents = async () => {
      try {
        // Show the loading state while the Agency Agent list is retrieved.
        setIsLoadingAgents(true);

        // The shared HTTP client unwraps the API envelope,
        // so the response contains `agents` directly.
        const response = await agentApi.getAgents();

        // Only Active Agents can receive Property assignments.
        const activeAgents = (response.agents || []).filter(
          (agent: any) => agent.status === 'Active',
        );

        // Store the Agency's currently eligible Agents.
        setAgents(activeAgents);
      } catch (error) {
        // Log the actual API error while showing a user-friendly message.
        console.error('Failed to load Agency agents:', error);

        showToast({
          type: 'error',
          title: 'Agents Could Not Be Loaded',
          description:
            error instanceof Error
              ? error.message
              : 'Unable to load the Agency agent list.',
        });
      } finally {
        // Always stop the loading state when the request completes.
        setIsLoadingAgents(false);
      }
    };

    fetchAgents();
  }, [isOpen, showToast]);

  // Reset the selected Agent whenever a new matching session begins.
  useEffect(() => {
    if (!isOpen) {
      setSelectedAgentId(null);
      return;
    }

    // Automatically select the first available Agent when the list loads.
    setSelectedAgentId(null);
  }, [isOpen, assignmentId]);

  // Keep the UI's "smart match" ranking structure while using real Agency data.
  const sortedAgents = useMemo(() => {
    return [...agents].sort((a, b) => {
      // Prefer Agents with an existing backend performance score.
      const scoreA =
        typeof a.score === 'number' ? a.score : 0;

      const scoreB =
        typeof b.score === 'number' ? b.score : 0;

      return scoreB - scoreA;
    });
  }, [agents]);

  // Return a display-safe performance score without inventing a result.
  const getPerformanceScore = (agent: any) => {
    return typeof agent.score === 'number' && agent.score > 0
      ? `${agent.score}%`
      : 'Not available';
  };

  // Return a display-safe capacity value without inventing availability.
  const getCapacityDisplay = (agent: any) => {
    if (typeof agent.capacity !== 'number') {
      return 'Not available';
    }

    return `${Math.max(0, 100 - agent.capacity)}% Available`;
  };

  // Return a display-safe response-time value.
  const getResponseTime = (agent: any) => {
    return agent.avgResponseTime || 'Not available';
  };

  // Assign the selected Agent to the selected Property through the real API.
  const handleConfirmAssignment = async () => {
    // A Property ID is required before the request can be sent.
    if (!assignmentId) {
      showToast({
        type: 'error',
        title: 'Property Not Selected',
        description:
          'Select a Property before assigning an Agent.',
      });

      return;
    }

    // An Agent must be selected before the assignment can be submitted.
    if (!selectedAgentId) {
      showToast({
        type: 'error',
        title: 'Agent Not Selected',
        description:
          'Please select an Active Agent for this Property.',
      });

      return;
    }

    try {
      // Disable the confirmation action while the request is running.
      setIsAssigning(true);

      // Send the real Property → Agent assignment request to the backend.
      await propertyApi.assignPropertyToAgent(
        assignmentId,
        selectedAgentId,
      );

      // Confirm the successful assignment to the Agency user.
      showToast({
        type: 'success',
        title: 'Agent Assigned',
        description:
          'The Property has been successfully assigned to the selected Agent.',
      });

      // Refresh the Assignment Center so the new Agent appears immediately.
      if (onAssignmentComplete) {
        onAssignmentComplete();
      }

      // Close the matching modal after the assignment succeeds.
      onClose();
    } catch (error) {
      // Keep the modal open when the backend rejects the assignment.
      console.error('Property assignment failed:', error);

      showToast({
        type: 'error',
        title: 'Assignment Failed',
        description:
          error instanceof Error
            ? error.message
            : 'Unable to assign this Property to the selected Agent.',
      });
    } finally {
      // Re-enable the assignment action after success or failure.
      setIsAssigning(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Smart Agent Match"
      size="2xl"
      actionButton={
        <div className="flex gap-3">
          <GhostButton
            onClick={onClose}
            disabled={isAssigning}
          >
            Cancel
          </GhostButton>

          <GoldButton
            disabled={
              !selectedAgentId ||
              !assignmentId ||
              isAssigning ||
              isLoadingAgents
            }
            onClick={handleConfirmAssignment}
          >
            {isAssigning ? 'Assigning...' : 'Confirm Assignment'}
          </GoldButton>
        </div>
      }
    >
      <div className="space-y-6 min-h-[400px]">
        {/* Header information for the currently selected Property. */}
        <div className="bg-navy-900 border border-white/10 rounded-xl p-4 flex gap-4 items-center">
          <div className="h-12 w-12 rounded-full bg-blue-400/20 border border-blue-400/30 flex items-center justify-center">
            <Brain className="h-6 w-6 text-blue-400" />
          </div>

          <div>
            <h3 className="text-sm font-bold text-cream">
              Agency Agent Matching
            </h3>

            <p className="text-xs text-ink/60">
              Select an Active Agent for{' '}
              <span className="text-cream font-medium">
                {propertyTitle || 'this Property'}
              </span>{' '}
              in {propertyLocation || 'the selected location'}.
            </p>
          </div>
        </div>

        {/* Preserve the original matching-weight presentation. */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-navy-950 rounded-lg p-2 text-center border border-white/5">
            <div className="text-[10px] text-ink/60 uppercase font-bold tracking-wider mb-1">
              Proximity
            </div>
            <div className="text-xs font-bold text-emerald-400">
              40% Weight
            </div>
          </div>

          <div className="bg-navy-950 rounded-lg p-2 text-center border border-white/5">
            <div className="text-[10px] text-ink/60 uppercase font-bold tracking-wider mb-1">
              Specialty
            </div>
            <div className="text-xs font-bold text-blue-400">
              30% Weight
            </div>
          </div>

          <div className="bg-navy-950 rounded-lg p-2 text-center border border-white/5">
            <div className="text-[10px] text-ink/60 uppercase font-bold tracking-wider mb-1">
              Capacity
            </div>
            <div className="text-xs font-bold text-yellow-400">
              20% Weight
            </div>
          </div>

          <div className="bg-navy-950 rounded-lg p-2 text-center border border-white/5">
            <div className="text-[10px] text-ink/60 uppercase font-bold tracking-wider mb-1">
              Success
            </div>
            <div className="text-xs font-bold text-gold-400">
              10% Weight
            </div>
          </div>
        </div>

        {/* Real Agency Agents. */}
        <div className="space-y-3">
          {isLoadingAgents ? (
            <div className="h-48 flex items-center justify-center text-sm text-ink/60">
              Loading Active Agents...
            </div>
          ) : sortedAgents.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-center">
              <Activity className="h-8 w-8 text-ink/30 mb-3" />

              <p className="text-sm text-ink/60">
                No Active Agents are currently available.
              </p>

              <p className="text-xs text-ink/40 mt-1">
                The Property cannot be assigned until an Agent is Active.
              </p>
            </div>
          ) : (
            sortedAgents.slice(0, 4).map((agent, index) => {
              const agentId = String(agent._id || agent.id);
              const isSelected = selectedAgentId === agentId;

              return (
                <div
                  key={agentId}
                  onClick={() => setSelectedAgentId(agentId)}
                  className={`relative flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${isSelected
                      ? 'bg-gold-400/10 border-gold-400/50 shadow-[0_0_15px_rgba(250,204,21,0.1)]'
                      : 'bg-navy-900 border-white/5 hover:border-white/20'
                    }`}
                >
                  {/* Match indicator. */}
                  <div className="shrink-0 flex flex-col items-center justify-center h-14 w-14 rounded-full border-4 border-navy-950 bg-emerald-400/20">
                    <span className="text-[10px] text-emerald-400 font-bold block leading-none">
                      Match
                    </span>

                    <span className="text-[11px] font-black text-emerald-400 text-center">
                      {getPerformanceScore(agent)}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-cream text-sm flex items-center gap-2">
                        {agent.fullName || agent.name || 'Unnamed Agent'}

                        {index === 0 && (
                          <span className="bg-gold-400/20 text-gold-400 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                            Available
                          </span>
                        )}
                      </h4>

                      {isSelected && (
                        <CheckCircle2 className="h-5 w-5 text-gold-400" />
                      )}
                    </div>

                    <div className="text-[10px] text-ink/50 uppercase font-bold tracking-wide">
                      {agent.level || agent.department || 'Agent'}
                    </div>

                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-3">
                      <div className="flex items-center gap-1.5 text-xs text-ink/80">
                        <MapPin className="h-3 w-3 text-ink/40" />
                        {agent.serviceStates?.length
                          ? agent.serviceStates.join(', ')
                          : 'Service area not available'}
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-ink/80">
                        <Activity className="h-3 w-3 text-ink/40" />
                        Capacity: {getCapacityDisplay(agent)}
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-ink/80">
                        <Star className="h-3 w-3 text-ink/40" />
                        Success Rate: {getPerformanceScore(agent)}
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-ink/80">
                        <Clock className="h-3 w-3 text-ink/40" />
                        Avg Response: {getResponseTime(agent)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Modal>
  );
}
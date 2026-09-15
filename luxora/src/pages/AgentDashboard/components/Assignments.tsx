import { useEffect, useState } from 'react';
import { Package, Clock, Filter, AlertCircle } from 'lucide-react';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { GhostButton } from '../../../components/ui/ui';
import { EmptyState } from '../../../components/layout/EmptyState';
import { useToast } from '../../../contexts/ToastContext';
import AssignmentDetailModal from './modals/AssignmentDetailModal';
import DeclineAssignmentModal from './modals/DeclineAssignmentModal';
import { agentApi } from '../../../api/agent.api';

interface AssignmentType {
  id: string;
  propertyId: string;
  propertyTitle: string;
  coverImage: string;
  location: string;
  propertyType: string;
  transactionType: string;
  owner: string;
  agency: string;
  assignedBy: string;
  assignmentDate: string;
  responseDeadline: string;
  priority: string;
  verificationStatus: string;
  estimatedCommission: string;
  assignmentStatus: string;
  notes: string;
  documents: { name: string; type: string }[];
  images: string[];
}

export default function Assignments() {
  const { showToast } = useToast();

  // Store the current assignment search text.
  const [searchQuery, setSearchQuery] = useState('');

  // Store real assignments returned by the backend.
  const [assignments, setAssignments] = useState<AssignmentType[]>([]);

  // Track whether the initial assignment request is still running.
  const [loading, setLoading] = useState(true);

  // Track the assignment currently opened in the details modal.
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(
    null,
  );

  // Track the assignment currently being declined.
  const [declineAssignmentId, setDeclineAssignmentId] = useState<string | null>(
    null,
  );

  // Track whether a decline request is currently being submitted.
  const [decliningAssignment, setDecliningAssignment] = useState(false);

  useEffect(() => {
    // Load the Properties assigned to the authenticated Agent.
    const loadAssignments = async () => {
      try {
        // Request the Agent's real assignments from the backend.
        const response = await agentApi.getMyAssignments();

        // Read the unwrapped Property collection returned by the HTTP client.
        const properties = response.properties || [];

        // Convert backend Property records into the shape expected by the existing UI.
        const mappedAssignments: AssignmentType[] = properties.map(
          (property: any) => ({
            // Use the MongoDB Property ID as the stable UI assignment ID.
            id: property._id,

            // Keep the Property ID separately for future assignment actions.
            propertyId: property._id,

            // Use the Property title directly from MongoDB.
            propertyTitle: property.title || 'Untitled Property',

            // Prefer the cover image and fall back to the first gallery image.
            coverImage:
              property.coverImage || property.images?.[0] || '',

            // Build a readable location from the available Property fields.
            location:
              [property.area, property.city, property.state]
                .filter(Boolean)
                .join(', ') || 'Location unavailable',

            // Preserve the real Property type.
            propertyType: property.propertyType || 'Unknown',

            // Preserve the real transaction type.
            transactionType: property.transactionType || 'Unknown',

            // Use the populated Owner name when one exists.
            owner: property.owner?.fullName || 'Private Owner',

            // Use the populated Agency name when one exists.
            agency: property.agency?.name || '—',

            // Use the populated assigning User name when one exists.
            assignedBy: property.assignedBy?.fullName || '—',

            // Format the real assignment timestamp for display.
            assignmentDate: property.assignedAt
              ? new Date(property.assignedAt).toLocaleString()
              : '—',

            // The current backend does not provide an assignment deadline yet.
            responseDeadline: 'Not set',

            // The current backend does not provide assignment priority yet.
            priority: 'Standard',

            // Use the real Property verification level.
            verificationStatus:
              property.verificationLevel || 'Unverified',

            // Commission calculation is not yet available from the backend.
            estimatedCommission: 'Not calculated',

            // Preserve the real assignment status.
            assignmentStatus:
              property.assignmentStatus || 'Agent Assigned',

            // Use the Property description as the available assignment note.
            notes: property.description || '',

            // Support the current backend document shape and the older UI shape.
            documents: (property.documents || []).map(
              (document: any) => ({
                name:
                  document.title ||
                  document.name ||
                  'Document',
                type:
                  document.type ||
                  'file',
              }),
            ),

            // Preserve the Property gallery images.
            images: property.images || [],
          }),
        );

        // Replace the previous assignment collection with backend data.
        setAssignments(mappedAssignments);
      } catch (error) {
        // Notify the Agent when the assignment request fails.
        showToast({
          type: 'error',
          title: 'Unable to load assignments',
          description:
            'We could not retrieve your assigned properties.',
        });
      } finally {
        // End the loading state after the request completes.
        setLoading(false);
      }
    };

    // Run the assignment request when the component mounts.
    loadAssignments();
  }, [showToast]);

  // Find the assignment currently selected in the details modal.
  const selectedAssignment =
    assignments.find(
      (assignment) => assignment.id === selectedAssignmentId,
    ) || null;

  // Filter assignments using the existing search field.
  const filteredAssignments = assignments.filter(
    (assignment) =>
      assignment.propertyTitle
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      assignment.location
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  // Accept a Property assignment through the real backend API.
  const handleAccept = async (id: string) => {
    try {
      // Send the acceptance request to the backend.
      await agentApi.acceptAssignment(id);

      // Remove the accepted assignment from the pending queue.
      setAssignments((prev) =>
        prev.filter((assignment) => assignment.id !== id),
      );

      // Close the details modal after successful acceptance.
      setSelectedAssignmentId(null);

      // Show successful feedback to the Agent.
      showToast({
        type: 'success',
        title: 'Assignment Accepted',
        description:
          'The property assignment has been accepted successfully.',
      });
    } catch (error) {
      // Keep the assignment visible when the API request fails.
      showToast({
        type: 'error',
        title: 'Unable to accept assignment',
        description:
          'The property assignment could not be accepted. Please try again.',
      });
    }
  };

  // Open the existing decline modal for a selected assignment.
  const openDeclineModal = (id: string) => {
    // Close the details modal before opening the decline modal.
    setSelectedAssignmentId(null);

    // Store the assignment being declined.
    setDeclineAssignmentId(id);
  };

  // Decline a Property assignment through the real backend API.
  const handleDecline = async (reason: string) => {
    // Stop when no assignment is currently selected for decline.
    if (!declineAssignmentId) {
      return;
    }

    try {
      // Prevent duplicate decline submissions while the request is running.
      setDecliningAssignment(true);

      // Send the decline reason to the backend.
      await agentApi.declineAssignment(
        declineAssignmentId,
        reason,
      );

      // Remove the declined assignment from the pending queue.
      setAssignments((prev) =>
        prev.filter(
          (assignment) =>
            assignment.id !== declineAssignmentId,
        ),
      );

      // Close the decline modal after successful submission.
      setDeclineAssignmentId(null);

      // Show successful feedback to the Agent.
      showToast({
        type: 'success',
        title: 'Assignment Declined',
        description:
          'The property assignment has been declined successfully.',
      });
    } catch (error) {
      // Keep the decline modal open when the backend request fails.
      showToast({
        type: 'error',
        title: 'Unable to decline assignment',
        description:
          'The property assignment could not be declined. Please try again.',
      });
    } finally {
      // Clear the decline submission state.
      setDecliningAssignment(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <DashboardHeader
        name="Incoming Assignments"
        subtitle="Review and accept new property assignments assigned to your portfolio."
      />

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <DataTableToolbar
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder="Search assignments..."
            />

            <GhostButton className="hidden sm:flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </GhostButton>
          </div>

          {loading ? (
            // Keep the table area visually stable while assignments are loading.
            <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-8 text-center">
              <div className="text-sm text-ink/60">
                Loading assignments...
              </div>
            </div>
          ) : filteredAssignments.length > 0 ? (
            <DataTable
              keyExtractor={(item: AssignmentType) => item.id}
              columns={[
                {
                  header: 'Property',
                  render: (assignment: AssignmentType) => (
                    <div className="flex items-center gap-3">
                      {assignment.coverImage ? (
                        <img
                          src={assignment.coverImage}
                          alt={assignment.propertyTitle}
                          className="h-10 w-12 rounded-lg object-cover border border-white/10"
                        />
                      ) : (
                        <div className="h-10 w-12 rounded-lg border border-white/10 bg-navy-900/60 flex items-center justify-center">
                          <Package className="h-4 w-4 text-ink/40" />
                        </div>
                      )}

                      <div>
                        <div className="font-semibold text-cream">
                          {assignment.propertyTitle}
                        </div>

                        <div className="text-xs text-ink/60">
                          {assignment.location}
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  header: 'Assignment Details',
                  render: (assignment: AssignmentType) => (
                    <div>
                      <div className="text-sm font-medium text-cream">
                        {assignment.agency}
                      </div>

                      <div className="text-xs text-ink/60">
                        By: {assignment.assignedBy}
                      </div>
                    </div>
                  ),
                },
                {
                  header: 'Commission',
                  render: (assignment: AssignmentType) => (
                    <div className="font-bold text-emerald-400">
                      {assignment.estimatedCommission}
                    </div>
                  ),
                },
                {
                  header: 'Status & Deadline',
                  render: (assignment: AssignmentType) => (
                    <div>
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border-yellow-400/20 bg-yellow-400/10 text-yellow-400">
                        {assignment.assignmentStatus}
                      </span>

                      <div className="flex items-center gap-1 text-xs text-rose-400 mt-1">
                        <Clock className="h-3 w-3" />
                        {assignment.responseDeadline}
                      </div>
                    </div>
                  ),
                },
                {
                  header: 'Actions',
                  render: (assignment: AssignmentType) => (
                    <GhostButton
                      onClick={() =>
                        setSelectedAssignmentId(
                          assignment.id,
                        )
                      }
                      className="h-8 px-3 text-xs"
                    >
                      View Details
                    </GhostButton>
                  ),
                },
              ]}
              data={filteredAssignments}
              onRowClick={(assignment: AssignmentType) =>
                setSelectedAssignmentId(assignment.id)
              }
            />
          ) : (
            <EmptyState
              icon={
                <Package className="h-8 w-8 text-gold-400" />
              }
              title="No pending assignments."
              description="You have responded to all incoming property assignments."
            />
          )}
        </div>

        {/* Intelligence Side Panel */}
        <div className="space-y-6 lg:col-span-1">
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-gold-400" />
              Assignment Queue
            </h3>

            <div className="space-y-4 text-sm text-ink/80 leading-relaxed">
              <p>
                Assignments require your action. You must accept or
                decline them before the response deadline.
              </p>

              <p>
                If a deadline expires, the property will
                automatically be returned to the Agency for
                reassignment.
              </p>
            </div>
          </div>
        </div>
      </div>

      <AssignmentDetailModal
        isOpen={!!selectedAssignmentId}
        onClose={() => setSelectedAssignmentId(null)}
        assignment={selectedAssignment}
        onAccept={handleAccept}
        onDecline={openDeclineModal}
      />

      <DeclineAssignmentModal
        isOpen={!!declineAssignmentId}
        onClose={() => {
          // Prevent closing the modal while the decline request is submitting.
          if (!decliningAssignment) {
            setDeclineAssignmentId(null);
          }
        }}
        onConfirm={handleDecline}
      />
    </div>
  );
}
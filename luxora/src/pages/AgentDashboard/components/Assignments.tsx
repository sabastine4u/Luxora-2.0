import { useState } from 'react';
import { Package, Clock, Filter, AlertCircle } from 'lucide-react';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { GhostButton } from '../../../components/ui/ui';
import { EmptyState } from '../../../components/layout/EmptyState';
import { useToast } from '../../../contexts/ToastContext';
import AssignmentDetailModal from './modals/AssignmentDetailModal';
import DeclineAssignmentModal from './modals/DeclineAssignmentModal';

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
  const [searchQuery, setSearchQuery] = useState('');
  
  const [assignments, setAssignments] = useState<AssignmentType[]>([
    {
      id: 'ASN-001',
      propertyId: 'PROP-901',
      propertyTitle: 'Banana Island Waterfront Villa',
      coverImage: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800',
      location: 'Banana Island, Lagos',
      propertyType: 'Villa',
      transactionType: 'Sale',
      owner: 'Chief Adeleke',
      agency: 'Meridian Luxury',
      assignedBy: 'Marcus Sterling',
      assignmentDate: 'Today, 09:30 AM',
      responseDeadline: 'Tomorrow, 09:30 AM',
      priority: 'High',
      verificationStatus: 'Verified',
      estimatedCommission: '₦12,500,000',
      assignmentStatus: 'Pending Acceptance',
      notes: 'High net worth client, requires immediate follow up once accepted. Owner prefers weekend viewings only.',
      documents: [{ name: 'Title Deed', type: 'pdf' }, { name: 'Inspection Report', type: 'pdf' }],
      images: [
        'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800'
      ]
    },
    {
      id: 'ASN-002',
      propertyId: 'PROP-902',
      propertyTitle: 'Eko Atlantic Condo',
      coverImage: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800',
      location: 'Victoria Island, Lagos',
      propertyType: 'Apartment',
      transactionType: 'Rent',
      owner: 'Sarah Johnson',
      agency: 'Meridian Luxury',
      assignedBy: 'System Auto-Route',
      assignmentDate: 'Yesterday, 14:15 PM',
      responseDeadline: 'Today, 14:15 PM',
      priority: 'Standard',
      verificationStatus: 'Verified',
      estimatedCommission: '₦850,000',
      assignmentStatus: 'Pending Acceptance',
      notes: 'Standard corporate lease. Key is with security at the main gate.',
      documents: [{ name: 'Corporate Lease Agreement Draft', type: 'pdf' }],
      images: [
        'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800'
      ]
    }
  ]);

  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [declineAssignmentId, setDeclineAssignmentId] = useState<string | null>(null);

  const selectedAssignment = assignments.find(a => a.id === selectedAssignmentId) || null;

  const filteredAssignments = assignments.filter(a => 
    a.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAccept = (id: string) => {
    setAssignments(prev => prev.filter(a => a.id !== id));
    setSelectedAssignmentId(null);
    showToast({
      type: 'success',
      title: 'Assignment Accepted',
      description: 'The property has been added to My Listings.'
    });
  };

  const openDeclineModal = (id: string) => {
    setSelectedAssignmentId(null);
    setDeclineAssignmentId(id);
  };

  const handleDecline = (reason: string) => {
    if (declineAssignmentId) {
      setAssignments(prev => prev.filter(a => a.id !== declineAssignmentId));
      setDeclineAssignmentId(null);
      showToast({
        type: 'success',
        title: 'Assignment Declined',
        description: `You have declined the assignment. Reason: ${reason}`
      });
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
            <GhostButton className="hidden sm:flex items-center gap-2"><Filter className="h-4 w-4" /> Filter</GhostButton>
          </div>

          {filteredAssignments.length > 0 ? (
            <DataTable 
              keyExtractor={(item: AssignmentType) => item.id}
              columns={[
                {
                  header: 'Property',
                  render: (assignment: AssignmentType) => (
                    <div className="flex items-center gap-3">
                      <img src={assignment.coverImage} alt="Property" className="h-10 w-12 rounded-lg object-cover border border-white/10" />
                      <div>
                        <div className="font-semibold text-cream">{assignment.propertyTitle}</div>
                        <div className="text-xs text-ink/60">{assignment.location}</div>
                      </div>
                    </div>
                  )
                },
                {
                  header: 'Assignment Details',
                  render: (assignment: AssignmentType) => (
                    <div>
                      <div className="text-sm font-medium text-cream">{assignment.agency}</div>
                      <div className="text-xs text-ink/60">By: {assignment.assignedBy}</div>
                    </div>
                  )
                },
                {
                  header: 'Commission',
                  render: (assignment: AssignmentType) => (
                    <div className="font-bold text-emerald-400">{assignment.estimatedCommission}</div>
                  )
                },
                {
                  header: 'Status & Deadline',
                  render: (assignment: AssignmentType) => (
                    <div>
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border-yellow-400/20 bg-yellow-400/10 text-yellow-400">
                        {assignment.assignmentStatus}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-rose-400 mt-1">
                        <Clock className="h-3 w-3" /> {assignment.responseDeadline}
                      </div>
                    </div>
                  )
                },
                {
                  header: 'Actions',
                  render: (assignment: AssignmentType) => (
                    <GhostButton 
                      onClick={() => setSelectedAssignmentId(assignment.id)}
                      className="h-8 px-3 text-xs"
                    >
                      View Details
                    </GhostButton>
                  )
                }
              ]}
              data={filteredAssignments}
              onRowClick={(assignment: AssignmentType) => setSelectedAssignmentId(assignment.id)}
            />
          ) : (
            <EmptyState
              icon={<Package className="h-8 w-8 text-gold-400" />}
              title="No pending assignments."
              description="You have responded to all incoming property assignments."
            />
          )}
        </div>

        {/* Intelligence Side Panel */}
        <div className="space-y-6 lg:col-span-1">
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-gold-400" /> Assignment Queue
            </h3>
            <div className="space-y-4 text-sm text-ink/80 leading-relaxed">
              <p>
                Assignments require your action. You must accept or decline them before the response deadline.
              </p>
              <p>
                If a deadline expires, the property will automatically be returned to the Agency for reassignment.
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
        onClose={() => setDeclineAssignmentId(null)}
        onConfirm={handleDecline}
      />
    </div>
  );
}

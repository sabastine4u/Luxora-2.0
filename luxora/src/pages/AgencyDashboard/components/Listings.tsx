import { useEffect, useMemo, useState } from 'react';
import {
  Filter,
  Edit,
  Trash2,
  MapPin,
  Building2,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Share2,
  RefreshCw,
  ShieldCheck,
  Calendar,
  UserCheck,
  X,
  Save,
} from 'lucide-react';

import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal';

import { propertyApi } from '../../../api/property.api';
import { useToast } from '../../../contexts/ToastContext';
import { SmartAgentMatchModal } from './modals/SmartAgentMatchModal';

export default function Listings() {
  const { showToast } = useToast();

  // Store the current search query.
  const [searchQuery, setSearchQuery] = useState('');

  // Store the real Agency Properties returned by MongoDB.
  const [listings, setListings] = useState<any[]>([]);

  // Track the Property currently displayed in the detail drawer.
  const [selectedListing, setSelectedListing] =
    useState<any | null>(null);

  // Track whether the detail drawer is open.
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Track whether the real Property roster is loading.
  const [isLoadingListings, setIsLoadingListings] =
    useState(true);

  // Store real per-property view analytics returned by the backend.
  const [listingAnalytics, setListingAnalytics] =
    useState<Record<string, { views: number }>>({});

  // Store the real Agency inquiries returned by the backend.
  const [agencyInquiries, setAgencyInquiries] =
    useState<any[]>([]);

  // Track whether analytics are still loading.
  const [isLoadingAnalytics, setIsLoadingAnalytics] =
    useState(true);

  // Track the rows selected for bulk actions.
  const [selectedIds, setSelectedIds] =
    useState<Set<string>>(new Set());

  // Track whether the real edit form is active.
  const [isEditMode, setIsEditMode] = useState(false);

  // Store editable fields for the selected real Property.
  const [editForm, setEditForm] = useState<any>({});

  // Track whether the edit request is being submitted.
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Track whether the Agent assignment modal is open.
  const [isMatchModalOpen, setIsMatchModalOpen] =
    useState(false);

  // Track which Property will be assigned to an Agent.
  const [assignmentListing, setAssignmentListing] =
    useState<any | null>(null);

  // Track whether the filter controls are expanded.
  const [showFilters, setShowFilters] =
    useState(false);

  // Store the real client-side filter selections.
  const [statusFilter, setStatusFilter] =
    useState('All');

  const [assignmentFilter, setAssignmentFilter] =
    useState('All');

  const [propertyTypeFilter, setPropertyTypeFilter] =
    useState('All');

  // Confirmation dialog state.
  const [confirmAction, setConfirmAction] =
    useState<{
      isOpen: boolean;
      title: string;
      desc: string;
      action: () => void;
      confirmText?: string;
      danger?: boolean;
    }>({
      isOpen: false,
      title: '',
      desc: '',
      action: () => { },
      confirmText: 'Confirm',
      danger: false,
    });

  // Fetch the real Property roster belonging to this Agency.
  const fetchListings = async () => {
    try {
      // Show loading state before requesting the backend.
      setIsLoadingListings(true);

      // Get the Agency's real Properties.
      const response =
        await propertyApi.getAgencyProperties();

      // The shared HTTP client normally unwraps the API envelope.
      // This fallback also supports a normal Axios response.
      const rawResponse = response as any;

      const propertyList =
        Array.isArray(rawResponse?.properties)
          ? rawResponse.properties
          : Array.isArray(
            rawResponse?.data?.properties,
          )
            ? rawResponse.data.properties
            : [];

      // Store the actual MongoDB Property documents.
      setListings(propertyList);

      // Remove selected IDs that are no longer present.
      setSelectedIds((previousSelection) => {
        const availableIds = new Set(
          propertyList.map((property) =>
            String(property._id),
          ),
        );

        return new Set(
          [...previousSelection].filter((id) =>
            availableIds.has(id),
          ),
        );
      });
    } catch (error) {
      // Log the actual API failure.
      console.error(
        'Failed to load Agency listings:',
        error,
      );

      // Do not create fake fallback records.
      setListings([]);
      setSelectedIds(new Set());

      showToast({
        type: 'error',
        title: 'Listings Could Not Be Loaded',
        description:
          error instanceof Error
            ? error.message
            : 'Unable to load the Agency property roster.',
      });
    } finally {
      // Always stop the loading state.
      setIsLoadingListings(false);
    }
  };

  // Fetch the real Agency listing analytics and Inquiry records.
  const fetchListingAnalytics = async () => {
    try {
      // Show the analytics loading state.
      setIsLoadingAnalytics(true);

      // Request real PropertyView totals from the backend.
      const analyticsResponse =
        await propertyApi.getAgencyPropertyAnalytics();

      const rawAnalyticsResponse =
        analyticsResponse as any;

      // Support the shared HTTP client's unwrapped response shape.
      const analytics =
        rawAnalyticsResponse?.analytics ||
        rawAnalyticsResponse?.data?.analytics;

      // Store real per-property view totals.
      setListingAnalytics(
        analytics?.byProperty || {},
      );

      // Request the Agency's real inquiry collection.
      // The same authenticated Agency session is used automatically by the HTTP client.
      const inquiriesResponse =
        await propertyApi.getAgencyInquiries();

      const rawInquiriesResponse =
        inquiriesResponse as any;

      // Support the shared HTTP client's unwrapped response shape.
      const inquiries =
        rawInquiriesResponse?.inquiries ||
        rawInquiriesResponse?.data?.inquiries ||
        [];

      // Store the real Inquiry records.
      setAgencyInquiries(inquiries);
    } catch (error) {
      // Log the actual analytics failure instead of inventing metrics.
      console.error(
        'Failed to load Agency listing analytics:',
        error,
      );

      // Keep the UI honest when analytics cannot be retrieved.
      setListingAnalytics({});
      setAgencyInquiries([]);

      showToast({
        type: 'error',
        title: 'Analytics Could Not Be Loaded',
        description:
          error instanceof Error
            ? error.message
            : 'Unable to load listing analytics.',
      });
    } finally {
      // Always stop the analytics loading state.
      setIsLoadingAnalytics(false);
    }
  };

  // Load the real listings and their analytics when the page opens.
  useEffect(() => {
    void fetchListings();
    void fetchListingAnalytics();
  }, []);

  // Count real inquiries belonging to one Property.
  const getListingEnquiryCount = (propertyId: string) => {
    return agencyInquiries.filter(
      (inquiry) =>
        String(
          inquiry.property?._id ||
          inquiry.property ||
          '',
        ) === propertyId,
    ).length;
  };

  // Filter the real Property roster using real Property fields.
  const filteredListings = useMemo(() => {
    const query =
      searchQuery.trim().toLowerCase();

    return listings.filter((listing) => {
      const title = String(
        listing.title || '',
      ).toLowerCase();

      const area = String(
        listing.area || '',
      ).toLowerCase();

      const city = String(
        listing.city || '',
      ).toLowerCase();

      const state = String(
        listing.state || '',
      ).toLowerCase();

      const propertyType = String(
        listing.propertyType || '',
      ).toLowerCase();

      const agentName = String(
        listing.agent?.fullName || '',
      ).toLowerCase();

      const ownerName = String(
        listing.owner?.fullName || '',
      ).toLowerCase();

      const matchesSearch =
        !query ||
        title.includes(query) ||
        area.includes(query) ||
        city.includes(query) ||
        state.includes(query) ||
        propertyType.includes(query) ||
        agentName.includes(query) ||
        ownerName.includes(query);

      const matchesStatus =
        statusFilter === 'All' ||
        listing.status === statusFilter;

      const matchesAssignment =
        assignmentFilter === 'All' ||
        listing.assignmentStatus ===
        assignmentFilter;

      const matchesPropertyType =
        propertyTypeFilter === 'All' ||
        listing.propertyType ===
        propertyTypeFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesAssignment &&
        matchesPropertyType
      );
    });
  }, [
    listings,
    searchQuery,
    statusFilter,
    assignmentFilter,
    propertyTypeFilter,
  ]);

  // Build the Property status options directly from real records.
  const statusOptions = useMemo(() => {
    return [
      'All',
      ...Array.from(
        new Set(
          listings
            .map((listing) =>
              String(listing.status || ''),
            )
            .filter(Boolean),
        ),
      ),
    ];
  }, [listings]);

  // Build the assignment options directly from real records.
  const assignmentOptions = useMemo(() => {
    return [
      'All',
      ...Array.from(
        new Set(
          listings
            .map((listing) =>
              String(
                listing.assignmentStatus || '',
              ),
            )
            .filter(Boolean),
        ),
      ),
    ];
  }, [listings]);

  // Build Property Type filter options from real records.
  const propertyTypeOptions = useMemo(() => {
    return [
      'All',
      ...Array.from(
        new Set(
          listings
            .map((listing) =>
              String(
                listing.propertyType || '',
              ),
            )
            .filter(Boolean),
        ),
      ),
    ];
  }, [listings]);

  // Calculate real lifecycle counts from MongoDB data.
  const totalListings = listings.length;

  const publishedListings = listings.filter(
    (listing) =>
      String(listing.status || '').toLowerCase() ===
      'published',
  ).length;

  const assignedListings = listings.filter(
    (listing) =>
      listing.assignmentStatus ===
      'Agent Assigned' ||
      Boolean(listing.agent?._id),
  ).length;

  const pendingAssignments = listings.filter(
    (listing) =>
      listing.assignmentStatus ===
      'Pending Agency Assignment' ||
      listing.assignmentStatus ===
      'Agency Assigned',
  ).length;

  // Toggle an individual Property selection.
  const toggleSelection = (id: string) => {
    const nextSelection = new Set(
      selectedIds,
    );

    if (nextSelection.has(id)) {
      nextSelection.delete(id);
    } else {
      nextSelection.add(id);
    }

    setSelectedIds(nextSelection);
  };

  // Select or deselect all visible Properties.
  const toggleAll = () => {
    const visibleIds = filteredListings.map(
      (listing) => String(listing._id),
    );

    const allVisibleSelected =
      visibleIds.length > 0 &&
      visibleIds.every((id) =>
        selectedIds.has(id),
      );

    if (allVisibleSelected) {
      setSelectedIds((previousSelection) => {
        const nextSelection = new Set(
          previousSelection,
        );

        visibleIds.forEach((id) =>
          nextSelection.delete(id),
        );

        return nextSelection;
      });

      return;
    }

    setSelectedIds((previousSelection) => {
      const nextSelection = new Set(
        previousSelection,
      );

      visibleIds.forEach((id) =>
        nextSelection.add(id),
      );

      return nextSelection;
    });
  };

  // Open the drawer for a real Property.
  const handleViewListing = (listing: any) => {
    setSelectedListing(listing);
    setIsEditMode(false);
    setIsDrawerOpen(true);
  };

  // Format a real Property price.
  const formatPrice = (listing: any) => {
    if (
      listing.price === null ||
      listing.price === undefined
    ) {
      return 'Price on Request';
    }

    const currency =
      listing.currency || 'NGN';

    return `${currency} ${Number(
      listing.price,
    ).toLocaleString()}`;
  };

  // Build the location from real Property fields.
  const formatLocation = (listing: any) => {
    return [
      listing.area,
      listing.city,
      listing.state,
    ]
      .filter(Boolean)
      .join(', ');
  };

  // Use the real cover image or first uploaded Property image.
  const getPropertyImage = (listing: any) => {
    return (
      listing.coverImage ||
      listing.images?.[0] ||
      null
    );
  };

  // Open the real edit form using the selected Property.
  const openEditMode = (listing: any) => {
    // Populate the form from the real MongoDB document.
    setEditForm({
      title: listing.title || '',
      description:
        listing.description || '',
      propertyType:
        listing.propertyType || '',
      propertySubType:
        listing.propertySubType || '',
      transactionType:
        listing.transactionType || 'buy',
      country:
        listing.country || 'Nigeria',
      state:
        listing.state || '',
      city:
        listing.city || '',
      area:
        listing.area || '',
      address:
        listing.address || '',
      estateName:
        listing.estateName || '',
      landmark:
        listing.landmark || '',
      bedrooms:
        listing.bedrooms ?? 0,
      bathrooms:
        listing.bathrooms ?? 0,
      toilets:
        listing.toilets ?? 0,
      parkingSpaces:
        listing.parkingSpaces ?? 0,
      propertySize:
        listing.propertySize ?? '',
      propertySizeUnit:
        listing.propertySizeUnit || 'sqm',
      furnishing:
        listing.furnishing || '',
      propertyCondition:
        listing.propertyCondition || '',
      price:
        listing.price ?? '',
      currency:
        listing.currency || 'NGN',
      priceType:
        listing.priceType || 'fixed',
      priceFrequency:
        listing.priceFrequency || 'total',
      isNegotiable:
        Boolean(listing.isNegotiable),
      rentAmount:
        listing.rentAmount ?? '',
      serviceCharge:
        listing.serviceCharge ?? '',
      agencyFee:
        listing.agencyFee ?? '',
      legalFee:
        listing.legalFee ?? '',
      cautionDeposit:
        listing.cautionDeposit ?? '',
      otherCharges:
        listing.otherCharges ?? '',
      leaseDuration:
        listing.leaseDuration || '',
      listingTier:
        listing.listingTier || 'Basic',
      featuredLevel:
        listing.featuredLevel || 'Standard',
      availabilityDate:
        listing.availabilityDate
          ? new Date(
            listing.availabilityDate,
          )
            .toISOString()
            .slice(0, 10)
          : '',
      availabilityStatus:
        listing.availabilityStatus ||
        'Available',
    });

    // Keep the selected Property open in the drawer.
    setSelectedListing(listing);

    // Switch the drawer into edit mode.
    setIsEditMode(true);
  };

  // Update one edit-form field.
  const updateEditField = (
    field: string,
    value: any,
  ) => {
    setEditForm((previous: any) => ({
      ...previous,
      [field]: value,
    }));
  };

  // Save the edited Property through the real Agency endpoint.
  const saveEditedListing = async () => {
    if (!selectedListing?._id) {
      return;
    }

    try {
      // Prevent duplicate submissions.
      setIsSavingEdit(true);

      // Build the Property update payload.
      const payload = {
        ...editForm,

        // Convert numeric form values to numbers.
        bedrooms:
          editForm.bedrooms === ''
            ? 0
            : Number(editForm.bedrooms),

        bathrooms:
          editForm.bathrooms === ''
            ? 0
            : Number(editForm.bathrooms),

        toilets:
          editForm.toilets === ''
            ? 0
            : Number(editForm.toilets),

        parkingSpaces:
          editForm.parkingSpaces === ''
            ? 0
            : Number(editForm.parkingSpaces),

        propertySize:
          editForm.propertySize === ''
            ? null
            : Number(editForm.propertySize),

        price:
          editForm.price === ''
            ? null
            : Number(editForm.price),

        rentAmount:
          editForm.rentAmount === ''
            ? null
            : Number(editForm.rentAmount),

        serviceCharge:
          editForm.serviceCharge === ''
            ? null
            : Number(editForm.serviceCharge),

        agencyFee:
          editForm.agencyFee === ''
            ? null
            : Number(editForm.agencyFee),

        legalFee:
          editForm.legalFee === ''
            ? null
            : Number(editForm.legalFee),

        cautionDeposit:
          editForm.cautionDeposit === ''
            ? null
            : Number(editForm.cautionDeposit),

        otherCharges:
          editForm.otherCharges === ''
            ? null
            : Number(editForm.otherCharges),

        // Empty availability date becomes null.
        availabilityDate:
          editForm.availabilityDate || null,
      };

      // Send the edited Property to MongoDB.
      const response =
        await propertyApi.updateAgencyProperty(
          String(selectedListing._id),
          payload,
        );

      const rawResponse =
        response as any;

      // Support the unwrapped API response.
      const updatedProperty =
        rawResponse?.property ||
        rawResponse?.data?.property;

      // Reload the real portfolio from MongoDB.
      await fetchListings();

      // Update the drawer with the returned record.
      if (updatedProperty) {
        setSelectedListing(
          updatedProperty,
        );
      }

      // Exit edit mode after successful save.
      setIsEditMode(false);

      showToast({
        type: 'success',
        title: 'Listing Updated',
        description:
          'The Property was updated successfully.',
      });
    } catch (error: any) {
      // Log the actual backend error.
      console.error(
        'Failed to update Agency listing:',
        error,
      );

      showToast({
        type: 'error',
        title: 'Update Failed',
        description:
          error?.response?.data?.message ||
          error?.message ||
          'The Property could not be updated.',
      });
    } finally {
      // Re-enable the Save action.
      setIsSavingEdit(false);
    }
  };

  // Change the Property's real featured level.
  const updateFeaturedLevel = async (
    listing: any,
    featuredLevel:
      | 'Standard'
      | 'Premium'
      | 'Exclusive',
  ) => {
    try {
      // Update only the featured-level field.
      await propertyApi.updateAgencyProperty(
        String(listing._id),
        {
          featuredLevel,
        },
      );

      // Reload the real Property collection.
      await fetchListings();

      // Keep the open drawer synchronized.
      setSelectedListing(
        (previous: any) =>
          previous
            ? {
              ...previous,
              featuredLevel,
            }
            : previous,
      );

      showToast({
        type: 'success',
        title:
          featuredLevel === 'Standard'
            ? 'Listing Unfeatured'
            : 'Listing Featured',
        description:
          featuredLevel === 'Standard'
            ? 'The listing is now using Standard visibility.'
            : `The listing is now ${featuredLevel}.`,
      });
    } catch (error: any) {
      // Log the actual backend failure.
      console.error(
        'Failed to update featured level:',
        error,
      );

      showToast({
        type: 'error',
        title: 'Feature Update Failed',
        description:
          error?.response?.data?.message ||
          error?.message ||
          'The featured level could not be updated.',
      });
    }
  };

  // Ask for confirmation before changing the featured level.
  const requestFeatureToggle = (
    listing: any,
  ) => {
    const currentlyFeatured =
      listing.featuredLevel &&
      listing.featuredLevel !== 'Standard';

    setConfirmAction({
      isOpen: true,
      title: currentlyFeatured
        ? 'Unfeature Listing'
        : 'Feature Listing',
      desc: currentlyFeatured
        ? 'Return this listing to Standard visibility?'
        : 'Set this listing to Premium visibility?',
      confirmText:
        currentlyFeatured
          ? 'Unfeature'
          : 'Feature',
      danger: false,
      action: () =>
        updateFeaturedLevel(
          listing,
          currentlyFeatured
            ? 'Standard'
            : 'Premium',
        ),
    });
  };

  // Archive a real Property.
  const archiveListing = async (
    listingId: string,
  ) => {
    try {
      // Set the lifecycle status to Archived in MongoDB.
      await propertyApi.updateAgencyProperty(
        listingId,
        {
          status: 'Archived',
        },
      );

      // Reload the real Agency roster.
      await fetchListings();

      // Close the drawer if it was open.
      setIsDrawerOpen(false);
      setSelectedListing(null);

      showToast({
        type: 'success',
        title: 'Listing Archived',
        description:
          'The Property has been archived successfully.',
      });
    } catch (error: any) {
      // Log the actual backend failure.
      console.error(
        'Failed to archive listing:',
        error,
      );

      showToast({
        type: 'error',
        title: 'Archive Failed',
        description:
          error?.response?.data?.message ||
          error?.message ||
          'The Property could not be archived.',
      });
    }
  };

  // Ask for confirmation before archiving.
  const requestArchive = (
    listing: any,
  ) => {
    setConfirmAction({
      isOpen: true,
      title: 'Archive Listing',
      desc:
        'Are you sure you want to archive this listing?',
      confirmText: 'Archive',
      danger: true,
      action: () =>
        archiveListing(
          String(listing._id),
        ),
    });
  };

  // Open the real Agent assignment workflow.
  const openAgentAssignment = (
    listing: any,
  ) => {
    setAssignmentListing(listing);
    setIsMatchModalOpen(true);
  };

  // Publish one real Property.
  const publishListing = async (
    listingId: string,
  ) => {
    try {
      // Call the existing backend publish workflow.
      await propertyApi.publishProperty(
        listingId,
      );

      // Refresh the Property collection.
      await fetchListings();

      // Close the confirmation dialog.
      setConfirmAction({
        isOpen: false,
        title: '',
        desc: '',
        action: () => { },
        confirmText: 'Confirm',
        danger: false,
      });

      showToast({
        type: 'success',
        title: 'Listing Published',
        description:
          'The Property was published successfully.',
      });
    } catch (error: any) {
      // Log the actual publish error.
      console.error(
        'Failed to publish listing:',
        error,
      );

      showToast({
        type: 'error',
        title: 'Publish Failed',
        description:
          error?.response?.data?.message ||
          error?.message ||
          'The Property could not be published.',
      });
    }
  };

  // Ask for confirmation before publishing.
  const requestPublish = (
    listingId: string,
  ) => {
    setConfirmAction({
      isOpen: true,
      title: 'Publish Listing',
      desc:
        'Are you sure you want to publish this listing?',
      confirmText: 'Publish',
      danger: false,
      action: () =>
        publishListing(
          listingId,
        ),
    });
  };

  // Publish every selected unpublished Property.
  const publishSelectedListings = async () => {
    try {
      const selectedListings =
        listings.filter((listing) =>
          selectedIds.has(
            String(listing._id),
          ),
        );

      const unpublishedListings =
        selectedListings.filter(
          (listing) =>
            String(
              listing.status || '',
            ).toLowerCase() !==
            'published',
        );

      if (
        unpublishedListings.length ===
        0
      ) {
        showToast({
          type: 'info',
          title: 'Nothing to Publish',
          description:
            'All selected listings are already published.',
        });

        return;
      }

      // Publish each selected Property through the real API.
      for (const listing of unpublishedListings) {
        await propertyApi.publishProperty(
          String(listing._id),
        );
      }

      // Reload the real Agency portfolio.
      await fetchListings();

      // Clear selections.
      setSelectedIds(new Set());

      // Close the confirmation dialog.
      setConfirmAction({
        isOpen: false,
        title: '',
        desc: '',
        action: () => { },
        confirmText: 'Confirm',
        danger: false,
      });

      showToast({
        type: 'success',
        title: 'Listings Published',
        description: `${unpublishedListings.length} listing${unpublishedListings.length ===
            1
            ? ''
            : 's'
          } published successfully.`,
      });
    } catch (error: any) {
      // Log the real backend failure.
      console.error(
        'Failed to publish selected listings:',
        error,
      );

      showToast({
        type: 'error',
        title: 'Bulk Publish Failed',
        description:
          error?.response?.data?.message ||
          error?.message ||
          'One or more listings could not be published.',
      });
    }
  };

  // Archive every selected real Property.
  const archiveSelectedListings =
    async () => {
      try {
        const selectedListings =
          listings.filter((listing) =>
            selectedIds.has(
              String(listing._id),
            ),
          );

        if (
          selectedListings.length ===
          0
        ) {
          return;
        }

        // Archive each selected Property through the real update workflow.
        for (const listing of selectedListings) {
          await propertyApi.updateAgencyProperty(
            String(listing._id),
            {
              status: 'Archived',
            },
          );
        }

        // Refresh the actual database records.
        await fetchListings();

        // Clear row selection.
        setSelectedIds(new Set());

        // Close the confirmation dialog.
        setConfirmAction({
          isOpen: false,
          title: '',
          desc: '',
          action: () => { },
          confirmText: 'Confirm',
          danger: false,
        });

        showToast({
          type: 'success',
          title: 'Listings Archived',
          description: `${selectedListings.length} listing${selectedListings.length ===
              1
              ? ''
              : 's'
            } archived successfully.`,
        });
      } catch (error: any) {
        // Log the real backend failure.
        console.error(
          'Failed to archive selected listings:',
          error,
        );

        showToast({
          type: 'error',
          title: 'Bulk Archive Failed',
          description:
            error?.response?.data?.message ||
            error?.message ||
            'One or more listings could not be archived.',
        });
      }
    };

  // Feature every selected Property at Premium level.
  const featureSelectedListings =
    async () => {
      try {
        const selectedListings =
          listings.filter((listing) =>
            selectedIds.has(
              String(listing._id),
            ),
          );

        if (
          selectedListings.length ===
          0
        ) {
          return;
        }

        // Persist the Premium featured level for each Property.
        for (const listing of selectedListings) {
          await propertyApi.updateAgencyProperty(
            String(listing._id),
            {
              featuredLevel: 'Premium',
            },
          );
        }

        // Refresh real data after all updates.
        await fetchListings();

        // Clear row selection.
        setSelectedIds(new Set());

        // Close the confirmation dialog.
        setConfirmAction({
          isOpen: false,
          title: '',
          desc: '',
          action: () => { },
          confirmText: 'Confirm',
          danger: false,
        });

        showToast({
          type: 'success',
          title: 'Listings Featured',
          description: `${selectedListings.length} listing${selectedListings.length ===
              1
              ? ''
              : 's'
            } set to Premium.`,
        });
      } catch (error: any) {
        // Log the actual backend failure.
        console.error(
          'Failed to feature selected listings:',
          error,
        );

        showToast({
          type: 'error',
          title: 'Bulk Feature Failed',
          description:
            error?.response?.data?.message ||
            error?.message ||
            'One or more listings could not be featured.',
        });
      }
    };

  // Ask for confirmation before bulk feature.
  const requestBulkFeature = () => {
    setConfirmAction({
      isOpen: true,
      title: 'Feature Listings',
      desc:
        'Set all selected listings to the Premium promotional level?',
      confirmText: 'Feature',
      danger: false,
      action:
        featureSelectedListings,
    });
  };

  // Ask for confirmation before bulk archive.
  const requestBulkArchive = () => {
    setConfirmAction({
      isOpen: true,
      title: 'Archive Listings',
      desc:
        'Archive all selected listings?',
      confirmText: 'Archive',
      danger: true,
      action:
        archiveSelectedListings,
    });
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        name="Property Management"
        subtitle="Manage listings, marketing campaigns, and property visibility."
      />

      {/* Real Property KPI summary. */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Listings"
          value={
            isLoadingListings
              ? '—'
              : String(totalListings)
          }
          trend="Agency property roster"
          trendColor="text-blue-400"
          icon={Building2}
        />

        <KPICard
          title="Published"
          value={
            isLoadingListings
              ? '—'
              : String(publishedListings)
          }
          trend="Currently published"
          trendColor="text-emerald-400"
          icon={CheckCircle2}
        />

        <KPICard
          title="Agent Assigned"
          value={
            isLoadingListings
              ? '—'
              : String(assignedListings)
          }
          trend="Agent assignment workflow"
          trendColor="text-gold-400"
          icon={UserCheck}
        />

        <KPICard
          title="Pending Assignment"
          value={
            isLoadingListings
              ? '—'
              : String(pendingAssignments)
          }
          trend="Awaiting Agent assignment"
          trendColor="text-yellow-400"
          icon={AlertCircle}
        />
      </div>

      {/* Real listing management table. */}
      <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col h-[calc(100vh-280px)] min-h-[600px]">
        <DataTableToolbar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search properties by title or location..."
          actions={
            <div className="flex gap-2 items-center">
              {selectedIds.size > 0 && (
                <div className="flex items-center gap-2 mr-4 border-r border-white/10 pr-4">
                  <span className="text-sm text-ink/60">
                    {selectedIds.size} selected
                  </span>

                  {/* Real bulk Publish action. */}
                  <GhostButton
                    className="px-3 text-xs h-8"
                    onClick={() =>
                      setConfirmAction({
                        isOpen: true,
                        title:
                          'Publish Listings',
                        desc:
                          'Are you sure you want to publish the selected listings?',
                        confirmText:
                          'Publish',
                        danger: false,
                        action:
                          publishSelectedListings,
                      })
                    }
                  >
                    Publish
                  </GhostButton>

                  {/* Real bulk Feature action. */}
                  <GhostButton
                    className="px-3 text-xs h-8"
                    onClick={
                      requestBulkFeature
                    }
                  >
                    Feature
                  </GhostButton>

                  {/* Use the existing real Agent assignment workflow. */}
                  <GhostButton
                    className="px-3 text-xs h-8"
                    onClick={() => {
                      const firstSelected =
                        listings.find(
                          (listing) =>
                            selectedIds.has(
                              String(
                                listing._id,
                              ),
                            ),
                        );

                      if (!firstSelected) {
                        return;
                      }

                      openAgentAssignment(
                        firstSelected,
                      );
                    }}
                  >
                    Assign Agent
                  </GhostButton>

                  {/* Real bulk Archive action. */}
                  <GhostButton
                    className="px-3 text-xs h-8 text-rose-400 hover:text-rose-300 hover:bg-rose-400/10"
                    onClick={
                      requestBulkArchive
                    }
                  >
                    Archive
                  </GhostButton>
                </div>
              )}

              {/* Open the real filter controls. */}
              <GhostButton
                className="px-3 flex items-center gap-2"
                onClick={() =>
                  setShowFilters(
                    (previous) =>
                      !previous,
                  )
                }
              >
                <Filter className="h-4 w-4" />
                Filters
              </GhostButton>
            </div>
          }
        />

        {/* Real filter controls populated from MongoDB records. */}
        {showFilters && (
          <div className="mt-4 rounded-xl border border-white/10 bg-navy-900/60 p-4">
            <div className="grid gap-4 md:grid-cols-3">
              <label className="space-y-2">
                <span className="text-xs text-ink/60">
                  Listing Status
                </span>

                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(
                      event.target.value,
                    )
                  }
                  className="w-full rounded-lg border border-white/10 bg-navy-950 px-3 py-2 text-sm text-cream outline-none focus:border-gold-400/50"
                >
                  {statusOptions.map(
                    (option) => (
                      <option
                        key={option}
                        value={option}
                      >
                        {option}
                      </option>
                    ),
                  )}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-xs text-ink/60">
                  Assignment
                </span>

                <select
                  value={
                    assignmentFilter
                  }
                  onChange={(event) =>
                    setAssignmentFilter(
                      event.target.value,
                    )
                  }
                  className="w-full rounded-lg border border-white/10 bg-navy-950 px-3 py-2 text-sm text-cream outline-none focus:border-gold-400/50"
                >
                  {assignmentOptions.map(
                    (option) => (
                      <option
                        key={option}
                        value={option}
                      >
                        {option}
                      </option>
                    ),
                  )}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-xs text-ink/60">
                  Property Type
                </span>

                <select
                  value={
                    propertyTypeFilter
                  }
                  onChange={(event) =>
                    setPropertyTypeFilter(
                      event.target.value,
                    )
                  }
                  className="w-full rounded-lg border border-white/10 bg-navy-950 px-3 py-2 text-sm text-cream outline-none focus:border-gold-400/50"
                >
                  {propertyTypeOptions.map(
                    (option) => (
                      <option
                        key={option}
                        value={option}
                      >
                        {option}
                      </option>
                    ),
                  )}
                </select>
              </label>
            </div>

            <div className="mt-4 flex justify-end">
              <GhostButton
                className="px-3"
                onClick={() => {
                  setStatusFilter(
                    'All',
                  );
                  setAssignmentFilter(
                    'All',
                  );
                  setPropertyTypeFilter(
                    'All',
                  );
                }}
              >
                Clear Filters
              </GhostButton>
            </div>
          </div>
        )}

        <div className="flex-1 mt-6 min-h-0">
          {isLoadingListings ? (
            <div className="h-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <RefreshCw className="h-7 w-7 animate-spin text-gold-400" />

                <span className="text-sm text-ink/60">
                  Loading Agency listings...
                </span>
              </div>
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Building2 className="h-10 w-10 mx-auto mb-3 text-ink/30" />

                <div className="text-sm text-ink/60">
                  {searchQuery ||
                    statusFilter !==
                    'All' ||
                    assignmentFilter !==
                    'All' ||
                    propertyTypeFilter !==
                    'All'
                    ? 'No properties match the current search or filters.'
                    : 'No properties found for this Agency.'}
                </div>
              </div>
            </div>
          ) : (
            <DataTable
              data={
                filteredListings
              }
              keyExtractor={(
                listing,
              ) =>
                String(
                  listing._id,
                )
              }
              columns={[
                {
                  header: (
                    <input
                      type="checkbox"
                      className="rounded border-white/20 bg-navy-900 text-gold-400 focus:ring-gold-400/20"
                      checked={
                        filteredListings.length >
                        0 &&
                        filteredListings.every(
                          (
                            listing,
                          ) =>
                            selectedIds.has(
                              String(
                                listing._id,
                              ),
                            ),
                        )
                      }
                      onChange={
                        toggleAll
                      }
                    />
                  ),
                  render: (
                    listing,
                  ) => (
                    <input
                      type="checkbox"
                      className="rounded border-white/20 bg-navy-900 text-gold-400 focus:ring-gold-400/20"
                      checked={selectedIds.has(
                        String(
                          listing._id,
                        ),
                      )}
                      onChange={() =>
                        toggleSelection(
                          String(
                            listing._id,
                          ),
                        )
                      }
                    />
                  ),
                },

                {
                  header:
                    'Property Info',
                  render: (
                    listing,
                  ) => {
                    const image =
                      getPropertyImage(
                        listing,
                      );

                    return (
                      <div className="flex items-center gap-3">
                        {image ? (
                          <img
                            src={image}
                            alt={
                              listing.title ||
                              'Property'
                            }
                            className="w-12 h-12 rounded-lg object-cover border border-white/10"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-navy-900 border border-white/10 flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-gold-400" />
                          </div>
                        )}

                        <div className="min-w-0">
                          <div
                            className="font-semibold text-cream hover:text-gold-400 cursor-pointer transition-colors flex items-center gap-2"
                            onClick={() =>
                              handleViewListing(
                                listing,
                              )
                            }
                          >
                            <span className="truncate max-w-[260px]">
                              {String(
                                listing.title ||
                                'Untitled Property',
                              )}
                            </span>

                            {/* Real featured level from MongoDB. */}
                            {listing.featuredLevel &&
                              listing.featuredLevel !==
                              'Standard' && (
                                <span className="text-[10px] bg-gold-400/20 text-gold-400 px-1.5 py-0.5 rounded font-bold uppercase">
                                  {
                                    listing.featuredLevel
                                  }
                                </span>
                              )}
                          </div>

                          <div className="text-xs text-ink/60 flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />

                            <span className="truncate max-w-[260px]">
                              {formatLocation(
                                listing,
                              ) ||
                                'Location unavailable'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  },
                },

                {
                  header: 'Price',
                  render: (
                    listing,
                  ) => (
                    <div>
                      <div className="font-medium text-cream">
                        {formatPrice(
                          listing,
                        )}
                      </div>

                      <div className="text-[10px] text-ink/60">
                        {listing.priceFrequency ||
                          'total'}
                      </div>
                    </div>
                  ),
                },

                {
                  header:
                    'Marketing',
                  render: (
                    listing,
                  ) => (
                    <div>
                      <div className="text-xs text-cream flex items-center gap-1 mb-1">
                        <Share2 className="h-3 w-3" />

                        {listing.status ||
                          'Status unavailable'}
                      </div>

                      <div className="text-[10px] text-ink/60">
                        {listing.availabilityStatus ||
                          'Availability unavailable'}
                      </div>

                      {listing.featuredLevel &&
                        listing.featuredLevel !==
                        'Standard' && (
                          <div className="text-[10px] text-gold-400 mt-1">
                            {
                              listing.featuredLevel
                            }{' '}
                            featured
                          </div>
                        )}

                      {/* Display real PropertyView and Inquiry totals for this Property. */}
                      <div className="text-[10px] text-ink/40 mt-1">
                        {isLoadingAnalytics ? (
                          'Views — • Enquiries —'
                        ) : (
                          <>
                            Views{' '}
                            {listingAnalytics[
                              String(listing._id)
                            ]?.views ?? 0}
                            {' • '}
                            Enquiries{' '}
                            {getListingEnquiryCount(
                              String(listing._id),
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ),
                },

                {
                  header: 'Agent',
                  render: (
                    listing,
                  ) => (
                    <div>
                      {listing.agent ? (
                        <>
                          <div className="text-sm text-cream">
                            {listing.agent
                              .fullName ||
                              'Agent'}
                          </div>

                          <div className="text-[10px] text-emerald-400">
                            {listing.agent
                              .status ||
                              'Status unavailable'}
                          </div>
                        </>
                      ) : (
                        <span className="text-sm text-ink/40 italic">
                          Unassigned
                        </span>
                      )}
                    </div>
                  ),
                },

                {
                  header:
                    'Assignment',
                  render: (
                    listing,
                  ) => (
                    <EnterpriseStatusBadge
                      status={
                        listing.assignmentStatus ||
                        'Pending Agency Assignment'
                      }
                    />
                  ),
                },

                {
                  header:
                    'Verification',
                  render: (
                    listing,
                  ) => (
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck
                        className={`h-4 w-4 ${listing.verificationLevel ===
                            'Physical Inspection Completed'
                            ? 'text-gold-400'
                            : listing.verificationLevel &&
                              listing.verificationLevel !==
                              'Unverified'
                              ? 'text-emerald-400'
                              : 'text-ink/40'
                          }`}
                      />

                      <span className="text-xs text-cream">
                        {listing.verificationLevel ||
                          'Unverified'}
                      </span>
                    </div>
                  ),
                },

                {
                  header: (
                    <div className="text-right">
                      Actions
                    </div>
                  ),
                  className:
                    'text-right',
                  render: (
                    listing,
                  ) => (
                    <div className="flex justify-end gap-2">
                      {/* View real Property details. */}
                      <button
                        onClick={() =>
                          handleViewListing(
                            listing,
                          )
                        }
                        className="p-1.5 text-ink/60 hover:text-cream rounded hover:bg-white/5 transition-colors"
                        title="View Details"
                      >
                        <BarChart3 className="h-4 w-4" />
                      </button>

                      {/* Open the real edit workflow. */}
                      <button
                        onClick={() =>
                          openEditMode(
                            listing,
                          )
                        }
                        className="p-1.5 text-ink/60 hover:text-blue-400 rounded hover:bg-blue-400/10 transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>

                      {/* Archive the real Property. */}
                      <button
                        onClick={() =>
                          requestArchive(
                            listing,
                          )
                        }
                        className="p-1.5 text-ink/60 hover:text-rose-400 rounded hover:bg-rose-400/10 transition-colors"
                        title="Archive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ),
                },
              ]}
            />
          )}
        </div>
      </div>

      {/* Real Property detail drawer and edit workflow. */}
      <EnterpriseDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setIsEditMode(false);
        }}
        title={
          selectedListing
            ? isEditMode
              ? `Edit: ${selectedListing.title ||
              'Property'
              }`
              : `Listing: ${selectedListing.title ||
              'Property'
              }`
            : 'Listing Details'
        }
        footerActions={
          isEditMode ? (
            <div className="flex gap-3 w-full">
              <GhostButton
                className="flex-1 flex justify-center items-center gap-2"
                disabled={
                  isSavingEdit
                }
                onClick={() =>
                  setIsEditMode(
                    false,
                  )
                }
              >
                <X className="h-4 w-4" />
                Cancel
              </GhostButton>

              <GoldButton
                className="flex-1 flex justify-center items-center gap-2"
                disabled={
                  isSavingEdit
                }
                onClick={
                  saveEditedListing
                }
              >
                <Save className="h-4 w-4" />
                {isSavingEdit
                  ? 'Saving...'
                  : 'Save Changes'}
              </GoldButton>
            </div>
          ) : (
            <div className="flex gap-3 w-full">
              {/* Real Publish operation. */}
              <GhostButton
                className="flex-1"
                onClick={() =>
                  selectedListing &&
                  requestPublish(
                    String(
                      selectedListing._id,
                    ),
                  )
                }
              >
                Publish
              </GhostButton>

              {/* Real Feature / Unfeature operation. */}
              <GoldButton
                className="flex-1"
                onClick={() =>
                  selectedListing &&
                  requestFeatureToggle(
                    selectedListing,
                  )
                }
              >
                {selectedListing?.featuredLevel &&
                  selectedListing.featuredLevel !==
                  'Standard'
                  ? 'Unfeature'
                  : 'Feature'}
              </GoldButton>
            </div>
          )
        }
      >
        {selectedListing && (
          <div className="space-y-6 pb-20">
            {isEditMode ? (
              <>
                {/* Editable basic Property information. */}
                <div className="p-5 rounded-xl border border-white/10 bg-navy-900/50">
                  <h4 className="text-sm font-semibold text-cream mb-4">
                    Basic Information
                  </h4>

                  <div className="space-y-4">
                    <label className="block">
                      <span className="text-xs text-ink/60">
                        Title
                      </span>

                      <input
                        value={
                          editForm.title
                        }
                        onChange={(event) =>
                          updateEditField(
                            'title',
                            event.target
                              .value,
                          )
                        }
                        className="mt-1 w-full rounded-lg border border-white/10 bg-navy-950 px-3 py-2 text-sm text-cream outline-none focus:border-gold-400/50"
                      />
                    </label>

                    <label className="block">
                      <span className="text-xs text-ink/60">
                        Description
                      </span>

                      <textarea
                        value={
                          editForm.description
                        }
                        onChange={(event) =>
                          updateEditField(
                            'description',
                            event.target
                              .value,
                          )
                        }
                        rows={5}
                        className="mt-1 w-full rounded-lg border border-white/10 bg-navy-950 px-3 py-2 text-sm text-cream outline-none focus:border-gold-400/50 resize-none"
                      />
                    </label>

                    <div className="grid grid-cols-2 gap-4">
                      <label>
                        <span className="text-xs text-ink/60">
                          Property Type
                        </span>

                        <input
                          value={
                            editForm.propertyType
                          }
                          onChange={(
                            event,
                          ) =>
                            updateEditField(
                              'propertyType',
                              event.target
                                .value,
                            )
                          }
                          className="mt-1 w-full rounded-lg border border-white/10 bg-navy-950 px-3 py-2 text-sm text-cream outline-none focus:border-gold-400/50"
                        />
                      </label>

                      <label>
                        <span className="text-xs text-ink/60">
                          Transaction
                        </span>

                        <select
                          value={
                            editForm.transactionType
                          }
                          onChange={(
                            event,
                          ) =>
                            updateEditField(
                              'transactionType',
                              event.target
                                .value,
                            )
                          }
                          className="mt-1 w-full rounded-lg border border-white/10 bg-navy-950 px-3 py-2 text-sm text-cream outline-none focus:border-gold-400/50"
                        >
                          <option value="buy">
                            Buy
                          </option>
                          <option value="rent">
                            Rent
                          </option>
                          <option value="lease">
                            Lease
                          </option>
                        </select>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Editable real location fields. */}
                <div className="p-5 rounded-xl border border-white/10 bg-navy-900/50">
                  <h4 className="text-sm font-semibold text-cream mb-4">
                    Location
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      ['country', 'Country'],
                      ['state', 'State'],
                      ['city', 'City'],
                      ['area', 'Area'],
                      ['estateName', 'Estate'],
                      ['landmark', 'Landmark'],
                    ].map(
                      ([
                        field,
                        label,
                      ]) => (
                        <label
                          key={
                            field
                          }
                        >
                          <span className="text-xs text-ink/60">
                            {label}
                          </span>

                          <input
                            value={
                              editForm[
                              field
                              ] || ''
                            }
                            onChange={(
                              event,
                            ) =>
                              updateEditField(
                                field,
                                event
                                  .target
                                  .value,
                              )
                            }
                            className="mt-1 w-full rounded-lg border border-white/10 bg-navy-950 px-3 py-2 text-sm text-cream outline-none focus:border-gold-400/50"
                          />
                        </label>
                      ),
                    )}

                    <label className="block col-span-2">
                      <span className="text-xs text-ink/60">
                        Address
                      </span>

                      <input
                        value={
                          editForm.address ||
                          ''
                        }
                        onChange={(event) =>
                          updateEditField(
                            'address',
                            event.target
                              .value,
                          )
                        }
                        className="mt-1 w-full rounded-lg border border-white/10 bg-navy-950 px-3 py-2 text-sm text-cream outline-none focus:border-gold-400/50"
                      />
                    </label>
                  </div>
                </div>

                {/* Editable real Property specifications. */}
                <div className="p-5 rounded-xl border border-white/10 bg-navy-900/50">
                  <h4 className="text-sm font-semibold text-cream mb-4">
                    Property Specifications
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      ['bedrooms', 'Bedrooms'],
                      ['bathrooms', 'Bathrooms'],
                      ['toilets', 'Toilets'],
                      ['parkingSpaces', 'Parking'],
                      ['propertySize', 'Property Size'],
                    ].map(
                      ([
                        field,
                        label,
                      ]) => (
                        <label
                          key={
                            field
                          }
                        >
                          <span className="text-xs text-ink/60">
                            {label}
                          </span>

                          <input
                            type="number"
                            min="0"
                            value={
                              editForm[
                              field
                              ]
                            }
                            onChange={(
                              event,
                            ) =>
                              updateEditField(
                                field,
                                event
                                  .target
                                  .value,
                              )
                            }
                            className="mt-1 w-full rounded-lg border border-white/10 bg-navy-950 px-3 py-2 text-sm text-cream outline-none focus:border-gold-400/50"
                          />
                        </label>
                      ),
                    )}

                    <label>
                      <span className="text-xs text-ink/60">
                        Size Unit
                      </span>

                      <select
                        value={
                          editForm.propertySizeUnit
                        }
                        onChange={(
                          event,
                        ) =>
                          updateEditField(
                            'propertySizeUnit',
                            event
                              .target
                              .value,
                          )
                        }
                        className="mt-1 w-full rounded-lg border border-white/10 bg-navy-950 px-3 py-2 text-sm text-cream outline-none focus:border-gold-400/50"
                      >
                        <option value="sqm">
                          sqm
                        </option>
                        <option value="sqft">
                          sqft
                        </option>
                        <option value="acres">
                          acres
                        </option>
                        <option value="plots">
                          plots
                        </option>
                      </select>
                    </label>

                    <label>
                      <span className="text-xs text-ink/60">
                        Furnishing
                      </span>

                      <select
                        value={
                          editForm.furnishing ||
                          ''
                        }
                        onChange={(
                          event,
                        ) =>
                          updateEditField(
                            'furnishing',
                            event
                              .target
                              .value,
                          )
                        }
                        className="mt-1 w-full rounded-lg border border-white/10 bg-navy-950 px-3 py-2 text-sm text-cream outline-none focus:border-gold-400/50"
                      >
                        <option value="">
                          Not specified
                        </option>

                        <option value="Unfurnished">
                          Unfurnished
                        </option>

                        <option value="Semi-Furnished">
                          Semi-Furnished
                        </option>

                        <option value="Fully Furnished">
                          Fully Furnished
                        </option>
                      </select>
                    </label>
                  </div>
                </div>

                {/* Editable real pricing information. */}
                <div className="p-5 rounded-xl border border-white/10 bg-navy-900/50">
                  <h4 className="text-sm font-semibold text-cream mb-4">
                    Pricing
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <label>
                      <span className="text-xs text-ink/60">
                        Price
                      </span>

                      <input
                        type="number"
                        min="0"
                        value={
                          editForm.price
                        }
                        onChange={(
                          event,
                        ) =>
                          updateEditField(
                            'price',
                            event.target
                              .value,
                          )
                        }
                        className="mt-1 w-full rounded-lg border border-white/10 bg-navy-950 px-3 py-2 text-sm text-cream outline-none focus:border-gold-400/50"
                      />
                    </label>

                    <label>
                      <span className="text-xs text-ink/60">
                        Currency
                      </span>

                      <input
                        value={
                          editForm.currency
                        }
                        onChange={(
                          event,
                        ) =>
                          updateEditField(
                            'currency',
                            event
                              .target
                              .value,
                          )
                        }
                        className="mt-1 w-full rounded-lg border border-white/10 bg-navy-950 px-3 py-2 text-sm text-cream outline-none focus:border-gold-400/50"
                      />
                    </label>

                    <label>
                      <span className="text-xs text-ink/60">
                        Price Type
                      </span>

                      <select
                        value={
                          editForm.priceType
                        }
                        onChange={(
                          event,
                        ) =>
                          updateEditField(
                            'priceType',
                            event
                              .target
                              .value,
                          )
                        }
                        className="mt-1 w-full rounded-lg border border-white/10 bg-navy-950 px-3 py-2 text-sm text-cream outline-none focus:border-gold-400/50"
                      >
                        <option value="fixed">
                          Fixed
                        </option>
                        <option value="negotiable">
                          Negotiable
                        </option>
                        <option value="price_on_request">
                          Price on Request
                        </option>
                        <option value="auction">
                          Auction
                        </option>
                      </select>
                    </label>

                    <label>
                      <span className="text-xs text-ink/60">
                        Price Frequency
                      </span>

                      <select
                        value={
                          editForm.priceFrequency
                        }
                        onChange={(
                          event,
                        ) =>
                          updateEditField(
                            'priceFrequency',
                            event
                              .target
                              .value,
                          )
                        }
                        className="mt-1 w-full rounded-lg border border-white/10 bg-navy-950 px-3 py-2 text-sm text-cream outline-none focus:border-gold-400/50"
                      >
                        <option value="total">
                          Total
                        </option>
                        <option value="monthly">
                          Monthly
                        </option>
                        <option value="yearly">
                          Yearly
                        </option>
                        <option value="perNight">
                          Per Night
                        </option>
                        <option value="perPlot">
                          Per Plot
                        </option>
                        <option value="perAcre">
                          Per Acre
                        </option>
                      </select>
                    </label>

                    <label>
                      <span className="text-xs text-ink/60">
                        Lease Duration
                      </span>

                      <input
                        value={
                          editForm.leaseDuration ||
                          ''
                        }
                        onChange={(
                          event,
                        ) =>
                          updateEditField(
                            'leaseDuration',
                            event
                              .target
                              .value,
                          )
                        }
                        className="mt-1 w-full rounded-lg border border-white/10 bg-navy-950 px-3 py-2 text-sm text-cream outline-none focus:border-gold-400/50"
                      />
                    </label>

                    <label className="flex items-center gap-2 pt-6">
                      <input
                        type="checkbox"
                        checked={
                          Boolean(
                            editForm.isNegotiable,
                          )
                        }
                        onChange={(
                          event,
                        ) =>
                          updateEditField(
                            'isNegotiable',
                            event.target
                              .checked,
                          )
                        }
                        className="rounded border-white/20 bg-navy-900 text-gold-400 focus:ring-gold-400/20"
                      />

                      <span className="text-sm text-cream">
                        Negotiable
                      </span>
                    </label>
                  </div>
                </div>

                {/* Editable listing tier and availability. */}
                <div className="p-5 rounded-xl border border-white/10 bg-navy-900/50">
                  <h4 className="text-sm font-semibold text-cream mb-4">
                    Listing & Availability
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <label>
                      <span className="text-xs text-ink/60">
                        Listing Tier
                      </span>

                      <select
                        value={
                          editForm.listingTier
                        }
                        onChange={(
                          event,
                        ) =>
                          updateEditField(
                            'listingTier',
                            event
                              .target
                              .value,
                          )
                        }
                        className="mt-1 w-full rounded-lg border border-white/10 bg-navy-950 px-3 py-2 text-sm text-cream outline-none focus:border-gold-400/50"
                      >
                        <option value="Basic">
                          Basic
                        </option>

                        <option value="Plus">
                          Plus
                        </option>

                        <option value="Pro">
                          Pro
                        </option>
                      </select>
                    </label>

                    <label>
                      <span className="text-xs text-ink/60">
                        Availability Status
                      </span>

                      <select
                        value={
                          editForm.availabilityStatus
                        }
                        onChange={(
                          event,
                        ) =>
                          updateEditField(
                            'availabilityStatus',
                            event
                              .target
                              .value,
                          )
                        }
                        className="mt-1 w-full rounded-lg border border-white/10 bg-navy-950 px-3 py-2 text-sm text-cream outline-none focus:border-gold-400/50"
                      >
                        <option value="Available">
                          Available
                        </option>

                        <option value="Unavailable">
                          Unavailable
                        </option>

                        <option value="Coming Soon">
                          Coming Soon
                        </option>
                      </select>
                    </label>

                    <label className="col-span-2">
                      <span className="text-xs text-ink/60">
                        Availability Date
                      </span>

                      <input
                        type="date"
                        value={
                          editForm.availabilityDate ||
                          ''
                        }
                        onChange={(
                          event,
                        ) =>
                          updateEditField(
                            'availabilityDate',
                            event
                              .target
                              .value,
                          )
                        }
                        className="mt-1 w-full rounded-lg border border-white/10 bg-navy-950 px-3 py-2 text-sm text-cream outline-none focus:border-gold-400/50"
                      />
                    </label>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Real Property overview. */}
                <div className="p-5 rounded-xl border border-white/10 bg-navy-900/50">
                  <h4 className="text-sm font-semibold text-cream mb-4">
                    Listing Details
                  </h4>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between border-b border-white/5 pb-2 gap-4">
                      <span className="text-ink/60">
                        Title
                      </span>

                      <span className="font-medium text-cream text-right">
                        {selectedListing.title ||
                          'Not provided'}
                      </span>
                    </div>

                    <div className="flex justify-between border-b border-white/5 pb-2 gap-4">
                      <span className="text-ink/60">
                        Location
                      </span>

                      <span className="font-medium text-cream text-right">
                        {formatLocation(
                          selectedListing,
                        ) ||
                          'Not provided'}
                      </span>
                    </div>

                    <div className="flex justify-between border-b border-white/5 pb-2 gap-4">
                      <span className="text-ink/60">
                        Price
                      </span>

                      <span className="font-medium text-cream text-right">
                        {formatPrice(
                          selectedListing,
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between border-b border-white/5 pb-2 gap-4">
                      <span className="text-ink/60">
                        Property Type
                      </span>

                      <span className="font-medium text-cream text-right">
                        {selectedListing.propertyType ||
                          'Not provided'}
                      </span>
                    </div>

                    <div className="flex justify-between border-b border-white/5 pb-2 gap-4">
                      <span className="text-ink/60">
                        Transaction
                      </span>

                      <span className="font-medium text-cream text-right capitalize">
                        {selectedListing.transactionType ||
                          'Not provided'}
                      </span>
                    </div>

                    <div className="flex justify-between border-b border-white/5 pb-2 gap-4">
                      <span className="text-ink/60">
                        Owner
                      </span>

                      <span className="font-medium text-cream text-right">
                        {selectedListing.owner
                          ?.fullName ||
                          'Private / Internal Listing'}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-ink/60">
                        Featured Level
                      </span>

                      <span className="font-medium text-cream text-right">
                        {selectedListing.featuredLevel ||
                          'Standard'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Real assignment data. */}
                <div className="p-5 rounded-xl border border-white/10 bg-navy-900/50">
                  <h4 className="text-sm font-semibold text-cream mb-4">
                    Assignment
                  </h4>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between border-b border-white/5 pb-2 gap-4">
                      <span className="text-ink/60">
                        Assignment Status
                      </span>

                      <span className="font-medium text-cream text-right">
                        {selectedListing.assignmentStatus ||
                          'Not assigned'}
                      </span>
                    </div>

                    <div className="flex justify-between border-b border-white/5 pb-2 gap-4">
                      <span className="text-ink/60">
                        Assigned Agent
                      </span>

                      <span className="font-medium text-cream text-right">
                        {selectedListing.agent
                          ?.fullName ||
                          'Unassigned'}
                      </span>
                    </div>

                    <div className="flex justify-between border-b border-white/5 pb-2 gap-4">
                      <span className="text-ink/60">
                        Agent Status
                      </span>

                      <span className="font-medium text-cream text-right">
                        {selectedListing.agent
                          ?.status ||
                          'N/A'}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-ink/60">
                        Assigned At
                      </span>

                      <span className="font-medium text-cream text-right">
                        {selectedListing.assignedAt
                          ? new Date(
                            selectedListing.assignedAt,
                          ).toLocaleString()
                          : 'Not assigned'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <GoldButton
                      size="sm"
                      className="w-full flex items-center justify-center gap-2"
                      onClick={() =>
                        openAgentAssignment(
                          selectedListing,
                        )
                      }
                    >
                      <UserCheck className="h-4 w-4" />
                      Assign / Reassign Agent
                    </GoldButton>
                  </div>
                </div>

                {/* Real verification information. */}
                <div className="p-5 rounded-xl border border-white/10 bg-navy-900/50">
                  <h4 className="text-sm font-semibold text-cream mb-4 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-gold-400" />
                    Verification
                  </h4>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between border-b border-white/5 pb-2 gap-4">
                      <span className="text-ink/60">
                        Verification Level
                      </span>

                      <span className="font-medium text-cream text-right">
                        {selectedListing.verificationLevel ||
                          'Unverified'}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-ink/60">
                        Listing Status
                      </span>

                      <EnterpriseStatusBadge
                        status={String(
                          selectedListing.status ||
                          'Unknown',
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Real availability information. */}
                <div className="p-5 rounded-xl border border-white/10 bg-navy-900/50">
                  <h4 className="text-sm font-semibold text-cream mb-4 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-400" />
                    Availability
                  </h4>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between border-b border-white/5 pb-2 gap-4">
                      <span className="text-ink/60">
                        Availability Status
                      </span>

                      <span className="font-medium text-cream text-right">
                        {selectedListing.availabilityStatus ||
                          'Not provided'}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-ink/60">
                        Availability Date
                      </span>

                      <span className="font-medium text-cream text-right">
                        {selectedListing.availabilityDate
                          ? new Date(
                            selectedListing.availabilityDate,
                          ).toLocaleDateString()
                          : 'Not provided'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Real record metadata. */}
                <div className="p-5 rounded-xl border border-white/10 bg-navy-900/50">
                  <h4 className="text-sm font-semibold text-cream mb-4">
                    Record Information
                  </h4>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between border-b border-white/5 pb-2 gap-4">
                      <span className="text-ink/60">
                        Property ID
                      </span>

                      <span className="font-medium text-cream text-right font-mono break-all">
                        {selectedListing._id}
                      </span>
                    </div>

                    <div className="flex justify-between border-b border-white/5 pb-2 gap-4">
                      <span className="text-ink/60">
                        Created
                      </span>

                      <span className="font-medium text-cream text-right">
                        {selectedListing.createdAt
                          ? new Date(
                            selectedListing.createdAt,
                          ).toLocaleString()
                          : 'Not available'}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-ink/60">
                        Last Updated
                      </span>

                      <span className="font-medium text-cream text-right">
                        {selectedListing.updatedAt
                          ? new Date(
                            selectedListing.updatedAt,
                          ).toLocaleString()
                          : 'Not available'}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </EnterpriseDetailDrawer>

      {/* Existing real Agent assignment workflow. */}
      <SmartAgentMatchModal
        isOpen={
          isMatchModalOpen
        }
        onClose={() => {
          setIsMatchModalOpen(
            false,
          );
          setAssignmentListing(
            null,
          );
        }}
        assignmentId={
          assignmentListing?._id
        }
        propertyTitle={
          assignmentListing?.title
        }
        propertyLocation={
          assignmentListing
            ? formatLocation(
              assignmentListing,
            )
            : ''
        }
        onAssignmentComplete={
          async () => {
            await fetchListings();

            // Refresh the currently selected Property after assignment.
            if (
              assignmentListing?._id
            ) {
              const response =
                await propertyApi.getAgencyProperties();

              const rawResponse =
                response as any;

              const refreshed =
                Array.isArray(
                  rawResponse?.properties,
                )
                  ? rawResponse.properties
                  : Array.isArray(
                    rawResponse?.data
                      ?.properties,
                  )
                    ? rawResponse.data
                      .properties
                    : [];

              const updated =
                refreshed.find(
                  (property: any) =>
                    String(
                      property._id,
                    ) ===
                    String(
                      assignmentListing._id,
                    ),
                );

              if (updated) {
                setSelectedListing(
                  updated,
                );
              }
            }
          }
        }
      />

      {/* Real confirmation dialog. */}
      <ConfirmationModal
        isOpen={
          confirmAction.isOpen
        }
        onClose={() =>
          setConfirmAction(
            (previous) => ({
              ...previous,
              isOpen: false,
            }),
          )
        }
        onConfirm={
          confirmAction.action
        }
        title={
          confirmAction.title
        }
        description={
          confirmAction.desc
        }
        confirmText={
          confirmAction.confirmText ||
          'Confirm'
        }
        cancelText="Cancel"
      />
    </div>
  );
}
// Import the React hooks used by the Create Listing workflow.
import { useEffect, useMemo, useState } from 'react';

// Import React Router navigation and query-string support.
import {
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

// Import the shared dashboard layout.
import { DashboardLayout } from '../../../components/layout';

// Import every Create Listing step component.
import { BasicInfoStep } from './components/BasicInfoStep';
import { LocationStep } from './components/LocationStep';
import { PropertyDetailsStep } from './components/PropertyDetailsStep';
import { PricingStep } from './components/PricingStep';
import { MediaUploadStep } from './components/MediaUploadStep';
import { OwnershipStep } from './components/OwnershipStep';
import { ReviewSubmitStep } from './components/ReviewSubmitStep';

// Import the Create Listing draft state and type.
import {
  initialDraftState,
  type ListingDraft,
} from './types';

// Import the navigation buttons used by the page.
import {
  GoldButton,
  GhostButton,
} from '../../../components/ui/ui';

// Import the dashboard route helper.
import { getDashboardRoute } from '../../../constants/routes';

import { ROLES } from '../../../constants/roles';

// Import the current authenticated session.
import { useSession } from '../../../contexts/SessionContext';

// Import the Property API methods used to create and submit listings.
import { propertyApi } from '../../../api/property.api';

// Import the Agent API used to load the authenticated Agent's real listings.
import { agentApi } from '../../../api/agent.api';

// Import the property payload mapper.
import {
  mapListingDraftToPropertyPayload,
} from './propertyPayload.mapper';

// Import the file upload API.
import { uploadApi } from '../../../api/upload.api';

// Define the seven Create Listing workflow steps.
const STEPS = [
  '🏠 Basic Information',
  '📍 Location',
  '🏡 Property Details',
  '💰 Pricing',
  '🖼 Media',
  '👤 Ownership',
  '✅ Review & Submit',
];

// Define the local-storage key used for the saved listing draft.
const STORAGE_KEY = 'luxora_listing_draft';

// Define the response shape returned by the image upload endpoint.
interface ImageUploadResponse {
  images: string[];
}

// Define the response shape returned by the document upload endpoint.
interface DocumentUploadResponse {
  documents: string[];
}

// Define the response shape returned by Property creation.
interface CreatePropertyResponse {
  property: {
    _id: string;
  };
}

// Define the response shape returned by the review-submission endpoint.
interface SubmitReviewResponse {
  property?: {
    _id: string;
  };
}

// Define the backend shape returned by GET /agent/listings.
interface AgentPropertyRecord {
  _id: string;

  title?: string;
  description?: string;

  propertyType?: string;
  propertySubType?: string | null;
  transactionType?: string;

  country?: string;
  state?: string;
  city?: string;
  area?: string | null;
  address?: string | null;
  estateName?: string | null;
  landmark?: string | null;
  hideExactAddress?: boolean;

  bedrooms?: number | null;
  bathrooms?: number | null;
  toilets?: number | null;
  parkingSpaces?: number | null;

  propertySize?: number | null;
  propertySizeUnit?: string | null;
  yearBuilt?: number | null;
  floorNumber?: number | null;
  totalFloors?: number | null;

  furnishing?: string | null;
  propertyCondition?: string | null;
  amenities?: string[];

  price?: number | null;
  currency?: string | null;
  priceType?: string | null;
  priceFrequency?: string | null;
  isNegotiable?: boolean;

  rentAmount?: number | null;
  serviceCharge?: number | null;
  agencyFee?: number | null;
  legalFee?: number | null;
  cautionDeposit?: number | null;
  otherCharges?: number | null;
  leaseDuration?: string | null;

  paymentPlans?: Array<{
    durationMonths?: number;
    installmentAmount?: number;
    frequency?: string;
    description?: string | null;
  }>;

  mortgageOptions?: {
    available?: boolean;
    providers?: string[];
    minimumDownPaymentPercent?: number | null;
    maximumTermYears?: number | null;
    notes?: string | null;
  };

  images?: string[];
  coverImage?: string | null;

  videoUrl?: string | null;
  virtualTourUrl?: string | null;
  brochureUrl?: string | null;

  listingSource?: string | null;

  owner?: {
    _id?: string;
    fullName?: string;
    email?: string;
  } | null;

  agent?: string | null;
  agency?: {
    _id?: string;
    name?: string;
    status?: string;
  } | string | null;

  status?: string | null;
  availabilityStatus?: string | null;
}

// Convert a backend numeric value into the form's number-or-empty format.
const toDraftNumber = (
  value: number | null | undefined,
): number | '' => {
  return value === null || value === undefined
    ? ''
    : value;
};

// Convert a backend value into a safe string.
const toDraftString = (
  value: string | number | null | undefined,
): string => {
  return value === null || value === undefined
    ? ''
    : String(value);
};

// Format the displayed property price without changing the stored numeric price.
const formatDisplayPrice = (
  value: number | null | undefined,
  currency = 'NGN',
): string => {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(Number(value))
  ) {
    return '';
  }

  const numericValue = Number(value);

  const symbols: Record<string, string> = {
    NGN: '₦',
    USD: '$',
    GBP: '£',
    EUR: '€',
  };

  const symbol = symbols[currency] || currency;

  return `${symbol}${numericValue.toLocaleString()}`;
};

// Convert backend price-type values into the existing UI selector values.
const mapBackendPriceTypeToDraft = (
  priceType: string | null | undefined,
): string => {
  switch (
  String(priceType || '')
    .trim()
    .toLowerCase()
  ) {
    case 'negotiable':
      return 'Negotiable';

    case 'price_on_request':
    case 'price on request':
      return 'Price On Request';

    case 'auction':
      return 'Auction';

    case 'fixed':
    case 'fixed price':
    default:
      return 'Fixed Price';
  }
};

// Convert backend payment plans into the labels already used by the UI.
const mapBackendPaymentPlansToDraft = (
  plans:
    | Array<{
      durationMonths?: number;
      description?: string | null;
    }>
    | undefined,
): string[] => {
  if (!Array.isArray(plans)) {
    return [];
  }

  return plans
    .map((plan) => {
      const duration =
        Number(plan?.durationMonths);

      if (
        Number.isFinite(duration) &&
        duration > 0
      ) {
        return `${duration} Months Plan`;
      }

      if (
        typeof plan?.description ===
        'string' &&
        plan.description.trim()
      ) {
        return plan.description.trim();
      }

      return null;
    })
    .filter(
      (plan): plan is string =>
        Boolean(plan),
    );
};

// Convert a real backend Agent Property into the Create Listing draft shape.
const mapAgentPropertyToDraft = (
  property: AgentPropertyRecord,
): ListingDraft => {
  const currency =
    property.currency || 'NGN';

  return {
    ...initialDraftState,

    title: property.title || '',
    propertyType:
      (property.propertyType || '') as ListingDraft['propertyType'],
    transactionType:
      (property.transactionType || '') as ListingDraft['transactionType'],
    description:
      property.description || '',
    propertyCondition:
      property.propertyCondition || '',
    propertySubType:
      property.propertySubType || '',

    country:
      property.country || 'Nigeria',
    state: property.state || '',
    city: property.city || '',
    area: property.area || '',
    address: property.address || '',
    estateName:
      property.estateName || '',
    landmark:
      property.landmark || '',
    hideExactAddress:
      Boolean(property.hideExactAddress),

    bedrooms:
      toDraftNumber(property.bedrooms),
    bathrooms:
      toDraftNumber(property.bathrooms),
    toilets:
      toDraftNumber(property.toilets),
    parkingSpaces:
      toDraftNumber(property.parkingSpaces),

    propertySize:
      toDraftString(property.propertySize),
    yearBuilt:
      toDraftString(property.yearBuilt),
    floorNumber:
      toDraftString(property.floorNumber),
    totalFloors:
      toDraftString(property.totalFloors),

    amenities:
      Array.isArray(property.amenities)
        ? property.amenities
        : [],

    furnishing:
      property.furnishing || '',

    price:
      formatDisplayPrice(
        property.price,
        currency,
      ),

    priceValue:
      toDraftNumber(property.price),

    currency,

    priceType:
      mapBackendPriceTypeToDraft(
        property.priceType,
      ),

    rentAmount:
      toDraftString(property.rentAmount),

    serviceCharge:
      toDraftNumber(
        property.serviceCharge,
      ),

    agencyFee:
      toDraftNumber(
        property.agencyFee,
      ),

    legalFee:
      toDraftNumber(
        property.legalFee,
      ),

    cautionDeposit:
      toDraftNumber(
        property.cautionDeposit,
      ),

    otherCharges:
      toDraftNumber(
        property.otherCharges,
      ),

    isNegotiable:
      Boolean(property.isNegotiable),

    leaseDuration:
      property.leaseDuration || '',

    paymentPlans:
      mapBackendPaymentPlansToDraft(
        property.paymentPlans,
      ),

    mortgageOptions:
      property.mortgageOptions
        ? String(
          Boolean(
            property.mortgageOptions.available,
          ),
        )
        : '',

    // Existing server-side media is preserved during edit.
    // The Media step still handles newly selected browser files.
    images: [],
    coverImageIndex: 0,

    videoUrl:
      property.videoUrl || '',
    virtualTourUrl:
      property.virtualTourUrl || '',
    documents: [],
    brochureUrl:
      property.brochureUrl || '',

    listingSource:
      property.listingSource ||
      'Private Owner',

    ownerReference:
      property.owner?._id || '',

    ownerName:
      property.owner?.fullName ||
      '',

    organizationName:
      typeof property.agency ===
        'object'
        ? property.agency?.name || ''
        : '',

    organizationRep: '',

    // Existing server documents are not converted into browser Files.
    ownershipVerification: [],
  };
};

// Convert the current draft into only the fields that the Agent
// is allowed to edit through the tested PATCH endpoint.
const buildAgentEditPayload = (
  draft: ListingDraft,
) => {
  const transactionType =
    draft.transactionType === 'rent' ||
      draft.transactionType === 'lease'
      ? draft.transactionType
      : 'buy';

  const normalizedPriceType =
    draft.priceType
      .trim()
      .toLowerCase();

  let priceType:
    | 'fixed'
    | 'negotiable'
    | 'price_on_request'
    | 'auction' = 'fixed';

  if (
    normalizedPriceType ===
    'negotiable'
  ) {
    priceType = 'negotiable';
  } else if (
    normalizedPriceType ===
    'price on request' ||
    normalizedPriceType ===
    'price_on_request'
  ) {
    priceType = 'price_on_request';
  } else if (
    normalizedPriceType ===
    'auction'
  ) {
    priceType = 'auction';
  }

  const paymentPlans = draft.paymentPlans
    .map((plan) => {
      const match = plan.match(/\d+/);

      if (!match) {
        return null;
      }

      const durationMonths =
        Number(match[0]);

      if (
        !Number.isFinite(
          durationMonths,
        ) ||
        durationMonths <= 0
      ) {
        return null;
      }

      return {
        durationMonths,
        installmentAmount: 0,
        frequency: 'monthly' as const,
        description: `${plan} selected`,
      };
    })
    .filter(Boolean);

  const mortgageAvailable =
    draft.mortgageOptions ===
    'true';

  return {
    title:
      draft.title.trim(),

    description:
      draft.description.trim(),

    propertyType:
      draft.propertyType,

    propertySubType:
      draft.propertySubType.trim() ||
      null,

    transactionType,

    country:
      draft.country.trim() ||
      'Nigeria',

    state:
      draft.state.trim(),

    city:
      draft.city.trim(),

    area:
      draft.area.trim() || null,

    address:
      draft.address.trim() || null,

    estateName:
      draft.estateName.trim() || null,

    landmark:
      draft.landmark.trim() || null,

    hideExactAddress:
      draft.hideExactAddress,

    bedrooms:
      draft.bedrooms === ''
        ? 0
        : Number(draft.bedrooms),

    bathrooms:
      draft.bathrooms === ''
        ? 0
        : Number(draft.bathrooms),

    toilets:
      draft.toilets === ''
        ? 0
        : Number(draft.toilets),

    parkingSpaces:
      draft.parkingSpaces === ''
        ? 0
        : Number(draft.parkingSpaces),

    propertySize:
      draft.propertySize.trim() === ''
        ? null
        : Number(draft.propertySize),

    propertySizeUnit:
      'sqm',

    yearBuilt:
      draft.yearBuilt.trim() === ''
        ? null
        : Number(draft.yearBuilt),

    floorNumber:
      draft.floorNumber.trim() === ''
        ? null
        : Number(draft.floorNumber),

    totalFloors:
      draft.totalFloors.trim() === ''
        ? null
        : Number(draft.totalFloors),

    furnishing:
      draft.furnishing.trim() || null,

    propertyCondition:
      draft.propertyCondition.trim() ||
      null,

    amenities:
      draft.amenities,

    price:
      draft.priceValue === ''
        ? null
        : Number(draft.priceValue),

    currency:
      draft.currency || 'NGN',

    priceType,

    priceFrequency:
      transactionType === 'rent'
        ? 'yearly'
        : 'total',

    isNegotiable:
      priceType === 'negotiable'
        ? true
        : draft.isNegotiable,

    rentAmount:
      transactionType === 'rent'
        ? draft.rentAmount === ''
          ? draft.priceValue === ''
            ? null
            : Number(
              draft.priceValue,
            )
          : Number(
            draft.rentAmount,
          )
        : null,

    serviceCharge:
      draft.serviceCharge === ''
        ? null
        : Number(draft.serviceCharge),

    agencyFee:
      draft.agencyFee === ''
        ? null
        : Number(draft.agencyFee),

    legalFee:
      draft.legalFee === ''
        ? null
        : Number(draft.legalFee),

    cautionDeposit:
      draft.cautionDeposit === ''
        ? null
        : Number(draft.cautionDeposit),

    otherCharges:
      draft.otherCharges === ''
        ? null
        : Number(draft.otherCharges),

    leaseDuration:
      transactionType === 'lease'
        ? draft.leaseDuration.trim() ||
        null
        : null,

    paymentPlans,

    mortgageOptions: {
      available:
        mortgageAvailable,
      providers: [],
      minimumDownPaymentPercent:
        null,
      maximumTermYears:
        null,
      notes: null,
    },

    videoUrl:
      draft.videoUrl.trim() || null,

    virtualTourUrl:
      draft.virtualTourUrl.trim() ||
      null,

    brochureUrl:
      draft.brochureUrl.trim() || null,
  };
};

export default function CreateListingPage() {
  // Create the router navigation function.
  const navigate = useNavigate();

  // Read the optional editId from the URL.
  const [searchParams] =
    useSearchParams();

  // Resolve whether this page is being used to edit an existing property.
  const editId = useMemo(
    () =>
      searchParams.get('editId'),
    [searchParams],
  );

  // Get the currently authenticated user.
  const { user } = useSession();

  // Track which Create Listing step is currently visible.
  const [currentStep, setCurrentStep] =
    useState(0);

  // Track whether the page is loading an existing Agent property.
  const [isLoadingEdit, setIsLoadingEdit] =
    useState(Boolean(editId));

  // Track whether the final submission is currently running.
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  // Track any submission error that needs to be shown to the user.
  const [submitError, setSubmitError] =
    useState('');

  // Track the real server-side image URLs belonging to an edited listing.
  // They are intentionally preserved rather than replaced during the PATCH.
  const [
    existingImageUrls,
    setExistingImageUrls,
  ] = useState<string[]>([]);

  // Track the real server-side document URLs belonging to an edited listing.
  const [
    existingDocumentUrls,
    setExistingDocumentUrls,
  ] = useState<string[]>([]);

  // Load the saved draft when the page first opens.
  const [draft, setDraft] =
    useState<ListingDraft>(() => {
      const saved =
        localStorage.getItem(
          STORAGE_KEY,
        );

      if (saved) {
        try {
          const parsed =
            JSON.parse(saved);

          // File objects cannot be restored from localStorage.
          parsed.images = [];
          parsed.documents = [];
          parsed.ownershipVerification =
            [];

          return parsed;
        } catch (error) {
          console.error(
            'Failed to parse saved draft',
            error,
          );
        }
      }

      return initialDraftState;
    });

  // Load the real Agent listing when editId exists.
  useEffect(() => {
    // There is nothing to load for normal Create Listing mode.
    if (!editId) {
      setIsLoadingEdit(false);
      return;
    }

    // Only an Agent should use this edit workflow.
    if (user?.role !== ROLES.AGENT) {
      setIsLoadingEdit(false);
      setSubmitError(
        'Only Agents can edit Agent listings.',
      );
      return;
    }

    let cancelled = false;

    const loadEditableProperty =
      async () => {
        try {
          setIsLoadingEdit(true);
          setSubmitError('');

          // Fetch the Agent's real listing collection.
          const response =
            await agentApi.getMyListings();

          // Read the unwrapped Property collection.
          const properties =
            response?.properties ||
            [];

          // Find the exact property requested by editId.
          const property =
            properties.find(
              (item: AgentPropertyRecord) =>
                String(item?._id) ===
                String(editId),
            ) as
            | AgentPropertyRecord
            | undefined;

          if (!property) {
            throw new Error(
              'The requested property could not be found in your Agent listings.',
            );
          }

          // Prevent editing completed/archived properties from the frontend.
          const lockedStatuses = [
            'Sold',
            'Rented',
            'Leased',
            'Archived',
          ];

          if (
            lockedStatuses.includes(
              property.status || '',
            )
          ) {
            throw new Error(
              'Completed or archived properties cannot be edited.',
            );
          }

          if (!cancelled) {
            // Convert the backend property into the form's draft structure.
            const editDraft =
              mapAgentPropertyToDraft(
                property,
              );

            // Populate the form with the real property values.
            setDraft(editDraft);

            // Preserve existing remote media separately.
            setExistingImageUrls(
              Array.isArray(
                property.images,
              )
                ? property.images
                : [],
            );

            // Preserve existing document URLs separately.
            setExistingDocumentUrls(
              Array.isArray(
                property.documents,
              )
                ? property.documents.map(
                  (document) =>
                    String(
                      document?.url ||
                      '',
                    ),
                ).filter(Boolean)
                : [],
            );

            // Start the edit form at the first step.
            setCurrentStep(0);

            // Remove any old create-mode draft so it cannot overwrite
            // the real property values while the Agent is editing.
            localStorage.removeItem(
              STORAGE_KEY,
            );
          }
        } catch (error) {
          console.error(
            'Failed to load Agent property for editing:',
            error,
          );

          if (!cancelled) {
            const message =
              error instanceof Error
                ? error.message
                : 'Unable to load the Agent property for editing.';

            setSubmitError(message);
          }
        } finally {
          if (!cancelled) {
            setIsLoadingEdit(false);
          }
        }
      };

    loadEditableProperty();

    return () => {
      cancelled = true;
    };
  }, [
    editId,
    user?.role,
  ]);

  // Persist serializable listing fields whenever the draft changes.
  useEffect(() => {
    // Do not overwrite the edit flow with a local create draft.
    if (editId) {
      return;
    }

    // Exclude browser File objects because they cannot be serialized.
    const {
      images,
      documents,
      ownershipVerification,
      ...serializable
    } = draft;

    // Explicitly reference excluded variables so TypeScript does not flag them.
    void images;
    void documents;
    void ownershipVerification;

    // Save the serializable listing draft.
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        serializable,
      ),
    );
  }, [draft, editId]);

  // Update one or more fields inside the listing draft.
  const updateDraft = (
    updates: Partial<ListingDraft>,
  ) => {
    setDraft(
      (previousDraft) => ({
        ...previousDraft,
        ...updates,
      }),
    );

    // Clear a previous submission error when the user changes the form.
    if (submitError) {
      setSubmitError('');
    }
  };

  // Move to the next Create Listing step.
  const handleNext = () => {
    if (
      currentStep <
      STEPS.length - 1
    ) {
      setCurrentStep(
        (current) =>
          current + 1,
      );

      // Return the viewport to the top of the form.
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  // Move back to the previous Create Listing step.
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(
        (current) =>
          current - 1,
      );

      // Return the viewport to the top of the form.
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  // Validate the minimum information required before sending the listing.
  const validateBeforeSubmit = () => {
    // Require the main property information.
    if (
      !draft.title.trim() ||
      !draft.propertyType ||
      !draft.transactionType ||
      !draft.description.trim()
    ) {
      return 'Please complete the Basic Information section before submitting.';
    }

    // Require the mandatory property location fields.
    if (
      !draft.country.trim() ||
      !draft.state.trim() ||
      !draft.city.trim() ||
      !draft.address.trim()
    ) {
      return 'Please complete the required Location information before submitting.';
    }

    // Require the core physical property information.
    if (
      draft.bedrooms === '' ||
      draft.bathrooms === '' ||
      !draft.propertySize.trim()
    ) {
      return 'Please complete the required Property Details before submitting.';
    }

    // Require pricing unless the listing is explicitly price-on-request.
    if (
      draft.priceType !==
      'Price On Request' &&
      draft.priceValue === ''
    ) {
      return 'Please enter the property price before submitting.';
    }

    // For normal creation, at least one new property image is required.
    // For editing, existing server images already satisfy the media requirement.
    if (
      !editId &&
      draft.images.length === 0
    ) {
      return 'Please upload at least one property image before submitting.';
    }

    // Agent editing does not require the Agent to re-enter ownership
    // information or upload duplicate ownership documents.
    if (!editId) {
      // Assigned properties do not require ownership information from the creator.
      if (
        draft.listingSource !==
        'Assigned Property'
      ) {
        // Owner identity comes from the authenticated session and is
        // attached by the backend during property creation.
        if (
          user?.role !== ROLES.OWNER
        ) {
          if (
            !draft.ownerName.trim() &&
            !draft.organizationName.trim()
          ) {
            return 'Please provide the legal owner or organization name.';
          }
        }

        // Owner submissions still require ownership verification documents.
        if (
          draft.ownershipVerification
            .length === 0
        ) {
          return 'Please upload at least one ownership verification document.';
        }
      }
    }

    // Lease listings must contain a lease duration.
    if (
      draft.transactionType ===
      'lease' &&
      !draft.leaseDuration.trim()
    ) {
      return 'Please provide the lease duration.';
    }

    // Return an empty string when validation succeeds.
    return '';
  };

  // Submit the completed listing to the backend.
  const handleSubmit = async () => {
    // Prevent duplicate submissions.
    if (isSubmitting) {
      return;
    }

    // Validate the completed form before starting network requests.
    const validationError =
      validateBeforeSubmit();

    if (validationError) {
      setSubmitError(
        validationError,
      );
      return;
    }

    try {
      // Start the submission state.
      setIsSubmitting(true);

      // Clear any previous submission error.
      setSubmitError('');

      // ==============================
      // EDIT EXISTING AGENT PROPERTY
      // ==============================
      if (editId) {
        // Build only the editable fields.
        // Existing ownership, assignment, media, status, and audit fields
        // are intentionally left out of this request.
        const editPayload =
          buildAgentEditPayload(
            draft,
          );

        // Update the existing property.
        const editResponse =
          await propertyApi.updateAgentProperty(
            editId,
            editPayload,
          );

        // The shared Property PATCH response should return the updated property.
        if (
          !editResponse?.property?._id
        ) {
          throw new Error(
            'The property was updated, but no property ID was returned.',
          );
        }

        // The Agent edit endpoint intentionally changes the property back
        // to Draft. The Agent then submits that existing property for review.
        const reviewResponse =
          (await propertyApi.submitPropertyForReview(
            editId,
          )) as SubmitReviewResponse;

        if (
          !reviewResponse?.property?._id
        ) {
          throw new Error(
            'The edited property was saved, but it could not be submitted for review.',
          );
        }

        // Clear edit-mode local state.
        localStorage.removeItem(
          STORAGE_KEY,
        );

        // Return to the Agent's Properties tab.
        navigate(
          '/agent-dashboard?tab=Properties',
        );

        return;
      }

      // ==============================
      // NORMAL CREATE LISTING FLOW
      // ==============================

      // Upload the property images and treat the unwrapped API result as our expected response shape.
      const imageResponse =
        (await uploadApi.uploadPropertyImages(
          draft.images,
        )) as unknown as ImageUploadResponse;

      // Store the image URLs returned by the backend.
      const uploadedImages =
        imageResponse.images ?? [];

      // Combine regular listing documents and ownership verification documents.
      const documentsToUpload = [
        ...draft.documents,
        ...draft.ownershipVerification,
      ];

      // Prepare an empty document URL array for listings without documents.
      let uploadedDocuments: Array<{
        title: string;
        url: string;
      }> = [];

      // Only call the document endpoint when there are files to upload.
      if (
        documentsToUpload.length > 0
      ) {
        // Upload the property documents and treat the unwrapped API result as our expected response shape.
        const documentResponse =
          (await uploadApi.uploadPropertyDocuments(
            documentsToUpload,
          )) as unknown as DocumentUploadResponse;

        // Match each returned URL with the original file name.
        uploadedDocuments =
          documentResponse.documents.map(
            (url, index) => ({
              title:
                documentsToUpload[
                  index
                ]?.name ||
                `Property Document ${index + 1
                }`,
              url,
            }),
          );
      }

      // Convert the form draft into the backend's Property payload.
      const propertyPayload =
        mapListingDraftToPropertyPayload(
          draft,
          uploadedImages,
          uploadedDocuments,
        );

      // Create the property and treat the unwrapped API result as our expected response shape.
      const createResponse =
        (await propertyApi.createProperty(
          propertyPayload,
        )) as unknown as CreatePropertyResponse;

      const propertyId =
        createResponse.property?._id;

      // Creation must always return a property ID.
      if (!propertyId) {
        throw new Error(
          'The property was created, but no property ID was returned.',
        );
      }

      // Agent-created listings continue directly into the review workflow.
      // Owner-created properties stop after creation and remain Draft.
      if (
        user?.role ===
        ROLES.AGENT
      ) {
        const reviewResponse =
          (await propertyApi.submitPropertyForReview(
            propertyId,
          )) as SubmitReviewResponse;

        // The Agent review submission must return the created Property.
        if (
          !reviewResponse?.property?._id
        ) {
          throw new Error(
            'The Agent property review submission did not complete successfully.',
          );
        }
      }

      // Remove the local draft after successful creation
      // and, for Agents, successful review submission.
      localStorage.removeItem(
        STORAGE_KEY,
      );

      // Return the creator to the appropriate dashboard.
      if (
        user?.role ===
        ROLES.OWNER
      ) {
        navigate(
          '/owner-dashboard?tab=My%20Property%20Requests',
        );
      } else {
        navigate(
          getDashboardRoute(
            user?.role,
          ),
        );
      }
    } catch (error) {
      // Log the detailed error for development debugging.
      console.error(
        'Failed to submit property listing:',
        error,
      );

      // Show a useful user-facing submission message.
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to submit the property listing. Please try again.';

      setSubmitError(message);
    } finally {
      // Always release the submitting state after the request finishes.
      setIsSubmitting(false);
    }
  };

  // Show a loading state while a real Agent property is being loaded.
  if (isLoadingEdit) {
    return (
      <DashboardLayout
        activeTab="Add Listing"
        onTabChange={() => { }}
      >
        <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-10 shadow-2xl text-center">
            <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-gold-500" />

            <h2 className="text-xl font-heading font-semibold text-white">
              Loading Listing
            </h2>

            <p className="mt-2 text-sm text-ink/60">
              Loading the existing property details for editing...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Render the content for the currently selected workflow step.
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <BasicInfoStep
            draft={draft}
            onChange={updateDraft}
          />
        );

      case 1:
        return (
          <LocationStep
            draft={draft}
            onChange={updateDraft}
          />
        );

      case 2:
        return (
          <PropertyDetailsStep
            draft={draft}
            onChange={updateDraft}
          />
        );

      case 3:
        return (
          <PricingStep
            draft={draft}
            onChange={updateDraft}
          />
        );

      case 4:
        return (
          <MediaUploadStep
            draft={draft}
            onChange={updateDraft}
            existingImageUrls={existingImageUrls}
            existingDocumentUrls={existingDocumentUrls}
          />
        );

      case 5:
        return (
          <OwnershipStep
            draft={draft}
            onChange={updateDraft}
          />
        );

      case 6:
        return (
          <ReviewSubmitStep
            draft={draft}
          />
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout
      activeTab="Add Listing"
      onTabChange={() => { }}
    >
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Page Heading */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-heading font-bold text-white">
              {editId
                ? 'Edit Property Listing'
                : 'Submit Listing'}
            </h1>

            {editId && (
              <span className="rounded-full bg-gold-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold-400 border border-gold-500/20">
                Editing Existing Listing
              </span>
            )}
          </div>

          <p className="mt-2 text-ink/60">
            {editId
              ? 'Update the existing property details and submit the listing for review again.'
              : 'Complete the property details below to create a new listing.'}
          </p>
        </div>

        {/* Edit Error */}
        {editId && submitError && (
          <div className="mb-8 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
            <p className="text-sm text-red-300">
              {submitError}
            </p>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            {STEPS.map(
              (step, index) => (
                <div
                  key={step}
                  className="flex flex-col items-center relative z-10"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${index <= currentStep
                      ? 'bg-gold-500 text-navy-900 shadow-gold'
                      : 'bg-navy-800 text-ink/50 border border-white/10'
                      }`}
                  >
                    {index <
                      currentStep
                      ? '✓'
                      : index + 1}
                  </div>

                  <span
                    className={`mt-2 text-xs font-medium uppercase tracking-wider hidden sm:block ${index <= currentStep
                      ? 'text-gold-400'
                      : 'text-ink/50'
                      }`}
                  >
                    {step}
                  </span>
                </div>
              ),
            )}

            <div className="absolute left-8 right-8 h-0.5 bg-navy-800 -z-0 hidden sm:block top-[52px]" />
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl">
          {renderStepContent()}

          {/* Submission Error */}
          {submitError && (
            <div className="mt-8 p-4 rounded-xl border border-red-500/20 bg-red-500/10">
              <p className="text-sm text-red-300">
                {submitError}
              </p>
            </div>
          )}

          {/* Existing server media notice during edit mode */}
          {editId &&
            (existingImageUrls.length >
              0 ||
              existingDocumentUrls.length >
              0) && (
              <div className="mt-8 rounded-xl border border-gold-500/15 bg-gold-500/5 p-4">
                <p className="text-sm text-gold-200">
                  Existing property media and documents are being preserved while you edit this listing.
                </p>

                <div className="mt-2 flex flex-wrap gap-4 text-xs text-ink/50">
                  {existingImageUrls.length >
                    0 && (
                      <span>
                        {
                          existingImageUrls.length
                        } existing image
                        {existingImageUrls.length !==
                          1
                          ? 's'
                          : ''}
                      </span>
                    )}

                  {existingDocumentUrls.length >
                    0 && (
                      <span>
                        {
                          existingDocumentUrls.length
                        } existing document
                        {existingDocumentUrls.length !==
                          1
                          ? 's'
                          : ''}
                      </span>
                    )}
                </div>
              </div>
            )}

          {/* Navigation Controls */}
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => {
                if (
                  window.confirm(
                    'Are you sure you want to exit? Your draft is saved locally.',
                  )
                ) {
                  navigate(-1);
                }
              }}
              className="text-sm text-ink/50 hover:text-ink transition-colors"
              disabled={
                isSubmitting
              }
            >
              Cancel & Exit
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {currentStep >
                0 && (
                  <GhostButton
                    onClick={
                      handleBack
                    }
                    className="flex-1 sm:flex-none"
                    disabled={
                      isSubmitting
                    }
                  >
                    Back
                  </GhostButton>
                )}

              {currentStep <
                STEPS.length - 1 ? (
                <GoldButton
                  onClick={
                    handleNext
                  }
                  className="flex-1 sm:flex-none"
                  disabled={
                    isSubmitting
                  }
                >
                  Continue
                </GoldButton>
              ) : (
                <>
                  {!editId && (
                    <GhostButton
                      onClick={() =>
                        alert(
                          'Draft saved successfully.',
                        )
                      }
                      className="flex-1 sm:flex-none border-dashed"
                      disabled={
                        isSubmitting
                      }
                    >
                      Save Draft
                    </GhostButton>
                  )}

                  {!editId && (
                    <GhostButton
                      onClick={() =>
                        alert(
                          'Preview mode opened.',
                        )
                      }
                      className="flex-1 sm:flex-none"
                      disabled={
                        isSubmitting
                      }
                    >
                      Preview Listing
                    </GhostButton>
                  )}

                  <GoldButton
                    onClick={
                      handleSubmit
                    }
                    className="flex-1 sm:flex-none"
                    disabled={
                      isSubmitting
                    }
                  >
                    {isSubmitting
                      ? editId
                        ? 'Updating...'
                        : 'Submitting...'
                      : editId
                        ? 'Update & Submit for Review'
                        : user?.role ===
                          ROLES.OWNER
                          ? 'Submit Property Request'
                          : 'Submit Listing'}
                  </GoldButton>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
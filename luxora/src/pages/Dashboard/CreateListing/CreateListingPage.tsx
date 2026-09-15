// Import the React hooks used by the Create Listing workflow.
import { useEffect, useState } from 'react';

// Import React Router navigation for dashboard redirection.
import { useNavigate } from 'react-router-dom';

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
import { GoldButton, GhostButton } from '../../../components/ui/ui';

// Import the dashboard route helper.
import { getDashboardRoute } from '../../../constants/routes';

// Import the current authenticated session.
import { useSession } from '../../../contexts/SessionContext';

// Import the Property API methods used to create and submit the listing.
import { propertyApi } from '../../../api/property.api';

// Import the property payload mapper.
import { mapListingDraftToPropertyPayload } from './propertyPayload.mapper';

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
  '✅ Review & Publish',
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

export default function CreateListingPage() {
  // Create the router navigation function.
  const navigate = useNavigate();

  // Get the currently authenticated user.
  const { user } = useSession();

  // Track which Create Listing step is currently visible.
  const [currentStep, setCurrentStep] = useState(0);

  // Track whether the final submission is currently running.
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Track any submission error that needs to be shown to the user.
  const [submitError, setSubmitError] = useState('');

  // Load the saved draft when the page first opens.
  const [draft, setDraft] = useState<ListingDraft>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        // File objects cannot be restored from localStorage.
        parsed.images = [];
        parsed.documents = [];
        parsed.ownershipVerification = [];

        return parsed;
      } catch (error) {
        console.error('Failed to parse saved draft', error);
      }
    }

    return initialDraftState;
  });

  // Persist serializable listing fields whenever the draft changes.
  useEffect(() => {
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
      JSON.stringify(serializable),
    );
  }, [draft]);

  // Update one or more fields inside the listing draft.
  const updateDraft = (updates: Partial<ListingDraft>) => {
    setDraft((previousDraft) => ({
      ...previousDraft,
      ...updates,
    }));

    // Clear a previous submission error when the user changes the form.
    if (submitError) {
      setSubmitError('');
    }
  };

  // Move to the next Create Listing step.
  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((current) => current + 1);

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
      setCurrentStep((current) => current - 1);

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
      draft.priceType !== 'Price on Request' &&
      draft.priceValue === ''
    ) {
      return 'Please enter the property price before submitting.';
    }

    // Require at least one property image.
    if (draft.images.length === 0) {
      return 'Please upload at least one property image before submitting.';
    }

    // Assigned properties do not require ownership information from the creator.
    if (draft.listingSource !== 'Assigned Property') {
      // Require the owner or organization identity.
      if (
        !draft.ownerName.trim() &&
        !draft.organizationName.trim()
      ) {
        return 'Please provide the legal owner or organization name.';
      }

      // Require ownership verification documents.
      if (draft.ownershipVerification.length === 0) {
        return 'Please upload at least one ownership verification document.';
      }
    }

    // Lease listings must contain a lease duration.
    if (
      draft.transactionType === 'lease' &&
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
    const validationError = validateBeforeSubmit();

    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    try {
      // Start the submission state.
      setIsSubmitting(true);

      // Clear any previous submission error.
      setSubmitError('');

      // Upload the property images and treat the unwrapped API result as our expected response shape.
      const imageResponse = (await uploadApi.uploadPropertyImages(
        draft.images,
      )) as unknown as ImageUploadResponse;

      // Store the image URLs returned by the backend.
      const uploadedImages = imageResponse.images ?? [];

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
      if (documentsToUpload.length > 0) {
        // Upload the property documents and treat the unwrapped API result as our expected response shape.
        const documentResponse = (await uploadApi.uploadPropertyDocuments(
          documentsToUpload,
        )) as unknown as DocumentUploadResponse;

        // Match each returned URL with the original file name.
        uploadedDocuments = documentResponse.documents.map(
          (url, index) => ({
            title:
              documentsToUpload[index]?.name ||
              `Property Document ${index + 1}`,
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
      const createResponse = (await propertyApi.createProperty(
        propertyPayload,
      )) as unknown as CreatePropertyResponse;

      // Extract the newly created Property ID.
      const propertyId = createResponse.property?._id;

      // Stop when the backend did not return a usable Property ID.
      if (!propertyId) {
        throw new Error(
          'The property was created, but no property ID was returned.',
        );
      }

      // Submit the newly created Draft to the review workflow.
      const reviewResponse = (
        await propertyApi.submitPropertyForReview(propertyId)
      ) as SubmitReviewResponse;

      // Ensure the review submission returned successfully.
      if (!reviewResponse) {
        throw new Error(
          'The property was created, but review submission failed.',
        );
      }

      // Remove the local draft after successful submission.
      localStorage.removeItem(STORAGE_KEY);

      // Return the creator to the appropriate dashboard.
      navigate(getDashboardRoute(user?.role));
    } catch (error) {
      // Log the detailed error for development debugging.
      console.error('Failed to submit property listing:', error);

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
        return <ReviewSubmitStep draft={draft} />;

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
        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            {STEPS.map((step, index) => (
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
                  {index < currentStep ? '✓' : index + 1}
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
            ))}

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
              disabled={isSubmitting}
            >
              Cancel & Exit
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {currentStep > 0 && (
                <GhostButton
                  onClick={handleBack}
                  className="flex-1 sm:flex-none"
                  disabled={isSubmitting}
                >
                  Back
                </GhostButton>
              )}

              {currentStep < STEPS.length - 1 ? (
                <GoldButton
                  onClick={handleNext}
                  className="flex-1 sm:flex-none"
                >
                  Continue
                </GoldButton>
              ) : (
                <>
                  <GhostButton
                    onClick={() =>
                      alert('Draft saved successfully.')
                    }
                    className="flex-1 sm:flex-none border-dashed"
                    disabled={isSubmitting}
                  >
                    Save Draft
                  </GhostButton>

                  <GhostButton
                    onClick={() =>
                      alert('Preview mode opened.')
                    }
                    className="flex-1 sm:flex-none"
                    disabled={isSubmitting}
                  >
                    Preview Listing
                  </GhostButton>

                  <GoldButton
                    onClick={handleSubmit}
                    className="flex-1 sm:flex-none"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? 'Submitting...'
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
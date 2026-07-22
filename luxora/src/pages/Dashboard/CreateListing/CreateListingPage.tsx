import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../../components/layout';
import { BasicInfoStep } from './components/BasicInfoStep';
import { LocationStep } from './components/LocationStep';
import { PropertyDetailsStep } from './components/PropertyDetailsStep';
import { PricingStep } from './components/PricingStep';
import { MediaUploadStep } from './components/MediaUploadStep';
import { OwnershipStep } from './components/OwnershipStep';
import { ReviewSubmitStep } from './components/ReviewSubmitStep';
import { initialDraftState, type ListingDraft } from './types';
import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { ROUTES } from '../../../constants/routes';

const STEPS = [
  'Basic Info',
  'Location',
  'Details',
  'Pricing',
  'Media',
  'Ownership',
  'Review'
];

const STORAGE_KEY = 'luxora_listing_draft';

export default function CreateListingPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [draft, setDraft] = useState<ListingDraft>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Reset File objects as they can't be JSON serialized easily
        parsed.images = [];
        parsed.documents = [];
        parsed.ownershipVerification = [];
        return parsed;
      } catch (e) {
        console.error('Failed to parse saved draft', e);
      }
    }
    return initialDraftState;
  });

  useEffect(() => {
    // Only save serializable fields to local storage
    const { images, documents, ownershipVerification, ...serializable } = draft;
    void images;
    void documents;
    void ownershipVerification;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
  }, [draft]);

  const updateDraft = (updates: Partial<ListingDraft>) => {
    setDraft(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(c => c + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(c => c - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = () => {
    // Here we would dispatch the draft to an API endpoint
    // to become a pending Property object.
    
    // Clear draft on success
    localStorage.removeItem(STORAGE_KEY);
    
    // Redirect back to agent dashboard (My Listings)
    navigate(ROUTES.AGENT_DASHBOARD);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: return <BasicInfoStep draft={draft} onChange={updateDraft} />;
      case 1: return <LocationStep draft={draft} onChange={updateDraft} />;
      case 2: return <PropertyDetailsStep draft={draft} onChange={updateDraft} />;
      case 3: return <PricingStep draft={draft} onChange={updateDraft} />;
      case 4: return <MediaUploadStep draft={draft} onChange={updateDraft} />;
      case 5: return <OwnershipStep draft={draft} onChange={updateDraft} />;
      case 6: return <ReviewSubmitStep draft={draft} />;
      default: return null;
    }
  };

  return (
    <DashboardLayout activeTab="Add Listing" onTabChange={() => {}}>
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        
        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            {STEPS.map((step, index) => (
              <div key={step} className="flex flex-col items-center relative z-10">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
                    index <= currentStep 
                      ? 'bg-gold-500 text-navy-900 shadow-gold' 
                      : 'bg-navy-800 text-ink/50 border border-white/10'
                  }`}
                >
                  {index < currentStep ? '✓' : index + 1}
                </div>
                <span className={`mt-2 text-xs font-medium uppercase tracking-wider hidden sm:block ${
                  index <= currentStep ? 'text-gold-400' : 'text-ink/50'
                }`}>
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

          {/* Navigation Controls */}
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
            <button
              onClick={() => {
                // Return to previous page or dashboard
                if (window.confirm('Are you sure you want to exit? Your draft is saved.')) {
                  navigate(-1);
                }
              }}
              className="text-sm text-ink/50 hover:text-ink transition-colors"
            >
              Cancel & Exit
            </button>
            
            <div className="flex items-center gap-4 w-full sm:w-auto">
              {currentStep > 0 && (
                <GhostButton onClick={handleBack} className="flex-1 sm:flex-none">
                  Back
                </GhostButton>
              )}
              
              {currentStep < STEPS.length - 1 ? (
                <GoldButton onClick={handleNext} className="flex-1 sm:flex-none">
                  Continue
                </GoldButton>
              ) : (
                <GoldButton onClick={handleSubmit} className="flex-1 sm:flex-none">
                  Submit Listing
                </GoldButton>
              )}
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

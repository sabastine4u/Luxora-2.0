import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';
import { ImageUploader } from '../../../../components/ui/ImageUploader';
import type { ListingDraft } from '../types';
import { LISTING_SOURCES } from '../../../../constants/propertyOptions';

interface Props {
  draft: ListingDraft;
  onChange: (updates: Partial<ListingDraft>) => void;
}

export function OwnershipStep({ draft, onChange }: Props) {
  const source = draft.listingSource || 'Private Owner';

  const renderAssignedProperty = () => (
    <div className="space-y-4">
      <div className="p-4 bg-navy-800 border border-white/10 rounded-xl">
        <h4 className="text-sm font-semibold text-white mb-2">CRM Integration Active</h4>
        <p className="text-sm text-ink/70 mb-4">This property was assigned to you via the CRM. Owner information is already verified and linked.</p>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="block text-ink/50 uppercase tracking-wider text-xs mb-1">Owner</span>
            <span className="text-white font-medium">Linked CRM Client</span>
          </div>
          <div>
            <span className="block text-ink/50 uppercase tracking-wider text-xs mb-1">Verification</span>
            <span className="text-green-400 font-medium">✓ Verified by Admin</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivateOwner = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Search Existing CRM Owner"
          placeholder="e.g. John Doe or +234..."
          value={draft.ownerName}
          onChange={(e) => onChange({ ownerName: e.target.value })}
        />
        <Input
          label="Owner Reference / ID (If New)"
          placeholder="e.g. owner_12345"
          value={draft.ownerReference}
          onChange={(e) => onChange({ ownerReference: e.target.value })}
        />
      </div>

      <ImageUploader
        label="Verification Documents (C of O, Deed of Assignment, etc.)"
        maxFiles={5}
        value={draft.ownershipVerification}
        onChange={(docs) => onChange({ ownershipVerification: docs })}
      />
      
      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-start gap-3">
        <svg className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-blue-200/80 leading-relaxed">
          All submitted documents are heavily encrypted and routed strictly to the internal Legal & Compliance team.
        </p>
      </div>
    </div>
  );

  const renderOrganizationFields = () => {
    let orgLabel = "Organization Name";
    let repLabel = "Representative Name";

    if (source === 'Developer Project') {
      orgLabel = "Developer Company";
      repLabel = "Project Name";
    } else if (source === 'Bank Property') {
      orgLabel = "Bank Name";
      repLabel = "Asset Manager Name";
    } else if (source === 'Government Property') {
      orgLabel = "Government Agency";
      repLabel = "Department / Representative";
    }

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label={orgLabel}
            placeholder="Enter name..."
            value={draft.organizationName}
            onChange={(e) => onChange({ organizationName: e.target.value })}
          />
          <Input
            label={repLabel}
            placeholder="Enter representative..."
            value={draft.organizationRep}
            onChange={(e) => onChange({ organizationRep: e.target.value })}
          />
        </div>
        <p className="text-sm text-ink/50">
          No individual private owner reference is required for this listing source.
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-heading font-semibold text-white">Ownership Information</h2>
          <span className="px-2.5 py-1 rounded-full bg-gold-500/20 text-gold-400 text-xs font-semibold uppercase tracking-wider">
            {source}
          </span>
        </div>
        <p className="text-ink/70 mt-1">Provide details on the property ownership and verification source.</p>
      </div>

      <div className="space-y-6 bg-navy-900/50 p-6 rounded-2xl border border-white/5">
        <Select
          label="Listing Source"
          options={LISTING_SOURCES}
          value={source}
          onChange={(e) => onChange({ listingSource: e.target.value })}
        />

        <div className="pt-4 border-t border-white/10">
          {source === 'Assigned Property' && renderAssignedProperty()}
          {source === 'Private Owner' && renderPrivateOwner()}
          {['Agency Portfolio', 'Developer Project', 'Bank Property', 'Corporate Property', 'Government Property'].includes(source) && renderOrganizationFields()}
        </div>
      </div>
    </div>
  );
}


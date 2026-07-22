import { Input } from '../../../../components/ui/Input';
import { Textarea } from '../../../../components/ui/Textarea';
import { Select } from '../../../../components/ui/Select';
import type { ListingDraft } from '../types';

interface Props {
  draft: ListingDraft;
  onChange: (updates: Partial<ListingDraft>) => void;
}

export function BasicInfoStep({ draft, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-semibold text-white">Basic Information</h2>
        <p className="text-ink/70 mt-1">Start by providing the fundamental details of the property.</p>
      </div>

      <div className="space-y-4">
        <Input
          label="Property Title"
          placeholder="e.g. Luxury 5 Bedroom Duplex in Lekki"
          value={draft.title}
          onChange={(e) => onChange({ title: e.target.value })}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Transaction Type"
            options={[
              { value: '', label: 'Select Transaction' },
              { value: 'buy', label: 'For Sale' },
              { value: 'rent', label: 'For Rent' },
              { value: 'lease', label: 'For Lease' }
            ]}
            value={draft.transactionType}
            onChange={(e) => onChange({ transactionType: e.target.value as ListingDraft['transactionType'] })}
          />

          <Select
            label="Property Type"
            options={[
              { value: '', label: 'Select Type' },
              { value: 'Apartment', label: 'Apartment' },
              { value: 'Duplex', label: 'Duplex' },
              { value: 'Studio', label: 'Studio' },
              { value: 'Villa', label: 'Villa' },
              { value: 'Penthouse', label: 'Penthouse' },
              { value: 'Land', label: 'Land' },
              { value: 'Office Space', label: 'Office Space' }
            ]}
            value={draft.propertyType}
            onChange={(e) => onChange({ propertyType: e.target.value as ListingDraft['propertyType'] })}
          />
        </div>

        <Textarea
          label="Description"
          placeholder="Describe the property, its unique selling points, and key features..."
          value={draft.description}
          onChange={(e) => onChange({ description: e.target.value })}
        />
      </div>
    </div>
  );
}

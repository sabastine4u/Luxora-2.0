import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';
import type { ListingDraft } from '../types';

interface Props {
  draft: ListingDraft;
  onChange: (updates: Partial<ListingDraft>) => void;
}

export function LocationStep({ draft, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-semibold text-white">Location Details</h2>
        <p className="text-ink/70 mt-1">Specify exactly where this property is located.</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Country"
            options={[
              { value: 'Nigeria', label: 'Nigeria' },
              { value: 'Ghana', label: 'Ghana' },
              { value: 'Kenya', label: 'Kenya' }
            ]}
            value={draft.country}
            onChange={(e) => onChange({ country: e.target.value })}
          />

          <Select
            label="State / Region"
            options={[
              { value: '', label: 'Select State' },
              { value: 'Lagos', label: 'Lagos' },
              { value: 'Abuja', label: 'Abuja' },
              { value: 'Rivers', label: 'Rivers' }
            ]}
            value={draft.state}
            onChange={(e) => onChange({ state: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="City"
            placeholder="e.g. Lekki"
            value={draft.city}
            onChange={(e) => onChange({ city: e.target.value })}
          />

          <Input
            label="Neighborhood / Area"
            placeholder="e.g. Phase 1"
            value={draft.area}
            onChange={(e) => onChange({ area: e.target.value })}
          />
        </div>

        <Input
          label="Street Address"
          placeholder="e.g. 15 Admiralty Way"
          value={draft.address}
          onChange={(e) => onChange({ address: e.target.value })}
        />
      </div>
    </div>
  );
}

import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';
import { Checkbox } from '../../../../components/ui/Checkbox';
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Estate / Compound Name"
            placeholder="e.g. Nicon Town"
            value={draft.estateName}
            onChange={(e) => onChange({ estateName: e.target.value })}
          />
          <Input
            label="Landmark (Optional)"
            placeholder="e.g. Opposite Shoprite"
            value={draft.landmark}
            onChange={(e) => onChange({ landmark: e.target.value })}
          />
        </div>

        <Input
          label="Street Address"
          placeholder="e.g. 15 Admiralty Way"
          value={draft.address}
          onChange={(e) => onChange({ address: e.target.value })}
        />

        <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
          <Checkbox
            label="Hide Exact Address From Public"
            checked={draft.hideExactAddress}
            onChange={(e) => onChange({ hideExactAddress: e.target.checked })}
          />
          <p className="text-xs text-ink/50 mt-1 ml-7">
            The property will only show the Area and Estate Name. Street address will be hidden.
          </p>
        </div>
      </div>
    </div>
  );
}

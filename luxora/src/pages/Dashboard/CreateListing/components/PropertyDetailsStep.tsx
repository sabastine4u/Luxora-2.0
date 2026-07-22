import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';
import { Checkbox } from '../../../../components/ui/Checkbox';
import type { ListingDraft } from '../types';

interface Props {
  draft: ListingDraft;
  onChange: (updates: Partial<ListingDraft>) => void;
}

const AMENITIES_LIST = [
  'Swimming Pool', 'Gym', '24/7 Power', '24/7 Security', 
  'Elevator', 'BQ', 'CCTV', 'Fitted Kitchen'
];

export function PropertyDetailsStep({ draft, onChange }: Props) {
  const toggleAmenity = (amenity: string) => {
    if (draft.amenities.includes(amenity)) {
      onChange({ amenities: draft.amenities.filter(a => a !== amenity) });
    } else {
      onChange({ amenities: [...draft.amenities, amenity] });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-semibold text-white">Property Details</h2>
        <p className="text-ink/70 mt-1">Provide specific features and dimensions of the property.</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            type="number"
            min="0"
            label="Bedrooms"
            placeholder="e.g. 4"
            value={draft.bedrooms}
            onChange={(e) => onChange({ bedrooms: e.target.value ? Number(e.target.value) : '' })}
          />

          <Input
            type="number"
            min="0"
            label="Bathrooms"
            placeholder="e.g. 5"
            value={draft.bathrooms}
            onChange={(e) => onChange({ bathrooms: e.target.value ? Number(e.target.value) : '' })}
          />

          <Input
            label="Property Size"
            placeholder="e.g. 500 sqm"
            value={draft.propertySize}
            onChange={(e) => onChange({ propertySize: e.target.value })}
          />
        </div>

        <Select
          label="Furnishing Status"
          options={[
            { value: '', label: 'Select Furnishing' },
            { value: 'Unfurnished', label: 'Unfurnished' },
            { value: 'Semi-Furnished', label: 'Semi-Furnished' },
            { value: 'Fully Furnished', label: 'Fully Furnished' }
          ]}
          value={draft.furnishing}
          onChange={(e) => onChange({ furnishing: e.target.value })}
        />

        <div>
          <label className="block text-sm font-medium text-ink/70 mb-3">Amenities</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
            {AMENITIES_LIST.map((amenity) => (
              <Checkbox
                key={amenity}
                label={amenity}
                checked={draft.amenities.includes(amenity)}
                onChange={() => toggleAmenity(amenity)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

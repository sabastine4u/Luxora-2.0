import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';
import { Checkbox } from '../../../../components/ui/Checkbox';
import type { ListingDraft } from '../types';
import { AMENITIES_LIST } from '../../../../constants/propertyOptions';

interface Props {
  draft: ListingDraft;
  onChange: (updates: Partial<ListingDraft>) => void;
}

export function PropertyDetailsStep({ draft, onChange }: Props) {
  const toggleAmenity = (amenity: string) => {
    if (draft.amenities.includes(amenity)) {
      onChange({ amenities: draft.amenities.filter(a => a !== amenity) });
    } else {
      onChange({ amenities: [...draft.amenities, amenity] });
    }
  };

  const isMultiFloorProperty = ['Apartment', 'Penthouse', 'Maisonette', 'Office Space', 'Commercial'].includes(draft.propertyType);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-semibold text-white">Property Details</h2>
        <p className="text-ink/70 mt-1">Provide specific features and dimensions of the property.</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            type="number"
            min="0"
            label="Toilets"
            placeholder="e.g. 6"
            value={draft.toilets}
            onChange={(e) => onChange({ toilets: e.target.value ? Number(e.target.value) : '' })}
          />

          <Input
            type="number"
            min="0"
            label="Parking Spaces"
            placeholder="e.g. 3"
            value={draft.parkingSpaces}
            onChange={(e) => onChange({ parkingSpaces: e.target.value ? Number(e.target.value) : '' })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Property Size"
            placeholder="e.g. 500 sqm"
            value={draft.propertySize}
            onChange={(e) => onChange({ propertySize: e.target.value })}
          />
          <Input
            type="number"
            min="1800"
            max={new Date().getFullYear() + 5}
            label="Year Built / Delivery"
            placeholder="e.g. 2024"
            value={draft.yearBuilt}
            onChange={(e) => onChange({ yearBuilt: e.target.value })}
          />
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
        </div>

        {isMultiFloorProperty && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Floor Number"
              placeholder="e.g. 3rd Floor"
              value={draft.floorNumber}
              onChange={(e) => onChange({ floorNumber: e.target.value })}
            />
            <Input
              label="Total Floors in Building"
              placeholder="e.g. 10"
              value={draft.totalFloors}
              onChange={(e) => onChange({ totalFloors: e.target.value })}
            />
          </div>
        )}

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

import { Input } from '../../../../components/ui/Input';
import { Textarea } from '../../../../components/ui/Textarea';
import { Select } from '../../../../components/ui/Select';
import type { ListingDraft } from '../types';
import { 
  TRANSACTION_TYPES, 
  PROPERTY_TYPES, 
  PROPERTY_CONDITIONS,
  PROPERTY_SUB_TYPES 
} from '../../../../constants/propertyOptions';

interface Props {
  draft: ListingDraft;
  onChange: (updates: Partial<ListingDraft>) => void;
}

export function BasicInfoStep({ draft, onChange }: Props) {
  const currentSubTypes = draft.propertyType ? PROPERTY_SUB_TYPES[draft.propertyType] || [] : [];

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
            options={TRANSACTION_TYPES}
            value={draft.transactionType}
            onChange={(e) => onChange({ transactionType: e.target.value as ListingDraft['transactionType'] })}
          />

          <Select
            label="Property Condition"
            options={PROPERTY_CONDITIONS}
            value={draft.propertyCondition}
            onChange={(e) => onChange({ propertyCondition: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Property Type"
            options={PROPERTY_TYPES}
            value={draft.propertyType}
            onChange={(e) => {
              onChange({ 
                propertyType: e.target.value as ListingDraft['propertyType'],
                propertySubType: '' // Reset sub-type when type changes
              });
            }}
          />

          {currentSubTypes.length > 0 && (
            <Select
              label="Property Sub-Type"
              options={currentSubTypes}
              value={draft.propertySubType}
              onChange={(e) => onChange({ propertySubType: e.target.value })}
            />
          )}
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

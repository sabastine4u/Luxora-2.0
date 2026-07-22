import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';
import { Checkbox } from '../../../../components/ui/Checkbox';
import type { ListingDraft } from '../types';

interface Props {
  draft: ListingDraft;
  onChange: (updates: Partial<ListingDraft>) => void;
}

const PAYMENT_PLANS = [
  'Outright Payment',
  '3 Months Plan',
  '6 Months Plan',
  '12 Months Plan'
];

export function PricingStep({ draft, onChange }: Props) {
  const isRentOrLease = draft.transactionType === 'rent' || draft.transactionType === 'lease';

  const togglePaymentPlan = (plan: string) => {
    if (draft.paymentPlans.includes(plan)) {
      onChange({ paymentPlans: draft.paymentPlans.filter(p => p !== plan) });
    } else {
      onChange({ paymentPlans: [...draft.paymentPlans, plan] });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-semibold text-white">Pricing & Payment</h2>
        <p className="text-ink/70 mt-1">Set the asking price and acceptable payment methods.</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="number"
            min="0"
            label={isRentOrLease ? "Rent Amount (₦)" : "Price (₦)"}
            placeholder="e.g. 150000000"
            value={draft.priceValue}
            onChange={(e) => {
              const val = e.target.value ? Number(e.target.value) : '';
              onChange({ 
                priceValue: val,
                // Also automatically set the formatted string representation
                price: val ? `₦${val.toLocaleString()}` : '' 
              });
            }}
          />

          <Select
            label="Mortgage Availability"
            options={[
              { value: '', label: 'Select Option' },
              { value: 'true', label: 'Mortgage Supported' },
              { value: 'false', label: 'Cash / Payment Plan Only' }
            ]}
            value={draft.mortgageOptions}
            onChange={(e) => onChange({ mortgageOptions: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink/70 mb-3">Acceptable Payment Plans</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
            {PAYMENT_PLANS.map((plan) => (
              <Checkbox
                key={plan}
                label={plan}
                checked={draft.paymentPlans.includes(plan)}
                onChange={() => togglePaymentPlan(plan)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';
import { Checkbox } from '../../../../components/ui/Checkbox';
import type { ListingDraft } from '../types';
import { PAYMENT_PLANS, PRICE_TYPES, CURRENCIES } from '../../../../constants/propertyOptions';

interface Props {
  draft: ListingDraft;
  onChange: (updates: Partial<ListingDraft>) => void;
}

export function PricingStep({ draft, onChange }: Props) {
  const transactionType = draft.transactionType;

  const togglePaymentPlan = (plan: string) => {
    if (draft.paymentPlans.includes(plan)) {
      onChange({ paymentPlans: draft.paymentPlans.filter(p => p !== plan) });
    } else {
      onChange({ paymentPlans: [...draft.paymentPlans, plan] });
    }
  };

  const renderBuyFields = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          label="Currency"
          options={CURRENCIES}
          value={draft.currency || 'NGN'}
          onChange={(e) => onChange({ currency: e.target.value })}
        />
        <Input
          type="number"
          min="0"
          label="Sale Price"
          placeholder="e.g. 150000000"
          value={draft.priceValue}
          onChange={(e) => {
            const val = e.target.value ? Number(e.target.value) : '';
            const currSymbol = CURRENCIES.find(c => c.value === draft.currency)?.label.split(' ')[0] || '₦';
            onChange({ 
              priceValue: val,
              price: val ? `${currSymbol}${val.toLocaleString()}` : '' 
            });
          }}
        />
        <Select
          label="Price Type"
          options={PRICE_TYPES}
          value={draft.priceType || 'Fixed Price'}
          onChange={(e) => onChange({ priceType: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
  );

  const renderRentFields = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="number"
          min="0"
          label="Annual Rent (₦)"
          placeholder="e.g. 5000000"
          value={draft.priceValue}
          onChange={(e) => {
            const val = e.target.value ? Number(e.target.value) : '';
            onChange({ 
              priceValue: val,
              price: val ? `₦${val.toLocaleString()}` : '' 
            });
          }}
        />
        <div className="mt-8">
          <Checkbox
            label="Rent is Negotiable"
            checked={draft.isNegotiable}
            onChange={(e) => onChange({ isNegotiable: e.target.checked })}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-white mb-4">Additional Charges</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/5 p-6 rounded-xl border border-white/10">
          <Input
            type="number"
            min="0"
            label="Service Charge (₦)"
            placeholder="e.g. 500000"
            value={draft.serviceCharge}
            onChange={(e) => onChange({ serviceCharge: e.target.value ? Number(e.target.value) : '' })}
          />
          <Input
            type="number"
            min="0"
            label="Agency Fee (₦)"
            placeholder="e.g. 500000"
            value={draft.agencyFee}
            onChange={(e) => onChange({ agencyFee: e.target.value ? Number(e.target.value) : '' })}
          />
          <Input
            type="number"
            min="0"
            label="Legal Fee (₦)"
            placeholder="e.g. 250000"
            value={draft.legalFee}
            onChange={(e) => onChange({ legalFee: e.target.value ? Number(e.target.value) : '' })}
          />
          <Input
            type="number"
            min="0"
            label="Caution Deposit (₦)"
            placeholder="e.g. 250000"
            value={draft.cautionDeposit}
            onChange={(e) => onChange({ cautionDeposit: e.target.value ? Number(e.target.value) : '' })}
          />
          <div className="col-span-1 md:col-span-2">
            <Input
              type="number"
              min="0"
              label="Other Charges (₦)"
              placeholder="e.g. 0"
              value={draft.otherCharges}
              onChange={(e) => onChange({ otherCharges: e.target.value ? Number(e.target.value) : '' })}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderLeaseFields = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="number"
          min="0"
          label="Lease Price (₦)"
          placeholder="e.g. 15000000"
          value={draft.priceValue}
          onChange={(e) => {
            const val = e.target.value ? Number(e.target.value) : '';
            onChange({ 
              priceValue: val,
              price: val ? `₦${val.toLocaleString()}` : '' 
            });
          }}
        />
        <Input
          label="Lease Duration"
          placeholder="e.g. 10 Years"
          value={draft.leaseDuration}
          onChange={(e) => onChange({ leaseDuration: e.target.value })}
        />
      </div>

      <div>
        <h3 className="text-lg font-medium text-white mb-4">Additional Charges</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/5 p-6 rounded-xl border border-white/10">
          <Input
            type="number"
            min="0"
            label="Service Charge (₦)"
            placeholder="e.g. 500000"
            value={draft.serviceCharge}
            onChange={(e) => onChange({ serviceCharge: e.target.value ? Number(e.target.value) : '' })}
          />
          <Input
            type="number"
            min="0"
            label="Other Charges (₦)"
            placeholder="e.g. 0"
            value={draft.otherCharges}
            onChange={(e) => onChange({ otherCharges: e.target.value ? Number(e.target.value) : '' })}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-semibold text-white">Pricing & Payment</h2>
        <p className="text-ink/70 mt-1">Set the asking price and acceptable payment methods.</p>
      </div>

      {!transactionType && (
        <div className="p-4 bg-navy-800/50 border border-white/10 rounded-xl text-ink/70">
          Please select a Transaction Type in the Basic Info step to configure pricing.
        </div>
      )}

      {transactionType === 'buy' && renderBuyFields()}
      {transactionType === 'rent' && renderRentFields()}
      {transactionType === 'lease' && renderLeaseFields()}
    </div>
  );
}

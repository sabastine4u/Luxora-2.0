import { Input } from '../../../../components/ui/Input';
import { ImageUploader } from '../../../../components/ui/ImageUploader';
import type { ListingDraft } from '../types';

interface Props {
  draft: ListingDraft;
  onChange: (updates: Partial<ListingDraft>) => void;
}

export function OwnershipStep({ draft, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-heading font-semibold text-white">Ownership Information</h2>
          <span className="px-2.5 py-1 rounded-full bg-gold-500/20 text-gold-400 text-xs font-semibold uppercase tracking-wider">Private</span>
        </div>
        <p className="text-ink/70 mt-1">This information is strictly for internal verification and will never be exposed publicly.</p>
      </div>

      <div className="space-y-6 bg-navy-900/50 p-6 rounded-2xl border border-white/5">
        <Input
          label="Owner Reference / ID"
          placeholder="e.g. owner_12345 or full name"
          value={draft.ownerReference}
          onChange={(e) => onChange({ ownerReference: e.target.value })}
        />

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
            All submitted documents are heavily encrypted and routed strictly to the internal Legal & Compliance team. Agents and public users cannot view these records after submission.
          </p>
        </div>
      </div>
    </div>
  );
}

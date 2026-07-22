import { Input } from '../../../../components/ui/Input';
import { ImageUploader } from '../../../../components/ui/ImageUploader';
import type { ListingDraft } from '../types';

interface Props {
  draft: ListingDraft;
  onChange: (updates: Partial<ListingDraft>) => void;
}

export function MediaUploadStep({ draft, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-semibold text-white">Media & Documents</h2>
        <p className="text-ink/70 mt-1">Upload high-quality images and supporting materials.</p>
      </div>

      <div className="space-y-6">
        <ImageUploader
          label="Property Images"
          maxFiles={15}
          value={draft.images}
          onChange={(images) => onChange({ images })}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Video Tour URL"
            placeholder="e.g. https://youtube.com/..."
            value={draft.videoUrl}
            onChange={(e) => onChange({ videoUrl: e.target.value })}
          />

          <Input
            label="Digital Brochure URL"
            placeholder="e.g. https://drive.google.com/..."
            value={draft.brochureUrl}
            onChange={(e) => onChange({ brochureUrl: e.target.value })}
          />
        </div>

        <ImageUploader
          label="Floor Plans & Other Documents"
          maxFiles={5}
          value={draft.documents}
          onChange={(documents) => onChange({ documents })}
        />
      </div>
    </div>
  );
}

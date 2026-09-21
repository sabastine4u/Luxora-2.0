import { Input } from '../../../../components/ui/Input';
import { ImageUploader } from '../../../../components/ui/ImageUploader';
import type { ListingDraft } from '../types';

interface Props {
  draft: ListingDraft;
  onChange: (updates: Partial<ListingDraft>) => void;
}

export function MediaUploadStep({
  draft,
  onChange,
}: Props) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-heading font-semibold text-white">
          Media & Documents
        </h2>

        <p className="mt-1 text-ink/70">
          Upload high-quality images and supporting materials.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <ImageUploader
            label="Property Images"
            maxFiles={15}
            accept="image/jpeg,image/png,image/webp,image/avif"
           helperText="JPG, PNG, WEBP, AVIF up to 10MB"
            value={draft.images}
            onChange={(images) => {
              // Ensure coverImageIndex is still valid
              // after images are added or removed.
              let newIndex =
                draft.coverImageIndex;

              if (newIndex >= images.length) {
                newIndex = 0;
              }

              onChange({
                images,
                coverImageIndex: newIndex,
              });
            }}
          />

          {draft.images.length > 0 && (
            <div className="mt-4 rounded-xl border border-white/10 bg-navy-800/50 p-4">
              <label className="mb-3 block text-sm font-medium text-ink/70">
                Select Cover Image
              </label>

              <div className="flex flex-wrap gap-4">
                {draft.images.map(
                  (file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      onClick={() =>
                        onChange({
                          coverImageIndex: index,
                        })
                      }
                      className={`h-24 w-24 cursor-pointer overflow-hidden rounded-lg border-2 transition-all ${
                        draft.coverImageIndex ===
                        index
                          ? 'scale-105 border-gold-500 shadow-gold'
                          : 'border-transparent opacity-50 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={URL.createObjectURL(
                          file,
                        )}
                        alt={`Preview ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ),
                )}
              </div>

              <p className="mt-2 text-xs text-ink/50">
                The selected image will be the primary
                thumbnail for this listing.
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Input
            label="Video Tour URL"
            placeholder="e.g. https://youtube.com/..."
            value={draft.videoUrl}
            onChange={(e) =>
              onChange({
                videoUrl: e.target.value,
              })
            }
          />

          <Input
            label="Virtual Tour URL"
            placeholder="e.g. https://my.matterport.com/show/..."
            value={draft.virtualTourUrl}
            onChange={(e) =>
              onChange({
                virtualTourUrl:
                  e.target.value,
              })
            }
          />

          <Input
            label="Digital Brochure URL"
            placeholder="e.g. https://drive.google.com/..."
            value={draft.brochureUrl}
            onChange={(e) =>
              onChange({
                brochureUrl:
                  e.target.value,
              })
            }
          />
        </div>

        <ImageUploader
          label="Floor Plans & Other Documents"
          maxFiles={5}
          accept="application/pdf,image/jpeg,image/png"
          helperText="PDF, JPG, PNG up to 10MB"
          value={draft.documents}
          onChange={(documents) =>
            onChange({ documents })
          }
        />
      </div>
    </div>
  );
}
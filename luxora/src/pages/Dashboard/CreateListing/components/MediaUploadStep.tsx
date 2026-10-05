import { Input } from '../../../../components/ui/Input';
import { ImageUploader } from '../../../../components/ui/ImageUploader';
import type { ListingDraft } from '../types';

interface Props {
  draft: ListingDraft;
  onChange: (updates: Partial<ListingDraft>) => void;

  // Existing media already stored on the Property.
  // These are only used when editing an existing listing.
  existingImageUrls?: string[];
  existingDocumentUrls?: string[];
}

export function MediaUploadStep({
  draft,
  onChange,
  existingImageUrls = [],
  existingDocumentUrls = [],
}: Props) {
  const hasExistingImages =
    existingImageUrls.length > 0;

  const hasExistingDocuments =
    existingDocumentUrls.length > 0;

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

      <div className="space-y-8">
        {/* ========================================= */}
        {/* EXISTING PROPERTY IMAGES */}
        {/* ========================================= */}

        {hasExistingImages && (
          <div className="rounded-2xl border border-gold-500/20 bg-gold-500/5 p-5">
            <div className="mb-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-400">
                Existing Property Images
              </h3>

              <p className="mt-1 text-xs text-ink/50">
                These images are already attached to this
                listing and will remain on the property unless
                the listing is explicitly changed through the
                media workflow.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {existingImageUrls.map(
                (imageUrl, index) => (
                  <div
                    key={`${imageUrl}-${index}`}
                    className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-navy-900"
                  >
                    <img
                      src={imageUrl}
                      alt={`Existing property image ${
                        index + 1
                      }`}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3">
                      <span className="text-xs font-medium text-white">
                        Image {index + 1}
                      </span>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        )}

        {/* ========================================= */}
        {/* NEW PROPERTY IMAGES */}
        {/* ========================================= */}

        <div>
          <ImageUploader
            label={
              hasExistingImages
                ? 'Add More Property Images'
                : 'Property Images'
            }
            maxFiles={15}
            accept="image/jpeg,image/png,image/webp,image/avif"
            helperText="JPG, PNG, WEBP, AVIF up to 10MB"
            value={draft.images}
            onChange={(images) => {
              // Ensure coverImageIndex is still valid
              // after images are added or removed.
              let newIndex =
                draft.coverImageIndex;

              if (
                images.length === 0
              ) {
                newIndex = 0;
              } else if (
                newIndex >=
                images.length
              ) {
                newIndex = 0;
              }

              onChange({
                images,
                coverImageIndex:
                  newIndex,
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
                  (file, index) => {
                    const previewUrl =
                      URL.createObjectURL(
                        file,
                      );

                    return (
                      <div
                        key={`${file.name}-${index}`}
                        onClick={() =>
                          onChange({
                            coverImageIndex:
                              index,
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
                          src={previewUrl}
                          alt={`New preview ${
                            index + 1
                          }`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    );
                  },
                )}
              </div>

              <p className="mt-2 text-xs text-ink/50">
                The selected new image will be used as the
                primary image when new media is submitted.
              </p>
            </div>
          )}
        </div>

        {/* ========================================= */}
        {/* VIDEO / VIRTUAL TOUR / BROCHURE */}
        {/* ========================================= */}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Input
            label="Video Tour URL"
            placeholder="e.g. https://youtube.com/..."
            value={draft.videoUrl}
            onChange={(e) =>
              onChange({
                videoUrl:
                  e.target.value,
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

        {/* ========================================= */}
        {/* EXISTING DOCUMENTS */}
        {/* ========================================= */}

        {hasExistingDocuments && (
          <div className="rounded-2xl border border-white/10 bg-navy-800/40 p-5">
            <div className="mb-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-ink/80">
                Existing Documents
              </h3>

              <p className="mt-1 text-xs text-ink/50">
                Documents already attached to this property
                are preserved during the edit.
              </p>
            </div>

            <div className="space-y-2">
              {existingDocumentUrls.map(
                (documentUrl, index) => (
                  <a
                    key={`${documentUrl}-${index}`}
                    href={documentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3 transition-colors hover:border-gold-500/30 hover:bg-gold-500/5"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold-500/10 text-sm text-gold-400">
                        📄
                      </span>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white">
                          Existing Document{' '}
                          {index + 1}
                        </p>

                        <p className="truncate text-xs text-ink/40">
                          Stored property document
                        </p>
                      </div>
                    </div>

                    <span className="ml-4 shrink-0 text-xs font-semibold text-gold-400">
                      View
                    </span>
                  </a>
                ),
              )}
            </div>
          </div>
        )}

        {/* ========================================= */}
        {/* NEW DOCUMENTS */}
        {/* ========================================= */}

        <div>
          <ImageUploader
            label={
              hasExistingDocuments
                ? 'Add More Documents'
                : 'Floor Plans & Other Documents'
            }
            maxFiles={5}
            accept="application/pdf,image/jpeg,image/png"
            helperText="PDF, JPG, PNG up to 10MB"
            value={draft.documents}
            onChange={(documents) =>
              onChange({
                documents,
              })
            }
          />
        </div>
      </div>
    </div>
  );
}
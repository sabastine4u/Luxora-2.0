import { useState, useCallback, useRef, useEffect } from 'react';
import { FileText, X } from 'lucide-react';

export interface ImageUploaderProps {
  label?: string;
  maxFiles?: number;
  value?: File[];
  onChange?: (files: File[]) => void;
  error?: string;
  accept?: string;
  helperText?: string;
}

export function ImageUploader({
  label = 'Upload Images',
  maxFiles = 10,
  value = [],
  onChange,
  error,
 accept = "image/jpeg,image/png,image/webp,image/avif",
helperText = "PNG, JPG, WEBP, AVIF up to 10MB",
}: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (files: File[]) => {
      const newFiles = [...value, ...files].slice(
        0,
        maxFiles,
      );

      onChange?.(newFiles);

      const newPreviews = newFiles.map((file) => {
        if (file.type.startsWith('image/')) {
          return URL.createObjectURL(file);
        }

        return '';
      });

      setPreviews(newPreviews);
    },
    [value, maxFiles, onChange],
  );

  useEffect(() => {
    return () => {
      previews.forEach((preview) => {
        if (preview) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [previews]);

  const handleDrag = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (
        e.type === 'dragenter' ||
        e.type === 'dragover'
      ) {
        setDragActive(true);
      } else if (e.type === 'dragleave') {
        setDragActive(false);
      }
    },
    [],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (
        e.dataTransfer.files &&
        e.dataTransfer.files.length > 0
      ) {
        handleFiles(
          Array.from(e.dataTransfer.files),
        );
      }
    },
    [handleFiles],
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    e.preventDefault();

    if (
      e.target.files &&
      e.target.files.length > 0
    ) {
      handleFiles(
        Array.from(e.target.files),
      );
    }

    // Allow selecting the same file again later.
    e.target.value = '';
  };

  const removeFile = (index: number) => {
    const newFiles = value.filter(
      (_, i) => i !== index,
    );

    onChange?.(newFiles);

    const preview = previews[index];

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setPreviews(
      previews.filter(
        (_, i) => i !== index,
      ),
    );
  };

  return (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-ink/70">
          {label}{' '}
          {value.length > 0 &&
            `(${value.length}/${maxFiles})`}
        </label>
      )}

      <div
        className={`relative flex min-h-[160px] w-full flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-300 ${
          dragActive
            ? 'border-gold-500 bg-gold-500/10'
            : error
              ? 'border-red-500/50 bg-red-500/5'
              : 'border-white/20 bg-white/5 hover:bg-white/10'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() =>
          inputRef.current?.click()
        }
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />

        <div className="flex cursor-pointer flex-col items-center justify-center space-y-2 p-6 text-ink/70">
          <svg
            className="h-8 w-8 text-white/50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>

          <p className="text-sm font-medium">
            Click to upload or drag and drop
          </p>

          <p className="text-xs text-white/40">
            {helperText}
          </p>
        </div>
      </div>

      {error && (
        <p className="mt-1.5 text-sm text-red-400">
          {error}
        </p>
      )}

      {value.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {value.map((file, index) => {
            const preview =
              previews[index];

            const isImage =
              file.type.startsWith(
                'image/',
              );

            return (
              <div
                key={`${file.name}-${index}`}
                className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-navy-900"
              >
                {isImage && preview ? (
                  <img
                    src={preview}
                    alt={file.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-3 text-center">
                    <FileText className="h-8 w-8 text-gold-400" />

                    <span className="line-clamp-2 break-words text-xs text-cream">
                      {file.name}
                    </span>
                  </div>
                )}

                <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      removeFile(index);
                    }}
                    className="rounded-full bg-red-500/80 p-2 text-white transition-colors hover:bg-red-500"
                    aria-label={`Remove ${file.name}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
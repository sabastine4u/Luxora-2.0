import { useState, useCallback, useRef } from 'react';

export interface ImageUploaderProps {
  label?: string;
  maxFiles?: number;
  value?: File[];
  onChange?: (files: File[]) => void;
  error?: string;
}

export function ImageUploader({
  label = 'Upload Images',
  maxFiles = 10,
  value = [],
  onChange,
  error
}: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((files: File[]) => {
    const newFiles = [...value, ...files].slice(0, maxFiles);
    onChange?.(newFiles);

    // Create object URLs for previews
    const newPreviews = newFiles.map(f => URL.createObjectURL(f));
    setPreviews(newPreviews);
  }, [value, maxFiles, onChange]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, [handleFiles]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index);
    onChange?.(newFiles);
    
    // Revoke old URL to prevent memory leak
    URL.revokeObjectURL(previews[index]);
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-ink/70 mb-1.5">
          {label} {value.length > 0 && `(${value.length}/${maxFiles})`}
        </label>
      )}
      
      <div
        className={`relative flex flex-col items-center justify-center w-full min-h-[160px] rounded-xl border-2 border-dashed transition-all duration-300 ${
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
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center text-ink/70 space-y-2 cursor-pointer p-6">
          <svg className="w-8 h-8 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm font-medium">Click to upload or drag and drop</p>
          <p className="text-xs text-white/40">PNG, JPG, GIF up to 10MB</p>
        </div>
      </div>

      {error && <p className="mt-1.5 text-sm text-red-400">{error}</p>}

      {previews.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {previews.map((preview, index) => (
            <div key={preview} className="relative group rounded-xl overflow-hidden aspect-square border border-white/10">
              <img src={preview} alt={`Preview ${index}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="bg-red-500/80 text-white p-2 rounded-full hover:bg-red-500 transition-colors"
                  aria-label="Remove image"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

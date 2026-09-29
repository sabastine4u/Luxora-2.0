import {
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  FileText,
  Loader2,
  Upload,
} from 'lucide-react';
import {
  GhostButton,
  GoldButton,
} from '../../../../components/ui/ui';
import { Modal } from '../../../../components/ui/Modal';

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (
    type: string,
    file: File,
  ) => Promise<void>;
  title?: string;
}

export default function UploadDocumentModal({
  isOpen,
  onClose,
  onUpload,
  title = 'Upload Document',
}: UploadDocumentModalProps) {
  const [docType, setDocType] =
    useState('Title Deed');

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [isUploading, setIsUploading] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState('');

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
      setErrorMessage('');
      setIsUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [isOpen]);

  const handleFileChange = (
    file: File | null,
  ) => {
    setErrorMessage('');

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (
      file.size >
      10 * 1024 * 1024
    ) {
      setSelectedFile(null);
      setErrorMessage(
        'The selected file is larger than the 10MB limit.',
      );
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setErrorMessage(
        'Please select a document before uploading.',
      );
      return;
    }

    try {
      setIsUploading(true);
      setErrorMessage('');

      await onUpload(
        docType,
        selectedFile,
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'The document could not be uploaded.',
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={
        isUploading
          ? () => undefined
          : onClose
      }
      title={title}
    >
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-ink/70">
            Document Type
          </label>

          <select
            value={docType}
            onChange={(e) =>
              setDocType(e.target.value)
            }
            disabled={isUploading}
            className="w-full rounded-xl border border-white/10 bg-navy-800 px-4 py-3 text-cream focus:border-gold-400 focus:outline-none"
          >
            <option>
              Title Deed
            </option>

            <option>
              Government ID
            </option>

            <option>
              Survey Plan
            </option>

            <option>
              Utility Bill
            </option>

            <option>
              Other
            </option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-ink/70">
            Select File
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,image/jpeg,image/png"
            className="hidden"
            disabled={isUploading}
            onChange={(e) =>
              handleFileChange(
                e.target.files?.[0] ||
                  null,
              )
            }
          />

          <button
            type="button"
            disabled={isUploading}
            onClick={() =>
              fileInputRef.current?.click()
            }
            className="w-full rounded-xl border-2 border-dashed border-white/10 p-8 text-center transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {selectedFile ? (
              <div className="flex flex-col items-center gap-2">
                <FileText className="h-8 w-8 text-gold-400" />

                <p className="text-sm font-medium text-cream">
                  {selectedFile.name}
                </p>

                <p className="text-xs text-ink/50">
                  {(
                    selectedFile.size /
                    1024 /
                    1024
                  ).toFixed(2)}{' '}
                  MB • Click to replace
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="mb-3 h-8 w-8 text-ink/40" />

                <p className="text-sm font-medium text-cream">
                  Click to browse
                </p>

                <p className="mt-1 text-xs text-ink/50">
                  PDF, JPG or PNG up to 10MB
                </p>
              </div>
            )}
          </button>
        </div>

        {errorMessage && (
          <div className="rounded-xl border border-rose-400/20 bg-rose-400/5 p-3 text-sm text-rose-300">
            {errorMessage}
          </div>
        )}

        <div className="flex justify-end gap-3 border-t border-white/5 pt-4">
          <GhostButton
            onClick={onClose}
            disabled={isUploading}
          >
            Cancel
          </GhostButton>

          <GoldButton
            onClick={handleUpload}
            disabled={
              isUploading ||
              !selectedFile
            }
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Document
              </>
            )}
          </GoldButton>
        </div>
      </div>
    </Modal>
  );
}
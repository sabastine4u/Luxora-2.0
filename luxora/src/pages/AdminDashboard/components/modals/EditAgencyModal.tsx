import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

// Define the Agency structure used by the edit form.
interface EditAgency {
  _id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone?: string;
  status: 'Active' | 'Suspended';
}

interface EditAgencyModalProps {
  isOpen: boolean;
  agency: EditAgency | null;
  isSaving: boolean;
  onClose: () => void;
  onSave: (
    data: Partial<EditAgency>
  ) => Promise<void>;
}

export default function EditAgencyModal({
  isOpen,
  agency,
  isSaving,
  onClose,
  onSave,
}: EditAgencyModalProps) {
  // Store the editable Agency form values.
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    status: 'Active' as 'Active' | 'Suspended',
  });

  // Store a readable validation/server error for the form.
  const [error, setError] =
    useState<string | null>(null);

  // Populate the form whenever another Agency is selected.
  useEffect(() => {
    if (!agency) {
      return;
    }

    setFormData({
      name: agency.name || '',
      contactPerson:
        agency.contactPerson || '',
      email: agency.email || '',
      phone: agency.phone || '',
      status:
        agency.status === 'Suspended'
          ? 'Suspended'
          : 'Active',
    });

    // Clear any previous error when a new Agency is loaded.
    setError(null);
  }, [agency]);

  // Stop rendering when the modal is closed.
  if (!isOpen || !agency) {
    return null;
  }

  // Update one form field without changing the others.
  const handleChange = (
    field: keyof typeof formData,
    value: string,
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  // Submit the changed Agency profile.
  const handleSubmit = async (
    event: React.FormEvent,
  ) => {
    event.preventDefault();

    setError(null);

    // Basic frontend validation.
    if (!formData.name.trim()) {
      setError('Agency Name is required.');
      return;
    }

    if (!formData.contactPerson.trim()) {
      setError(
        'Contact Person is required.',
      );
      return;
    }

    if (!formData.email.trim()) {
      setError('Email is required.');
      return;
    }

    // Build the payload using only fields supported
    // by the Agency backend.
    const updateData: Partial<EditAgency> = {
      name: formData.name.trim(),
      contactPerson:
        formData.contactPerson.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      status: formData.status,
    };

    try {
      // Let the parent call the real Admin Agency endpoint.
      await onSave(updateData);
    } catch (saveError) {
      console.error(
        'Failed to save Agency profile:',
        saveError,
      );

      // Keep the modal open when the backend rejects the update.
      setError(
        'Unable to save Agency changes right now.',
      );
    }
  };

  // Shared input styling.
  const inputClassName =
    'w-full rounded-xl border border-white/10 bg-navy-900/70 px-4 py-3 text-sm text-cream placeholder:text-ink/30 focus:border-gold-400/50 focus:outline-none';

  // Shared label styling.
  const labelClassName =
    'mb-2 block text-xs font-semibold uppercase tracking-wider text-ink/60';

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-navy-800 shadow-2xl">
        {/* Modal header. */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <h2 className="font-heading text-xl font-bold text-cream">
              Edit Agency
            </h2>

            <p className="mt-1 text-sm text-ink/50">
              Update {agency.name}'s business profile.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-lg p-2 text-ink/50 transition-colors hover:bg-white/10 hover:text-cream disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable form area. */}
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto px-6 py-6"
        >
          {error && (
            <div className="mb-6 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
              {error}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            {/* Agency information. */}
            <div className="md:col-span-2">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gold-400">
                Agency Information
              </h3>
            </div>

            <div>
              <label className={labelClassName}>
                Agency Name
              </label>

              <input
                value={formData.name}
                onChange={(event) =>
                  handleChange(
                    'name',
                    event.target.value,
                  )
                }
                className={inputClassName}
                required
              />
            </div>

            <div>
              <label className={labelClassName}>
                Contact Person
              </label>

              <input
                value={formData.contactPerson}
                onChange={(event) =>
                  handleChange(
                    'contactPerson',
                    event.target.value,
                  )
                }
                className={inputClassName}
                required
              />
            </div>

            <div>
              <label className={labelClassName}>
                Email
              </label>

              <input
                type="email"
                value={formData.email}
                onChange={(event) =>
                  handleChange(
                    'email',
                    event.target.value,
                  )
                }
                className={inputClassName}
                required
              />
            </div>

            <div>
              <label className={labelClassName}>
                Phone
              </label>

              <input
                value={formData.phone}
                onChange={(event) =>
                  handleChange(
                    'phone',
                    event.target.value,
                  )
                }
                className={inputClassName}
              />
            </div>

            {/* Account status. */}
            <div className="md:col-span-2 mt-2">
              <h3 className="mb-4 border-t border-white/10 pt-6 text-sm font-bold uppercase tracking-wider text-gold-400">
                Account Status
              </h3>
            </div>

            <div>
              <label className={labelClassName}>
                Status
              </label>

              <select
                value={formData.status}
                onChange={(event) =>
                  handleChange(
                    'status',
                    event.target.value,
                  )
                }
                className={inputClassName}
              >
                <option value="Active">
                  Active
                </option>

                <option value="Suspended">
                  Suspended
                </option>
              </select>
            </div>
          </div>

          {/* Form actions. */}
          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-ink/60 transition-colors hover:bg-white/5 hover:text-cream disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="rounded-xl bg-gold-400 px-5 py-3 text-sm font-bold text-navy-900 transition-colors hover:bg-gold-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving
                ? 'Saving Changes...'
                : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
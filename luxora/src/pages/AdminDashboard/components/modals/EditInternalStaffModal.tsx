import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface EditInternalStaff {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  department?: string | null;
  isActive: boolean;
  isVerified: boolean;
}

interface EditInternalStaffModalProps {
  isOpen: boolean;
  staff: EditInternalStaff | null;
  isSaving: boolean;
  onClose: () => void;
  onSave: (
    data: Partial<EditInternalStaff>,
  ) => Promise<void>;
}
const internalStaffRoles = [
  {
    value: "Manager",
    label: "Manager",
  },
  {
    value: "Procurement Officer",
    label: "Procurement Officer",
  },
  {
    value: "Finance Manager",
    label: "Finance Manager",
  },
  {
    value: "Data Analyst",
    label: "Data Analyst",
  },
  {
    value: "Property Manager",
    label: "Property Manager",
  },
  {
    value: "Service Manager",
    label: "Service Manager",
  },
];

export default function EditInternalStaffModal({
  isOpen,
  staff,
  isSaving,
  onClose,
  onSave,
}: EditInternalStaffModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
    department: "",
    isActive: true,
  });

  const [error, setError] =
    useState<string | null>(null);

  /*
   * Populate the form whenever a different
   * Internal Staff member is selected.
   */
  useEffect(() => {
    if (!staff) {
      return;
    }

    setFormData({
      fullName: staff.fullName || "",
      email: staff.email || "",
      phone: staff.phone || "",
      role: staff.role || "",
      department:
        staff.department || "",
      isActive: staff.isActive,
    });

    setError(null);
  }, [staff]);

  if (!isOpen || !staff) {
    return null;
  }

  const handleChange = (
    field: keyof typeof formData,
    value: string | boolean,
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent,
  ) => {
    event.preventDefault();

    setError(null);

    if (!formData.fullName.trim()) {
      setError(
        "Full Name is required.",
      );
      return;
    }

    if (!formData.email.trim()) {
      setError(
        "Email is required.",
      );
      return;
    }

    if (!formData.role) {
      setError(
        "Staff role is required.",
      );
      return;
    }

    const updateData: Partial<EditInternalStaff> = {
      fullName:
        formData.fullName.trim(),
      email:
        formData.email
          .trim()
          .toLowerCase(),
      phone:
        formData.phone.trim(),
      role: formData.role,
      department:
        formData.department.trim(),
      isActive: formData.isActive,
    };

    try {
      await onSave(updateData);
    } catch (saveError) {
      console.error(
        "Failed to save Internal Staff changes:",
        saveError,
      );

      setError(
        "Unable to save Staff changes right now.",
      );
    }
  };

  const inputClassName =
    "w-full rounded-xl border border-white/10 bg-navy-900/70 px-4 py-3 text-sm text-cream placeholder:text-ink/30 focus:border-gold-400/50 focus:outline-none";

  const labelClassName =
    "mb-2 block text-xs font-semibold uppercase tracking-wider text-ink/60";

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-navy-800 shadow-2xl">
        {/* Modal header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <h2 className="font-heading text-xl font-bold text-cream">
              Edit Staff Access
            </h2>

            <p className="mt-1 text-sm text-ink/50">
              Update{" "}
              {staff.fullName}'s
              profile and access.
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

        {/* Scrollable form */}
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
            {/* Personal information */}
            <div className="md:col-span-2">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gold-400">
                Staff Information
              </h3>
            </div>

            <div>
              <label
                className={
                  labelClassName
                }
              >
                Full Name
              </label>

              <input
                value={
                  formData.fullName
                }
                onChange={(event) =>
                  handleChange(
                    "fullName",
                    event.target.value,
                  )
                }
                className={
                  inputClassName
                }
                required
              />
            </div>

            <div>
              <label
                className={
                  labelClassName
                }
              >
                Email
              </label>

              <input
                type="email"
                value={
                  formData.email
                }
                onChange={(event) =>
                  handleChange(
                    "email",
                    event.target.value,
                  )
                }
                className={
                  inputClassName
                }
                required
              />
            </div>

            <div>
              <label
                className={
                  labelClassName
                }
              >
                Phone
              </label>

              <input
                value={
                  formData.phone
                }
                onChange={(event) =>
                  handleChange(
                    "phone",
                    event.target.value,
                  )
                }
                className={
                  inputClassName
                }
              />
            </div>

            {/* Access information */}
            <div className="md:col-span-2 mt-2">
              <h3 className="mb-4 border-t border-white/10 pt-6 text-sm font-bold uppercase tracking-wider text-gold-400">
                Access & Department
              </h3>
            </div>

            <div>
              <label
                className={
                  labelClassName
                }
              >
                Role
              </label>

              <select
                value={
                  formData.role
                }
                onChange={(event) =>
                  handleChange(
                    "role",
                    event.target.value,
                  )
                }
                className={
                  inputClassName
                }
                required
              >
                <option value="">
                  Select Staff Role
                </option>

                {internalStaffRoles.map(
                  (role) => (
                    <option
                      key={
                        role.value
                      }
                      value={
                        role.value
                      }
                    >
                      {role.label}
                    </option>
                  ),
                )}
              </select>
            </div>

            <div>
              <label
                className={
                  labelClassName
                }
              >
                Department
              </label>

              <input
                value={
                  formData.department
                }
                onChange={(event) =>
                  handleChange(
                    "department",
                    event.target.value,
                  )
                }
                className={
                  inputClassName
                }
                placeholder="Operations"
              />
            </div>

            {/* Account status */}
            <div className="md:col-span-2 mt-2">
              <h3 className="mb-4 border-t border-white/10 pt-6 text-sm font-bold uppercase tracking-wider text-gold-400">
                Account Status
              </h3>
            </div>

            <div className="md:col-span-2">
              <label
                className={
                  labelClassName
                }
              >
                Account Status
              </label>

              <select
                value={
                  formData.isActive
                    ? "Active"
                    : "Suspended"
                }
                onChange={(event) =>
                  handleChange(
                    "isActive",
                    event.target.value ===
                      "Active",
                  )
                }
                className={
                  inputClassName
                }
              >
                <option value="Active">
                  Active
                </option>

                <option value="Suspended">
                  Suspended
                </option>
              </select>
            </div>

            {/* Verification information */}
            <div className="md:col-span-2">
              <div className="rounded-xl border border-white/10 bg-navy-900/40 px-4 py-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-ink/60">
                  Verification
                </div>

                <div className="mt-2 text-sm font-semibold text-cream">
                  {staff.isVerified
                    ? "Verified"
                    : "Not Verified"}
                </div>

                <p className="mt-1 text-xs text-ink/40">
                  Verification is managed separately using the Verify/Unverify Staff action.
                </p>
              </div>
            </div>
          </div>

          {/* Form actions */}
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
                ? "Saving Changes..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
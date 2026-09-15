import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

// Define the complete Agent structure needed by the edit form.
interface EditAgent {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  residentialAddress?: string;
  employmentType?: string;
  yearsOfExperience?: number;
  licenseNumber?: string;
  backgroundCheckStatus?: string;
  branch?: string;
  department?: string;
  level?: string;
  reportingManager?: string;
  serviceStates?: string[];
  neighborhoods?: string[];
  coverageRadius?: string;
  specializations?: string[];
  commissionModel?: string;
  agentShare?: number;
  agencyShare?: number;
  signOnBonus?: number;
}

interface EditAgentModalProps {
  isOpen: boolean;
  agent: EditAgent | null;
  isSaving: boolean;
  onClose: () => void;
  onSave: (
    data: Partial<EditAgent>
  ) => Promise<void>;
}

export default function EditAgentModal({
  isOpen,
  agent,
  isSaving,
  onClose,
  onSave,
}: EditAgentModalProps) {
  // Store the editable Agent form values.
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    residentialAddress: '',
    employmentType: '',
    yearsOfExperience: '',
    licenseNumber: '',
    backgroundCheckStatus: 'Pending',
    branch: '',
    department: '',
    level: '',
    reportingManager: '',
    serviceStates: '',
    neighborhoods: '',
    coverageRadius: '',
    specializations: '',
    commissionModel: '',
    agentShare: '',
    agencyShare: '',
    signOnBonus: '',
  });

  // Store a readable validation/server error for the form.
  const [error, setError] =
    useState<string | null>(null);

  // Populate the form whenever another Agent is selected.
  useEffect(() => {
    if (!agent) {
      return;
    }

    // Convert the real Agent record into editable form values.
    setFormData({
      fullName: agent.fullName || '',
      email: agent.email || '',
      phone: agent.phone || '',
      dateOfBirth: agent.dateOfBirth
        ? new Date(agent.dateOfBirth)
            .toISOString()
            .split('T')[0]
        : '',
      residentialAddress:
        agent.residentialAddress || '',
      employmentType:
        agent.employmentType || '',
      yearsOfExperience:
        agent.yearsOfExperience !== undefined
          ? String(agent.yearsOfExperience)
          : '',
      licenseNumber:
        agent.licenseNumber || '',
      backgroundCheckStatus:
        agent.backgroundCheckStatus ||
        'Pending',
      branch: agent.branch || '',
      department: agent.department || '',
      level: agent.level || '',
      reportingManager:
        agent.reportingManager || '',
      serviceStates:
        agent.serviceStates?.join(', ') || '',
      neighborhoods:
        agent.neighborhoods?.join(', ') || '',
      coverageRadius:
        agent.coverageRadius || '',
      specializations:
        agent.specializations?.join(', ') || '',
      commissionModel:
        agent.commissionModel || '',
      agentShare:
        agent.agentShare !== undefined
          ? String(agent.agentShare)
          : '',
      agencyShare:
        agent.agencyShare !== undefined
          ? String(agent.agencyShare)
          : '',
      signOnBonus:
        agent.signOnBonus !== undefined
          ? String(agent.signOnBonus)
          : '',
    });

    // Clear an old error whenever a new Agent is loaded.
    setError(null);
  }, [agent]);

  // Stop rendering the modal when it is closed.
  if (!isOpen || !agent) {
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

  // Submit the changed Agent profile to the parent component.
  const handleSubmit = async (
    event: React.FormEvent,
  ) => {
    event.preventDefault();

    // Clear any previous error before submitting again.
    setError(null);

    // Validate the percentage fields before sending them.
    const agentShare =
      formData.agentShare === ''
        ? undefined
        : Number(formData.agentShare);

    const agencyShare =
      formData.agencyShare === ''
        ? undefined
        : Number(formData.agencyShare);

    if (
      agentShare !== undefined &&
      (Number.isNaN(agentShare) ||
        agentShare < 0 ||
        agentShare > 100)
    ) {
      setError(
        'Agent Share must be between 0 and 100.',
      );
      return;
    }

    if (
      agencyShare !== undefined &&
      (Number.isNaN(agencyShare) ||
        agencyShare < 0 ||
        agencyShare > 100)
    ) {
      setError(
        'Agency Share must be between 0 and 100.',
      );
      return;
    }

    // Convert comma-separated text fields back into string arrays.
    const serviceStates =
      formData.serviceStates
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);

    const neighborhoods =
      formData.neighborhoods
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);

    const specializations =
      formData.specializations
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);

    // Build the payload using only fields supported by the Agent backend.
    const updateData: Partial<EditAgent> = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      dateOfBirth:
        formData.dateOfBirth || undefined,
      residentialAddress:
        formData.residentialAddress.trim(),
      employmentType:
        formData.employmentType.trim(),
      yearsOfExperience:
        formData.yearsOfExperience === ''
          ? undefined
          : Number(formData.yearsOfExperience),
      licenseNumber:
        formData.licenseNumber.trim(),
      backgroundCheckStatus:
        formData.backgroundCheckStatus,
      branch: formData.branch.trim(),
      department:
        formData.department.trim(),
      level: formData.level.trim(),
      reportingManager:
        formData.reportingManager.trim(),
      serviceStates,
      neighborhoods,
      coverageRadius:
        formData.coverageRadius.trim(),
      specializations,
      commissionModel:
        formData.commissionModel.trim(),
      agentShare,
      agencyShare,
      signOnBonus:
        formData.signOnBonus === ''
          ? undefined
          : Number(formData.signOnBonus),
    };

    try {
      // Let the parent call the real Admin Agent endpoint.
      await onSave(updateData);
    } catch (saveError) {
      // Keep the modal open when the backend rejects the update.
      console.error(
        'Failed to save Agent profile:',
        saveError,
      );

      setError(
        'Unable to save Agent changes right now.',
      );
    }
  };

  // Shared input styling keeps the new form consistent with the dashboard.
  const inputClassName =
    'w-full rounded-xl border border-white/10 bg-navy-900/70 px-4 py-3 text-sm text-cream placeholder:text-ink/30 focus:border-gold-400/50 focus:outline-none';

  // Shared label styling for form fields.
  const labelClassName =
    'mb-2 block text-xs font-semibold uppercase tracking-wider text-ink/60';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-navy-800 shadow-2xl">
        {/* Modal header. */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <h2 className="font-heading text-xl font-bold text-cream">
              Edit Agent
            </h2>

            <p className="mt-1 text-sm text-ink/50">
              Update {agent.fullName}'s profile information.
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
            {/* Personal information. */}
            <div className="md:col-span-2">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gold-400">
                Personal Information
              </h3>
            </div>

            <div>
              <label className={labelClassName}>
                Full Name
              </label>

              <input
                value={formData.fullName}
                onChange={(event) =>
                  handleChange(
                    'fullName',
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

            <div>
              <label className={labelClassName}>
                Date of Birth
              </label>

              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(event) =>
                  handleChange(
                    'dateOfBirth',
                    event.target.value,
                  )
                }
                className={inputClassName}
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClassName}>
                Residential Address
              </label>

              <textarea
                value={formData.residentialAddress}
                onChange={(event) =>
                  handleChange(
                    'residentialAddress',
                    event.target.value,
                  )
                }
                rows={3}
                className={inputClassName}
              />
            </div>

            {/* Employment information. */}
            <div className="md:col-span-2 mt-2">
              <h3 className="mb-4 border-t border-white/10 pt-6 text-sm font-bold uppercase tracking-wider text-gold-400">
                Employment
              </h3>
            </div>

            <div>
              <label className={labelClassName}>
                Employment Type
              </label>

              <input
                value={formData.employmentType}
                onChange={(event) =>
                  handleChange(
                    'employmentType',
                    event.target.value,
                  )
                }
                className={inputClassName}
              />
            </div>

            <div>
              <label className={labelClassName}>
                Years of Experience
              </label>

              <input
                type="number"
                min="0"
                value={formData.yearsOfExperience}
                onChange={(event) =>
                  handleChange(
                    'yearsOfExperience',
                    event.target.value,
                  )
                }
                className={inputClassName}
              />
            </div>

            <div>
              <label className={labelClassName}>
                License Number
              </label>

              <input
                value={formData.licenseNumber}
                onChange={(event) =>
                  handleChange(
                    'licenseNumber',
                    event.target.value,
                  )
                }
                className={inputClassName}
              />
            </div>

            <div>
              <label className={labelClassName}>
                Background Check
              </label>

              <select
                value={
                  formData.backgroundCheckStatus
                }
                onChange={(event) =>
                  handleChange(
                    'backgroundCheckStatus',
                    event.target.value,
                  )
                }
                className={inputClassName}
              >
                <option value="Pending">
                  Pending
                </option>

                <option value="Initiated">
                  Initiated
                </option>

                <option value="Cleared">
                  Cleared
                </option>
              </select>
            </div>

            <div>
              <label className={labelClassName}>
                Branch
              </label>

              <input
                value={formData.branch}
                onChange={(event) =>
                  handleChange(
                    'branch',
                    event.target.value,
                  )
                }
                className={inputClassName}
              />
            </div>

            <div>
              <label className={labelClassName}>
                Department
              </label>

              <input
                value={formData.department}
                onChange={(event) =>
                  handleChange(
                    'department',
                    event.target.value,
                  )
                }
                className={inputClassName}
              />
            </div>

            <div>
              <label className={labelClassName}>
                Level
              </label>

              <input
                value={formData.level}
                onChange={(event) =>
                  handleChange(
                    'level',
                    event.target.value,
                  )
                }
                className={inputClassName}
              />
            </div>

            <div>
              <label className={labelClassName}>
                Reporting Manager
              </label>

              <input
                value={formData.reportingManager}
                onChange={(event) =>
                  handleChange(
                    'reportingManager',
                    event.target.value,
                  )
                }
                className={inputClassName}
              />
            </div>

            {/* Coverage information. */}
            <div className="md:col-span-2 mt-2">
              <h3 className="mb-4 border-t border-white/10 pt-6 text-sm font-bold uppercase tracking-wider text-gold-400">
                Coverage
              </h3>
            </div>

            <div>
              <label className={labelClassName}>
                Service States
              </label>

              <input
                placeholder="Lagos, Abuja, Rivers"
                value={formData.serviceStates}
                onChange={(event) =>
                  handleChange(
                    'serviceStates',
                    event.target.value,
                  )
                }
                className={inputClassName}
              />

              <p className="mt-1 text-xs text-ink/40">
                Separate multiple states with commas.
              </p>
            </div>

            <div>
              <label className={labelClassName}>
                Neighborhoods
              </label>

              <input
                placeholder="Lekki, Ikoyi, Victoria Island"
                value={formData.neighborhoods}
                onChange={(event) =>
                  handleChange(
                    'neighborhoods',
                    event.target.value,
                  )
                }
                className={inputClassName}
              />

              <p className="mt-1 text-xs text-ink/40">
                Separate multiple neighborhoods with commas.
              </p>
            </div>

            <div className="md:col-span-2">
              <label className={labelClassName}>
                Coverage Radius
              </label>

              <input
                placeholder="20 km"
                value={formData.coverageRadius}
                onChange={(event) =>
                  handleChange(
                    'coverageRadius',
                    event.target.value,
                  )
                }
                className={inputClassName}
              />
            </div>

            {/* Specialization information. */}
            <div className="md:col-span-2 mt-2">
              <h3 className="mb-4 border-t border-white/10 pt-6 text-sm font-bold uppercase tracking-wider text-gold-400">
                Specializations
              </h3>
            </div>

            <div className="md:col-span-2">
              <label className={labelClassName}>
                Specializations
              </label>

              <textarea
                placeholder="Luxury Villas, Penthouses, Short Lets"
                value={formData.specializations}
                onChange={(event) =>
                  handleChange(
                    'specializations',
                    event.target.value,
                  )
                }
                rows={3}
                className={inputClassName}
              />

              <p className="mt-1 text-xs text-ink/40">
                Separate multiple specializations with commas.
              </p>
            </div>

            {/* Commission information. */}
            <div className="md:col-span-2 mt-2">
              <h3 className="mb-4 border-t border-white/10 pt-6 text-sm font-bold uppercase tracking-wider text-gold-400">
                Commission
              </h3>
            </div>

            <div className="md:col-span-2">
              <label className={labelClassName}>
                Commission Model
              </label>

              <input
                value={formData.commissionModel}
                onChange={(event) =>
                  handleChange(
                    'commissionModel',
                    event.target.value,
                  )
                }
                className={inputClassName}
              />
            </div>

            <div>
              <label className={labelClassName}>
                Agent Share (%)
              </label>

              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={formData.agentShare}
                onChange={(event) =>
                  handleChange(
                    'agentShare',
                    event.target.value,
                  )
                }
                className={inputClassName}
              />
            </div>

            <div>
              <label className={labelClassName}>
                Agency Share (%)
              </label>

              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={formData.agencyShare}
                onChange={(event) =>
                  handleChange(
                    'agencyShare',
                    event.target.value,
                  )
                }
                className={inputClassName}
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClassName}>
                Sign-on Bonus
              </label>

              <input
                type="number"
                min="0"
                value={formData.signOnBonus}
                onChange={(event) =>
                  handleChange(
                    'signOnBonus',
                    event.target.value,
                  )
                }
                className={inputClassName}
              />
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
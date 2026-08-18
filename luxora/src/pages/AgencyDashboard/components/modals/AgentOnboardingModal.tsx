import { useState } from "react";
import { Modal } from "../../../../components/ui/Modal";
import { GhostButton, GoldButton } from "../../../../components/ui/ui";
import {
  User,
  Briefcase,
  Map,
  Star,
  ShieldCheck,
  FileText,
  CheckCircle2,
  DollarSign,
  Building2,
  Upload,
} from "lucide-react";
import { useToast } from "../../../../contexts/ToastContext";
import { agentApi } from "../../../../api/agent.api";

interface AgentOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgentCreated?: () => void; // optional so nothing breaks if a caller doesn't pass one
}

export function AgentOnboardingModal({
  isOpen,
  onClose,
  onAgentCreated,
}: AgentOnboardingModalProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
   // NEW: like ProvisionUserModal's Agency flow, the temporary password needs
  // to actually be shown and stay on screen until the person is done copying
  // it - a toast that auto-dismisses isn't good enough for something this important.
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdPassword, setCreatedPassword] = useState('');
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    residentialAddress: "",

    employmentType: "Full-Time Broker",
    yearsOfExperience: "",
    licenseNumber: "",
    backgroundCheckStatus: "Pending",

    branch: "Victoria Island HQ",
    department: "Residential Sales",
    level: "Junior Broker",
    reportingManager: "Marcus Sterling (MD)",

    serviceStates: "",
    neighborhoods: "",
    coverageRadius: "10km Radius",

    specializations: [] as string[],

    commissionModel: "Standard Split (60/40)",
    agentShare: 60,
    agencyShare: 40,
    signOnBonus: "",
  });

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleSpecialization = (specialization: string) => {
    setFormData((prev) => ({
      ...prev,
      specializations: prev.specializations.includes(specialization)
        ? prev.specializations.filter((item) => item !== specialization)
        : [...prev.specializations, specialization],
    }));
  };
  const steps = [
    { id: 1, title: "Personal Details", icon: User },
    { id: 2, title: "Employment", icon: Briefcase },
    { id: 3, title: "Assignment", icon: Building2 },
    { id: 4, title: "Coverage", icon: Map },
    { id: 5, title: "Specialties", icon: Star },
    { id: 6, title: "Commission", icon: DollarSign },
    { id: 7, title: "Documents", icon: FileText },
    { id: 8, title: "Review & Activate", icon: CheckCircle2 },
  ];

  const handleNext = () => setStep((s) => Math.min(8, s + 1));
  const handlePrev = () => setStep((s) => Math.max(1, s - 1));

  // Submit the completed onboarding form to the real Agent API.
  const handleActivate = async () => {
    // Make sure the agent has provided a first name.
    if (!formData.firstName.trim()) {
      showToast({
        // Tell the user this is a validation error.
        type: "error",

        // Give the error a clear title.
        title: "First Name Required",

        // Explain exactly what needs to be fixed.
        description: "Please enter the agent's first name.",
      });

      // Stop the submission before contacting the backend.
      return;
    }

    // Make sure the agent has provided a last name.
    if (!formData.lastName.trim()) {
      showToast({
        // Display the validation error using the existing toast system.
        type: "error",

        // Tell the user which field is missing.
        title: "Last Name Required",

        // Explain what the user needs to do.
        description: "Please enter the agent's last name.",
      });

      // Stop the submission before contacting the backend.
      return;
    }

    // Make sure the agent has provided an email address.
    if (!formData.email.trim()) {
      showToast({
        // Display the validation error.
        type: "error",

        // Identify the missing field.
        title: "Email Required",

        // Tell the user what to enter.
        description: "Please enter the agent's email address.",
      });

      // Stop the submission before contacting the backend.
      return;
    }

    // Turn on the real loading state while the API request is running.
    setIsSubmitting(true);

    try {
      // Combine first and last name because the backend expects one fullName field.
      const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`;

      // Send the complete onboarding information to the backend.
      const response = await agentApi.createAgent({
        // Send the combined agent name.
        fullName,

        // Send the agent's email address.
        email: formData.email.trim(),

        // Send the agent's phone number.
        phone: formData.phone.trim(),

        // Send the date of birth if one was provided.
        dateOfBirth: formData.dateOfBirth || undefined,

        // Send the residential address if one was provided.
        residentialAddress:
          formData.residentialAddress.trim() || undefined,

        // Send employment information.
        employmentType: formData.employmentType,

        // Convert the experience from the input string to a number.
        yearsOfExperience: formData.yearsOfExperience
          ? Number(formData.yearsOfExperience)
          : undefined,

        // Send the professional license number.
        licenseNumber: formData.licenseNumber.trim() || undefined,

        // Send the current background-check status.
        backgroundCheckStatus: formData.backgroundCheckStatus,

        // Send agency assignment information.
        branch: formData.branch,
        department: formData.department,
        level: formData.level,
        reportingManager: formData.reportingManager,

        // Convert comma-separated service states into an array.
        serviceStates: formData.serviceStates
          .split(",")
          .map((state) => state.trim())
          .filter(Boolean),

        // Convert comma-separated neighborhoods into an array.
        neighborhoods: formData.neighborhoods
          .split(",")
          .map((neighborhood) => neighborhood.trim())
          .filter(Boolean),

        // Send the selected coverage radius.
        coverageRadius: formData.coverageRadius,

        // Send all selected specializations.
        specializations: formData.specializations,

        // Send the commission structure.
        commissionModel: formData.commissionModel,

        // Convert the agent's commission percentage to a number.
        agentShare: Number(formData.agentShare),

        // Convert the agency's commission percentage to a number.
        agencyShare: Number(formData.agencyShare),

        // Send the sign-on bonus, using zero when it was left empty.
        signOnBonus: formData.signOnBonus
          ? Number(formData.signOnBonus)
          : 0,
      });

      // Log the real backend response so we can inspect it during testing.
      console.log("Agent created successfully:", response);

     // Save the generated password so we can actually display it,
      // instead of showing it in a toast that vanishes in a few seconds.
      setCreatedPassword(response.temporaryPassword);
      setIsSuccess(true);

      // Tell the parent page (Agents.tsx) to re-fetch its list NOW, while
      // the success screen is showing - by the time the person clicks
      // "Done" and the modal closes, the list will already be up to date
      // underneath, no manual refresh needed.
      if (onAgentCreated) {
        onAgentCreated();
      }
      // NOTE: no onClose() here anymore - the person needs to see and
      // copy the password first. They'll close it themselves (added below).
    } catch (error: any) {
      // Log the real error so we can diagnose backend/API problems during testing.
      console.error("Agent creation failed:", error);

     // Try to use the backend's actual error message first - our http.js
      // throws a custom ApiError with the message directly on .message,
      // not nested under .response.data like raw Axios errors.
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Unable to create the agent account. Please try again.";

      // Show the backend error to the Agency user instead of silently failing.
      showToast({
        // Display the error toast.
        type: "error",

        // Identify that agent creation failed.
        title: "Agent Creation Failed",

        // Display the actual backend message when available.
        description: message,
      });
    } finally {
      // Always stop the loading state whether the request succeeds or fails.
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Agent Onboarding"
      size="3xl"
      actionButton={
        isSuccess ? null : (
          <div className="flex gap-3">
            {step > 1 && <GhostButton onClick={handlePrev}>Back</GhostButton>}
            {step < 8 ? (
              <GoldButton onClick={handleNext}>Next Step</GoldButton>
            ) : (
              <GoldButton onClick={handleActivate} disabled={isSubmitting}>
                {isSubmitting ? "Activating..." : "Submit & Activate"}
              </GoldButton>
            )}
          </div>
        )
      }
    >
     {isSuccess ? (
        // Shown instead of the whole wizard once creation succeeds.
        // No auto-close timer here either - same reasoning as the Agency
        // provisioning modal: this password needs to stay visible until
        // the person is actually ready, not disappear on a countdown.
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <ShieldCheck className="h-14 w-14 text-emerald-400 mb-4" />
          <h3 className="text-2xl font-bold text-cream mb-2">Agent Created</h3>
          <p className="text-ink/60 mb-6">
            The agent account is Pending Verification until documents are approved.
          </p>
          <div className="w-full max-w-sm rounded-xl bg-navy-900/50 border border-white/10 p-4 text-left">
            <p className="text-xs text-ink/60 mb-1">Temporary Password (save this now):</p>
            <p className="text-sm font-mono text-gold-400">{createdPassword}</p>
          </div>
          <GoldButton
            className="mt-6"
            onClick={() => {
              // Reset everything for next time, THEN actually close the modal
              setIsSuccess(false);
              setCreatedPassword('');
              setStep(1);
              setFormData({
                firstName: "", lastName: "", email: "", phone: "", dateOfBirth: "", residentialAddress: "",
                employmentType: "Full-Time Broker", yearsOfExperience: "", licenseNumber: "", backgroundCheckStatus: "Pending",
                branch: "Victoria Island HQ", department: "Residential Sales", level: "Junior Broker", reportingManager: "Marcus Sterling (MD)",
                serviceStates: "", neighborhoods: "", coverageRadius: "10km Radius",
                specializations: [], commissionModel: "Standard Split (60/40)", agentShare: 60, agencyShare: 40, signOnBonus: "",
              });
              onClose();
            }}
          >
            Done
          </GoldButton>
        </div>
      ) : (
      <div className="flex gap-6 min-h-[500px]"> 
        {/* Sidebar Steps */}
        <div className="w-48 shrink-0 border-r border-white/10 pr-4 space-y-2">
          {steps.map((s) => (
            <div
              key={s.id}
              className={`flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors ${step === s.id
                  ? "bg-gold-400/10 text-gold-400 border border-gold-400/20"
                  : step > s.id
                    ? "text-emerald-400"
                    : "text-ink/50"
                }`}
            >
              {step > s.id ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <s.icon className="h-4 w-4" />
              )}
              {s.title}
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 py-4">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h3 className="text-lg font-bold text-cream mb-4">
                Personal Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-ink/70">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-sm text-cream"
                    placeholder="Enter first name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-ink/70">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-sm text-cream"
                    placeholder="Enter last name"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-xs font-medium text-ink/70">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-sm text-cream"
                    placeholder="agent@meridian.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-ink/70">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-sm text-cream"
                    placeholder="+234..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-ink/70">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                    className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-sm text-cream"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-xs font-medium text-ink/70">
                    Residential Address
                  </label>
                  <textarea
                    value={formData.residentialAddress}
                    onChange={(e) => handleChange('residentialAddress', e.target.value)}
                    className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-sm text-cream h-20"
                    placeholder="Full address"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            // Display the Employment step of the onboarding wizard.
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">

              {/* Display the step heading. */}
              <h3 className="text-lg font-bold text-cream mb-4">
                Employment Details
              </h3>

              {/* Arrange the employment fields into two columns. */}
              <div className="grid grid-cols-2 gap-4">

                {/* Employment Type field. */}
                <div className="space-y-2">

                  {/* Label for the employment type field. */}
                  <label className="text-xs font-medium text-ink/70">
                    Employment Type
                  </label>

                  {/* Store the selected employment type in formData. */}
                  <select
                    value={formData.employmentType}
                    onChange={(e) =>
                      handleChange("employmentType", e.target.value)
                    }
                    className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-sm text-cream"
                  >
                    {/* Available employment types. */}
                    <option>Full-Time Broker</option>
                    <option>Independent Contractor</option>
                    <option>Part-Time Agent</option>
                  </select>
                </div>

                {/* Years of Experience field. */}
                <div className="space-y-2">

                  {/* Label for years of experience. */}
                  <label className="text-xs font-medium text-ink/70">
                    Years of Experience
                  </label>

                  {/* Store the experience value in formData. */}
                  <input
                    type="number"
                    value={formData.yearsOfExperience}
                    onChange={(e) =>
                      handleChange("yearsOfExperience", e.target.value)
                    }
                    className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-sm text-cream"
                    placeholder="e.g. 5"
                    min="0"
                  />
                </div>

                {/* Professional License Number field. */}
                <div className="space-y-2 col-span-2">

                  {/* Label for the license number. */}
                  <label className="text-xs font-medium text-ink/70">
                    Professional License Number
                  </label>

                  {/* Store the license number in formData. */}
                  <input
                    type="text"
                    value={formData.licenseNumber}
                    onChange={(e) =>
                      handleChange("licenseNumber", e.target.value)
                    }
                    className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-sm text-cream"
                    placeholder="REB-XXXX-XXX"
                  />
                </div>

                {/* Background Check Status field. */}
                <div className="space-y-2 col-span-2">

                  {/* Label for background check status. */}
                  <label className="text-xs font-medium text-ink/70">
                    Background Check Status
                  </label>

                  {/* Store the selected status in formData. */}
                  <select
                    value={formData.backgroundCheckStatus}
                    onChange={(e) =>
                      handleChange("backgroundCheckStatus", e.target.value)
                    }
                    className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-sm text-cream"
                  >
                    {/* Available backend-supported statuses. */}
                    <option>Pending</option>
                    <option>Initiated</option>
                    <option>Cleared</option>
                  </select>
                </div>

              </div>
            </div>
          )}

          {step === 3 && (
            // Display the Agency Assignment step of the onboarding wizard.
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">

              {/* Display the step heading. */}
              <h3 className="text-lg font-bold text-cream mb-4">
                Agency Assignment
              </h3>

              {/* Arrange the assignment fields into two columns. */}
              <div className="grid grid-cols-2 gap-4">

                {/* Branch selection field. */}
                <div className="space-y-2 col-span-2">

                  {/* Label for the branch field. */}
                  <label className="text-xs font-medium text-ink/70">
                    Assign Branch
                  </label>

                  {/* Store the selected branch in formData. */}
                  <select
                    value={formData.branch}
                    onChange={(e) =>
                      handleChange("branch", e.target.value)
                    }
                    className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-sm text-cream"
                  >
                    {/* Available agency branches. */}
                    <option>Victoria Island HQ</option>
                    <option>Lekki Branch</option>
                    <option>Abuja Regional Office</option>
                  </select>
                </div>

                {/* Department selection field. */}
                <div className="space-y-2">

                  {/* Label for the department field. */}
                  <label className="text-xs font-medium text-ink/70">
                    Assign Department
                  </label>

                  {/* Store the selected department in formData. */}
                  <select
                    value={formData.department}
                    onChange={(e) =>
                      handleChange("department", e.target.value)
                    }
                    className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-sm text-cream"
                  >
                    {/* Available agency departments. */}
                    <option>Residential Sales</option>
                    <option>Commercial Sales</option>
                    <option>Luxury & Estates</option>
                    <option>Property Management</option>
                  </select>
                </div>

                {/* Agent level selection field. */}
                <div className="space-y-2">

                  {/* Label for the agent level field. */}
                  <label className="text-xs font-medium text-ink/70">
                    Assign Level
                  </label>

                  {/* Store the selected level in formData. */}
                  <select
                    value={formData.level}
                    onChange={(e) =>
                      handleChange("level", e.target.value)
                    }
                    className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-sm text-cream"
                  >
                    {/* Available agent levels. */}
                    <option>Junior Broker</option>
                    <option>Broker</option>
                    <option>Senior Broker</option>
                    <option>Partner</option>
                  </select>
                </div>

                {/* Reporting manager selection field. */}
                <div className="space-y-2 col-span-2">

                  {/* Label for the reporting manager field. */}
                  <label className="text-xs font-medium text-ink/70">
                    Reporting Manager
                  </label>

                  {/* Store the selected manager in formData. */}
                  <select
                    value={formData.reportingManager}
                    onChange={(e) =>
                      handleChange("reportingManager", e.target.value)
                    }
                    className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-sm text-cream"
                  >
                    {/* Available reporting managers. */}
                    <option>Marcus Sterling (MD)</option>
                    <option>Sarah James (Team Lead)</option>
                  </select>
                </div>

              </div>
            </div>
          )}

          {step === 4 && (
            // Display the Coverage Areas step of the onboarding wizard.
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">

              {/* Display the step heading. */}
              <h3 className="text-lg font-bold text-cream mb-4">
                Coverage Areas
              </h3>

              {/* Keep the coverage fields vertically stacked. */}
              <div className="space-y-4">

                {/* Primary service states field. */}
                <div className="space-y-2">

                  {/* Label for the service states field. */}
                  <label className="text-xs font-medium text-ink/70">
                    Primary Service States
                  </label>

                  {/* Store the comma-separated states in formData. */}
                  <input
                    type="text"
                    value={formData.serviceStates}
                    onChange={(e) =>
                      handleChange("serviceStates", e.target.value)
                    }
                    className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-sm text-cream"
                    placeholder="e.g. Lagos, Abuja"
                  />

                  {/* Explain the expected comma-separated format. */}
                  <p className="text-xs text-ink/50">
                    Separate multiple states with commas.
                  </p>
                </div>

                {/* Target neighborhoods field. */}
                <div className="space-y-2">

                  {/* Label for the neighborhoods field. */}
                  <label className="text-xs font-medium text-ink/70">
                    Target Neighborhoods
                  </label>

                  {/* Store the comma-separated neighborhoods in formData. */}
                  <input
                    type="text"
                    value={formData.neighborhoods}
                    onChange={(e) =>
                      handleChange("neighborhoods", e.target.value)
                    }
                    className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-sm text-cream"
                    placeholder="e.g. Ikoyi, Victoria Island"
                  />

                  {/* Explain the expected comma-separated format. */}
                  <p className="text-xs text-ink/50">
                    Separate multiple neighborhoods with commas.
                  </p>
                </div>

                {/* Coverage radius selection field. */}
                <div className="space-y-2">

                  {/* Label for the coverage radius field. */}
                  <label className="text-xs font-medium text-ink/70">
                    Coverage Radius
                  </label>

                  {/* Store the selected radius in formData. */}
                  <select
                    value={formData.coverageRadius}
                    onChange={(e) =>
                      handleChange("coverageRadius", e.target.value)
                    }
                    className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-sm text-cream"
                  >
                    {/* Available coverage radius options. */}
                    <option>10km Radius</option>
                    <option>25km Radius</option>
                    <option>50km Radius</option>
                    <option>State-wide</option>
                  </select>
                </div>

              </div>
            </div>
          )}

          {step === 5 && (
            // Display the Specializations step of the onboarding wizard.
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">

              {/* Display the step heading. */}
              <h3 className="text-lg font-bold text-cream mb-4">
                Specializations
              </h3>

              {/* Explain what the Agency user should select. */}
              <div className="space-y-4">

                {/* Explain that multiple specializations can be selected. */}
                <p className="text-sm text-ink/60 mb-2">
                  Select the property types this agent is authorized to handle.
                </p>

                {/* Display all available specializations in two columns. */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "Luxury Villas",
                    "Penthouses",
                    "Commercial Offices",
                    "Retail Spaces",
                    "Off-Plan Projects",
                    "Land & Plots",
                    "Short Lets",
                    "Waterfront Properties",
                  ].map((spec) => (
                    // Use the specialization name as the React key.
                    <label
                      key={spec}
                      className="flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-navy-900/50 cursor-pointer hover:bg-navy-900 transition-colors"
                    >
                      {/* Connect the checkbox to the real formData state. */}
                      <input
                        type="checkbox"
                        checked={formData.specializations.includes(spec)}
                        onChange={() => toggleSpecialization(spec)}
                        className="rounded border-white/20 text-gold-400 bg-transparent"
                      />

                      {/* Display the specialization name. */}
                      <span className="text-sm text-cream">
                        {spec}
                      </span>
                    </label>
                  ))}
                </div>

                {/* Show how many specializations have been selected. */}
                {formData.specializations.length > 0 && (
                  <p className="text-xs text-emerald-400">
                    {formData.specializations.length} specialization
                    {formData.specializations.length !== 1 ? "s" : ""} selected.
                  </p>
                )}
              </div>
            </div>
          )}

          {step === 6 && (
            // Display the Commission Structure step of the onboarding wizard.
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">

              {/* Display the step heading. */}
              <h3 className="text-lg font-bold text-cream mb-4">
                Commission Structure
              </h3>

              {/* Group all commission-related fields together. */}
              <div className="space-y-4">

                {/* Commission model selection. */}
                <div className="space-y-2">

                  {/* Label for the commission model field. */}
                  <label className="text-xs font-medium text-ink/70">
                    Commission Model
                  </label>

                  {/* Store the selected commission model in formData. */}
                  <select
                    value={formData.commissionModel}
                    onChange={(e) =>
                      handleChange("commissionModel", e.target.value)
                    }
                    className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-sm text-cream"
                  >
                    {/* Standard commission arrangement. */}
                    <option>Standard Split (60/40)</option>

                    {/* Senior agent commission arrangement. */}
                    <option>Senior Split (70/30)</option>

                    {/* Partner commission arrangement. */}
                    <option>Partner Split (80/20)</option>

                    {/* Salary plus bonus arrangement. */}
                    <option>Salary + Bonus</option>
                  </select>
                </div>

                {/* Agent and Agency percentage fields. */}
                <div className="grid grid-cols-2 gap-4">

                  {/* Agent commission share. */}
                  <div className="space-y-2">

                    {/* Label for the Agent share field. */}
                    <label className="text-xs font-medium text-ink/70">
                      Agent Share (%)
                    </label>

                    {/* Store the Agent percentage in formData. */}
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.agentShare}
                      onChange={(e) => {
                        // Convert the entered value into a number.
                        const agentShare = Number(e.target.value);

                        // Calculate the Agency share automatically.
                        const agencyShare = Math.max(0, 100 - agentShare);

                        // Keep both commission percentages synchronized.
                        setFormData((prev) => ({
                          ...prev,
                          agentShare,
                          agencyShare,
                        }));
                      }}
                      className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-sm text-cream"
                    />
                  </div>

                  {/* Agency commission share. */}
                  <div className="space-y-2">

                    {/* Label for the Agency share field. */}
                    <label className="text-xs font-medium text-ink/70">
                      Agency Share (%)
                    </label>

                    {/* Display the automatically calculated Agency percentage. */}
                    <input
                      type="number"
                      value={formData.agencyShare}
                      readOnly
                      className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-sm text-cream opacity-70 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Sign-on bonus field. */}
                <div className="space-y-2 pt-4">

                  {/* Label for the optional bonus field. */}
                  <label className="text-xs font-medium text-ink/70">
                    Sign-on Bonus / Advance (Optional)
                  </label>

                  {/* Store the sign-on bonus in formData. */}
                  <input
                    type="number"
                    min="0"
                    value={formData.signOnBonus}
                    onChange={(e) =>
                      handleChange("signOnBonus", e.target.value)
                    }
                    className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-sm text-cream"
                    placeholder="₦0.00"
                  />

                  {/* Explain that this field is optional. */}
                  <p className="text-xs text-ink/50">
                    Leave this at zero if no sign-on bonus or advance applies.
                  </p>
                </div>

              </div>
            </div>
          )}

          {step === 7 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h3 className="text-lg font-bold text-cream mb-4">
                Verification Documents
              </h3>
              <p className="text-sm text-ink/60 mb-4">
                Upload required documents to complete verification. (Can be
                uploaded later by agent).
              </p>

              <div className="space-y-3">
                {[
                  { name: "Government ID", req: true },
                  { name: "Passport Photograph", req: true },
                  { name: "Professional License", req: true },
                  { name: "Employment Contract", req: true },
                  { name: "Proof of Address", req: false },
                ].map((doc, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-3 rounded-lg border border-white/10 bg-navy-900"
                  >
                    <div>
                      <div className="text-sm font-medium text-cream">
                        {doc.name}{" "}
                        {doc.req && <span className="text-rose-400">*</span>}
                      </div>
                      <div className="text-xs text-yellow-400">
                        Pending Upload
                      </div>
                    </div>
                    <GhostButton
                      size="sm"
                      className="h-8 text-xs flex items-center gap-2"
                    >
                      <Upload className="h-3 w-3" /> Upload
                    </GhostButton>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 8 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="text-center py-6 border-b border-white/10 mb-6">
                <ShieldCheck className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-cream">
                  Ready to Activate
                </h3>
                <p className="text-sm text-ink/60 mt-2">
                  Please review the details before creating this agent profile.
                </p>
              </div>

              {/* These now show what was ACTUALLY selected in earlier steps,
                  read live from formData - not hardcoded placeholder text
                  that would mislead the Agency into approving the wrong info. */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-ink/60 block text-xs">Name</span>
                  <span className="font-bold text-cream">
                    {formData.firstName} {formData.lastName}
                  </span>
                </div>
                <div>
                  <span className="text-ink/60 block text-xs">Level</span>
                  <span className="font-bold text-cream">{formData.level}</span>
                </div>
                <div>
                  <span className="text-ink/60 block text-xs">Department</span>
                  <span className="font-bold text-cream">{formData.department}</span>
                </div>
                <div>
                  <span className="text-ink/60 block text-xs">Branch</span>
                  <span className="font-bold text-cream">{formData.branch}</span>
                </div>
                <div>
                  <span className="text-ink/60 block text-xs">Commission</span>
                  <span className="font-bold text-cream">{formData.commissionModel}</span>
                </div>
                <div>
                  <span className="text-ink/60 block text-xs">Email</span>
                  <span className="font-bold text-cream">{formData.email}</span>
                </div>
              </div>

              <div className="bg-yellow-400/10 border border-yellow-400/20 p-4 rounded-xl mt-6">
                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-yellow-400 shrink-0" />
                  <p className="text-sm text-yellow-100">
                    <strong>Note:</strong> The Agent account remains in "Pending
                    Verification" until all required documents are approved by
                    the Agency.
                  </p>
                </div>
              </div>
            </div>
          )}
       </div>
      </div>
      )}
    </Modal>
  );
}

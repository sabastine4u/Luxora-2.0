import { useEffect, useMemo, useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Calendar,
  Clock,
  Activity,
  User,
  Building2,
} from 'lucide-react';

export interface VerificationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;

  // Pass reviewer notes back to the Verification Center before approval.
  onApprove: (notes: string) => void;

  // Pass reviewer notes back to the Verification Center before rejection.
  onReject: (notes: string) => void;

  // The selected real Verification record.
  item: Record<string, unknown> | null;
}

interface VerificationDocument {
  id?: string;
  name?: string;
  type?: string;
  url?: string;
  filename?: string;
  size?: string;
  status?: string;
  rejectionReason?: string | null;
  uploadedAt?: string;
}

interface VerificationHistoryItem {
  action?: string;
  notes?: string | null;
  performedBy?: string | null;
  performedAt?: string;
}

interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export function VerificationDetailModal({
  isOpen,
  onClose,
  onApprove,
  onReject,
  item,
}: VerificationDetailModalProps) {
  const [notes, setNotes] = useState('');

  // Clear the draft reviewer note when a different verification is opened.
  useEffect(() => {
    setNotes('');
  }, [item?.id, isOpen]);

  // Safely read the selected verification record.
  const title = String(
    item?.title || 'Verification Request'
  );


  const status = String(
    item?.status || 'Pending'
  );

  // Read the real Agent name from the mapped Verification record.
  const agentName = String(
    item?.agentName ||
      item?.fullName ||
      item?.title ||
      'Not available'
  );

  // Read the real Agency name.
  const agencyName = String(
    item?.agencyName ||
      item?.agency ||
      item?.submitter ||
      'No Agency Assigned'
  );

  // Read the real Agent contact information.
  const email = String(
    item?.email || 'Not available'
  );

  const phone = String(
    item?.phone || 'Not available'
  );

  const licenseNumber = String(
    item?.licenseNumber || 'Not available'
  );

  const backgroundCheckStatus = String(
    item?.backgroundCheckStatus || 'Not available'
  );

  // Read the verification timestamps returned by the backend.
  const createdAt = item?.createdAt
    ? String(item.createdAt)
    : item?.date
      ? String(item.date)
      : null;

  const verifiedAt = item?.verifiedAt
    ? String(item.verifiedAt)
    : null;

  const expiresAt = item?.expiresAt
    ? String(item.expiresAt)
    : null;

  // Read the current verification level.
  const verificationLevel = String(
    item?.verificationLevel || 'Unverified'
  );

  // Read notes already persisted by the backend.
  const reviewNotes = item?.reviewNotes
    ? String(item.reviewNotes)
    : '';

  const rejectionReason = item?.rejectionReason
    ? String(item.rejectionReason)
    : '';

  // Read real submitted documents when they are available.
  const documents = useMemo<VerificationDocument[]>(() => {
    const directDocuments = Array.isArray(
      item?.documents
    )
      ? item.documents
      : [];

    const nestedVerification =
      item?.verification &&
      typeof item.verification === 'object' &&
      item.verification !== null
        ? (item.verification as Record<string, unknown>)
        : null;

    const nestedDocuments = Array.isArray(
      nestedVerification?.documents
    )
      ? nestedVerification.documents
      : [];

    const sourceDocuments =
      directDocuments.length > 0
        ? directDocuments
        : nestedDocuments;

    return sourceDocuments
      .filter(
        (document): document is Record<string, unknown> =>
          typeof document === 'object' &&
          document !== null
      )
      .map((document) => ({
        id: document._id
          ? String(document._id)
          : document.id
            ? String(document.id)
            : undefined,

        name: document.name
          ? String(document.name)
          : undefined,

        type: document.type
          ? String(document.type)
          : undefined,

        url: document.url
          ? String(document.url)
          : undefined,

        filename: document.filename
          ? String(document.filename)
          : undefined,

        size: document.size
          ? String(document.size)
          : undefined,

        status: document.status
          ? String(document.status)
          : undefined,

        rejectionReason: document.rejectionReason
          ? String(document.rejectionReason)
          : null,

        uploadedAt: document.uploadedAt
          ? String(document.uploadedAt)
          : undefined,
      }));
  }, [item]);

  // Use checklist data only when the backend actually provides it.
  const checklist = useMemo<ChecklistItem[]>(() => {
    const rawChecklist = Array.isArray(
      item?.checklist
    )
      ? item.checklist
      : [];

    return rawChecklist
      .filter(
        (check): check is Record<string, unknown> =>
          typeof check === 'object' &&
          check !== null
      )
      .map((check, index) => ({
        id: check.id
          ? String(check.id)
          : `${index + 1}`,

        text: String(
          check.text ||
            check.label ||
            check.name ||
            'Verification requirement'
        ),

        checked: Boolean(check.checked),
      }));
  }, [item]);

  // Display the real verification audit history.
  const history = useMemo<VerificationHistoryItem[]>(() => {
    const rawHistory = Array.isArray(
      item?.history
    )
      ? item.history
      : [];

    return rawHistory
      .filter(
        (entry): entry is Record<string, unknown> =>
          typeof entry === 'object' &&
          entry !== null
      )
      .map((entry) => ({
        action: entry.action
          ? String(entry.action)
          : 'Verification Activity',

        notes: entry.notes
          ? String(entry.notes)
          : null,

        performedBy: entry.performedBy
          ? String(entry.performedBy)
          : null,

        performedAt: entry.performedAt
          ? String(entry.performedAt)
          : undefined,
      }));
  }, [item]);

  // Convert backend timestamps into readable dates.
  const formatDate = (
    value?: string | null
  ) => {
    if (!value) {
      return 'Not available';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString();
  };

  // Convert the verification level into a visual progress value.
  const verificationLevelProgress =
    useMemo(() => {
      switch (verificationLevel) {
        case 'Agent Reviewed':
          return 25;

        case 'Documents Verified':
          return 50;

        case 'Inspection Verified':
          return 75;

        case 'Premium Verified':
          return 100;

        default:
          return 0;
      }
    }, [verificationLevel]);

  // Send the current reviewer note to the parent before approval.
  const handleApprove = () => {
    onApprove(notes.trim());
  };

  // Send the current reviewer note to the parent before rejection.
  const handleReject = () => {
    onReject(notes.trim());
  };

  if (!item) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setNotes('');
        onClose();
      }}
      title={`Verification Review: ${title}`}
      size="4xl"
      actionButton={
        <div className="flex gap-2">
          <GhostButton
            size="sm"
            className="text-ink/60 hover:text-cream hover:bg-white/10"
            onClick={onClose}
          >
            Cancel
          </GhostButton>

          <GhostButton
            size="sm"
            className="text-rose-400 hover:text-rose-300 hover:bg-rose-400/10"
            onClick={handleReject}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Reject
          </GhostButton>

          <GoldButton
            size="sm"
            className="bg-emerald-500 hover:bg-emerald-400 text-white"
            onClick={handleApprove}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Approve
          </GoldButton>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left column: Agent information and submitted documents. */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <div className="text-xs text-ink/50 mb-1 flex items-center gap-2">
                <User className="h-3 w-3" />
                Agent
              </div>

              <div className="font-semibold text-cream">
                {agentName}
              </div>
            </div>

            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <div className="text-xs text-ink/50 mb-1 flex items-center gap-2">
                <Building2 className="h-3 w-3" />
                Agency
              </div>

              <div className="font-semibold text-cream">
                {agencyName}
              </div>
            </div>

            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <div className="text-xs text-ink/50 mb-1 flex items-center gap-2">
                <FileText className="h-3 w-3" />
                Email
              </div>

              <div className="font-semibold text-cream break-all">
                {email}
              </div>
            </div>

            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <div className="text-xs text-ink/50 mb-1 flex items-center gap-2">
                <Activity className="h-3 w-3" />
                Phone
              </div>

              <div className="font-semibold text-cream">
                {phone}
              </div>
            </div>

            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <div className="text-xs text-ink/50 mb-1">
                License Number
              </div>

              <div className="font-semibold text-cream">
                {licenseNumber}
              </div>
            </div>

            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <div className="text-xs text-ink/50 mb-1">
                Background Check
              </div>

              <div className="font-semibold text-cream">
                {backgroundCheckStatus}
              </div>
            </div>
          </div>

          {/* Verification dates and current verification level. */}
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-ink/50">
                  Submitted
                </p>

                <p className="mt-1 text-sm font-semibold text-cream">
                  {formatDate(createdAt)}
                </p>
              </div>

              <Calendar className="h-5 w-5 text-ink/30" />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-ink/50">
                  Verified At
                </p>

                <p className="mt-1 text-sm font-semibold text-cream">
                  {formatDate(verifiedAt)}
                </p>
              </div>

              <CheckCircle className="h-5 w-5 text-ink/30" />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-ink/50">
                  Expires At
                </p>

                <p className="mt-1 text-sm font-semibold text-cream">
                  {formatDate(expiresAt)}
                </p>
              </div>

              <Clock className="h-5 w-5 text-ink/30" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-ink/50">
                  Verification Level
                </span>

                <span className="text-sm font-semibold text-cream">
                  {verificationLevel}
                </span>
              </div>

              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-400 transition-all"
                  style={{
                    width: `${verificationLevelProgress}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Render real submitted documents only. */}
          <div>
            <h4 className="text-sm font-semibold text-cream mb-3">
              Submitted Documents
            </h4>

            {documents.length > 0 ? (
              <div className="space-y-3">
                {documents.map(
                  (document, index) => (
                    <div
                      key={
                        document.id ||
                        `${document.name}-${index}`
                      }
                      className="rounded-xl border border-white/10 bg-navy-900/50 p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5">
                            <FileText className="h-5 w-5 text-ink/50" />
                          </div>

                          <div className="min-w-0">
                            <p className="font-semibold text-cream truncate">
                              {document.name ||
                                document.filename ||
                                `Document ${
                                  index + 1
                                }`}
                            </p>

                            <p className="text-xs text-ink/50 mt-1">
                              {document.type ||
                                'Document type not provided'}
                              {document.size
                                ? ` • ${document.size}`
                                : ''}
                            </p>

                            {document.uploadedAt && (
                              <p className="text-xs text-ink/40 mt-1">
                                Uploaded{' '}
                                {formatDate(
                                  document.uploadedAt
                                )}
                              </p>
                            )}
                          </div>
                        </div>

                        {document.status && (
                          <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-cream">
                            {document.status}
                          </span>
                        )}
                      </div>

                      {document.rejectionReason && (
                        <div className="mt-3 rounded-lg border border-rose-400/10 bg-rose-400/5 p-3">
                          <p className="text-xs text-rose-300">
                            Rejection Reason
                          </p>

                          <p className="mt-1 text-sm text-ink/70">
                            {document.rejectionReason}
                          </p>
                        </div>
                      )}

                      {document.url && (
                        <a
                          href={document.url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-flex text-xs font-medium text-gold-400 hover:text-gold-300"
                        >
                          Open document
                        </a>
                      )}
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-navy-900/50 p-8 text-center">
                <ShieldCheck className="h-8 w-8 text-ink/20 mb-2" />

                <p className="text-sm font-semibold text-ink/50">
                  No submitted documents available
                </p>

                <p className="text-xs text-ink/40 mt-1">
                  No document records are currently attached to this verification.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right column: Verification review information. */}
        <div className="space-y-6 lg:border-l lg:border-white/10 lg:pl-8">
          {/* Current Verification state. */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-navy-900/50 p-4 rounded-xl border border-white/10">
              <div className="text-xs text-ink/50 flex items-center gap-2 mb-2">
                <Activity className="h-3 w-3" />
                Verification Level
              </div>

              <div className="text-lg font-bold text-cream">
                {verificationLevel}
              </div>
            </div>

            <div className="bg-navy-900/50 p-4 rounded-xl border border-white/10">
              <div className="text-xs text-ink/50 flex items-center gap-2 mb-2">
                <AlertTriangle className="h-3 w-3" />
                Current Status
              </div>

              <div className="text-lg font-bold text-cream">
                {status}
              </div>
            </div>
          </div>

          {/* Render the real checklist when one is provided. */}
          <div>
            <h4 className="text-sm font-semibold text-cream mb-3">
              Verification Checklist
            </h4>

            {checklist.length > 0 ? (
              <div className="space-y-3">
                {checklist.map(
                  (check) => (
                    <div
                      key={check.id}
                      className="flex items-start gap-3"
                    >
                      <div
                        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                          check.checked
                            ? 'border-emerald-400/30 bg-emerald-400/10'
                            : 'border-white/20 bg-navy-900'
                        }`}
                      >
                        {check.checked && (
                          <CheckCircle className="h-3 w-3 text-emerald-400" />
                        )}
                      </div>

                      <span className="text-sm text-ink/70">
                        {check.text}
                      </span>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-white/10 bg-navy-900/50 p-5">
                <p className="text-sm text-ink/50">
                  No verification checklist has been submitted for this record yet.
                </p>
              </div>
            )}
          </div>

          {/* Display notes already stored by previous reviews. */}
          {(reviewNotes ||
            rejectionReason) && (
            <div>
              <h4 className="text-sm font-semibold text-cream mb-3">
                Existing Review Notes
              </h4>

              <div className="rounded-xl border border-white/10 bg-navy-900/50 p-4 space-y-4">
                {reviewNotes && (
                  <div>
                    <p className="text-xs text-ink/40 mb-1">
                      Reviewer Notes
                    </p>

                    <p className="text-sm text-ink/70 whitespace-pre-wrap">
                      {reviewNotes}
                    </p>
                  </div>
                )}

                {rejectionReason && (
                  <div>
                    <p className="text-xs text-rose-300/80 mb-1">
                      Rejection Reason
                    </p>

                    <p className="text-sm text-ink/70 whitespace-pre-wrap">
                      {rejectionReason}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Capture notes from the current Admin reviewer. */}
          <div>
            <h4 className="text-sm font-semibold text-cream mb-3">
              Reviewer Notes
            </h4>

            <textarea
              value={notes}
              onChange={(event) =>
                setNotes(
                  event.target.value
                )
              }
              placeholder="Add internal notes..."
              className="w-full h-28 rounded-xl border border-white/10 bg-navy-900/50 p-4 text-sm text-cream placeholder:text-ink/40 focus:border-gold-400/50 focus:outline-none resize-none"
            />

            <p className="text-xs text-ink/40 mt-2">
              These notes are sent with the approval or rejection decision.
            </p>
          </div>

          {/* Display the real verification history. */}
          <div className="pt-6 border-t border-white/10">
            <h4 className="text-sm font-semibold text-cream mb-4">
              Verification History
            </h4>

            {history.length > 0 ? (
              <div className="space-y-4">
                {history.map(
                  (
                    entry,
                    index
                  ) => (
                    <div
                      key={`${entry.action}-${entry.performedAt || index}`}
                      className="flex gap-3"
                    >
                      <div className="flex flex-col items-center">
                        <div className="h-2 w-2 rounded-full bg-gold-400" />

                        {index <
                          history.length -
                            1 && (
                          <div className="h-full w-px bg-white/10 mt-1" />
                        )}
                      </div>

                      <div className="pb-2 text-sm min-w-0">
                        <div className="text-cream font-medium">
                          {entry.action}
                        </div>

                        {entry.notes && (
                          <div className="text-ink/60 mt-0.5 text-xs whitespace-pre-wrap">
                            {entry.notes}
                          </div>
                        )}

                        {entry.performedBy && (
                          <div className="text-ink/50 text-xs mt-1">
                            By{' '}
                            {
                              entry.performedBy
                            }
                          </div>
                        )}

                        {entry.performedAt && (
                          <div className="text-ink/50 text-xs flex items-center gap-1 mt-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(
                              entry.performedAt
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-white/10 bg-navy-900/50 p-5">
                <p className="text-sm text-ink/50">
                  No verification history is available for this record yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
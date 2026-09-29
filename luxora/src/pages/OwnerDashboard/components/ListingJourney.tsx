import { useState, useMemo, useEffect } from 'react';
import {
  Route,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  MessageSquare,
  Upload,
  Eye,
  Download,
  ArrowRight,
  User,
  Building2,
  MapPin,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  GoldButton,
  GhostButton,
} from '../../../components/ui/ui';
import { EmptyState } from '../../../components/layout/EmptyState';
import { useToast } from '../../../contexts/ToastContext';
import { propertyApi } from '../../../api/property.api';
import { uploadApi } from '../../../api/upload.api';
import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';
import UploadDocumentModal from './modals/UploadDocumentModal';
import ExportModal from './modals/ExportModal';

// ListingJourney.tsx
export const mapPropertyToJourney = (
  property: any,
) => {
  // Determine whether this Owner-submitted property
  // has been withdrawn and archived.
  const isWithdrawn =
    property.status === 'Archived' &&
    property.origin === 'owner';

  // Calculate the journey progress from the property's
  // real workflow state.
  let progressPercent = isWithdrawn
    ? 0
    : 20;

  if (
    !isWithdrawn &&
    (
      property.assignmentStatus === 'Agency Assigned' ||
      property.assignmentStatus === 'Agent Assigned'
    )
  ) {
    progressPercent = 40;
  }

  if (
    !isWithdrawn &&
    property.assignmentStatus === 'Agent Assigned'
  ) {
    progressPercent = 60;
  }

  if (
    !isWithdrawn &&
    property.verificationLevel === 'Documents Verified'
  ) {
    progressPercent = 75;
  }

  if (
    !isWithdrawn &&
    property.status === 'Published'
  ) {
    progressPercent = 100;
  }

  // Determine which workflow stages have been completed.
  const agencyAssigned =
    property.assignmentStatus === 'Agency Assigned' ||
    property.assignmentStatus === 'Agent Assigned';

  const agentAssigned =
    property.assignmentStatus === 'Agent Assigned';

  const verificationCompleted =
    property.verificationLevel === 'Documents Verified' ||
    property.verificationLevel ===
      'Physical Inspection Completed';

  // Calculate the current workflow stage.
  let currentStageName: string | null =
    isWithdrawn
      ? null
      : 'Agency Assignment';

  if (
    !isWithdrawn &&
    property.status === 'Published'
  ) {
    currentStageName = 'Published';
  } else if (
    !isWithdrawn &&
    verificationCompleted
  ) {
    currentStageName = 'Publication';
  } else if (
    !isWithdrawn &&
    agentAssigned
  ) {
    currentStageName = 'Verification';
  } else if (
    !isWithdrawn &&
    agencyAssigned
  ) {
    currentStageName = 'Agent Assignment';
  }

  // Build the existing journey stages from backend workflow data.
  const stages = [
    {
      name: 'Property Submitted',
      status: 'Completed',
      date: property.createdAt,
      description:
        'Property was submitted to Luxora for processing.',
      officer: undefined,
      notes: undefined,
    },

    {
      name: 'Agency Assignment',
      status: agencyAssigned
        ? 'Completed'
        : currentStageName ===
            'Agency Assignment'
          ? 'Current'
          : 'Pending',
      date: agencyAssigned
        ? property.assignedAt
        : undefined,
      description: isWithdrawn
        ? 'The property request was withdrawn before agency assignment.'
        : 'Your property is being reviewed and assigned to an agency.',
      officer: undefined,
      notes: undefined,
    },

    {
      name: 'Agent Assignment',
      status: agentAssigned
        ? 'Completed'
        : currentStageName ===
            'Agent Assignment'
          ? 'Current'
          : 'Pending',
      date: agentAssigned
        ? property.assignedAt
        : undefined,
      description:
        'A qualified agent is assigned to manage the property.',
      officer:
        property.agent?.user?.fullName,
      notes: undefined,
    },

    {
      name: 'Verification',
      status: verificationCompleted
        ? 'Completed'
        : currentStageName ===
            'Verification'
          ? 'Current'
          : 'Pending',
      date: verificationCompleted
        ? property.inspectionCompletedAt ||
          property.updatedAt
        : undefined,
      description:
        'Property documents and verification requirements are reviewed.',
      officer: undefined,
      notes: undefined,
    },

    {
      name: 'Publication',
      status:
        property.status === 'Published'
          ? 'Completed'
          : currentStageName ===
              'Publication'
            ? 'Current'
            : 'Pending',
      date:
        property.status === 'Published'
          ? property.updatedAt
          : undefined,
      description:
        'The property is prepared for publication on the Luxora marketplace.',
      officer: undefined,
      notes: undefined,
    },
  ];

  // Calculate the number of days since the property was submitted.
  const submittedTime = property.createdAt
    ? new Date(property.createdAt).getTime()
    : Date.now();

  const daysSinceSubmission = Math.max(
    0,
    Math.floor(
      (Date.now() - submittedTime) /
        (1000 * 60 * 60 * 24),
    ),
  );

  // Build the activity feed from real backend lifecycle events.
  const activityFeed = [
    {
      title: 'Property Submitted',
      date: property.createdAt,
      type: 'success',
    },

    ...(agencyAssigned
      ? [
          {
            title: 'Agency Assigned',
            date: property.assignedAt,
            type: 'success',
          },
        ]
      : []),

    ...(agentAssigned
      ? [
          {
            title: `Agent Assigned${
              property.agent?.user?.fullName
                ? `: ${property.agent.user.fullName}`
                : ''
            }`,
            date: property.assignedAt,
            type: 'success',
          },
        ]
      : []),

    ...(verificationCompleted
      ? [
          {
            title: 'Verification Completed',
            date:
              property.inspectionCompletedAt ||
              property.updatedAt,
            type: 'success',
          },
        ]
      : []),

    ...(property.status === 'Published'
      ? [
          {
            title: 'Property Published',
            date: property.updatedAt,
            type: 'success',
          },
        ]
      : []),

    ...(isWithdrawn
      ? [
          {
            title: 'Property Request Withdrawn',
            date:
              property.withdrawnAt ||
              property.updatedAt,
            type: 'warning',
          },
        ]
      : []),
  ];

  // Build workflow alerts from the real property state.
  const alerts: {
    type: 'warning' | 'error';
    message: string;
  }[] = [];

  if (
    !isWithdrawn &&
    (
      property.assignmentStatus ===
        'Unassigned' ||
      property.assignmentStatus ===
        'Pending Agency Assignment'
    )
  ) {
    alerts.push({
      type: 'warning',
      message:
        'Your property is awaiting agency assignment.',
    });
  }

  if (
    !isWithdrawn &&
    property.verificationLevel !==
      'Documents Verified' &&
    property.status !== 'Published'
  ) {
    alerts.push({
      type: 'warning',
      message:
        'Verification is still in progress.',
    });
  }

  if (isWithdrawn) {
    alerts.push({
      type: 'warning',
      message:
        'This property request was withdrawn and is no longer progressing through the listing workflow.',
    });
  }

  // Find the current stage for the existing highlighted section.
  const currentStage = stages.find(
    (stage) => stage.status === 'Current',
  );

  // Return the shape expected by the existing Listing Journey UI.
  return {
    id: property._id,
    name: property.title,

    backendStatus: property.status,
    origin: property.origin,

    image:
      property.coverImage ||
      property.images?.[0] ||
      undefined,

    status: isWithdrawn
      ? 'Withdrawn'
      : property.status === 'Published'
        ? 'Published'
        : verificationCompleted
          ? 'Verified'
          : agencyAssigned
            ? 'Under Review'
            : 'Submitted',

    address:
      [
        property.area,
        property.city,
        property.state,
      ]
        .filter(Boolean)
        .join(', ') ||
      'Location unavailable',

    type:
      property.propertyType ||
      property.propertySubType ||
      'Property',

    agent: {
      name:
        property.agent?.user?.fullName ||
        'Unassigned',

      avatar:
        property.agent?.user?.avatar ||
        undefined,
    },

    progressPercent,

    daysSinceSubmission,

    estDaysRemaining:
      isWithdrawn
        ? 'Not applicable'
        : progressPercent === 100
          ? 0
          : Math.max(
              1,
              100 - progressPercent,
            ),

    expectedGoLive: isWithdrawn
      ? 'Not applicable'
      : property.status === 'Published'
        ? property.updatedAt
        : 'To be confirmed',

    currentStage,

    stages,

    alerts,

    activityFeed,
  };
};

export type StageStatus =
  | 'Completed'
  | 'Current'
  | 'Pending'
  | 'Delayed'
  | 'Rejected';

interface JourneyExportRow {
  stage: string;
  status: string;
  date: string;
  description: string;
  officer: string;
}

const formatExportDate = (
  value?: string | null,
) => {
  if (!value) {
    return 'Pending';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
};

const escapeCsvValue = (
  value: unknown,
) => {
  const text = String(value ?? '');

  return `"${text.replace(
    /"/g,
    '""',
  )}"`;
};

const escapeHtml = (
  value: unknown,
) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const downloadBlob = (
  content: BlobPart,
  fileName: string,
  mimeType: string,
) => {
  const blob = new Blob(
    [content],
    {
      type: mimeType,
    },
  );

  const url =
    URL.createObjectURL(blob);

  const anchor =
    document.createElement('a');

  anchor.href = url;
  anchor.download = fileName;

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
};

const buildJourneyExportRows = (
  journey: any,
): JourneyExportRow[] =>
  (journey?.stages || []).map(
    (stage: any) => ({
      stage: stage.name,
      status: stage.status,
      date: formatExportDate(
        stage.date,
      ),
      description:
        stage.description || '',
      officer:
        stage.officer ||
        'Unassigned',
    }),
  );

export default function ListingJourney() {
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Store the authenticated Owner's real property journeys.
  const [journeys, setJourneys] =
    useState<any[]>([]);

  // Track which property is currently selected.
  const [selectedId, setSelectedId] =
    useState('');

  // Track the initial backend loading state.
  const [isLoading, setIsLoading] =
    useState(true);

  // Track any backend loading failure.
  const [loadError, setLoadError] =
    useState<string | null>(null);

  const [isActivityOpen, setIsActivityOpen] =
    useState(false);

  const [
    isHistoryDrawerOpen,
    setIsHistoryDrawerOpen,
  ] = useState(false);

  const [
    isUploadModalOpen,
    setIsUploadModalOpen,
  ] = useState(false);

  const [
    isExportModalOpen,
    setIsExportModalOpen,
  ] = useState(false);

  // Load the Owner's real properties when Listing Journey opens.
  useEffect(() => {
    const loadOwnerJourneys = async () => {
      try {
        // Show the loading state while the backend request is running.
        setIsLoading(true);

        // Clear any previous API error.
        setLoadError(null);

        // Fetch the authenticated Owner's real properties.
        const response =
          await propertyApi.getOwnerProperties();

        // Read the property collection returned by the HTTP client.
        const properties =
          (response as any)?.properties || [];

        // Convert backend properties into the existing journey structure.
        const mappedJourneys =
          properties.map(
            mapPropertyToJourney,
          );

        // Store the real journeys in component state.
        setJourneys(mappedJourneys);

        // Automatically select the first property.
        setSelectedId((currentId) => {
          if (
            currentId &&
            mappedJourneys.some(
              (journey) =>
                journey.id === currentId,
            )
          ) {
            return currentId;
          }

          return (
            mappedJourneys[0]?.id || ''
          );
        });
      } catch (error) {
        // Convert the API failure into a readable UI message.
        setLoadError(
          error instanceof Error
            ? error.message
            : 'Failed to load your listing journey.',
        );
      } finally {
        // Stop the loading state after the request completes.
        setIsLoading(false);
      }
    };

    // Start loading the real owner properties.
    loadOwnerJourneys();
  }, []);

  // Find the selected real backend property.
  const journey = useMemo(
    () =>
      journeys.find(
        (item) => item.id === selectedId,
      ) || journeys[0],
    [journeys, selectedId],
  );

  // Show a loading state while the backend property list is loading.
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-8 text-center">
          <p className="text-sm text-ink/60">
            Loading listing journey...
          </p>
        </div>
      </div>
    );
  }

  // Show the API error when the property request fails.
  if (loadError) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-8 text-center">
          <p className="text-sm text-rose-400">
            {loadError}
          </p>
        </div>
      </div>
    );
  }

  // Show the existing empty state when no properties exist.
  if (
    journeys.length === 0 ||
    !journey
  ) {
    return (
      <div className="space-y-6">
        <EmptyState
          icon={
            <Route className="h-8 w-8 text-gold-400" />
          }
          title="No listing journey available."
          description="Submit a property to start tracking its journey."
          actionLabel="Submit Property"
          onAction={() =>
            navigate(
              '/owner-dashboard?tab=Listing+Journey',
            )
          }
        />
      </div>
    );
  }

  const isWithdrawn =
    journey.backendStatus === 'Archived' &&
    journey.origin === 'owner';

  const currentStage =
    journey.stages.find(
      (stage: any) =>
        stage.status === 'Current',
    );

  const getStatusIcon = (
    status: StageStatus,
  ) => {
    switch (status) {
      case 'Completed':
        return (
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
        );

      case 'Current':
        return (
          <div className="h-3 w-3 rounded-full bg-navy-900" />
        );

      case 'Delayed':
        return (
          <Clock className="h-5 w-5 text-yellow-400" />
        );

      case 'Rejected':
        return (
          <XCircle className="h-5 w-5 text-rose-400" />
        );

      default:
        return (
          <div className="h-2 w-2 rounded-full bg-ink/20" />
        );
    }
  };

  const getStatusBg = (
    status: StageStatus,
  ) => {
    switch (status) {
      case 'Completed':
        return 'border-emerald-500 bg-emerald-500/20';

      case 'Current':
        return 'border-gold-400 bg-gold-400 text-navy-900';

      case 'Delayed':
        return 'border-yellow-400 bg-yellow-400/20';

      case 'Rejected':
        return 'border-rose-400 bg-rose-400/20';

      default:
        return 'border-white/10 bg-navy-900';
    }
  };

  const handleUpload = async (
    type: string,
    file: File,
  ) => {
    if (!journey) {
      throw new Error(
        'Select a property before uploading a document.',
      );
    }

    const canUpload =
      journey.backendStatus === 'Draft' ||
      journey.backendStatus ===
        'Pending Review';

    if (!canUpload) {
      throw new Error(
        'Documents cannot be uploaded at this stage of the property workflow.',
      );
    }

    // Upload the selected file to Luxora document storage.
    const uploadResponse =
      (await uploadApi.uploadPropertyDocuments(
        [file],
      )) as {
        documents?: string[];
      };

    const documentUrl =
      uploadResponse.documents?.[0];

    if (!documentUrl) {
      throw new Error(
        'The document was uploaded, but no document URL was returned.',
      );
    }

    // Attach the uploaded document to the real Owner Property.
    const propertyResponse =
      (await propertyApi.addOwnerPropertyDocuments(
        journey.id,
        [
          {
            title: type,
            url: documentUrl,
          },
        ],
      )) as {
        property?: any;
      };

    if (!propertyResponse.property) {
      throw new Error(
        'The document was uploaded, but the property record could not be updated.',
      );
    }

    // Refresh the current journey from the updated backend Property.
    const updatedJourney =
      mapPropertyToJourney(
        propertyResponse.property,
      );

    setJourneys(
      (currentJourneys) =>
        currentJourneys.map(
          (currentJourney) =>
            currentJourney.id ===
              updatedJourney.id
              ? updatedJourney
              : currentJourney,
        ),
    );

    setSelectedId(
      updatedJourney.id,
    );

    setIsUploadModalOpen(false);

    showToast({
      type: 'success',
      title: 'Document Uploaded',
      description:
        `${type} has been uploaded and attached to ${updatedJourney.name}.`,
    });
  };

  const handleExport = (
    format: string,
  ) => {
    if (!journey) {
      showToast({
        type: 'error',
        title: 'Export Failed',
        description:
          'Select a property before exporting its timeline.',
      });
      return;
    }

    const normalizedFormat =
      format.toLowerCase().trim();

    const rows =
      buildJourneyExportRows(journey);

    const safeName =
      journey.name
        .trim()
        .replace(/[^a-z0-9]+/gi, '-')
        .replace(
          /^-+|-+$/g,
          '',
        ) ||
      'luxora-listing-journey';

    const exportedAt =
      new Date().toLocaleString();

    const submittedDate =
      journey.activityFeed?.[0]?.date ||
      undefined;

    const summaryRows: Array<
      [string, string]
    > = [
      ['Property', journey.name],
      ['Status', journey.status],
      [
        'Property Type',
        journey.type,
      ],
      ['Location', journey.address],
      [
        'Progress',
        `${journey.progressPercent}%`,
      ],
      [
        'Submitted',
        formatExportDate(
          submittedDate,
        ),
      ],
      ['Exported', exportedAt],
    ];

    try {
      if (
        normalizedFormat === 'csv'
      ) {
        const csvLines = [
          'Luxora Listing Journey',
          '',
          ...summaryRows.map(
            ([label, value]) =>
              `${escapeCsvValue(
                label,
              )},${escapeCsvValue(value)}`,
          ),
          '',
          [
            'Stage',
            'Status',
            'Date',
            'Description',
            'Responsible',
          ]
            .map(escapeCsvValue)
            .join(','),
          ...rows.map((row) =>
            [
              row.stage,
              row.status,
              row.date,
              row.description,
              row.officer,
            ]
              .map(escapeCsvValue)
              .join(','),
          ),
          '',
          'Activity Feed',
          'Event,Date,Type',
          ...(journey.activityFeed ||
            []).map(
            (event: any) =>
              [
                event.title,
                formatExportDate(
                  event.date,
                ),
                event.type,
              ]
                .map(escapeCsvValue)
                .join(','),
          ),
        ];

        downloadBlob(
          `\uFEFF${csvLines.join(
            '\r\n',
          )}`,
          `${safeName}-timeline.csv`,
          'text/csv;charset=utf-8;',
        );
      } else if (
        normalizedFormat ===
          'excel' ||
        normalizedFormat === 'xls' ||
        normalizedFormat === 'xlsx'
      ) {
        const summaryHtml =
          summaryRows
            .map(
              ([label, value]) => `
                <tr>
                  <td style="font-weight:700;background:#f3f4f6;">
                    ${escapeHtml(label)}
                  </td>
                  <td>
                    ${escapeHtml(value)}
                  </td>
                </tr>
              `,
            )
            .join('');

        const stageHtml =
          rows
            .map(
              (row) => `
                <tr>
                  <td>${escapeHtml(
                    row.stage,
                  )}</td>
                  <td>${escapeHtml(
                    row.status,
                  )}</td>
                  <td>${escapeHtml(
                    row.date,
                  )}</td>
                  <td>${escapeHtml(
                    row.description,
                  )}</td>
                  <td>${escapeHtml(
                    row.officer,
                  )}</td>
                </tr>
              `,
            )
            .join('');

        const activityHtml =
          (
            journey.activityFeed ||
            []
          )
            .map(
              (event: any) => `
                <tr>
                  <td>${escapeHtml(
                    event.title,
                  )}</td>
                  <td>${escapeHtml(
                    formatExportDate(
                      event.date,
                    ),
                  )}</td>
                  <td>${escapeHtml(
                    event.type,
                  )}</td>
                </tr>
              `,
            )
            .join('');

        const excelDocument = `
          <html>
            <head>
              <meta charset="UTF-8" />

              <title>
                ${escapeHtml(
                  journey.name,
                )} - Listing Journey
              </title>

              <style>
                body {
                  font-family: Arial, sans-serif;
                  padding: 24px;
                  color: #111827;
                }

                h1 {
                  margin-bottom: 4px;
                }

                h2 {
                  margin-top: 28px;
                }

                table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-top: 12px;
                }

                th,
                td {
                  border: 1px solid #d1d5db;
                  padding: 8px;
                  text-align: left;
                  vertical-align: top;
                }

                th {
                  background: #111827;
                  color: white;
                }
              </style>
            </head>

            <body>
              <h1>
                Luxora Listing Journey
              </h1>

              <p>
                ${escapeHtml(
                  journey.name,
                )}
              </p>

              <table>
                <tbody>
                  ${summaryHtml}
                </tbody>
              </table>

              <h2>
                Journey Stages
              </h2>

              <table>
                <thead>
                  <tr>
                    <th>Stage</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Responsible</th>
                  </tr>
                </thead>

                <tbody>
                  ${stageHtml}
                </tbody>
              </table>

              <h2>
                Activity Feed
              </h2>

              <table>
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Date</th>
                    <th>Type</th>
                  </tr>
                </thead>

                <tbody>
                  ${activityHtml}
                </tbody>
              </table>
            </body>
          </html>
        `;

        downloadBlob(
          excelDocument,
          `${safeName}-timeline.xls`,
          'application/vnd.ms-excel;charset=utf-8;',
        );
      } else if (
        normalizedFormat === 'pdf'
      ) {
        const printWindow =
          window.open(
            '',
            '_blank',
            'width=900,height=700',
          );

        if (!printWindow) {
          throw new Error(
            'The PDF print window was blocked. Please allow pop-ups for Luxora and try again.',
          );
        }

        const stageHtml =
          rows
            .map(
              (row) => `
                <tr>
                  <td>${escapeHtml(
                    row.stage,
                  )}</td>
                  <td>${escapeHtml(
                    row.status,
                  )}</td>
                  <td>${escapeHtml(
                    row.date,
                  )}</td>
                  <td>${escapeHtml(
                    row.description,
                  )}</td>
                  <td>${escapeHtml(
                    row.officer,
                  )}</td>
                </tr>
              `,
            )
            .join('');

        const activityHtml =
          (
            journey.activityFeed ||
            []
          )
            .map(
              (event: any) => `
                <li>
                  <strong>
                    ${escapeHtml(
                      event.title,
                    )}
                  </strong>
                  —
                  ${escapeHtml(
                    formatExportDate(
                      event.date,
                    ),
                  )}
                </li>
              `,
            )
            .join('');

        const summaryHtml =
          summaryRows
            .map(
              ([label, value]) => `
                <div class="summary-item">
                  <span class="label">
                    ${escapeHtml(
                      label,
                    )}
                  </span>

                  <span>
                    ${escapeHtml(
                      value,
                    )}
                  </span>
                </div>
              `,
            )
            .join('');

        printWindow.document.write(`
          <!doctype html>

          <html>
            <head>
              <meta charset="UTF-8" />

              <title>
                ${escapeHtml(
                  journey.name,
                )} - Listing Journey
              </title>

              <style>
                * {
                  box-sizing: border-box;
                }

                body {
                  font-family: Arial, sans-serif;
                  color: #111827;
                  margin: 0;
                  padding: 32px;
                }

                h1 {
                  margin: 0 0 6px;
                  font-size: 28px;
                }

                .subtitle {
                  color: #6b7280;
                  margin-bottom: 24px;
                }

                .summary {
                  display: grid;
                  grid-template-columns:
                    repeat(2, 1fr);
                  gap: 10px;
                  margin-bottom: 28px;
                }

                .summary-item {
                  border: 1px solid #d1d5db;
                  padding: 10px 12px;
                  border-radius: 8px;
                  display: flex;
                  justify-content:
                    space-between;
                  gap: 16px;
                }

                .label {
                  color: #6b7280;
                  font-weight: 600;
                }

                h2 {
                  margin: 24px 0 10px;
                  font-size: 18px;
                }

                table {
                  width: 100%;
                  border-collapse: collapse;
                }

                th,
                td {
                  border: 1px solid #d1d5db;
                  padding: 8px;
                  text-align: left;
                  vertical-align: top;
                  font-size: 12px;
                }

                th {
                  background: #111827;
                  color: white;
                }

                li {
                  margin-bottom: 8px;
                }

                .footer {
                  margin-top: 32px;
                  color: #6b7280;
                  font-size: 11px;
                }

                @media print {
                  body {
                    padding: 16px;
                  }
                }
              </style>
            </head>

            <body>
              <h1>
                Luxora Listing Journey
              </h1>

              <div class="subtitle">
                ${escapeHtml(
                  journey.name,
                )}
              </div>

              <div class="summary">
                ${summaryHtml}
              </div>

              <h2>
                Journey Stages
              </h2>

              <table>
                <thead>
                  <tr>
                    <th>Stage</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Responsible</th>
                  </tr>
                </thead>

                <tbody>
                  ${stageHtml}
                </tbody>
              </table>

              <h2>
                Activity Feed
              </h2>

              <ul>
                ${activityHtml}
              </ul>

              <div class="footer">
                Generated from Luxora on
                ${escapeHtml(
                  exportedAt,
                )}
              </div>
            </body>
          </html>
        `);

        printWindow.document.close();
        printWindow.focus();

        window.setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 300);
      } else {
        throw new Error(
          'Unsupported export format.',
        );
      }

      setIsExportModalOpen(false);

      showToast({
        type: 'success',
        title: 'Timeline Exported',
        description:
          normalizedFormat === 'pdf'
            ? 'The timeline print dialog has been opened so you can save it as a PDF.'
            : `Your timeline has been downloaded as ${normalizedFormat.toUpperCase()}.`,
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Export Failed',
        description:
          error instanceof Error
            ? error.message
            : 'The listing timeline could not be exported.',
      });
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h2 className="font-heading text-2xl font-bold text-cream">
          Listing Journey
        </h2>

        <p className="text-sm text-ink/60">
          Track your property's complete lifecycle from submission to publication and beyond.
        </p>
      </div>

      {/* Property Selector */}
      <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3">
            <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider mb-2 block">
              Select Property
            </label>

            <select
              className="w-full rounded-xl border border-white/10 bg-navy-900 py-3 px-4 text-cream focus:border-gold-400 focus:outline-none transition-colors"
              value={selectedId}
              onChange={(e) =>
                setSelectedId(
                  e.target.value,
                )
              }
            >
              {journeys.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.name} ({item.status})
                </option>
              ))}
            </select>

            <div className="mt-4 rounded-xl overflow-hidden border border-white/10 relative">
              <img
                src={journey.image}
                alt={journey.name}
                className="h-40 w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-navy-950 to-transparent" />

              <div className="absolute bottom-3 left-3 right-3">
                <span className="inline-flex rounded-full bg-gold-400/20 border border-gold-400/30 px-2 py-0.5 text-[10px] font-bold uppercase text-gold-400 mb-1 backdrop-blur-md">
                  {journey.status}
                </span>

                <h3 className="font-heading font-bold text-cream text-lg leading-tight truncate">
                  {journey.name}
                </h3>

                <div className="text-xs text-cream/70 flex items-center gap-1 mt-1 truncate">
                  <MapPin className="h-3 w-3" />
                  {journey.address}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-navy-900/50 border border-white/5 flex flex-col justify-center">
              <div className="text-xs text-ink/50 uppercase tracking-wider mb-1">
                Property Type
              </div>

              <div className="font-semibold text-cream flex items-center gap-2">
                <Building2 className="h-4 w-4 text-gold-400" />
                {journey.type}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-navy-900/50 border border-white/5 flex flex-col justify-center">
              <div className="text-xs text-ink/50 uppercase tracking-wider mb-1">
                Assigned Agent
              </div>

              <div className="font-semibold text-cream flex items-center gap-2">
                {journey.agent.avatar ? (
                  <img
                    src={journey.agent.avatar}
                    alt="Agent"
                    className="h-6 w-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-6 w-6 rounded-full bg-navy-800 border border-white/10" />
                )}

                {journey.agent.name}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="sm:col-span-2 mt-auto flex flex-wrap gap-2">
              {!isWithdrawn && (
                <>
                  <GoldButton
                    size="sm"
                    onClick={() =>
                      navigate(
                        '/owner-dashboard?tab=Messages',
                      )
                    }
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact Agent
                  </GoldButton>

                  {(
                    journey.backendStatus ===
                      'Draft' ||
                    journey.backendStatus ===
                      'Pending Review'
                  ) && (
                    <GhostButton
                      size="sm"
                      onClick={() =>
                        setIsUploadModalOpen(
                          true,
                        )
                      }
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Missing Docs
                    </GhostButton>
                  )}

                  <GhostButton
                    size="sm"
                    onClick={() =>
                      navigate(
                        `/properties/${journey.id}`,
                      )
                    }
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Listing
                  </GhostButton>
                </>
              )}

              <GhostButton
                size="sm"
                onClick={() =>
                  setIsExportModalOpen(
                    true,
                  )
                }
              >
                <Download className="h-4 w-4 mr-2" />
                Download Timeline
              </GhostButton>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {journey.alerts.map(
        (
          alert: {
            type:
              | 'warning'
              | 'error';
            message: string;
          },
          idx: number,
        ) => (
          <div
            key={idx}
            className={`rounded-xl border p-4 flex gap-3 items-center ${
              alert.type === 'error'
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
            }`}
          >
            <AlertTriangle className="h-5 w-5 shrink-0" />

            <div className="text-sm font-medium">
              {alert.message}
            </div>
          </div>
        ),
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: Timeline */}
        <div className="lg:col-span-2 space-y-8">
          {/* Progress Summary */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col md:flex-row gap-6 justify-between items-center">
            <div className="w-full md:w-1/3">
              <div className="text-sm text-ink/60 mb-2">
                Overall Progress
              </div>

              <div className="flex items-end gap-3 mb-2">
                <div className="text-3xl font-heading font-bold text-gold-400 leading-none">
                  {journey.progressPercent}%
                </div>
              </div>

              <div className="h-2 w-full bg-navy-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold-400 rounded-full transition-all duration-500"
                  style={{
                    width: `${journey.progressPercent}%`,
                  }}
                />
              </div>
            </div>

            <div className="w-full md:w-2/3 grid grid-cols-3 gap-4 text-center md:text-left divide-x divide-white/10">
              <div className="px-2">
                <div className="text-[10px] uppercase text-ink/50 font-semibold mb-1">
                  Days Since Sub.
                </div>

                <div className="text-xl font-bold text-cream">
                  {journey.daysSinceSubmission}
                </div>
              </div>

              <div className="px-2">
                <div className="text-[10px] uppercase text-ink/50 font-semibold mb-1">
                  Est. Remaining
                </div>

                <div className="text-xl font-bold text-cream">
                  {journey.estDaysRemaining}
                </div>
              </div>

              <div className="px-2">
                <div className="text-[10px] uppercase text-ink/50 font-semibold mb-1">
                  Go Live Date
                </div>

                <div
                  className={`text-lg font-bold ${
                    isWithdrawn
                      ? 'text-ink/50'
                      : 'text-emerald-400'
                  }`}
                >
                  {journey.expectedGoLive}
                </div>
              </div>
            </div>
          </div>

          {/* Current Stage Highlight */}
          {currentStage && (
            <div className="rounded-2xl border border-gold-400/30 bg-gold-400/5 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400/10 blur-3xl rounded-full" />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-gold-400/20 px-2 py-1 text-[10px] font-bold uppercase text-gold-400 mb-2 border border-gold-400/30">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-400"></span>
                    </span>
                    Current Step
                  </div>

                  <h3 className="font-heading text-xl font-bold text-cream">
                    {currentStage.name}
                  </h3>

                  <p className="text-sm text-ink/70 mt-1">
                    {currentStage.description}
                  </p>
                </div>

                <div className="bg-navy-900/80 rounded-xl p-4 border border-white/5 min-w-[200px]">
                  <div className="text-xs text-ink/50 mb-1">
                    Assigned Team
                  </div>

                  <div className="font-semibold text-cream text-sm mb-3">
                    {currentStage.officer ||
                      'Unassigned'}
                  </div>

                  <div className="text-xs text-ink/50 mb-1">
                    Est. Completion
                  </div>

                  <div className="font-semibold text-emerald-400 text-sm">
                    {currentStage.estCompletion ||
                      'Pending'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* The Timeline */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 md:p-8">
            <h3 className="font-heading text-xl font-bold text-cream mb-8">
              Journey Stages
            </h3>

            <div className="relative">
              <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-white/5" />

              <div className="space-y-8">
                {journey.stages.map(
                  (
                    stage: any,
                    idx: number,
                  ) => {
                    const isCurrent =
                      stage.status ===
                      'Current';

                    const isCompleted =
                      stage.status ===
                      'Completed';

                    const isPending =
                      stage.status ===
                      'Pending';

                    return (
                      <div
                        key={idx}
                        className={`relative flex gap-6 transition-opacity ${
                          isPending
                            ? 'opacity-50'
                            : 'opacity-100'
                        }`}
                      >
                        <div
                          className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 ${getStatusBg(
                            stage.status as StageStatus,
                          )}`}
                        >
                          {getStatusIcon(
                            stage.status as StageStatus,
                          )}
                        </div>

                        <div className="flex-1 pt-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                            <h4
                              className={`font-semibold text-lg truncate ${
                                isCurrent
                                  ? 'text-gold-400'
                                  : isCompleted
                                    ? 'text-cream'
                                    : 'text-ink/60'
                              }`}
                            >
                              {idx + 1}.{' '}
                              {stage.name}
                            </h4>

                            {stage.date && (
                              <div className="text-xs text-ink/50 whitespace-nowrap">
                                {stage.date}
                              </div>
                            )}
                          </div>

                          <p className="text-sm text-ink/60 mt-1">
                            {stage.description}
                          </p>

                          {(stage.officer ||
                            stage.notes) && (
                            <div className="mt-3 p-3 rounded-xl bg-navy-900/50 border border-white/5 space-y-2">
                              {stage.officer && (
                                <div className="flex items-center gap-2 text-xs text-ink/60">
                                  <User className="h-3 w-3" />
                                  Responsible:{' '}
                                  <span className="text-cream">
                                    {
                                      stage.officer
                                    }
                                  </span>
                                </div>
                              )}

                              {stage.notes && (
                                <div className="text-sm text-ink/80 italic border-l-2 border-white/10 pl-3">
                                  "{stage.notes}"
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Activity Feed */}
        <div className="space-y-8">
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <div
              className="flex items-center justify-between cursor-pointer lg:cursor-auto"
              onClick={() =>
                setIsActivityOpen(
                  !isActivityOpen,
                )
              }
            >
              <h3 className="font-heading text-lg font-bold text-cream">
                Activity Feed
              </h3>

              <div className="lg:hidden p-1 text-ink/50 hover:bg-white/5 rounded-md">
                {isActivityOpen ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </div>
            </div>

            <div
              className={`mt-6 space-y-4 ${
                !isActivityOpen
                  ? 'hidden lg:block'
                  : 'block'
              }`}
            >
              {journey.activityFeed.map(
                (
                  event: {
                    title: string;
                    date?: string;
                    type: string;
                  },
                  idx: number,
                ) => (
                  <div
                    key={idx}
                    className="flex gap-4 items-start p-3 rounded-xl bg-navy-900/50 border border-white/5"
                  >
                    <div
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                        event.type === 'success'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : event.type === 'warning'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-blue-500/20 text-blue-400'
                      }`}
                    >
                      <ArrowRight className="h-3 w-3" />
                    </div>

                    <div>
                      <div className="text-sm font-semibold text-cream">
                        {event.title}
                      </div>

                      <div className="text-[10px] text-ink/50 mt-1">
                        {event.date}
                      </div>
                    </div>
                  </div>
                ),
              )}

              <GhostButton
                className="w-full text-xs py-2 mt-4"
                onClick={() =>
                  setIsHistoryDrawerOpen(
                    true,
                  )
                }
              >
                View Full History
              </GhostButton>
            </div>
          </div>
        </div>
      </div>

      <UploadDocumentModal
        isOpen={isUploadModalOpen}
        onClose={() =>
          setIsUploadModalOpen(false)
        }
        onUpload={handleUpload}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() =>
          setIsExportModalOpen(false)
        }
        onExport={handleExport}
        title="Download Timeline"
      />

      <EnterpriseDetailDrawer
        isOpen={isHistoryDrawerOpen}
        onClose={() =>
          setIsHistoryDrawerOpen(false)
        }
        title="Full Journey History"
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-cream">
              Complete Activity Feed
            </h4>

            <GhostButton
              size="sm"
              onClick={() =>
                setIsExportModalOpen(
                  true,
                )
              }
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </GhostButton>
          </div>

          <div className="space-y-4">
            {journey.activityFeed.map(
              (
                event: {
                  title: string;
                  date?: string;
                  type: string;
                },
                idx: number,
              ) => (
                <div
                  key={idx}
                  className="flex gap-4 items-start p-4 rounded-xl bg-navy-900/50 border border-white/5"
                >
                  <div
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/5 ${
                      event.type === 'success'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : event.type === 'warning'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-blue-500/20 text-blue-400'
                    }`}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-cream mb-1">
                      {event.title}
                    </div>

                    <div className="text-xs text-ink/70 mb-2">
                      Recorded by system
                    </div>

                    <div className="text-[10px] uppercase tracking-wider text-ink/50">
                      {event.date}
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </EnterpriseDetailDrawer>
    </div>
  );
}
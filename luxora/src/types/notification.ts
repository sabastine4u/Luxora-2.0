export type Notification = {
  id: string;
  type: string;
  category: string;
  priority: string;
  title: string;
  body: string;
  actor: string | null;
  resourceType: string | null;
  resourceId: string | null;
  property: string | null;
  inquiry: string | null;
  booking: string | null;
  offer: string | null;
  conversation: string | null;
  message: string | null;
  createdAt: string;
  readAt: string | null;
  archivedAt: string | null;
};

type NotificationPayload = Record<string, unknown>;

const toStringOrNull = (value: unknown): string | null =>
  value === null || value === undefined ? null : String(value);

const normalizeNotification = (
  payload: NotificationPayload,
  archivedAt: string | null,
): Notification => ({
  id: String(payload.id ?? payload._id),
  type: String(payload.type ?? ''),
  category: String(payload.category ?? ''),
  priority: String(payload.priority ?? 'normal'),
  title: String(payload.title ?? ''),
  body: String(payload.body ?? ''),
  actor: toStringOrNull(payload.actor),
  resourceType: toStringOrNull(payload.resourceType),
  resourceId: toStringOrNull(payload.resourceId),
  property: toStringOrNull(payload.property),
  inquiry: toStringOrNull(payload.inquiry),
  booking: toStringOrNull(payload.booking),
  offer: toStringOrNull(payload.offer),
  conversation: toStringOrNull(payload.conversation),
  message: toStringOrNull(payload.message),
  createdAt: String(payload.createdAt ?? new Date().toISOString()),
  readAt: toStringOrNull(payload.readAt),
  archivedAt,
});

export const normalizeRestNotification = (
  payload: NotificationPayload,
): Notification => normalizeNotification(payload, toStringOrNull(payload.archivedAt));

export const normalizeRealtimeNotification = (
  payload: NotificationPayload,
): Notification => normalizeNotification(payload, null);

// src/modules/enterprise/events/types.ts

// The generic payload type for events. Modules can extend this or define their own.
export type EventPayload = Record<string, unknown>;

export interface EnterpriseEvent<T = EventPayload> {
  id: string;
  version: 1; // Strict versioning strategy from the beginning
  timestamp: Date;
  type: string;
  payload: T;
}

export type EventCallback<T = EventPayload> = (event: EnterpriseEvent<T>) => void | Promise<void>;

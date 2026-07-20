// src/modules/enterprise/events/interfaces.ts
import type { EnterpriseEventType } from './registry';
import type { EventCallback } from './types';

export interface IEventBus {
  publish<T>(type: EnterpriseEventType, payload: T): void;
  subscribe<T>(type: EnterpriseEventType, callback: EventCallback<T>): () => void;
  unsubscribe<T>(type: EnterpriseEventType, callback: EventCallback<T>): void;
}

// src/modules/enterprise/events/publishEvent.ts
import { enterpriseEventBus } from './eventBus';
import type { EnterpriseEventType } from './registry';

/**
 * Utility to publish enterprise events anywhere in the platform.
 * 
 * @param type The standard EnterpriseEventType
 * @param payload The immutable payload to dispatch
 */
export function publishEvent<T>(type: EnterpriseEventType, payload: T): void {
  enterpriseEventBus.publish(type, payload);
}

/**
 * React hook to access the publisher
 */
export function useEnterprisePublish() {
  return publishEvent;
}

// src/modules/enterprise/events/subscribeEvent.ts
import { useEffect } from 'react';
import { enterpriseEventBus } from './eventBus';
import type { EnterpriseEventType } from './registry';
import type { EventCallback } from './types';

/**
 * React hook to automatically subscribe and unsubscribe to enterprise events.
 * 
 * @param type The standard EnterpriseEventType
 * @param callback The callback to execute when the event fires
 */
export function useEnterpriseSubscribe<T>(type: EnterpriseEventType, callback: EventCallback<T>) {
  useEffect(() => {
    const unsubscribe = enterpriseEventBus.subscribe(type, callback);
    return () => {
      unsubscribe();
    };
  }, [type, callback]);
}

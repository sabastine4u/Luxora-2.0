// src/modules/enterprise/events/eventBus.ts
import type { IEventBus } from './interfaces';
import type { EnterpriseEvent, EventCallback } from './types';
import type { EnterpriseEventType } from './registry';

class EventBus implements IEventBus {
  private static instance: EventBus;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private subscribers: Map<string, Set<EventCallback<any>>>;

  private constructor() {
    this.subscribers = new Map();
  }

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public publish<T>(type: EnterpriseEventType, payload: T): void {
    const event: EnterpriseEvent<T> = {
      id: crypto.randomUUID(),
      version: 1,
      timestamp: new Date(),
      type,
      payload
    };

    // Immutable event payload enforced (shallow freeze for safety)
    Object.freeze(event);
    if (typeof payload === 'object' && payload !== null) {
      Object.freeze(payload);
    }

    const callbacks = this.subscribers.get(type);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(event);
        } catch (error) {
          console.error(`[EventBus] Error in subscriber for ${type}:`, error);
        }
      });
    }

    // Broadcast to audit layer (for future AuditCenter)
    this.audit(event);
  }

  public subscribe<T>(type: EnterpriseEventType, callback: EventCallback<T>): () => void {
    if (!this.subscribers.has(type)) {
      this.subscribers.set(type, new Set());
    }
    this.subscribers.get(type)!.add(callback);

    // Return unsubscribe function
    return () => this.unsubscribe(type, callback);
  }

  public unsubscribe<T>(type: EnterpriseEventType, callback: EventCallback<T>): void {
    const callbacks = this.subscribers.get(type);
    if (callbacks) {
      callbacks.delete(callback);
      if (callbacks.size === 0) {
        this.subscribers.delete(type);
      }
    }
  }

  private audit<T>(event: EnterpriseEvent<T>) {
    // Placeholder for future AuditCenter ingestion
    if (import.meta.env.DEV) {
      console.log(`[EventBus Publish] ${event.type}`, event);
    }
  }
}

export const enterpriseEventBus = EventBus.getInstance();

/**
 * EventEmitter.ts
 * 
 * This file implements an EventEmitter class, which is a crucial component for handling events
 * and enabling communication between different parts of the Microsoft Excel application.
 */

// Since we couldn't fetch the actual types, we'll define them here
type EventHandler<T> = (data: T) => void;
interface EventMap {
  [key: string]: any;
}

/**
 * The EventEmitter class provides a robust implementation of the publish-subscribe pattern,
 * allowing different parts of the Excel application to communicate through events.
 * It supports typed events for improved type safety and developer experience.
 */
export class EventEmitter<T extends EventMap> {
  private listeners: Map<keyof T, Set<EventHandler<T[keyof T]>>> = new Map();

  /**
   * Subscribes a handler function to a specific event type.
   * If the handler is already subscribed, it won't be added again.
   * 
   * @param event - The event type to subscribe to
   * @param handler - The function to be called when the event is emitted
   */
  public on<K extends keyof T>(event: K, handler: EventHandler<T[K]>): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);
  }

  /**
   * Unsubscribes a handler function from a specific event type.
   * If the handler is not found, no action is taken.
   * 
   * @param event - The event type to unsubscribe from
   * @param handler - The function to be removed from the event's listeners
   */
  public off<K extends keyof T>(event: K, handler: EventHandler<T[K]>): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(handler);
    }
  }

  /**
   * Emits an event of a specific type with the provided data.
   * All subscribed handlers for this event type will be called with the data.
   * 
   * @param event - The event type to emit
   * @param data - The data to be passed to the event handlers
   */
  public emit<K extends keyof T>(event: K, data: T[K]): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(handler => handler(data));
    }
  }
}

// Example usage:
/*
interface ExcelEventMap {
  'cell-changed': { cellId: string; newValue: string };
  'sheet-added': { sheetId: string; sheetName: string };
}

const excelEvents = new EventEmitter<ExcelEventMap>();

excelEvents.on('cell-changed', ({ cellId, newValue }) => {
  console.log(`Cell ${cellId} changed to ${newValue}`);
});

excelEvents.emit('cell-changed', { cellId: 'A1', newValue: '42' });
*/
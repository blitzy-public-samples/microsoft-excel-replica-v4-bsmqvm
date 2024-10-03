// Basic EventEmitter implementation
class EventEmitter {
  private listeners: { [event: string]: Function[] } = {};

  on(event: string, callback: Function): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  emit(event: string, ...args: any[]): void {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(...args));
    }
  }
}

/**
 * LocalStorageService class provides methods for interacting with the browser's local storage,
 * including setting, getting, and removing items. It also emits events when storage changes occur.
 */
export class LocalStorageService extends EventEmitter {
  private storage: Storage;

  /**
   * Initializes the LocalStorageService and sets up event listeners for storage changes.
   */
  constructor() {
    super();
    this.storage = window.localStorage;
    window.addEventListener('storage', this.handleStorageChange.bind(this));
  }

  /**
   * Stores a key-value pair in local storage and emits a 'storageChange' event.
   * @param key - The key to store the value under.
   * @param value - The value to store.
   */
  setItem(key: string, value: string): void {
    try {
      this.storage.setItem(key, value);
      this.emit('storageChange', key, value);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.error('LocalStorage quota exceeded. Unable to set item:', key);
      } else {
        console.error('Error setting item in LocalStorage:', error);
      }
    }
  }

  /**
   * Retrieves a value from local storage based on the provided key.
   * @param key - The key of the item to retrieve.
   * @returns The value associated with the key, or null if not found.
   */
  getItem(key: string): string | null {
    return this.storage.getItem(key);
  }

  /**
   * Removes an item from local storage based on the provided key and emits a 'storageChange' event.
   * @param key - The key of the item to remove.
   */
  removeItem(key: string): void {
    this.storage.removeItem(key);
    this.emit('storageChange', key, null);
  }

  /**
   * Clears all items from local storage and emits a 'storageChange' event.
   */
  clear(): void {
    this.storage.clear();
    this.emit('storageChange', null, null);
  }

  /**
   * Handles storage change events, including those from other tabs/windows.
   * @param event - The storage event object.
   */
  private handleStorageChange(event: StorageEvent): void {
    if (event.storageArea === this.storage) {
      this.emit('storageChange', event.key, event.newValue);
    }
  }
}
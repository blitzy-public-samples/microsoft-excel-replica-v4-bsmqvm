import { useState, useEffect } from 'react';

/**
 * A custom React hook for interacting with the browser's localStorage API.
 * This hook provides a convenient way to persist and retrieve data in Excel's web application.
 * 
 * @template T The type of the value to be stored in localStorage
 * @param {string} key The key under which the value will be stored in localStorage
 * @param {T} initialValue The initial value to be used if no value is found in localStorage
 * @returns {[T, (value: T) => void]} A tuple containing the current value and a setter function
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // Initialize the state with a function that tries to get the value from localStorage
  // or returns the initial value if not found
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.error('Error writing to localStorage:', error);
    }
  };

  // Use useEffect to update local storage when the key changes
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error('Error reading from localStorage on key change:', error);
    }
  }, [key]);

  return [storedValue, setValue];
}
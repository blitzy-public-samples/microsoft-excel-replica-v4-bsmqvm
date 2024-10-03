import { useState, useEffect } from 'react';

/**
 * A custom hook that debounces a value, delaying its update for a specified amount of time.
 * This hook improves performance by reducing the frequency of expensive operations.
 * 
 * @template T The type of the value being debounced
 * @param {T} value The value to be debounced
 * @param {number} delay The delay in milliseconds before updating the debounced value
 * @returns {T} The debounced value
 */
function useDebounce<T>(value: T, delay: number): T {
  // Initialize state with the initial value
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up a timeout to update the debounced value after the specified delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clear the timeout if the value or delay changes before the timeout completes
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]); // Re-run the effect if value or delay changes

  // Return the debounced value
  return debouncedValue;
}

export default useDebounce;
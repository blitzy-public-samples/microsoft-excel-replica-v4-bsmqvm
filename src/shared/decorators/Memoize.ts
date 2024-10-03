/**
 * Memoize decorator
 * This decorator is used to cache the results of expensive function calls and return the cached result when the same inputs occur again.
 */

/**
 * Creates a WeakMap to store the cache for each memoized function.
 * Using WeakMap allows for garbage collection of cached results when the original function is no longer referenced.
 */
const memoizedResults = new WeakMap<Function, Map<string, any>>();

/**
 * Memoize decorator function
 * @param target The original method being decorated
 * @param _context The context of the decorator (unused in this implementation)
 * @returns The memoized version of the input function
 */
export function Memoize<T extends Function>(
  target: T,
  _context: ClassMethodDecoratorContext
): T {
  // Create a new function that wraps the original function
  const memoized = function (this: any, ...args: any[]): any {
    // Get the cache for this function, or create a new one if it doesn't exist
    let cache = memoizedResults.get(target);
    if (!cache) {
      cache = new Map<string, any>();
      memoizedResults.set(target, cache);
    }

    // Generate a cache key by stringifying the arguments
    const key = JSON.stringify(args);

    // Check if the result is already in the cache
    if (cache.has(key)) {
      // If cached, return the cached result
      return cache.get(key);
    }

    // If not cached, call the original function and store the result in the cache
    const result = target.apply(this, args);
    cache.set(key, result);

    // Return the result
    return result;
  };

  // Return the memoized function
  return memoized as T;
}

/**
 * Example usage:
 * 
 * class ExampleClass {
 *   @Memoize
 *   expensiveOperation(input: number): number {
 *     console.log('Performing expensive operation');
 *     return input * 2;
 *   }
 * }
 * 
 * const example = new ExampleClass();
 * console.log(example.expensiveOperation(5)); // Logs: Performing expensive operation, Output: 10
 * console.log(example.expensiveOperation(5)); // Output: 10 (cached result, no log)
 * console.log(example.expensiveOperation(10)); // Logs: Performing expensive operation, Output: 20
 */
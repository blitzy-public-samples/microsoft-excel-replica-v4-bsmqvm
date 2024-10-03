/**
 * Throttle decorator
 * 
 * This decorator is used to limit the rate at which a function can be called,
 * preventing excessive executions in a short period of time.
 * 
 * @param limit The maximum number of times the function can be called within the interval
 * @param interval The time interval in milliseconds
 * @returns A decorator function that can be applied to class methods
 */
export function Throttle(limit: number, interval: number): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    let lastExecution = 0;
    let executionCount = 0;

    descriptor.value = function (...args: any[]) {
      const now = Date.now();

      if (now - lastExecution >= interval) {
        // Reset the execution count if the interval has passed
        executionCount = 0;
        lastExecution = now;
      }

      if (executionCount < limit) {
        executionCount++;
        return originalMethod.apply(this, args);
      } else {
        console.warn(`Method ${String(propertyKey)} throttled. Limit: ${limit}, Interval: ${interval}ms`);
        return;
      }
    };

    return descriptor;
  };
}

/**
 * Example usage:
 * 
 * class ExampleClass {
 *   @Throttle(5, 1000)
 *   public throttledMethod() {
 *     console.log('This method can be called at most 5 times per second');
 *   }
 * }
 */

// Export the Throttle decorator for use in other parts of the application
export default Throttle;
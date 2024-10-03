/**
 * This file contains a collection of easing functions used for animations in the Microsoft Excel charting engine.
 * These functions provide various interpolation methods to create smooth and visually appealing transitions for chart elements.
 */

/**
 * A linear easing function that provides a constant rate of change.
 * @param t The input value between 0 and 1.
 * @returns The eased value.
 */
export function linear(t: number): number {
    return t;
}

/**
 * An easing function that accelerates from zero velocity.
 * @param t The input value between 0 and 1.
 * @returns The eased value.
 */
export function easeInQuad(t: number): number {
    return t * t;
}

/**
 * An easing function that decelerates to zero velocity.
 * @param t The input value between 0 and 1.
 * @returns The eased value.
 */
export function easeOutQuad(t: number): number {
    return t * (2 - t);
}

/**
 * An easing function that accelerates until halfway, then decelerates.
 * @param t The input value between 0 and 1.
 * @returns The eased value.
 */
export function easeInOutQuad(t: number): number {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

/**
 * An easing function with a stronger acceleration from zero velocity.
 * @param t The input value between 0 and 1.
 * @returns The eased value.
 */
export function easeInCubic(t: number): number {
    return t * t * t;
}

/**
 * An easing function with a stronger deceleration to zero velocity.
 * @param t The input value between 0 and 1.
 * @returns The eased value.
 */
export function easeOutCubic(t: number): number {
    return (--t) * t * t + 1;
}

/**
 * An easing function with a stronger acceleration until halfway, then stronger deceleration.
 * @param t The input value between 0 and 1.
 * @returns The eased value.
 */
export function easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

/**
 * Ensure that the input value is within the range [0, 1].
 * @param t The input value to clamp.
 * @returns The clamped value between 0 and 1.
 */
function clamp(t: number): number {
    return Math.max(0, Math.min(1, t));
}

/**
 * A higher-order function that wraps easing functions to ensure input is clamped between 0 and 1.
 * @param easingFunction The easing function to wrap.
 * @returns A new function that clamps the input before applying the easing function.
 */
function withInputClamping(easingFunction: (t: number) => number): (t: number) => number {
    return (t: number) => easingFunction(clamp(t));
}

// Export clamped versions of all easing functions
export const easingFunctions = {
    linear: withInputClamping(linear),
    easeInQuad: withInputClamping(easeInQuad),
    easeOutQuad: withInputClamping(easeOutQuad),
    easeInOutQuad: withInputClamping(easeInOutQuad),
    easeInCubic: withInputClamping(easeInCubic),
    easeOutCubic: withInputClamping(easeOutCubic),
    easeInOutCubic: withInputClamping(easeInOutCubic),
};
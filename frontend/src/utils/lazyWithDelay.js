import { lazy } from 'react';

/**
 * Wraps dynamic import with a minimum delay to prevent UI flicker on high-speed connections.
 * Supplementary Requirement for Practical 8.
 * 
 * @param {Function} importFunc - () => import('./path/to/Component')
 * @param {number} delayMs - Minimum duration in ms to hold the loading fallback (default 300ms)
 * @returns {React.LazyExoticComponent}
 */
export function lazyWithDelay(importFunc, delayMs = 300) {
  return lazy(() =>
    Promise.all([
      importFunc(),
      new Promise((resolve) => setTimeout(resolve, delayMs))
    ]).then(([moduleExports]) => moduleExports)
  );
}

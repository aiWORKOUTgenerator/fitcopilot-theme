/**
 * Mount Verification Utility
 * 
 * Provides utilities to verify and communicate successful React mounting
 * back to the WordPress environment.
 */

import logger from './logger';

/**
 * Notify WordPress that React has successfully mounted
 * Calls a global function that WordPress has defined in functions.php
 */
export const notifyMountSuccess = (): void => {
  logger.info('React app successfully mounted');

  // Add a class to the document for CSS targeting
  document.documentElement.classList.add('react-mounted');

  // Call the global callback function if it exists
  if (typeof window !== 'undefined' && 'fitcopilotReactMounted' in window) {
    try {
      // @ts-expect-error - Call the global function defined in WordPress
      window.fitcopilotReactMounted();
    } catch (error) {
      logger.error('Error calling WordPress mount notification function:', error);
    }
  }
};

/**
 * Check if the application is running in an expected environment
 */
export const verifyEnvironment = (): boolean => {
  if (typeof window === 'undefined') {
    logger.warn('React app is running in a non-browser environment');
    return false;
  }

  // Check if we're in WordPress context by looking for expected data
  const hasWordPressData =
        'athleteDashboardData' in window &&
        typeof window.athleteDashboardData === 'object' &&
        window.athleteDashboardData !== null;

  if (!hasWordPressData) {
    logger.warn('React app is running outside WordPress context or athleteDashboardData is missing');
  }

  return hasWordPressData;
};

/**
 * Initialize mount verification for the React application
 * Call this at the root component level useEffect
 */
export const initializeMountVerification = (): void => {
  const isValidEnvironment = verifyEnvironment();

  if (isValidEnvironment) {
    notifyMountSuccess();
  } else {
    logger.warn('React mount verification failed: invalid environment');
  }
};

export default {
  notifyMountSuccess,
  verifyEnvironment,
  initializeMountVerification
}; 
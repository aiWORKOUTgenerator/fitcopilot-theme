import { useEffect, useState } from 'react';

/**
 * Hook to detect if the user prefers reduced motion
 * 
 * This hook checks the user's system preference for reduced motion
 * and listens for changes to that preference.
 * 
 * @returns Boolean indicating if reduced motion is preferred
 */
export const useReducedMotion = (): boolean => {
  // Initialize with current system preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    // Default to false if window is not available (SSR)
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);

    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Add event listener with compatibility for older browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }

    // Cleanup function to remove listener
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return prefersReducedMotion;
};

export default useReducedMotion; 
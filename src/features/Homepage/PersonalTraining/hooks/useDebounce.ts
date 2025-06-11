import { useEffect, useState } from 'react';

/**
 * Custom hook to debounce loading states
 * Prevents loading flicker for quick data loads
 * 
 * @param value - The loading state value to debounce
 * @param delay - Delay in milliseconds (default: 300ms)
 * @returns Debounced loading state
 */
export const useDebounce = <T>(value: T, delay: number = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // If loading is false (data loaded quickly), don't show loading state
    if (!value) {
      setDebouncedValue(value);
      return;
    }

    // If loading is true, show loading state after delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce; 
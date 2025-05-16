import { RefObject, useEffect, useState } from 'react';

interface IntersectionObserverOptions {
    /**
     * The element that is used as the viewport for checking visibility
     * of the target. Defaults to the browser viewport if not specified.
     */
    root?: Element | null;

    /**
     * Margin around the root. Can have values similar to the CSS margin property,
     * e.g. "10px 20px 30px 40px" (top, right, bottom, left).
     */
    rootMargin?: string;

    /**
     * A number or array of numbers between 0.0 and 1.0, indicating at what percentage
     * of the target's visibility the observer's callback should be executed.
     */
    threshold?: number | number[];

    /**
     * Whether to initially trigger the callback if the element is already visible
     * when the observer is initialized
     */
    triggerOnce?: boolean;
}

/**
 * Custom hook that tells you whether an element is visible in the viewport
 * using the Intersection Observer API.
 * 
 * @param elementRef - React ref for the element to observe
 * @param options - Intersection observer options
 * @returns A boolean indicating whether the element is in view
 */
function useIntersectionObserver<T extends Element>(
  elementRef: RefObject<T>,
  {
    root = null,
    rootMargin = '0px',
    threshold = 0.1,
    triggerOnce = false
  }: IntersectionObserverOptions = {}
): boolean {
  const [isInView, setIsInView] = useState<boolean>(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Handler function that gets called when intersection changes
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      const isElementInView = entry.isIntersecting;

      setIsInView(isElementInView);

      // If element is in view and we only want to trigger once, disconnect the observer
      if (isElementInView && triggerOnce) {
        observer.disconnect();
      }
    };

    // Create the observer instance
    const observer = new IntersectionObserver(handleIntersection, {
      root,
      rootMargin,
      threshold
    });

    // Start observing the element
    observer.observe(element);

    // Cleanup function
    return () => {
      if (element) {
        observer.unobserve(element);
      }
      observer.disconnect();
    };
  }, [elementRef, root, rootMargin, threshold, triggerOnce]);

  return isInView;
}

export default useIntersectionObserver; 
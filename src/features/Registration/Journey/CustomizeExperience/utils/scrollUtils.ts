/**
 * Utility functions for scrolling in the CustomizeExperience module
 * These are provided as helpers but don't forcibly prevent user scrolling
 */

/**
 * Get the height of fixed elements at the top of the page (e.g., headers, navigation)
 */
export const getFixedHeaderHeight = (): number => {
    // This could be calculated dynamically based on actual DOM elements
    // For now, assuming a fixed height - adjust as needed for your layout
    return 60;
};

/**
 * Calculate a dynamic offset based on element and viewport size
 * 
 * @param element Element to calculate offset for
 * @param minOffset Minimum offset (default: 20px)
 * @returns Calculated offset in pixels
 */
export const calculateDynamicOffset = (element: HTMLElement, minOffset = 20): number => {
    // Get viewport height
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    // Get element height
    const elementHeight = element.offsetHeight;

    // For tall elements (over 70% of viewport), use smaller offset to maximize visible content
    if (elementHeight > viewportHeight * 0.7) {
        return minOffset + getFixedHeaderHeight();
    }

    // For shorter elements, use larger offset (max 25% of viewport) to center them better
    const calculatedOffset = Math.min(viewportHeight * 0.25, 120);
    return Math.max(calculatedOffset, minOffset + getFixedHeaderHeight());
};

/**
 * Helper function to optionally scroll to an element when needed.
 * Uses auto behavior by default to avoid interfering with user scrolling.
 * 
 * @param elementId ID of the element to scroll to
 * @param offset Offset from the top in pixels
 * @param behavior Scroll behavior (default: auto)
 */
export const scrollToElement = (
    elementId: string,
    offset = 20,
    behavior: ScrollBehavior = 'auto'
): void => {
    try {
        const element = document.getElementById(elementId);
        if (!element) {
            console.warn(`Element with ID "${elementId}" not found`);
            return;
        }

        // Always respect user's reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const effectiveBehavior = prefersReducedMotion ? 'auto' : behavior;

        // Calculate dynamic offset based on element size
        const dynamicOffset = calculateDynamicOffset(element, offset);

        // Get element position
        const rect = element.getBoundingClientRect();
        const targetPosition = rect.top + window.pageYOffset - dynamicOffset;

        // Perform the scroll, but don't force it
        window.scrollTo({
            top: targetPosition,
            behavior: effectiveBehavior
        });
    } catch (error) {
        console.error('Error scrolling to element:', error);
    }
};

/**
 * Helper function to scroll to an accordion section
 * 
 * @param sectionId ID of the accordion section
 * @param offset Offset from the top in pixels
 */
export const scrollToAccordionSection = (sectionId: string, offset = 20): void => {
    scrollToElement(`accordion-section-${sectionId}`, offset);
};

/**
 * Check if an element is fully visible in the viewport
 * 
 * @param element The element to check
 * @returns True if element is fully visible
 */
export const isElementFullyVisible = (element: HTMLElement): boolean => {
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    return (
        rect.top >= 0 &&
        rect.bottom <= viewportHeight
    );
};

/**
 * Throttle a function to limit how often it can be called
 * 
 * @param func Function to throttle
 * @param limit Time limit in milliseconds
 * @returns Throttled function
 */
export const throttle = <T extends (...args: any[]) => any>(
    func: T,
    limit: number
): ((...args: Parameters<T>) => void) => {
    let lastCall = 0;

    return function (this: any, ...args: Parameters<T>) {
        const now = Date.now();
        if (now - lastCall >= limit) {
            lastCall = now;
            func.apply(this, args);
        }
    };
}; 
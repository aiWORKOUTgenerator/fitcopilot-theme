/**
 * Unified utility functions for scrolling in the Registration feature
 * These are provided as helpers but don't forcibly prevent user scrolling
 */

/**
 * Get the height of fixed elements at the top of the page (e.g., headers, navigation)
 * 
 * @returns Fixed header height in pixels
 */
export const getFixedHeaderHeight = (): number => {
    // This could be calculated dynamically based on actual DOM elements
    // For now, assuming a fixed height - adjust as needed for your layout
    return 60;
};

/**
 * Calculate an appropriate offset based on viewport size and element height
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

    // If element is taller than 70% of viewport, use a smaller offset
    // to maximize visible content
    if (elementHeight > viewportHeight * 0.7) {
        // Use minimum offset, plus header height
        return minOffset + getFixedHeaderHeight();
    }

    // Otherwise, center shorter elements more with a larger offset
    // But don't exceed 25% of viewport height
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
            logger.warn(`Element with ID "${elementId}" not found`);
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
        logger.error('Error scrolling to element:', error);
    }
};

/**
 * Helper function to scroll to a journey step card
 *
 * @param stepIndex Index of the step to scroll to
 * @param offset Optional offset from the top of the step (in pixels)
 */
export const scrollToJourneyStep = (stepIndex: number, offset = 20): void => {
    scrollToElement(`journey-step-${stepIndex}`, offset);
};

/**
 * Helper function to scroll to expanded content within a step
 *
 * @param stepIndex Index of the step containing the content
 * @param offset Optional offset from the top of the content (in pixels)
 */
export const scrollToExpandedContent = (stepIndex: number, offset = 20): void => {
    scrollToElement(`step-content-${stepIndex}`, offset);
};

/**
 * Helper function to scroll to a specific accordion section
 * 
 * @param sectionId ID of the accordion section
 * @param offset Optional offset from the top of the section (in pixels)
 */
export const scrollToAccordionSection = (sectionId: string, offset = 20): void => {
    scrollToElement(`accordion-section-${sectionId}`, offset);
};

/**
 * Adjusts scroll position after content expands to ensure new content is visible
 * 
 * @param elementId ID of the expanded container element
 * @param expandedContentSelector CSS selector for the expanded content inside the container
 * @param offset Optional offset from the top (in pixels)
 */
export const adjustScrollAfterExpand = (
    elementId: string,
    expandedContentSelector = '.expanded-content',
    offset = 20
): void => {
    try {
        const container = document.getElementById(elementId);
        if (!container) return;

        // Find the expanded content inside the container
        const expandedContent = container.querySelector(expandedContentSelector);
        if (!expandedContent) return;

        // Check if the bottom of the expanded content is in view
        const expandedRect = expandedContent.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

        // If the expanded content extends below the viewport
        if (expandedRect.bottom > viewportHeight) {
            // Calculate how much additional scroll is needed
            const additionalScroll = Math.min(
                expandedRect.bottom - viewportHeight + offset,
                expandedRect.height / 2 // Don't scroll more than half the expanded height
            );

            // Apply the additional scroll with a short delay to allow any transitions to complete
            setTimeout(() => {
                window.scrollBy({
                    top: additionalScroll,
                    behavior: 'smooth'
                });
            }, 300);
        }
    } catch (error) {
        logger.error('Error adjusting scroll after expand:', error);
    }
};

/**
 * Determine if an element is in the viewport
 *
 * @param element The element to check
 * @param offset Optional offset from top and bottom of viewport
 * @returns True if the element is in the viewport
 */
export const isElementInViewport = (element: HTMLElement, offset = 100): boolean => {
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;

    return (
        rect.top >= -offset &&
        rect.left >= 0 &&
        rect.bottom <= (viewportHeight + offset) &&
        rect.right <= viewportWidth
    );
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
 * Ensure an expanded dropdown's content is visible by scrolling if needed
 * 
 * @param dropdownId ID of the dropdown container
 * @param contentSelector CSS selector for the dropdown content
 */
export const ensureDropdownContentVisible = (
    dropdownId: string,
    contentSelector = '.dropdown-content'
): void => {
    try {
        const dropdown = document.getElementById(dropdownId);
        if (!dropdown) return;

        const content = dropdown.querySelector(contentSelector);
        if (!content) return;

        // Get content position
        const rect = content.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

        // If content is larger than viewport, scroll to top of dropdown with offset
        if (rect.height > viewportHeight * 0.7) {
            scrollToElement(dropdownId, getFixedHeaderHeight() + 20);
            return;
        }

        // If bottom of content is below viewport
        if (rect.bottom > viewportHeight) {
            // Calculate how much we need to scroll
            const scrollAmount = rect.bottom - viewportHeight + 40; // 40px extra padding

            window.scrollBy({
                top: scrollAmount,
                behavior: 'smooth'
            });
        }
    } catch (error) {
        logger.error('Error ensuring dropdown content visibility:', error);
    }
};

/**
 * Throttle function to limit the rate at which a function can fire
 * Improved implementation combining both previous versions
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
    let inThrottle = false;

    return function (this: any, ...args: Parameters<T>) {
        const now = Date.now();

        // Use time-based throttling as primary mechanism (from CustomizeExperience)
        if (now - lastCall >= limit) {
            lastCall = now;
            func.apply(this, args);
            inThrottle = false;
        } else if (!inThrottle) {
            // Fallback to simpler throttling (from Journey) when needed
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
            }, limit - (now - lastCall));
        }
    };
}; 
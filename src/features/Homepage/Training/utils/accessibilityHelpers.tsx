/**
 * Accessibility Helper Utilities
 * 
 * Provides comprehensive utility functions for accessibility implementation
 */

import React from 'react';

/**
 * Creates a unique ID for ARIA attributes
 * 
 * @param prefix - The prefix for the ID
 * @param uniqueKey - A unique identifier (e.g., item index or name)
 * @returns A unique ID string
 */
export const createAriaId = (prefix: string, uniqueKey: string | number): string => {
    // Convert to string and remove spaces/special characters
    const sanitizedKey = String(uniqueKey).toLowerCase().replace(/[^a-z0-9]/g, '-');
    return `${prefix}-${sanitizedKey}`;
};

/**
 * Generates all necessary ARIA IDs for a program
 * 
 * @param programIndex - The index of the program in the list
 * @param programType - The type of the program
 * @returns Object containing all ARIA IDs for the program
 */
export const generateProgramAriaIds = (programIndex: number, programType: string): {
    cardId: string;
    titleId: string;
    contentId: string;
    benefitsId: string;
    descriptionId: string;
    controlsId: string;
} => {
    const baseId = `program-${programIndex}-${programType}`;

    return {
        cardId: `${baseId}-card`,
        titleId: `${baseId}-title`,
        contentId: `${baseId}-content`,
        benefitsId: `${baseId}-benefits`,
        descriptionId: `${baseId}-description`,
        controlsId: `${baseId}-controls`
    };
};

/**
 * Keyboard accessibility handler for interactive elements
 * 
 * @param callback - The function to call when interaction is triggered
 * @returns A keyboard event handler function
 */
export const createKeyboardHandler = (
    callback: () => void
): React.KeyboardEventHandler => {
    return (event: React.KeyboardEvent) => {
        // Trigger on Enter or Space key
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            callback();
        }
    };
};

/**
 * Creates ARIA props for interactive elements
 * 
 * @param isInteractive Whether the element is interactive
 * @param isExpanded Whether content controlled by this element is expanded
 * @param controlsId ID of element controlled by this element
 * @param labelledById ID of element that labels this element
 * @returns ARIA properties object
 */
export const createAriaProps = ({
    isInteractive = false,
    isExpanded = false,
    controlsId = '',
    labelledById = '',
    describedById = '',
    label = '',
    role = ''
}: {
    isInteractive?: boolean;
    isExpanded?: boolean;
    controlsId?: string;
    labelledById?: string;
    describedById?: string;
    label?: string;
    role?: string;
}): Record<string, string | boolean | number> => {
    const props: Record<string, string | boolean | number> = {};

    if (isInteractive) {
        props.tabIndex = 0;

        if (role) {
            props.role = role;
        } else {
            props.role = 'button';
        }
    }

    if (isExpanded !== undefined) {
        props['aria-expanded'] = isExpanded;
    }

    if (controlsId) {
        props['aria-controls'] = controlsId;
    }

    if (labelledById) {
        props['aria-labelledby'] = labelledById;
    }

    if (describedById) {
        props['aria-describedby'] = describedById;
    }

    if (label) {
        props['aria-label'] = label;
    }

    return props;
};

/**
 * Create focus trap props for modal-like elements
 * 
 * @param isActive Whether the focus trap is active
 * @returns Props for focus trapping
 */
export const createFocusTrapProps = (isActive: boolean): Record<string, boolean | string | number> => {
    if (!isActive) return {};

    return {
        'data-focus-trap': 'true',
        'tabIndex': -1,
        'aria-modal': true
    };
};

/**
 * Handle focus management for expandable/collapsible elements
 * 
 * @param isExpanded Whether the element is expanded
 * @param elementRef React ref to the element to focus
 */
export const manageFocus = (isExpanded: boolean, elementRef: React.RefObject<HTMLElement>): void => {
    if (isExpanded && elementRef.current) {
        // Focus after a brief delay to allow for DOM updates/animations
        setTimeout(() => {
            elementRef.current?.focus();
        }, 50);
    }
};

/**
 * Create props for live regions (areas that update dynamically)
 * 
 * @param isLive Whether the region is live
 * @param politeness The politeness level (assertive for important updates, polite for less critical)
 * @param atomic Whether the entire region should be announced as a whole
 * @returns ARIA live region props
 */
export const createLiveRegionProps = (
    isLive: boolean = true,
    politeness: 'assertive' | 'polite' = 'polite',
    atomic: boolean = false
): Record<string, string | boolean> => {
    if (!isLive) return {};

    return {
        'aria-live': politeness,
        'aria-atomic': atomic,
        'role': politeness === 'assertive' ? 'alert' : 'status'
    };
};

/**
 * Generate props for a list of items (for proper screen reader announcement)
 * 
 * @param itemCount Number of items in the list
 * @param listLabel Accessible label for the list
 * @returns ARIA props for list element
 */
export const createListProps = (
    itemCount: number,
    listLabel: string
): Record<string, string | number> => {
    return {
        'role': 'list',
        'aria-label': listLabel,
        'aria-count': itemCount
    };
};

/**
 * Generate props for a list item
 * 
 * @param index Item position in the list (0-based)
 * @param totalItems Total number of items in the list
 * @param itemLabel Optional label for the item
 * @returns ARIA props for list item
 */
export const createListItemProps = (
    index: number,
    totalItems: number,
    itemLabel?: string
): Record<string, string | number> => {
    const props: Record<string, string | number> = {
        'role': 'listitem',
        'aria-posinset': index + 1,
        'aria-setsize': totalItems
    };

    if (itemLabel) {
        props['aria-label'] = itemLabel;
    }

    return props;
};

/**
 * Generate accessible announcement for screen readers
 * 
 * @param message The message to announce
 * @param politeness The politeness level
 * @returns JSX element for screen reader announcement
 */
export const screenReaderAnnouncement = (
    message: string,
    politeness: 'assertive' | 'polite' = 'polite'
): JSX.Element => {
    return (
        <div
            className="sr-only"
            aria-live={politeness}
            aria-atomic="true"
        >
            {message}
        </div>
    );
}; 
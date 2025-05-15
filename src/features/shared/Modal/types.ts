/**
 * Modal component type definitions
 */

import React from 'react';

/**
 * Modal size options
 */
export type ModalSize = 'small' | 'medium' | 'large' | 'full';

/**
 * Modal component props
 */
export interface ModalProps {
    /**
     * Whether the modal is open
     */
    isOpen: boolean;
    
    /**
     * Callback for when the modal is closed
     */
    onClose: () => void;
    
    /**
     * Modal title
     */
    title?: string;
    
    /**
     * Modal content
     */
    children: React.ReactNode;
    
    /**
     * Additional CSS classes
     */
    className?: string;
    
    /**
     * Modal size
     * @default 'medium'
     */
    size?: ModalSize;
    
    /**
     * Whether to close the modal when Escape key is pressed
     * @default true
     */
    closeOnEsc?: boolean;
    
    /**
     * Whether to close the modal when the backdrop is clicked
     * @default true
     */
    closeOnBackdropClick?: boolean;
    
    /**
     * Whether to show the close button in the modal header
     * @default true
     */
    showCloseButton?: boolean;
    
    /**
     * ID of the element that labels the modal dialog
     */
    'aria-labelledby'?: string;
    
    /**
     * ID of the element that describes the modal dialog
     */
    'aria-describedby'?: string;
    
    /**
     * Ref to the element that should receive focus when the modal opens
     */
    initialFocusRef?: React.RefObject<HTMLElement>;
    
    /**
     * Ref to the element that should receive focus when the modal closes
     */
    returnFocusRef?: React.RefObject<HTMLElement>;
    
    /**
     * Data test ID for testing
     */
    'data-testid'?: string;
} 
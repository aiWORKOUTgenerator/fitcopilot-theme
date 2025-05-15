/**
 * Form component type definitions
 */

import React from 'react';

/**
 * Form component props
 */
export interface FormProps {
    /**
     * Form submit handler
     */
    onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;

    /**
     * Form children
     */
    children: React.ReactNode;

    /**
     * Additional CSS classes
     */
    className?: string;

    /**
     * Form ID
     */
    id?: string;

    /**
     * Whether to disable built-in form validation
     * @default true
     */
    noValidate?: boolean;

    /**
     * Form autocomplete behavior
     * @default 'on'
     */
    autoComplete?: 'on' | 'off';

    /**
     * Form action URL
     * @default '#'
     */
    action?: string;

    /**
     * Form submission method
     * @default 'post'
     */
    method?: 'get' | 'post';

    /**
     * Form encoding type
     */
    encType?: 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain';

    /**
     * Accessible label for the form
     */
    ariaLabel?: string;

    /**
     * Data test ID for testing
     */
    'data-testid'?: string;
} 
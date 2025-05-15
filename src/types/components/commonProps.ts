/**
 * Common Component Props
 * 
 * Reusable prop interfaces for consistent component development.
 * These interfaces can be extended to create component-specific props.
 */

import React from 'react';
import { ExtendedCSSProperties } from './cssTypes';

/**
 * Base props that most components should include
 */
export interface BaseComponentProps {
    /** Unique identifier for the component */
    id?: string;
    /** Additional class names to apply to the component */
    className?: string;
    /** Custom styles to apply to the component */
    style?: ExtendedCSSProperties;
    /** ARIA label for accessibility */
    ariaLabel?: string;
    /** Data attributes for testing */
    'data-testid'?: string;
}

/**
 * Props for components that contain children
 */
export interface WithChildrenProps {
    /** Content to render inside the component */
    children?: React.ReactNode;
}

/**
 * Base props for components that can be disabled
 */
export interface DisableableProps {
    /** Whether the component is disabled */
    disabled?: boolean;
}

/**
 * Base props for components that can be selected
 */
export interface SelectableProps {
    /** Whether the component is selected */
    selected?: boolean;
    /** Callback when selection state changes */
    onSelectionChange?: (selected: boolean) => void;
}

/**
 * Base props for components that can be loaded
 */
export interface LoadableProps {
    /** Whether the component is in a loading state */
    loading?: boolean;
}

/**
 * Base props for components that can show an error state
 */
export interface ErrorableProps {
    /** Whether the component is in an error state */
    error?: boolean;
    /** Error message to display */
    errorMessage?: string;
}

/**
 * Base props for components with size variants
 */
export interface SizeVariantProps {
    /** Size variant of the component */
    size?: 'small' | 'medium' | 'large';
}

/**
 * Base props for components with variant styles
 */
export interface StyleVariantProps {
    /** Style variant of the component */
    variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost';
}

/**
 * Base props for interactive components (like buttons)
 */
export interface InteractiveComponentProps extends BaseComponentProps, DisableableProps, LoadableProps {
    /** Whether the component should be visually highlighted */
    active?: boolean;
    /** Handler for click events */
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

/**
 * Base props for form control components (like inputs)
 */
export interface FormControlProps extends BaseComponentProps, DisableableProps, ErrorableProps {
    /** Name attribute for the form control */
    name?: string;
    /** Label to display with the form control */
    label?: string;
    /** Helper text to display with the form control */
    helperText?: string;
    /** Whether the form control is required */
    required?: boolean;
    /** Whether the form control is readonly */
    readOnly?: boolean;
    /** Control ref */
    ref?: React.Ref<HTMLElement>;
}

/**
 * Base props for components that follow a discriminated union pattern with 'variant'
 */
export interface BaseVariantProps<V extends string> extends BaseComponentProps, WithChildrenProps {
    /** The variant of the component, used as a discriminator */
    variant: V;
}

/**
 * Base props for components that follow a discriminated union pattern with 'type'
 */
export interface BaseTypeProps<T extends string> extends BaseComponentProps, WithChildrenProps {
    /** The type of the component, used as a discriminator */
    type: T;
}

/**
 * Utility type for combining various base props
 * @example
 * type CardProps = CombineProps<BaseComponentProps, WithChildrenProps, { title: string }>;
 */
export type CombineProps<A, B = {}, C = {}, D = {}, E = {}> = A & B & C & D & E; 
/**
 * Button Component Types
 * 
 * Type definitions for the Button component using the discriminated union pattern
 * and base component props for consistent typing.
 */

import { ButtonClickHandler } from '../../events';
import {
  BaseComponentProps,
  DisableableProps,
  LoadableProps,
  SizeVariantProps,
  WithChildrenProps
} from '../commonProps';

// ===== Base Button Props =====

/**
 * Base properties for all Button variants
 */
export interface BaseButtonProps extends
    BaseComponentProps,
    DisableableProps,
    LoadableProps,
    WithChildrenProps,
    SizeVariantProps {

    /** Button text */
    label?: string;

    /** Icon to display in the button */
    icon?: React.ReactNode;

    /** Click event handler */
    onClick?: ButtonClickHandler;

    /** Whether the button should occupy the full width of its container */
    fullWidth?: boolean;

    /** Whether the button should have a loading indicator */
    loading?: boolean;

    /** ARIA role override (default is 'button') */
    role?: string;

    /** Button type attribute */
    type?: 'button' | 'submit' | 'reset';
}

// ===== Button Variants =====

/**
 * Primary Button Props - Used for main calls to action
 */
export interface PrimaryButtonProps extends BaseButtonProps {
    /** Button variant discriminator */
    variant: 'primary';

    /** Optional accent color override */
    accentColor?: string;
}

/**
 * Secondary Button Props - Used for secondary actions
 */
export interface SecondaryButtonProps extends BaseButtonProps {
    /** Button variant discriminator */
    variant: 'secondary';

    /** Whether to use an outline style */
    outline?: boolean;
}

/**
 * Tertiary Button Props - Used for non-essential actions
 */
export interface TertiaryButtonProps extends BaseButtonProps {
    /** Button variant discriminator */
    variant: 'tertiary';
}

/**
 * Text Button Props - Used for subtle actions
 */
export interface TextButtonProps extends BaseButtonProps {
    /** Button variant discriminator */
    variant: 'text';

    /** Whether to underline the text */
    underline?: boolean;
}

/**
 * Icon Button Props - Used for icon-only buttons
 */
export interface IconButtonProps extends BaseButtonProps {
    /** Button variant discriminator */
    variant: 'icon';

    /** Icon is required for icon buttons */
    icon: React.ReactNode;

    /** Optional text for accessibility (visually hidden) */
    accessibilityLabel: string;
}

// ===== Combined Button Type =====

/**
 * Combined Button type using discriminated union pattern with 'variant' as discriminator
 */
export type ButtonProps =
    | PrimaryButtonProps
    | SecondaryButtonProps
    | TertiaryButtonProps
    | TextButtonProps
    | IconButtonProps;

// ===== Type Guards =====

/**
 * Type guard for Primary button variant
 */
export function isPrimaryButton(props: ButtonProps): props is PrimaryButtonProps {
  return props.variant === 'primary';
}

/**
 * Type guard for Secondary button variant
 */
export function isSecondaryButton(props: ButtonProps): props is SecondaryButtonProps {
  return props.variant === 'secondary';
}

/**
 * Type guard for Tertiary button variant
 */
export function isTertiaryButton(props: ButtonProps): props is TertiaryButtonProps {
  return props.variant === 'tertiary';
}

/**
 * Type guard for Text button variant
 */
export function isTextButton(props: ButtonProps): props is TextButtonProps {
  return props.variant === 'text';
}

/**
 * Type guard for Icon button variant
 */
export function isIconButton(props: ButtonProps): props is IconButtonProps {
  return props.variant === 'icon';
} 
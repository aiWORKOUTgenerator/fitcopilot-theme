import React from 'react';
import { ButtonBaseProps } from '../../../../features/shared/Button/types/standardButtonTypes';

/**
 * Registration button size options
 * Matches the standard ButtonSize but redefined for clarity
 */
export type RegistrationButtonSize = 'small' | 'medium' | 'large';

/**
 * Registration button variant options
 * Extends beyond standard button variants with registration-specific styling
 */
export type RegistrationButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'link';

/**
 * Base props for RegistrationButton that extends ButtonBaseProps
 * but excludes props that need custom handling
 */
type BaseRegistrationButtonProps = Omit<
  ButtonBaseProps, 
  'variant' | 'leftIcon' | 'rightIcon' | 'fullWidth'
> & {
    /**
   * Button size variant
     * @default 'medium'
   * @example
   * <RegistrationButton size="large">Large Button</RegistrationButton>
     */
  size?: RegistrationButtonSize;

    /**
     * Whether the button is in loading state
   * Shows loading animation and disables interaction
     * @default false
   * @example
   * <RegistrationButton isLoading={true}>Processing...</RegistrationButton>
     */
    isLoading?: boolean;

    /**
     * Optional icon to display after text
   * Can be any React node (SVG, component, etc.)
   * @example
   * <RegistrationButton rightIcon={<ArrowRight />}>Continue</RegistrationButton>
     */
    rightIcon?: React.ReactNode;

    /**
     * Optional icon to display before text
   * Can be any React node (SVG, component, etc.)
   * @example
   * <RegistrationButton leftIcon={<ArrowLeft />}>Back</RegistrationButton>
     */
    leftIcon?: React.ReactNode;

    /**
     * Make button take full width of container
     * @default false
   * @example
   * <RegistrationButton fullWidth>Full Width Button</RegistrationButton>
     */
    fullWidth?: boolean;
};

/**
 * Props for primary registration button variant
 * Primary buttons use the main brand gradient and are for primary actions
 */
export type PrimaryRegistrationButtonProps = BaseRegistrationButtonProps & {
  /**
   * Primary variant for main call-to-action buttons
   */
    variant: 'primary';
};

/**
 * Props for secondary registration button variant
 * Secondary buttons are for secondary actions with outline styling
 */
export type SecondaryRegistrationButtonProps = BaseRegistrationButtonProps & {
  /**
   * Secondary variant for secondary actions
   */
    variant: 'secondary';
};

/**
 * Props for link registration button variant
 * Requires href and supports new tab functionality
 */
export type LinkRegistrationButtonProps = BaseRegistrationButtonProps & {
  /**
   * Link variant renders as an anchor element
   */
    variant: 'link';
  
  /**
   * URL the button should navigate to
   * @example "https://example.com" or "/relative-path"
   */
    href: string;
  
  /**
   * Whether to open link in new tab
   * @default false
   * @example
   * <RegistrationButton variant="link" href="https://example.com" openInNewTab>
   *   External Link
   * </RegistrationButton>
   */
    openInNewTab?: boolean;
};

/**
 * Props for tertiary registration button variant
 * Styled as secondary but with custom registration theming
 */
export type TertiaryRegistrationButtonProps = BaseRegistrationButtonProps & {
  /**
   * Tertiary variant for subtle actions
   */
    variant: 'tertiary';
};

/**
 * Union type of all possible RegistrationButton props
 * Provides type safety and proper variant-specific prop requirements
 * 
 * @example
 * // Primary button
 * <RegistrationButton variant="primary">Submit</RegistrationButton>
 * 
 * // Link button with required href
 * <RegistrationButton variant="link" href="/signup">Sign Up</RegistrationButton>
 * 
 * // Loading button
 * <RegistrationButton variant="primary" isLoading>Processing...</RegistrationButton>
 */
export type RegistrationButtonProps =
    | PrimaryRegistrationButtonProps
    | SecondaryRegistrationButtonProps
    | LinkRegistrationButtonProps
    | TertiaryRegistrationButtonProps; 

/**
 * Type guard to check if RegistrationButton is in link variant
 * 
 * @param props - RegistrationButton properties to check
 * @returns True if the props are for a link button
 * @example
 * if (isRegistrationLinkButton(props)) {
 *   // props.href is now available and typed as string
 *   console.log(props.href);
 * }
 */
export const isRegistrationLinkButton = (
  props: RegistrationButtonProps
): props is LinkRegistrationButtonProps => {
  return props.variant === 'link';
};

/**
 * Type guard to check if RegistrationButton has loading state
 * 
 * @param props - RegistrationButton properties to check
 * @returns True if the button is in loading state
 * @example
 * if (isRegistrationButtonLoading(props)) {
 *   // Button should show loading animation
 *   return <LoadingSpinner />;
 * }
 */
export const isRegistrationButtonLoading = (
  props: RegistrationButtonProps
): boolean => {
  return Boolean(props.isLoading);
};

/**
 * Type guard to check if RegistrationButton has icons
 * 
 * @param props - RegistrationButton properties to check
 * @returns True if the button has left or right icons
 * @example
 * if (hasRegistrationButtonIcons(props)) {
 *   // Apply icon-specific styling
 *   className += ' has-icons';
 * }
 */
export const hasRegistrationButtonIcons = (
  props: RegistrationButtonProps
): boolean => {
  return Boolean(props.leftIcon || props.rightIcon);
};

/**
 * Type guard to check if RegistrationButton is disabled
 * Considers both explicit disabled prop and loading state
 * 
 * @param props - RegistrationButton properties to check
 * @returns True if the button should be disabled
 * @example
 * if (isRegistrationButtonDisabled(props)) {
 *   // Prevent click handlers
 *   return;
 * }
 */
export const isRegistrationButtonDisabled = (
  props: RegistrationButtonProps
): boolean => {
  return Boolean(props.disabled || props.isLoading);
};

/**
 * Utility type for extracting variant-specific props
 * Useful for conditional rendering based on variant
 */
export type RegistrationButtonVariantProps<T extends RegistrationButtonVariant> = 
  T extends 'primary' ? PrimaryRegistrationButtonProps :
  T extends 'secondary' ? SecondaryRegistrationButtonProps :
  T extends 'tertiary' ? TertiaryRegistrationButtonProps :
  T extends 'link' ? LinkRegistrationButtonProps :
  never;

/**
 * Props that are safe to pass to the base Button component
 * Excludes registration-specific props that need custom handling
 */
export type ButtonCompatibleProps = Omit<
  ButtonBaseProps,
  'leftIcon' | 'rightIcon' | 'fullWidth' | 'variant'
>; 
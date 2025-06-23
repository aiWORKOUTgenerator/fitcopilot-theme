import classNames from 'classnames';
import React from 'react';
import { Button } from '../../../../features/shared/Button';
import './RegistrationButton.scss';
import {
  ButtonCompatibleProps,
  LinkRegistrationButtonProps,
  RegistrationButtonProps
} from './types';

/**
 * Registration button component for standardized button styling
 * throughout the registration flow
 * 
 * @component
 * @example
 * // Primary button
 * <RegistrationButton variant="primary" onClick={handleSubmit}>
 *   Submit
 * </RegistrationButton>
 * 
 * @example
 * // Loading button with icon
 * <RegistrationButton 
 *   variant="primary" 
 *   isLoading={isSubmitting}
 *   rightIcon={<ArrowRight />}
 * >
 *   Processing...
 * </RegistrationButton>
 * 
 * @example
 * // Link button
 * <RegistrationButton 
 *   variant="link" 
 *   href="/signup"
 *   openInNewTab
 * >
 *   Sign Up
 * </RegistrationButton>
 * 
 * @param props - RegistrationButton properties
 * @returns React component
 */
const RegistrationButton: React.FC<RegistrationButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  rightIcon,
  leftIcon,
  className,
  fullWidth = false,
  ...restProps
}): JSX.Element => {
  // Combine class names based on props
  const buttonClasses = classNames(
    'registration-button',
    {
      'registration-button--full-width': fullWidth,
    },
    className
  );

  /**
   * Filter out registration-specific props that shouldn't be passed to base Button
   * Uses proper typing to ensure type safety
   */
  const filteredProps = React.useMemo((): ButtonCompatibleProps => {
    // Extract registration-specific props from restProps
    const {
      isLoading: _isLoading,
      rightIcon: _rightIcon,
      leftIcon: _leftIcon,
      fullWidth: _fullWidth,
      // For link variant, also exclude link-specific props
      href: _href,
      openInNewTab: _openInNewTab,
      ...buttonCompatibleProps
    } = restProps as any;

    return buttonCompatibleProps;
  }, [restProps, variant]);

  /**
   * Create base props that are compatible with the Button component
   * Handles proper prop filtering and type safety
   */
  const baseProps = React.useMemo(() => ({
    type,
    size,
    className: buttonClasses,
    onClick,
    disabled: disabled || isLoading,
    fullWidth: false, // Handle fullWidth styling via our CSS classes
    ...(variant === 'tertiary' ? { 'data-variant': 'tertiary' as const } : {}),
    ...filteredProps,
  }), [type, size, buttonClasses, onClick, disabled, isLoading, variant, filteredProps]);

  /**
   * Create the button content with loading state handling
   * Renders different content based on loading state and icons
   * 
   * @returns JSX element containing button content
   */
  const renderButtonContent = React.useCallback((): JSX.Element => {
    if (isLoading) {
      return (
        <span className="registration-button__loading">
          <span className="registration-button__loading-text">Processing</span>
          <span className="registration-button__loading-dots"></span>
        </span>
      );
    }

    return (
      <>
        {leftIcon && (
          <span className="registration-button__icon registration-button__icon--left">
            {leftIcon}
          </span>
        )}
        <span className="registration-button__text">{children}</span>
        {rightIcon && (
          <span className="registration-button__icon registration-button__icon--right">
            {rightIcon}
          </span>
        )}
      </>
    );
  }, [isLoading, leftIcon, children, rightIcon]);

  /**
   * Handle link variant with proper prop extraction and type safety
   * Uses type guard to ensure href is available
   */
  if (variant === 'link') {
    // Type-safe extraction of link-specific props
    const linkProps = restProps as Pick<LinkRegistrationButtonProps, 'href' | 'openInNewTab'>;
    const { href, openInNewTab } = linkProps;
    
    return (
      <Button
        {...baseProps}
        variant="link"
        href={href}
        target={openInNewTab ? '_blank' : undefined}
        rel={openInNewTab ? 'noopener noreferrer' : undefined}
      >
        {renderButtonContent()}
      </Button>
    );
  }

  /**
   * Map registration variants to base Button variants
   * Provides type-safe variant mapping
   * 
   * @returns Base button variant string
   */
  const getButtonVariant = React.useCallback((): 'primary' | 'secondary' => {
    switch (variant) {
    case 'primary':
      return 'primary';
    case 'secondary':
      return 'secondary';
    case 'tertiary':
      return 'secondary'; // Use secondary for tertiary with custom styling
    default:
      // This should never happen due to TypeScript, but provides fallback
      return 'primary';
    }
  }, [variant]);

  return (
    <Button
      {...baseProps}
      variant={getButtonVariant()}
    >
      {renderButtonContent()}
    </Button>
  );
};

/**
 * Display name for debugging and React DevTools
 */
RegistrationButton.displayName = 'RegistrationButton';

export default RegistrationButton; 
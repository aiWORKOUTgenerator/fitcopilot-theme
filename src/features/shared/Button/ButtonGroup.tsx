/**
 * ButtonGroup Component
 * A container for grouping related buttons together with proper spacing and alignment
 */

import React from 'react';

export interface ButtonGroupProps {
    /** The buttons to render in the group */
    children: React.ReactNode;
    /** Layout direction */
    direction?: 'horizontal' | 'vertical';
    /** Spacing between buttons */
    spacing?: 'none' | 'small' | 'medium' | 'large';
    /** Alignment of buttons */
    alignment?: 'start' | 'center' | 'end' | 'stretch';
    /** Additional CSS class names */
    className?: string;
    /** Whether all buttons should be the same size */
    equalWidth?: boolean;
    /** ARIA attributes */
    'aria-label'?: string;
    /** Data attributes for testing/tracking */
    'data-testid'?: string;
}

/**
 * ButtonGroup component for grouping buttons with proper spacing and alignment
 */
export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  direction = 'horizontal',
  spacing = 'medium',
  alignment = 'start',
  className = '',
  equalWidth = false,
  'aria-label': ariaLabel,
  'data-testid': dataTestId,
}) => {
  // Generate CSS classes
  const groupClasses = [
    'button-group',
    `button-group--${direction}`,
    `button-group--spacing-${spacing}`,
    `button-group--align-${alignment}`,
    equalWidth ? 'button-group--equal-width' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={groupClasses}
      role="group"
      aria-label={ariaLabel}
      data-testid={dataTestId}
    >
      {children}
    </div>
  );
};

export default ButtonGroup; 
/**
 * ButtonGroup Component
 * A container for grouping related buttons together with proper spacing and alignment
 */

import React, { useEffect, useRef } from 'react';
import logger from '../../../../utils/logger';
import '../styles/ButtonGroup.scss';

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
    /** Enable responsive stacking on mobile */
    responsiveStacking?: boolean;
    /** ARIA attributes */
    'aria-label'?: string;
    /** Data attributes for testing/tracking */
    'data-testid'?: string;
    /** Whether to disable deprecation warnings */
    suppressWarnings?: boolean;
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
  responsiveStacking = false,
  suppressWarnings = false,
  'aria-label': ariaLabel,
  'data-testid': dataTestId,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Check for deprecated button classes
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' && !suppressWarnings) {
      const checkForDeprecatedClasses = () => {
        if (!containerRef.current) return;
        
        const deprecatedButtons = containerRef.current.querySelectorAll('.button');
        const genericButtons = containerRef.current.querySelectorAll('button:not(.btn)');
        
        if (deprecatedButtons.length > 0) {
          logger.warn(
            'ButtonGroup: Found .button class elements. This is deprecated - use .btn class instead. ' + 
            'Support for .button class will be removed in version 2.0.'
          );
          
          // Log more detailed information in development
          if (process.env.NODE_ENV === 'development') {
            logger.debug('Deprecated button elements:', deprecatedButtons);
          }
        }
        
        if (genericButtons.length > 0) {
          logger.warn(
            'ButtonGroup: Found generic button elements without .btn class. ' + 
            'This is deprecated - use .btn class instead. ' + 
            'Support for unclassed buttons will be removed in version 2.0.'
          );
          
          // Log more detailed information in development
          if (process.env.NODE_ENV === 'development') {
            logger.debug('Generic button elements:', genericButtons);
          }
        }
      };
      
      // Run check after mount and after any updates
      checkForDeprecatedClasses();
      
      // Use MutationObserver to check when children change
      const observer = new MutationObserver(mutations => {
        // Check for class changes or child list changes
        const shouldCheck = mutations.some(mutation => 
          mutation.type === 'childList' || 
          mutation.type === 'attributes' && 
          mutation.attributeName === 'class'
        );
        
        if (shouldCheck) {
          checkForDeprecatedClasses();
        }
      });
      
      if (containerRef.current) {
        observer.observe(containerRef.current, { 
          childList: true, 
          subtree: true,
          attributes: true,
          attributeFilter: ['class'] 
        });
      }
      
      return () => observer.disconnect();
    }
  }, [suppressWarnings]);

  // Generate CSS classes
  const groupClasses = [
    'button-group',
    `button-group--${direction}`,
    `button-group--spacing-${spacing}`,
    `button-group--align-${alignment}`,
    equalWidth ? 'button-group--equal-width' : '',
    responsiveStacking && direction === 'horizontal' ? 'button-group--responsive' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={containerRef}
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
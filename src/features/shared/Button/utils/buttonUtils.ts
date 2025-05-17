/**
 * Button Utilities
 * 
 * Helper functions for button components
 */

import classNames from 'classnames';
import { ButtonBaseProps } from '../types/standardButtonTypes';

/**
 * Get button class names based on props
 */
export const getButtonClassNames = (
  baseClass: string,
  props: ButtonBaseProps,
  additionalClasses: string = ''
): string => {
  const { variant, size, fullWidth, className } = props;
  
  return classNames(
    // Base class always applied
    baseClass,
    
    // Variant class
    variant && `${baseClass}-${variant}`,
    
    // Size class
    size && `${baseClass}--${size}`,
    
    // Full width class
    fullWidth && `${baseClass}--full-width`,
    
    // Additional classes provided by component
    additionalClasses,
    
    // User-provided className
    className
  );
};

/**
 * Get ARIA attributes for button
 */
export const getButtonAriaAttributes = (props: ButtonBaseProps): Record<string, string> => {
  const ariaAttributes: Record<string, string> = {};
  
  // Add aria-label if provided
  if (props['aria-label']) {
    ariaAttributes['aria-label'] = props['aria-label'];
  }
  
  // Add aria-pressed if provided
  if (props['aria-pressed'] !== undefined) {
    ariaAttributes['aria-pressed'] = String(props['aria-pressed']);
  }
  
  // Add aria-expanded if provided
  if (props['aria-expanded'] !== undefined) {
    ariaAttributes['aria-expanded'] = String(props['aria-expanded']);
  }
  
  // Add aria-controls if provided
  if (props['aria-controls']) {
    ariaAttributes['aria-controls'] = props['aria-controls'];
  }
  
  // Add aria-disabled for disabled buttons
  if (props.disabled) {
    ariaAttributes['aria-disabled'] = 'true';
  }
  
  return ariaAttributes;
};

/**
 * Get link-specific attributes for anchor buttons
 */
export const getLinkAttributes = (props: ButtonBaseProps): Record<string, string> => {
  const { href, target, rel } = props;
  const linkAttributes: Record<string, string> = {};
  
  // Add href
  if (href) {
    linkAttributes.href = href;
  }
  
  // Add target if provided
  if (target) {
    linkAttributes.target = target;
  }
  
  // Add rel if provided, or default for external links
  if (rel) {
    linkAttributes.rel = rel;
  } else if (target === '_blank') {
    linkAttributes.rel = 'noopener noreferrer';
  }
  
  return linkAttributes;
}; 
/**
 * Link Button Component
 * A button that behaves like a link while maintaining button styling
 */

import React, { forwardRef } from 'react';
import { LinkClickHandler } from '../../../types/events';
import { createLoggedEventHandler, warn } from '../../../utils/logger';
import { LinkButtonProps, isLinkButton } from './types';

/**
 * LinkButton Component
 * 
 * @example
 * <LinkButton 
 *   href="https://example.com" 
 *   openInNewTab={true}
 * >
 *   Visit Website
 * </LinkButton>
 */
const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>((props, ref) => {
  const {
    href,
    openInNewTab,
    rel: propRel,
    target: propTarget,
    children,
    onClick,
    className = '',
    ...restProps
  } = props;

  // Determine target and rel attributes
  const target = propTarget || (openInNewTab ? '_blank' : undefined);

  // Security: Add noopener and noreferrer for _blank targets
  const rel = target === '_blank'
    ? `${propRel || ''} noopener noreferrer`.trim()
    : propRel;

  // Handle click event with logging
  const handleClick: LinkClickHandler = (event) => {
    // We can't directly use ButtonClickHandler here because we're using an anchor,
    // but we can implement the same pattern manually
    if (onClick) {
      // Cast the event to work with our onClick handler
      // This is safe because we control both types
      const buttonEvent = event as unknown as React.MouseEvent<HTMLButtonElement>;
      onClick(buttonEvent);
    }
  };

  // Create logged event handler
  const loggedHandleClick = createLoggedEventHandler<HTMLAnchorElement, React.MouseEvent<HTMLAnchorElement>>(
    'LinkButton',
    'click',
    handleClick
  );

  // Determine classes
  const buttonClasses = [
    className,
    'link-button'
  ].filter(Boolean).join(' ');

  return (
    <a
      href={href}
      className={buttonClasses}
      onClick={loggedHandleClick}
      target={target}
      rel={rel}
      role="button"
      ref={ref}
      {...restProps}
    >
      {children}
    </a>
  );
});

LinkButton.displayName = 'LinkButton';

export default LinkButton;

/**
 * Type guard to ensure a component is a Link Button
 */
export const withLinkButton = <P extends LinkButtonProps>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  const WithLinkButton: React.FC<P> = (props: P) => {
    if (!isLinkButton(props)) {
      warn('Component expected LinkButtonProps but received incompatible props');
      return null;
    }

    return <Component {...props} />;
  };

  WithLinkButton.displayName = `WithLinkButton(${Component.displayName || Component.name || 'Component'})`;

  return WithLinkButton;
}; 
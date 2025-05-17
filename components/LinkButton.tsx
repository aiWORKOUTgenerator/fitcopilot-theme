/**
 * LinkButton Component
 * A variant of Button specifically for links
 */

import React from 'react';
import { LinkButtonProps } from '../types/buttonTypes';

/**
 * LinkButton component renders an anchor tag styled as a button
 * 
 * @param props - LinkButton properties
 * @returns React component
 */
const LinkButton: React.FC<LinkButtonProps> = (props) => {
  const {
    variant = 'link',
    href,
    target,
    rel,
    openInNewTab,
    children,
    className = '',
    'aria-label': ariaLabel,
    'data-testid': testId,
    ...rest
  } = props;

  // Determine final target and rel based on props
  const finalTarget = openInNewTab ? '_blank' : target;
  const finalRel = finalTarget === '_blank' ? (rel || 'noopener noreferrer') : rel;

  // Compose class names
  const classes = ['link-button', className].filter(Boolean).join(' ');

  return (
    <a
      href={href}
      target={finalTarget}
      rel={finalRel}
      className={classes}
      aria-label={ariaLabel}
      data-testid={testId}
      role="button"
      {...rest}
    >
      {children}
    </a>
  );
};

export default LinkButton; 
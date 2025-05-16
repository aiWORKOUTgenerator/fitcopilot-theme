import React from 'react';
import './Card.scss';

export type CardElevation = 'default' | 'elevated' | 'prominent';
export type CardPadding = 'default' | 'compact' | 'spacious';

export interface CardProps {
    /** Card content */
    children: React.ReactNode;
    /** Card elevation variant */
    elevation?: CardElevation;
    /** Card padding variant */
    padding?: CardPadding;
    /** Whether the card has a border */
    bordered?: boolean;
    /** Whether the card is interactive (clickable) */
    interactive?: boolean;
    /** Click handler for interactive cards */
    onClick?: () => void;
    /** Additional CSS classes */
    className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  elevation = 'default',
  padding = 'default',
  bordered = false,
  interactive = false,
  onClick,
  className = ''
}) => {
  // Build class names based on props
  const classNames = [
    'card',
    elevation !== 'default' && `card--${elevation}`,
    padding !== 'default' && `card--${padding}`,
    bordered && 'card--bordered',
    interactive && 'card--interactive',
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classNames}
      onClick={interactive ? onClick : undefined}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
    >
      {children}
    </div>
  );
};

// Subcomponents for structured content
export const CardHeader: React.FC<{ children: React.ReactNode, className?: string }> = ({
  children,
  className = ''
}) => (
  <div className={`card__header ${className}`}>{children}</div>
);

export const CardContent: React.FC<{ children: React.ReactNode, className?: string }> = ({
  children,
  className = ''
}) => (
  <div className={`card__content ${className}`}>{children}</div>
);

export const CardFooter: React.FC<{ children: React.ReactNode, className?: string }> = ({
  children,
  className = ''
}) => (
  <div className={`card__footer ${className}`}>{children}</div>
);

export default Card; 
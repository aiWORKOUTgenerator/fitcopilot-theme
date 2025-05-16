import { ChevronRight } from 'lucide-react';
import React, { memo, useCallback, useRef } from 'react';
import useReducedMotion from '../../hooks/useReducedMotion';
import { createAriaProps, manageFocus } from '../../utils/accessibilityHelpers';
import { ThemeableComponent, applyTheme, getProgramToken } from '../../utils/themeUtils';
import './ProgramCard.scss';
import { ProgramCardProps } from './types';

/**
 * ProgramCard theme configuration
 */
const programCardTheme: ThemeableComponent = {
  baseClass: 'program-card',
  tokenMappings: {
    base: { category: 'card', subcategory: 'background' },
    hover: { category: 'card', subcategory: 'hover' },
    active: { category: 'card', subcategory: 'active' },
    border: { category: 'border', subcategory: 'primary' },
    title: { category: 'text', subcategory: 'primary' },
    description: { category: 'text', subcategory: 'secondary' },
    icon: { category: 'highlight', subcategory: 'primary' }
  }
};

/**
 * ProgramCard component for displaying training program information
 * 
 * @param props Component props
 * @returns React component
 */
const ProgramCard: React.FC<ProgramCardProps> = ({
  program,
  isActive = false,
  onToggle,
  variant = 'default',
  className = '',
  ariaIds,
}) => {
  // Accessibility and motion preferences
  const prefersReducedMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);

  // Apply theme tokens
  const cardClasses = applyTheme(
    programCardTheme,
    variant,
    `${className} ${isActive ? 'program-card--active' : ''} ${prefersReducedMotion ? 'reduced-motion' : ''}`
  );

  // Setup keyboard handler for a11y - memoized for better performance
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onToggle();
    }
  }, [onToggle]);

  // Focus management
  React.useEffect(() => {
    if (isActive) {
      manageFocus(isActive, cardRef);
    }
  }, [isActive]);

  // Generate ARIA props
  const ariaProps = createAriaProps({
    isInteractive: true,
    isExpanded: isActive,
    controlsId: ariaIds?.contentId,
    role: 'button'
  });

  // Determine which classes to use based on programType or fall back to legacy props
  const iconGradientClass = program.programType
    ? getProgramToken(program.programType, 'gradient')
    : `bg-gradient-to-br ${program.accentColor || ''}`;

  const textColorClass = program.programType
    ? getProgramToken(program.programType, 'text')
    : program.textColor || '';

  return (
    <div
      ref={cardRef}
      className={cardClasses}
      onClick={onToggle}
      onKeyDown={handleKeyDown}
      id={ariaIds?.cardId}
      {...ariaProps}
    >
      <div className="program-card__container">
        {/* Program Icon */}
        <div className="program-card__icon-wrapper">
          <div
            className={`program-card__icon ${variant === 'default' ? iconGradientClass : ''}`}
            aria-hidden="true"
          >
            {program.icon}
          </div>
        </div>

        {/* Program Information */}
        <div className="program-card__content">
          <h3
            className={`program-card__title ${textColorClass}`}
            id={ariaIds?.titleId}
          >
            {program.title}
          </h3>
          <p
            className="program-card__description"
            id={ariaIds?.descriptionId}
          >
            {program.description}
          </p>
        </div>

        {/* Expand/Collapse Button */}
        {variant !== 'sports' && (
          <div
            className={`program-card__toggle ${isActive ? 'program-card__toggle--active' : ''}`}
            aria-hidden="true"
          >
            <ChevronRight
              size={20}
              aria-label={isActive ? "Collapse details" : "Expand details"}
            />
          </div>
        )}
      </div>

      {/* Screen reader text for expanded state */}
      <span className="sr-only">
        {isActive ? 'Details expanded. Press Enter to collapse.' : 'Details collapsed. Press Enter to expand.'}
      </span>
    </div>
  );
};

// Export memoized version for better performance
export default memo(ProgramCard); 
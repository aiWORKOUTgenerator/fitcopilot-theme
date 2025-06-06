import React from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { SectionHeaderProps } from '../types';

/**
 * SectionHeader - Displays the main heading and description for the Journey section
 * Uses centralized animation system for consistent animations
 */
const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  variant = 'default'
}) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="text-center mb-12 md:mb-16">
      {/* Main Title */}
      <h2 
        className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 journey-text-heading"
        data-theme={variant !== 'default' ? variant : undefined}
      >
        {title}
      </h2>
      
      {/* Description */}
      {description && (
        <p 
          className="text-lg md:text-xl journey-text-description max-w-3xl mx-auto text-center"
          style={{ marginLeft: 'auto', marginRight: 'auto', textAlign: 'center' }}
          data-theme={variant !== 'default' ? variant : undefined}
        >
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeader; 
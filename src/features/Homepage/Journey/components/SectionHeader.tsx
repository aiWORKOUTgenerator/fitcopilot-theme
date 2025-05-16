import React from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { SectionHeaderProps } from '../types';

/**
 * SectionHeader - Component for the main heading of the Journey section
 * Styled to match the PersonalTraining section header
 */
const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  variant
}) => {
  const prefersReducedMotion = useReducedMotion();

  // Default title with gradient styling similar to PersonalTraining
  const defaultTitle = (
    <>
      Your Fitness <span className="bg-gradient-to-r from-lime-300 to-emerald-400 text-transparent bg-clip-text">Journey</span>
    </>
  );

  return (
    <div
      className="text-center mb-16"
      data-aos={prefersReducedMotion ? undefined : 'fade-up'}
      data-theme={variant !== 'default' ? variant : undefined}
    >
      <span className="text-xs font-bold tracking-widest uppercase text-lime-300 mb-2 block">
        How It Works
      </span>

      <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
        {title || defaultTitle}
      </h2>

      <p className="text-gray-400 mx-auto">
        {description || "Four simple steps to transform your fitness routine with AI-powered workouts"}
      </p>
    </div>
  );
};

export default SectionHeader; 
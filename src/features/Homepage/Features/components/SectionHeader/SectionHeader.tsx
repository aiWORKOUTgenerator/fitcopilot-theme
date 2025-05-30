import React from 'react';
import { useAnimations } from '../../hooks';
import { SectionHeaderProps } from './types';

/**
 * SectionHeader component for the Features section
 * Provides a reusable header with label, title, highlighted text, and subtitle
 * 
 * @param props - SectionHeader component props
 * @returns JSX.Element - Rendered section header
 * 
 * @example
 * ```tsx
 * <SectionHeader
 *   label="Fitness Evolution"
 *   title="Innovative Features"
 *   highlightedText="Tailored for You"
 *   headingId="features-heading"
 *   variant="gym"
 * />
 * ```
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  highlightedText,
  label,
  subtitle,
  variant = 'default',
  className = '',
  style = {},
  headingLevel = 2,
  headingId,
  centered = true,
  highlightGradient = 'from-lime-300 to-emerald-400',
  animated = true,
  bottomSpacing = 'lg'
}) => {
  // Use animations hook for motion configuration
  const { shouldAnimate, getAnimationStyle } = useAnimations();

  // Generate heading tag based on level
  const HeadingTag = `h${headingLevel}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

  // Generate spacing classes
  const spacingClasses = {
    none: '',
    sm: 'mb-8',
    md: 'mb-12',
    lg: 'mb-16',
    xl: 'mb-20'
  };

  // Container classes
  const containerClasses = [
    'section-header',
    centered ? 'text-center' : '',
    spacingClasses[bottomSpacing],
    className
  ].filter(Boolean).join(' ');

  // Label animation style
  const labelAnimationStyle = animated && shouldAnimate('fade') 
    ? getAnimationStyle('fade', { delay: 0.1 })
    : {};

  // Title animation style
  const titleAnimationStyle = animated && shouldAnimate('fade')
    ? getAnimationStyle('fade', { delay: 0.2 })
    : {};

  // Subtitle animation style
  const subtitleAnimationStyle = animated && shouldAnimate('fade')
    ? getAnimationStyle('fade', { delay: 0.3 })
    : {};

  return (
    <div 
      className={containerClasses}
      style={style}
      data-variant={variant}
    >
      {/* Label */}
      {label && (
        <span 
          className="section-header-label text-xs font-bold tracking-widest uppercase text-lime-300 mb-2 block"
          style={labelAnimationStyle}
        >
          {label}
        </span>
      )}

      {/* Main heading */}
      <HeadingTag 
        id={headingId}
        className="section-header-title text-4xl md:text-5xl font-bold text-white"
        style={titleAnimationStyle}
      >
        {title}
        {highlightedText && (
          <>
            <br />
            <span 
              className={`section-header-highlight bg-gradient-to-r ${highlightGradient} text-transparent bg-clip-text`}
              data-text={highlightedText}
            >
              {highlightedText}
            </span>
          </>
        )}
      </HeadingTag>

      {/* Subtitle */}
      {subtitle && (
        <p 
          className="section-header-subtitle text-lg text-gray-300 mt-4 max-w-3xl mx-auto"
          style={subtitleAnimationStyle}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}; 
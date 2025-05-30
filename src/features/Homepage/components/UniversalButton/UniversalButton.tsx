/**
 * UniversalButton Component
 * 
 * Consolidates all Homepage section button implementations into a single,
 * theme-aware component that integrates with the GlobalVariantContext.
 * 
 * Replaces:
 * - HeroButton, FeatureButton, TrainingButton, JourneyButton
 * - PersonalTrainingButton, TrainingFeaturesButton, TestimonialsButton, PricingButton
 * 
 * @fileoverview Universal button component for Homepage sections
 * @version 1.0.0
 * @since Week 4 - Button Consolidation
 */

import classNames from 'classnames';
import React from 'react';
import { useTheme } from '../../../../context/ThemeContext';
import { Button } from '../../../../features/shared/Button';
import { ButtonVariant } from '../../../../features/shared/Button/types/standardButtonTypes';
import { useGlobalVariant } from '../../context/GlobalVariantContext';
import { BaseButtonProps, GlobalVariantKey } from '../../types/shared';
import './UniversalButton.scss';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

/**
 * Section context types for styling and behavior
 */
export type SectionContext = 
  | 'hero' 
  | 'features' 
  | 'training' 
  | 'journey' 
  | 'personal-training' 
  | 'training-features' 
  | 'pricing' 
  | 'testimonials'
  | 'footer';

/**
 * Style variant options for section-specific styling
 */
export type StyleVariant = 
  | 'standard' 
  | 'accent' 
  | 'athletic' 
  | 'premium'
  | 'minimal'
  | 'bold';

/**
 * Gradient color options for sections that use gradient styling
 */
export type GradientColor = 
  | 'lime' 
  | 'cyan' 
  | 'violet' 
  | 'amber'
  | 'emerald'
  | 'blue'
  | 'purple'
  | 'orange';

/**
 * Context type options for section-specific styling
 */
export type ContextType = 
  // PersonalTraining coach types
  | 'strength' 
  | 'nutrition' 
  | 'performance' 
  | 'recovery'
  // Testimonials types
  | 'athlete' 
  | 'professional' 
  | 'enthusiast' 
  | 'success'
  // Pricing plan types
  | 'basic' 
  | 'pro' 
  | 'elite' 
  | 'custom'
  // TrainingFeatures types
  | 'virtual' 
  | 'tracking' 
  | 'scheduling' 
  | 'support' 
  | 'mobile';

/**
 * Props interface for UniversalButton extending BaseButtonProps
 */
export interface UniversalButtonProps extends BaseButtonProps {
  /**
   * Section context for styling and behavior
   * Determines which section-specific styles to apply
   */
  sectionContext?: SectionContext;
  
  /**
   * Button style variant (overrides BaseButtonProps buttonVariant)
   * @default 'primary'
   */
  buttonVariant?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'link';
  
  /**
   * Section-specific style variant
   * Maps to Training styleVariant, general style variations
   */
  styleVariant?: StyleVariant;
  
  /**
   * Gradient color for sections that use gradient styling
   * Maps to Journey gradientColor
   */
  gradientColor?: GradientColor;
  
  /**
   * CSS gradient class name
   * Maps to Features gradientClass and TrainingFeatures gradientClass
   */
  gradientClass?: string;
  
  /**
   * Context-specific type for specialized styling
   * Maps to PersonalTraining coachType, Testimonials testimonialType, 
   * Pricing planType, TrainingFeatures featureType
   */
  contextType?: ContextType;
  
  /**
   * Additional gradient colors for complex styling
   * Maps to Pricing gradientColors
   */
  gradientColors?: string;
  
  /**
   * Whether to show loading state
   */
  loading?: boolean;
  
  /**
   * Inline styles
   */
  style?: React.CSSProperties;
  
  /**
   * Custom data attributes for testing and analytics
   */
  'data-section'?: string;
  'data-context'?: string;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate section-specific CSS classes
 */
const getSectionClasses = (
  sectionContext?: SectionContext,
  variant?: string,
  styleVariant?: StyleVariant,
  contextType?: ContextType,
  gradientColor?: GradientColor
): string => {
  if (!sectionContext) return '';
  
  const classes = [
    `universal-button--${sectionContext}`,
    variant ? `universal-button--${sectionContext}-${variant}` : '',
    styleVariant ? `universal-button--${styleVariant}` : '',
    contextType ? `universal-button--${contextType}` : '',
    gradientColor && variant === 'primary' ? `universal-gradient-${gradientColor}` : ''
  ];
  
  return classes.filter(Boolean).join(' ');
};

/**
 * Generate theme-aware CSS classes
 */
const getThemeClasses = (
  theme: GlobalVariantKey,
  sectionContext?: SectionContext
): string => {
  const classes = [
    `theme-${theme}`,
    sectionContext ? `theme-${theme}--${sectionContext}` : ''
  ];
  
  return classes.filter(Boolean).join(' ');
};

/**
 * Map size to ButtonSize type for shared Button component
 */
const mapSizeToButtonSize = (size?: string) => {
  switch (size) {
    case 'small': return 'small' as const;
    case 'medium': return 'medium' as const;
    case 'large': return 'large' as const;
    case 'xl': return 'large' as const; // Map xl to large for shared Button
    default: return 'medium' as const;
  }
};

/**
 * Map variant to ButtonVariant type for shared Button component
 */
const mapVariantToButtonVariant = (variant?: string): ButtonVariant => {
  switch (variant) {
    case 'primary': return 'primary';
    case 'secondary': return 'secondary';
    case 'tertiary': return 'secondary'; // Map tertiary to secondary
    case 'ghost': return 'text'; // Map ghost to text
    case 'link': return 'link';
    default: return 'primary';
  }
};

/**
 * Map theme context value to GlobalVariantKey
 */
const mapThemeToGlobalVariant = (theme: string): GlobalVariantKey => {
  // Check if theme is a valid GlobalVariantKey
  const validVariants: GlobalVariantKey[] = [
    'default', 'gym', 'sports', 'wellness', 'modern', 'classic', 
    'minimalist', 'boutique', 'registration', 'mobile'
  ];
  
  if (validVariants.includes(theme as GlobalVariantKey)) {
    return theme as GlobalVariantKey;
  }
  
  // Map other theme values to GlobalVariantKey
  switch (theme) {
    case 'nutrition': return 'wellness'; // Map nutrition to wellness
    default: return 'default';
  }
};

// ============================================================================
// COMPONENT IMPLEMENTATION
// ============================================================================

/**
 * UniversalButton component for Homepage sections
 * 
 * Consolidates all section-specific button implementations while preserving
 * unique functionality and integrating with the GlobalVariantContext.
 * 
 * @param props - UniversalButton properties
 * @returns React component
 */
export const UniversalButton: React.FC<UniversalButtonProps> = ({
  children,
  className = '',
  buttonVariant = 'primary',
  size = 'medium',
  sectionContext,
  variant,
  styleVariant,
  gradientColor,
  gradientClass,
  contextType,
  gradientColors,
  leftIcon,
  rightIcon,
  fullWidth = false,
  href,
  onClick,
  disabled = false,
  loading = false,
  style,
  'data-section': dataSection,
  'data-context': dataContext,
  ...restProps
}) => {
  // Get current theme from GlobalVariantContext
  const { currentVariant } = useGlobalVariant();
  const { theme: themeContextTheme } = useTheme();
  
  // Determine active theme (prop override > GlobalVariant > ThemeContext > default)
  // Ensure proper type mapping for theme context values
  const mappedThemeContextTheme = themeContextTheme ? mapThemeToGlobalVariant(themeContextTheme) : 'default';
  const activeTheme = variant || currentVariant || mappedThemeContextTheme;
  
  // Generate CSS classes
  const sectionClasses = getSectionClasses(
    sectionContext, 
    buttonVariant, 
    styleVariant, 
    contextType, 
    gradientColor
  );
  
  const themeClasses = getThemeClasses(activeTheme, sectionContext);
  
  // Construct final CSS classes
  const buttonClasses = classNames(
    'universal-button',
    `universal-button-${buttonVariant}`,
    `universal-button--${size}`,
    {
      'universal-button--full-width': fullWidth,
      'universal-button--loading': loading,
      'universal-button--disabled': disabled
    },
    sectionClasses,
    themeClasses,
    gradientClass,
    gradientColors,
    className
  );
  
  // Handle loading state
  const isDisabled = disabled || loading;
  
  // Create icon elements with proper spacing
  const startIcon = leftIcon ? (
    <span className="universal-button__icon universal-button__icon--left">
      {leftIcon}
    </span>
  ) : undefined;
  
  const endIcon = rightIcon ? (
    <span className="universal-button__icon universal-button__icon--right">
      {rightIcon}
    </span>
  ) : undefined;
  
  // Loading spinner
  const loadingSpinner = loading ? (
    <span className="universal-button__spinner" aria-hidden="true">
      <svg className="universal-button__spinner-icon" viewBox="0 0 24 24">
        <circle 
          className="universal-button__spinner-path" 
          cx="12" 
          cy="12" 
          r="10" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeDasharray="31.416" 
          strokeDashoffset="31.416"
        />
      </svg>
    </span>
  ) : undefined;
  
  return (
    <Button
      variant={mapVariantToButtonVariant(buttonVariant)}
      size={mapSizeToButtonSize(size)}
      href={href}
      onClick={onClick}
      disabled={isDisabled}
      className={buttonClasses}
      aria-label={restProps['aria-label']}
      aria-controls={restProps['aria-controls']}
      aria-expanded={restProps['aria-expanded']}
      aria-pressed={restProps['aria-pressed']}
      data-section={dataSection || sectionContext}
      data-context={dataContext || contextType}
      data-theme={activeTheme}
      style={style}
      {...restProps}
    >
      {loading && loadingSpinner}
      {!loading && startIcon}
      <span className="universal-button__text">
        {children}
      </span>
      {!loading && endIcon}
    </Button>
  );
};

export default UniversalButton; 
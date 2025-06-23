/**
 * Style Utilities for UniversalButton
 * 
 * Handles section context styling, theme integration, and CSS class generation
 * for the unified button system.
 */

import { GlobalVariantKey } from '../../../types/shared';
import { SectionContext, SectionStyleConfig, ThemeStyleConfig, UniversalButtonVariant } from '../types';

/**
 * Generate section-specific CSS classes
 */
export const getSectionClasses = (
  sectionContext: SectionContext,
  variant: UniversalButtonVariant = 'primary',
  styleVariant?: string,
  contextType?: string
): string => {
  const baseClass = `universal-button--${sectionContext}`;
  const variantClass = `universal-button--${sectionContext}-${variant}`;
  const styleClass = styleVariant ? `universal-button--${styleVariant}` : '';
  const contextClass = contextType ? `universal-button--${contextType}` : '';
  
  return [baseClass, variantClass, styleClass, contextClass]
    .filter(Boolean)
    .join(' ');
};

/**
 * Generate theme-aware CSS classes
 */
export const getThemeClasses = (
  theme: GlobalVariantKey,
  sectionContext: SectionContext
): string => {
  const themeClass = `universal-button--theme-${theme}`;
  const sectionThemeClass = `universal-button--${sectionContext}-theme-${theme}`;
  
  return [themeClass, sectionThemeClass].join(' ');
};

/**
 * Get section style configuration
 */
export const getSectionStyleConfig = (
  sectionContext: SectionContext,
  variant: UniversalButtonVariant = 'primary',
  styleVariant?: string,
  contextType?: string
): SectionStyleConfig => {
  return {
    baseClass: `universal-button--${sectionContext}`,
    variantClass: `universal-button--${sectionContext}-${variant}`,
    styleClass: styleVariant ? `universal-button--${styleVariant}` : undefined,
    contextClass: contextType ? `universal-button--${contextType}` : undefined
  };
};

/**
 * Get theme style configuration
 */
export const getThemeStyleConfig = (
  theme: GlobalVariantKey,
  sectionContext: SectionContext
): ThemeStyleConfig => {
  const themeClasses = getThemeClasses(theme, sectionContext);
  
  // Define theme-specific custom properties
  const customProperties: Record<string, string> = {};
  
  // Add theme-specific CSS custom properties based on section and theme
  switch (theme) {
  case 'gym':
    customProperties['--button-theme-primary'] = 'var(--color-violet-400)';
    customProperties['--button-theme-secondary'] = 'var(--color-purple-500)';
    break;
  case 'sports':
    customProperties['--button-theme-primary'] = 'var(--color-cyan-400)';
    customProperties['--button-theme-secondary'] = 'var(--color-blue-500)';
    break;
  case 'wellness':
    customProperties['--button-theme-primary'] = 'var(--color-teal-400)';
    customProperties['--button-theme-secondary'] = 'var(--color-teal-500)';
    break;
  case 'modern':
    customProperties['--button-theme-primary'] = 'var(--color-slate-400)';
    customProperties['--button-theme-secondary'] = 'var(--color-slate-500)';
    break;
  case 'classic':
    customProperties['--button-theme-primary'] = 'var(--color-amber-400)';
    customProperties['--button-theme-secondary'] = 'var(--color-amber-500)';
    break;
  case 'minimalist':
    customProperties['--button-theme-primary'] = 'var(--color-gray-400)';
    customProperties['--button-theme-secondary'] = 'var(--color-gray-500)';
    break;
  case 'boutique':
    customProperties['--button-theme-primary'] = 'var(--color-pink-400)';
    customProperties['--button-theme-secondary'] = 'var(--color-rose-500)';
    break;
  case 'registration':
    customProperties['--button-theme-primary'] = 'var(--color-blue-400)';
    customProperties['--button-theme-secondary'] = 'var(--color-blue-500)';
    break;
  case 'mobile':
    customProperties['--button-theme-primary'] = 'var(--color-indigo-400)';
    customProperties['--button-theme-secondary'] = 'var(--color-indigo-500)';
    break;
  default:
    customProperties['--button-theme-primary'] = 'var(--color-lime-300)';
    customProperties['--button-theme-secondary'] = 'var(--color-emerald-400)';
  }
  
  return {
    themeClasses,
    customProperties
  };
};

/**
 * Combine all CSS classes for the button
 */
export const getCombinedClasses = (
  baseClasses: string,
  sectionContext: SectionContext,
  variant: UniversalButtonVariant = 'primary',
  theme: GlobalVariantKey = 'default',
  styleVariant?: string,
  contextType?: string,
  gradientClass?: string,
  additionalClasses?: string
): string => {
  const sectionClasses = getSectionClasses(sectionContext, variant, styleVariant, contextType);
  const themeClasses = getThemeClasses(theme, sectionContext);
  
  return [
    baseClasses,
    sectionClasses,
    themeClasses,
    gradientClass,
    additionalClasses
  ]
    .filter(Boolean)
    .join(' ');
};

/**
 * Get size-specific classes for section context
 */
export const getSizeClasses = (
  size: string,
  sectionContext: SectionContext
): string => {
  const baseSize = `universal-button--${size}`;
  const sectionSize = `universal-button--${sectionContext}-${size}`;
  
  return [baseSize, sectionSize].join(' ');
};

/**
 * Get state-specific classes
 */
export const getStateClasses = (
  disabled?: boolean,
  loading?: boolean,
  fullWidth?: boolean
): string => {
  const classes: string[] = [];
  
  if (disabled) {
    classes.push('universal-button--disabled');
  }
  
  if (loading) {
    classes.push('universal-button--loading');
  }
  
  if (fullWidth) {
    classes.push('universal-button--full-width');
  }
  
  return classes.join(' ');
};

/**
 * Map section-specific props to contextType
 */
export const mapSectionPropsToContextType = (
  sectionContext: SectionContext,
  props: Record<string, any>
): string | undefined => {
  switch (sectionContext) {
  case 'personal-training':
    return props.coachType;
  case 'training-features':
    return props.featureType;
  case 'pricing':
    return props.planType;
  case 'testimonials':
    return props.testimonialType;
  default:
    return props.contextType;
  }
};

/**
 * Map section-specific props to styleVariant
 */
export const mapSectionPropsToStyleVariant = (
  sectionContext: SectionContext,
  props: Record<string, any>
): string | undefined => {
  switch (sectionContext) {
  case 'training':
    return props.styleVariant;
  default:
    return props.styleVariant;
  }
};

/**
 * Map section-specific props to gradientClass
 */
export const mapSectionPropsToGradientClass = (
  sectionContext: SectionContext,
  props: Record<string, any>
): string | undefined => {
  switch (sectionContext) {
  case 'features':
  case 'training-features':
    return props.gradientClass;
  default:
    return props.gradientClass;
  }
};

/**
 * Map section-specific props to gradientColor
 */
export const mapSectionPropsToGradientColor = (
  sectionContext: SectionContext,
  props: Record<string, any>
): string | undefined => {
  switch (sectionContext) {
  case 'journey':
    return props.gradientColor;
  default:
    return props.gradientColor;
  }
};

/**
 * Map section-specific props to gradientColors
 */
export const mapSectionPropsToGradientColors = (
  sectionContext: SectionContext,
  props: Record<string, any>
): string | undefined => {
  switch (sectionContext) {
  case 'pricing':
    return props.gradientColors;
  default:
    return props.gradientColors;
  }
};

/**
 * Validate section context
 */
export const isValidSectionContext = (sectionContext: string): sectionContext is SectionContext => {
  const validContexts: SectionContext[] = [
    'hero',
    'features',
    'training',
    'journey',
    'personal-training',
    'training-features',
    'pricing',
    'testimonials'
  ];
  
  return validContexts.includes(sectionContext as SectionContext);
};

/**
 * Get default variant for section
 */
export const getDefaultVariantForSection = (sectionContext: SectionContext): UniversalButtonVariant => {
  // All sections default to primary variant
  return 'primary';
};

/**
 * Get supported variants for section
 */
export const getSupportedVariantsForSection = (sectionContext: SectionContext): UniversalButtonVariant[] => {
  // Most sections support primary and secondary
  const baseVariants: UniversalButtonVariant[] = ['primary', 'secondary'];
  
  switch (sectionContext) {
  case 'hero':
    // Hero only supports primary and secondary based on audit
    return baseVariants;
  case 'features':
  case 'training':
  case 'journey':
  case 'personal-training':
  case 'training-features':
  case 'pricing':
  case 'testimonials':
    // Other sections can support additional variants
    return [...baseVariants, 'tertiary', 'ghost', 'link'];
  default:
    return baseVariants;
  }
};

/**
 * Check if variant is supported for section
 */
export const isVariantSupportedForSection = (
  variant: UniversalButtonVariant,
  sectionContext: SectionContext
): boolean => {
  const supportedVariants = getSupportedVariantsForSection(sectionContext);
  return supportedVariants.includes(variant);
};

/**
 * Generate CSS custom properties object
 */
export const generateCustomProperties = (
  theme: GlobalVariantKey,
  sectionContext: SectionContext,
  additionalProperties?: Record<string, string>
): Record<string, string> => {
  const themeConfig = getThemeStyleConfig(theme, sectionContext);
  
  return {
    ...themeConfig.customProperties,
    ...additionalProperties
  };
};

/**
 * Convert CSS custom properties to inline styles
 */
export const customPropertiesToStyles = (
  customProperties: Record<string, string>
): React.CSSProperties => {
  const styles: React.CSSProperties = {};
  
  Object.entries(customProperties).forEach(([property, value]) => {
    // Convert CSS custom property to camelCase for React styles
    const camelCaseProperty = property.replace(/--([a-z])/g, (_, letter) => letter.toUpperCase());
    (styles as any)[property] = value;
  });
  
  return styles;
}; 
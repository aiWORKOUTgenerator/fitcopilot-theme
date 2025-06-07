import { ArrowRight } from 'lucide-react';
import React from 'react';
import { ThemeProvider } from '../../../../../context/ThemeContext';
import { ThemeOption } from '../../../../../utils/theming';
import { GlobalVariantKey } from '../../../types/shared';
import useReducedMotion from '../../hooks/useReducedMotion';
import { TrainingFeaturesButton } from '../TrainingFeaturesButton';
import { TrainingFeaturesCTAProps } from './types';

/**
 * Maps TrainingFeatures variant to theme options for ThemeProvider
 */
const mapVariantToTheme = (variant: string | undefined): ThemeOption => {
  if (!variant || variant === 'default') return 'default';
  if (variant === 'gym' || variant === 'sports' || variant === 'wellness') {
    return variant as ThemeOption;
  }
  return 'default';
};

/**
 * Map variant to GlobalVariantKey
 */
const mapVariantToGlobal = (variant?: string): GlobalVariantKey => {
  const validVariants: GlobalVariantKey[] = [
    'default', 'gym', 'sports', 'wellness', 'modern', 'classic', 
    'minimalist', 'boutique', 'registration', 'mobile'
  ];
  
  if (validVariants.includes(variant as GlobalVariantKey)) {
    return variant as GlobalVariantKey;
  }
  
  // Map TrainingFeatures-specific variants to GlobalVariantKey
  switch (variant) {
    default: return 'default';
  }
};

/**
 * Map buttonVariant to TrainingFeaturesButton variant
 */
const mapButtonVariant = (buttonVariant?: string): 'primary' | 'secondary' => {
  // Map 'gradient' to 'primary' since TrainingFeaturesButton handles gradient via gradientClass prop
  if (buttonVariant === 'gradient' || buttonVariant === 'primary') {
    return 'primary';
  }
  return 'secondary';
};

/**
 * Map feature type to gradient class - Use CSS class names, not Tailwind
 * This matches the architectural pattern used by JourneyButton's journey-gradient-lime
 */
const mapFeatureTypeToGradient = (featureTitle?: string): string => {
  if (!featureTitle) return 'training-features-gradient-lime';
  
  const title = featureTitle.toLowerCase();
  if (title.includes('virtual') || title.includes('live')) {
    return 'training-features-gradient-lime';
  }
  if (title.includes('tracking') || title.includes('progress')) {
    return 'training-features-gradient-violet';
  }
  if (title.includes('support') || title.includes('continuous')) {
    return 'training-features-gradient-amber';
  }
  if (title.includes('mobile') || title.includes('experience')) {
    return 'training-features-gradient-cyan';
  }
  if (title.includes('analytics') || title.includes('dashboard')) {
    return 'training-features-gradient-indigo';
  }
  
  return 'training-features-gradient-lime'; // default
};

/**
 * Generate CTA text based on feature and context
 */
const generateCTAText = (featureTitle?: string, contextType: 'explore' | 'learn' | 'discover' = 'explore'): string => {
  const contextMap = {
    explore: 'Explore',
    learn: 'Learn About',
    discover: 'Discover'
  };
  
  const prefix = contextMap[contextType];
  return featureTitle ? `${prefix} ${featureTitle}` : `${prefix} All Features`;
};

/**
 * TrainingFeaturesCTA - Call to action button for TrainingFeatures section
 * 
 * Follows the exact same architectural pattern as JourneyCTA:
 * - Uses TrainingFeaturesButton (like JourneyCTA uses JourneyButton)
 * - Wrapped in ThemeProvider for section theming
 * - Matches visual appearance of other Homepage section CTAs
 * 
 * @example
 * <TrainingFeaturesCTA
 *   onNavigate={(featureType) => console.log('Navigate to:', featureType)}
 *   variant="default"
 *   size="primary"
 *   featureTitle="Virtual Training"
 *   contextType="explore"
 * />
 */
const TrainingFeaturesCTA: React.FC<TrainingFeaturesCTAProps> = ({
  onNavigate,
  variant,
  size = 'large',
  featureTitle,
  contextType = 'explore',
  className = '',
  href,
  showIcon = true,
  icon
}) => {
  const _prefersReducedMotion = useReducedMotion();
  const _globalVariant = mapVariantToGlobal(variant);
  
  // Generate CTA text
  const ctaText = generateCTAText(featureTitle, contextType);
  
  // Map button variant to TrainingFeaturesButton variant
  const trainingFeaturesButtonVariant = mapButtonVariant('primary');
  
  // Generate gradient class based on feature type
  const gradientClass = mapFeatureTypeToGradient(featureTitle);
  
  // Map feature type for TrainingFeaturesButton
  const featureType = featureTitle?.toLowerCase().includes('virtual') ? 'virtual' :
                     featureTitle?.toLowerCase().includes('tracking') ? 'tracking' :
                     featureTitle?.toLowerCase().includes('support') ? 'support' :
                     featureTitle?.toLowerCase().includes('mobile') ? 'mobile' :
                     'virtual'; // default

  // Determine the icon to display - inline with typography
  const iconElement = showIcon ? (
    icon || <ArrowRight 
      size={size === 'small' ? 16 : 20} 
      style={{ 
        marginLeft: '0.5rem',
        verticalAlign: 'middle',
        display: 'inline'
      }} 
      aria-hidden="true" 
    />
  ) : undefined;

  // Handle navigation
  const handleClick = React.useCallback((event: React.MouseEvent) => {
    if (href) {
      // Let default navigation happen for href
      return;
    }
    
    event.preventDefault();
    onNavigate(featureTitle || 'All Features');
  }, [onNavigate, featureTitle, href]);

  return (
    <ThemeProvider initialTheme={mapVariantToTheme(variant)}>
      <TrainingFeaturesButton
        variant={trainingFeaturesButtonVariant}
        size={size}
        featureType={featureType}
        gradientClass={gradientClass}
        href={href}
        onClick={handleClick}
        rightIcon={iconElement}
        className={className}
        data-section="training-features"
        data-context="cta"
        aria-label={`${ctaText} - TrainingFeatures call to action`}
      >
        {ctaText}
      </TrainingFeaturesButton>
    </ThemeProvider>
  );
};

export default TrainingFeaturesCTA; 
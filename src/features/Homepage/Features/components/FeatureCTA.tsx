import { ArrowRight } from 'lucide-react';
import React from 'react';
import { ThemeProvider } from '../../../../context/ThemeContext';
import { ThemeOption } from '../../../../utils/theming';
import { FeatureButton } from './FeatureButton';

/**
 * Props interface for FeatureCTA component
 */
export interface FeatureCTAProps {
  /** Button text content */
  text?: string;
  /** Link destination */
  href?: string;
  /** Additional CSS class */
  className?: string;
  /** Button size variant */
  buttonSize?: 'small' | 'medium' | 'large';
  /** Button visual variant */
  buttonVariant?: 'primary' | 'secondary' | 'gradient';
  /** Whether to show the icon */
  showIcon?: boolean;
  /** Custom icon to use instead of default */
  icon?: React.ReactNode;
  /** Gradient color option - defaults to cyan */
  gradientColor?: 'lime' | 'cyan' | 'violet' | 'amber';
  /** Theme variant */
  variant?: string;
}

/**
 * Maps Feature variant to theme options for ThemeProvider
 */
const mapVariantToTheme = (variant: string | undefined): ThemeOption => {
  if (!variant || variant === 'default') return 'default';
  if (variant === 'gym' || variant === 'sports' || variant === 'wellness') {
    return variant as ThemeOption;
  }
  return 'default';
};

/**
 * Map buttonVariant to FeatureButton variant
 */
const mapButtonVariant = (buttonVariant?: string): 'primary' | 'secondary' => {
  // Map 'gradient' to 'primary' since FeatureButton handles gradient via gradientClass
  if (buttonVariant === 'gradient' || buttonVariant === 'primary') {
    return 'primary';
  }
  return 'secondary';
};

/**
 * Map gradientColor to CSS class for FeatureButton
 */
const mapGradientColor = (gradientColor?: string): string | undefined => {
  const gradientColorMap: Record<string, string> = {
    lime: 'feature-gradient-lime',
    cyan: 'feature-gradient-cyan',
    violet: 'feature-gradient-violet',
    amber: 'feature-gradient-amber'
  };
  
  return gradientColor ? gradientColorMap[gradientColor] : undefined;
};

/**
 * FeatureCTA - Call to action button with gradient styling
 * Simplified architecture with consistent patterns
 */
const FeatureCTA: React.FC<FeatureCTAProps> = ({
  text = 'Explore Features',
  href = 'https://aigymengine.com/workout-generator-registration',
  className = '',
  buttonSize = 'medium',
  buttonVariant = 'gradient',
  showIcon = true,
  icon,
  gradientColor = 'cyan',
  variant
}) => {
  // Map button variant to FeatureButton variant
  const featureButtonVariant = mapButtonVariant(buttonVariant);
  
  // Map gradient color to CSS class
  const gradientClass = mapGradientColor(gradientColor);
  
  // Determine the icon to display - standardized sizing to match JourneyCTA
  const iconElement = showIcon ? (
    icon || <ArrowRight size={buttonSize === 'small' ? 16 : 20} className="ml-2" aria-hidden="true" />
  ) : undefined;

  return (
    <ThemeProvider initialTheme={mapVariantToTheme(variant)}>
      <FeatureButton
        variant={featureButtonVariant}
        size={buttonSize}
        gradientClass={gradientClass}
        href={href}
        rightIcon={iconElement}
        className={className}
        data-section="features"
        data-context="cta"
        aria-label={`${text} - Features call to action`}
      >
        {text}
      </FeatureButton>
    </ThemeProvider>
  );
};

export default FeatureCTA; 
import { ArrowRight } from 'lucide-react';
import React from 'react';
import { ThemeProvider } from '../../../../context/ThemeContext';
import { ThemeOption } from '../../../../utils/theming';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { JourneyCTAProps } from '../types';
import JourneyButton from './JourneyButton';

/**
 * Maps Journey variant to theme options for ThemeProvider
 */
const mapVariantToTheme = (variant: string | undefined): ThemeOption => {
  if (!variant || variant === 'default') return 'default';
  if (variant === 'gym' || variant === 'sports' || variant === 'wellness') {
    return variant as ThemeOption;
  }
  return 'default';
};

/**
 * Type for gradient color options
 */
type GradientColorOption = 'lime' | 'cyan' | 'violet' | 'amber';

/**
 * Type for button size options
 */
type ButtonSizeOption = 'small' | 'medium' | 'large';

/**
 * JourneyCTA - Call to action button with gradient styling
 */
const JourneyCTA: React.FC<JourneyCTAProps> = ({
  text = 'Start Your Journey Now',
  href = 'https://aigymengine.com/workout-generator-registration',
  buttonSize = 'large',
  buttonVariant = 'gradient',
  showIcon = true,
  icon,
  gradientColor = 'lime',
  variant
}) => {
  const _prefersReducedMotion = useReducedMotion();
  // Unused buttonVariant, mark with underscore to indicate intentional non-usage
  const _buttonVariant = buttonVariant;

  // Map traditional gradient colors to JourneyButton props
  const gradientColorMap: Record<string, GradientColorOption> = {
    lime: 'lime',
    cyan: 'cyan',
    violet: 'violet',
    amber: 'amber'
  };

  // Map button size from traditional naming to standardized naming
  const sizeMap: Record<string, ButtonSizeOption> = {
    small: 'small',
    medium: 'medium',
    large: 'large'
  };

  return (
    <ThemeProvider initialTheme={mapVariantToTheme(variant)}>
      <JourneyButton
        variant="primary"
        size={sizeMap[buttonSize]}
        gradientColor={gradientColorMap[gradientColor]}
        href={href}
        rightIcon={showIcon && (icon || <ArrowRight size={buttonSize === 'small' ? 16 : 20} className="ml-2" aria-hidden="true" />)}
      >
        {text}
      </JourneyButton>
    </ThemeProvider>
  );
};

export default JourneyCTA; 
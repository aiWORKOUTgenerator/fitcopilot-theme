import { ArrowRight } from 'lucide-react';
import React from 'react';
import { ThemeProvider } from '../../../../context/ThemeContext';
import { ThemeOption } from '../../../../utils/theming';
import { GlobalVariantKey } from '../../types/shared';
import useReducedMotion from '../hooks/useReducedMotion';
import { JourneyCTAProps } from '../types';
import { JourneyButton } from './JourneyButton';

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
  
  // Map Journey-specific variants to GlobalVariantKey
  switch (variant) {
    default: return 'default';
  }
};

/**
 * Map buttonVariant to JourneyButton variant
 */
const mapButtonVariant = (buttonVariant?: string): 'primary' | 'secondary' => {
  // Map 'gradient' to 'primary' since JourneyButton handles gradient via gradientColor prop
  if (buttonVariant === 'gradient' || buttonVariant === 'primary') {
    return 'primary';
  }
  return 'secondary';
};

/**
 * @deprecated Use UniversalButton with sectionContext="journey" instead
 * JourneyCTA - Call to action button with gradient styling
 * 
 * This component is deprecated and will be removed in v2.0.0
 * Use UniversalButton from '../components/UniversalButton' instead:
 * 
 * @example
 * <UniversalButton
 *   sectionContext="journey"
 *   buttonVariant="primary"
 *   gradientColor="lime"
 *   size="large"
 *   href={href}
 * >
 *   {text}
 * </UniversalButton>
 */
const JourneyCTA: React.FC<JourneyCTAProps> = ({
  text = 'Start Your Journey Now',
  href = 'https://aigymengine.com/workout-generator-registration',
  className = '',
  buttonSize = 'large',
  buttonVariant = 'gradient',
  showIcon = true,
  icon,
  gradientColor = 'lime',
  variant
}) => {
  const _prefersReducedMotion = useReducedMotion();
  const _globalVariant = mapVariantToGlobal(variant);
  
  // Deprecation warning
  React.useEffect(() => {
    console.warn(
      '⚠️  JourneyCTA is deprecated and will be removed in v2.0.0. ' +
      'Use UniversalButton with sectionContext="journey" instead. ' +
      'See component documentation for migration examples.'
    );
  }, []);
  
  // Map button variant to JourneyButton variant
  const journeyButtonVariant = mapButtonVariant(buttonVariant);

  // Determine the icon to display
  const iconElement = showIcon ? (
    icon || <ArrowRight size={buttonSize === 'small' ? 16 : 20} className="ml-2" aria-hidden="true" />
  ) : undefined;

  return (
    <ThemeProvider initialTheme={mapVariantToTheme(variant)}>
      <JourneyButton
        variant={journeyButtonVariant}
        size={buttonSize}
        gradientColor={gradientColor}
        href={href}
        rightIcon={iconElement}
        className={className}
        data-section="journey"
        data-context="cta"
        aria-label={`${text} - Journey call to action`}
      >
        {text}
      </JourneyButton>
    </ThemeProvider>
  );
};

export default JourneyCTA; 
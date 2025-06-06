import React from 'react';
import { ThemeProvider } from '../../../../context/ThemeContext';
import { ThemeOption } from '../../../../utils/theming';
import { UniversalButton } from '../../components/UniversalButton';
import { GlobalVariantKey } from '../../types/shared';
import { StepCTAProps } from '../types';
import { getStepCTAUrl } from '../utils/tokenUtils';

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
 * StepCTA - Renders the call-to-action button for journey steps
 * 
 * @param {StepCTAProps} props - Properties for StepCTA
 * @returns {JSX.Element} Rendered StepCTA component 
 */
const StepCTA: React.FC<StepCTAProps> = ({
  step,
  _isExpanded,
  variant = 'default',
  className,
  ...rest
}) => {
  const ctaUrl = getStepCTAUrl(step.title || '');
  const globalVariant = mapVariantToGlobal(variant);
  
  // Determine gradient color based on step number
  const getGradientColor = (stepNumber: number): 'lime' | 'cyan' | 'violet' | 'amber' => {
    switch (stepNumber) {
    case 1: return 'lime';
    case 2: return 'cyan';
    case 3: return 'violet';
    case 4: return 'amber';
    default: return 'lime';
    }
  };

  return (
    <div className="text-center">
      <ThemeProvider initialTheme={mapVariantToTheme(variant)}>
        <UniversalButton
          sectionContext="journey"
          buttonVariant="primary"
          variant={globalVariant}
          size="small"
          href={ctaUrl}
          className={className}
          gradientColor={getGradientColor(step.number || 1)}
          aria-label={`${step.ctaText} for ${step.title}`}
          data-section="journey"
          data-context="step"
          {...rest}
        >
          {step.ctaText}
        </UniversalButton>
      </ThemeProvider>
    </div>
  );
};

export default StepCTA; 
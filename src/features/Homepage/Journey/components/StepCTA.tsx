import { ChevronRight } from 'lucide-react';
import React from 'react';
import { ThemeProvider } from '../../../../context/ThemeContext';
import { ThemeOption } from '../../../../utils/theming';
import { StepCTAProps } from '../types';
import { getStepCTAUrl } from '../utils/tokenUtils';
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
        <JourneyButton
          variant="primary"
          size="small"
          href={ctaUrl}
          className={className}
          gradientColor={getGradientColor(step.number || 1)}
          rightIcon={<ChevronRight size={16} className="ml-2" aria-hidden="true" />}
          aria-label={`${step.ctaText} for ${step.title}`}
          {...rest}
        >
          {step.ctaText}
        </JourneyButton>
      </ThemeProvider>
    </div>
  );
};

export default StepCTA; 
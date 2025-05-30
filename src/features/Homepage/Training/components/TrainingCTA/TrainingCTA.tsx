import { ArrowRight } from 'lucide-react';
import React, { memo } from 'react';
import { ThemeProvider } from '../../../../../context/ThemeContext';
import { ThemeOption } from '../../../../../utils/theming';
import { UniversalButton } from '../../../components/UniversalButton';
import { GlobalVariantKey } from '../../../types/shared';
import './TrainingCTA.scss';
import { TrainingCTAProps } from './types';

/**
 * Map GlobalVariantKey to ThemeOption for ThemeProvider
 */
const mapVariantToTheme = (variant: GlobalVariantKey | undefined): ThemeOption => {
  // Direct mappings for variants that match themes
  if (variant === 'default' || variant === 'gym' || variant === 'sports' || variant === 'wellness') {
    return variant;
  }
  
  // Map other variants to appropriate themes
  switch (variant) {
    case 'modern': return 'sports';
    case 'classic': return 'default';
    case 'minimalist': return 'default';
    case 'boutique': return 'wellness';
    case 'registration': return 'default';
    case 'mobile': return 'default';
    default: return 'default';
  }
};

/**
 * Map Training variant to GlobalVariantKey
 */
const mapTrainingVariantToGlobal = (variant?: GlobalVariantKey): GlobalVariantKey => {
  const validVariants: GlobalVariantKey[] = [
    'default', 'gym', 'sports', 'wellness', 'modern', 'classic', 
    'minimalist', 'boutique', 'registration', 'mobile'
  ];
  
  if (validVariants.includes(variant as GlobalVariantKey)) {
    return variant as GlobalVariantKey;
  }
  
  return 'default';
};

/**
 * Training CTA button for the Training section
 */
const TrainingCTA: React.FC<TrainingCTAProps> = memo(function TrainingCTA({
  onNavigate,
  variant = 'default',
  className = '',
}) {
  const globalVariant = mapTrainingVariantToGlobal(variant);
  
  return (
    <ThemeProvider initialTheme={mapVariantToTheme(variant)}>
      <div className={`training-cta training-cta--${variant} ${className}`}>
        <UniversalButton
          sectionContext="training"
          buttonVariant="primary"
          variant={globalVariant}
          size="large"
          styleVariant="accent"
          className="training-cta-button"
          onClick={() => onNavigate('all')}
          rightIcon={<ArrowRight className="ml-2" size={20} />}
          aria-label="View all training programs"
          data-section="training"
          data-context="cta"
        >
          View All Programs
        </UniversalButton>
      </div>
    </ThemeProvider>
  );
});

export default TrainingCTA; 
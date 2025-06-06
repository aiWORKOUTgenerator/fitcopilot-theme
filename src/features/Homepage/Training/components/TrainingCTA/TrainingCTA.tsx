import React, { memo } from 'react';
import { UniversalButton } from '../../../components/UniversalButton/UniversalButton';
import './TrainingCTA.scss';
import { TrainingCTAProps, TrainingCTASize, TrainingVariantKey } from './types';

/**
 * Map TrainingVariantKey to valid variant for UniversalButton
 */
const mapTrainingVariantToGlobal = (variant: TrainingVariantKey) => {
  // Training-specific variants map to default
  if (variant === 'strength' || variant === 'fatLoss' || variant === 'fitness' || variant === 'athletic') {
    return 'default';
  }
  // Return the variant as is for global variants
  return variant;
};

/**
 * Training CTA button for the Training section
 * Uses UniversalButton with training amber/orange color palette
 * Supports primary (homepage) and secondary (benefits list) size variants
 */
const TrainingCTA: React.FC<TrainingCTAProps> = memo(function TrainingCTA({
  onNavigate,
  variant = 'default',
  size = 'primary',
  programTitle,
  className = '',
}) {
  // Map variant to program type for color styling
  const getProgramVariantClass = (variant: TrainingVariantKey): string => {
    const programTypes: TrainingVariantKey[] = ['strength', 'fatLoss', 'fitness', 'athletic'];
    if (programTypes.includes(variant)) {
      return `training-cta--${variant}`;
    }
    return '';
  };

  // Map size to CSS class for size-specific styling
  const getSizeClass = (size: TrainingCTASize): string => {
    return `training-cta--${size}`;
  };

  // Determine UniversalButton size based on TrainingCTA size
  const getUniversalButtonSize = (size: TrainingCTASize): 'medium' | 'large' => {
    return size === 'secondary' ? 'medium' : 'large';
  };

  // Generate dynamic CTA text based on program title
  const getCTAText = (programTitle?: string): string => {
    if (!programTitle) {
      return 'View All Programs';
    }

    // Handle specific program title formatting
    switch (programTitle) {
      case 'Strength Building':
        return 'View Strength Building Programs';
      case 'Fat Loss':
        return 'View Fat Loss Programs';
      case 'General Fitness':
        return 'View General Fitness Programs';
      case 'Athletic Performance':
        return 'View Athletic Performance Programs';
      default:
        // Fallback for any other program titles
        return `View ${programTitle}`;
    }
  };

  const programVariantClass = getProgramVariantClass(variant);
  const sizeClass = getSizeClass(size);
  const combinedClassName = `training-cta training-cta--${variant} ${sizeClass} ${programVariantClass} ${className}`.trim();
  const ctaText = getCTAText(programTitle);

  return (
    <div className={combinedClassName}>
      <UniversalButton
        sectionContext="training"
        buttonVariant="primary"
        gradientColor="amber"
        size={getUniversalButtonSize(size)}
        onClick={() => onNavigate(programTitle || 'View All Programs')}
        className="training-cta__button"
        variant={mapTrainingVariantToGlobal(variant)}
      >
        {ctaText}
      </UniversalButton>
    </div>
  );
});

export default TrainingCTA; 
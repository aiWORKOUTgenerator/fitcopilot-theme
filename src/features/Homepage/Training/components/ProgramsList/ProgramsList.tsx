import React, { memo } from 'react';
import { BenefitsList, ProgramCard } from '..';
import { GlobalVariantKey } from '../../../types/shared';
import { ProgramType, VariantKey } from '../../types';
import { generateProgramAriaIds } from '../../utils/accessibilityHelpers';
import TrainingCTA from '../TrainingCTA/TrainingCTA';
import { TrainingVariantKey } from '../TrainingCTA/types';
import './ProgramsList.scss';
import { ProgramsListProps } from './types';

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
  
  // Map Training-specific variants to GlobalVariantKey
  switch (variant) {
    case 'athletic': return 'sports'; // Map athletic to sports
    default: return 'default';
  }
};

/**
 * Map variant to TrainingVariantKey for TrainingCTA
 */
const mapVariantToTraining = (variant?: string): TrainingVariantKey => {
  const trainingVariants: TrainingVariantKey[] = [
    'default', 'gym', 'sports', 'wellness', 'modern', 'classic', 
    'minimalist', 'boutique', 'strength', 'fatLoss', 'fitness', 'athletic'
  ];
  
  if (trainingVariants.includes(variant as TrainingVariantKey)) {
    return variant as TrainingVariantKey;
  }
  
  return 'default';
};

/**
 * Memoized expanded content component for better performance
 */
const ExpandedContent = memo(({
  program,
  variant,
  onNavigate,
  ariaIds
}: {
    program: ProgramType;
    variant: string;
    onNavigate: (title: string) => void;
    ariaIds: ReturnType<typeof generateProgramAriaIds>;
}) => {
  const trainingVariant = mapVariantToTraining(variant);
  
  return (
    <div
      className="training-expanded"
      id={ariaIds.contentId}
      aria-labelledby={ariaIds.titleId}
    >
      <h4
        className="training-expanded__title"
        id={`${ariaIds.benefitsId}-heading`}
      >
        Key Benefits
      </h4>

      <BenefitsList
        benefits={program.benefits}
        variant={variant as VariantKey}
        className="training-expanded__benefits"
        ariaLabelledBy={`${ariaIds.benefitsId}-heading`}
        id={ariaIds.benefitsId}
      />

      <div className="training-expanded__cta">
        <TrainingCTA
          onNavigate={() => onNavigate(program.title)}
          variant={trainingVariant}
          size="secondary"
          programTitle={program.title}
          className="training-expanded__cta-button"
        />
      </div>
    </div>
  );
});

// Add display name to fix the linting error
ExpandedContent.displayName = 'ExpandedContent';

/**
 * Programs list component for displaying all training programs
 */
const ProgramsList: React.FC<ProgramsListProps> = ({
  programs,
  selectedProgram,
  onProgramClick,
  onNavigate,
  variant = 'default',
  prefersReducedMotion = false,
  className = ''
}) => {
  return (
    <div className={`training-section__programs ${className}`} role="list" aria-label="Training Programs">
      {programs.map((program, index) => {
        const isActive = selectedProgram === index;
        const ariaIds = generateProgramAriaIds(index, program.programType || program.title);

        return (
          <div key={program.title} className="relative" role="listitem">
            <ProgramCard
              program={program}
              isActive={isActive}
              onToggle={() => onProgramClick(index)}
              variant={variant as VariantKey}
              ariaIds={ariaIds}
            />

            {isActive && (
              <ExpandedContent
                program={program}
                variant={variant}
                onNavigate={onNavigate}
                ariaIds={ariaIds}
              />
            )}

            {/* Visual connector line between programs */}
            {index < programs.length - 1 && (
              <div className="training-connector" aria-hidden="true"></div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default memo(ProgramsList); 
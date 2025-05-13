import { ArrowRight } from 'lucide-react';
import React, { memo } from 'react';
import { BenefitsList, ProgramCard } from '..';
import { Button } from '../../../../../features/shared/Button';
import { ProgramType } from '../../types';
import { generateProgramAriaIds } from '../../utils/accessibilityHelpers';
import './ProgramsList.scss';
import { ProgramsListProps } from './types';

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
}) => (
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
            variant={variant}
            className="training-expanded__benefits"
            ariaLabelledBy={`${ariaIds.benefitsId}-heading`}
            id={ariaIds.benefitsId}
        />

        <div className="training-expanded__cta">
            <Button
                variant="secondary"
                size="medium"
                rightIcon={<ArrowRight size={16} />}
                onClick={() => onNavigate(program.title)}
                aria-label={`Explore ${program.title} program details`}
            >
                Explore {program.title}
            </Button>
        </div>
    </div>
));

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
                const ariaIds = generateProgramAriaIds(program.title);

                return (
                    <div key={program.title} className="relative" role="listitem">
                        <ProgramCard
                            program={program}
                            isActive={isActive}
                            onToggle={() => onProgramClick(index)}
                            variant={variant}
                            prefersReducedMotion={prefersReducedMotion}
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
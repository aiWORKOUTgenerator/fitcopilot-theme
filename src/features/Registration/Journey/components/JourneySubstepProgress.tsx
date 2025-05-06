import { Check, ChevronRight } from 'lucide-react';
import React from 'react';
import { JourneySubstepId } from '../../types';
import './JourneySubstepProgress.scss';

// Define substep display information
interface SubstepInfo {
    id: JourneySubstepId;
    label: string;
    description: string;
}

// Define the list of substeps with their display information
const SUBSTEPS: SubstepInfo[] = [
    {
        id: JourneySubstepId.GOALS,
        label: 'Goals',
        description: 'Define your fitness objectives'
    },
    {
        id: JourneySubstepId.EQUIPMENT,
        label: 'Equipment',
        description: 'Tell us about your available equipment'
    },
    {
        id: JourneySubstepId.TIME_COMMITMENT,
        label: 'Time',
        description: 'Set your workout schedule and duration'
    },
    {
        id: JourneySubstepId.MEDICAL,
        label: 'Health',
        description: 'Share any injuries or medical considerations'
    },
    {
        id: JourneySubstepId.ANALYTICS,
        label: 'Preferences',
        description: 'Configure your tracking preferences'
    }
];

interface JourneySubstepProgressProps {
    currentSubstep: JourneySubstepId;
    completedSubsteps: Set<JourneySubstepId>;
    onSubstepClick: (substepId: JourneySubstepId) => void;
}

/**
 * JourneySubstepProgress - Component that displays and enables navigation between Journey substeps
 */
const JourneySubstepProgress: React.FC<JourneySubstepProgressProps> = ({
    currentSubstep,
    completedSubsteps,
    onSubstepClick
}) => {
    // Get the current substep index
    const currentIndex = SUBSTEPS.findIndex(substep => substep.id === currentSubstep);

    // Determine if a substep is clickable (only completed steps or the current step + 1)
    const isSubstepClickable = (index: number): boolean => {
        if (index <= currentIndex + 1) return true;
        return Array.from(completedSubsteps).includes(SUBSTEPS[index].id);
    };

    return (
        <div className="journey-substep-progress">
            <div className="journey-substep-progress__inner">
                {SUBSTEPS.map((substep, index) => {
                    const isCompleted = completedSubsteps.has(substep.id);
                    const isCurrent = substep.id === currentSubstep;
                    const canClick = isSubstepClickable(index);

                    return (
                        <React.Fragment key={substep.id}>
                            {/* Step icon and label */}
                            <div
                                className={`
                                    journey-substep-progress__step 
                                    ${isCurrent ? 'journey-substep-progress__step--current' : ''} 
                                    ${isCompleted ? 'journey-substep-progress__step--completed' : ''}
                                    ${canClick ? 'journey-substep-progress__step--clickable' : 'journey-substep-progress__step--disabled'}
                                `}
                                onClick={() => canClick && onSubstepClick(substep.id)}
                            >
                                <div className="journey-substep-progress__icon">
                                    {isCompleted ? (
                                        <Check size={16} />
                                    ) : (
                                        <span>{index + 1}</span>
                                    )}
                                </div>
                                <div className="journey-substep-progress__label">
                                    <span className="journey-substep-progress__label-text">{substep.label}</span>
                                    <span className="journey-substep-progress__description">{substep.description}</span>
                                </div>
                            </div>

                            {/* Connector line between steps */}
                            {index < SUBSTEPS.length - 1 && (
                                <div className={`
                                    journey-substep-progress__connector
                                    ${index < currentIndex ? 'journey-substep-progress__connector--completed' : ''}
                                `}>
                                    <div className="journey-substep-progress__connector-line"></div>
                                    <ChevronRight size={12} className="journey-substep-progress__connector-icon" />
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default JourneySubstepProgress; 
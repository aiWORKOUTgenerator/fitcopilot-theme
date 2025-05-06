import React from 'react';
import { useNavigation } from '../context';
import { useRegistrationProgress } from '../hooks/useRegistrationProgress';
import { RegistrationStepId } from '../types';

interface StepIndicatorProps {
    stepId: RegistrationStepId;
    label: string;
    index: number;
}

/**
 * Indicator for a single step in the registration process
 */
const StepIndicator: React.FC<StepIndicatorProps> = ({ stepId, label, index }) => {
    const { isCurrentStep, goToStep, state } = useNavigation();
    const { getStepProgress } = useRegistrationProgress();

    const stepProgress = getStepProgress(stepId);
    const active = isCurrentStep(stepId);
    const completed = stepProgress.completed;

    const handleClick = () => {
        // Only allow navigation to completed steps or the current step
        if (completed || active) {
            goToStep(stepId);
        }
    };

    return (
        <div
            className={`step-indicator ${active ? 'active' : ''} ${completed ? 'completed' : ''}`}
            onClick={handleClick}
        >
            <div className="step-number">{index + 1}</div>
            <div className="step-label">{label}</div>
        </div>
    );
};

/**
 * Progress indicator for the registration flow
 * Shows all steps and highlights the current step
 */
const RegistrationProgressIndicator: React.FC = () => {
    const { progressPercentage } = useRegistrationProgress();

    // Step labels
    const steps = [
        { id: RegistrationStepId.SPLASH, label: 'Welcome' },
        { id: RegistrationStepId.EXPERIENCE_LEVEL, label: 'Experience' },
        { id: RegistrationStepId.JOURNEY, label: 'Journey' },
        { id: RegistrationStepId.PRICING, label: 'Pricing' },
        { id: RegistrationStepId.PAYMENT, label: 'Payment' },
        { id: RegistrationStepId.CONFIRMATION, label: 'Confirmation' },
    ];

    return (
        <div className="registration-progress">
            <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progressPercentage}%` }} />
            </div>
            <div className="step-indicators">
                {steps.map((step, index) => (
                    <StepIndicator
                        key={step.id}
                        stepId={step.id}
                        label={step.label}
                        index={index}
                    />
                ))}
            </div>
        </div>
    );
};

export default RegistrationProgressIndicator; 
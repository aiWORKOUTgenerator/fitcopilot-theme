import { X } from 'lucide-react';
import React, { useCallback } from 'react';
import { AnimatedTransition, RegistrationLayout } from './components';
import ExperienceLevel from './ExperienceLevel';
import { useRegistrationData, useRegistrationProgress } from './hooks';
import Journey from './Journey';
import Pricing from './Pricing';
import './Registration.scss';
import Splash from './Splash';
import { RegistrationProps, RegistrationStep } from './types';

/**
 * Main Registration component that orchestrates the multi-step registration flow
 */
const Registration: React.FC<RegistrationProps> = ({
    className = '',
    initialStep = RegistrationStep.SPLASH,
    onComplete,
    onCancel
}) => {
    // Get registration state and handlers from hooks
    const { data, updateData, resetData } = useRegistrationData();
    const { currentStep, nextStep, previousStep, goToStep, progress } = useRegistrationProgress(initialStep);

    // Handle completion of the registration flow
    const handleComplete = useCallback(() => {
        if (onComplete && data) {
            onComplete(data);
        }
    }, [onComplete, data]);

    // Handle cancellation of registration
    const handleCancel = useCallback(() => {
        if (onCancel) {
            onCancel();
        }
    }, [onCancel]);

    // Render the current step based on the current step value
    const renderCurrentStep = () => {
        switch (currentStep) {
            case RegistrationStep.SPLASH:
                return (
                    <Splash
                        data={data}
                        updateData={updateData}
                        onNext={nextStep}
                    />
                );

            case RegistrationStep.EXPERIENCE_LEVEL:
                return (
                    <ExperienceLevel
                        data={data}
                        updateData={updateData}
                        onNext={nextStep}
                        onBack={previousStep}
                    />
                );

            case RegistrationStep.GOALS:
            case RegistrationStep.EQUIPMENT:
            case RegistrationStep.TIME_COMMITMENT:
                return (
                    <Journey
                        data={data}
                        updateData={updateData}
                        onNext={nextStep}
                        onBack={previousStep}
                        currentStep={currentStep}
                    />
                );

            case RegistrationStep.PRICING:
                return (
                    <Pricing
                        data={data}
                        updateData={updateData}
                        onNext={nextStep}
                        onBack={previousStep}
                        onComplete={handleComplete}
                    />
                );

            // Add additional steps as needed

            default:
                return (
                    <div className="registration-error">
                        <h2>Oops! Something went wrong</h2>
                        <p>We couldn't find the registration step you're looking for.</p>
                        <button onClick={() => goToStep(RegistrationStep.SPLASH)}>
                            Start Over
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className={`registration ${className}`}>
            <div className="registration-header">
                <div className="registration-header__progress">
                    <div className="registration-progress-label">Registration Progress</div>
                </div>
                <button
                    className="cancel-button"
                    onClick={handleCancel}
                    aria-label="Cancel registration"
                >
                    <X size={24} />
                </button>
            </div>
            <RegistrationLayout progress={progress}>
                <AnimatedTransition key={currentStep}>
                    {renderCurrentStep()}
                </AnimatedTransition>
            </RegistrationLayout>
        </div>
    );
};

export default Registration; 
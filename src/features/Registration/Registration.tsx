import { X } from 'lucide-react';
import React, { useCallback, useEffect } from 'react';
import { AnimatedTransition, ProgressIndicator, RegistrationLayout } from './components';
import { useTransitionAnalytics } from './events/analyticsIntegration';
import { RegistrationFlowEvent } from './events/analyticsTypes';
import ExperienceLevel from './ExperienceLevel';
import { useRegistrationData, useRegistrationProgress } from './hooks';
import { REGISTRATION_STEPS } from './hooks/useRegistrationProgress';
import Journey from './Journey';
import { PricingComponent } from './Pricing/Pricing';
import './Registration.scss';
import Splash from './Splash';
import { RegistrationProps, RegistrationStep, RegistrationStepProps } from './types';

/**
 * Main Registration component that orchestrates the multi-step registration flow
 */
const Registration: React.FC<RegistrationProps> = ({
    className = '',
    initialStep = RegistrationStep.SPLASH,
    onComplete,
    onCancel
}) => {
    // Initialize analytics tracking for registration flow
    const { trackCustomEvent, trackStepView } = useTransitionAnalytics();

    // Get registration state and handlers from hooks
    const { data, updateData } = useRegistrationData();
    const { currentStep, nextStep, previousStep } = useRegistrationProgress(initialStep);

    // Calculate the current step index from the current step
    const currentStepIndex = REGISTRATION_STEPS.indexOf(currentStep);

    // Track registration flow initialization
    useEffect(() => {
        const initEvent: RegistrationFlowEvent = {
            type: 'registration_flow_initiated',
            properties: {
                initialStep: initialStep.toString(),
                timestamp: new Date().toISOString()
            }
        };
        trackCustomEvent(initEvent);
    }, [trackCustomEvent, initialStep]);

    // Track step views
    useEffect(() => {
        trackStepView(currentStep.toString(), {
            stepName: currentStep.toString(),
            stepNumber: currentStepIndex + 1,
            totalSteps: REGISTRATION_STEPS.length
        });
    }, [currentStep, currentStepIndex, trackStepView]);

    // Handle completion of the registration flow
    const handleComplete = useCallback(() => {
        // Track registration completion
        const completeEvent: RegistrationFlowEvent = {
            type: 'registration_completed',
            properties: {
                finalStep: currentStep.toString(),
                timestamp: new Date().toISOString()
            }
        };
        trackCustomEvent(completeEvent);

        if (onComplete && data) {
            onComplete(data);
        }
    }, [onComplete, data, currentStep, trackCustomEvent]);

    // Handle cancellation of registration
    const handleCancel = useCallback(() => {
        // Track registration cancellation
        const cancelEvent: RegistrationFlowEvent = {
            type: 'registration_cancelled',
            properties: {
                cancelledAtStep: currentStep.toString(),
                timestamp: new Date().toISOString()
            }
        };
        trackCustomEvent(cancelEvent);

        if (onCancel) {
            onCancel();
        }
    }, [onCancel, currentStep, trackCustomEvent]);

    // Render the current step based on the current step value
    const renderCurrentStep = () => {
        const stepProps: RegistrationStepProps = {
            data,
            updateData,
            onNext: nextStep,
            onBack: previousStep
        };

        switch (currentStep) {
            case RegistrationStep.SPLASH:
                return (
                    <Splash
                        {...stepProps}
                    />
                );

            case RegistrationStep.EXPERIENCE_LEVEL:
                return (
                    <ExperienceLevel
                        {...stepProps}
                    />
                );

            case RegistrationStep.GOALS:
            case RegistrationStep.EQUIPMENT:
            case RegistrationStep.TIME_COMMITMENT:
                return (
                    <Journey
                        {...stepProps}
                        currentStep={currentStep}
                    />
                );

            case RegistrationStep.PRICING:
                return (
                    <PricingComponent
                        {...stepProps}
                        onComplete={handleComplete}
                    />
                );

            // Add additional steps as needed

            default:
                return (
                    <PricingComponent
                        {...stepProps}
                        onComplete={handleComplete}
                    />
                );
        }
    };

    return (
        <div className={`registration ${className}`}>
            <div className="registration-header">
                <button className="registration-close" onClick={handleCancel} aria-label="Close">
                    <X size={24} />
                </button>
                <div className="registration-progress">
                    <ProgressIndicator
                        completedSections={(() => {
                            // Start with the current step and all previous steps
                            const baseCompletedSections = REGISTRATION_STEPS.slice(0, currentStepIndex + 1).map(step => step.toString());

                            // Add any additional completed sections based on the data
                            const additionalSections = [];

                            // If we have completed customization sections, mark EQUIPMENT and TIME_COMMITMENT as completed
                            if (data.completedCustomizationSections?.includes('customize_experience_completed')) {
                                additionalSections.push(RegistrationStep.EQUIPMENT.toString());
                            }

                            // Specifically check for time commitment completion
                            if (data.completedCustomizationSections?.includes('time_commitment_completed')) {
                                additionalSections.push(RegistrationStep.TIME_COMMITMENT.toString());
                            }

                            // If we have completed medical information, mark MEDICAL as completed if it exists
                            if (data.completedCustomizationSections?.includes('medical_information_completed')) {
                                // Medical doesn't have a specific step in REGISTRATION_STEPS, but we can
                                // consider it as part of the journey
                                // No op for now
                            }

                            // Combine and deduplicate
                            return [...new Set([...baseCompletedSections, ...additionalSections])];
                        })()}
                        totalSections={REGISTRATION_STEPS.length}
                        sectionLabels={REGISTRATION_STEPS.reduce((acc, step) => {
                            // Convert enum value to display name (e.g. EXPERIENCE_LEVEL -> Experience Level)
                            const displayName = step.toString()
                                .split('_')
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                .join(' ');
                            acc[step.toString()] = displayName;
                            return acc;
                        }, {} as Record<string, string>)}
                        variant="detailed"
                        showLabels={true}
                        accentColor="purple"
                    />
                </div>
            </div>
            <RegistrationLayout>
                <AnimatedTransition key={currentStep}>
                    {renderCurrentStep()}
                </AnimatedTransition>
            </RegistrationLayout>
        </div>
    );
};

export default Registration; 
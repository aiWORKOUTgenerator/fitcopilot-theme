import { X } from 'lucide-react';
import React, { useCallback, useEffect } from 'react';
import { AnimatedTransition, ProgressIndicator, RegistrationLayout } from './components';
import Confirmation from './Confirmation';
import { NavigationProvider } from './context/NavigationContext';
import { useTransitionAnalytics } from './events/analyticsIntegration';
import ExperienceLevel from './ExperienceLevel';
import { useRegistrationData } from './hooks';
import { useNavigationBridge } from './hooks/useNavigationBridge';
import { REGISTRATION_STEPS } from './hooks/useRegistrationProgress';
import JourneyContainer from './Journey/JourneyContainer';
import Payment from './Payment';
import Pricing from './Pricing';
import './Registration.scss';
import Splash from './Splash';
import { RegistrationProps, RegistrationStep, RegistrationStepId } from './types';

/**
 * Main Registration component that orchestrates the multi-step registration flow
 */
const RegistrationContent: React.FC<RegistrationProps> = ({
    className = '',
    onComplete,
    onCancel
}) => {
    // Initialize analytics tracking for registration flow
    const { trackCustomEvent } = useTransitionAnalytics();

    // Get registration state and handlers from hooks
    const { data, updateData } = useRegistrationData();
    const { currentStep, nextStep, previousStep, goToStep, currentStepIndex } = useNavigationBridge();

    // Track registration flow initialization
    useEffect(() => {
        trackCustomEvent('registration_flow_initiated', {
            initial_step: currentStep,
            timestamp: new Date().toISOString()
        });
    }, [trackCustomEvent, currentStep]);

    // Handle completion of the registration flow
    const handleComplete = useCallback(() => {
        // Track registration completion
        trackCustomEvent('registration_completed', {
            final_step: currentStep,
            timestamp: new Date().toISOString()
        });

        if (onComplete && data) {
            onComplete(data);
        }
    }, [onComplete, data, currentStep, trackCustomEvent]);

    // Handle cancellation of registration
    const handleCancel = useCallback(() => {
        // Track registration cancellation
        trackCustomEvent('registration_cancelled', {
            cancelled_at_step: currentStep,
            timestamp: new Date().toISOString()
        });

        if (onCancel) {
            onCancel();
        }
    }, [onCancel, currentStep, trackCustomEvent]);

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
                // Use the new JourneyContainer for all journey-related steps
                return (
                    <JourneyContainer
                        data={data}
                        updateData={updateData}
                        onNext={nextStep}
                        onBack={previousStep}
                    />
                );

            case RegistrationStep.PRICING:
                // Use the navigationContext-aware Pricing component
                return <Pricing />;

            case RegistrationStep.PAYMENT:
                // Use the Payment component
                return <Payment />;

            case RegistrationStep.CONFIRMATION:
                // Use the Confirmation component
                return <Confirmation />;

            // Add additional steps as needed

            default:
                return <Pricing />;
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

/**
 * Wrapper component that provides the NavigationContext to the registration flow
 */
const Registration: React.FC<RegistrationProps> = (props) => {
    // Convert initialStep from RegistrationStep to RegistrationStepId if needed
    const mapInitialStep = (): RegistrationStepId => {
        if (!props.initialStep) return RegistrationStepId.SPLASH;

        // Map from legacy RegistrationStep to new RegistrationStepId using string values
        const stepValue = props.initialStep.toString();

        switch (stepValue) {
            case 'splash':
                return RegistrationStepId.SPLASH;
            case 'experience_level':
                return RegistrationStepId.EXPERIENCE_LEVEL;
            case 'goals':
            case 'equipment':
            case 'time_commitment':
                return RegistrationStepId.JOURNEY;
            case 'pricing':
                return RegistrationStepId.PRICING;
            case 'payment':
                return RegistrationStepId.PAYMENT;
            case 'confirmation':
                return RegistrationStepId.CONFIRMATION;
            default:
                return RegistrationStepId.SPLASH;
        }
    };

    return (
        <NavigationProvider initialStep={mapInitialStep()}>
            <RegistrationContent {...props} />
        </NavigationProvider>
    );
};

export default Registration; 
import React, { useEffect } from 'react';
import { useNavigation } from '../../context';
import { RegistrationStepId } from '../../types';
import RegistrationButton from '../RegistrationButton';

/**
 * Stub component for the Splash step
 */
const Splash: React.FC = () => {
    const { isCurrentStep, markStepValid, markStepCompleted } = useNavigation();
    const isActive = isCurrentStep(RegistrationStepId.SPLASH);

    // Set validity on mount
    useEffect(() => {
        if (isActive) {
            markStepValid(RegistrationStepId.SPLASH, true);
        }
    }, [isActive, markStepValid]);

    // This will be replaced with the actual Splash component later
    if (!isActive) {
        return null;
    }

    return (
        <div className="registration-step splash-step">
            <h1>Welcome to FitCopilot</h1>
            <p>Your personalized AI fitness companion</p>

            <div className="step-content">
                <p>We'll help you create a personalized workout plan based on your goals, experience, and preferences.</p>
            </div>

            <div className="step-controls">
                <RegistrationButton type="next" />
            </div>
        </div>
    );
};

export default Splash; 
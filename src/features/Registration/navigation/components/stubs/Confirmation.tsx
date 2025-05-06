import React, { useEffect } from 'react';
import { useNavigation } from '../../context';
import { useRegistrationProgress } from '../../hooks/useRegistrationProgress';
import { RegistrationStepId } from '../../types';
import RegistrationButton from '../RegistrationButton';

/**
 * Stub component for the Confirmation step
 */
const Confirmation: React.FC = () => {
    const { isCurrentStep, markStepValid, markStepCompleted } = useNavigation();
    const { isRegistrationComplete } = useRegistrationProgress();
    const isActive = isCurrentStep(RegistrationStepId.CONFIRMATION);

    // Mark step as valid and completed on mount
    useEffect(() => {
        if (isActive) {
            markStepValid(RegistrationStepId.CONFIRMATION, true);
            markStepCompleted(RegistrationStepId.CONFIRMATION, true);
        }
    }, [isActive, markStepValid, markStepCompleted]);

    // This will be replaced with the actual Confirmation component later
    if (!isActive) {
        return null;
    }

    return (
        <div className="registration-step confirmation-step">
            <h1>Registration Complete!</h1>

            <div className="step-content">
                <div className="confirmation-message">
                    <div className="confirmation-icon">✓</div>
                    <p>Thank you for joining FitCopilot! Your personalized workout journey begins now.</p>
                    <p>We've sent a confirmation email with your account details and next steps.</p>
                </div>

                <div className="next-steps">
                    <h2>Next Steps</h2>
                    <ul>
                        <li>Check your email for account verification</li>
                        <li>Download our mobile app for on-the-go workouts</li>
                        <li>Complete your profile to further personalize your experience</li>
                    </ul>
                </div>
            </div>

            <div className="step-controls">
                <RegistrationButton
                    type="custom"
                    label="Go to Dashboard"
                    onClick={() => window.location.href = '/dashboard'}
                />
            </div>
        </div>
    );
};

export default Confirmation; 
import React from 'react';
import { RegistrationStepProps } from '../types';

// Placeholder component for the Pricing step (will be implemented later)
const Pricing: React.FC<RegistrationStepProps & { onComplete?: () => void }> = ({
    data,
    updateData,
    onNext,
    onBack,
    onComplete,
}) => {
    return (
        <div className="registration-step pricing-step">
            <h2>Pricing Step Placeholder</h2>
            <p>This component will be implemented in the next phase.</p>

            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                {onBack && (
                    <button
                        className="registration-button registration-button--secondary"
                        onClick={onBack}
                    >
                        Back
                    </button>
                )}
                <button
                    className="registration-button"
                    onClick={onComplete || onNext}
                >
                    {onComplete ? 'Complete' : 'Next'}
                </button>
            </div>
        </div>
    );
};

export default Pricing; 
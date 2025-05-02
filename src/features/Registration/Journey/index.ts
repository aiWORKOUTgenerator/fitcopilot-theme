import React from 'react';
import { RegistrationStepProps, RegistrationStep } from '../types';

// Placeholder component for the Journey steps (will be implemented later)
const Journey: React.FC<RegistrationStepProps & { currentStep: RegistrationStep }> = ({
    data,
    updateData,
    onNext,
    onBack,
    currentStep,
}) => {
    return (
        <div className= "registration-step journey-step" >
        <h2>Journey Step Placeholder </h2>
            < p > This component will be implemented in the next phase.</p>
                < p > Current step: { currentStep } </p>

                    < div style = {{ marginTop: '2rem', display: 'flex', gap: '1rem' }
}>
    { onBack && (
        <button 
            className="registration-button registration-button--secondary"
onClick = { onBack }
    >
    Back
    </button>
        )}
<button 
          className="registration-button"
onClick = { onNext }
    >
    Next
    </button>
    </div>
    </div>
  );
};

export default Journey; 
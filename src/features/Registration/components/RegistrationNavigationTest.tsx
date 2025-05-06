import React from 'react';
import {
    NavigationProvider,
    useNavigation
} from '../context/NavigationContext';
import {
    JourneySubstepId,
    NAVIGATION_HIERARCHY,
    RegistrationStepId,
    SectionId
} from '../types';

// Helper to convert camelCase to Title Case
const toTitleCase = (text: string): string => {
    const result = text.replace(/([A-Z])/g, ' $1');
    return result.charAt(0).toUpperCase() + result.slice(1);
};

// Navigation Controls for main steps
const StepNavigationControls: React.FC = () => {
    const { nextStep, previousStep, state } = useNavigation();
    const { currentStep } = state;

    const isFirstStep = currentStep === RegistrationStepId.SPLASH;
    const isLastStep = currentStep === RegistrationStepId.CONFIRMATION;

    return (
        <div className="navigation-controls" style={{ display: 'flex', gap: '10px', margin: '20px 0' }}>
            <button
                onClick={previousStep}
                disabled={isFirstStep}
                style={{ padding: '8px 16px', opacity: isFirstStep ? 0.5 : 1 }}
            >
                Previous Step
            </button>
            <button
                onClick={nextStep}
                disabled={isLastStep}
                style={{ padding: '8px 16px', opacity: isLastStep ? 0.5 : 1 }}
            >
                Next Step
            </button>
        </div>
    );
};

// Navigation Controls for journey substeps
const SubstepNavigationControls: React.FC = () => {
    const { nextSubstep, previousSubstep, state } = useNavigation();
    const { currentSubstep } = state;

    const substeps = NAVIGATION_HIERARCHY.steps[RegistrationStepId.JOURNEY] as JourneySubstepId[];
    const isFirstSubstep = currentSubstep === substeps[0];
    const isLastSubstep = currentSubstep === substeps[substeps.length - 1];

    return (
        <div className="substep-navigation-controls" style={{ display: 'flex', gap: '10px', margin: '20px 0' }}>
            <button
                onClick={previousSubstep}
                disabled={isFirstSubstep}
                style={{ padding: '8px 16px', opacity: isFirstSubstep ? 0.5 : 1 }}
            >
                Previous Substep
            </button>
            <button
                onClick={nextSubstep}
                style={{ padding: '8px 16px' }}
            >
                Next Substep
            </button>
        </div>
    );
};

// Main Step Selector for direct navigation
const MainStepSelector: React.FC = () => {
    const { goToStep } = useNavigation();

    return (
        <div className="step-selector" style={{ margin: '20px 0' }}>
            <h3>Jump to Step:</h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {Object.values(RegistrationStepId).map(stepId => (
                    <button
                        key={stepId}
                        onClick={() => goToStep(stepId)}
                        style={{ padding: '8px 16px', margin: '5px' }}
                    >
                        {toTitleCase(stepId)}
                    </button>
                ))}
            </div>
        </div>
    );
};

// Substep Selector for direct navigation
const SubstepSelector: React.FC = () => {
    const { goToSubstep } = useNavigation();
    const substeps = NAVIGATION_HIERARCHY.steps[RegistrationStepId.JOURNEY] as JourneySubstepId[];

    return (
        <div className="substep-selector" style={{ margin: '20px 0' }}>
            <h3>Jump to Substep:</h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {substeps.map(substepId => (
                    <button
                        key={substepId}
                        onClick={() => goToSubstep(substepId)}
                        style={{ padding: '8px 16px', margin: '5px' }}
                    >
                        {toTitleCase(substepId)}
                    </button>
                ))}
            </div>
        </div>
    );
};

// Progress Indicator
const NavigationProgress: React.FC = () => {
    const { state, isStepComplete, isSubstepComplete } = useNavigation();
    const { currentStep, currentSubstep } = state;

    return (
        <div className="navigation-progress" style={{ margin: '20px 0', border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
            <h3>Navigation Progress</h3>
            <div>
                <div>Current Step: <strong>{toTitleCase(currentStep)}</strong></div>
                {currentSubstep && (
                    <div>Current Substep: <strong>{toTitleCase(currentSubstep)}</strong></div>
                )}
            </div>

            <div style={{ marginTop: '15px' }}>
                <h4>Step Progress:</h4>
                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                    {Object.values(RegistrationStepId).map(stepId => {
                        const isActive = stepId === currentStep;
                        const isCompleted = isStepComplete(stepId);

                        return (
                            <div
                                key={stepId}
                                style={{
                                    padding: '5px 10px',
                                    backgroundColor: isActive ? '#e0f7fa' : isCompleted ? '#e8f5e9' : '#f5f5f5',
                                    border: `1px solid ${isActive ? '#4fc3f7' : isCompleted ? '#66bb6a' : '#ccc'}`,
                                    borderRadius: '3px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px'
                                }}
                            >
                                {toTitleCase(stepId)}
                                {isCompleted && <span>✓</span>}
                            </div>
                        );
                    })}
                </div>
            </div>

            {(currentStep === RegistrationStepId.JOURNEY || currentSubstep) && (
                <div style={{ marginTop: '15px' }}>
                    <h4>Substep Progress:</h4>
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                        {NAVIGATION_HIERARCHY.steps[RegistrationStepId.JOURNEY]?.map((substepId: JourneySubstepId) => {
                            const isActive = substepId === currentSubstep;
                            const isCompleted = isSubstepComplete(substepId);

                            return (
                                <div
                                    key={substepId}
                                    style={{
                                        padding: '5px 10px',
                                        backgroundColor: isActive ? '#e0f7fa' : isCompleted ? '#e8f5e9' : '#f5f5f5',
                                        border: `1px solid ${isActive ? '#4fc3f7' : isCompleted ? '#66bb6a' : '#ccc'}`,
                                        borderRadius: '3px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px'
                                    }}
                                >
                                    {toTitleCase(substepId)}
                                    {isCompleted && <span>✓</span>}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

// Stub Components for each step
const StepContent: React.FC = () => {
    const { state, updateRegistrationData } = useNavigation();
    const { currentStep, currentSubstep, registrationData } = state;

    const renderContent = () => {
        switch (currentStep) {
            case RegistrationStepId.SPLASH:
                return (
                    <div className="splash-content">
                        <h2>Welcome to FitCopilot</h2>
                        <p>Your personalized AI workout generator. Let's create a fitness plan tailored just for you.</p>
                        <p>Click "Next Step" to begin your journey.</p>
                    </div>
                );

            case RegistrationStepId.EXPERIENCE_LEVEL:
                return (
                    <div className="experience-level-content">
                        <h2>What's your fitness experience level?</h2>
                        <div style={{ display: 'flex', gap: '10px', margin: '20px 0' }}>
                            {['Beginner', 'Intermediate', 'Advanced'].map(level => (
                                <button
                                    key={level}
                                    onClick={() => updateRegistrationData({ experienceLevel: level.toLowerCase() })}
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: registrationData.experienceLevel === level.toLowerCase() ? '#e0f7fa' : '#f5f5f5',
                                        border: `1px solid ${registrationData.experienceLevel === level.toLowerCase() ? '#4fc3f7' : '#ccc'}`,
                                        borderRadius: '5px'
                                    }}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                        {registrationData.experienceLevel && (
                            <p>You selected: <strong>{registrationData.experienceLevel}</strong></p>
                        )}
                    </div>
                );

            case RegistrationStepId.JOURNEY:
                return renderJourneyContent();

            case RegistrationStepId.PRICING:
                return (
                    <div className="pricing-content">
                        <h2>Choose Your Plan</h2>
                        <div style={{ display: 'flex', gap: '20px', margin: '20px 0' }}>
                            {['Monthly', 'Annual', 'Lifetime'].map(plan => (
                                <div
                                    key={plan}
                                    onClick={() => updateRegistrationData({ selectedPlan: plan.toLowerCase() })}
                                    style={{
                                        padding: '20px',
                                        backgroundColor: registrationData.selectedPlan === plan.toLowerCase() ? '#e0f7fa' : '#f5f5f5',
                                        border: `1px solid ${registrationData.selectedPlan === plan.toLowerCase() ? '#4fc3f7' : '#ccc'}`,
                                        borderRadius: '5px',
                                        minWidth: '150px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <h3>{plan}</h3>
                                    <p>${plan === 'Monthly' ? '9.99/mo' : plan === 'Annual' ? '89.99/yr' : '299.99'}</p>
                                </div>
                            ))}
                        </div>
                        {registrationData.selectedPlan && (
                            <p>You selected: <strong>{registrationData.selectedPlan}</strong></p>
                        )}
                    </div>
                );

            case RegistrationStepId.PAYMENT:
                return (
                    <div className="payment-content">
                        <h2>Payment Information</h2>
                        <p>This is a payment form stub.</p>
                        <div style={{ margin: '20px 0', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Card Number</label>
                                <input type="text" placeholder="1234 5678 9012 3456" style={{ padding: '8px', width: '100%' }} />
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '5px' }}>Expiration</label>
                                    <input type="text" placeholder="MM/YY" style={{ padding: '8px', width: '100%' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '5px' }}>CVC</label>
                                    <input type="text" placeholder="123" style={{ padding: '8px', width: '100%' }} />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Cardholder Name</label>
                                <input type="text" placeholder="John Doe" style={{ padding: '8px', width: '100%' }} />
                            </div>
                        </div>
                    </div>
                );

            case RegistrationStepId.CONFIRMATION:
                return (
                    <div className="confirmation-content">
                        <h2>Registration Complete!</h2>
                        <p>Thank you for joining FitCopilot. Your personalized workout plan is ready.</p>
                        <div style={{ margin: '20px 0', padding: '20px', backgroundColor: '#e8f5e9', borderRadius: '5px' }}>
                            <h3>Your Information</h3>
                            <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '3px', overflow: 'auto' }}>
                                {JSON.stringify(registrationData, null, 2)}
                            </pre>
                        </div>
                    </div>
                );

            default:
                return <div>Unknown step</div>;
        }
    };

    const renderJourneyContent = () => {
        if (!currentSubstep) return <div>No substep selected</div>;

        switch (currentSubstep) {
            case JourneySubstepId.GOALS:
                return (
                    <div className="goals-content">
                        <h2>What are your fitness goals?</h2>
                        <div style={{ margin: '20px 0' }}>
                            {['Weight Loss', 'Muscle Gain', 'Endurance', 'Strength', 'Flexibility'].map(goal => {
                                const isSelected = registrationData.goals?.includes(goal.toLowerCase());

                                return (
                                    <div
                                        key={goal}
                                        onClick={() => {
                                            const currentGoals = registrationData.goals || [];
                                            const updatedGoals = isSelected
                                                ? currentGoals.filter(g => g !== goal.toLowerCase())
                                                : [...currentGoals, goal.toLowerCase()];

                                            updateRegistrationData({ goals: updatedGoals });
                                        }}
                                        style={{
                                            padding: '10px 20px',
                                            backgroundColor: isSelected ? '#e0f7fa' : '#f5f5f5',
                                            border: `1px solid ${isSelected ? '#4fc3f7' : '#ccc'}`,
                                            borderRadius: '5px',
                                            margin: '5px 0',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {goal}
                                    </div>
                                );
                            })}
                        </div>
                        {registrationData.goals?.length ? (
                            <p>Selected goals: <strong>{registrationData.goals.join(', ')}</strong></p>
                        ) : (
                            <p>Please select at least one goal</p>
                        )}
                    </div>
                );

            case JourneySubstepId.EQUIPMENT:
                return (
                    <div className="equipment-content">
                        <h2>Available Equipment</h2>
                        <p>Let us know what equipment you have access to.</p>

                        <div style={{ margin: '20px 0' }}>
                            <h3>Home Equipment</h3>
                            <button
                                onClick={() => updateRegistrationData({ [SectionId.EQUIPMENT_HOME]: true })}
                                style={{ padding: '8px 16px', margin: '10px 0' }}
                            >
                                Mark Home Equipment Complete
                            </button>
                        </div>

                        <div style={{ margin: '20px 0' }}>
                            <h3>Gym Equipment</h3>
                            <button
                                onClick={() => updateRegistrationData({ [SectionId.EQUIPMENT_GYM]: true })}
                                style={{ padding: '8px 16px', margin: '10px 0' }}
                            >
                                Mark Gym Equipment Complete
                            </button>
                        </div>

                        <div style={{ margin: '20px 0' }}>
                            <h3>Travel Equipment</h3>
                            <button
                                onClick={() => updateRegistrationData({ [SectionId.EQUIPMENT_TRAVEL]: true })}
                                style={{ padding: '8px 16px', margin: '10px 0' }}
                            >
                                Mark Travel Equipment Complete
                            </button>
                        </div>
                    </div>
                );

            case JourneySubstepId.TIME_COMMITMENT:
                return (
                    <div className="time-commitment-content">
                        <h2>Time Commitment</h2>
                        <p>Tell us about your availability for workouts.</p>

                        <div style={{ margin: '20px 0' }}>
                            <h3>Available Days</h3>
                            <button
                                onClick={() => updateRegistrationData({ [SectionId.TIME_DAYS]: true })}
                                style={{ padding: '8px 16px', margin: '10px 0' }}
                            >
                                Mark Available Days Complete
                            </button>
                        </div>

                        <div style={{ margin: '20px 0' }}>
                            <h3>Workout Duration</h3>
                            <button
                                onClick={() => updateRegistrationData({ [SectionId.TIME_DURATION]: true })}
                                style={{ padding: '8px 16px', margin: '10px 0' }}
                            >
                                Mark Workout Duration Complete
                            </button>
                        </div>
                    </div>
                );

            case JourneySubstepId.MEDICAL:
                return (
                    <div className="medical-content">
                        <h2>Medical Information</h2>
                        <p>Please share any relevant medical information.</p>

                        <div style={{ margin: '20px 0' }}>
                            <h3>Medical Conditions</h3>
                            <button
                                onClick={() => updateRegistrationData({ [SectionId.MEDICAL_CONDITIONS]: true })}
                                style={{ padding: '8px 16px', margin: '10px 0' }}
                            >
                                Mark Medical Conditions Complete
                            </button>
                        </div>

                        <div style={{ margin: '20px 0' }}>
                            <h3>Injuries</h3>
                            <button
                                onClick={() => updateRegistrationData({ [SectionId.MEDICAL_INJURIES]: true })}
                                style={{ padding: '8px 16px', margin: '10px 0' }}
                            >
                                Mark Injuries Complete
                            </button>
                        </div>

                        <div style={{ margin: '20px 0' }}>
                            <h3>Limitations</h3>
                            <button
                                onClick={() => updateRegistrationData({ [SectionId.MEDICAL_LIMITATIONS]: true })}
                                style={{ padding: '8px 16px', margin: '10px 0' }}
                            >
                                Mark Limitations Complete
                            </button>
                        </div>
                    </div>
                );

            case JourneySubstepId.ANALYTICS:
                return (
                    <div className="analytics-content">
                        <h2>Analytics Preferences</h2>
                        <p>Choose how you want your workout data to be tracked and analyzed.</p>

                        <div style={{ margin: '20px 0' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={!!registrationData.analyticsConsent}
                                    onChange={() => updateRegistrationData({
                                        analyticsConsent: !registrationData.analyticsConsent
                                    })}
                                />
                                I consent to tracking my workout data for personalized insights
                            </label>
                        </div>

                        {registrationData.analyticsConsent && (
                            <p>You've agreed to allow workout analytics.</p>
                        )}
                    </div>
                );

            default:
                return <div>Unknown substep</div>;
        }
    };

    return (
        <div className="step-content" style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px', margin: '20px 0' }}>
            {renderContent()}

            {currentStep === RegistrationStepId.JOURNEY && <SubstepNavigationControls />}
        </div>
    );
};

// Main test component
const RegistrationNavigationTest: React.FC = () => {
    return (
        <NavigationProvider>
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
                <h1>Registration Navigation Test</h1>
                <p>This component demonstrates the navigation flow for the registration process.</p>

                <NavigationProgress />

                <MainStepSelector />

                {/* Only show substep selector when in Journey step */}
                <SubstepSelector />

                <StepContent />

                <StepNavigationControls />
            </div>
        </NavigationProvider>
    );
};

export default RegistrationNavigationTest; 
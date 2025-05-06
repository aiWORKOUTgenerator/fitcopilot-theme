import React, { useEffect } from 'react';
import { useNavigation } from '../../context';
import { JourneySubstepId, RegistrationStepId } from '../../types';
import RegistrationButton from '../RegistrationButton';

/**
 * Stub for the Goals substep
 */
const GoalsSubstep: React.FC = () => {
    return (
        <div className="journey-substep goals-substep">
            <h2>What are your fitness goals?</h2>
            <p>Select your primary fitness objectives.</p>

            <div className="goals-options">
                <div className="goal-option">Lose Weight</div>
                <div className="goal-option">Build Muscle</div>
                <div className="goal-option">Improve Endurance</div>
                <div className="goal-option">General Fitness</div>
            </div>
        </div>
    );
};

/**
 * Stub for the Equipment substep
 */
const EquipmentSubstep: React.FC = () => {
    return (
        <div className="journey-substep equipment-substep">
            <h2>What equipment do you have access to?</h2>
            <p>Tell us about your available equipment.</p>

            <div className="equipment-sections">
                <div className="equipment-section">
                    <h3>Home Equipment</h3>
                    <div className="equipment-options">
                        <div className="equipment-option">Dumbbells</div>
                        <div className="equipment-option">Pull-up Bar</div>
                        <div className="equipment-option">Resistance Bands</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * Stub for the Time Commitment substep
 */
const TimeCommitmentSubstep: React.FC = () => {
    return (
        <div className="journey-substep time-commitment-substep">
            <h2>How much time can you commit to working out?</h2>
            <p>Select your workout frequency and duration.</p>

            <div className="time-commitment-sections">
                <div className="time-section">
                    <h3>Days per Week</h3>
                    <div className="day-options">
                        <div className="day-option">2-3 days</div>
                        <div className="day-option">4-5 days</div>
                        <div className="day-option">6+ days</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * Stub for the Medical substep
 */
const MedicalSubstep: React.FC = () => {
    return (
        <div className="journey-substep medical-substep">
            <h2>Any medical considerations we should know about?</h2>
            <p>This helps us tailor your workout plan to your specific needs.</p>

            <div className="medical-sections">
                <div className="medical-section">
                    <h3>Medical Conditions</h3>
                    <textarea placeholder="Enter any medical conditions here"></textarea>
                </div>
            </div>
        </div>
    );
};

/**
 * Stub for the Analytics substep
 */
const AnalyticsSubstep: React.FC = () => {
    return (
        <div className="journey-substep analytics-substep">
            <h2>Analytics Preferences</h2>
            <p>Choose what data you'd like us to track to optimize your fitness journey.</p>

            <div className="analytics-options">
                <div className="analytics-option">
                    <input type="checkbox" id="workouts" />
                    <label htmlFor="workouts">Workout Tracking</label>
                </div>
                <div className="analytics-option">
                    <input type="checkbox" id="nutrition" />
                    <label htmlFor="nutrition">Nutrition Tracking</label>
                </div>
            </div>
        </div>
    );
};

/**
 * Stub component for the Journey step with substeps
 */
const Journey: React.FC = () => {
    const {
        isCurrentStep,
        isCurrentSubstep,
        goToSubstep,
        nextSubstep,
        prevSubstep,
        markStepValid,
        markStepCompleted,
        markSubstepValid,
        markSubstepCompleted,
        state
    } = useNavigation();

    const isActive = isCurrentStep(RegistrationStepId.JOURNEY);

    // Set initial substep if none selected
    useEffect(() => {
        if (isActive && !state.currentSubstep) {
            goToSubstep(JourneySubstepId.GOALS);
        }
    }, [isActive, state.currentSubstep, goToSubstep]);

    // Mark step as valid when all substeps are valid
    useEffect(() => {
        if (isActive) {
            const allSubstepsValid = Object.values(JourneySubstepId).every(
                substep => state.substepProgress[substep].valid
            );

            markStepValid(RegistrationStepId.JOURNEY, allSubstepsValid);

            if (allSubstepsValid) {
                markStepCompleted(RegistrationStepId.JOURNEY, true);
            }
        }
    }, [isActive, state, markStepValid, markStepCompleted]);

    // For the stub, we'll mark each substep as valid right away
    useEffect(() => {
        if (isActive && state.currentSubstep) {
            markSubstepValid(state.currentSubstep, true);
            markSubstepCompleted(state.currentSubstep, true);
        }
    }, [isActive, state.currentSubstep, markSubstepValid, markSubstepCompleted]);

    // This will be replaced with the actual Journey component later
    if (!isActive) {
        return null;
    }

    const renderCurrentSubstep = () => {
        if (!state.currentSubstep) {
            return null;
        }

        switch (state.currentSubstep) {
            case JourneySubstepId.GOALS:
                return <GoalsSubstep />;
            case JourneySubstepId.EQUIPMENT:
                return <EquipmentSubstep />;
            case JourneySubstepId.TIME_COMMITMENT:
                return <TimeCommitmentSubstep />;
            case JourneySubstepId.MEDICAL:
                return <MedicalSubstep />;
            case JourneySubstepId.ANALYTICS:
                return <AnalyticsSubstep />;
            default:
                return null;
        }
    };

    return (
        <div className="registration-step journey-step">
            <h1>Create Your Fitness Journey</h1>

            <div className="journey-progress">
                {Object.values(JourneySubstepId).map((substep) => (
                    <div
                        key={substep}
                        className={`journey-progress-item ${isCurrentSubstep(substep) ? 'active' : ''} ${state.substepProgress[substep].completed ? 'completed' : ''}`}
                        onClick={() => goToSubstep(substep)}
                    >
                        {substep}
                    </div>
                ))}
            </div>

            <div className="step-content">
                {renderCurrentSubstep()}
            </div>

            <div className="step-controls">
                <RegistrationButton
                    type="custom"
                    label="Previous"
                    onClick={prevSubstep}
                />
                <RegistrationButton
                    type="custom"
                    label="Next"
                    onClick={nextSubstep}
                />
            </div>
        </div>
    );
};

export default Journey; 
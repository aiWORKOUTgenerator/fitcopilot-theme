import React, { useEffect, useState } from 'react';
import { useNavigation } from '../../context';
import { RegistrationStepId } from '../../types';
import RegistrationButton from '../RegistrationButton';

/**
 * Stub component for the Experience Level step
 */
const ExperienceLevel: React.FC = () => {
    const { isCurrentStep, markStepValid, markStepCompleted } = useNavigation();
    const isActive = isCurrentStep(RegistrationStepId.EXPERIENCE_LEVEL);

    // Simple state for the stub
    const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

    // Update validity when selection changes
    useEffect(() => {
        if (isActive) {
            const isValid = selectedLevel !== null;
            markStepValid(RegistrationStepId.EXPERIENCE_LEVEL, isValid);

            // Mark as completed when valid
            if (isValid) {
                markStepCompleted(RegistrationStepId.EXPERIENCE_LEVEL, true);
            }
        }
    }, [isActive, selectedLevel, markStepValid, markStepCompleted]);

    // This will be replaced with the actual ExperienceLevel component later
    if (!isActive) {
        return null;
    }

    const levels = [
        { id: 'beginner', label: 'Beginner' },
        { id: 'intermediate', label: 'Intermediate' },
        { id: 'advanced', label: 'Advanced' },
    ];

    return (
        <div className="registration-step experience-level-step">
            <h1>What's your fitness experience level?</h1>

            <div className="step-content">
                <div className="experience-levels">
                    {levels.map((level) => (
                        <div
                            key={level.id}
                            className={`experience-level-card ${selectedLevel === level.id ? 'selected' : ''}`}
                            onClick={() => setSelectedLevel(level.id)}
                        >
                            <h3>{level.label}</h3>
                        </div>
                    ))}
                </div>
            </div>

            <div className="step-controls">
                <RegistrationButton type="back" />
                <RegistrationButton type="next" disabled={!selectedLevel} />
            </div>
        </div>
    );
};

export default ExperienceLevel; 
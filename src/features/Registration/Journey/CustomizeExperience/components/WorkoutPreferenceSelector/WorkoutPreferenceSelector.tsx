import { Check, Zap } from 'lucide-react';
import React, { forwardRef, useEffect, useState } from 'react';
import AccordionSection, { AccordionSectionRef } from '../../../components/AccordionSection';
import { useJourney } from '../../../components/JourneyContext';
import { loadCustomizationData, updateCustomizationSection } from '../../utils/customizationStorage';
import ConfirmButton from '../shared/ConfirmButton';
import './WorkoutPreferenceSelector.scss';

// Exercise types for preferences
const EXERCISE_TYPES = [
    'Barbell Compound Exercises',
    'Dumbbell Exercises',
    'Kettlebell Movements',
    'Bodyweight Exercises',
    'Machine Exercises',
    'Cardio Sessions',
    'HIIT Workouts',
    'Mobility & Flexibility Work',
    'Olympic Lifts',
    'Pilates-Based Movements',
    'Plyometrics',
    'Core-Focused Exercises'
];

interface WorkoutPreferenceSelectorProps {
    onValidChange: (isValid: boolean) => void;
    isCompleted?: boolean;
    onConfirm: () => void;
}

/**
 * Component for selecting workout exercise preferences
 */
const WorkoutPreferenceSelector = forwardRef<AccordionSectionRef, WorkoutPreferenceSelectorProps>(({
    onValidChange,
    isCompleted = false,
    onConfirm
}, ref) => {
    const { registrationData, updateRegistrationData } = useJourney();

    // Get stored data if available
    const storedData = loadCustomizationData();
    const storedWorkoutPreference = storedData?.workoutPreference || {};

    // Initialize state from stored data, falling back to registrationData if needed
    const [preferredExercises, setPreferredExercises] = useState<string[]>(
        storedWorkoutPreference.preferredExerciseTypes || registrationData.preferredExerciseTypes || []
    );

    const [avoidExercises, setAvoidExercises] = useState<string[]>(
        storedWorkoutPreference.avoidsExerciseTypes || registrationData.avoidsExerciseTypes || []
    );

    const [otherPreferences, setOtherPreferences] = useState<string>(
        storedWorkoutPreference.otherPreferences || registrationData.otherWorkoutPreferences || ''
    );

    const [isValid, setIsValid] = useState(false);

    // Initial validation on component mount
    useEffect(() => {
        const valid = preferredExercises.length > 0 || otherPreferences.trim().length > 0;
        setIsValid(valid);
        onValidChange(valid);
    }, []);  // eslint-disable-line react-hooks/exhaustive-deps

    // Update validation status when selections change
    useEffect(() => {
        const valid = preferredExercises.length > 0 || otherPreferences.trim().length > 0;
        setIsValid(valid);
        onValidChange(valid);

        // Update registration data
        updateRegistrationData({
            preferredExerciseTypes: preferredExercises,
            avoidsExerciseTypes: avoidExercises,
            otherWorkoutPreferences: otherPreferences
        });

        // Persist to local storage
        updateCustomizationSection('workoutPreference', {
            preferredExerciseTypes: preferredExercises,
            avoidsExerciseTypes: avoidExercises,
            otherPreferences
        });
    }, [preferredExercises, avoidExercises, otherPreferences, onValidChange, updateRegistrationData]);

    // Toggle preferred exercise
    const togglePreferredExercise = (exercise: string) => {
        setPreferredExercises(prev => {
            if (prev.includes(exercise)) {
                return prev.filter(e => e !== exercise);
            }

            // If adding to preferred, remove from avoid if present
            if (avoidExercises.includes(exercise)) {
                setAvoidExercises(prev => prev.filter(e => e !== exercise));
            }

            return [...prev, exercise];
        });
    };

    // Toggle avoided exercise
    const toggleAvoidExercise = (exercise: string) => {
        setAvoidExercises(prev => {
            if (prev.includes(exercise)) {
                return prev.filter(e => e !== exercise);
            }

            // If adding to avoid, remove from preferred if present
            if (preferredExercises.includes(exercise)) {
                setPreferredExercises(prev => prev.filter(e => e !== exercise));
            }

            return [...prev, exercise];
        });
    };

    // Prepare accordion title with completion indicator
    const sectionTitle = isCompleted ? (
        <div className="flex items-center">
            Workout Preferences
            <span className="ml-2 text-xs bg-emerald-800/30 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-700/50 flex items-center">
                <Check size={12} className="mr-1" />
                Completed
            </span>
        </div>
    ) : 'Workout Preferences';

    return (
        <AccordionSection
            ref={ref}
            title={sectionTitle}
            icon={<Zap size={18} className={isCompleted ? 'text-emerald-400' : 'text-cyan-300'} />}
            defaultOpen={false}
        >
            <div className="workout-preference-selector">
                <p className="section-description">
                    Select the types of exercises you prefer and those you'd like to avoid
                </p>

                {/* Exercise type preferences */}
                <div className="preference-sections">
                    <div className="preference-section">
                        <h4 className="section-subtitle">Preferred Exercise Types</h4>
                        <p className="section-subdescription">
                            Select exercises you enjoy and would like to include
                        </p>

                        <div className="exercise-options">
                            {EXERCISE_TYPES.map((exercise, index) => (
                                <div
                                    key={`prefer-${index}`}
                                    className={`exercise-option prefer ${preferredExercises.includes(exercise) ? 'selected' : ''}`}
                                    onClick={() => togglePreferredExercise(exercise)}
                                    role="checkbox"
                                    aria-checked={preferredExercises.includes(exercise)}
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            togglePreferredExercise(exercise);
                                        }
                                    }}
                                >
                                    <div className="option-checkbox">
                                        {preferredExercises.includes(exercise) && <Check size={14} />}
                                    </div>
                                    <span className="option-label">{exercise}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="preference-section">
                        <h4 className="section-subtitle">Exercises to Avoid</h4>
                        <p className="section-subdescription">
                            Select exercises you dislike or want to exclude
                        </p>

                        <div className="exercise-options">
                            {EXERCISE_TYPES.map((exercise, index) => (
                                <div
                                    key={`avoid-${index}`}
                                    className={`exercise-option avoid ${avoidExercises.includes(exercise) ? 'selected' : ''}`}
                                    onClick={() => toggleAvoidExercise(exercise)}
                                    role="checkbox"
                                    aria-checked={avoidExercises.includes(exercise)}
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            toggleAvoidExercise(exercise);
                                        }
                                    }}
                                >
                                    <div className="option-checkbox">
                                        {avoidExercises.includes(exercise) && <Check size={14} />}
                                    </div>
                                    <span className="option-label">{exercise}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Other preferences input */}
                <div className="other-preferences">
                    <label htmlFor="other-preferences" className="other-label">
                        Additional exercise preferences or restrictions
                    </label>
                    <textarea
                        id="other-preferences"
                        className="other-input"
                        placeholder="Any specific exercises you love/hate or any physical restrictions we should know about?"
                        rows={3}
                        value={otherPreferences}
                        onChange={(e) => setOtherPreferences(e.target.value)}
                    />
                </div>

                {/* Selection summary */}
                {(preferredExercises.length > 0 || avoidExercises.length > 0) && (
                    <div className="selection-summary">
                        <div className="summary-text">
                            {preferredExercises.length > 0 && (
                                <span className="mr-2">
                                    {preferredExercises.length} preferred exercise type{preferredExercises.length !== 1 ? 's' : ''}
                                </span>
                            )}
                            {avoidExercises.length > 0 && (
                                <span>
                                    {avoidExercises.length} exercise type{avoidExercises.length !== 1 ? 's' : ''} to avoid
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Confirm button */}
                <ConfirmButton
                    isValid={isValid}
                    onConfirm={onConfirm}
                    validationMessage="Please select at least one preferred exercise type or specify your preferences"
                />
            </div>
        </AccordionSection>
    );
});

WorkoutPreferenceSelector.displayName = 'WorkoutPreferenceSelector';

export default WorkoutPreferenceSelector; 
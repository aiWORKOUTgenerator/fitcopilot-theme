import { Check } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { EXERCISE_TYPES, ExerciseType, FOCUS_AREAS, WORKOUT_TYPES } from '../../constants/workoutOptions';
import { useCustomization } from '../../context/CustomizationContext';
import './WorkoutPreferenceSelector.scss';

/**
 * Enhanced workout preference selector component using the centralized CustomizationContext
 */
const WorkoutPreferenceSelector: React.FC<{ setIsValid?: (isValid: boolean) => void }> = ({
    setIsValid
}) => {
    const {
        workoutPreferenceData,
        updateWorkoutPreferenceData,
        saveAllData
    } = useCustomization();

    // Initialize state from context data
    const [preferredExercises, setPreferredExercises] = useState<string[]>(
        workoutPreferenceData?.preferredExercises || []
    );

    const [preferredWorkoutTypes, setPreferredWorkoutTypes] = useState<string[]>(
        workoutPreferenceData?.preferredWorkoutTypes || []
    );

    const [avoidedExercises, setAvoidedExercises] = useState<string[]>(
        workoutPreferenceData?.avoidedExercises || []
    );

    const [focusAreas, setFocusAreas] = useState<string[]>(
        workoutPreferenceData?.focusAreas || []
    );

    // Update validation status and context when selections change
    useEffect(() => {
        // Valid if at least one preference or focus area is selected
        const isValid = preferredExercises.length > 0 ||
            preferredWorkoutTypes.length > 0 ||
            focusAreas.length > 0;

        if (setIsValid) {
            setIsValid(isValid);
        }

        // Update context data
        updateWorkoutPreferenceData({
            preferredExercises,
            preferredWorkoutTypes,
            avoidedExercises,
            focusAreas
        });

        // Save to storage
        saveAllData();
    }, [preferredExercises, preferredWorkoutTypes, avoidedExercises, focusAreas, updateWorkoutPreferenceData, saveAllData, setIsValid]);

    // Toggle exercise type selection
    const toggleExerciseType = (exerciseType: string, listType: 'preferred' | 'avoided') => {
        if (listType === 'preferred') {
            setPreferredExercises(prev => {
                if (prev.includes(exerciseType)) {
                    return prev.filter(type => type !== exerciseType);
                }

                // Remove from avoided list if it's being added to preferred
                if (avoidedExercises.includes(exerciseType)) {
                    setAvoidedExercises(prev => prev.filter(type => type !== exerciseType));
                }

                return [...prev, exerciseType];
            });
        } else {
            setAvoidedExercises(prev => {
                if (prev.includes(exerciseType)) {
                    return prev.filter(type => type !== exerciseType);
                }

                // Remove from preferred list if it's being added to avoided
                if (preferredExercises.includes(exerciseType)) {
                    setPreferredExercises(prev => prev.filter(type => type !== exerciseType));
                }

                return [...prev, exerciseType];
            });
        }
    };

    // Toggle focus area selection
    const toggleFocusArea = (area: string) => {
        setFocusAreas(prev => {
            if (prev.includes(area)) {
                return prev.filter(a => a !== area);
            }
            return [...prev, area];
        });
    };

    // Toggle workout type selection
    const toggleWorkoutType = (type: string) => {
        setPreferredWorkoutTypes(prev => {
            if (prev.includes(type)) {
                return prev.filter(t => t !== type);
            }
            return [...prev, type];
        });
    };

    return (
        <div className="workout-preference-selector">
            {/* Preferred exercise types */}
            <div className="section-group">
                <h4 className="section-subtitle">Preferred Exercise Types</h4>
                <p className="section-description">
                    Select exercises you enjoy or prefer (optional)
                </p>

                <div className="exercise-grid">
                    {EXERCISE_TYPES.map((exercise: ExerciseType, index: number) => (
                        <div
                            key={index}
                            className={`exercise-option ${preferredExercises.includes(exercise.name) ? 'preferred' : ''} ${avoidedExercises.includes(exercise.name) ? 'avoided' : ''}`}
                        >
                            <div className="exercise-name">{exercise.name}</div>
                            <div className="preference-actions">
                                <button
                                    className={`prefer-btn ${preferredExercises.includes(exercise.name) ? 'selected' : ''}`}
                                    onClick={() => toggleExerciseType(exercise.name, 'preferred')}
                                    aria-label={`Prefer ${exercise.name}`}
                                    title="I like this"
                                >
                                    {preferredExercises.includes(exercise.name) && <Check size={14} />}
                                    <span>Like</span>
                                </button>
                                <button
                                    className={`avoid-btn ${avoidedExercises.includes(exercise.name) ? 'selected' : ''}`}
                                    onClick={() => toggleExerciseType(exercise.name, 'avoided')}
                                    aria-label={`Avoid ${exercise.name}`}
                                    title="I prefer to avoid this"
                                >
                                    {avoidedExercises.includes(exercise.name) && <Check size={14} />}
                                    <span>Avoid</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Workout types */}
            <div className="section-group">
                <h4 className="section-subtitle">Workout Types</h4>
                <p className="section-description">
                    Select the types of workouts you prefer
                </p>

                <div className="workout-types">
                    {WORKOUT_TYPES.map((type: string, index: number) => (
                        <div
                            key={index}
                            className={`workout-type ${preferredWorkoutTypes.includes(type) ? 'selected' : ''}`}
                            onClick={() => toggleWorkoutType(type)}
                            role="checkbox"
                            aria-checked={preferredWorkoutTypes.includes(type)}
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    toggleWorkoutType(type);
                                }
                            }}
                        >
                            {type}
                        </div>
                    ))}
                </div>
            </div>

            {/* Focus areas */}
            <div className="section-group">
                <h4 className="section-subtitle">Focus Areas</h4>
                <p className="section-description">
                    Select body areas you want to focus on
                </p>

                <div className="focus-areas">
                    {FOCUS_AREAS.map((area: string, index: number) => (
                        <div
                            key={index}
                            className={`focus-area ${focusAreas.includes(area) ? 'selected' : ''}`}
                            onClick={() => toggleFocusArea(area)}
                            role="checkbox"
                            aria-checked={focusAreas.includes(area)}
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    toggleFocusArea(area);
                                }
                            }}
                        >
                            {area}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WorkoutPreferenceSelector; 
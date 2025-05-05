import { Target } from 'lucide-react';
import React, { forwardRef, useEffect, useState } from 'react';
import { WorkoutGoal } from '../../../types';
import { SectionCard, SelectionSummary } from '../../shared/components';
import { selectorStorage, validationUtils } from '../../shared/utils';
import { AccordionSectionRef } from '../AccordionSection';
import { useJourney } from '../JourneyContext';
import JourneySelector from '../JourneySelector';
import { GOAL_OPTIONS, MAX_GOALS, MIN_GOALS, STORAGE_KEY } from './constants';
import './GoalSelector.scss';
import { GoalSelectorProps, GoalSelectorState } from './types';

/**
 * GoalSelector component for selecting workout goals
 */
const GoalSelector = forwardRef<AccordionSectionRef, GoalSelectorProps>(({
    onValidChange,
    isCompleted = false,
    onConfirm
}, ref) => {
    const { registrationData, updateRegistrationData } = useJourney();

    // Initialize state from registration data or storage
    const [selectedGoals, setSelectedGoals] = useState<WorkoutGoal[]>(() => {
        // First try to get from registration data
        if (registrationData.goals && registrationData.goals.length > 0) {
            return registrationData.goals;
        }

        // Fall back to storage
        try {
            const stored = sessionStorage.getItem(STORAGE_KEY);
            if (stored) {
                const storedState = JSON.parse(stored) as GoalSelectorState;
                return storedState.selectedGoals || [];
            }
        } catch (error) {
            console.error('Failed to load stored goal selector data:', error);
        }

        return [];
    });

    // Track validity state
    const [isValid, setIsValid] = useState<boolean>(false);

    // Create storage utility
    const storage = selectorStorage.useSelectorStorage<GoalSelectorState>(
        STORAGE_KEY,
        { selectedGoals: [] },
        'goals'
    );

    // Validate selection whenever it changes
    useEffect(() => {
        const isValidSelection = validationUtils.validateSelectionRange(
            selectedGoals,
            MIN_GOALS,
            MAX_GOALS
        );

        setIsValid(isValidSelection);

        // Sync with context and storage
        if (selectedGoals.length > 0) {
            storage.syncWithContext({ selectedGoals });

            // You can also update directly if needed for compatibility
            updateRegistrationData({ goals: selectedGoals });
        }
    }, [selectedGoals, storage, updateRegistrationData]);

    // Forward validity state to parent
    useEffect(() => {
        onValidChange(isValid);
    }, [isValid, onValidChange]);

    // Handle toggling a goal
    const toggleGoal = (goal: WorkoutGoal) => {
        setSelectedGoals(prev => {
            // If already selected, remove it
            if (prev.includes(goal)) {
                return prev.filter(g => g !== goal);
            }

            // If max goals reached, replace oldest with the new one
            if (prev.length >= MAX_GOALS) {
                return [prev[prev.length - 1], goal];
            }

            // Otherwise add the goal
            return [...prev, goal];
        });
    };

    return (
        <JourneySelector
            ref={ref}
            selectorId="goals"
            title="Define Your Goals"
            icon={<Target size={24} />}
            description={`Select up to ${MAX_GOALS} goals that you want to focus on (at least ${MIN_GOALS} required)`}
            accentColor="lime"
            isCompleted={isCompleted}
            onValidChange={onValidChange}
            onConfirm={onConfirm}
        >
            <div className="goal-options">
                <div className="goal-options-grid">
                    {GOAL_OPTIONS.map((option) => (
                        <SectionCard
                            key={option.id}
                            id={option.id}
                            title={option.title}
                            description={option.description}
                            icon={option.icon}
                            isSelected={selectedGoals.includes(option.value)}
                            accentColor="lime"
                            onToggle={() => toggleGoal(option.value)}
                            testId={`goal-option-${option.id}`}
                        />
                    ))}
                </div>

                <SelectionSummary
                    selectedCount={selectedGoals.length}
                    singularLabel="goal selected"
                    pluralLabel="goals selected"
                    accentColor="lime"
                    maxAllowed={MAX_GOALS}
                />
            </div>
        </JourneySelector>
    );
});

GoalSelector.displayName = 'GoalSelector';

export default GoalSelector; 
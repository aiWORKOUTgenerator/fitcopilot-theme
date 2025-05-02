import { Check } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { WorkoutGoal } from '../../types';
import { useJourney } from './JourneyContext';
import { JourneyStepFeature } from './JourneyStepCard';

interface GoalSelectorProps {
    features: JourneyStepFeature[];
    onValidChange: (isValid: boolean) => void;
}

// Map features to workout goals
const featureToGoalMap: Record<string, WorkoutGoal> = {
    "Strength Building": WorkoutGoal.STRENGTH,
    "Fat Loss": WorkoutGoal.WEIGHT_LOSS,
    "Muscle Growth": WorkoutGoal.MUSCLE_GAIN,
    "General Fitness": WorkoutGoal.OVERALL_FITNESS
};

const GoalSelector: React.FC<GoalSelectorProps> = ({ features, onValidChange }) => {
    const { registrationData, updateRegistrationData } = useJourney();
    const [selectedGoals, setSelectedGoals] = useState<WorkoutGoal[]>(
        registrationData.goals || []
    );

    // Update validation status whenever selected goals change
    useEffect(() => {
        const isValid = selectedGoals.length > 0 && selectedGoals.length <= 2;
        onValidChange(isValid);

        // Update registration data when goals change
        if (selectedGoals.length > 0) {
            updateRegistrationData({ goals: selectedGoals });
        }
    }, [selectedGoals, onValidChange, updateRegistrationData]);

    const toggleGoal = (feature: JourneyStepFeature) => {
        const goal = featureToGoalMap[feature.title];
        if (!goal) return;

        setSelectedGoals(prev => {
            // If already selected, remove it
            if (prev.includes(goal)) {
                return prev.filter(g => g !== goal);
            }

            // If we already have 2 goals and trying to add more, replace the oldest
            if (prev.length >= 2) {
                return [prev[1], goal]; // Keep the second goal and add the new one
            }

            // Otherwise add the goal
            return [...prev, goal];
        });
    };

    // Check if a feature is selected
    const isSelected = (feature: JourneyStepFeature): boolean => {
        const goal = featureToGoalMap[feature.title];
        return goal ? selectedGoals.includes(goal) : false;
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-4">
                <p className="text-gray-300 text-sm">
                    Select up to 2 goals that you want to focus on
                    <span className="text-lime-400 ml-1">
                        (at least 1 required)
                    </span>
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        onClick={() => toggleGoal(feature)}
                        className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-300 cursor-pointer
              ${isSelected(feature)
                                ? 'bg-gray-700/50 border-2 border-lime-400 shadow-lg shadow-lime-400/10'
                                : 'bg-gray-700/30 border-2 border-transparent hover:bg-gray-700/40'
                            }
            `}
                        role="button"
                        tabIndex={0}
                        aria-pressed={isSelected(feature)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                toggleGoal(feature);
                            }
                        }}
                    >
                        <div
                            className={`bg-gray-800 p-2 rounded-lg transition-transform relative
                ${isSelected(feature) ? 'scale-110 bg-lime-900/50' : ''}
              `}
                        >
                            {feature.icon}
                            {isSelected(feature) && (
                                <div className="absolute -top-2 -right-2 w-5 h-5 bg-lime-400 rounded-full flex items-center justify-center">
                                    <Check size={12} className="text-gray-900" />
                                </div>
                            )}
                        </div>
                        <div>
                            <h4 className={`font-semibold mb-1 ${isSelected(feature) ? 'text-lime-300' : 'text-white'}`}>
                                {feature.title}
                            </h4>
                            <p className="text-sm text-gray-400">
                                {feature.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {selectedGoals.length > 0 && (
                <div className="text-center text-sm mt-4">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-lime-400/10 border border-lime-400/30">
                        <span className="text-lime-300">
                            {selectedGoals.length === 1
                                ? '1 goal selected'
                                : '2 goals selected'}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GoalSelector; 
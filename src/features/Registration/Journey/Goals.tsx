import { ArrowRight, ChevronLeft, Dumbbell, Flame, Heart, Zap } from 'lucide-react';
import React, { useState } from 'react';
import { RegistrationButton, SectionTitle } from '../components';
import { RegistrationStepProps, WorkoutGoal } from '../types';

interface GoalOption {
    id: WorkoutGoal;
    label: string;
    description: string;
    icon: React.ReactNode;
}

const GOAL_OPTIONS: GoalOption[] = [
    {
        id: WorkoutGoal.WEIGHT_LOSS,
        label: 'Weight Loss',
        description: 'Burn calories and reduce body fat',
        icon: <Flame size={24} className="text-orange-400" />
    },
    {
        id: WorkoutGoal.MUSCLE_GAIN,
        label: 'Muscle Gain',
        description: 'Build muscle mass and strength',
        icon: <Dumbbell size={24} className="text-blue-400" />
    },
    {
        id: WorkoutGoal.ENDURANCE,
        label: 'Endurance',
        description: 'Improve stamina and cardiovascular health',
        icon: <Heart size={24} className="text-red-400" />
    },
    {
        id: WorkoutGoal.OVERALL_FITNESS,
        label: 'Overall Fitness',
        description: 'Balance of strength, endurance, and flexibility',
        icon: <Zap size={24} className="text-lime-400" />
    }
];

/**
 * Goals component - First substep in the Journey flow
 * Allows users to select their primary fitness goals
 */
const Goals: React.FC<RegistrationStepProps> = ({
    data,
    updateData,
    onNext,
    onBack
}) => {
    const [selectedGoals, setSelectedGoals] = useState<WorkoutGoal[]>(
        data?.goals as WorkoutGoal[] || []
    );

    // Toggle a goal selection
    const toggleGoal = (goalId: WorkoutGoal) => {
        setSelectedGoals(prev => {
            if (prev.includes(goalId)) {
                return prev.filter(id => id !== goalId);
            } else {
                return [...prev, goalId];
            }
        });
    };

    // Handle saving goals and proceeding to next step
    const handleNext = () => {
        updateData({
            ...data,
            goals: selectedGoals
        });

        if (onNext) {
            onNext();
        }
    };

    return (
        <div className="goals-substep">
            <SectionTitle
                title="What are your fitness goals?"
                subtitle="Select all that apply. This helps us tailor your workout plan to match your objectives."
            />

            <div className="goals-grid">
                {GOAL_OPTIONS.map(goal => (
                    <div
                        key={goal.id}
                        className={`goal-card ${selectedGoals.includes(goal.id) ? 'goal-card--selected' : ''}`}
                        onClick={() => toggleGoal(goal.id)}
                    >
                        <div className="goal-card__icon">{goal.icon}</div>
                        <div className="goal-card__content">
                            <h3 className="goal-card__title">{goal.label}</h3>
                            <p className="goal-card__description">{goal.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="goals-navigation">
                <RegistrationButton
                    onClick={onBack}
                    variant="secondary"
                    size="medium"
                    leftIcon={<ChevronLeft className="h-5 w-5" />}
                >
                    Back
                </RegistrationButton>

                <RegistrationButton
                    onClick={handleNext}
                    variant="primary"
                    size="medium"
                    rightIcon={<ArrowRight className="h-5 w-5" />}
                    disabled={selectedGoals.length === 0}
                >
                    Next
                </RegistrationButton>
            </div>

            <style jsx>{`
                .goals-substep {
                    padding: 2rem 0;
                }
                
                .goals-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    gap: 1rem;
                    margin: 2rem 0;
                }
                
                .goal-card {
                    background-color: rgba(23, 23, 23, 0.5);
                    border: 2px solid rgba(75, 85, 99, 0.5);
                    border-radius: 0.75rem;
                    padding: 1.5rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                
                .goal-card:hover {
                    border-color: rgba(134, 239, 172, 0.3);
                    transform: translateY(-2px);
                }
                
                .goal-card--selected {
                    border-color: #10b981;
                    background-color: rgba(16, 185, 129, 0.1);
                }
                
                .goal-card__icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 48px;
                    height: 48px;
                    background-color: rgba(0, 0, 0, 0.3);
                    border-radius: 50%;
                }
                
                .goal-card__title {
                    font-size: 1.125rem;
                    font-weight: 600;
                    color: white;
                    margin-bottom: 0.25rem;
                }
                
                .goal-card__description {
                    font-size: 0.875rem;
                    color: #9ca3af;
                }
                
                .goals-navigation {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 2rem;
                }
            `}</style>
        </div>
    );
};

export default Goals; 
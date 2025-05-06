import { ArrowRight, Calendar, ChevronLeft, Clock } from 'lucide-react';
import React from 'react';
import { RegistrationButton, SectionTitle } from '../../components';
import { RegistrationStepProps, SectionId } from '../../types';

/**
 * TimeCommitment component - Substep in the Journey flow for time commitment selection
 */
const TimeCommitment: React.FC<RegistrationStepProps> = ({
    data,
    updateData,
    onNext,
    onBack
}) => {
    // Handle saving and proceeding to next step
    const handleNext = () => {
        // Update data with dummy time commitment selection
        updateData({
            ...data,
            [SectionId.TIME_DAYS]: { daysPerWeek: 3 },
            [SectionId.TIME_DURATION]: { minutesPerSession: 45 },
            completedCustomizationSections: [
                ...(data.completedCustomizationSections || []),
                'time_commitment_completed'
            ]
        });

        if (onNext) {
            onNext();
        }
    };

    return (
        <div className="time-commitment-substep">
            <SectionTitle
                title="How much time can you commit to working out?"
                subtitle="Tell us about your availability. This helps us create a realistic workout schedule for you."
            />

            <div className="time-container">
                <div className="time-card">
                    <div className="time-card__icon">
                        <Calendar size={24} className="text-purple-400" />
                    </div>
                    <div className="time-card__content">
                        <h3 className="time-card__title">Days Per Week</h3>
                        <p className="time-card__description">
                            This is a placeholder for the days per week selection. In the actual implementation,
                            this would allow users to select how many days per week they can commit to working out.
                        </p>
                    </div>
                </div>

                <div className="time-card">
                    <div className="time-card__icon">
                        <Clock size={24} className="text-purple-400" />
                    </div>
                    <div className="time-card__content">
                        <h3 className="time-card__title">Workout Duration</h3>
                        <p className="time-card__description">
                            This is a placeholder for the workout duration selection. In the actual implementation,
                            this would allow users to select how long each workout session should be.
                        </p>
                    </div>
                </div>
            </div>

            <div className="time-navigation">
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
                >
                    Next
                </RegistrationButton>
            </div>

            <style jsx>{`
                .time-commitment-substep {
                    padding: 2rem 0;
                }
                
                .time-container {
                    margin: 2rem 0;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                
                .time-card {
                    background-color: rgba(23, 23, 23, 0.5);
                    border: 2px solid rgba(75, 85, 99, 0.5);
                    border-radius: 0.75rem;
                    padding: 2rem;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                
                .time-card__icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 48px;
                    height: 48px;
                    background-color: rgba(0, 0, 0, 0.3);
                    border-radius: 50%;
                }
                
                .time-card__title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: white;
                    margin-bottom: 0.5rem;
                }
                
                .time-card__description {
                    font-size: 0.875rem;
                    color: #9ca3af;
                }
                
                .time-navigation {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 2rem;
                }
            `}</style>
        </div>
    );
};

export default TimeCommitment; 
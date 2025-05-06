import { ArrowRight, ChevronLeft, Home } from 'lucide-react';
import React from 'react';
import { RegistrationButton, SectionTitle } from '../../components';
import { RegistrationStepProps, SectionId } from '../../types';

/**
 * Equipment component - Substep in the Journey flow for equipment selection
 */
const Equipment: React.FC<RegistrationStepProps> = ({
    data,
    updateData,
    onNext,
    onBack
}) => {
    // Handle saving and proceeding to next step
    const handleNext = () => {
        // Update data with dummy equipment selection
        updateData({
            ...data,
            [SectionId.EQUIPMENT_HOME]: { hasEquipment: true },
            [SectionId.EQUIPMENT_GYM]: { hasEquipment: false },
            [SectionId.EQUIPMENT_TRAVEL]: { hasEquipment: false },
            completedCustomizationSections: [
                ...(data.completedCustomizationSections || []),
                'customize_experience_completed'
            ]
        });

        if (onNext) {
            onNext();
        }
    };

    return (
        <div className="equipment-substep">
            <SectionTitle
                title="What equipment do you have access to?"
                subtitle="Tell us about the equipment you have available. This helps us tailor your workouts accordingly."
            />

            <div className="equipment-container">
                <div className="equipment-card">
                    <div className="equipment-card__icon">
                        <Home size={24} className="text-blue-400" />
                    </div>
                    <div className="equipment-card__content">
                        <h3 className="equipment-card__title">Equipment Placeholder</h3>
                        <p className="equipment-card__description">
                            This is a placeholder for the Equipment component. In the actual implementation,
                            this would allow users to select equipment they have access to at home, gym,
                            or while traveling.
                        </p>
                    </div>
                </div>
            </div>

            <div className="equipment-navigation">
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
                .equipment-substep {
                    padding: 2rem 0;
                }
                
                .equipment-container {
                    margin: 2rem 0;
                }
                
                .equipment-card {
                    background-color: rgba(23, 23, 23, 0.5);
                    border: 2px solid rgba(75, 85, 99, 0.5);
                    border-radius: 0.75rem;
                    padding: 2rem;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                
                .equipment-card__icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 48px;
                    height: 48px;
                    background-color: rgba(0, 0, 0, 0.3);
                    border-radius: 50%;
                }
                
                .equipment-card__title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: white;
                    margin-bottom: 0.5rem;
                }
                
                .equipment-card__description {
                    font-size: 0.875rem;
                    color: #9ca3af;
                }
                
                .equipment-navigation {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 2rem;
                }
            `}</style>
        </div>
    );
};

export default Equipment; 
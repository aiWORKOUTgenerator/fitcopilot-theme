import { ArrowRight, ChevronLeft, Heart } from 'lucide-react';
import React from 'react';
import { RegistrationButton, SectionTitle } from '../components';
import { RegistrationStepProps, SectionId } from '../types';

/**
 * CustomizedMedical component - Substep in the Journey flow for medical information
 */
const CustomizedMedical: React.FC<RegistrationStepProps> = ({
    data,
    updateData,
    onNext,
    onBack
}) => {
    // Handle saving and proceeding to next step
    const handleNext = () => {
        // Update data with dummy medical information
        updateData({
            ...data,
            [SectionId.MEDICAL_CONDITIONS]: { hasConditions: false },
            [SectionId.MEDICAL_INJURIES]: { hasInjuries: false },
            [SectionId.MEDICAL_LIMITATIONS]: { hasLimitations: false },
            completedCustomizationSections: [
                ...(data.completedCustomizationSections || []),
                'medical_information_completed'
            ]
        });

        if (onNext) {
            onNext();
        }
    };

    return (
        <div className="medical-substep">
            <SectionTitle
                title="Medical Information"
                subtitle="Tell us about any medical considerations we should be aware of. This helps us create safer workouts for you."
            />

            <div className="medical-container">
                <div className="medical-card">
                    <div className="medical-card__icon">
                        <Heart size={24} className="text-red-400" />
                    </div>
                    <div className="medical-card__content">
                        <h3 className="medical-card__title">Medical Considerations</h3>
                        <p className="medical-card__description">
                            This is a placeholder for the medical information component. In the actual implementation,
                            this would allow users to provide information about medical conditions, injuries, and
                            physical limitations that might affect their workout routine.
                        </p>
                    </div>
                </div>
            </div>

            <div className="medical-disclaimer">
                <p>
                    <strong>Disclaimer:</strong> Your health information is kept confidential and is only used to
                    customize your workout plan. Always consult with a healthcare professional before starting a new
                    exercise program, especially if you have pre-existing medical conditions.
                </p>
            </div>

            <div className="medical-navigation">
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
                .medical-substep {
                    padding: 2rem 0;
                }
                
                .medical-container {
                    margin: 2rem 0;
                }
                
                .medical-card {
                    background-color: rgba(23, 23, 23, 0.5);
                    border: 2px solid rgba(75, 85, 99, 0.5);
                    border-radius: 0.75rem;
                    padding: 2rem;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                
                .medical-card__icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 48px;
                    height: 48px;
                    background-color: rgba(0, 0, 0, 0.3);
                    border-radius: 50%;
                }
                
                .medical-card__title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: white;
                    margin-bottom: 0.5rem;
                }
                
                .medical-card__description {
                    font-size: 0.875rem;
                    color: #9ca3af;
                }
                
                .medical-disclaimer {
                    margin-top: 1.5rem;
                    padding: 1rem;
                    background-color: rgba(255, 255, 255, 0.05);
                    border-radius: 0.5rem;
                    font-size: 0.75rem;
                    color: #9ca3af;
                }
                
                .medical-navigation {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 2rem;
                }
            `}</style>
        </div>
    );
};

export default CustomizedMedical; 
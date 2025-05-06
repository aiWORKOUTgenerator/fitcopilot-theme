import { Award, ChevronLeft, ChevronRight, Dumbbell, Zap } from 'lucide-react';
import React, { useState } from 'react';
import { RegistrationButton, SectionTitle } from '../components';
import { useNavigation } from '../context/NavigationContext';
import { ExperienceLevel as ExperienceLevelEnum, RegistrationStepProps } from '../types';
import { experienceLevelToText } from '../utils';
import LevelCard from './components/LevelCard';
import LevelComparison from './components/LevelComparison';
import './ExperienceLevel.scss';

/**
 * Legacy ExperienceLevel component that accepts props for backward compatibility
 */
const ExperienceLevelWithProps: React.FC<RegistrationStepProps> = ({
    data,
    updateData,
    onNext,
    onBack,
    className = '',
}) => {
    // Initialize with props data
    return <ExperienceLevelComponent
        initialExperienceLevel={data?.experienceLevel as ExperienceLevelEnum}
        onLegacyNext={onNext}
        onLegacyBack={onBack}
        updateLegacyData={updateData}
        className={className}
    />;
};

interface ExperienceLevelComponentProps {
    initialExperienceLevel?: ExperienceLevelEnum;
    onLegacyNext?: () => void;
    onLegacyBack?: () => void;
    updateLegacyData?: (data: any) => void;
    className?: string;
}

/**
 * Modern version of the ExperienceLevel component that uses NavigationContext directly
 */
const ExperienceLevelComponent: React.FC<ExperienceLevelComponentProps> = ({
    initialExperienceLevel,
    onLegacyNext,
    onLegacyBack,
    updateLegacyData,
    className = '',
}) => {
    // Get navigation context
    const { nextStep, previousStep, updateRegistrationData, state } = useNavigation();

    // Track which level has focus for comparison display
    const [focusedLevel, setFocusedLevel] = useState<ExperienceLevelEnum | null>(
        initialExperienceLevel || state.registrationData?.experienceLevel as ExperienceLevelEnum || null
    );

    // Handle selecting a level
    const handleSelectLevel = (level: ExperienceLevelEnum) => {
        // Update context data
        updateRegistrationData({ experienceLevel: level });

        // For backward compatibility
        if (updateLegacyData) {
            updateLegacyData({ experienceLevel: level });
        }

        setFocusedLevel(level);
    };

    // Handle next button click
    const handleNext = () => {
        if (onLegacyNext) {
            onLegacyNext();
        } else {
            nextStep();
        }
    };

    // Handle back button click
    const handleBack = () => {
        if (onLegacyBack) {
            onLegacyBack();
        } else {
            previousStep();
        }
    };

    // Determine if next button should be enabled
    const isNextEnabled = !!state.registrationData?.experienceLevel || !!initialExperienceLevel;

    return (
        <div className={`experience-level-step registration-step ${className}`}>
            {/* Background animation with particles */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 z-0">
                <div className="particles-container">
                    <div className="particle particle-1"></div>
                    <div className="particle particle-2"></div>
                    <div className="particle particle-3"></div>
                    <div className="particle particle-4"></div>
                    <div className="particle particle-5"></div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto relative z-20 px-4 py-8">
                <SectionTitle
                    title="What's your fitness experience?"
                    subtitle="Select the option that best describes your current fitness level. This helps us tailor your workout plan to match your experience."
                />

                <div className="level-cards animate-fade-in-up">
                    <LevelCard
                        level={ExperienceLevelEnum.BEGINNER}
                        title={experienceLevelToText(ExperienceLevelEnum.BEGINNER)}
                        description="Just getting started or returning after a long break"
                        icon={<Dumbbell size={24} />}
                        isSelected={state.registrationData?.experienceLevel === ExperienceLevelEnum.BEGINNER || initialExperienceLevel === ExperienceLevelEnum.BEGINNER}
                        onSelect={() => handleSelectLevel(ExperienceLevelEnum.BEGINNER)}
                        onFocus={() => setFocusedLevel(ExperienceLevelEnum.BEGINNER)}
                    />

                    <LevelCard
                        level={ExperienceLevelEnum.INTERMEDIATE}
                        title={experienceLevelToText(ExperienceLevelEnum.INTERMEDIATE)}
                        description="Consistent exercise for at least a few months"
                        icon={<Award size={24} />}
                        isSelected={state.registrationData?.experienceLevel === ExperienceLevelEnum.INTERMEDIATE || initialExperienceLevel === ExperienceLevelEnum.INTERMEDIATE}
                        onSelect={() => handleSelectLevel(ExperienceLevelEnum.INTERMEDIATE)}
                        onFocus={() => setFocusedLevel(ExperienceLevelEnum.INTERMEDIATE)}
                    />

                    <LevelCard
                        level={ExperienceLevelEnum.ADVANCED}
                        title={experienceLevelToText(ExperienceLevelEnum.ADVANCED)}
                        description="Regular training for years with good technique"
                        icon={<Zap size={24} />}
                        isSelected={state.registrationData?.experienceLevel === ExperienceLevelEnum.ADVANCED || initialExperienceLevel === ExperienceLevelEnum.ADVANCED}
                        onSelect={() => handleSelectLevel(ExperienceLevelEnum.ADVANCED)}
                        onFocus={() => setFocusedLevel(ExperienceLevelEnum.ADVANCED)}
                    />
                </div>

                {focusedLevel && (
                    <div className="animate-fade-in">
                        <LevelComparison level={focusedLevel} />
                    </div>
                )}

                <div className="experience-level-navigation animate-fade-in">
                    <div className="experience-level-navigation__buttons">
                        <RegistrationButton
                            onClick={handleBack}
                            variant="secondary"
                            size="medium"
                            leftIcon={<ChevronLeft className="h-5 w-5" />}
                            className="experience-level-navigation__button experience-level-navigation__button--back"
                        >
                            Back
                        </RegistrationButton>

                        <RegistrationButton
                            onClick={handleNext}
                            variant="primary"
                            size="medium"
                            rightIcon={<ChevronRight className="h-5 w-5" />}
                            disabled={!isNextEnabled}
                            className="experience-level-navigation__button experience-level-navigation__button--next"
                        >
                            Next
                        </RegistrationButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Export the legacy component as default for backward compatibility
export default ExperienceLevelWithProps; 
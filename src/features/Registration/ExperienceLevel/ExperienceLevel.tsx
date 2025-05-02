import { Award, Dumbbell, Zap } from 'lucide-react';
import React, { useState } from 'react';
import { NavigationButtons, SectionTitle } from '../components';
import { ExperienceLevel as ExperienceLevelEnum, RegistrationStepProps } from '../types';
import { experienceLevelToText } from '../utils';
import LevelCard from './components/LevelCard';
import LevelComparison from './components/LevelComparison';
import './ExperienceLevel.scss';

interface ExperienceLevelComponentProps extends RegistrationStepProps { }

/**
 * Experience level selection component
 */
const ExperienceLevelComponent: React.FC<ExperienceLevelComponentProps> = ({
    data,
    updateData,
    onNext,
    onBack,
    className = '',
}) => {
    // Track which level has focus for comparison display
    const [focusedLevel, setFocusedLevel] = useState<ExperienceLevelEnum | null>(
        data.experienceLevel || null
    );

    // Handle selecting a level
    const handleSelectLevel = (level: ExperienceLevelEnum) => {
        updateData({ experienceLevel: level });
        setFocusedLevel(level);
    };

    // Determine if next button should be enabled
    const isNextEnabled = !!data.experienceLevel;

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
                        isSelected={data.experienceLevel === ExperienceLevelEnum.BEGINNER}
                        onSelect={() => handleSelectLevel(ExperienceLevelEnum.BEGINNER)}
                        onFocus={() => setFocusedLevel(ExperienceLevelEnum.BEGINNER)}
                    />

                    <LevelCard
                        level={ExperienceLevelEnum.INTERMEDIATE}
                        title={experienceLevelToText(ExperienceLevelEnum.INTERMEDIATE)}
                        description="Consistent exercise for at least a few months"
                        icon={<Award size={24} />}
                        isSelected={data.experienceLevel === ExperienceLevelEnum.INTERMEDIATE}
                        onSelect={() => handleSelectLevel(ExperienceLevelEnum.INTERMEDIATE)}
                        onFocus={() => setFocusedLevel(ExperienceLevelEnum.INTERMEDIATE)}
                    />

                    <LevelCard
                        level={ExperienceLevelEnum.ADVANCED}
                        title={experienceLevelToText(ExperienceLevelEnum.ADVANCED)}
                        description="Regular training for years with good technique"
                        icon={<Zap size={24} />}
                        isSelected={data.experienceLevel === ExperienceLevelEnum.ADVANCED}
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
                    <NavigationButtons
                        onNext={onNext}
                        onBack={onBack}
                        nextDisabled={!isNextEnabled}
                    />
                </div>
            </div>
        </div>
    );
};

export default ExperienceLevelComponent; 
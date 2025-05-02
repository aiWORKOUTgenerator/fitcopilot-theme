import { Check, Info } from 'lucide-react';
import React from 'react';
import { ExperienceLevel } from '../../types';
import { experienceLevelToText } from '../../utils';

interface LevelComparisonProps {
    level: ExperienceLevel;
    className?: string;
}

/**
 * Component that displays details about the selected experience level
 */
const LevelComparison: React.FC<LevelComparisonProps> = ({
    level,
    className = '',
}) => {
    // Define features for each experience level
    const levelFeatures = {
        [ExperienceLevel.BEGINNER]: [
            "Simple workouts focused on proper form and technique",
            "Progressive introduction to different exercise types",
            "Lower intensity to build foundational strength and endurance",
            "Clear demonstrations for all exercises",
            "Detailed guidance on workout execution and pacing",
            "Recovery-focused approach to prevent burnout"
        ],
        [ExperienceLevel.INTERMEDIATE]: [
            "Varied workout structures to challenge your fitness",
            "Periodized training for consistent progress",
            "Targeted exercises for specific muscle groups",
            "Options to increase or decrease intensity",
            "Focus on progressive overload principles",
            "Balance between cardio and strength training"
        ],
        [ExperienceLevel.ADVANCED]: [
            "Complex exercise combinations and supersets",
            "Advanced training techniques like drop sets and rest-pause",
            "Periodized programming with deload weeks",
            "Higher intensity workouts for maximum results",
            "Sport-specific training options available",
            "Customizable workout variables for continued progress"
        ]
    };

    // Get features for the selected level
    const features = levelFeatures[level] || [];

    return (
        <div className={`level-comparison ${className}`}>
            <h3 className="level-comparison__title">
                <Info size={20} />
                {experienceLevelToText(level)} Program Features
            </h3>
            <div className="level-comparison__features">
                {features.map((feature, index) => (
                    <div className="level-comparison__feature" key={index}>
                        <Check size={16} />
                        <p>{feature}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LevelComparison; 
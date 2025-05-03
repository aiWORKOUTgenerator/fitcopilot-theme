import { Layers } from 'lucide-react';
import React from 'react';
import { ExperienceLevel } from '../../../../types';
import { ExperienceLevelIndicatorProps } from '../../types';
import './ExperienceLevelIndicator.scss';

/**
 * Component to display the user's previously selected experience level
 */
const ExperienceLevelIndicator: React.FC<ExperienceLevelIndicatorProps> = ({ experienceLevel }) => {
    // If no experience level is set, don't render
    if (!experienceLevel) return null;

    // Map experience level to display label and description
    const experienceLabels = {
        [ExperienceLevel.BEGINNER]: {
            label: 'Beginner',
            description: 'You\'re new to structured fitness training'
        },
        [ExperienceLevel.INTERMEDIATE]: {
            label: 'Intermediate',
            description: 'You have some experience with regular workouts'
        },
        [ExperienceLevel.ADVANCED]: {
            label: 'Advanced',
            description: 'You have significant training experience and knowledge'
        }
    };

    // Get the label and description for the current experience level
    const { label, description } = experienceLabels[experienceLevel as ExperienceLevel] || {
        label: 'Unknown',
        description: 'Experience level not recognized'
    };

    return (
        <div className="experience-level-indicator">
            <div className="indicator-icon">
                <Layers size={16} />
            </div>
            <div className="indicator-content">
                <div className="indicator-label">Your Experience Level</div>
                <div className="indicator-value">{label}</div>
                <div className="indicator-description">{description}</div>
            </div>
        </div>
    );
};

export default ExperienceLevelIndicator; 
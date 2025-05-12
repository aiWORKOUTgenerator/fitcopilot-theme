import { Check } from 'lucide-react';
import React from 'react';
import './ProgressIndicator.scss';
import { ProgressIndicatorProps } from './types';

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
    completedSections,
    totalSections,
    sectionLabels = {},
    variant = 'default',
    showLabels = false,
    accentColor = 'purple',
    className = '',
    onSectionClick
}) => {
    // Ensure we never report more completed sections than total sections
    const validCompletedSections = completedSections.slice(0, totalSections);
    const completionCount = Math.min(validCompletedSections.length, totalSections);
    const completionPercentage = Math.min((completionCount / totalSections) * 100, 100);

    // Handle variant-specific configurations
    // _isCompact will be used in the future compact variant implementation 
    // planned in the CompletionContext integration
    const _isCompact = variant === 'compact';
    const isDetailed = variant === 'detailed';

    // Get appropriate class names based on variant and accent color
    const progressContainerClass = `progress-indicator ${variant} accent-${accentColor} ${className}`;

    return (
        <div className={progressContainerClass}>
            {showLabels && (
                <div className="progress-summary">
                    <span className="progress-label">
                        {completionCount} of {totalSections} sections complete
                    </span>
                    <span className="progress-percentage">
                        {Math.round(completionPercentage)}%
                    </span>
                </div>
            )}

            <div className="progress-bar">
                <div
                    className="progress-fill"
                    style={{ width: `${completionPercentage}%` }}
                    role="progressbar"
                    aria-valuenow={completionPercentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                />
            </div>

            {isDetailed && (
                <div className="section-indicators">
                    {[...Array(totalSections)].map((_, index) => {
                        const sectionId = Object.keys(sectionLabels)[index] || `section-${index}`;
                        const isCompleted = validCompletedSections.includes(sectionId);

                        return (
                            <div
                                key={sectionId}
                                className={`section-marker ${isCompleted ? 'completed' : ''}`}
                                onClick={() => onSectionClick && onSectionClick(sectionId)}
                                role={onSectionClick ? "button" : undefined}
                                tabIndex={onSectionClick ? 0 : undefined}
                                aria-label={sectionLabels[sectionId] || `Section ${index + 1}`}
                            >
                                {isCompleted && <Check size={12} />}
                                {showLabels && (
                                    <span className="section-label">
                                        {sectionLabels[sectionId] || `Section ${index + 1}`}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ProgressIndicator; 
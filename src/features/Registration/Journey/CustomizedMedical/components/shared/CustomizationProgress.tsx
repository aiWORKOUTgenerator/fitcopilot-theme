import React from 'react';
import { CustomizationProgressProps } from '../../types';
import './CustomizationProgress.scss';

/**
 * Shows the progress of completed customization sections
 */
const CustomizationProgress: React.FC<CustomizationProgressProps> = ({
    completedSections,
    totalSections
}) => {
    // Calculate progress percentage
    const progressPercentage = Math.round((completedSections.length / totalSections) * 100);

    return (
        <div className="customization-progress">
            <p className="progress-text">
                {completedSections.length === 0 ? (
                    'Start customizing your medical profile'
                ) : completedSections.length === totalSections ? (
                    'All sections completed! You can proceed to the next step.'
                ) : (
                    `${completedSections.length} of ${totalSections} sections completed (${progressPercentage}%)`
                )}
            </p>

            <div className="progress-bar">
                <div
                    className="progress-fill"
                    style={{ width: `${progressPercentage}%` }}
                    role="progressbar"
                    aria-valuenow={progressPercentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                ></div>
            </div>
        </div>
    );
};

export default CustomizationProgress; 
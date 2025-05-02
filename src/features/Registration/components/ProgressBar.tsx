import React from 'react';

interface ProgressBarProps {
    progress: number; // 0 to 100
    className?: string;
}

/**
 * Visual progress indicator for the registration flow
 */
const ProgressBar: React.FC<ProgressBarProps> = ({
    progress,
    className = '',
}) => {
    return (
        <div className={`progress-bar ${className}`}>
            <div className="progress-bar__container">
                <div
                    className="progress-bar__fill"
                    style={{ width: `${progress}%` }}
                    role="progressbar"
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                />
            </div>
            <div className="progress-bar__label">
                {Math.round(progress)}% complete
            </div>
        </div>
    );
};

export default ProgressBar; 
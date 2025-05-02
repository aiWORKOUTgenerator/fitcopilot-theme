import React from 'react';

interface ProgressIndicatorProps {
    className?: string;
}

/**
 * Visual indicator of registration steps for the splash page
 */
const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
    className = '',
}) => {
    // Simple representation of the steps
    const steps = [
        { id: 1, name: 'Experience', active: true },
        { id: 2, name: 'Goals', active: false },
        { id: 3, name: 'Equipment', active: false },
        { id: 4, name: 'Time', active: false },
        { id: 5, name: 'Account', active: false },
    ];

    return (
        <div className={`progress-indicator ${className}`}>
            <h4 className="progress-indicator__title">Easy 5-Step Setup</h4>

            <div className="progress-indicator__steps">
                {steps.map((step) => (
                    <div
                        key={step.id}
                        className={`progress-indicator__step ${step.active ? 'progress-indicator__step--active' : ''}`}
                        title={step.name}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProgressIndicator; 
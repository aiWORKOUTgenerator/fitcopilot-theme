import React from 'react';

interface SectionTitleProps {
    title: string;
    subtitle?: string;
    className?: string;
}

/**
 * Standardized section title component for registration steps
 */
const SectionTitle: React.FC<SectionTitleProps> = ({
    title,
    subtitle,
    className = '',
}) => {
    return (
        <div className={`section-title ${className}`}>
            <h2 className="registration-step__title">{title}</h2>
            {subtitle && <p className="registration-step__subtitle">{subtitle}</p>}
        </div>
    );
};

export default SectionTitle; 
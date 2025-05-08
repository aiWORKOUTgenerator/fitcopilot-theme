import { ChevronRight } from 'lucide-react';
import React from 'react';
import './ProgramCard.scss';
import { ProgramCardProps } from './types';

/**
 * ProgramCard component for displaying training program information
 * 
 * @param props Component props
 * @returns React component
 */
const ProgramCard: React.FC<ProgramCardProps> = ({
    program,
    isActive = false,
    onToggle,
    variant = 'default',
    className = '',
}) => {
    const cardClasses = `program-card program-card--${variant} ${className} ${isActive ? 'program-card--active' : ''}`;

    return (
        <div
            className={cardClasses}
            onClick={onToggle}
        >
            <div className="program-card__container">
                {/* Program Icon */}
                <div className="program-card__icon-wrapper">
                    <div className={`program-card__icon ${variant === 'default' ? `bg-gradient-to-br ${program.accentColor}` : ''}`}>
                        {program.icon}
                    </div>
                </div>

                {/* Program Information */}
                <div className="program-card__content">
                    <h3 className={`program-card__title ${program.textColor || ''}`}>
                        {program.title}
                    </h3>
                    <p className="program-card__description">
                        {program.description}
                    </p>
                </div>

                {/* Expand/Collapse Button */}
                {variant !== 'sports' && (
                    <div className={`program-card__toggle ${isActive ? 'program-card__toggle--active' : ''}`}>
                        <ChevronRight size={20} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProgramCard; 
import React from 'react';
import { ExperienceLevel } from '../../types';

interface LevelCardProps {
    level: ExperienceLevel;
    title: string;
    description: string;
    icon: React.ReactNode;
    isSelected: boolean;
    onSelect: () => void;
    onFocus: () => void;
    className?: string;
}

/**
 * Individual level selection card component
 */
const LevelCard: React.FC<LevelCardProps> = ({
  level: _level,
  title,
  description,
  icon,
  isSelected,
  onSelect,
  onFocus,
  className = '',
}) => {
  return (
    <div
      className={`level-card ${isSelected ? 'level-card--selected' : ''} ${className}`}
      onClick={onSelect}
      onMouseEnter={onFocus}
      onFocus={onFocus}
      tabIndex={0}
      role="button"
      aria-pressed={isSelected}
      aria-label={`Select ${title} experience level`}
    >
      <div className="level-card__icon">
        {icon}
      </div>
      <h3 className="level-card__title">{title}</h3>
      <p className="level-card__description">{description}</p>
    </div>
  );
};

export default LevelCard; 
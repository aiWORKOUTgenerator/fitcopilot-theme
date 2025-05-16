import { Check } from 'lucide-react';
import React from 'react';
import './SectionCard.scss';

export interface SectionCardProps {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    isSelected: boolean;
    accentColor?: string;
    onToggle: () => void;
    testId?: string;
}

/**
 * A reusable card component for selectors that displays options with selection state
 */
const SectionCard: React.FC<SectionCardProps> = ({
  id,
  title,
  description,
  icon,
  isSelected,
  accentColor = 'lime',
  onToggle,
  testId
}) => {
  return (
    <div
      className={`section-card ${isSelected ? 'selected' : ''} ${accentColor}-accent`}
      onClick={onToggle}
      role="checkbox"
      aria-checked={isSelected}
      tabIndex={0}
      id={id}
      data-testid={testId}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle();
        }
      }}
    >
      <div className={`card-icon ${isSelected ? 'selected' : ''}`}>
        {icon}
        {isSelected && (
          <div className="check-indicator">
            <Check size={12} className="check-icon" />
          </div>
        )}
      </div>
      <div className="card-content">
        <h3 className={`card-title ${isSelected ? 'selected' : ''}`}>{title}</h3>
        <p className="card-description">{description}</p>
      </div>
    </div>
  );
};

export default SectionCard; 
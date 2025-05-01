import React from 'react';
import './FeatureCard.scss';

/**
 * Props for the FeatureCard component
 */
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  gradient?: string;
  demoComponent?: React.ReactNode;
  isActive?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

/**
 * FeatureCard Component
 * 
 * Displays a single feature with an icon, title and description
 */
const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  className = '',
  gradient = '',
  demoComponent = null,
  isActive = false,
  onMouseEnter = () => { },
  onMouseLeave = () => { }
}) => {
  // Using both CSS classes and Tailwind classes for flexibility
  return (
    <div
      className={`feature-card feature-card-tw ${className}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="feature-icon-container feature-icon-container-tw">
        <span className="feature-icon feature-icon-tw">
          {icon}
        </span>
      </div>

      <h3 className="feature-title feature-title-tw">
        {title}
      </h3>

      <p className="feature-description feature-description-tw">
        {description}
      </p>

      {demoComponent && (
        <div className="feature-demo-container">
          {demoComponent}
        </div>
      )}
    </div>
  );
};

export default FeatureCard; 
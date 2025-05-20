import { Dumbbell, Flame, Heart } from 'lucide-react';
import React from 'react';
import './HeroFeaturePills.scss';

// Map of icon names to Lucide components
const iconMap: Record<string, React.ComponentType<any>> = {
  dumbbell: Dumbbell,
  flame: Flame,
  heart: Heart
};

export interface FeatureItem {
  id: string;
  label: string;
  icon?: string;
}

export interface HeroFeaturePillsProps {
  /**
   * Array of feature items to display in pills
   */
  features: FeatureItem[];
  /**
   * Visual style variant for the pills
   */
  variant?: 'primary' | 'secondary' | 'accent';
  /**
   * Size of the feature pills
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Additional CSS class for styling
   */
  className?: string;
  /**
   * Background style - default or blur
   */
  backgroundStyle?: 'default' | 'blur';
}

/**
 * HeroFeaturePills component displays a collection of feature highlights
 * in pill format within the hero section of the homepage.
 */
export const HeroFeaturePills: React.FC<HeroFeaturePillsProps> = ({
  features,
  variant = 'primary',
  size = 'medium',
  className = '',
  backgroundStyle = 'blur'
}) => {
  // Get the correct CSS class based on background style
  const getBackgroundClass = () => {
    if (backgroundStyle === 'blur') {
      return 'hero-feature-pills--blur';
    }
    return '';
  };

  // Get the icon component if it exists in our map
  const getIconComponent = (iconName?: string) => {
    if (!iconName) return null;
    
    const IconComponent = iconMap[iconName.toLowerCase()];
    if (!IconComponent) return null;

    return (
      <span className="hero-feature-pills__icon">
        <IconComponent size={14} />
      </span>
    );
  };

  return (
    <div className={`hero-feature-pills hero-feature-pills--${variant} hero-feature-pills--${size} ${getBackgroundClass()} ${className}`}>
      <div className="hero-feature-pills__list">
        {features.map((feature) => (
          <div key={feature.id} className="hero-feature-pills__item">
            {getIconComponent(feature.icon)}
            <span className="hero-feature-pills__label">{feature.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroFeaturePills; 
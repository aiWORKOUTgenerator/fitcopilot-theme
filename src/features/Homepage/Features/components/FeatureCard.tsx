import { CheckCircle } from 'lucide-react';
import React from 'react';

// Update VariantKey type to match all possible theme variants
type VariantKey = 'default' | 'gym' | 'boutique' | 'modern' | 'wellness' | 'classic' | 'sports' | 'minimalist' | 'registration';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  _gradient: string;
  demoComponent: React.ReactNode;
  _isActive?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  variant?: VariantKey;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  _gradient,
  demoComponent,
  _isActive = false,
  onMouseEnter,
  onMouseLeave,
  variant = 'default',
}) => {
  // Get gradient classes based on variant
  const getGradientClass = () => {
    switch (variant) {
      case 'boutique':
        return 'bg-gradient-to-br from-pink-400/20 to-pink-600/20';
      case 'gym':
        return 'bg-gradient-to-br from-red-400/20 to-red-600/20';
      case 'modern':
        return 'bg-gradient-to-br from-blue-400/20 to-blue-600/20';
      case 'wellness':
        return 'bg-gradient-to-br from-teal-400/20 to-teal-600/20';
      case 'classic':
        return 'bg-gradient-to-br from-amber-400/20 to-amber-600/20';
      case 'sports':
        return 'bg-gradient-to-br from-orange-400/20 to-orange-600/20';
      case 'minimalist':
        return 'bg-gradient-to-br from-gray-400/20 to-gray-600/20';
      case 'registration':
        return 'bg-gradient-to-br from-purple-400/20 to-purple-600/20';
      default:
        return 'bg-gradient-to-br from-lime-300/20 to-emerald-500/20';
    }
  };

  // Get icon color based on variant
  const getIconColor = () => {
    switch (variant) {
      case 'boutique':
        return 'text-pink-400';
      case 'gym':
        return 'text-red-400';
      case 'modern':
        return 'text-blue-400';
      case 'wellness':
        return 'text-teal-400';
      case 'classic':
        return 'text-amber-400';
      case 'sports':
        return 'text-orange-400';
      case 'minimalist':
        return 'text-gray-400';
      case 'registration':
        return 'text-purple-400';
      default:
        return 'text-lime-300';
    }
  };

  // Get hover border and shadow classes for card
  const getCardHoverClass = () => {
    switch (variant) {
      case 'boutique':
        return 'hover:border-pink-400/50 hover:shadow-lg hover:shadow-pink-400/20';
      case 'gym':
        return 'hover:border-red-400/50 hover:shadow-lg hover:shadow-red-400/20';
      case 'modern':
        return 'hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-400/20';
      case 'wellness':
        return 'hover:border-teal-400/50 hover:shadow-lg hover:shadow-teal-400/20';
      case 'classic':
        return 'hover:border-amber-400/50 hover:shadow-lg hover:shadow-amber-400/20';
      case 'sports':
        return 'hover:border-orange-400/50 hover:shadow-lg hover:shadow-orange-400/20';
      case 'minimalist':
        return 'hover:border-gray-400/50 hover:shadow-lg hover:shadow-gray-400/20';
      case 'registration':
        return 'hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-400/20';
      default:
        return 'hover:border-lime-300/50 hover:shadow-lg hover:shadow-lime-300/20';
    }
  };

  // Get hover text color class
  const getTitleHoverClass = () => {
    switch (variant) {
      case 'boutique':
        return 'group-hover:text-pink-400';
      case 'gym':
        return 'group-hover:text-red-400';
      case 'modern':
        return 'group-hover:text-blue-400';
      case 'wellness':
        return 'group-hover:text-teal-400';
      case 'classic':
        return 'group-hover:text-amber-400';
      case 'sports':
        return 'group-hover:text-orange-400';
      case 'minimalist':
        return 'group-hover:text-gray-400';
      case 'registration':
        return 'group-hover:text-purple-400';
      default:
        return 'group-hover:text-lime-300';
    }
  };

  // Get hover badge class
  const getBadgeHoverClass = () => {
    switch (variant) {
      case 'boutique':
        return 'group-hover:bg-pink-400/20';
      case 'gym':
        return 'group-hover:bg-red-400/20';
      case 'modern':
        return 'group-hover:bg-blue-400/20';
      case 'wellness':
        return 'group-hover:bg-teal-400/20';
      case 'classic':
        return 'group-hover:bg-amber-400/20';
      case 'sports':
        return 'group-hover:bg-orange-400/20';
      case 'minimalist':
        return 'group-hover:bg-gray-400/20';
      case 'registration':
        return 'group-hover:bg-purple-400/20';
      default:
        return 'group-hover:bg-lime-300/20';
    }
  };

  // Get badge style
  const getBadgeStyle = () => {
    switch (variant) {
      case 'boutique':
        return { color: 'rgb(244, 114, 182)' }; // pink-400
      case 'gym':
        return { color: 'rgb(248, 113, 113)' }; // red-400
      case 'modern':
        return { color: 'rgb(96, 165, 250)' }; // blue-400
      case 'wellness':
        return { color: 'rgb(45, 212, 191)' }; // teal-400
      case 'classic':
        return { color: 'rgb(251, 191, 36)' }; // amber-400
      case 'sports':
        return { color: 'rgb(249, 115, 22)' }; // orange-400
      case 'minimalist':
        return { color: 'rgb(156, 163, 175)' }; // gray-400
      case 'registration':
        return { color: 'rgb(192, 132, 252)' }; // purple-400
      default:
        return { color: 'rgb(163, 230, 53)' }; // lime-300
    }
  };

  // Get accent color for back card border and shadow
  const getAccentColor = () => {
    switch (variant) {
      case 'boutique':
        return 'rgb(244, 114, 182)'; // pink-400
      case 'gym':
        return 'rgb(248, 113, 113)'; // red-400
      case 'modern':
        return 'rgb(96, 165, 250)'; // blue-400
      case 'wellness':
        return 'rgb(45, 212, 191)'; // teal-400
      case 'classic':
        return 'rgb(251, 191, 36)'; // amber-400
      case 'sports':
        return 'rgb(249, 115, 22)'; // orange-400
      case 'minimalist':
        return 'rgb(156, 163, 175)'; // gray-400
      case 'registration':
        return 'rgb(192, 132, 252)'; // purple-400
      default:
        return 'rgb(163, 230, 53)'; // lime-300
    }
  };

  const gradientClass = getGradientClass();
  const iconColor = getIconColor();
  const cardHoverClass = getCardHoverClass();
  const titleHoverClass = getTitleHoverClass();
  const badgeHoverClass = getBadgeHoverClass();
  const badgeStyle = getBadgeStyle();
  const accentColor = getAccentColor();

  return (
    <div
      className="flip-card h-96"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      data-theme-variant={variant}
    >
      <div className="flip-card-inner w-full h-full">
        {/* Front of card - styled to match the original version */}
        <div
          className={`flip-card-front absolute w-full h-full group flex flex-col items-center justify-center p-8 rounded-2xl bg-gray-800/70 backdrop-blur-lg border border-gray-700 transition-all duration-500 ${cardHoverClass}`}
        >
          {/* Feature icon container - icon now directly inside container */}
          <div
            className={`h-24 w-24 rounded-2xl mb-6 mx-auto flex items-center justify-center ${gradientClass}`}
          >
            {React.cloneElement(icon as React.ReactElement, {
              size: 48,
              strokeWidth: 1.5,
              className: `${iconColor} group-hover:scale-110 transition-transform duration-300`
            })}
          </div>

          {/* Feature title */}
          <h3
            className={`text-white text-xl font-bold mb-4 transition-colors duration-300 ${titleHoverClass}`}
          >
            {title}
          </h3>

          {/* Feature description */}
          <p
            className="text-gray-400 text-center transition-colors duration-300 group-hover:text-gray-300"
          >
            {description}
          </p>

          {/* Hover badge */}
          <div className="mt-6">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-700/50 transition-colors duration-300 ${badgeHoverClass}`}
              style={badgeStyle}
            >
              Hover to Preview
            </span>
          </div>
        </div>

        {/* Back of card (demo) - styled to match the original version */}
        <div
          className="flip-card-back absolute w-full h-full backdrop-blur-lg rounded-2xl p-6 flex flex-col"
          style={{
            backgroundColor: 'rgba(31, 41, 55, 0.9)',
            borderColor: accentColor,
            borderWidth: '1px',
            borderStyle: 'solid',
            boxShadow: `0 10px 25px -5px ${accentColor.replace(/rgb/g, 'rgba').replace(/\)/, ', 0.2)')}`,
          }}
        >
          <h3
            className={`text-lg font-bold mb-3 text-center flex items-center justify-center ${iconColor}`}
          >
            {title} <CheckCircle className="ml-2 animate-pulse" size={20} />
          </h3>
          <div className="flex-1 px-2 relative mb-6">
            {demoComponent}
          </div>
          <div className="text-center mt-auto pt-1">
            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: `${accentColor.replace(/rgb/g, 'rgba').replace(/\)/, ', 0.2)')}`,
                color: accentColor
              }}
            >
              Hover to Flip Back
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard; 